// Обработчик загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Получить все секции шагов
    const steps = document.querySelectorAll('section[id^="step-"]');

    // Функция для показа конкретного шага
    function showStep(stepIndex) {
        steps.forEach(step => step.style.display = 'none');
        if (stepIndex >= 0 && stepIndex < steps.length) {
            steps[stepIndex].style.display = 'block';
        }
    }

    // Показать шаг 0 по умолчанию
    showStep(0);

    // Обработчики для кнопок навигации
    steps.forEach((step, index) => {
        const backButton = step.querySelector('.back');
        const continueButton = step.querySelector('.continue');

        if (backButton) {
            backButton.addEventListener('click', () => {
                if (index > 0) showStep(index - 1);
            });
        }

        if (continueButton) {
            continueButton.addEventListener('click', () => {
                if (index < steps.length - 1) {
                    showStep(index + 1); // Исправлено: теперь работает для всех шагов, включая шаг 3
                }
            });
        }
    });

    // Модальное окно для галереи
    const galleryModal = document.createElement('div');
    galleryModal.className = 'modal';
    galleryModal.innerHTML = `
        <div class="modal-content">
            <div class="gallery">
                <img src="https://via.placeholder.com/100?text=Portrait1" onclick="selectImage(this)">
                <img src="https://via.placeholder.com/100?text=Portrait2" onclick="selectImage(this)">
                <img src="https://via.placeholder.com/100?text=Portrait3" onclick="selectImage(this)">
            </div>
        </div>
    `;
    document.body.appendChild(galleryModal);

    window.openGallery = () => {
        galleryModal.style.display = 'block';
    };

    window.selectImage = (img) => {
        console.log('Selected image:', img.src);
        galleryModal.style.display = 'none';
    };
});
