// Обработчик загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Получить все секции шагов
    const steps = document.querySelectorAll('section[id^="step-"]');
    console.log('Steps found:', steps.length); // Отладка: проверяем количество шагов

    // Функция для показа конкретного шага
    function showStep(stepIndex) {
        steps.forEach(step => {
            step.style.display = 'none';
            console.log('Hiding step:', step.id); // Отладка: скрываем шаг
        });
        if (stepIndex >= 0 && stepIndex < steps.length) {
            steps[stepIndex].style.display = 'block';
            console.log('Showing step:', stepIndex, 'ID:', steps[stepIndex].id); // Отладка: отображаем шаг
        } else {
            console.log('Invalid step index:', stepIndex); // Отладка: ошибка индекса
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
                console.log('Back button clicked on step:', index); // Отладка: клик на "назад"
                if (index > 0) showStep(index - 1);
            });
        }

        if (continueButton) {
            continueButton.addEventListener('click', () => {
                console.log('Continue button clicked on step:', index); // Отладка: клик на "продолжить"
                if (index < steps.length - 1) showStep(index + 1);
                else console.log('No more steps available'); // Отладка: конец шагов
            });
        }
    });

    // Модальное окно для галереи
    const galleryModal = document.createElement('div');
    galleryModal.className = 'modal';
    galleryModal.innerHTML = `
        <div class="modal-content">
            <div class="gallery">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC" alt="Portrait1" onclick="selectImage(this)">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC" alt="Portrait2" onclick="selectImage(this)">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC" alt="Portrait3" onclick="selectImage(this)">
            </div>
        </div>
    `;
    document.body.appendChild(galleryModal);

    window.openGallery = () => {
        galleryModal.style.display = 'block';
    };

    window.selectImage = (img) => {
        console.log('Selected image:', img.alt);
        galleryModal.style.display = 'none';
    };

    // Новая функция для перезапуска
    window.restart = () => {
        showStep(0);
        console.log('Restarting to step 0');
    };

    // Новая функция для отображения авторов (пока заглушка)
    window.showAuthors = () => {
        alert('Информация об авторах будет добавлена позже.');
        console.log('Show authors triggered');
    };
});
