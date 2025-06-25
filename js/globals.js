// Объект переводов
const translations = {
    ru: {
        step0_text: "Пожалуйста, выберите язык RU / ENG",
        step2_text1: "Шаг 1: Сканируйте лицо суперпозиции.",
        step2_text2: "Вы можете загрузить изображение или выбрать вариант из архива.",
        step3_text1: "Шаг 2: Инициализация",
        step3_text2: "Изображение преобразовано в пиксельную сетку.",
        step3_text3: "Каждому пикселю назначены параметры (x, y, brightness, color).",
        step3_text4: "На их основе построена волновая функция: ψ(x, y, t).",
        step3_text5: "Уравнение эволюции: iℏ ∂ψ/∂t = Ĥψ, где Ĥ = -½∇² + V(x, y)",
        step3_text6: "Потенциал V(x, y) формируется из визуальных характеристик изображения.",
        step3_text7: "Система переходит в режим временной симуляции.",
        step3_text8: "Портрет существует как совокупность возможных состояний.",
        step4_text1: "Шаг 3: НАЧНИТЕ НАБЛЮДЕНИЕ",
        step4_text2: "Двигайте курсором по изображению.",
        step4_text3: "Каждый ваш жест запускает коллапс.",
        step4_text4: "Система реагирует. Наблюдаемый образ формируется здесь и сейчас.",
        step5_text1: "Шаг 4: ФИКСАЦИЯ",
        step5_text2: "Портрет — это процесс.",
        step5_text3: "Но ты можешь зафиксировать один миг.",
        step5_text4: "Это будет один из возможных тебя."
    },
    eng: {
        step0_text: "Please select language RU / ENG",
        step2_text1: "Step 1: Scan the superposition face.",
        step2_text2: "You can upload an image or select from the archive.",
        step3_text1: "Step 2: Initialization",
        step3_text2: "The image has been converted into a pixel grid.",
        step3_text3: "Each pixel is assigned parameters (x, y, brightness, color).",
        step3_text4: "Based on this, a wave function is built: ψ(x, y, t).",
        step3_text5: "Evolution equation: iℏ ∂ψ/∂t = Ĥψ, where Ĥ = -½∇² + V(x, y)",
        step3_text6: "The potential V(x, y) is formed from the image's visual characteristics.",
        step3_text7: "The system switches to time simulation mode.",
        step3_text8: "The portrait exists as a set of possible states.",
        step4_text1: "Step 3: START OBSERVATION",
        step4_text2: "Move the cursor over the image.",
        step4_text3: "Each gesture triggers a collapse.",
        step4_text4: "The system reacts. The observed image is formed here and now.",
        step5_text1: "Step 4: FIXATION",
        step5_text2: "The portrait is a process.",
        step5_text3: "But you can fix one moment.",
        step5_text4: "This will be one of your possible selves."
    }
};

// Функция переключения языка
function setLanguage(lang) {
    const elements = document.querySelectorAll('.language-text');
    elements.forEach(element => {
        const stepId = element.parentElement.parentElement.parentElement.id;
        const texts = element.textContent.split('\n').filter(t => t.trim());
        element.innerHTML = ''; // Очистка текущего содержимого
        switch (stepId) {
            case 'step-0':
                element.textContent = translations[lang].step0_text;
                break;
            case 'step-2':
                texts.forEach((text, i) => {
                    if (i === 0 && text.includes(translations['ru'].step2_text1)) element.textContent = translations[lang].step2_text1;
                    else if (i === 1 && text.includes(translations['ru'].step2_text2)) element.textContent += '\n' + translations[lang].step2_text2;
                });
                break;
            case 'step-3':
                texts.forEach((text, i) => {
                    if (i === 0 && text.includes(translations['ru'].step3_text1)) element.textContent = translations[lang].step3_text1;
                    else if (i === 1 && text.includes(translations['ru'].step3_text2)) element.textContent += '\n' + translations[lang].step3_text2;
                    else if (i === 2 && text.includes(translations['ru'].step3_text3)) element.textContent += '\n' + translations[lang].step3_text3;
                    else if (i === 3 && text.includes(translations['ru'].step3_text4)) element.textContent += '\n' + translations[lang].step3_text4;
                    else if (i === 4 && text.includes(translations['ru'].step3_text5)) element.textContent += '\n' + translations[lang].step3_text5;
                    else if (i === 5 && text.includes(translations['ru'].step3_text6)) element.textContent += '\n' + translations[lang].step3_text6;
                    else if (i === 6 && text.includes(translations['ru'].step3_text7)) element.textContent += '\n' + translations[lang].step3_text7;
                    else if (i === 7 && text.includes(translations['ru'].step3_text8)) element.textContent += '\n' + translations[lang].step3_text8;
                });
                break;
            case 'step-4':
                texts.forEach((text, i) => {
                    if (i === 0 && text.includes(translations['ru'].step4_text1)) element.textContent = translations[lang].step4_text1;
                    else if (i === 1 && text.includes(translations['ru'].step4_text2)) element.textContent += '\n' + translations[lang].step4_text2;
                    else if (i === 2 && text.includes(translations['ru'].step4_text3)) element.textContent += '\n' + translations[lang].step4_text3;
                    else if (i === 3 && text.includes(translations['ru'].step4_text4)) element.textContent += '\n' + translations[lang].step4_text4;
                });
                break;
            case 'step-5':
                texts.forEach((text, i) => {
                    if (i === 0 && text.includes(translations['ru'].step5_text1)) element.textContent = translations[lang].step5_text1;
                    else if (i === 1 && text.includes(translations['ru'].step5_text2)) element.textContent += '\n' + translations[lang].step5_text2;
                    else if (i === 2 && text.includes(translations['ru'].step5_text3)) element.textContent += '\n' + translations[lang].step5_text3;
                    else if (i === 3 && text.includes(translations['ru'].step5_text4)) element.textContent += '\n' + translations[lang].step5_text4;
                });
                break;
        }
    });
}
