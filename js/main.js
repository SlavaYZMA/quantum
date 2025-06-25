document.addEventListener('DOMContentLoaded', () => {
    // Получить все секции шагов
    const steps = document.querySelectorAll('section[id^="step-"]');
    
    // Функция для показа конкретного шага
    function showStep(stepIndex) {
        // Скрыть все шаги
        steps.forEach(step => step.style.display = 'none');
        // Показать выбранный шаг, если индекс валиден
        if (stepIndex >= 0 && stepIndex < steps.length) {
            steps[stepIndex].style.display = 'block';
        }
    }
    
    // Изначально показать шаг 0
    showStep(0);
    
    // Добавить обработчики событий для кнопок "назад" и "продолжить" на каждом шаге
    steps.forEach((step, index) => {
        const backButton = step.querySelector('.back');
        const continueButton = step.querySelector('.continue');
        
        if (backButton) {
            backButton.addEventListener('click', () => {
                if (index > 0) {
                    showStep(index - 1);
                }
            });
        }
        
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                if (index < steps.length - 1) {
                    showStep(index + 1);
                }
            });
        }
    });
});
