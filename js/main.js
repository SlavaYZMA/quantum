console.log('main.js loaded');

// Явная глобальная регистрация данных и функций
window.currentStep = 0;
window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;
window.currentLanguage = 'ru';
window.terminalMessages = [];
window.particles = [];
window.isPaused = false;
window.quantumSketch = null;

window.translations = {
    // [Оставляем без изменений, как в твоём коде]
    ru: { /* ... */ },
    eng: { /* ... */ }
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

// Функция для отображения модального окна с изображениями
window.showImageArchiveModal = function() { /* ... */ };

// Функция для выбора изображения из архива
window.selectArchiveImage = function(src) { /* ... */ };

// Функция для загрузки изображения
window.uploadImage = function() { /* ... */ };

// Функция для работы с камерой
window.startCamera = function() { /* ... */ };

// Функция для остановки камеры
window.stopCamera = function() { /* ... */ };

// Функция для перезапуска
window.restart = function() { /* ... */ };

// Функция для отображения информации об авторах
window.showAboutAuthors = function() { /* ... */ };

// Функция для захвата фото
window.capturePhoto = function() { /* ... */ };

// Добавляем недостающие функции
window.setLanguage = function(lang) { /* ... */ };

window.setLanguageAndNext = function(lang) { /* ... */ };

window.moveToNextStep = function(stepIndex) { /* ... */ };

window.moveToPreviousStep = function() { /* ... */ };

window.updateTerminalLog = function() { /* ... */ };

window.showStep = function(step) {
    console.log('showStep called with:', step);
    window.currentStep = step;
    document.querySelectorAll('.step').forEach(el => el.style.display = 'none');
    const activeStep = document.getElementById(`step-${step}`);
    if (activeStep) {
        activeStep.style.display = 'flex';
        const textCluster = activeStep.querySelector('.text-cluster');
        if (textCluster) {
            textCluster.querySelectorAll('div').forEach(div => {
                div.style.visibility = 'visible';
                const key = div.getAttribute('data-i18n');
                if (key && window.translations[window.currentLanguage] && window.translations[window.currentLanguage][key]) {
                    div.textContent = window.translations[window.currentLanguage][key];
                }
            });
        }
        const buttons = activeStep.querySelectorAll('.particle-button');
        buttons.forEach(btn => {
            const key = btn.getAttribute('data-i18n');
            if (key && window.translations[window.currentLanguage] && window.translations[window.currentLanguage][key]) {
                btn.textContent = window.translations[window.currentLanguage][key];
            }
            if (window.assembleText) window.assembleText(btn);
        });

        // Очистка saved-portrait при переходе
        const savedPortrait = document.getElementById('saved-portrait');
        if (savedPortrait && step !== 5) {
            savedPortrait.style.display = 'none';
            savedPortrait.src = '';
            savedPortrait.onclick = null;
        } else if (savedPortrait && step === 5 && window.isPaused) {
            savedPortrait.style.display = 'block';
        }

        // Перемещение холста p5.js в соответствующий контейнер
        const canvasContainer = document.getElementById('quantum-canvas-container');
        if (canvasContainer && window.quantumSketch) {
            if (step === 4 || step === 5) {
                const targetContainer = document.getElementById(`portrait-animation-container-step-${step}`);
                if (targetContainer && !targetContainer.contains(canvasContainer)) {
                    targetContainer.appendChild(canvasContainer);
                    console.log(`Canvas moved to portrait-animation-container-step-${step}`);
                }
            } else {
                document.body.appendChild(canvasContainer);
                console.log('Canvas moved to body');
            }
        }

        // Явный запуск анимации на шаге 4
        if (step === 4) {
            window.isPaused = false;
            if (window.quantumSketch) {
                window.quantumSketch.loop();
                console.log('Animation started on step 4');
            }
        }
    }
};

// Инициализация при загрузке
window.addEventListener('load', () => {
    console.log('DOM loaded, initializing steps');
    window.setLanguage(window.currentLanguage);
    window.showStep(window.currentStep);
    // Инициализация p5.js с явной привязкой
    window.quantumSketch = new p5(function(p) {
        p.setup = function() {
            const canvasContainer = document.getElementById('quantum-canvas-container');
            if (!canvasContainer) {
                console.error('Container quantum-canvas-container not found!');
                return;
            }
            const canvas = p.createCanvas(400, 400);
            canvas.parent(canvasContainer);
            console.log('p5.js sketch initialized, canvas created');
            p.background(0);
            window.quantumSketch = p; // Явно сохраняем экземпляр
        };
        p.draw = function() {
            if (window.currentStep === 4 && !window.isPaused) {
                p.background(0);
                window.mouseWave = window.mouseWave || { x: p.width / 2, y: p.height / 2 };
                window.mouseWave.x = p.lerp(window.mouseWave.x, p.mouseX, 0.1);
                window.mouseWave.y = p.lerp(window.mouseWave.y, p.mouseY, 0.1);
                if (typeof window.updateParticles === 'function') {
                    window.updateParticles(p);
                }
            } else if (window.currentStep === 5 && window.isPaused) {
                // Ничего не рисуем, если анимация зафиксирована
            }
        };
        p.mouseMoved = function() {
            if (window.currentStep === 4 && !window.isPaused && typeof window.observeParticles === 'function') {
                window.observeParticles(p, p.mouseX, p.mouseY);
            }
        };
        p.mouseClicked = function() {
            if (window.currentStep === 4 && !window.isPaused && typeof window.clickParticles === 'function') {
                window.clickParticles(p, p.mouseX, p.mouseY);
            }
        };
    });
});

// Добавление обработчика событий для кнопок
document.addEventListener('click', function(e) {
    const button = e.target.closest('.particle-button');
    if (button) {
        const action = button.getAttribute('data-action');
        const lang = button.id;
        console.log('Button clicked:', action, 'with lang:', lang, 'on element:', button);
        if (action && window[action]) {
            if (action === 'setLanguageAndNext' && lang) {
                window[action](lang);
            } else {
                window[action]();
            }
        } else {
            console.error(`Function ${action} not found in window`);
        }
    }
    // Обработка клика по изображению
    const savedPortrait = document.getElementById('saved-portrait');
    if (savedPortrait && e.target === savedPortrait && window.currentStep === 5) {
        savedPortrait.style.display = 'none';
        window.isPaused = false;
        if (window.quantumSketch) window.quantumSketch.loop();
        console.log('Animation resumed on image click');
        window.moveToPreviousStep(); // Возвращаемся на шаг 4 для возобновления
    }
});
