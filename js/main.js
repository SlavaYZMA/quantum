```javascript
console.log('main.js loaded');

window.currentStep = 0;
window.noiseScale = 0.02;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;

function initializeSteps() {
    console.log('initializeSteps: Found', document.querySelectorAll('.step').length, 'steps');
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.display = index === 0 ? 'flex' : 'none';
    });
    window.currentStep = 0;

    // Привязка событий для кнопок "Продолжить"
    document.querySelectorAll('.continue').forEach(button => {
        button.addEventListener('click', () => {
            window.moveToNextStep(window.currentStep + 1);
        });
    });

    // Проверка инициализации quantumSketch
    console.log('quantumSketch initialized:', !!window.quantumSketch);
}

function showStep(stepIndex) {
    console.log('showStep called with stepIndex:', stepIndex);
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.display = index === stepIndex ? 'flex' : 'none';
    });
    window.currentStep = stepIndex;

    // Перемещение холста на шаги 4 и 5
    if (stepIndex === 4 || stepIndex === 5) {
        try {
            const canvas = document.querySelector('.quantum-canvas');
            const container = document.querySelector(`#portrait-animation-container-step-${stepIndex}`);
            if (canvas && container) {
                container.appendChild(canvas);
                canvas.style.display = 'block';
                console.log(`Canvas moved to step-${stepIndex} container`);
            } else {
                console.error('Failed to move canvas: canvas or container not found', { canvas: !!canvas, container: !!container });
            }
        } catch (error) {
            console.error('Error moving canvas:', error);
        }
    } else {
        const canvas = document.querySelector('.quantum-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
    }
}

window.moveToNextStep = function(stepIndex) {
    console.log('moveToNextStep called with stepIndex:', stepIndex);
    showStep(stepIndex);
};

window.setLanguageAndNext = function(language) {
    console.log('setLanguageAndNext called with language:', language);
    // Здесь можно добавить логику переключения языка, если нужно
    window.moveToNextStep(1);
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing steps');
    initializeSteps();
});
```
