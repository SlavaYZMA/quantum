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
            if (stepId === 4 || stepId === 5) {
                startDynamicUpdates();
            }
        } else {
            step.style.display = 'none';
            console.log(`Hiding step: ${step.id}`);
        }
    });
    currentStep = stepIndex;
    window.currentStep = currentStep;
    console.log(`Updated currentStep to: ${currentStep}`);
    if (stepIndex !== 4 && stepIndex !== 5) {
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
        const current = parseFloat(stepElement.id.replace('step-', ''));
        console.log(`Continue button clicked on step: ${current} Button:`, e.target);
        moveToNextStep(current);
    });
});

function moveToNextStep(current) {
    let nextStep = current + 1;
    if (current === 2 && window.img) {
        nextStep = 2.1;
    }
    if (current === 2 && !window.img) {
        alert('Пожалуйста, загрузите изображение перед продолжением!');
        return;
    }
    if (nextStep <= 7) {
        showStep(nextStep);
    }
}

window.setLanguageAndNext = (lang) => {
    console.log(`Language set to: ${lang} Moving to step 1`);
    setLanguage(lang);
    showStep(1);
};

function startDynamicUpdates() {
    console.log('Starting dynamic updates at', new Date().toLocaleTimeString());
    if (window.updateInterval) clearInterval(window.updateInterval);
    window.updateInterval = setInterval(() => {
        if (window.currentStep === 4 || window.currentStep === 5) {
            const terminal = document.getElementById('terminal-message');
            if (terminal && window.quantumSketch) {
                console.log('Updating terminal at', new Date().toLocaleTimeString());
                terminal.textContent = 'Терминал: Квантовая анимация обновляется...';
                window.quantumSketch.startAnimation();
            }
        }
    }, 2000);
}

function stopDynamicUpdates() {
    console.log('Stopping dynamic updates at', new Date().toLocaleTimeString());
    if (window.updateInterval) {
        clearInterval(window.updateInterval);
        window.updateInterval = null;
    }
}

function initializeStep5EventListeners() {
    const recordButton = document.getElementById('recordButton');
    const saveButton = document.getElementById('saveButton');
    if (recordButton) {
        recordButton.addEventListener('click', () => {
            if (window.quantumSketch) {
                window.quantumSketch.startAnimation();
                console.log('Record button clicked, preparing to pause');
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
            const name = document.getElementById('portraitName').value;
            if (name && window.quantumSketch) {
                const dataURL = window.quantumSketch.canvas.toDataURL('image/png');
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
