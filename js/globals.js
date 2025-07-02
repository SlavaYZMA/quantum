console.log('globals.js loaded');

window.noiseScale = 0.02;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;
window.language = 'ru';
window.translations = {
    ru: {
        step0_text: 'Пожалуйста, выберите язык RU / ENG',
        step1_title: 'Квантовый портрет',
        step1_text1: 'Добро пожаловать в Квантовый портрет!',
        step1_text2: 'Это интерактивное приложение позволяет создать уникальное квантовое представление вашего изображения.',
        step1_text3: 'Нажмите "Продолжить", чтобы начать.',
        continue: 'Продолжить',
        back: 'Назад',
        step2_title: 'Загрузка изображения',
        step2_text1: 'Пожалуйста, выберите изображение для создания квантового портрета.',
        upload_image: 'Загрузить изображение',
        use_camera: 'Включить камеру',
        use_archive: 'Выбрать из архива',
        step2_text2: 'Изображение успешно загружено!',
        step2_text3: 'Теперь оно будет преобразовано в квантовую форму.',
        step2_text4: 'Нажмите "Продолжить", чтобы увидеть процесс.',
        step3_title: 'Квантовая обработка',
        step3_text1: 'Ваше изображение сейчас проходит квантовую декомпозицию.',
        step3_text2: 'Мы используем принципы квантовой физики, такие как суперпозиция и запутанность.',
        step3_text3: 'Каждая частица изображения находится в суперпозиции.',
        step3_text4: 'Наблюдение вызывает коллапс волновой функции.',
        step3_text5: 'Интерференция создаёт уникальные узоры.',
        step3_text6: 'Квантовое туннелирование позволяет частицам перемещаться неожиданно.',
        step3_text7: 'Запутанность связывает частицы на расстоянии.',
        step3_text8: 'Нажмите "Продолжить", чтобы увидеть результат.',
        step4_title: 'Квантовый портрет',
        step4_text1: 'Ваш квантовый портрет готов!',
        step4_text2: 'Наведите курсор на изображение, чтобы наблюдать квантовые эффекты.',
        step4_text3: 'Кликните, чтобы вызвать коллапс волновой функции.',
        step5_title: 'Наблюдение и сохранение',
        step5_text1: 'Вы можете сохранить свой квантовый портрет.',
        step5_text2: 'Введите название и нажмите "[ЗАПИСАТЬ НАБЛЮДЕНИЕ]".',
        step5_text3: 'Или продолжите, чтобы поделиться результатом.',
        save_observation: '[ЗАПИСАТЬ НАБЛЮДЕНИЕ]',
        step6_title: 'Поделиться результатом',
        step6_text1: 'Ваш квантовый портрет уникален!',
        step6_text2: 'Поделитесь им с друзьями в Telegram.',
        step6_text3: 'Нажмите "[ПОДЕЛИТЬСЯ НАБЛЮДЕНИЕМ]" или продолжите.',
        share_observation: '[ПОДЕЛИТЬСЯ НАБЛЮДЕНИЕМ]',
        step7_text1: 'Спасибо за создание квантового портрета!',
        step7_text2: 'Вы можете начать заново или посетить архив.',
        step7_text3: 'Узнайте больше о создателях в разделе "Об авторах".',
        restart: '[↻ НАЧАТЬ СНАЧАЛА]',
        archive: '[⧉ ПЕРЕЙТИ В АРХИВ НАБЛЮДЕНИЙ]',
        about_authors: '[ОБ АВТОРАХ]',
        portrait_name_placeholder: 'Название портрета'
    },
    en: {
        step0_text: 'Please select language RU / ENG',
        step1_title: 'Quantum Portrait',
        step1_text1: 'Welcome to Quantum Portrait!',
        step1_text2: 'This interactive application lets you create a unique quantum representation of your image.',
        step1_text3: 'Click "Continue" to start.',
        continue: 'Continue',
        back: 'Back',
        step2_title: 'Upload Image',
        step2_text1: 'Please select an image to create a quantum portrait.',
        upload_image: 'Upload Image',
        use_camera: 'Use Camera',
        use_archive: 'Select from Archive',
        step2_text2: 'Image uploaded successfully!',
        step2_text3: 'It will now be transformed into a quantum form.',
        step2_text4: 'Click "Continue" to see the process.',
        step3_title: 'Quantum Processing',
        step3_text1: 'Your image is undergoing quantum decomposition.',
        step3_text2: 'We use principles of quantum physics, such as superposition and entanglement.',
        step3_text3: 'Each particle of the image is in a superposition.',
        step3_text4: 'Observation causes the wave function to collapse.',
        step3_text5: 'Interference creates unique patterns.',
        step3_text6: 'Quantum tunneling allows particles to move unexpectedly.',
        step3_text7: 'Entanglement links particles across distances.',
        step3_text8: 'Click "Continue" to see the result.',
        step4_title: 'Quantum Portrait',
        step4_text1: 'Your quantum portrait is ready!',
        step4_text2: 'Hover over the image to observe quantum effects.',
        step4_text3: 'Click to trigger wave function collapse.',
        step5_title: 'Observation and Saving',
        step5_text1: 'You can save your quantum portrait.',
        step5_text2: 'Enter a name and click "[SAVE OBSERVATION]".',
        step5_text3: 'Or continue to share the result.',
        save_observation: '[SAVE OBSERVATION]',
        step6_title: 'Share Your Result',
        step6_text1: 'Your quantum portrait is unique!',
        step6_text2: 'Share it with friends on Telegram.',
        step6_text3: 'Click "[SHARE OBSERVATION]" or continue.',
        share_observation: '[SHARE OBSERVATION]',
        step7_text1: 'Thank you for creating a quantum portrait!',
        step7_text2: 'You can start over or visit the archive.',
        step7_text3: 'Learn more about the creators in the "About Authors" section.',
        restart: '[↻ START OVER]',
        archive: '[⧉ GO TO OBSERVATION ARCHIVE]',
        about_authors: '[ABOUT AUTHORS]',
        portrait_name_placeholder: 'Portrait Name'
    }
};

window.getTranslatedText = function(key) {
    const lang = window.language || 'ru';
    const text = window.translations[lang][key] || window.translations.ru[key] || key;
    if (!window.translations[lang][key]) {
        console.log('Translation missing for key: ' + key + ' in language: ' + lang);
    }
    return text;
};

window.setLanguageAndNext = function(lang) {
    console.log('setLanguageAndNext called with language: ' + lang);
    window.setLanguage(lang);
    window.moveToNextStep(1);
};

window.setLanguage = function(lang) {
    console.log('setLanguage called with: ' + lang);
    window.language = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    console.log('Language elements found: ' + elements.length);
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = window.getTranslatedText(key);
        element.textContent = text;
    });
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const text = window.getTranslatedText(key);
        element.placeholder = text;
    });
};
