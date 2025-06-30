const steps = document.querySelectorAll('.step');

function showStep(stepIndex) {
    if (!steps || steps.length === 0) {
        console.error('No steps found');
        return;
    }
    steps.forEach((step, index) => {
        step.style.display = 'none';
        console.log(`Hiding step: ${step.id}`);
    });
    let targetStepId = `step-${stepIndex}`;
    let targetStep = document.getElementById(targetStepId);
    if (targetStep) {
        targetStep.style.display = 'block';
        console.log(`Showing step: ${stepIndex} ID: ${targetStepId}`);
    } else {
        console.warn(`Step ${stepIndex} (ID: ${targetStepId}) not found, defaulting to step 0`);
        document.getElementById('step-0').style.display = 'block';
    }
    window.currentStep = stepIndex; // Синхронизация с window.currentStep
    if (stepIndex === 4 || stepIndex === 5) {
        if (window.quantumSketch) {
            if (!window.img) {
                console.warn('No image available. Please go back to Step 2 and upload an image.');
            } else {
                window.quantumSketch.startAnimation();
            }
            if (typeof startDynamicUpdates === 'function') {
                startDynamicUpdates(); // Вызов динамических обновлений
                console.log('Dynamic updates started for step', stepIndex);
            }
        }
    } else if (typeof stopDynamicUpdates === 'function') {
        stopDynamicUpdates();
        console.log('Dynamic updates stopped for step', stepIndex);
    }
}

document.querySelectorAll('.back').forEach(button => {
    button.addEventListener('click', () => {
        if (window.currentStep > 0) {
            console.log('Back button clicked on step:', window.currentStep);
            if (window.currentStep === 2.1) showStep(2);
            else showStep(window.currentStep - 1);
        }
    });
});

// Обновленный обработчик .continue, исключающий шаг 2
document.querySelectorAll('.continue').forEach(button => {
    button.addEventListener('click', (e) => {
        if (window.currentStep !== undefined) {
            console.log('Continue button clicked on step:', window.currentStep, 'Button:', e.target);
            if (window.currentStep === 2.1) {
                showStep(3);
            } else if (window.currentStep !== 2) {
                showStep(window.currentStep + 1);
            }
        }
    });
});

window.setLanguageAndNext = (lang) => {
    console.log(`Language set to: ${lang} Moving to step 1`);
    setLanguage(lang);
    showStep(1);
    window.currentStep = 1;
};

if (steps.length > 0) {
    console.log(`Steps found: ${steps.length}`);
    showStep(0);
} else {
    console.error('No steps found in document');
}
