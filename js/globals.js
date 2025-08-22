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
        author_sasha_bio: "Независимый художник и исследователь, живет и работает в Зеленоградске (Калининградская область). Образование: Челябинская государственная академия культуры и искусств, актер театра, кино и телевидения. Автор проекта «Квантовые портреты»; в проекте формулирует исследовательские гипотезы, переводит идеи квантовой механики в визуально-вычислительный язык и проектирует сценарии восприятия и взаимодействия. Работает на пересечении искусства и научно-цифровых моделей реальности; создает среды и сценарии восприятия, где наблюдение, звук и телесное присутствие формируют опыт.",
        author_sasha_mini_statement: "Ее практика создает ситуации сдвига восприятия — выхода за привычные способы видеть, чувствовать и мыслить. Воспринимает восприятие как текучий, нестабильный процесс и исследует моменты, когда знакомое становится странным, а границы между собой и средой размываются. Работая с инсталляциями, цифровыми симуляциями, звуком и визуальными экспериментами, приглашает зрителя наблюдать не только внешний мир, но и собственный акт восприятия. Цель — расширять способы видеть, чтобы углублять взаимопонимание; научные метафоры (волновые функции, фрактальные структуры, экосистемы) служат рамками опыта неопределенности, резонанса и трансформации.",
        author_sasha_selected_works: "— Quantum Portraits (2025) — статья (peer-reviewed), ITMO «Culture & Technology»; автор.\n— Spirit of Natural Surroundings (2024) — персональная выставка; Музей природы Ильменского заповедника, Миасс.\n— The Nature’s Course (2023) — групповая выставка; ITMO Gallery, Санкт-Петербург; куратор Ася Каплан.\n— Zero Sub Twist (2022) — показ в мастерской; Зеленоградск.\n— Резиденции и фестивали: Babushki Lab Book Workshop (2024); Creative labs Газпромбанк × Gonzo × ITMO, Санкт-Петербург (2023); Nizina fest (Самара, 2022; Санкт-Петербург, 2023); «Female true», Дача Рябушинского, Вышний Волочек (2022).",
        author_slava_name: "Владислава Иванова",
        author_slava_bio: "Художница и исследовательница, живет и работает в Берлине. Образование: B.Sc. по экологии, СПбГЭТУ «ЛЭТИ» (2019–2023). В проекте отвечает за концептуально-технический контур: прототипы, тесты и итерации. Работает с цифровой визуализацией, данными, обучением AI и Python для математического моделирования; использует сенсорные элементы и биоматериалы. Ее интересы — человечность и ее определение, травма и генерирование памяти. ",
        author_slava_mini_statement: "Ее практика направлена на восстановление эмпатии в мире насилия: создание пространств для диалога о человеческой уязвимости и ответственности, рассмотрение идентичности как одновременно фрагментированной и целостной, напоминание о нашей общей человечности. В Квантовых портретах исследует идентичность как многомерную, изменчивую систему, состояние которой коллапсирует при наблюдении; зритель выступает со-наблюдателем и соавтором изменений.",
        author_slava_selected_works: "— Quantum Portraits (2025) — цифровой проект на принципах квантовой механики; соавтор.\n— Gorgona (2023–н.в.) — AI-персонаж поддержки жертв насилия; автор.\n— Sensitivity (2023) — инсталляция о хрупкости; автор.\n— Rajm (2025, в разработке) — сенсорная инсталляция о фемициде; автор.\n— Резиденции: Gonzo Project, Москва (2023); Ботанический сад Санкт-Петербурга (2022).",
        author_ph_name: "Эрвин Шрёдингер",
        author_ph_bio: "Эрвин Шредингер (1887–1961) — австрийский физик и философ науки, один из основателей квантовой механики. Автор волновой механики и уравнения Шредингера (1926), лауреат Нобелевской премии по физике (1933, совместно с Полем Дираком) «за открытие новых продуктивных форм атомной теории». Работал в университетах Цюриха, Берлина, Оксфорда, Граца и в Институте перспективных исследований в Дублине; в поздние годы вернулся в Вену. Интересы включали фундаментальную физику, философию процесса наблюдения и биологию.",
        author_ph_mini_statement: "Шредингер рассматривал физическую реальность как волновой процесс, описываемый непрерывной динамикой и «коллапсом» при измерении. Его мыслительный эксперимент «Кот Шредингера» (1935) был критикой наивного понимания квантового суперпозиционного состояния и роли наблюдателя. В контексте Quantum Portraits его идеи задают теоретическую рамку: портрет мыслится как система состояний, чувствительная к акту наблюдения и контексту восприятия.",
        author_ph_selected_works: "— Серия статей Quantisierung als Eigenwertproblem (1926) — формулировка волновой механики; уравнение Шредингера.\n— «Кот Шредингера» (1935) — мысленный эксперимент о суперпозиции и измерении.\n— What Is Life? (1944) — лекции/книга о физике живого, повлиявшая на становление молекулярной биологии.\n— Нобелевская премия по физике (1933) — за вклад в развитие атомной теории (совместно с П. Дираком)."
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
        author_sasha_bio: "Independent artist and researcher, lives and works in Zelenogradsk (Kaliningrad region, Russia). Education: Chelyabinsk State Academy of Culture and Arts, degree in Theatre, Film, and Television Acting. Author and artistic director of Quantum Portraits. In the project she formulates research hypotheses and translates quantum-mechanical ideas into a visual and computational language; she also designs perception scenarios and interaction logic. Works at the intersection of art and scientific/digital models of reality; creates environments and perception scenarios where observation, sound, and bodily presence shape the experience.",
        author_sasha_mini_statement: "Her practice sets up situations that shift perception — moving beyond habitual ways of seeing, sensing, and thinking. She treats perception as a fluid, unstable process and explores moments when the familiar becomes strange and the boundary between self and environment dissolves. Through installations, digital simulations, sound, and visual experiments, she invites the viewer to observe not only the external world but their own act of perceiving. The aim is to expand ways of seeing in order to deepen mutual understanding; scientific metaphors (wave functions, fractal structures, ecosystems) frame experiences of uncertainty, resonance, and transformation.",
        author_sasha_selected_works: "— Quantum Portraits (2025) — peer-reviewed article, ITMO Culture & Technology; author.\n— Spirit of Natural Surroundings (2024) — solo exhibition; Natural Science Museum of the Ilmensky Nature Reserve, Miass.\n— The Nature’s Course (2023) — group exhibition; ITMO Gallery, St. Petersburg; curated by Asya Kaplan.\n— Zero Sub Twist (2022) — studio show; Zelenogradsk.\n— Residencies & festivals: Babushki Lab Book Workshop (2024); Gazprombank × Gonzo × ITMO Creative Labs, St. Petersburg (2023); Nizina fest (Samara, 2022; St. Petersburg, 2023); “Female true,” Ryabushinsky’s Dacha, Vyshny Volochyok (2022).",
        author_slava_name: "Vladislava Ivanova",
        author_slava_bio: "Artist and researcher, lives and works in Berlin. Education: B.Sc. in Ecology, Saint Petersburg Electrotechnical University “LETI” (2019–2023). In Quantum Portraits she is responsible for the conceptual-technical track: prototyping, testing, and iterations. Works with digital visualization, data art, AI training, and Python for mathematical modeling; uses sensors and biomaterials. Research interests include the notion of humanity, trauma, and the generation of memory.",
        author_slava_mini_statement: "Her practice aims to restore empathy in a world marked by violence: creating spaces for dialogue about human vulnerability and responsibility, treating identity as both fragmented and whole, and reminding us of our shared humanity. In Quantum Portraits she explores identity as a multidimensional, mutable system that collapses under observation; the viewer becomes a co-observer and co-author of change.",
        author_slava_selected_works: "— Quantum Portraits (2025) — digital project grounded in quantum mechanics; co-author.\n— Gorgona (2023–ongoing) — AI character supporting survivors of violence; author.\n— Sensitivity (2023) — installation on fragility; author.\n— Rajm (2025, in development) — sensory installation on femicide; author.\n— Residencies: Gonzo Project, Moscow (2023); St. Petersburg Botanical Garden (2022).",
        author_ph_name: "Erwin Schrödinger",
        author_ph_bio: "Erwin Schrödinger (1887–1961) was an Austrian physicist and philosopher of science, one of the founders of quantum mechanics. He formulated wave mechanics and the Schrödinger equation (1926) and received the 1933 Nobel Prize in Physics (shared with Paul A. M. Dirac) for fundamental advances in atomic theory. He held posts in Zurich, Berlin, Oxford, Graz, and at the Dublin Institute for Advanced Studies, later returning to Vienna. His interests spanned the foundations of physics, the philosophy of observation, and biology.",
        author_ph_mini_statement: "Schrödinger approached physical reality as a wave process governed by continuous dynamics, with state reduction upon measurement. His 1935 “Schrödinger’s cat” thought experiment challenged naive readings of superposition and foregrounded the role of the observer. In the context of Quantum Portraits, his ideas provide a theoretical frame: the portrait as a system of states that is sensitive to acts of observation and their context.",
author_ph_selected_works: "— Quantisierung als Eigenwertproblem (series, 1926) — formulation of wave mechanics; Schrödinger equation.\n— “Schrödinger’s cat” (1935) — thought experiment on superposition and measurement.\n— What Is Life? (1944) — lectures/book on the physics of life; influential for molecular biology.\n— Nobel Prize in Physics (1933) — shared with Paul A. M. Dirac for contributions to atomic theory."
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
