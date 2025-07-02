console.log('main.js loaded');

window.currentStep = 0;
window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;

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

// Функция для анимации пишущей машинки
function typewriteText(stepId) {
    const textBlock = document.querySelector(`#step-${stepId} .text-block`);
    if (!textBlock) {
        console.warn(`Text block not found for step ${stepId}`);
        return;
    }
    const lines = textBlock.querySelectorAll('div');
    if (lines.length === 0) {
        console.warn(`No text lines found in text-block for step ${stepId}`);
        return;
    }
    lines.forEach(line => {
        line.style.opacity = '0'; // Скрываем все строки
        line.classList.remove('typewriter'); // Удаляем класс анимации
        line.style.width = 'auto'; // Сбрасываем ширину
    });

    let delay = 0;
    lines.forEach((line, index) => {
        const text = line.textContent.trim();
        const charCount = text.length;
        if (charCount === 0) return; // Пропускаем пустые строки
        // Случайная скорость: 30–100 мс на символ
        const speedPerChar = 30 + Math.random() * 70;
        const totalSpeed = charCount * speedPerChar;
        line.style.setProperty('--typewriter-steps', charCount);
        line.style.setProperty('--typewriter-speed', totalSpeed);
        // Задержка для последовательного появления
        setTimeout(() => {
            line.style.opacity = '1';
            line.classList.add('typewriter');
        }, delay);
        delay += totalSpeed + 500; // Пауза 500 мс между строками
    });
}

// Функция для инициализации p5.js-скетчей на шагах 4 и 5
function setupSketch(stepId) {
    const containerId = `portrait-animation-container-step-${stepId}`;
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }
    const sketch = function(p) {
        p.setup = function() {
            p.createCanvas(400, 400);
            p.noiseSeed(Math.random() * 1000);
            window.noiseScale = 0.02;
            window.chaosFactor = 0.3;
            window.mouseInfluenceRadius = 100;
            window.quantumSketch = p;
            console.log(`p5.js sketch initialized for step ${stepId}`);
            if (typeof window.initializeParticles === 'function' && window.img) {
                window.initializeParticles(window.img);
            }
        };
        p.draw = function() {
            if (typeof window.updateParticles === 'function') {
                window.updateParticles(p);
            }
        };
        p.mouseMoved = function() {
            if (typeof window.observeParticles === 'function') {
                window.observeParticles(p, p.mouseX, p.mouseY);
            }
        };
        p.mousePressed = function() {
            if (typeof window.clickParticles === 'function') {
                window.clickParticles(p, p.mouseX, p.mouseY);
            }
        };
    };
    new p5(sketch, containerId);
}

function showStep(stepIndex) {
    console.log('showStep called with stepIndex: ' + stepIndex);
    var steps = document.querySelectorAll('.step');
    steps.forEach(function(step) {
        var stepId = step.id.replace('step-', '');
        const isActive = stepId === stepIndex.toString();
        step.style.display = isActive ? 'flex' : 'none';
        if (isActive) {
            console.log('Displaying step ' + stepId + ' with display: ' + step.style.display);
            typewriteText(stepId); // Запускаем анимацию пишущей машинки
        }
    });
    window.currentStep = stepIndex;

    // Показываем или скрываем canvas для шагов 4 и 5
    const canvas = document.querySelector('#quantumCanvas');
    if (canvas) {
        canvas.style.display = (stepIndex === 4 || stepIndex === 5) ? 'block' : 'none';
        console.log(`Canvas display set to ${canvas.style.display} for step ${stepIndex}`);
    }
}

window.moveToNextStep = function(stepIndex) {
    console.log('moveToNextStep called with stepIndex: ' + stepIndex);
    showStep(stepIndex);
};

window.setLanguageAndNext = function(language) {
    console.log('setLanguageAndNext called with language: ' + language);
    window.setLanguage(language);
    setTimeout(() => window.moveToNextStep(1), 100); // Delay to ensure text is loaded
};

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
    });
    window.currentStep = 0;

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

    // Инициализация p5.js-скетчей для шагов 4 и 5
    [4, 5].forEach(stepId => {
        setupSketch(stepId);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing steps');
    initializeSteps();
});
