console.log('main.js loaded');

window.currentStep = 0;
window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;

// Step transitions (unchanged)
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

// Упрощённая typewriter (без анимации chars, только fade)
function typewriter(element, callback) {
    const paras = element.querySelectorAll('p, h2');
    paras.forEach(p => p.style.opacity = 0);
    let index = 0;
    function fadeNext() {
        if (index >= paras.length) {
            if (callback) callback();
            return;
        }
        paras[index].style.opacity = 1;
        index++;
        setTimeout(fadeNext, 300); // Последовательный fade
    }
    fadeNext();
}

function showImageArchiveModal() {
    const modal = document.getElementById('image-archive-modal');
    const imageGrid = document.getElementById('image-grid');
    imageGrid.innerHTML = '';
    archiveImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'archive-image';
        img.alt = 'Архивное изображение';
        img.addEventListener('click', () => {
            selectArchiveImage(src);
            modal.style.display = 'none';
        });
        imageGrid.appendChild(img);
    });
    modal.style.display = 'flex';
}

function selectArchiveImage(src) {
    window.quantumSketch.loadImage(src, function(img) {
        window.img = img;
        window.initializeParticles(img);
        document.querySelectorAll('#thumbnail-portrait').forEach(thumbnail => {
            thumbnail.src = src;
            thumbnail.style.display = 'block';
        });
        window.moveToNextStep(2.1);
    });
}

function startCamera() {
    const modal = document.getElementById('camera-modal');
    const video = document.getElementById('camera-video');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            cameraStream = stream;
            video.srcObject = stream;
            modal.style.display = 'flex';
        })
        .catch(err => console.error('Camera error:', err));
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
}

function capturePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const modal = document.getElementById('camera-modal');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 800, 800);
    const imageUrl = canvas.toDataURL('image/png');
    window.quantumSketch.loadImage(imageUrl, function(img) {
        window.img = img;
        window.initializeParticles(img);
        document.querySelectorAll('#thumbnail-portrait').forEach(thumbnail => {
            thumbnail.src = imageUrl;
            thumbnail.style.display = 'block';
        });
        window.moveToNextStep(2.1);
        stopCamera();
        modal.style.display = 'none';
    });
}

function initializeSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.display = index === 0 ? 'grid' : 'none';
        step.classList.toggle('active', index === 0); // Добавлено: активация класса для первого шага
    });
    window.currentStep = 0;

    document.querySelectorAll('.continue').forEach(button => {
        button.addEventListener('click', () => {
            const next = stepTransitions[window.currentStep];
            if (next) window.moveToNextStep(next);
        });
    });

    document.querySelectorAll('.back').forEach(button => {
        button.addEventListener('click', () => {
            const prev = stepTransitionsBack[window.currentStep];
            if (prev) window.moveToNextStep(prev);
        });
    });

    document.getElementById('useArchive').addEventListener('click', showImageArchiveModal);
    document.getElementById('useCamera').addEventListener('click', startCamera);
    document.getElementById('close-modal').addEventListener('click', () => document.getElementById('image-archive-modal').style.display = 'none');
    document.getElementById('close-camera-modal').addEventListener('click', () => {
        document.getElementById('camera-modal').style.display = 'none';
        stopCamera();
    });
    document.getElementById('capture-photo').addEventListener('click', capturePhoto);

    document.addEventListener('click', () => {
        if (window.initAudioContext) window.initAudioContext();
    }, { once: true });
}

function showStep(stepIndex) {
    document.querySelectorAll('.step').forEach(step => {
        const id = step.id.replace('step-', '');
        const isActive = (id == stepIndex); // Используем == для поддержки 2.1
        step.style.display = isActive ? 'grid' : 'none';
        step.classList.toggle('active', isActive); // Добавлено: переключение класса active
        if (isActive) {
            const textBlock = step.querySelector('.text-block');
            if (textBlock) typewriter(textBlock);
        }
    });
    window.currentStep = stepIndex;
}

window.moveToNextStep = function(stepIndex) {
    showStep(stepIndex);
};

window.updateTerminalLog = function() {
    const terminal = document.querySelector('.terminal-log');
    if (terminal) {
        terminal.innerHTML = window.terminalMessages.join('<br>');
        terminal.scrollTop = terminal.scrollHeight;
    }
};

window.setLanguageAndNext = function(language) {
    window.setLanguage(language);
    window.moveToNextStep(1);
};

document.addEventListener('DOMContentLoaded', initializeSteps);
