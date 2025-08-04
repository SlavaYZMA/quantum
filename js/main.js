console.log('main.js loaded');

// Явно добавляем функции в глобальный объект window
window.currentStep = 0;
window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;
window.currentLanguage = 'ru'; // По умолчанию
window.terminalMessages = [];
window.particles = [];
window.setLanguage = setLanguage;
window.setLanguageAndNext = setLanguageAndNext;
window.moveToNextStep = moveToNextStep;

const translations = window.translations || {
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
const stepTransitions = {
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
const stepTransitionsBack = {
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

function updateTerminalLog() {
    const log = document.getElementById('terminal-log-step-4') || document.getElementById('terminal-log-step-5');
    if (log) log.innerHTML = window.terminalMessages.join('<br>');
}

// Функция для typewriter-анимации
function typewriter(element, callback) {
    const divs = element.querySelectorAll('div');
    if (divs.length === 0) {
        console.log('No divs found in text-cluster for typewriter animation');
        if (callback) callback();
        return;
    }

    let currentDivIndex = 0;
    function typeNextDiv() {
        if (currentDivIndex >= divs.length) {
            console.log('Typewriter animation completed for all divs');
            if (callback) callback();
            return;
        }

        const div = divs[currentDivIndex];
        const text = div.textContent.trim();
        div.textContent = '';
        div.style.visibility = 'visible';
        const span = document.createElement('span');
        span.className = 'typewriter-text';
        div.appendChild(span);

        let charIndex = 0;
        function typeChar() {
            if (charIndex < text.length) {
                span.textContent += text[charIndex];
                charIndex++;
                const delay = 5 + Math.random() * 90;
                setTimeout(typeChar, delay);
            } else {
                currentDivIndex++;
                typeNextDiv();
            }
        }
        typeChar();
    }
    typeNextDiv();
}

// Функция для отображения модального окна с изображениями
function showImageArchiveModal() {
    const modal = document.getElementById('image-archive-modal');
    const imageGrid = document.getElementById('image-grid');
    if (!modal || !imageGrid) {
        console.error('Modal or image grid not found');
        return;
    }

    imageGrid.innerHTML = '';
    archiveImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'archive-image';
        img.alt = `Archive image ${index + 1}`;
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            img.src = '';
            img.alt = 'Ошибка загрузки';
        };
        img.addEventListener('click', () => {
            selectArchiveImage(src);
            modal.style.display = 'none';
        });
        imageGrid.appendChild(img);
    });

    modal.style.display = 'flex';
}

// Функция для выбора изображения из архива
function selectArchiveImage(src) {
    if (!window.quantumSketch) {
        console.error('quantumSketch not initialized');
        return;
    }
    console.log(`Attempting to load archive image: ${src}`);
    window.quantumSketch.loadImage(src, function(img) {
        console.log('Archive image loaded successfully, dimensions: ' + img.width + ', ' + img.height);
        window.img = img;
        window.initializeParticles(img);
        var thumbnails = document.querySelectorAll('#thumbnail-portrait');
        thumbnails.forEach(function(thumbnail) {
            thumbnail.src = src;
            thumbnail.style.display = (window.currentStep === 4 || window.currentStep === 5) ? 'block' : 'none';
            console.log('Updated thumbnail src: ' + thumbnail.src + ', display: ' + thumbnail.style.display);
        });
        window.moveToNextStep(2.1);
    }, function(err) {
        console.error(`Error loading archive image: ${src}, error: ${err}`);
        alert('Ошибка загрузки изображения из архива. Пожалуйста, попробуйте снова.');
    });
}

// Функция для остановки камеры
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        console.log('Camera stream stopped');
    }
}

function initializeSteps() {
    console.log('initializeSteps: Found ' + document.querySelectorAll('.step').length + ' steps');
    var steps = document.querySelectorAll('.step');
    if (steps.length === 0) {
        console.error('No steps found in DOM');
        return;
    }
    steps.forEach(function(step, index) {
        step.style.display = index === 0 ? 'flex' : 'none';
        console.log('Step ' + step.id + ' initial display: ' + step.style.display);
        if (index === 0) {
            const textCluster = step.querySelector('.text-cluster');
            if (textCluster) console.log('Text cluster found:', textCluster.textContent);
            const buttons = step.querySelectorAll('.particle-button');
            buttons.forEach(btn => {
                window.assembleText(btn);
                console.log('Initialized button:', btn.textContent);
            });
            console.log('Initialized ' + buttons.length + ' buttons on step-0');
        }
    });
    window.currentStep = 0;
    window.setLanguage(window.currentLanguage); // Применяем язык при загрузке

    var allButtons = document.querySelectorAll('.particle-button');
    console.log('Found ' + allButtons.length + ' total buttons');
    allButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            const action = button.getAttribute('data-action') || button.id;
            console.log('Button clicked:', action, 'on element:', button);
            if (action && window[action]) window[action]();
            else console.error(`Function ${action} not found in window`);
        });
    });

    var continueButtons = document.querySelectorAll('.continue');
    console.log('Found ' + continueButtons.length + ' continue buttons');
    continueButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            console.log('Continue button clicked, currentStep: ' + window.currentStep);
            const nextStep = stepTransitions[window.currentStep];
            if (nextStep === undefined) {
                console.error('No next step defined for currentStep: ' + window.currentStep);
                return;
            }
            window.moveToNextStep(nextStep);
        });
    });

    var backButtons = document.querySelectorAll('.back');
    console.log('Found ' + backButtons.length + ' back buttons');
    backButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            console.log('Back button clicked, currentStep: ' + window.currentStep);
            const prevStep = stepTransitionsBack[window.currentStep];
            if (prevStep === undefined) {
                console.error('No previous step defined for currentStep: ' + window.currentStep);
                return;
            }
            window.moveToNextStep(prevStep);
        });
    });

    const archiveButton = document.getElementById('useArchive');
    if (archiveButton) {
        archiveButton.addEventListener('click', showImageArchiveModal);
    } else {
        console.warn('Archive button not found');
    }

    const cameraButton = document.getElementById('useCamera');
    if (cameraButton) {
        cameraButton.addEventListener('click', window.startCamera);
    } else {
        console.warn('Camera button not found');
    }

    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            const modal = document.getElementById('image-archive-modal');
            if (modal) modal.style.display = 'none';
        });
    }

    const closeCameraModal = document.getElementById('close-camera-modal');
    if (closeCameraModal) {
        closeCameraModal.addEventListener('click', () => {
            const modal = document.getElementById('camera-modal');
            if (modal) {
                modal.style.display = 'none';
                stopCamera();
            }
        });
    }

    console.log('quantumSketch initialized: ' + !!window.quantumSketch);
    var canvas = document.querySelector('.quantum-canvas');
    if (canvas) {
        canvas.style.display = 'none';
        console.log('Canvas hidden on initialization');
    } else {
        console.warn('Canvas not found during initialization, waiting for p5.js setup');
    }
}

function showStep(stepIndex) {
    console.log('showStep called with stepIndex: ' + stepIndex);
    var steps = document.querySelectorAll('.step');
    steps.forEach(function(step) {
        var stepId = step.id.replace('step-', '');
        const isActive = stepId === stepIndex.toString() || (stepId === stepIndex.toFixed(1) && stepIndex % 1 !== 0);
        step.style.display = isActive ? 'flex' : 'none';
        if (isActive) {
            console.log('Displaying step ' + stepId + ' with display: ' + step.style.display);
            const textCluster = step.querySelector('.text-cluster');
            if (textCluster) {
                textCluster.querySelectorAll('div').forEach(div => {
                    div.style.visibility = 'visible';
                    const key = div.getAttribute('data-i18n');
                    if (key && translations[window.currentLanguage] && translations[window.currentLanguage][key]) {
                        div.textContent = translations[window.currentLanguage][key];
                    }
                });
                // typewriter(textCluster, () => console.log('Typewriter finished'));
            } else {
                console.log('No text-cluster found for step ' + stepId);
            }
            const buttons = step.querySelectorAll('.particle-button');
            buttons.forEach(btn => {
                const key = btn.getAttribute('data-i18n');
                if (key && translations[window.currentLanguage] && translations[window.currentLanguage][key]) {
                    btn.textContent = translations[window.currentLanguage][key];
                }
                window.assembleText(btn);
            });
        }
    });
    window.currentStep = stepIndex;
}

function moveToNextStep(stepIndex) {
    console.log('moveToNextStep called with stepIndex: ' + stepIndex);
    showStep(stepIndex);
    if (stepIndex === 4 || stepIndex === 5) {
        var canvas = document.querySelector('.quantum-canvas');
        if (canvas) canvas.style.display = 'block';
    } else {
        var canvas = document.querySelector('.quantum-canvas');
        if (canvas) canvas.style.display = 'none';
    }
}

function setLanguage(language) {
    console.log('Language set to:', language);
    window.currentLanguage = language;
    const elements = document.querySelectorAll('[data-i18n]');
    console.log(`Language elements found: ${elements.length}`);
    elements.forEach((element, index) => {
        const key = element.getAttribute('data-i18n');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
            console.log(`Updated text at index ${index} (${key}): ${translations[language][key]}`);
        } else {
            console.warn(`Translation missing for key: ${key} in language: ${language}`);
        }
    });
}

function setLanguageAndNext(language) {
    console.log('setLanguageAndNext called with language:', language);
    setLanguage(language);
    moveToNextStep(1);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing steps');
    initializeSteps();
    showStep(0); // Принудительный показ шага 0
});
