console.log('main.js loaded');

window.currentStep = 0;
window.noiseScale = 0.02;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;

function initializeSteps() {
    console.log('initializeSteps: Found ' + document.querySelectorAll('.step').length + ' steps');
    var steps = document.querySelectorAll('.step');
    if (steps.length === 0) {
        console.error('No steps found in DOM');
        return;
    }
    steps.forEach(function(step, index) {
        step.style.display = index === 0 ? 'flex' : 'none';
    });
    window.currentStep = 0;

    var continueButtons = document.querySelectorAll('.continue');
    console.log('Found ' + continueButtons.length + ' continue buttons');
    continueButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            console.log('Continue button clicked, currentStep: ' + window.currentStep);
            window.moveToNextStep(window.currentStep + 1);
        });
    });

    console.log('quantumSketch initialized: ' + !!window.quantumSketch);
    var canvas = document.querySelector('.quantum-canvas');
    if (canvas) {
        canvas.style.display = 'none';
        console.log('Canvas hidden on initialization');
    }
}

function showStep(stepIndex) {
    console.log('showStep called with stepIndex: ' + stepIndex);
    var steps = document.querySelectorAll('.step');
    steps.forEach(function(step) {
        var stepId = step.id.replace('step-', '');
        step.style.display = stepId === stepIndex.toString() ? 'flex' : 'none';
    });
    window.currentStep = stepIndex;

    var canvas = document.querySelector('.quantum-canvas');
    if (stepIndex === 4 || stepIndex === 5) {
        try {
            var container = document.querySelector('#portrait-animation-container-step-' + stepIndex);
            if (canvas && container) {
                container.appendChild(canvas);
                canvas.style.display = 'block';
                console.log('Canvas moved to step-' + stepIndex + ' container');
            } else {
                console.error('Failed to move canvas: canvas: ' + !!canvas + ', container: ' + !!container);
            }
        } catch (error) {
            console.error('Error moving canvas: ' + error);
        }
    } else {
        if (canvas) {
            canvas.style.display = 'none';
            console.log('Canvas hidden for step: ' + stepIndex);
        }
    }
}

window.moveToNextStep = function(stepIndex) {
    console.log('moveToNextStep called with stepIndex: ' + stepIndex);
    showStep(stepIndex);
};

window.setLanguageAndNext = function(language) {
    console.log('setLanguageAndNext called with language: ' + language);
    window.moveToNextStep(1);
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing steps');
    initializeSteps();
});
