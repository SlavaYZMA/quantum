// Глобальная переменная для языка
let currentLanguage = 'ru';

// Получить все секции шагов
const steps = document.querySelectorAll('.step');

// Глобальная переменная для текущего шага
window.currentStep = 0;

// Глобальная функция для выбора языка и перехода на следующий шаг
function setLanguageAndNext(lang) {
    currentLanguage = lang;
    showStep(1); // Переход на шаг 1 после выбора языка
    console.log('Language set to:', lang, 'Moving to step 1');
}

// Глобальная функция для показа конкретного шага
function showStep(stepIndex) {
    steps.forEach(step => {
        step.style.display = 'none';
        console.log('Hiding step:', step.id); // Отладка: скрываем шаг
    });
    if (stepIndex >= 0 && stepIndex < steps.length) {
        steps[stepIndex].style.display = 'block';
        console.log('Showing step:', stepIndex, 'ID:', steps[stepIndex].id); // Отладка: отображаем шаг
        setLanguage(currentLanguage, steps[stepIndex]); // Обновляем только текущий шаг
        window.currentStep = stepIndex; // Обновляем глобальную переменную
        // Инициализация typewriter-анимации для видимого шага
        if (steps[stepIndex].querySelector('.typewriter')) {
            initTypewriter(steps[stepIndex]);
        }
        // Инициализация анимации на шагах 3 и 4
        if (stepIndex === 3 || stepIndex === 4) {
            if (!window.isCanvasReady) {
                setup();
                loop();
            } else if (window.isPaused) {
                loop();
            }
        } else {
            if (window.canvas) {
                noLoop();
            }
        }
    } else {
        console.log('Invalid step index:', stepIndex); // Отладка: ошибка индекса
    }
}

// Глобальная функция для typewriter-анимации
function initTypewriter(step) {
    const typewriters = step.querySelectorAll('.typewriter');
    typewriters.forEach((element, index) => {
        let text = element.getAttribute('data-i18n') ? translations[currentLanguage][element.getAttribute('data-i18n')] : element.textContent;
        element.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        setTimeout(type, index * 500); // Задержка между строками
    });
}

// Обработчик загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('Steps found:', steps.length); // Отладка: проверяем количество шагов

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

    // Обработчики для специфичных кнопок в step-7
    const step7Buttons = document.querySelectorAll('#step-7 .action-btn');
    step7Buttons.forEach(button => {
        if (button.textContent.includes('[↻ НАЧАТЬ СНАЧАЛА]')) {
            button.addEventListener('click', () => {
                console.log('Restart button clicked');
                showStep(0);
            });
        } else if (button.textContent.includes('[⧉ ПЕРЕЙТИ В АРХИВ НАБЛЮДЕНИЙ]')) {
            button.addEventListener('click', () => {
                console.log('Archive button clicked');
                window.open('https://t.me/your_archive', '_blank');
            });
        } else if (button.textContent.includes('[ОБ АВТОРАХ]')) {
            button.addEventListener('click', () => {
                console.log('Show authors triggered');
                alert('Информация об авторах будет добавлена позже.');
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
});
