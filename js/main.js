console.log('main.js loaded');

window.currentStep = 0;
window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;

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

const archiveImages = [
    '/public/images/image1.jpg',
    '/public/images/image2.jpg',
    '/public/images/image3.jpg'
];

let cameraStream = null;

function typewriter(element, callback) {
    const divs = element.querySelectorAll('div');
    if (divs.length === 0) {
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
                setTimeout(typeChar, 5 + Math.random() * 90);
            } else {
                currentDivIndex++;
                typeNextDiv();
            }
        }
        typeChar();
    }
    typeNextDiv();
}

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
            img.src = '';
            img.alt = 'Ошибка загрузки';
            alert('Ошибка загрузки изображения из архива.');
        };
        img.addEventListener('click', () => {
            if (!window.quantumSketch) {
                alert('Изображение выбрано, но обработка будет доступна после загрузки модуля.');
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

function selectArchiveImage(src) {
    console.log(`Attempting to load archive image: ${src}`);
    window.quantumSketch.loadImage(src, function(img) {
        window.img = img;
        window.initializeParticles(img);
        document.querySelectorAll('#thumbnail-portrait').forEach(thumbnail => {
            thumbnail.src = src;
            thumbnail.style.display = (window.currentStep === 4 || window.currentStep === 5) ? 'block' : 'none';
        });
        window.moveToNextStep(2.1);
    }, function(err) {
        console.error(`Error loading archive image: ${src}`, err);
        alert('Ошибка загрузки изображения из архива.');
    });
}

function startCamera() {
    const modal = document.getElementById('camera-modal');
    const video = document.getElementById('camera-video');
    if (!modal || !video) {
        console.error('Camera modal or video element not found');
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            cameraStream = stream;
            video.srcObject = stream;
            modal.style.display = 'flex';
        })
        .catch((err) => {
            console.error('Error accessing camera:', err);
            alert('Не удалось получить доступ к камере.');
        });
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

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

    if (!window.quantumSketch) {
        alert('Фото сделано, но обработка будет доступна после загрузки модуля.');
        modal.style.display = 'none';
        stopCamera();
        return;
    }

    const imageUrl = canvas.toDataURL('image/png');
    window.quantumSketch.loadImage(imageUrl, function(img) {
        window.img = img;
        window.initializeParticles(img);
        document.querySelectorAll('#thumbnail-portrait').forEach(thumbnail => {
            thumbnail.src = imageUrl;
            thumbnail.style.display = (window.currentStep === 4 || window.currentStep === 5) ? 'block' : 'none';
        });
        window.moveToNextStep(2.1);
        stopCamera();
        modal.style.display = 'none';
    }, function(err) {
        console.error('Error loading captured image:', err);
        alert('Ошибка обработки фото.');
    });
}

function initializeSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.display = index === 0 ? 'flex' : 'none';
    });
    window.currentStep = 0;

    document.querySelectorAll('.continue').forEach(button => {
        button.addEventListener('click', () => {
            const nextStep = stepTransitions[window.currentStep];
            if (nextStep !== undefined) {
                window.moveToNextStep(nextStep);
            }
        });
    });

    document.querySelectorAll('.back').forEach(button => {
        button.addEventListener('click', () => {
            const prevStep = stepTransitionsBack[window.currentStep];
            if (prevStep !== undefined) {
                window.moveToNextStep(prevStep);
            }
        });
    });

    const archiveButton = document.getElementById('useArchive');
    if (archiveButton) archiveButton.addEventListener('click', showImageArchiveModal);

    const cameraButton = document.getElementById('useCamera');
    if (cameraButton) cameraButton.addEventListener('click', startCamera);

    const closeModal = document.getElementById('close-modal');
    if (closeModal) closeModal.addEventListener('click', () => {
        document.getElementById('image-archive-modal').style.display = 'none';
    });

    const closeCameraModal = document.getElementById('close-camera-modal');
    if (closeCameraModal) closeCameraModal.addEventListener('click', () => {
        document.getElementById('camera-modal').style.display = 'none';
        stopCamera();
    });

    const captureButton = document.getElementById('capture-photo');
    if (captureButton) captureButton.addEventListener('click', capturePhoto);

    document.addEventListener('click', () => {
        if (typeof window.initAudioContext === 'function') {
            window.initAudioContext();
        }
    }, { once: true });
}

function showStep(stepIndex) {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
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

window.moveToNextStep = function(stepIndex) {
    showStep(stepIndex);
    const canvas = document.querySelector('#quantumCanvas');
    if (canvas) {
        canvas.style.display = (stepIndex === 4 || stepIndex === 5) ? 'block' : 'none';
    }
};

document.addEventListener('DOMContentLoaded', initializeSteps);
