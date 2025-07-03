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

// Canvas для фона с тенью
let pulseCanvas, pulseCtx, mouseX = 0, mouseY = 0;
function initPulseCanvas() {
    pulseCanvas = document.getElementById('pulse-canvas');
    if (!pulseCanvas) {
        console.error('Pulse canvas not found');
        return;
    }
    pulseCanvas.width = window.innerWidth;
    pulseCanvas.height = window.innerHeight;
    pulseCtx = pulseCanvas.getContext('2d');
    animatePulse();
}

// Анимация тени
function animatePulse() {
    if (!pulseCtx) return;
    pulseCtx.clearRect(0, 0, pulseCanvas.width, pulseCanvas.height);
    
    // Рисуем шум для эффекта "пульса"
    for (let x = 0; x < pulseCanvas.width; x += 10) {
        for (let y = 0; y < pulseCanvas.height; y += 10) {
            const dist = Math.hypot(x - mouseX, y - mouseY);
            const influence = Math.max(0, 1 - dist / window.mouseInfluenceRadius);
            const noise = Math.random() * window.noiseScale * influence;
            pulseCtx.fillStyle = `rgba(139, 92, 246, ${0.3 + noise})`;
            pulseCtx.beginPath();
            pulseCtx.arc(x, y, 5, 0, Math.PI * 2);
            pulseCtx.fill();
        }
    }
    
    // Рисуем силуэт человека
    pulseCtx.fillStyle = `rgba(243, 232, 255, ${0.4 + 0.1 * Math.sin(Date.now() / 1000)})`;
    pulseCtx.beginPath();
    pulseCtx.moveTo(mouseX - 50, mouseY);
    pulseCtx.quadraticCurveTo(mouseX, mouseY - 100, mouseX + 50, mouseY);
    pulseCtx.quadraticCurveTo(mouseX + 25, mouseY + 50, mouseX, mouseY + 100);
    pulseCtx.quadraticCurveTo(mouseX - 25, mouseY + 50, mouseX - 50, mouseY);
    pulseCtx.fill();
    
    requestAnimationFrame(animatePulse);
}

// Отслеживание мыши
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Функция для ожидания инициализации quantumSketch
function waitForQuantumSketch(callback) {
    if (window.quantumSketch) {
        console.log('quantumSketch ready');
        callback();
    } else {
        console.log('Waiting for quantumSketch initialization...');
        setTimeout(() => waitForQuantumSketch(callback), 100);
    }
}

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

// Функция для отображения модального окна с изображениями
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
    console.log(`Attempting to load archive image: ${src}`);
    waitForQuantumSketch(() => {
        if (!window.quantumSketch) {
            console.error('quantumSketch still not initialized');
            alert('Система не готова. Пожалуйста, попробуйте снова.');
            return;
        }
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

    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    let sx, sy, sWidth, sHeight;

    const videoAspect = videoWidth / videoHeight;
    const canvasAspect = 1;
    if (videoAspect > canvasAspect) {
        sWidth = videoHeight * canvasAspect;
        sHeight = videoHeight;
        sx = (videoWidth - sWidth) / 2;
        sy = 0;
    } else {
        sWidth = videoWidth;
        sHeight = videoWidth / canvasAspect;
        sx = 0;
        sy = (videoHeight - sHeight) / 2;
    }

    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
    console.log('Photo captured, dimensions: ' + canvas.width + ', ' + canvas.height);

    const imageUrl = canvas.toDataURL('image/png');

    waitForQuantumSketch(() => {
        if (!window.quantumSketch) {
            console.error('quantumSketch still not initialized');
            alert('Система не готова. Пожалуйста, попробуйте снова.');
            return;
        }
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

    const archiveButton = document.getElementById('useArchive');
    if (archiveButton) {
        archiveButton.addEventListener('click', showImageArchiveModal);
    } else {
        console.warn('Archive button not found');
    }

    const cameraButton = document.getElementById('useCamera');
    if (cameraButton) {
        cameraButton.addEventListener('click', startCamera);
    } else {
        console.warn('Camera button not found');
    }

    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            const modal = document.getElementById('image-archive-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }

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

    initPulseCanvas();
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
            const textBlock = step.querySelector('.text-block');
            if (textBlock) {
                textBlock.querySelectorAll('div').forEach(div => {
                    div.style.visibility = 'hidden';
                    div.textContent = div.textContent.trim();
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
    setTimeout(() => window.moveToNextStep(1), 100);
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing steps');
    initializeSteps();
});
