let steps;
let currentStep = 0;

function initializeSteps() {
    steps = document.querySelectorAll('.step');
    if (steps.length > 0) {
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
            step.style.display = 'flex';
            // Перемещение canvas в текущий контейнер
            const canvas = document.querySelector('.quantum-canvas');
            const targetContainer = document.querySelector(`#portrait-animation-container-step-${stepId}`);
            if (canvas && targetContainer && stepId >= 2) {
                targetContainer.appendChild(canvas);
                canvas.style.display = 'block';
                console.log('Moved canvas to step:', stepId);
            } else if (stepId >= 2) {
                console.error('Failed to move canvas:', { canvas, targetContainer });
            }
            if (stepId === 2.1 && window.img && !window.particles.length) {
                initializeParticles(window.img);
                if (window.quantumSketch) {
                    console.error('Attempting startAnimation on step:', stepId);
                    window.quantumSketch.startAnimation();
                } else {
                    console.error('quantumSketch not initialized on step 2.1');
                }
            } else if (stepId >= 3 && window.quantumSketch) {
                console.error('Attempting startAnimation on step:', stepId);
                window.quantumSketch.startAnimation();
            }
            if (stepId === 5) {
                initializeStep5EventListeners();
            }
        } else {
            step.classList.remove('active');
            step.style.display = 'none';
        }
    });
    currentStep = stepIndex;
    window.currentStep = stepIndex;
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
    } else {
        console.error(`No step defined for index: ${nextStep}`);
    }
}

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

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing steps');
    initializeSteps();
    document.querySelectorAll('.continue').forEach(button => {
        button.addEventListener('click', (e) => {
            const stepElement = e.target.closest('.step');
            const current = parseFloat(stepElement.id.replace('step-', '')) || currentStep;
            moveToNextStep(current);
        });
    });
    // Проверка инициализации quantumSketch
    console.log('quantumSketch initialized:', window.quantumSketch);
});

window.setLanguageAndNext = (lang) => {
    if (window.setLanguage) {
        window.setLanguage(lang);
    } else {
        console.error('setLanguage function not available');
    }
    showStep(1);
};
