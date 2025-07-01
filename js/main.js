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
            step.style.display = 'block';
            console.log(`Showing step: ${step.id}, currentStep: ${currentStep}`);
            if (stepId === 5) {
                initializeStep5EventListeners();
            }
            if (stepId >= 3 && window.quantumSketch) {
                window.quantumSketch.startAnimation();
            }
        } else {
            step.style.display = 'none';
            console.log(`Hiding step: ${step.id}`);
        }
    });
    currentStep = stepIndex;
    window.currentStep = currentStep;
    console.log(`Updated currentStep to: ${currentStep}`);
}

function hideStep(stepIndex) {
    const step = document.getElementById(`step-${stepIndex}`);
    if (step) {
        step.style.display = 'none';
        console.log(`Hiding step: step-${stepIndex}`);
    }
}

document.addEventListener('DOMContentLoaded', initializeSteps);

document.querySelectorAll('.continue').forEach(button => {
    button.addEventListener('click', (e) => {
        console.log('Event listener triggered for continue button, target:', e.target);
        const stepElement = e.target.closest('.step');
        const current = parseFloat(stepElement.id.replace('step-', ''));
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
        showStep(nextStep);
    } else {
        console.warn(`No step defined for index: ${nextStep}`);
    }
}

window.setLanguageAndNext = (lang) => {
    console.log(`Language set to: ${lang} Moving to step 1`);
    setLanguage(lang);
    showStep(1);
};

function initializeStep5EventListeners() {
    const recordButton = document.getElementById('recordButton');
    const saveButton = document.getElementById('saveButton');
    if (recordButton) {
        recordButton.addEventListener('click', () => {
            if (window.quantumSketch) {
                console.log('Record button clicked, pausing animation');
                window.currentQuantumState = 'collapse';
                window.quantumSketch.noLoop();
                recordButton.style.display = 'none';
                document.getElementById('saveInput').style.display = 'block';
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
                window.quantumSketch.loop();
            } else {
                alert('Ошибка: холст не доступен для сохранения.');
            }
        });
    } else {
        console.error('Save button not found in DOM when step-5 is shown');
    }
}
