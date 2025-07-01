(function () {
    // Инициализация приложения
    function initApp() {
        // Проверяем, что все необходимые элементы загружены
        const container = document.getElementById('portrait-animation-container');
        if (!container) {
            console.error('Container portrait-animation-container not found');
            return;
        }

        // Устанавливаем начальный шаг
        window.currentStep = 0;
        showStep(0);
    }

    // Управление переходами между шагами
    function handleStepTransition(currentStep) {
        const validSteps = [0, 1, 2, 2.1, 3, 4, 5, 6, 7];
        let nextStep;

        if (currentStep === 2) {
            nextStep = 2.1;
        } else if (currentStep === 2.1) {
            nextStep = 3;
        } else {
            nextStep = currentStep + 1;
        }

        if (validSteps.includes(nextStep)) {
            showStep(nextStep);
        } else {
            console.error('Invalid next step:', nextStep);
        }
    }

    // Переопределяем обработчик для кнопок continue
    function setupEventListeners() {
        document.querySelectorAll('.continue').forEach(button => {
            button.removeEventListener('click', handleContinueClick); // Удаляем старые обработчики
            button.addEventListener('click', handleContinueClick);
        });
    }

    function handleContinueClick(e) {
        const stepElement = e.target.closest('.step');
        const current = parseFloat(stepElement.id.replace('step-', '')) || window.currentStep;
        handleStepTransition(current);
    }

    // Инициализация при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
        setupEventListeners();
    });
})();
