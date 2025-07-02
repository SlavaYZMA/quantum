console.log('main.js loaded');

window.currentStep = 0;

window.initializeSteps = function() {
    console.log('initializeSteps called');
    const steps = document.querySelectorAll('.step');
    console.log('initializeSteps: Found ' + steps.length + ' steps');
    steps.forEach(step => {
        console.log('Step ' + step.id + ' initial display: ' + step.style.display);
    });

    const continueButtons = document.querySelectorAll('.continue');
    console.log('Found ' + continueButtons.length + ' continue buttons');
    continueButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Continue button clicked, currentStep: ' + window.currentStep);
            let nextStep = window.currentStep + 1;
            if (window.currentStep === 2) {
                nextStep = '2-1';
            }
            window.moveToNextStep(nextStep);
        });
    });

    const backButtons = document.querySelectorAll('.back');
    console.log('Found ' + backButtons.length + ' back buttons');
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Back button clicked, currentStep: ' + window.currentStep);
            let prevStep = window.currentStep - 1;
            if (window.currentStep === '2-1') {
                prevStep = 2;
            } else if (window.currentStep === 3) {
                prevStep = '2-1';
            }
            window.moveToNextStep(prevStep);
        });
    });

    if (window.quantumSketch) {
        console.log('quantumSketch initialized: ' + !!window.quantumSketch);
    } else {
        console.log('Canvas not found during initialization, waiting for p5.js setup');
    }
};

window.showStep = function(stepIndex) {
    console.log('showStep called with stepIndex: ' + stepIndex);
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.style.display = 'none';
    });
    const targetStep = document.querySelector(`#step-${String(stepIndex).replace('.', '-')}`);
    if (targetStep) {
        targetStep.style.display = 'flex';
        console.log('Displaying step ' + stepIndex + ' with display: ' + targetStep.style.display);
        window.currentStep = stepIndex;
    } else {
        console.error('Step not found: step-' + stepIndex);
    }
};

window.moveToNextStep = function(stepIndex) {
    console.log('moveToNextStep called with stepIndex: ' + stepIndex);
    window.showStep(stepIndex);
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing steps');
    window.initializeSteps();
});
