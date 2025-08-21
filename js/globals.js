window.currentLanguage = 'ru';

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
        step4_text1: "> Двигайте курсором по изображению.",
        step4_text2: "> Каждый ваш жест запускает коллапс.",
        step4_text3: "> Система реагирует. Наблюдаемый образ формируется здесь и сейчас.",
        step5_title: "Шаг 4: ФИКСАЦИЯ",
        step5_text1: "> Портрет — это процесс.",
        step5_text2: "> Но ты можешь зафиксировать один миг.",
        step5_text3: "> Это будет один из возможных тебя.",
        step6_title: "Шаг 5: РЕАКЦИЯ СИСТЕМЫ",
        step6_text1: "> Это не портрет.",
        step6_text2: "> Это — реакция системы на тебя.",
        step6_text3: "> Ты повлиял на исход.",
        step7_title: "Заключение",
        step7_text1: "Ты — не единственный наблюдатель.",
        step7_text2: "Каждое наблюдение — это акт, формирующий образ.",
        step7_text3: "Здесь ты — одновременно субъект и объект.",
        continue: "Продолжить",
        upload_image: "Загрузить изображение",
        use_camera: "Включить камеру",
        use_archive: "Выбрать из архива",
        save_observation: "[ЗАПИСАТЬ НАБЛЮДЕНИЕ]",
        share_observation: "[ПОДЕЛИТЬСЯ НАБЛЮДЕНИЕМ]",
        restart: "[↻ НАЧАТЬ СНАЧАЛА]",
        archive: "[⧉ ПЕРЕЙТИ В АРХИВ НАБЛЮДЕНИЙ]",
        about_authors: "[ОБ АВТОРАХ]",
        back: "Назад",
        portrait_name_placeholder: "Название портрета",
        capture_photo: "Сделать фото",
        menu_language_selection: "Выбор языка",
        menu_introduction: "Введение",
        menu_image_source: "Источник изображения",
        menu_image_instructions: "Инструкции по изображению",
        menu_quantum_explanation: "Квантовое объяснение",
        menu_portrait_generation: "Генерация портрета",
        menu_observation_recording: "Запись наблюдения",
        menu_sharing: "Поделиться",
        menu_conclusion: "Заключение",
        menu_about_authors: "Об авторах",
        about_authors_title: "Об авторах",
        author_sasha_name: "Александра Далибах",
        author_sasha_bio: "Александра Далибах — художница, которая соединяет в своих работах интуицию и эксперимент. Её творчество балансирует между живописью и объектным искусством, где каждый штрих становится исследованием внутреннего мира. Александра ищет новые формы выразительности, играя с цветом и текстурой, превращая привычные вещи в символы. Её работы говорят языком метафор, но при этом остаются открытыми для личной интерпретации зрителя.",
        author_slava_name: "Владислава Иванова",
        author_slava_bio: "Владислава Иванова — авторка, исследующая пространство пересечения экологии, памяти и социальной справедливости. В её текстах звучит голос тех, кто обычно остаётся в тени: людей, потерявших дом, природы, лишённой защиты, городов, которые изменяются быстрее, чем мы успеваем к ним привыкнуть. Владислава работает с документальностью и художественным образом одновременно, создавая тексты, в которых факты и эмоции образуют цельное полотно. Её стиль — прямой, искренний и всегда обращённый к читателю.",
        author_ph_name: "Эрвин Шрёдингер",
        author_ph_bio: "Эрвин Шрёдингер — австрийский физик-теоретик, один из основателей квантовой механики. Его имя известно благодаря знаменитому мысленному эксперименту с «кошкой Шрёдингера», который наглядно показал парадоксы квантового мира. Но его вклад значительно шире: уравнение Шрёдингера стало фундаментом для всей современной физики. Помимо науки, он писал философские тексты, где размышлял о жизни, сознании и природе реальности. Шрёдингер умел соединять строгую математику с глубоким поиском смысла, оставаясь человеком, для которого наука и философия были единым целым."
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
        step4_text1: "> Move your cursor over the image.",
        step4_text2: "> Each gesture triggers a collapse.",
        step4_text3: "> The system reacts. The observed image forms here and now.",
        step5_title: "Step 4: FIXATION",
        step5_text1: "> The portrait is a process.",
        step5_text2: "> But you can fix a single moment.",
        step5_text3: "> This will be one of the possible yous.",
        step6_title: "Step 5: SYSTEM REACTION",
        step6_text1: "> This is not a portrait.",
        step6_text2: "> This is the system’s reaction to you.",
        step6_text3: "> You influenced the outcome.",
        step7_title: "Conclusion",
        step7_text1: "You are not the only observer.",
        step7_text2: "Each observation is an act that shapes the image.",
        step7_text3: "Here, you are both subject and object.",
        continue: "Continue",
        upload_image: "Upload Image",
        use_camera: "Use Camera",
        use_archive: "Select from Archive",
        save_observation: "[RECORD OBSERVATION]",
        share_observation: "[SHARE OBSERVATION]",
        restart: "[↻ START OVER]",
        archive: "[⧉ GO TO OBSERVATION ARCHIVE]",
        about_authors: "[ABOUT AUTHORS]",
        back: "Back",
        portrait_name_placeholder: "Portrait name",
        capture_photo: "Capture Photo",
        menu_language_selection: "Language Selection",
        menu_introduction: "Introduction",
        menu_image_source: "Image Source",
        menu_image_instructions: "Image Instructions",
        menu_quantum_explanation: "Quantum Explanation",
        menu_portrait_generation: "Portrait Generation",
        menu_observation_recording: "Observation Recording",
        menu_sharing: "Sharing",
        menu_conclusion: "Conclusion",
        menu_about_authors: "About Authors",
        about_authors_title: "About Authors",
        author_sasha_name: "Aleksandra Dalibah",
        author_sasha_bio: "Aleksandra Dalibah is an artist who blends intuition and experimentation in her work. Her creations balance between painting and object art, where each stroke becomes an exploration of the inner world. Aleksandra seeks new forms of expressiveness, playing with color and texture, transforming everyday objects into symbols. Her works speak the language of metaphors while remaining open to the viewer’s personal interpretation.",
        author_slava_name: "Vladislava Ivanova",
        author_slava_bio: "Vladislava Ivanova is a writer exploring the intersection of ecology, memory, and social justice. Her texts give voice to those often left in the shadows: people who have lost their homes, nature deprived of protection, and cities changing faster than we can adapt. Vladislava combines documentary and artistic imagery, creating texts where facts and emotions form a cohesive canvas. Her style is direct, sincere, and always directed toward the reader.",
        author_ph_name: "Erwin Schrödinger",
        author_ph_bio: "Erwin Schrödinger was an Austrian theoretical physicist and one of the founders of quantum mechanics. He is best known for his famous thought experiment, 'Schrödinger’s Cat,' which vividly illustrated the paradoxes of the quantum world. However, his contributions extend far beyond: the Schrödinger equation became the foundation of modern physics. Beyond science, he wrote philosophical texts reflecting on life, consciousness, and the nature of reality. Schrödinger masterfully combined rigorous mathematics with a deep search for meaning, remaining a thinker for whom science and philosophy were one."
    }
};

window.setLanguage = (lang) => {
    console.log(`setLanguage called with: ${lang}`);
    window.currentLanguage = lang;
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
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
            console.log(`Updated placeholder (${key}): ${translations[lang][key]}`);
        } else {
            console.warn(`Placeholder translation missing for key: ${key} in language: ${lang}`);
        }
    });
    const menuItems = document.querySelectorAll('#menu a');
    const menuKeys = [
        'menu_language_selection',
        'menu_introduction',
        'menu_image_source',
        'menu_image_instructions',
        'menu_quantum_explanation',
        'menu_portrait_generation',
        'menu_observation_recording',
        'menu_sharing',
        'menu_conclusion',
        'menu_about_authors'
    ];
    menuItems.forEach((item, index) => {
        const key = menuKeys[index];
        if (translations[lang] && translations[lang][key]) {
            item.textContent = translations[lang][key];
            console.log(`Updated menu item ${index} (${key}): ${translations[lang][key]}`);
        } else {
            console.warn(`Menu translation missing for key: ${key} in language: ${lang}`);
        }
    });
};

window.setLanguageAndNext = (lang) => {
    console.log(`setLanguageAndNext called with: ${lang}`);
    window.setLanguage(lang);
    window.moveToNextStep(1);
};

window.setLanguageAndStay = (lang) => {
    console.log(`setLanguageAndStay called with: ${lang}`);
    window.setLanguage(lang);
    window.moveToNextStep('1');
};

window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;
window.frame = 0;
