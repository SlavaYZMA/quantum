console.log('main.js loaded');

window.currentStep = 0;
window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;

// Define step transitions explicitly
const stepTransitions = {
    0: 1,
    1: 2,
    2: 2.1,
    2.1: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7
};

// Define back transitions
const stepTransitionsBack = {
    1: 0,
    2: 1,
    2.1: 2,
    3: 2.1,
    4: 3,
    5: 4,
    6: 5,
    7: 6
};

// Список изображений в папке public/images/
const archiveImages = [
    '/public/images/image1.jpg',
    '/public/images/image2.jpg',
    '/public/images/image3.jpg'
];

// Переменная для хранения видеопотока
let cameraStream = null;

// Функция для typewriter-анимации
function typewriter(element, callback) {
    const divs = element.querySelectorAll('div');
    if (divs.length === 0) {
        console.log('No divs found in text-block for typewriter animation');
        if (callback) callback();
        return;
    }

    let currentDivIndex = 0;
    function typeNextDiv() {
        if (currentDivIndex >= divs.length) {
            console.log('Typewriter animation completed for all divs');
            if (callback) callback();
            return;
        }

        const div = divs[currentDivIndex];
        const text = div.textContent.trim();
        div.textContent = ''; // Очищаем текст
        div.style.visibility = 'visible'; // Делаем div видимым
        const span = document.createElement('span');
        span.className = 'typewriter-text';
        div.appendChild(span);

        let charIndex = 0;
        function typeChar() {
            if (charIndex < text.length) {
                span.textContent += text[charIndex];
                charIndex++;
                // Случайная скорость: 5–95 мс на символ
                const delay = 5 + Math.random() * 90;
                setTimeout(typeChar, delay);
            } else {
                currentDivIndex++;
                typeNextDiv();
            }
        }
        typeChar();
    }
    typeNextDiv();
}

// Функция для отображения модального окна с изображениями
function showImageArchiveModal() {
    const modal = document.getElementById('image-archive-modal');
    const imageGrid = document.getElementById('image-grid');
    if (!modal || !imageGrid) {
        console.error('Modal or image grid not found');
        return;
    }

    // Очищаем сетку
    imageGrid.innerHTML = '';
    // Добавляем изображения
    archiveImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'archive-image';
        img.alt = `Archive image ${index + 1}`;
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            img.src = '';
            img.alt = 'Ошибка загрузки';
        };
        img.addEventListener('click', () => {
            selectArchiveImage(src);
            modal.style.display = 'none';
        });
        imageGrid.appendChild(img);
    });

    modal.style.display = 'flex';
}

// Функция для выбора изображения из архива
function selectArchiveImage(src) {
    if (!window.quantumSketch) {
        console.error('quantumSketch not initialized');
        return;
    }
    console.log(`Attempting to load archive image: ${src}`);
    window.quantumSketch.loadImage(src, function(img) {
        console.log('Archive image loaded successfully, dimensions: ' + img.width + ', ' + img.height);
        window.img = img;
        window.initializeParticles(img);
        var thumbnails = document.querySelectorAll('#thumbnail-portrait');
        console.log('Found thumbnails: ' + thumbnails.length);
        thumbnails.forEach(function(thumbnail) {
            thumbnail.src = src;
            thumbnail.style.display = (window.currentStep === 4 || window.currentStep === 5) ? 'block' : 'none';
            console.log('Updated thumbnail src: ' + thumbnail.src + ', display: ' + thumbnail.style.display);
        });
        window.moveToNextStep(2.1);
    }, function(err) {
        console.error(`Error loading archive image: ${src}, error: ${err}`);
        alert('Ошибка загрузки изображения из архива. Пожалуйста, попробуйте снова.');
    });
}

// Функция для запуска камеры
function startCamera() {
    const modal = document.getElementById('camera-modal');
    const video = document.getElementById('camera-video');
    if (!modal || !video) {
        console.error('Camera modal or video element not found');
        return;
    }

    // Запрашиваем доступ к камере
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            console.log('Camera access granted');
            cameraStream = stream;
            video.srcObject = stream;
            modal.style.display = 'flex';
        })
        .catch((err) => {
            console.error('Error accessing camera:', err);
            alert('Не удалось получить доступ к камере. Пожалуйста, разрешите доступ или используйте другое устройство.');
        });
}

// Функция для остановки камеры
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        console.log('Camera stream stopped');
    }
}

// Функция для захвата фото
function capturePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const modal = document.getElementById('camera-modal');
    if (!video || !canvas || !modal) {
        console.error('Video, canvas, or modal not found');
        return;
    }

    // Устанавливаем размеры canvas равными размерам видео
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Конвертируем canvas в изображение
    const imageUrl = canvas.toDataURL('image/png');
    console.log('Photo captured, dimensions: ' + canvas.width + ', ' + canvas.height);

    // Загружаем изображение в p5.js
    window.quantumSketch.loadImage(imageUrl, function(img) {
        console.log('Captured image loaded successfully, dimensions: ' + img.width + ', ' + img.height);
        window.img = img;
        window.initializeParticles(img);
        var thumbnails = document.querySelectorAll('#thumbnail-portrait');
        console.log('Found thumbnails: ' + thumbnails.length);
        thumbnails.forEach(function(thumbnail) {
            thumbnail.src = imageUrl;
            thumbnail.style.display = (window.currentStep === 4 || window.currentStep === 5) ? 'block' : 'none';
            console.log('Updated thumbnail src: ' + thumbnail.src + ', display: ' + thumbnail.style.display);
        });
        window.moveToNextStep(2.1);
        stopCamera();
        modal.style.display = 'none';
    }, function(err) {
        console.error('Error loading captured image:', err);
        alert('Ошибка обработки фото. Пожалуйста, попробуйте снова.');
    });
}

function initializeSteps() {
    console.log('initializeSteps: Found ' + document.querySelectorAll('.step').length + ' steps');
    var steps = document.querySelectorAll('.step');
    if (steps.length === 0) {
        console.error('No steps found in DOM');
        return;
    }
    steps.forEach(function(step, index) {
        step.style.display = index === 0 ? 'flex' : 'none';
        console.log('Step ' + step.id + ' initial display: ' + step.style.display);
    });
    window.currentStep = 0;

    var continueButtons = document.querySelectorAll('.continue');
    console.log('Found ' + continueButtons.length + ' continue buttons');
    continueButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            console.log('Continue button clicked, currentStep: ' + window.currentStep);
            const nextStep = stepTransitions[window.currentStep];
            if (nextStep === undefined) {
                console.error('No next step defined for currentStep: ' + window.currentStep);
                return;
            }
            window.moveToNextStep(nextStep);
        });
    });

    var backButtons = document.querySelectorAll('.back');
    console.log('Found ' + backButtons.length + ' back buttons');
    backButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            console.log('Back button clicked, currentStep: ' + window.currentStep);
            const prevStep = stepTransitionsBack[window.currentStep];
            if (prevStep === undefined) {
                console.error('No previous step defined for currentStep: ' + window.currentStep);
                return;
            }
            window.moveToNextStep(prevStep);
        });
    });

    // Инициализация кнопки "Выбрать из архива"
    const archiveButton = document.getElementById('useArchive');
    if (archiveButton) {
        archiveButton.addEventListener('click', showImageArchiveModal);
    } else {
        console.warn('Archive button not found');
    }

    // Инициализация кнопки "Включить камеру"
    const cameraButton = document.getElementById('useCamera');
    if (cameraButton) {
        cameraButton.addEventListener('click', startCamera);
    } else {
        console.warn('Camera button not found');
    }

    // Инициализация кнопки закрытия модального окна архива
    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            const modal = document.getElementById('image-archive-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Инициализация кнопки закрытия модального окна камеры
    const closeCameraModal = document.getElementById('close-camera-modal');
    if (closeCameraModal) {
        closeCameraModal.addEventListener('click', () => {
            const modal = document.getElementById('camera-modal');
            if (modal) {
                modal.style.display = 'none';
                stopCamera();
            }
        });
    }

    // Инициализация кнопки захвата фото
    const captureButton = document.getElementById('capture-photo');
    if (captureButton) {
        captureButton.addEventListener('click', capturePhoto);
    } else {
        console.warn('Capture photo button not found');
    }

    console.log('quantumSketch initialized: ' + !!window.quantumSketch);
    var canvas = document.querySelector('#quantumCanvas');
    if (canvas) {
        canvas.style.display = 'none';
        console.log('Canvas hidden on initialization');
    } else {
        console.warn('Canvas not found during initialization, waiting for p5.js setup');
    }
}

function showStep(stepIndex) {
    console.log('showStep called with stepIndex: ' + stepIndex);
    var steps = document.querySelectorAll('.step');
    steps.forEach(function(step) {
        var stepId = step.id.replace('step-', '');
        const isActive = stepId === stepIndex.toString();
        step.style.display = isActive ? 'flex' : 'none';
        if (isActive) {
            console.log('Displaying step ' + stepId + ' with display: ' + step.style.display);
            // Запускаем typewriter-анимацию для text-block
            const textBlock = step.querySelector('.text-block');
            if (textBlock) {
                // Скрываем все div в text-block до начала анимации
                textBlock.querySelectorAll('div').forEach(div => {
                    div.style.visibility = 'hidden';
                    div.textContent = div.textContent.trim(); // Удаляем лишние пробелы
                });
                typewriter(textBlock, () => {
                    console.log('Typewriter animation finished for step ' + stepId);
                });
            } else {
                console.log('No text-block found for step ' + stepId);
            }
        }
    });
    window.currentStep = stepIndex;
}

window.moveToNextStep = function(stepIndex) {
    console.log('moveToNextStep called with stepIndex: ' + stepIndex);
    showStep(stepIndex);
};

window.setLanguageAndNext = function(language) {
    console.log('setLanguageAndNext called with language: ' + language);
    window.setLanguage(language);
    setTimeout(() => window.moveToNextStep(1), 100); // Delay to ensure text is loaded
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing steps');
    initializeSteps();
});
