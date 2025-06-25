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
    console.log('setLanguage called with:', lang); // Отладка: проверяем вызов
    const elements = document.querySelectorAll('.language-text');
    console.log('Language elements found:', elements.length); // Отладка: количество элементов
    if (elements.length === 0) {
        console.error('No elements with class .language-text found');
        return;
    }
    elements.forEach(element => {
        const stepId = element.parentElement.parentElement.parentElement.id;
        const texts = element.textContent.split('\n').filter(t => t.trim());
        element.innerHTML = ''; // Очистка текущего содержимого
        switch (stepId) {
            case 'step-0':
                element.textContent = translations[lang].step0_text;
                break;
            case 'step-2':
                element.textContent = [translations[lang].step2_text1, translations[lang].step2_text2].join('\n');
                break;
            case 'step-3':
                element.textContent = [
                    translations[lang].step3_text1,
                    translations[lang].step3_text2,
                    translations[lang].step3_text3,
                    translations[lang].step3_text4,
                    translations[lang].step3_text5,
                    translations[lang].step3_text6,
                    translations[lang].step3_text7,
                    translations[lang].step3_text8
                ].join('\n');
                break;
            case 'step-4':
                element.textContent = [
                    translations[lang].step4_text1,
                    translations[lang].step4_text2,
                    translations[lang].step4_text3,
                    translations[lang].step4_text4
                ].join('\n');
                break;
            case 'step-5':
                element.textContent = [
                    translations[lang].step5_text1,
                    translations[lang].step5_text2,
                    translations[lang].step5_text3,
                    translations[lang].step5_text4
                ].join('\n');
                break;
        }
        console.log('Updated text for', stepId, ':', element.textContent); // Отладка: проверяем обновление
    });
}
