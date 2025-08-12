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
    console.log('updateStepVisibility called, currentStep:', window.currentStep);
    const currentStepId = stepIds[window.currentStep];
    document.querySelectorAll('.step').forEach((section) => {
        console.log(`Section ${section.id}, should be visible: ${section.id === currentStepId}, classes: ${section.className}`);
        if (section.id === currentStepId) {
            section.style.display = 'block';
            setTimeout(() => {
                section.classList.add('visible');
                console.log(`Made ${section.id} visible`);
            }, 10);
        } else {
            section.style.display = 'none';
            section.classList.remove('visible');
            console.log(`Hid ${section.id}`);
        }
    });
    // Explicitly hide subsections to prevent overlap
    const archiveSection = document.getElementById('image-archive-section');
    if (archiveSection && window.currentStep !== stepIds.indexOf('step-2')) {
        archiveSection.style.display = 'none';
        archiveSection.classList.remove('visible');
        console.log('Hid image-archive-section');
    }
    const cameraSection = document.getElementById('camera-section');
    if (cameraSection && window.currentStep !== stepIds.indexOf('step-2')) {
        cameraSection.style.display = 'none';
        cameraSection.classList.remove('visible');
        console.log('Hid camera-section');
    }
    // Manage canvas visibility
    const canvases = document.getElementsByTagName('canvas');
    for (let canvas of canvases) {
        if (canvas.id !== 'camera-canvas') {
            canvas.style.display = window.currentStep >= stepIds.indexOf('step-4') ? 'block' : 'none';
            console.log(`Canvas ${canvas.id || 'unnamed'} display set to: ${canvas.style.display}`);
        }
    }
    // Ensure canvas-container is hidden unless needed
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        canvasContainer.style.display = window.currentStep >= stepIds.indexOf('step-4') ? 'block' : 'none';
        console.log(`canvas-container display set to: ${canvasContainer.style.display}`);
    }
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
    console.log('showImageArchiveSection called');
    const section = document.getElementById('image-archive-section');
    const grid = document.getElementById('image-grid');
    grid.innerHTML = '';
    archiveImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'archive-image';
        img.onclick = () => selectArchiveImage(src);
        grid.appendChild(img);
    });
    section.style.display = 'block';
    setTimeout(() => {
        section.classList.add('visible');
        console.log('image-archive-section made visible');
    }, 10);
}

function startCamera() {
    console.log('startCamera called');
    const section = document.getElementById('camera-section');
    const video = document.getElementById('camera-video');
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        cameraStream = stream;
        video.srcObject = stream;
        section.style.display = 'block';
        setTimeout(() => {
            section.classList.add('visible');
            console.log('camera-section made visible');
        }, 10);
    }).catch(err => console.error('Camera error:', err));
}

function stopCamera() {
    console.log('stopCamera called');
    const section = document.getElementById('camera-section');
    section.classList.remove('visible');
    setTimeout(() => {
        section.style.display = 'none';
        console.log('camera-section hidden');
    }, 500);
    if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
}

function capturePhoto() {
    console.log('capturePhoto called');
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 400, 400);
    const url = canvas.toDataURL('image/png');
    window.loadImage(url, img => {
        window.img = img;
        try {
            window.initializeParticles(img);
            console.log('initializeParticles completed for camera');
        } catch (err) {
            console.error('Error in initializeParticles (camera):', err);
        }
        document.querySelectorAll('.thumbnail-portrait').forEach(thumb => thumb.src = url);
        moveToNextStep('2.1');
        stopCamera();
    });
}

function selectArchiveImage(src) {
    console.log('selectArchiveImage called with:', src);
    const archiveSection = document.getElementById('image-archive-section');
    // Update thumbnails and hide archive section
    document.querySelectorAll('.thumbnail-portrait').forEach(thumb => {
        thumb.src = src;
        console.log('Updated thumbnail:', thumb.id || 'unnamed');
    });
    archiveSection.classList.remove('visible');
    setTimeout(() => {
        archiveSection.style.display = 'none';
        console.log('image-archive-section hidden');
        moveToNextStep('2.1');
    }, 500);
    // Load and process image
    window.loadImage(src, img => {
    window.img = img;
    console.log('Image loaded for initializeParticles:', img, 'pixels:', img.pixels);
    try {
        window.initializeParticles(img);
        console.log('initializeParticles completed');
    } catch (err) {
        console.error('Error in initializeParticles:', err);
    }
});
}

window.moveToNextStep = function(stepIndex) {
    console.log('moveToNextStep called with:', stepIndex);
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
            console.log(`Scrolled to ${stepId}`);
        } else {
            console.error(`Section ${stepId} not found in DOM`);
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
    } else {
        console.error(`Invalid step index: ${stepIdx} for stepId: ${stepId}`);
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
    console.log('setLanguageAndStay called with:', lang);
    window.setLanguage(lang);
    moveToNextStep('1');
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
    updateStepVisibility();

    document.querySelectorAll('#menu a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const stepId = a.getAttribute('href').substring(1);
            const stepIndex = stepIds.indexOf(stepId);
            if (stepIndex <= window.currentStep) {
                window.currentStep = stepIndex;
                updateStepVisibility();
                document.getElementById(stepId).scrollIntoView({ behavior: 'smooth' });
                console.log(`Menu clicked, moved to ${stepId}`);
            }
        });
    });

    document.getElementById('hamburger').addEventListener('click', () => {
        const menu = document.getElementById('menu');
        menu.classList.toggle('visible');
        console.log('Hamburger menu toggled');
    });

    document.getElementById('uploadImage').addEventListener('click', () => {
        console.log('uploadImage clicked');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
            const file = e.target.files[0];
            window.loadImage(URL.createObjectURL(file), img => {
                window.img = img;
                try {
                    window.initializeParticles(img);
                    console.log('initializeParticles completed for upload');
                } catch (err) {
                    console.error('Error in initializeParticles (upload):', err);
                }
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
        setTimeout(() => {
            section.style.display = 'none';
            console.log('close-archive-section clicked');
        }, 500);
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
