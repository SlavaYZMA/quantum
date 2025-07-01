let steps;
let currentStep = 0;

function initializeSteps() {
    steps = document.querySelectorAll('.step');
    if (steps.length > 0) {
        showStep(0);
    } else {
        console.error('No steps found in document.');
    }
}

function showStep(stepIndex) {
    steps.forEach((step) => {
        const stepId = parseFloat(step.id.replace('step-', '')) || stepIndex;
        if (stepId === stepIndex) {
            step.classList.add('active');
            step.style.display = 'flex';
            if (stepId === 5) {
                initializeStep5EventListeners();
            }
            if (stepId >= 2.1 && window.quantumSketch && window.img && typeof initializeParticles === 'function') {
                initializeParticles(window.img);
                window.quantumSketch.startAnimation();
            }
        } else {
            step.classList.remove('active');
            step.style.display = 'none';
        }
    });
    currentStep = stepIndex;
    window.currentStep = stepIndex;
    console.log(`Current step: ${stepIndex}`);
}

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
    }
}

window.setLanguageAndNext = (lang) => {
    // Убрана попытка вызова window.setLanguage
    showStep(1);
};

function initializeStep5EventListeners() {
    const recordButton = document.getElementById('recordButton');
    const saveButton = document.getElementById('saveButton');
    if (recordButton) {
        recordButton.addEventListener('click', () => {
            if (window.quantumSketch) {
                window.currentQuantumState = 'collapse';
                window.isPaused = true;
                window.quantumSketch.noLoop();
                recordButton.style.display = 'none';
                document.getElementById('saveInput').style.display = 'block';
                window.recordObservation();
            }
        });
    }
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const name = document.getElementById('portraitName').value || 'quantum_portrait';
            if (window.quantumSketch) {
                window.quantumSketch.saveCanvas(name, 'png');
                document.getElementById('saveInput').style.display = 'none';
                recordButton.style.display = 'inline-block';
                window.isPaused = false;
                window.quantumSketch.loop();
                showStep(6);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeSteps();
    // Убраны дублирующиеся обработчики
});
