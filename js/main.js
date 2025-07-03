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

// Функция для typewriter-анимации
function typewriter(element, callback) {
    const divs = element.querySelectorAll('div');
    if (divs.length === 0) {
        console.log('No divs found in text-block for typewriter animation');
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
        div.textContent = ''; // Очищаем текст
        div.style.visibility = 'visible'; // Делаем div видимым
        const span = document.createElement('span');
        span.className = 'typewriter-text';
        div.appendChild(span);

        let charIndex = 0;
        function typeChar() {
            if (charIndex < text.length) {
                span.textContent += text[charIndex];
                charIndex++;
                // Случайная скорость: 10–100 мс на символ (ускорено и с большим разбросом)
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

    console.log('quantumSketch initialized: ' + !!window.quantumSketch);
    var canvas = document.querySelector('#quantumCanvas');
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
        const isActive = stepId === stepIndex.toString();
        step.style.display = isActive ? 'flex' : 'none';
        if (isActive) {
            console.log('Displaying step ' + stepId + ' with display: ' + step.style.display);
            // Запускаем typewriter-анимацию для text-block
            const textBlock = step.querySelector('.text-block');
            if (textBlock) {
                // Скрываем все div в text-block до начала анимации
                textBlock.querySelectorAll('div').forEach(div => {
                    div.style.visibility = 'hidden';
                    div.textContent = div.textContent.trim(); // Удаляем лишние пробелы
                });
                typewriter(textBlock, () => {
                    console.log('Typewriter animation finished for step ' + stepId);
                });
            } else {
                console.log('No text-block found for step ' + stepId);
            }
        }
    });
    window.currentStep = stepIndex;
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing steps');
    initializeSteps();
});
