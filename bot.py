import os
import json
import logging
import asyncio

from aiohttp import web
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup, InputFile
from telegram.ext import Application, CommandHandler, MessageHandler, ContextTypes, filters

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("bot")

# Секреты берём из переменных окружения (задаются в Render, а не в коде)
BOT_TOKEN = os.environ["BOT_TOKEN"]
WEBAPP_URL = os.environ.get("WEBAPP_URL", "https://visa_bls_tgbot.shikinn.com/form/index.html")
PORT = int(os.environ.get("PORT", 10000))

ROOT = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(ROOT, "assets")
START_PHOTO = os.path.join(ASSETS, "start.jpg")  # картинка к /start


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
    # Сюда прилетает то, что форма отправила через tg.sendData(...)
    raw = update.effective_message.web_app_data.data
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        data = {"raw": raw}

    log.info("Получены данные анкеты: %s", data)
    await update.message.reply_text(f"Принято: {json.dumps(data, ensure_ascii=False)}")


async def run_bot():
    application = Application.builder().token(BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, on_webapp_data))

    await application.initialize()
    await application.start()
    await application.updater.start_polling()
    log.info("Бот запущен (polling)")
    return application


async def run_web():
    # Отдаём статику формы: /form/… и ассеты: /assets/…
    app = web.Application()
    form_dir = os.path.join(ROOT, "form")
    assets_dir = os.path.join(ROOT, "assets")
    app.router.add_static("/form/", path=form_dir, show_index=False)
    if os.path.isdir(assets_dir):
        app.router.add_static("/assets/", path=assets_dir, show_index=False)

    async def health(request):
        return web.Response(text="ok")

    # / и /health — для health-check (Render и др.)
    app.router.add_get("/", health)
    app.router.add_get("/health", health)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", PORT)
    await site.start()
    log.info("Веб-сервер запущен на порту %s", PORT)


async def main():
    await run_web()
    application = await run_bot()
    # держим процесс живым
    await asyncio.Event().wait()


if __name__ == "__main__":
    asyncio.run(main())
