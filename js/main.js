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
        console.log(`Showing step: ${stepIndex} ID: ${targetStepId}, currentStep: ${window.currentStep}`);
    } else {
        console.warn(`Step ${stepIndex} (ID: ${targetStepId}) not found, defaulting to step 0`);
        document.getElementById('step-0').style.display = 'block';
    }
    window.currentStep = stepIndex;
    console.log(`Updated currentStep to: ${window.currentStep}`);
    if (stepIndex === 4 || stepIndex === 5) {
        if (window.quantumSketch) {
            console.log('Checking image for animation:', window.img ? 'Available' : 'Not available');
            if (!window.img) {
                console.warn('No image available. Please go back to Step 2 and upload an image.');
            } else {
                window.quantumSketch.startAnimation();
            }
            if (typeof startDynamicUpdates === 'function') {
                startDynamicUpdates();
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
            else if (window.currentStep === 6) showStep(5);
            else showStep(window.currentStep - 1);
        }
    });
});

// Обновленный обработчик .continue с четкой логикой переходов
document.querySelectorAll('.continue').forEach(button => {
    button.addEventListener('click', (e) => {
        console.log('Event listener triggered for continue button, target:', e.target);
        if (window.currentStep !== undefined) {
            console.log('Continue button clicked on step:', window.currentStep, 'Button:', e.target);
            let nextStep = window.currentStep + 1;
            if (window.currentStep === 2) {
                if (!window.img) {
                    console.warn('Image not loaded, staying on step 2');
                    return;
                }
                nextStep = 2.1; // Переход к подтверждению загрузки
            } else if (window.currentStep === 2.1) {
                nextStep = 3; // Переход к инициализации
            } else if (window.currentStep === 5) {
                window.fixationCount = window.fixationCount || 0;
                if (window.fixationCount === 0) {
                    console.log('Fixation not yet recorded, staying on step 5');
                    return; // Остаемся на 5 до фиксации
                } else {
                    nextStep = 6; // Переход к реакции системы
                    window.fixationCount = 0; // Сброс после перехода
                }
            } else if (window.currentStep === 6) {
                nextStep = 7; // Переход к заключению
            }
            console.log('Moving to next step:', nextStep);
            showStep(nextStep);
        } else {
            console.warn('window.currentStep is undefined, cannot proceed');
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
