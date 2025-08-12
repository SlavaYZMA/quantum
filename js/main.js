console.log('main.js loaded');

window.currentStep = 0;
window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;

const stepIds = ['step-0', 'step-1', 'step-2', 'step-2.1', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'];
const totalSteps = stepIds.length;

const archiveImages = [
    '/public/images/image1.jpg',
    '/public/images/image2.jpg',
    '/public/images/image3.jpg'
];

let cameraStream = null;

// Hide all steps except the current one
function updateStepVisibility() {
    document.querySelectorAll('.step').forEach((section, index) => {
        if (index === window.currentStep) {
            section.style.display = 'block';
            setTimeout(() => section.classList.add('visible'), 10); // Trigger animation
        } else {
            section.style.display = 'none';
            section.classList.remove('visible');
        }
    });
    // Hide subsections unless on step-2 and explicitly shown
    document.getElementById('image-archive-section').style.display = 'none';
    document.getElementById('image-archive-section').classList.remove('visible');
    document.getElementById('camera-section').style.display = 'none';
    document.getElementById('camera-section').classList.remove('visible');
}

function typewriter(element) {
    const elements = element.querySelectorAll('div, p, h2');
    let index = 0;
    function typeNext() {
        if (index >= elements.length) return;
        const el = elements[index];
        const text = el.textContent.trim();
        el.textContent = '';
        let charIndex = 0;
        function typeChar() {
            if (charIndex < text.length) {
                el.textContent += text[charIndex];
                charIndex++;
                setTimeout(typeChar, 20 + Math.random() * 50);
            } else {
                index++;
                typeNext();
            }
        }
        typeChar();
    }
    typeNext();
}

function showImageArchiveSection() {
    const section = document.getElementById('image-archive-section');
    const grid = document.getElementById('image-grid');
    grid.innerHTML = '';
    archiveImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'archive-image';
        img.onclick = () => {
            selectArchiveImage(src);
            section.style.display = 'none';
        };
        grid.appendChild(img);
    });
    section.style.display = 'block';
    setTimeout(() => section.classList.add('visible'), 10);
}

function startCamera() {
    const section = document.getElementById('camera-section');
    const video = document.getElementById('camera-video');
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        cameraStream = stream;
        video.srcObject = stream;
        section.style.display = 'block';
        setTimeout(() => section.classList.add('visible'), 10);
    }).catch(err => console.error('Camera error:', err));
}

function stopCamera() {
    const section = document.getElementById('camera-section');
    section.classList.remove('visible');
    setTimeout(() => section.style.display = 'none', 500);
    if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
}

function capturePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 400, 400);
    const url = canvas.toDataURL('image/png');
    loadImage(url, img => {
        window.img = img;
        window.initializeParticles(img);
        document.querySelectorAll('.thumbnail-portrait').forEach(thumb => thumb.src = url);
        moveToNextStep('2.1');
        stopCamera();
    });
}

function selectArchiveImage(src) {
    loadImage(src, img => {
        window.img = img;
        window.initializeParticles(img);
        document.querySelectorAll('.thumbnail-portrait').forEach(thumb => thumb.src = src);
        moveToNextStep('2.1');
    });
}

window.moveToNextStep = function(stepIndex) {
    const stepId = `step-${stepIndex}`.replace('.', '.');
    const stepIdx = stepIds.indexOf(stepId);
    if (stepIdx >= 0 && stepIdx < totalSteps) {
        window.currentStep = stepIdx;
        updateStepVisibility();
        const section = document.getElementById(stepId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            const textBlock = section.querySelector('.text-block');
            if (textBlock && !textBlock.classList.contains('animated')) {
                typewriter(textBlock);
                textBlock.classList.add('animated');
            }
        }
        const progress = ((window.currentStep + 1) / totalSteps) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.querySelectorAll('#menu a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${stepId}`);
        });
        if (stepId === 'step-4' || stepId === 'step-5') {
            if (typeof switchCanvasParent === 'function') {
                switchCanvasParent(window.currentStep);
            } else {
                console.warn('switchCanvasParent not defined, skipping');
            }
            if (typeof startAnimation === 'function') {
                startAnimation();
            } else {
                console.warn('startAnimation not defined, skipping');
            }
            window.terminalMessages = [`[INIT] Started for ${stepId}`];
            window.updateTerminalLog();
        } else {
            if (typeof noLoop === 'function') {
                noLoop();
            } else {
                console.warn('noLoop not defined, skipping');
            }
        }
    }
};

window.updateTerminalLog = function() {
    const terminals = document.querySelectorAll('.terminal-log');
    terminals.forEach(terminal => {
        terminal.innerHTML = window.terminalMessages.join('<br>');
        terminal.scrollTop = terminal.scrollHeight;
    });
};

window.setLanguageAndStay = function(lang) {
    window.setLanguage(lang);
    moveToNextStep('1'); // Automatically move to step-1 after language selection
};

document.addEventListener('DOMContentLoaded', () => {
    updateStepVisibility(); // Show only step-0 initially

    document.querySelectorAll('#menu a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const stepId = a.getAttribute('href').substring(1);
            const stepIndex = stepIds.indexOf(stepId);
            if (stepIndex <= window.currentStep) { // Allow navigation only to completed steps
                window.currentStep = stepIndex;
                updateStepVisibility();
                document.getElementById(stepId).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    document.getElementById('hamburger').addEventListener('click', () => {
        const menu = document.getElementById('menu');
        menu.classList.toggle('visible');
    });

    document.getElementById('uploadImage').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
            const file = e.target.files[0];
            loadImage(URL.createObjectURL(file), img => {
                window.img = img;
                window.initializeParticles(img);
                document.querySelectorAll('.thumbnail-portrait').forEach(thumb => thumb.src = URL.createObjectURL(file));
                moveToNextStep('2.1');
            });
        };
        input.click();
    });

    document.getElementById('useArchive').addEventListener('click', showImageArchiveSection);
    document.getElementById('useCamera').addEventListener('click', startCamera);
    document.getElementById('capture-photo').addEventListener('click', capturePhoto);
    document.getElementById('saveImage').addEventListener('click', () => {
        const name = document.getElementById('portraitName').value || 'quantum_portrait';
        if (typeof saveCanvas === 'function') {
            saveCanvas(name, 'png');
            window.terminalMessages.push(`[SAVE] Saved as ${name}.png`);
            window.updateTerminalLog();
        } else {
            console.warn('saveCanvas not defined, cannot save image');
        }
    });
    document.getElementById('shareObservation').addEventListener('click', () => window.open('https://t.me/quantum_portrait_channel', '_blank'));
    document.getElementById('restart').addEventListener('click', () => window.location.reload());
    document.getElementById('archive').addEventListener('click', () => window.open('https://t.me/quantum_portrait_channel', '_blank'));
    document.getElementById('aboutAuthors').addEventListener('click', () => window.location.href = './about.html');

    document.getElementById('close-archive-section').addEventListener('click', () => {
        const section = document.getElementById('image-archive-section');
        section.classList.remove('visible');
        setTimeout(() => section.style.display = 'none', 500);
    });
    document.getElementById('close-camera-section').addEventListener('click', () => {
        stopCamera();
    });

    document.querySelectorAll('.continue').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextIndex = window.currentStep + 1;
            if (nextIndex < totalSteps) {
                moveToNextStep(stepIds[nextIndex].replace('step-', ''));
            }
        });
    });
    document.querySelectorAll('.back').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevIndex = window.currentStep - 1;
            if (prevIndex >= 0) {
                moveToNextStep(stepIds[prevIndex].replace('step-', ''));
            }
        });
    });

    document.addEventListener('click', () => window.initAudioContext && window.initAudioContext(), { once: true });
});
