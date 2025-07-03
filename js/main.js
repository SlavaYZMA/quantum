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
let resonanceCanvas, resonanceCtx, mouseX = 0, mouseY = 0;
function initResonanceCanvas() {
    resonanceCanvas = document.getElementById('resonance-canvas');
    if (!resonanceCanvas) {
        console.error('Resonance canvas not found');
        return;
    }
    resonanceCanvas.width = window.innerWidth;
    resonanceCanvas.height = window.innerHeight;
    resonanceCtx = resonanceCanvas.getContext('2d');
    animateResonance();
}

// Анимация тени
function animateResonance() {
    if (!resonanceCtx) return;
    resonanceCtx.clearRect(0, 0, resonanceCanvas.width, resonanceCanvas.height);
    
    // Рисуем шум для эффекта "резонанса"
    for (let x = 0; x < resonanceCanvas.width; x += 10) {
        for (let y = 0; y < resonanceCanvas.height; y += 10) {
            const dist = Math.hypot(x - mouseX, y - mouseY);
            const influence = Math.max(0, 1 - dist / window.mouseInfluenceRadius);
            const noise = Math.random() * window.noiseScale * influence;
            resonanceCtx.fillStyle = `rgba(167, 139, 250, ${0.3 + noise})`;
            resonanceCtx.beginPath();
            resonanceCtx.arc(x, y, 5 + 2 * Math.sin(Date.now() / 1000), 0, Math.PI * 2);
            resonanceCtx.fill();
        }
    }
    
    // Рисуем силуэт человека
    resonanceCtx.fillStyle = `rgba(245, 243, 255, ${0.4 + 0.1 * Math.sin(Date.now() / 800)})`;
    resonanceCtx.beginPath();
    resonanceCtx.moveTo(mouseX - 50, mouseY);
    resonanceCtx.quadraticCurveTo(mouseX, mouseY - 100, mouseX + 50, mouseY);
    resonanceCtx.quadraticCurveTo(mouseX + 25, mouseY + 50, mouseX, mouseY + 100);
    resonanceCtx.quadraticCurveTo(mouseX - 25, mouseY + 50, mouseX - 50, mouseY);
    resonanceCtx.fill();
    
    requestAnimationFrame(animateResonance);
}

// Отслеживание мыши
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Функция для ожидания инициализации quantumSketch
function waitForQuantumSketch(callback, maxAttempts = 50, attempt = 0) {
    if (window.quantumSketch) {
        console.log('quantumSketch ready');
        callback();
    } else if (attempt >= maxAttempts) {
        console.error('quantumSketch initialization timed out');
        alert('Система не готова. Попробуйте загрузить изображение через файл.');
    } else {
        console.log('Waiting for quantumSketch initialization... Attempt ' + (attempt + 1));
        setTimeout(() => waitForQuantumSketch(callback, maxAttempts, attempt + 1), 100);
    }
}

// Функция для обработки загруженного файла
function handleFileUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        processImage(imageUrl);
    };
    reader.onerror = function() {
        console.error('Error reading file');
        alert('Ошибка загрузки файла. Пожалуйста, попробуйте снова.');
    };
    reader.readAsDataURL(file);
}

// Функция для обработки изображения
function processImage(imageUrl) {
    waitForQuantumSketch(() => {
        if (!window.quantumSketch) {
            console.error('quantumSketch still not initialized');
            alert('Система не готова. Пожалуйста, попробуйте снова.');
            return;
        }
        window.quantumSketch.loadImage(imageUrl, function(img) {
            console.log('Image loaded successfully, dimensions: ' + img.width + ', ' + img.height);
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
        }, function(err) {
            console.error('Error loading image:', err);
            alert('Ошибка обработки изображения. Пожалуйста, попробуйте снова.');
        });
    });
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
            processImage(src);
            modal.style.display = 'none';
        });
        imageGrid.appendChild(img);
    });

    modal.style.display = 'flex';
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
    processImage(imageUrl);
    stopCamera();
    modal.style.display = 'none';
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

    const uploadInput = document.getElementById('uploadImage');
    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
            }
        });
    } else {
        console.warn('Upload input not found');
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
    initResonanceCanvas();
});
