console.log('main.js loaded');

// Явная глобальная регистрация данных и функций
window.currentStep = 0;
window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;
window.currentLanguage = 'ru'; // По умолчанию
window.terminalMessages = [];
window.particles = [];
window.translations = {
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
        capture_photo: "Сфоткать"
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
        capture_photo: "Take Photo"
    }
};

// Define step transitions explicitly
window.stepTransitions = {
    0: 1,
    1: 2,
    2: 2.1,
    2.1: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7
};

// Define back transitions
window.stepTransitionsBack = {
    1: 0,
    2: 1,
    2.1: 2,
    3: 2.1,
    4: 3,
    5: 4,
    6: 5,
    7: 6
};

// Список изображений в папке public/images/
const archiveImages = [
    '/public/images/image1.jpg',
    '/public/images/image2.jpg',
    '/public/images/image3.jpg'
];

// Переменная для хранения видеопотока
let cameraStream = null;

// Переменная для хранения экземпляра p5.js
let p5Instance = null;

// Добавляем недостающие функции
window.setLanguage = function(lang) {
    console.log('setLanguage function called with:', lang);
    window.currentLanguage = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (window.translations[lang] && window.translations[lang][key]) {
            el.textContent = window.translations[lang][key];
        }
    });
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (window.translations[lang] && window.translations[lang][key]) {
            el.placeholder = window.translations[lang][key];
        }
    });
};

window.setLanguageAndNext = function(lang) {
    console.log('setLanguageAndNext function called with:', lang);
    window.setLanguage(lang);
    window.moveToNextStep(window.stepTransitions[window.currentStep]);
};

window.moveToNextStep = function(stepIndex) {
    console.log('moveToNextStep function called with:', stepIndex);
    if (stepIndex !== undefined) {
        window.showStep(stepIndex);
    }
};

window.moveToPreviousStep = function() {
    console.log('moveToPreviousStep called, currentStep: ' + window.currentStep);
    const prevStep = window.stepTransitionsBack[window.currentStep];
    if (prevStep === undefined) {
        console.error('No previous step defined for currentStep: ' + window.currentStep);
        return;
    }
    window.showStep(prevStep);
};

window.updateTerminalLog = function() {
    const log = document.getElementById('terminal-log-step-4') || document.getElementById('terminal-log-step-5');
    if (log && window.terminalMessages.length > 0) {
        log.innerHTML = window.terminalMessages.map(msg => `<div>${msg}</div>`).join('');
    }
};

window.showStep = function(step) {
    console.log('showStep called with:', step);
    window.currentStep = step;
    document.querySelectorAll('.step').forEach(el => el.style.display = 'none');
    const activeStep = document.getElementById(`step-${step}`);
    if (activeStep) {
        activeStep.style.display = 'block';

        // Перемещение холста p5.js в соответствующий контейнер
        const canvasContainer = document.getElementById('quantum-canvas-container');
        if (canvasContainer && p5Instance) {
            if (step === 4 || step === 5) {
                const targetContainer = document.getElementById(`portrait-animation-container-step-${step}`);
                if (targetContainer && !targetContainer.contains(canvasContainer)) {
                    targetContainer.appendChild(canvasContainer);
                }
            } else {
                document.body.appendChild(canvasContainer); // Сброс в конец body для других шагов
            }
        }
    }
};

// Инициализация p5.js
function setup() {
    console.log('p5.js setup called');
    const canvas = createCanvas(400, 400);
    canvas.parent('quantum-canvas-container');
    p5Instance = this;
    window.mouseWave = { x: width / 2, y: height / 2, radius: window.mouseInfluenceRadius };
    window.showStep(window.currentStep); // Показываем начальный шаг
}

function draw() {
    background(0);
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.x = mouseX;
        window.mouseWave.y = mouseY;
        if (window.observeParticles) {
            window.observeParticles(this, mouseX, mouseY);
        }
    }
    // Здесь можно добавить рендеринг частиц, если он реализован в particles.js
}

// Добавление обработчика событий для кнопок
document.addEventListener('click', function(e) {
    const button = e.target.closest('.particle-button');
    if (button) {
        const action = button.getAttribute('data-action');
        if (action && window[action]) {
            window[action]();
        }
    }
});

// Инициализация при загрузке
window.addEventListener('load', () => {
    window.setLanguage(window.currentLanguage);
    window.showStep(window.currentStep);
});
