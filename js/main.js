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

// Функция для typewriter-анимации на уровне слов
function typewriter(element, stepId, callback) {
    // Маппинг ID текстов для каждого шага на основе globals.js
    const textIdsByStep = {
        '1': ['step1_text1', 'step1_text2', 'step1_text3'],
        '2': ['step2_text1', 'step2_text2', 'step2_text3', 'step2_text4'],
        '3': ['step3_text1', 'step3_text2', 'step3_text3', 'step3_text4', 'step3_text5', 'step3_text6', 'step3_text7', 'step3_text8'],
        '4': ['step4_text1', 'step4_text2', 'step4_text3'],
        '5': ['step5_text1', 'step5_text2', 'step5_text3'],
        '6': ['step6_text1', 'step6_text2', 'step6_text3'],
        '7': ['step7_text1', 'step7_text2', 'step7_text3']
    };

    const textIds = textIdsByStep[stepId] || [];
    console.log(`Typewriter: Expected text IDs for step ${stepId}: ${textIds.join(', ')}`);

    // Очищаем text-block и создаём div для каждого textId
    element.innerHTML = '';
    const texts = textIds.map(id => {
        const textElement = document.getElementById(id);
        const text = textElement ? textElement.textContent.trim() : '';
        console.log(`Typewriter: Text for ID ${id}: "${text}"`);
        return text;
    }).filter(text => text.length > 0);

    console.log(`Typewriter: Found ${texts.length} valid texts for step ${stepId}`);
    if (texts.length === 0) {
        console.warn(`Typewriter: No valid texts found for step ${stepId}, skipping animation`);
        if (callback) callback();
        return;
    }

    // Создаём div для каждого текста
    texts.forEach(text => {
        const div = document.createElement('div');
        div.style.display = 'block';
        div.style.opacity = '1';
        element.appendChild(div);
    });

    const divs = element.querySelectorAll('div');
    let currentDivIndex = 0;

    function typeNextDiv() {
        if (currentDivIndex >= divs.length) {
            console.log(`Typewriter: Animation completed for all divs in step ${stepId}`);
            if (callback) callback();
            return;
        }

        const div = divs[currentDivIndex];
        const text = texts[currentDivIndex] || '';
        const words = text.split(/\s+/).filter(word => word.length > 0);
        console.log(`Typewriter: Found ${words.length} words in div ${currentDivIndex}: ${words.join(', ')}`);
        if (words.length === 0) {
            console.warn(`Typewriter: No words in div ${currentDivIndex} for step ${stepId}, skipping`);
            currentDivIndex++;
            typeNextDiv();
            return;
        }

        const wordContainer = document.createElement('span');
        wordContainer.className = 'typewriter-word-container';
        div.appendChild(wordContainer);

        let wordIndex = 0;
        function typeNextWord() {
            if (wordIndex >= words.length) {
                console.log(`Typewriter: Completed words for div ${currentDivIndex} in step ${stepId}`);
                currentDivIndex++;
                typeNextDiv();
                return;
            }

            const word = words[wordIndex];
            const wordSpan = document.createElement('span');
            wordSpan.className = 'typewriter-word';
            wordSpan.textContent = word + (wordIndex < words.length - 1 ? ' ' : '');
            wordSpan.style.opacity = '0';
            wordContainer.appendChild(wordSpan);
            console.log(`Typewriter: Adding word "${word}" to div ${currentDivIndex} in step ${stepId}`);

            setTimeout(() => {
                wordSpan.style.opacity = '1';
                wordIndex++;
                const delay = 50 + Math.random() * 100; // Случайная задержка 50–150 мс
                setTimeout(typeNextWord, delay);
            }, 0);
        }
        typeNextWord();
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
            const textBlock = step.querySelector('.text-block');
            if (textBlock) {
                console.log(`showStep: Waiting for text to load for step ${stepId}`);
                // Задержка 1000 мс для загрузки текста
                setTimeout(() => {
                    console.log(`showStep: Starting typewriter for step ${stepId}, text-block found`);
                    typewriter(textBlock, stepId, () => {
                        console.log('Typewriter animation finished for step ' + stepId);
                    });
                }, 1000);
            } else {
                console.warn('showStep: No text-block found for step ' + stepId);
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
    setTimeout(() => window.moveToNextStep(1), 1000); // Увеличено до 1000 мс
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing steps');
    initializeSteps();
});
