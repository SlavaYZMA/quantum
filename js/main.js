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
    steps.forEach((step, index) => {
        const stepId = parseFloat(step.id.replace('step-', ''));
        if (stepId === stepIndex) {
            step.style.display = 'block';
            console.log(`Showing step: ${step.id}, currentStep: ${currentStep}`);
            // Инициализация обработчиков для step-5
            if (stepId === 5) {
                initializeStep5EventListeners();
            }
        } else {
            step.style.display = 'none';
            console.log(`Hiding step: ${step.id}`);
        }
    });
    currentStep = stepIndex;
    console.log(`Updated currentStep to: ${currentStep}`);
    if (stepIndex === 4 || stepIndex === 5) {
        startDynamicUpdates();
    } else {
        stopDynamicUpdates();
    }
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
        const current = parseFloat(stepElement.id.replace('step-', '')) || currentStep;
        console.log(`Continue button clicked on step: ${current} Button:`, e.target);
        moveToNextStep(current);
    });
});

function moveToNextStep(current) {
    let nextStep = Math.floor(current) + 1;
    if (current === 2.1) nextStep = 3;
    if (nextStep < steps.length) {
        showStep(nextStep);
    }
}

window.setLanguageAndNext = (lang) => {
    console.log(`Language set to: ${lang} Moving to step 1`);
    setLanguage(lang);
    showStep(1);
};

window.continueStep2 = () => {
    console.log('Checking image status:', window.img ? 'Image available' : 'No image available');
    if (window.img) {
        showStep(2.1);
    } else {
        alert('Пожалуйста, загрузите изображение перед продолжением!');
    }
};

// Новая функция для инициализации обработчиков step-5
function initializeStep5EventListeners() {
    const recordButton = document.getElementById('recordButton');
    const saveButton = document.getElementById('saveButton');
    if (recordButton) {
        recordButton.addEventListener('click', () => {
            if (quantumSketch) {
                quantumSketch.startAnimation();
                console.log('Record button clicked, preparing to pause');
                recordButton.style.display = 'none';
                document.getElementById('saveInput').style.display = 'block';
            }
        });
    } else {
        console.error('Record button not found in DOM when step-5 is shown');
    }
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const name = document.getElementById('portraitName').value;
            if (name && quantumSketch) {
                const dataURL = quantumSketch.get().canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `${name}.png`;
                link.href = dataURL;
                link.click();
                console.log(`Portrait saved as: ${name}.png, resuming step 5`);
                document.getElementById('saveInput').style.display = 'none';
                recordButton.style.display = 'inline-block';
                window.fixationCount = 1;
            } else {
                alert('Пожалуйста, введите имя портрета!');
            }
        });
    } else {
        console.error('Save button not found in DOM when step-5 is shown');
    }
}
