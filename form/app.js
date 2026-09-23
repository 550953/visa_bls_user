/* Анкета заявителя — общий конфиг и логика */
(function (global) {
  "use strict";

  /* ─── Справочники ─── */
  var COUNTRIES = [
    ["СССР", "USSR"], ["Австралия", "Australia"], ["Австрия", "Austria"], ["Азербайджан", "Azerbaijan"],
    ["Албания", "Albania"], ["Алжир", "Algeria"], ["Ангола", "Angola"], ["Андорра", "Andorra"],
    ["Антигуа и Барбуда", "Antigua and Barbuda"], ["Аргентина", "Argentina"], ["Армения", "Armenia"],
    ["Афганистан", "Afghanistan"], ["Багамы", "Bahamas"], ["Бангладеш", "Bangladesh"], ["Барбадос", "Barbados"],
    ["Бахрейн", "Bahrain"], ["Беларусь", "Belarus"], ["Белиз", "Belize"], ["Бельгия", "Belgium"], ["Бенин", "Benin"],
    ["Болгария", "Bulgaria"], ["Боливия", "Bolivia"], ["Босния и Герцеговина", "Bosnia and Herzegovina"],
    ["Ботсвана", "Botswana"], ["Бразилия", "Brazil"], ["Бруней", "Brunei"], ["Буркина-Фасо", "Burkina Faso"],
    ["Бурунди", "Burundi"], ["Бутан", "Bhutan"], ["Вануату", "Vanuatu"], ["Ватикан", "Vatican City"],
    ["Великобритания", "United Kingdom"], ["Венгрия", "Hungary"], ["Венесуэла", "Venezuela"], ["Вьетнам", "Vietnam"],
    ["Габон", "Gabon"], ["Гаити", "Haiti"], ["Гайана", "Guyana"], ["Гамбия", "Gambia"], ["Гана", "Ghana"],
    ["Гватемала", "Guatemala"], ["Гвинея", "Guinea"], ["Гвинея-Бисау", "Guinea-Bissau"], ["Германия", "Germany"],
    ["Гондурас", "Honduras"], ["Гренада", "Grenada"], ["Греция", "Greece"], ["Грузия", "Georgia"], ["Дания", "Denmark"],
    ["Джибути", "Djibouti"], ["Доминика", "Dominica"], ["Доминиканская Республика", "Dominican Republic"],
    ["Египет", "Egypt"], ["Замбия", "Zambia"], ["Зимбабве", "Zimbabwe"], ["Израиль", "Israel"], ["Индия", "India"],
    ["Индонезия", "Indonesia"], ["Иордания", "Jordan"], ["Ирак", "Iraq"], ["Иран", "Iran"], ["Ирландия", "Ireland"],
    ["Исландия", "Iceland"], ["Испания", "Spain"], ["Италия", "Italy"], ["Йемен", "Yemen"], ["Кабо-Верде", "Cabo Verde"],
    ["Казахстан", "Kazakhstan"], ["Камбоджа", "Cambodia"], ["Камерун", "Cameroon"], ["Канада", "Canada"],
    ["Катар", "Qatar"], ["Кения", "Kenya"], ["Кипр", "Cyprus"], ["Киргизия", "Kyrgyzstan"], ["Кирибати", "Kiribati"],
    ["Китай", "China"], ["Колумбия", "Colombia"], ["Коморы", "Comoros"],
    ["Демократическая Республика Конго", "Democratic Republic of the Congo"],
    ["Республика Конго", "Republic of the Congo"], ["Северная Корея", "North Korea"], ["Южная Корея", "South Korea"],
    ["Косово", "Kosovo"], ["Коста-Рика", "Costa Rica"], ["Кот-д'Ивуар", "Cote d'Ivoire"], ["Куба", "Cuba"],
    ["Кувейт", "Kuwait"], ["Лаос", "Laos"], ["Латвия", "Latvia"], ["Лесото", "Lesotho"], ["Либерия", "Liberia"],
    ["Ливан", "Lebanon"], ["Ливия", "Libya"], ["Литва", "Lithuania"], ["Лихтенштейн", "Liechtenstein"],
    ["Люксембург", "Luxembourg"], ["Маврикий", "Mauritius"], ["Мавритания", "Mauritania"], ["Мадагаскар", "Madagascar"],
    ["Малави", "Malawi"], ["Малайзия", "Malaysia"], ["Мали", "Mali"], ["Мальдивы", "Maldives"], ["Мальта", "Malta"],
    ["Марокко", "Morocco"], ["Маршалловы острова", "Marshall Islands"], ["Мексика", "Mexico"],
    ["Мозамбик", "Mozambique"], ["Молдова", "Moldova"], ["Монако", "Monaco"], ["Монголия", "Mongolia"],
    ["Мьянма", "Myanmar"], ["Намибия", "Namibia"], ["Науру", "Nauru"], ["Непал", "Nepal"], ["Нигер", "Niger"],
    ["Нигерия", "Nigeria"], ["Нидерланды", "Netherlands"], ["Никарагуа", "Nicaragua"], ["Новая Зеландия", "New Zealand"],
    ["Норвегия", "Norway"], ["ОАЭ", "United Arab Emirates"], ["Оман", "Oman"], ["Пакистан", "Pakistan"],
    ["Палау", "Palau"], ["Палестина", "Palestine"], ["Панама", "Panama"], ["Папуа — Новая Гвинея", "Papua New Guinea"],
    ["Парагвай", "Paraguay"], ["Перу", "Peru"], ["Польша", "Poland"], ["Португалия", "Portugal"],
    ["Россия / Российская Федерация", "Russian Federation"], ["Руанда", "Rwanda"], ["Румыния", "Romania"],
    ["Сальвадор", "El Salvador"], ["Самоа", "Samoa"], ["Сан-Марино", "San Marino"],
    ["Сан-Томе и Принсипи", "Sao Tome and Principe"], ["Саудовская Аравия", "Saudi Arabia"],
    ["Свазиленд (Эсватини)", "Eswatini"], ["Северная Македония", "North Macedonia"], ["Сенегал", "Senegal"],
    ["Сент-Винсент и Гренадины", "Saint Vincent and the Grenadines"], ["Сент-Китс и Невис", "Saint Kitts and Nevis"],
    ["Сент-Люсия", "Saint Lucia"], ["Сербия", "Serbia"], ["Сейшелы", "Seychelles"], ["Сингапур", "Singapore"],
    ["Сирия", "Syria"], ["Словакия", "Slovakia"], ["Словения", "Slovenia"], ["Соломоновы острова", "Solomon Islands"],
    ["Сомали", "Somalia"], ["Судан", "Sudan"], ["Южный Судан", "South Sudan"], ["США", "United States"],
    ["Сьерра-Леоне", "Sierra Leone"], ["Таджикистан", "Tajikistan"], ["Таиланд", "Thailand"], ["Тайвань", "Taiwan"],
    ["Танзания", "Tanzania"], ["Того", "Togo"], ["Тонга", "Tonga"], ["Тринидад и Тобаго", "Trinidad and Tobago"],
    ["Тувалу", "Tuvalu"], ["Тунис", "Tunisia"], ["Туркменистан", "Turkmenistan"], ["Турция", "Turkey"],
    ["Уганда", "Uganda"], ["Узбекистан", "Uzbekistan"], ["Украина", "Ukraine"], ["Уругвай", "Uruguay"], ["Фиджи", "Fiji"],
    ["Филиппины", "Philippines"], ["Финляндия", "Finland"], ["Франция", "France"], ["Хорватия", "Croatia"],
    ["ЦАР", "Central African Republic"], ["Чад", "Chad"], ["Черногория", "Montenegro"], ["Чехия", "Czechia"],
    ["Чили", "Chile"], ["Швейцария", "Switzerland"], ["Швеция", "Sweden"], ["Шри-Ланка", "Sri Lanka"],
    ["Эквадор", "Ecuador"], ["Экваториальная Гвинея", "Equatorial Guinea"], ["Эритрея", "Eritrea"],
    ["Эстония", "Estonia"], ["Эфиопия", "Ethiopia"], ["ЮАР", "South Africa"], ["Ямайка", "Jamaica"], ["Япония", "Japan"]
  ].sort(function (a, b) { return a[0].localeCompare(b[0], "ru"); });

  // Россия и СССР — в начале списка (удобнее для анкеты)
  (function pinTop() {
    var pin = ["Russian Federation", "USSR"];
    var top = [], rest = [];
    COUNTRIES.forEach(function (p) {
      if (pin.indexOf(p[1]) !== -1) top.push(p);
      else rest.push(p);
    });
    top.sort(function (a, b) {
      return pin.indexOf(a[1]) - pin.indexOf(b[1]);
    });
    COUNTRIES = top.concat(rest);
  })();

  var SCHENGEN = [
    ["Австрия", "Austria"], ["Бельгия", "Belgium"], ["Болгария", "Bulgaria"], ["Венгрия", "Hungary"],
    ["Германия", "Germany"], ["Греция", "Greece"], ["Дания", "Denmark"], ["Исландия", "Iceland"],
    ["Испания", "Spain"], ["Италия", "Italy"], ["Латвия", "Latvia"], ["Литва", "Lithuania"],
    ["Лихтенштейн", "Liechtenstein"], ["Люксембург", "Luxembourg"], ["Мальта", "Malta"], ["Нидерланды", "Netherlands"],
    ["Норвегия", "Norway"], ["Польша", "Poland"], ["Португалия", "Portugal"], ["Румыния", "Romania"],
    ["Словакия", "Slovakia"], ["Словения", "Slovenia"], ["Финляндия", "Finland"], ["Франция", "France"],
    ["Хорватия", "Croatia"], ["Чехия", "Czechia"], ["Швейцария", "Switzerland"], ["Швеция", "Sweden"], ["Эстония", "Estonia"]
  ].sort(function (a, b) { return a[0].localeCompare(b[0], "ru"); });

  var ENUMS = {
    gender: [["Мужской", "Male"], ["Женский", "Female"]],
    marital: [
      ["Не в браке", "Single"], ["Женат / замужем", "Married"], ["Раздельное проживание", "Separated"],
      ["Разведён(а)", "Divorced"], ["Вдовец / вдова", "Widowed"], ["Зарегистрированное партнёрство", "Registered Partnership"]
    ],
    passportType: [
      ["Обычный паспорт", "Ordinary Passport"], ["Дипломатический паспорт", "Diplomatic Passport"],
      ["Служебный паспорт", "Service Passport"], ["Официальный паспорт", "Official Passport"],
      ["Специальный паспорт", "Special Passport"], ["Иной проездной документ", "Other Travel Document"]
    ],
    entries: [
      ["Однократный въезд", "Single Entry"], ["Двукратный въезд", "Two Entries"], ["Многократный въезд", "Multiple Entry"]
    ],
    purpose: [
      ["Туризм", "Tourism"], ["Бизнес", "Business"], ["Визит к родственникам/друзьям", "Visiting family or friends"],
      ["Культурная поездка", "Cultural"], ["Спорт", "Sports"], ["Официальный визит", "Official visit"],
      ["Лечение", "Medical reasons"], ["Учёба", "Study"], ["Транзит в аэропорту", "Airport transit"]
    ],
    cost: [
      ["Оплачивает сам заявитель", "By Applicant"],
      ["Оплачивает спонсор (принимающая сторона)", "By a Sponsor"],
      ["Оплачивает приглашающее лицо", "By an Inviting Person"]
    ],
    support: [
      ["Наличные", "Cash"], ["Банковская карта", "Credit Card"], ["Оплаченное проживание", "Prepaid Accommodation"],
      ["Оплаченный проезд", "Prepaid Transport"], ["Все расходы покрыты", "All expenses covered"]
    ],
    relation: [
      ["Супруг(а)", "Spouse"], ["Ребёнок", "Child"], ["Внук / внучка", "Grandchild"],
      ["Родитель", "Parent"], ["Дед / бабушка", "Grandparent"]
    ]
  };

  function T(key, label, opts) {
    opts = opts || {};
    return {
      key: key, label: label, type: opts.type || "text", required: !!opts.required,
      latin: !!opts.latin, tel: !!opts.tel, email: !!opts.email, hint: opts.hint || "",
      options: opts.options || null, group: opts.group, placeholder: opts.placeholder || ""
    };
  }

  var FIELDS = [
    /* g1 Личные данные — 11 */
    T("FirstName", "Имя (как в загранпаспорте)", { required: true, latin: true, group: "g1", placeholder: "IVAN" }),
    T("SurName", "Фамилия (текущая)", { required: true, latin: true, group: "g1", placeholder: "IVANOV" }),
    T("SurnameAtBirth", "Фамилия при рождении", { required: true, latin: true, group: "g1", hint: "Если не менялась — продублируйте текущую", placeholder: "IVANOV" }),
    T("LastName", "Второе поле фамилии (если нужно)", { required: false, latin: true, group: "g1" }),
    T("DateOfBirth", "Дата рождения", { required: true, type: "date", group: "g1" }),
    T("PlaceOfBirth", "Место рождения (город)", { required: true, latin: true, group: "g1", placeholder: "MOSCOW" }),
    T("CountryOfBirthId", "Страна рождения", { required: true, type: "select-country", group: "g1" }),
    T("NationalityId", "Гражданство (текущее)", { required: true, type: "select-country", group: "g1" }),
    T("NationalityAtBirthId", "Гражданство при рождении", { required: true, type: "select-country", group: "g1" }),
    T("GenderId", "Пол", { required: true, type: "select-enum", options: ENUMS.gender, group: "g1" }),
    T("MaritalStatusId", "Семейное положение", { required: true, type: "select-enum", options: ENUMS.marital, group: "g1" }),

    /* g2 Паспорт — 8 */
    T("NationalIdentityNumber", "Номер национального ID (если есть)", { required: false, group: "g2", hint: "Оставьте пустым, если не применимо" }),
    T("PassportType", "Тип паспорта", { required: true, type: "select-enum", options: ENUMS.passportType, group: "g2" }),
    T("PassportNo", "Номер загранпаспорта", { required: true, latin: true, group: "g2", placeholder: "766250892" }),
    T("IssueDate", "Дата выдачи паспорта", { required: true, type: "date", group: "g2" }),
    T("ExpiryDate", "Дата окончания срока действия", { required: true, type: "date", group: "g2" }),
    T("IssuePlace", "Кем/где выдан", { required: true, latin: true, group: "g2", placeholder: "RUSSIAN FEDERATION" }),
    T("IssueCountryId", "Страна выдачи паспорта", { required: true, type: "select-country", group: "g2" }),
    T("TravelDate", "Дата поездки", { required: true, type: "date", group: "g2", hint: "Обычно совпадает с датой прибытия" }),

    /* g3 Адрес — 6 */
    T("HomeAddressLine1", "Адрес проживания, строка 1", { required: true, latin: true, group: "g3", placeholder: "ARBAT STREET 12" }),
    T("HomeAddressLine2", "Адрес проживания, строка 2", { required: false, latin: true, group: "g3", hint: "Квартира/офис — необязательно" }),
    T("HomeAddressCountryId", "Страна проживания", { required: true, type: "select-country", group: "g3" }),
    T("HomeAddressCity", "Город проживания", { required: true, latin: true, group: "g3", placeholder: "MOSCOW" }),
    T("HomeAddressPostalCode", "Почтовый индекс", { required: true, group: "g3", placeholder: "101000" }),
    T("HomeAddressContactNumber", "Контактный телефон", { required: true, tel: true, group: "g3", hint: "Код страны без «+», только цифры", placeholder: "79991234567" }),

    /* g4 Работа — 4 */
    T("EmployerName", "Название работодателя", { required: true, latin: true, group: "g4" }),
    T("EmployerPhone", "Телефон работодателя", { required: true, tel: true, group: "g4", hint: "Код страны без «+», только цифры" }),
    T("EmployerAddress", "Адрес работодателя", { required: true, latin: true, group: "g4" }),
    T("CurrentOccupationId", "Должность / род занятий", { required: true, latin: true, group: "g4", placeholder: "MANAGER" }),

    /* g5 Поездка — 9 */
    T("PurposeOfJourneyId", "Цель поездки", { required: true, type: "select-enum", options: ENUMS.purpose, group: "g5" }),
    T("MemberStateDestinationId", "Страна назначения", { required: true, type: "select-schengen", group: "g5" }),
    T("MemberStateSecondDestinationId", "Вторая страна назначения", { required: false, type: "select-schengen", group: "g5" }),
    T("MemberStateFirstEntryId", "Страна первого въезда", { required: true, type: "select-schengen", group: "g5" }),
    T("NumberOfEntriesRequested", "Количество запрашиваемых въездов", { required: true, type: "select-enum", options: ENUMS.entries, group: "g5" }),
    T("IntendedStayDuration", "Продолжительность пребывания, дней", { required: true, type: "number", group: "g5" }),
    T("IntendedDateOfArrival", "Предполагаемая дата прибытия", { required: true, type: "date", group: "g5" }),
    T("IntendedDateOfDeparture", "Предполагаемая дата выезда", { required: true, type: "date", group: "g5" }),
    T("FinalDestinationIssuedByCountryId", "Страна выдачи разрешения (транзит)", { required: false, type: "select-country", group: "g5", hint: "Только при транзите в третью страну" }),

    /* g6 Принимающая сторона — 7 */
    T("InvitingAuthorityName", "Название отеля / организации", { required: true, latin: true, group: "g6" }),
    T("InvitingCountryId", "Страна", { required: true, type: "select-country", group: "g6" }),
    T("InvitingCity", "Город", { required: true, latin: true, group: "g6" }),
    T("InvitingZipCode", "Почтовый индекс", { required: true, group: "g6" }),
    T("InvitingAddress", "Адрес", { required: true, latin: true, group: "g6" }),
    T("InvitingEmail", "Email", { required: true, email: true, group: "g6" }),
    T("InvitingContactNo", "Телефон", { required: true, tel: true, group: "g6", hint: "Код страны без «+», только цифры" }),

    /* g7 Контакт принимающей — 8 */
    T("InvitingContactName", "Имя контактного лица", { required: true, latin: true, group: "g7" }),
    T("InvitingContactSurname", "Фамилия контактного лица", { required: true, latin: true, group: "g7" }),
    T("InvitingContactCountryId", "Страна", { required: true, type: "select-country", group: "g7" }),
    T("InvitingContactCity", "Город", { required: true, latin: true, group: "g7" }),
    T("InvitingContactZipCode", "Почтовый индекс", { required: true, group: "g7" }),
    T("InvitingContactAddress", "Адрес", { required: true, latin: true, group: "g7" }),
    T("InvitingContactEmail", "Email", { required: true, email: true, group: "g7" }),
    T("InvitingContactContactNo", "Телефон", { required: true, tel: true, group: "g7", hint: "Код страны без «+», только цифры" }),

    /* g8 Финансы — 2 */
    T("CostCoveredById", "Кто оплачивает расходы", { required: true, type: "select-enum", options: ENUMS.cost, group: "g8" }),
    T("MeansOfSupportId", "Средства к существованию", { required: true, type: "select-enum", options: ENUMS.support, group: "g8" }),

    /* g9 Родственник — 6 (опционально) */
    T("OtherCitizenSurname", "Фамилия родственника", { required: false, latin: true, group: "g9" }),
    T("OtherCitizenFirstName", "Имя родственника", { required: false, latin: true, group: "g9" }),
    T("OtherCitizenDateOfBirth", "Дата рождения родственника", { required: false, type: "date", group: "g9" }),
    T("OtherCitizenDocumentNumber", "Номер документа родственника", { required: false, latin: true, group: "g9" }),
    T("OtherCitizenNationalityId", "Гражданство родственника", { required: false, type: "select-country", group: "g9" }),
    T("OtherCitizenFamilyRelationshipId", "Степень родства", { required: false, type: "select-enum", options: ENUMS.relation, group: "g9" })
  ];

  var KEY_ORDER = FIELDS.map(function (f) { return f.key; });

  var GROUPS = [
    { id: "g1", title: "Личные данные", optional: false },
    { id: "g2", title: "Паспорт", optional: false },
    { id: "g3", title: "Адрес и контакты", optional: false },
    { id: "g4", title: "Работодатель", optional: false },
    { id: "g5", title: "Поездка", optional: false },
    { id: "g6", title: "Принимающая сторона", optional: false },
    { id: "g7", title: "Контакт (принимающей)", optional: false },
    { id: "g8", title: "Финансы", optional: false },
    { id: "g9", title: "Родственник (ЕС/ЕЭЗ)", optional: true }
  ];

  var STORAGE_KEY = "schengen_form_mobile_v1";
  var LATIN_RE = /^[A-Za-z0-9 .,'\-\/№()]*$/;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ─── Storage ─── */
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { values: {}, otherValues: {}, toggleG9: false };
      var data = JSON.parse(raw);
      return {
        values: data.values || {},
        otherValues: data.otherValues || {},
        toggleG9: !!data.toggleG9
      };
    } catch (e) {
      return { values: {}, otherValues: {}, toggleG9: false };
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        values: state.values || {},
        otherValues: state.otherValues || {},
        toggleG9: !!state.toggleG9
      }));
    } catch (e) {}
  }

  function clearState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  /* ─── Helpers ─── */
  function getFieldsOf(gid) {
    return FIELDS.filter(function (f) { return f.group === gid; });
  }

  function countFilled(state, gid) {
    var fs = getFieldsOf(gid);
    var req = fs.filter(function (f) { return f.required; });
    var done = req.filter(function (f) {
      return !!(state.values[f.key] || "").trim();
    }).length;
    return { done: done, total: req.length };
  }

  function totalProgress(state) {
    var total = 0, done = 0;
    FIELDS.forEach(function (f) {
      if (!f.required) return;
      if (f.group === "g9" && !state.toggleG9) return;
      total++;
      if ((state.values[f.key] || "").trim()) done++;
    });
    return { done: done, total: total };
  }

  /* ─── Validation ─── */
  function validateAll(state) {
    var errors = [];
    var out = {};

    FIELDS.forEach(function (f) {
      var visible = f.group !== "g9" || state.toggleG9;
      var v = visible ? (state.values[f.key] || "").trim() : "";
      out[f.key] = v;

      if (!visible) return;
      if (f.required && !v) {
        errors.push({ key: f.key, msg: f.label + " — обязательное поле", group: f.group });
        return;
      }
      if (!v) return;
      if (f.latin && !LATIN_RE.test(v)) {
        errors.push({ key: f.key, msg: f.label + " — нужна латиница", group: f.group });
      }
      if (f.email && !EMAIL_RE.test(v)) {
        errors.push({ key: f.key, msg: f.label + " — некорректный email", group: f.group });
      }
      if (f.tel && !/^[0-9]{5,15}$/.test(v)) {
        errors.push({ key: f.key, msg: f.label + " — только цифры, 5–15 знаков", group: f.group });
      }
      if (f.type === "number") {
        var n = parseInt(v, 10);
        if (isNaN(n) || n < 1) {
          errors.push({ key: f.key, msg: f.label + " — число > 0", group: f.group });
        }
      }
    });

    function d(k) {
      var v = out[k];
      return v ? new Date(v + "T00:00:00") : null;
    }
    var dob = d("DateOfBirth");
    if (dob && dob.getTime() > Date.now()) {
      errors.push({ key: "DateOfBirth", msg: "Дата рождения не может быть в будущем", group: "g1" });
    }
    var iss = d("IssueDate"), exp = d("ExpiryDate");
    if (iss && exp && exp <= iss) {
      errors.push({ key: "ExpiryDate", msg: "Срок действия должен быть позже выдачи", group: "g2" });
    }
    var arr = d("IntendedDateOfArrival"), dep = d("IntendedDateOfDeparture");
    if (arr && dep && dep <= arr) {
      errors.push({ key: "IntendedDateOfDeparture", msg: "Дата выезда позже прибытия", group: "g5" });
    }

    return { errors: errors, values: out };
  }

  function buildJson(state) {
    var res = validateAll(state);
    if (res.errors.length) return { ok: false, errors: res.errors };
    var ordered = {};
    KEY_ORDER.forEach(function (k) { ordered[k] = res.values[k] || ""; });
    return { ok: true, json: ordered, str: JSON.stringify(ordered, null, 2) };
  }

  /* ─── UI helpers ─── */
  function showToast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t.__t);
    t.__t = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  function isMobileLike() {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
      || (navigator.maxTouchPoints > 1 && window.innerWidth < 900);
  }

  /**
   * Сохранить JSON. На телефоне сначала пробуем «Поделиться» (Файлы / Telegram / Диск),
   * иначе — обычная загрузка в Загрузки браузера.
   * @returns {Promise<"share"|"download">}
   */
  function downloadBlob(text, filename) {
    var blob = new Blob([text], { type: "application/json" });
    var file;

    function classicDownload() {
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      return "download";
    }

    try {
      file = new File([blob], filename, { type: "application/json" });
    } catch (e) {
      return Promise.resolve(classicDownload());
    }

    // Web Share API с файлом — удобно на iOS/Android
    if (navigator.share && navigator.canShare) {
      try {
        if (navigator.canShare({ files: [file] })) {
          return navigator.share({
            files: [file],
            title: filename,
            text: "Анкета JSON"
          }).then(function () {
            return "share";
          }).catch(function (err) {
            // пользователь отменил — не считаем ошибкой, fallback не нужен
            if (err && (err.name === "AbortError" || err.name === "NotAllowedError")) {
              return "share-cancel";
            }
            return classicDownload();
          });
        }
      } catch (e) {}
    }

    return Promise.resolve(classicDownload());
  }

  function downloadHintMessage(mode, filename) {
    if (mode === "share") {
      return "Выберите «Сохранить в Файлы» или отправьте себе в Telegram / на почту";
    }
    if (mode === "share-cancel") {
      return "Отменено";
    }
    if (isMobileLike()) {
      return "Файл «" + filename + "» — папка «Загрузки» или уведомление браузера сверху";
    }
    return "Файл «" + filename + "» сохранён в папку загрузок";
  }

  function copyText(txt, btn) {
    function done(ok) {
      if (!btn) return;
      var old = btn.textContent;
      btn.textContent = ok ? "Скопировано ✓" : "Ошибка";
      setTimeout(function () { btn.textContent = old; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { done(true); }).catch(function () { done(false); });
    } else {
      try {
        var ta = document.createElement("textarea");
        ta.value = txt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        done(true);
      } catch (e) { done(false); }
    }
  }

  /* ─── Render field ─── */
  function renderField(f, state, onChange) {
    var wrap = document.createElement("div");
    wrap.className = "field";
    wrap.id = "field-" + f.key;

    var lab = document.createElement("label");
    lab.setAttribute("for", f.key);
    lab.textContent = f.label;
    if (f.required) {
      var star = document.createElement("span");
      star.className = "req";
      star.textContent = " *";
      lab.appendChild(star);
    }
    wrap.appendChild(lab);

    var input;
    var val = state.values[f.key] || "";

    if (f.type === "select-country" || f.type === "select-schengen" || f.type === "select-enum") {
      input = document.createElement("select");
      input.id = f.key;
      var pairs = f.type === "select-country" ? COUNTRIES : (f.type === "select-schengen" ? SCHENGEN : f.options);
      var opt0 = document.createElement("option");
      opt0.value = "";
      opt0.textContent = "— выбрать —";
      input.appendChild(opt0);
      pairs.forEach(function (p) {
        var o = document.createElement("option");
        o.value = p[1];
        o.textContent = p[0] + " — " + p[1];
        input.appendChild(o);
      });
      var oo = document.createElement("option");
      oo.value = "__OTHER__";
      oo.textContent = "Другое (ввести вручную)";
      input.appendChild(oo);

      var isOther = false;
      if (val) {
        var found = false;
        for (var i = 0; i < input.options.length; i++) {
          if (input.options[i].value === val) { found = true; break; }
        }
        if (found) {
          input.value = val;
        } else {
          input.value = "__OTHER__";
          isOther = true;
        }
      }
      wrap.appendChild(input);

      var other = document.createElement("input");
      other.type = "text";
      other.className = "other-input";
      other.id = f.key + "_other";
      other.placeholder = "Точное значение (латиницей)";
      if (isOther) {
        other.value = val;
        other.classList.add("show");
      }
      wrap.appendChild(other);

      input.addEventListener("change", function () {
        other.classList.toggle("show", input.value === "__OTHER__");
        if (input.value === "__OTHER__") {
          state.values[f.key] = other.value.trim();
          state.otherValues[f.key] = other.value;
        } else {
          state.values[f.key] = input.value;
          state.otherValues[f.key] = "";
          other.value = "";
        }
        clearErr(f.key);
        if (onChange) onChange();
      });
      other.addEventListener("input", function () {
        state.otherValues[f.key] = other.value;
        state.values[f.key] = other.value.trim();
        clearErr(f.key);
        if (onChange) onChange();
      });
    } else if (f.type === "date") {
      var row = document.createElement("div");
      row.className = "date-row";

      var parts = { d: "", m: "", y: "" };
      if (val && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        var sp = val.split("-");
        parts.y = sp[0];
        parts.m = sp[1];
        parts.d = sp[2];
      }

      function makePart(name, maxLen, placeholder) {
        var inp = document.createElement("input");
        inp.type = "text";
        inp.inputMode = "numeric";
        inp.maxLength = maxLen;
        inp.placeholder = placeholder;
        inp.className = "date-part date-" + name;
        inp.id = f.key + "_" + name;
        inp.value = parts[name] || "";
        inp.setAttribute("autocomplete", "off");
        inp.addEventListener("input", function () {
          inp.value = inp.value.replace(/\D/g, "").slice(0, maxLen);
          if (inp.value.length === maxLen) {
            var next = name === "d" ? row.querySelector(".date-m")
                     : name === "m" ? row.querySelector(".date-y") : null;
            if (next) next.focus();
          }
          syncDate();
        });
        inp.addEventListener("keydown", function (e) {
          if (e.key === "Backspace" && inp.value === "") {
            var prev = name === "m" ? row.querySelector(".date-d")
                     : name === "y" ? row.querySelector(".date-m") : null;
            if (prev) {
              e.preventDefault();
              prev.focus();
              prev.setSelectionRange(prev.value.length, prev.value.length);
            }
          }
        });
        return inp;
      }

      function syncDate() {
        var dEl = row.querySelector(".date-d");
        var mEl = row.querySelector(".date-m");
        var yEl = row.querySelector(".date-y");
        var d = dEl.value, m = mEl.value, y = yEl.value;
        if (d.length === 2 && m.length === 2 && y.length === 4) {
          state.values[f.key] = y + "-" + m + "-" + d;
        } else {
          state.values[f.key] = "";
        }
        if (hidden) hidden.value = state.values[f.key] || "";
        clearErr(f.key);
        if (onChange) onChange();
      }

      row.appendChild(makePart("d", 2, "ДД"));
      var sep1 = document.createElement("span");
      sep1.className = "date-sep";
      sep1.textContent = "·";
      row.appendChild(sep1);
      row.appendChild(makePart("m", 2, "ММ"));
      var sep2 = document.createElement("span");
      sep2.className = "date-sep";
      sep2.textContent = "·";
      row.appendChild(sep2);
      row.appendChild(makePart("y", 4, "ГГГГ"));
      wrap.appendChild(row);

      var hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.id = f.key;
      hidden.value = val || "";
      wrap.appendChild(hidden);
      input = hidden;
    } else if (f.type === "number") {
      input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.id = f.key;
      input.inputMode = "numeric";
      if (val) input.value = val;
      wrap.appendChild(input);
      input.addEventListener("input", function () {
        state.values[f.key] = input.value;
        clearErr(f.key);
        if (onChange) onChange();
      });
    } else {
      input = document.createElement("input");
      input.type = f.email ? "email" : (f.tel ? "tel" : "text");
      input.id = f.key;
      if (f.placeholder) input.placeholder = f.placeholder;
      if (val) input.value = val;
      if (f.tel) input.inputMode = "tel";
      wrap.appendChild(input);

      input.addEventListener("input", function () {
        state.values[f.key] = input.value;
        clearErr(f.key);
        if (onChange) onChange();
      });
      if (f.tel) {
        input.addEventListener("blur", function () {
          input.value = input.value.replace(/[^0-9]/g, "");
          state.values[f.key] = input.value;
        });
      }
      if (f.latin) {
        input.addEventListener("blur", function () {
          if (input.value) {
            input.value = input.value.toUpperCase();
            state.values[f.key] = input.value;
          }
        });
      }
    }

    if (f.hint) {
      var h = document.createElement("div");
      h.className = "hint";
      h.textContent = f.hint;
      wrap.appendChild(h);
    }
    var em = document.createElement("div");
    em.className = "err-msg";
    em.id = "err-" + f.key;
    wrap.appendChild(em);
    return wrap;
  }

  function clearErr(key) {
    var el = document.getElementById("field-" + key);
    if (el) el.classList.remove("has-error");
  }

  /* ─── Export ─── */
  global.App = {
    FIELDS: FIELDS,
    GROUPS: GROUPS,
    KEY_ORDER: KEY_ORDER,
    loadState: loadState,
    saveState: saveState,
    clearState: clearState,
    getFieldsOf: getFieldsOf,
    countFilled: countFilled,
    totalProgress: totalProgress,
    validateAll: validateAll,
    buildJson: buildJson,
    renderField: renderField,
    showToast: showToast,
    downloadBlob: downloadBlob,
    downloadHintMessage: downloadHintMessage,
    isMobileLike: isMobileLike,
    copyText: copyText
  };
})(window);
