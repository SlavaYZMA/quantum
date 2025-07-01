let steps;
let currentStep = 0;

function initializeSteps() {
    steps = document.querySelectorAll('.step');
    if (steps.length > 0) {
        console.log(`Steps found: ${steps.length}`);
        showStep(0);
    } else {
        console.error('No steps found in document. Check your HTML structure.');
    }
}

function showStep(stepIndex) {
    steps.forEach((step) => {
        const stepId = parseFloat(step.id.replace('step-', ''));
        if (stepId === stepIndex) {
            step.classList.add('active');
            console.log(`Showing step: ${step.id}, currentStep: ${currentStep}, canvasVisible:`, document.querySelector('#portrait-animation-container canvas')?.style.display !== 'none');
            if (stepId === 5) {
                initializeStep5EventListeners();
            }
            if (stepId >= 4 && window.quantumSketch) {
                console.log('Starting animation for step:', stepId, 'quantumSketch available:', !!window.quantumSketch);
                window.quantumSketch.startAnimation();
            }
        } else {
            step.classList.remove('active');
            console.log(`Hiding step: ${step.id}`);
        }
    });
    currentStep = stepIndex;
    window.currentStep = stepIndex;
    console.log(`Updated currentStep to: ${currentStep}`);
}

function hideStep(stepIndex) {
    const step = document.getElementById(`step-${stepIndex}`);
    if (step) {
        step.classList.remove('active');
        console.log(`Hiding step: step-${stepIndex}`);
    }
}

document.addEventListener('DOMContentLoaded', initializeSteps);

document.querySelectorAll('.continue').forEach(button => {
    button.addEventListener('click', (e) => {
        console.log('Event listener triggered for continue button, target:', e.target);
        const stepElement = e.target.closest('.step');
        const current = parseFloat(stepElement.id.replace('step-', '')) || currentStep;
        console.log(`Continue button clicked on step: ${current} Button:`, e.target);
        moveToNextStep(current);
    });
});

function moveToNextStep(current) {
    let nextStep = current + 1;
    if (current === 2 && !window.img) {
        alert('Пожалуйста, загрузите изображение перед продолжением!');
        return;
    }
    if (current === 2 && window.img) {
        nextStep = 2.1;
    }
    if (current === 2.1) {
        nextStep = 3;
    }
    if (nextStep <= 7) {
        console.log(`Moving to next step: ${nextStep}`);
        showStep(nextStep);
    } else {
        console.warn(`No step defined for index: ${nextStep}`);
    }
}

window.setLanguageAndNext = (lang) => {
    console.log(`Language set to: ${lang} Moving to step 1`);
    if (window.setLanguage) { // Проверяем, определена ли функция
        window.setLanguage(lang);
    } else {
        console.error('setLanguage function not available');
    }
    showStep(1); // Переход к step-1 один раз
};

function initializeStep5EventListeners() {
    const recordButton = document.getElementById('recordButton');
    const saveButton = document.getElementById('saveButton');
    if (recordButton) {
        recordButton.addEventListener('click', () => {
            if (window.quantumSketch) {
                console.log('Record button clicked, pausing animation');
                window.currentQuantumState = 'collapse';
                window.isPaused = true;
                window.quantumSketch.noLoop();
                recordButton.style.display = 'none';
                document.getElementById('saveInput').style.display = 'block';
                window.recordObservation();
            } else {
                console.error('quantumSketch not initialized');
            }
        });
    } else {
        console.error('Record button not found in DOM when step-5 is shown');
    }
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const name = document.getElementById('portraitName').value || 'quantum_portrait';
            if (window.quantumSketch) {
                window.quantumSketch.saveCanvas(name, 'png');
                console.log(`Saved canvas as ${name}.png`);
                document.getElementById('saveInput').style.display = 'none';
                recordButton.style.display = 'inline-block';
                window.isPaused = false;
                window.quantumSketch.loop();
                showStep(6);
            } else {
                alert('Ошибка: холст не доступен для сохранения.');
            }
        });
    } else {
        console.error('Save button not found in DOM when step-5 is shown');
    }
}
