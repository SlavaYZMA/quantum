const steps = document.querySelectorAll('.step');
let currentStep = 0;

function showStep(stepIndex) {
    if (!steps || steps.length === 0) {
        console.error('No steps found');
        return;
    }
    steps.forEach((step, index) => {
        step.style.display = index === stepIndex ? 'block' : 'none';
        console.log(`Hiding step: ${step.id}`);
    });
    console.log(`Showing step: ${stepIndex} ID: ${steps[stepIndex].id}`);
    if (stepIndex === 4 && window.quantumSketch) { // Шаг 4
        if (!window.img) {
            console.warn('No image available. Please go back to Step 2 and upload an image.');
        } else {
            window.quantumSketch.startAnimation();
        }
    }
}

document.querySelectorAll('.continue').forEach(button => {
    button.addEventListener('click', () => {
        console.log(`Continue button clicked on step: ${currentStep}`);
        if (currentStep < steps.length - 1) {
            showStep(currentStep + 1);
            currentStep++;
        }
    });
});

document.querySelectorAll('.back').forEach(button => {
    button.addEventListener('click', () => {
        if (currentStep > 0) {
            showStep(currentStep - 1);
            currentStep--;
        }
    });
});

window.setLanguageAndNext = (lang) => {
    console.log(`Language set to: ${lang} Moving to step 1`);
    setLanguage(lang);
    showStep(1);
    currentStep = 1;
};

if (steps.length > 0) {
    console.log(`Steps found: ${steps.length}`);
    showStep(0);
} else {
    console.error('No steps found in document');
}
