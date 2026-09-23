import os
import json
import logging
import asyncio
from io import BytesIO

from aiohttp import web
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup, InputFile
from telegram.ext import Application, CommandHandler, MessageHandler, ContextTypes, filters

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("bot")

BOT_TOKEN = os.environ["BOT_TOKEN"]
WEBAPP_URL = os.environ.get("WEBAPP_URL", "https://visa_bls_tgbot.shikinn.com/form/index.html")
PORT = int(os.environ.get("PORT", 10000))

ROOT = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(ROOT, "assets")
START_PHOTO = os.path.join(ASSETS, "start.jpg")

# общий Application — веб-API шлёт документы через него
bot_app = None


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    kb = InlineKeyboardMarkup([[
        InlineKeyboardButton("📝 Заполнить анкету", web_app=WebAppInfo(url=WEBAPP_URL))
    ]])
    text = (
        "👋 <b>Шенгенская анкета</b>\n\n"
        "Заполните данные заявителя в удобной мобильной форме.\n"
        "• 9 разделов · 61 поле\n"
        "• автосохранение черновика\n"
        "• даты вводятся с клавиатуры\n"
        "• в конце — готовый JSON\n\n"
        "Нажмите кнопку ниже, чтобы открыть анкету."
    )
    if os.path.isfile(START_PHOTO):
        with open(START_PHOTO, "rb") as f:
            await update.message.reply_photo(
                photo=InputFile(f, filename="start.jpg"),
                caption=text,
                parse_mode="HTML",
                reply_markup=kb,
            )
    else:
        await update.message.reply_text(text, parse_mode="HTML", reply_markup=kb)


async def on_webapp_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    raw = update.effective_message.web_app_data.data
    log.info("web_app_data length=%s", len(raw) if raw else 0)
    try:
        data = json.loads(raw)
        pretty = json.dumps(data, ensure_ascii=False, indent=2)
    except json.JSONDecodeError:
        pretty = raw or ""

    bio = BytesIO(pretty.encode("utf-8"))
    bio.name = "applicant.json"
    await update.message.reply_document(
        document=InputFile(bio, filename="applicant.json"),
        caption="✅ Файл <b>applicant.json</b> — нажмите на него → Сохранить в Файлы.",
        parse_mode="HTML",
    )


async def api_send_json(request: web.Request):
    """Форма POST /api/send-json → бот шлёт document в чат user_id."""
    global bot_app
    if bot_app is None:
        return web.json_response({"ok": False, "error": "bot not ready"}, status=503)

    try:
        body = await request.json()
    except Exception:
        return web.json_response({"ok": False, "error": "bad json"}, status=400)

    user_id = body.get("userId") or body.get("user_id")
    raw = body.get("json") or body.get("text") or ""
    filename = body.get("filename") or "applicant.json"
    if not str(filename).endswith(".json"):
        filename = str(filename) + ".json"

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        return web.json_response({"ok": False, "error": "userId required"}, status=400)

    if not raw:
        return web.json_response({"ok": False, "error": "empty json"}, status=400)

    try:
        data = json.loads(raw) if isinstance(raw, str) else raw
        pretty = json.dumps(data, ensure_ascii=False, indent=2)
    except (TypeError, json.JSONDecodeError):
        pretty = str(raw)

    bio = BytesIO(pretty.encode("utf-8"))
    bio.name = filename

    try:
        await bot_app.bot.send_document(
            chat_id=user_id,
            document=InputFile(bio, filename=filename),
            caption="✅ <b>{}</b> — нажмите файл → Сохранить в Файлы / Поделиться.".format(filename),
            parse_mode="HTML",
        )
    except Exception as e:
        log.exception("send_document failed")
        return web.json_response({"ok": False, "error": str(e)}, status=500)

    return web.json_response({"ok": True})


async def run_bot():
    global bot_app
    bot_app = Application.builder().token(BOT_TOKEN).build()
    bot_app.add_handler(CommandHandler("start", start))
    bot_app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, on_webapp_data))

    await bot_app.initialize()
    await bot_app.start()
    await bot_app.updater.start_polling()
    log.info("Бот запущен (polling)")
    return bot_app


async def run_web():
    app = web.Application()
    form_dir = os.path.join(ROOT, "form")
    assets_dir = os.path.join(ROOT, "assets")
    app.router.add_static("/form/", path=form_dir, show_index=False)
    if os.path.isdir(assets_dir):
        app.router.add_static("/assets/", path=assets_dir, show_index=False)

    async def health(request):
        return web.Response(text="ok")

    app.router.add_get("/", health)
    app.router.add_get("/health", health)
    app.router.add_post("/api/send-json", api_send_json)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", PORT)
    await site.start()
    log.info("Веб-сервер на порту %s", PORT)


async def main():
    await run_web()
    await run_bot()
    await asyncio.Event().wait()


if __name__ == "__main__":
    asyncio.run(main())
