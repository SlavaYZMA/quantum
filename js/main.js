// main.js
// Инициализация глобальных переменных
window.currentStepId = 'step-0';
window.currentStep = 0;

// Обработчик загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
    updateStepVisibility();
    setupEventListeners();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопки "Продолжить"
    document.querySelectorAll('.continue-button').forEach(button => {
        button.addEventListener('click', () => {
            const nextStep = button.getAttribute('data-next-step');
            if (nextStep) {
                moveToNextStep(nextStep);
            }
        });
    });

    // Выбор изображения
    document.querySelectorAll('.image-option').forEach(img => {
        img.addEventListener('click', () => {
            const src = img.getAttribute('data-src');
            selectArchiveImage(src);
        });
    });
}

// Переход к следующему шагу
function moveToNextStep(stepId) {
    console.log('moveToNextStep called with stepId:', stepId);
    window.currentStepId = stepId;
    window.currentStep = parseInt(stepId.split('-')[1] || stepId.replace('step-', '')) || 0;
    updateStepVisibility();
    if (stepId === 'step-4') {
        switchCanvasParent(4);
        startAnimation();
    } else if (stepId === 'step-5') {
        switchCanvasParent(5);
        startAnimation();
    }
}

// Обновление видимости шагов
function updateStepVisibility() {
    console.log('updateStepVisibility called, currentStep:', window.currentStep);
    const stepIds = ['step-0', 'step-1', 'step-2', 'image-archive-section', 'camera-section', 'step-2.1', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'];
    const currentStepIndex = stepIds.indexOf(window.currentStepId);
    
    stepIds.forEach((id, index) => {
        const section = document.getElementById(id);
        if (section) {
            const shouldBeVisible = index === currentStepIndex;
            console.log(`Section ${id}, should be visible: ${shouldBeVisible}, classes: ${section.className}`);
            if (shouldBeVisible) {
                section.classList.add('visible');
                section.style.display = 'block';
                console.log(`Made ${id} visible`);
            } else {
                section.classList.remove('visible');
                section.style.display = 'none';
                console.log(`Hid ${id}`);
            }
        }
    });

    // Управление видимостью image-archive-section и camera-section
    const archiveSection = document.getElementById('image-archive-section');
    if (archiveSection && !archiveSection.classList.contains('visible')) {
        archiveSection.style.display = 'none';
        console.log('Hid image-archive-section');
    }
    const cameraSection = document.getElementById('camera-section');
    if (cameraSection && !cameraSection.classList.contains('visible')) {
        cameraSection.style.display = 'none';
        console.log('Hid camera-section');
    }

    // Управление видимостью canvas и контейнеров
    const canvas = document.querySelector('canvas:not(#camera-canvas)');
    const canvasContainer = document.getElementById('canvas-container');
    const portraitContainer4 = document.getElementById('portrait-animation-container-step-4');
    const portraitContainer5 = document.getElementById('portrait-animation-container-step-5');

    if (window.currentStepId === 'step-4' || window.currentStepId === 'step-5') {
        if (canvas) {
            canvas.style.display = 'block';
            console.log('Canvas defaultCanvas0 display set to: block');
        }
        if (canvasContainer) {
            canvasContainer.style.display = 'block';
            console.log('canvas-container display set to: block');
        }
        if (window.currentStepId === 'step-4' && portraitContainer4) {
            portraitContainer4.style.display = 'block';
            console.log('portrait-animation-container-step-4 display set to: block');
        }
        if (window.currentStepId === 'step-5' && portraitContainer5) {
            portraitContainer5.style.display = 'block';
            console.log('portrait-animation-container-step-5 display set to: block');
        }
    } else {
        if (canvas) {
            canvas.style.display = 'none';
            console.log('Canvas defaultCanvas0 display set to: none');
        }
        if (canvasContainer) {
            canvasContainer.style.display = 'none';
            console.log('canvas-container display set to: none');
        }
        if (portraitContainer4) {
            portraitContainer4.style.display = 'none';
            console.log('portrait-animation-container-step-4 display set to: none');
        }
        if (portraitContainer5) {
            portraitContainer5.style.display = 'none';
            console.log('portrait-animation-container-step-5 display set to: none');
        }
    }
}

// Перемещение canvas
function switchCanvasParent(stepIndex) {
    console.log('switchCanvasParent called with step:', stepIndex);
    const canvas = document.querySelector('canvas:not(#camera-canvas)');
    if (canvas) {
        const targetContainer = document.getElementById(`portrait-animation-container-step-${stepIndex}`);
        if (targetContainer) {
            targetContainer.appendChild(canvas);
            targetContainer.style.display = 'block';
            console.log(`Moved canvas to portrait-animation-container-step-${stepIndex}`);
        } else {
            console.warn(`Target container portrait-animation-container-step-${stepIndex} not found`);
        }
    } else {
        console.warn('No canvas found to switch parent');
    }
}

// Запуск анимации
function startAnimation() {
    console.log('startAnimation called');
    if (window.quantumSketch) {
        window.quantumSketch.loop();
        console.log('p5.js animation loop started');
    } else {
        console.warn('quantumSketch not defined');
    }
}

// Выбор изображения из архива
function selectArchiveImage(src) {
    console.log('selectArchiveImage called with:', src);
    window.loadImage(src, img => {
        console.log('Image loaded for initializeParticles:', img);
        window.img = img;
        window.initializeParticles(img);
        console.log('initializeParticles completed');
        moveToNextStep('2.1');
    });
}
