const translations = {
    ru: {
        step0_text: "Пожалуйста, выберите язык RU / ENG",
        step1_title: "СТАТУС: НАБЛЮДАТЕЛЬ ПОДКЛЮЧЁН",
        step1_text1: "> Чему Шредингер может научить нас в области цифровой идентификации?",
        step1_text2: "> Добро пожаловать в экспериментальную зону.",
        step1_text3: "> Здесь наблюдение = вмешательство",
        step2_title: "Шаг 1: Сканируйте лицо суперпозиции.",
        step2_text1: "Вы можете загрузить изображение или выбрать вариант из архива.",
        step2_text2: "> Изображение принято.",
        step2_text3: "> Запускается волновая функция.",
        step2_text4: "> Система готова к инициализации.",
        step3_title: "Шаг 2: Инициализация",
        step3_text1: "> Изображение преобразовано в пиксельную сетку.",
        step3_text2: "> Каждому пикселю назначены параметры (x, y, brightness, color)",
        step3_text3: "> На их основе построена волновая функция: ψ(x, y, t)",
        step3_text4: "Уравнение эволюции:",
        step3_text5: "iℏ ∂ψ/∂t = Ĥψ, где Ĥ = -½∇² + V(x, y)",
        step3_text6: "> Потенциал V(x, y) формируется из визуальных характеристик изображения.",
        step3_text7: "> Система переходит в режим временной симуляции.",
        step3_text8: "> Портрет существует как совокупность возможных состояний.",
        step4_title: "Шаг 3: НАЧНИТЕ НАБЛЮДЕНИЕ",
        step4_text1: "Двигайте курсором по изображению.",
        step4_text2: "Каждый ваш жест запускает коллапс.",
        step4_text3: "Система реагирует. Наблюдаемый образ формируется здесь и сейчас.",
        step5_title: "Шаг 4: ФИКСАЦИЯ",
        step5_text1: "> Портрет — это процесс.",
        step5_text2: "> Но ты можешь зафиксировать один миг.",
        step5_text3: "> Это будет один из возможных тебя.",
        step6_title: "Шаг 5: РЕАКЦИЯ СИСТЕМЫ",
        step6_text1: "Это не портрет.",
        step6_text2: "Это — реакция системы на тебя.",
        step6_text3: "Ты повлиял на исход.",
        step7_title: "Заключение",
        step7_text1: "Ты — не единственный наблюдатель",
        step7_text2: "Каждое наблюдение — это акт, формирующий образ.",
        step7_text3: "Здесь ты — одновременно субъект и объект."
    },
    eng: {
        step0_text: "Please select language RU / ENG",
        step1_title: "STATUS: OBSERVER CONNECTED",
        step1_text1: "> What can Schrödinger teach us about digital identity?",
        step1_text2: "> Welcome to the experimental zone.",
        step1_text3: "> Here observation = interference",
        step2_title: "Step 1: Scan the face of superposition.",
        step2_text1: "You can upload an image or select one from the archive.",
        step2_text2: "> Image received.",
        step2_text3: "> Wave function initiated.",
        step2_text4: "> System ready for initialization.",
        step3_title: "Step 2: Initialization",
        step3_text1: "> Image converted into a pixel grid.",
        step3_text2: "> Each pixel assigned parameters (x, y, brightness, color).",
        step3_text3: "> Wave function constructed: ψ(x, y, t).",
        step3_text4: "Evolution equation:",
        step3_text5: "iℏ ∂ψ/∂t = Ĥψ, where Ĥ = -½∇² + V(x, y)",
        step3_text6: "> Potential V(x, y) derived from image visual characteristics.",
        step3_text7: "> System enters time simulation mode.",
        step3_text8: "> Portrait exists as a superposition of possible states.",
        step4_title: "Step 3: BEGIN OBSERVATION",
        step4_text1: "Move your cursor over the image.",
        step4_text2: "Each gesture triggers a collapse.",
        step4_text3: "The system reacts. The observed image forms here and now.",
        step5_title: "Step 4: FIXATION",
        step5_text1: "> The portrait is a process.",
        step5_text2: "> But you can fix a single moment.",
        step5_text3: "> This will be one of the possible yous.",
        step6_title: "Step 5: SYSTEM REACTION",
        step6_text1: "This is not a portrait.",
        step6_text2: "This is the system’s reaction to you.",
        step6_text3: "You influenced the outcome.",
        step7_title: "Conclusion",
        step7_text1: "You are not the only observer.",
        step7_text2: "Each observation is an act that shapes the image.",
        step7_text3: "Here, you are both subject and object."
    }
};

window.setLanguage = (lang) => {
    console.log(`setLanguage called with: ${lang}`);
    const elements = document.querySelectorAll('[data-i18n]');
    console.log(`Language elements found: ${elements.length}`);
    elements.forEach((element, index) => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
            console.log(`Updated text at index ${index} (${key}): ${translations[lang][key]}`);
        } else {
            console.warn(`Translation missing for key: ${key} in language: ${lang}`);
        }
    });
};

window.setLanguageAndNext = (lang) => {
    console.log(`setLanguageAndNext called with: ${lang}`);
    window.setLanguage(lang);
};

window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;
window.frame = 0;
