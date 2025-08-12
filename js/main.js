console.log('main.js loaded');

window.currentStep = 0;
window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;

// Переходы между шагами
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

// Изображения архива
const archiveImages = [
    '/public/images/image1.jpg',
    '/public/images/image2.jpg',
    '/public/images/image3.jpg'
];

let cameraStream = null;

// Анимация печатной машинки
function typewriter(element, callback) {
    const divs = element.querySelectorAll('div');
    if (divs.length === 0) {
        console.log('No divs for typewriter');
        if (callback) callback();
        return;
    }

    let currentDivIndex = 0;
    function typeNextDiv() {
        if (currentDivIndex >= divs.length) {
            element.style.height = 'auto';
            const step = element.closest('.step');
            if (step) step.style.height = 'auto';
            if (callback) callback();
            return;
        }

        const div = divs[currentDivIndex];
        const text = div.textContent.trim();
        div.textContent = '';
        div.style.visibility = 'visible';
        const span = document.createElement('span');
        span.className = 'typewriter-text';
        div.appendChild(span);

        let charIndex = 0;
        function typeChar() {
            if (charIndex < text.length) {
                span.textContent += text[charIndex];
                charIndex++;
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

// Показ модалки архива
function showImageArchiveModal() {
    const modal = document.getElementById('image-archive-modal');
    const imageGrid = document.getElementById('image-grid');
    if (!modal || !imageGrid) {
        console.error('Modal or image grid not found');
        return;
    }

    imageGrid.innerHTML = '';
    archiveImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'archive-image';
        img.alt = `Архивное изображение ${index + 1}`;
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            alert('Ошибка загрузки изображения.');
        };
        img.addEventListener('click', () => {
            if (!window.quantumSketch) {
                alert('Изображение будет выбрано после инициализации визуализации.');
                modal.style.display = 'none';
                return;
            }
            selectArchiveImage(src);
            modal.style.display = 'none';
        });
        imageGrid.appendChild(img);
    });

    modal.style.display = 'flex';
}

// Выбор изображения из архива
function selectArchiveImage(src) {
    console.log(`Loading archive image: ${src}`);
    window.quantumSketch.loadImage(src, function (img) {
        window.img = img;
        window.initializeParticles(img);
        document.querySelectorAll('#thumbnail-portrait').forEach(thumbnail => {
            thumbnail.src = src;
            thumbnail.style.display = (window.currentStep === 4 || window.currentStep === 5) ? 'block' : 'none';
        });
        window.moveToNextStep(2.1);
    }, function (err) {
        console.error(`Error loading archive image: ${err}`);
        alert('Ошибка загрузки изображения.');
    });
}

// Запуск камеры
function startCamera() {
    const modal = document.getElementById('camera-modal');
    const video = document.getElementById('camera-video');
    if (!modal || !video) return;

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            cameraStream = stream;
            video.srcObject = stream;
            modal.style.display = 'flex';
        })
        .catch(err => {
            console.error('Camera error:', err);
            alert('Не удалось получить доступ к камере.');
        });
}

// Остановка камеры
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

// Захват фото
function capturePhoto() {
    if (!window.quantumSketch) {
        alert('Невозможно обработать фото до инициализации визуализации.');
        return;
    }

    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const modal = document.getElementById('camera-modal');
    if (!video || !canvas || !modal) return;

    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const videoAspect = video.videoWidth / video.videoHeight;
    const canvasAspect = 1;
    let sx, sy, sWidth, sHeight;

    if (videoAspect > canvasAspect) {
        sWidth = video.videoHeight * canvasAspect;
        sHeight = video.videoHeight;
        sx = (video.videoWidth - sWidth) / 2;
        sy = 0;
    } else {
        sWidth = video.videoWidth;
        sHeight = video.videoWidth / canvasAspect;
        sx = 0;
        sy = (video.videoHeight - sHeight) / 2;
    }

    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL('image/png');
    window.quantumSketch.loadImage(imageUrl, function (img) {
        window.img = img;
        window.initializeParticles(img);
        document.querySelectorAll('#thumbnail-portrait').forEach(thumbnail => {
            thumbnail.src = imageUrl;
            thumbnail.style.display = (window.currentStep === 4 || window.currentStep === 5) ? 'block' : 'none';
        });
        window.moveToNextStep(2.1);
        stopCamera();
        modal.style.display = 'none';
    }, function (err) {
        console.error('Error loading photo:', err);
        alert('Ошибка обработки фото.');
    });
}

// Инициализация шагов
function initializeSteps() {
    var steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.display = index === 0 ? 'flex' : 'none';
    });
    window.currentStep = 0;

    document.querySelectorAll('.continue').forEach(button => {
        button.addEventListener('click', () => {
            const nextStep = stepTransitions[window.currentStep];
            if (nextStep !== undefined) window.moveToNextStep(nextStep);
        });
    });

    document.querySelectorAll('.back').forEach(button => {
        button.addEventListener('click', () => {
            const prevStep = stepTransitionsBack[window.currentStep];
            if (prevStep !== undefined) window.moveToNextStep(prevStep);
        });
    });

    const archiveButton = document.getElementById('useArchive');
    if (archiveButton) archiveButton.addEventListener('click', showImageArchiveModal);

    const cameraButton = document.getElementById('useCamera');
    if (cameraButton) cameraButton.addEventListener('click', startCamera);

    const closeModal = document.getElementById('close-modal');
    if (closeModal) closeModal.addEventListener('click', () => {
        const modal = document.getElementById('image-archive-modal');
        if (modal) modal.style.display = 'none';
    });

    const closeCameraModal = document.getElementById('close-camera-modal');
    if (closeCameraModal) closeCameraModal.addEventListener('click', () => {
        const modal = document.getElementById('camera-modal');
        if (modal) modal.style.display = 'none';
        stopCamera();
    });

    const captureButton = document.getElementById('capture-photo');
    if (captureButton) captureButton.addEventListener('click', capturePhoto);

    document.addEventListener('click', () => {
        if (typeof window.initAudioContext === 'function') {
            window.initAudioContext();
        }
    }, { once: true });

    const canvas = document.querySelector('#quantumCanvas');
    if (canvas) canvas.style.display = 'none';
}

function showStep(stepIndex) {
    document.querySelectorAll('.step').forEach(step => {
        const stepId = step.id.replace('step-', '');
        const isActive = stepId === stepIndex.toString();
        step.style.display = isActive ? 'flex' : 'none';
        if (isActive) {
            const textBlock = step.querySelector('.text-block');
            if (textBlock) {
                textBlock.querySelectorAll('div').forEach(div => {
                    div.style.visibility = 'hidden';
                    div.textContent = div.textContent.trim();
                });
                typewriter(textBlock);
            }
        }
    });
    window.currentStep = stepIndex;
}

window.moveToNextStep = function (stepIndex) {
    showStep(stepIndex);
    const canvas = document.querySelector('#quantumCanvas');
    if (canvas) canvas.style.display = (stepIndex === 4 || stepIndex === 5) ? 'block' : 'none';
};

document.addEventListener('DOMContentLoaded', initializeSteps);
