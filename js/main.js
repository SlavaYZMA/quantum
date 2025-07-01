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
        if (index === stepIndex || (typeof stepIndex === 'number' && index === Math.floor(stepIndex))) {
            step.style.display = 'block';
            console.log(`Showing step: ${step.id}, currentStep: ${currentStep}`);
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
        const step = parseFloat(e.target.closest('.step').id.replace('step-', '')) || currentStep;
        console.log(`Continue button clicked on step: ${step} Button:`, e.target);
        moveToNextStep(step);
    });
});

function moveToNextStep(current) {
    let nextStep = current + 1;
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
