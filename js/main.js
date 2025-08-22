console.log('main.js loaded');

window.currentStep = 0;
window.currentStepId = 'step-0';
window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;

const stepIds = ['step-0', 'step-1', 'step-2', 'image-archive-section', 'camera-section', 'step-2.1', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7', 'about-authors'];
const totalSteps = stepIds.length;

const archiveImages = [
    '/public/images/image1.jpg',
    '/public/images/image2.jpg',
    '/public/images/image3.jpg'
];

let cameraStream = null;

function updateStepVisibility() {
    console.log('updateStepVisibility called, currentStep:', window.currentStep);
    const currentStepId = stepIds[window.currentStep];
    document.querySelectorAll('.step').forEach((section) => {
        const shouldBeVisible = section.id === currentStepId;
        console.log(`Section ${section.id}, should be visible: ${shouldBeVisible}, classes: ${section.className}`);
        if (shouldBeVisible) {
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

    const archiveSection = document.getElementById('image-archive-section');
    if (archiveSection) {
        const isArchiveVisible = currentStepId === 'image-archive-section';
        archiveSection.style.display = isArchiveVisible ? 'block' : 'none';
        archiveSection.classList.toggle('visible', isArchiveVisible);
        console.log(`image-archive-section display set to: ${archiveSection.style.display}`);
    }

    const cameraSection = document.getElementById('camera-section');
    if (cameraSection) {
        const isCameraVisible = currentStepId === 'camera-section';
        cameraSection.style.display = isCameraVisible ? 'block' : 'none';
        cameraSection.classList.toggle('visible', isCameraVisible);
        console.log(`camera-section display set to: ${cameraSection.style.display}`);
    }

    const canvas = document.querySelector('canvas:not(#camera-canvas)');
    const canvasContainer = document.getElementById('canvas-container');
    const portraitContainer4 = document.getElementById('portrait-animation-container-step-4');
    const portraitContainer5 = document.getElementById('portrait-animation-container-step-5');

    if (currentStepId === 'step-4' || currentStepId === 'step-5') {
        if (canvas) {
            canvas.style.display = 'block';
            console.log(`Canvas ${canvas.id || 'unnamed'} display set to: block`);
        }
        if (canvasContainer) {
            canvasContainer.style.display = 'block';
            console.log('canvas-container display set to: block');
        }
        if (currentStepId === 'step-4' && portraitContainer4) {
            portraitContainer4.style.display = 'block';
            console.log('portrait-animation-container-step-4 display set to: block');
        }
        if (currentStepId === 'step-5' && portraitContainer5) {
            portraitContainer5.style.display = 'block';
            console.log('portrait-animation-container-step-5 display set to: block');
        }
    } else {
        if (canvas) {
            canvas.style.display = 'none';
            console.log(`Canvas ${canvas.id || 'unnamed'} display set to: none`);
        }
        if (canvasContainer) {
            canvasContainer.style.display = 'none';
            console.log('canvas-container display set to: none');
        }
        if (portraitContainer4) {
            portraitContainer4.style.display = 'none';
            console.log('portrait-animation-container-step-4 display set to: none');
        }
        if (portraitContainer5) {
            portraitContainer5.style.display = 'none';
            console.log('portrait-animation-container-step-5 display set to: none');
        }
    }
}

function typewriter(element) {
    const elements = element.querySelectorAll('div, p, h2, h3');
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

function switchCanvasParent(stepIndex) {
    console.log('switchCanvasParent called with step:', stepIndex);
    const canvas = document.querySelector('canvas:not(#camera-canvas)');
    if (canvas) {
        const targetContainer = document.getElementById(`portrait-animation-container-step-${stepIndex}`);
        if (targetContainer) {
            targetContainer.appendChild(canvas);
            targetContainer.style.display = 'block';
            console.log(`Moved canvas to portrait-animation-container-step-${stepIndex}`);
        } else {
            console.warn(`Target container portrait-animation-container-step-${stepIndex} not found`);
        }
    } else {
        console.warn('No canvas found to switch parent');
    }
}

function startAnimation() {
    console.log('startAnimation called');
    if (window.quantumSketch && typeof window.quantumSketch.loop === 'function') {
        window.quantumSketch.loop();
        console.log('p5.js animation loop started');
    } else {
        console.warn('quantumSketch or loop function not defined');
    }
}

function showImageArchiveSection() {
    console.log('showImageArchiveSection called');
    const section = document.getElementById('image-archive-section');
    const grid = document.getElementById('image-grid');
    if (grid) {
        grid.innerHTML = '';
        archiveImages.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'archive-image';
            img.onclick = () => selectArchiveImage(src);
            grid.appendChild(img);
        });
        window.currentStep = stepIds.indexOf('image-archive-section');
        window.currentStepId = 'image-archive-section';
        updateStepVisibility();
        console.log('image-archive-section made visible');
    } else {
        console.warn('image-grid not found');
    }
}

function startCamera() {
    console.log('startCamera called');
    const section = document.getElementById('camera-section');
    const video = document.getElementById('camera-video');
    if (video) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            cameraStream = stream;
            video.srcObject = stream;
            window.currentStep = stepIds.indexOf('camera-section');
            window.currentStepId = 'camera-section';
            updateStepVisibility();
            console.log('camera-section made visible');
        }).catch(err => {
            console.error('Camera error:', err);
            alert('Не удалось получить доступ к камере. Пожалуйста, проверьте разрешения.');
        });
    } else {
        console.warn('camera-video not found');
    }
}

function stopCamera() {
    console.log('stopCamera called');
    const section = document.getElementById('camera-section');
    if (section) {
        section.classList.remove('visible');
        setTimeout(() => {
            section.style.display = 'none';
            console.log('camera-section hidden');
        }, 500);
    }
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

function capturePhoto() {
    console.log('capturePhoto called');
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    if (video && canvas) {
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 400, 400);
        const url = canvas.toDataURL('image/png');
        window.loadImage(url, img => {
            img = window.resizeToSquare(img, 255);
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
    } else {
        console.warn('camera-video or camera-canvas not found');
    }
}

function selectArchiveImage(src) {
    console.log('selectArchiveImage called with:', src);
    const archiveSection = document.getElementById('image-archive-section');
    document.querySelectorAll('.thumbnail-portrait').forEach(thumb => {
        thumb.src = src;
        console.log('Updated thumbnail:', thumb.id || 'unnamed');
    });
    if (archiveSection) {
        archiveSection.classList.remove('visible');
        setTimeout(() => {
            archiveSection.style.display = 'none';
            console.log('image-archive-section hidden');
        }, 500);
    }
    window.loadImage(src, img => {
        img = window.resizeToSquare(img, 255);
        window.img = img;
        console.log('Image loaded for initializeParticles:', img);
        try {
            window.initializeParticles(img);
            console.log('initializeParticles completed');
        } catch (err) {
            console.error('Error in initializeParticles:', err);
        }
        moveToNextStep('2.1');
    });
}

window.moveToNextStep = function(stepIndex) {
    console.log('moveToNextStep called with:', stepIndex);
    // Если stepIndex уже содержит корректный ID (например, 'about-authors' или 'step-X'), используем его напрямую
    const stepId = stepIds.includes(stepIndex) ? stepIndex : `step-${stepIndex}`;
    const stepIdx = stepIds.indexOf(stepId);
    if (stepIdx >= 0 && stepIdx < totalSteps) {
        window.currentStep = stepIdx;
        window.currentStepId = stepId;
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
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        document.querySelectorAll('#menu a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${stepId}`);
        });
        if (stepId === 'step-4' || stepId === 'step-5') {
            switchCanvasParent(stepId === 'step-4' ? 4 : 5);
            startAnimation();
            window.terminalMessages = [`[INIT] Started for ${stepId}`];
            window.updateTerminalLog();
        } else {
            if (typeof window.quantumSketch?.noLoop === 'function') {
                window.quantumSketch.noLoop();
                console.log('p5.js animation loop stopped');
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
        terminal.innerHTML = window.terminalMessages.map(msg => `<div>${msg}</div>`).join('');
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
    window.setLanguage(window.currentLanguage);
    updateStepVisibility();

    document.querySelectorAll('#menu a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const stepId = a.getAttribute('href').substring(1);
            const stepIndex = stepIds.indexOf(stepId);
            if (stepIndex <= window.currentStep || stepId === 'about-authors') {
                window.currentStep = stepIndex;
                window.currentStepId = stepId;
                updateStepVisibility();
                document.getElementById(stepId).scrollIntoView({ behavior: 'smooth' });
                console.log(`Menu clicked, moved to ${stepId}`);
            }
        });
    });

    document.getElementById('hamburger')?.addEventListener('click', () => {
        const menu = document.getElementById('menu');
        if (menu) {
            menu.classList.toggle('visible');
            console.log('Hamburger menu toggled');
        }
    });

    document.getElementById('uploadImage')?.addEventListener('click', () => {
        console.log('uploadImage clicked');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
            const file = e.target.files[0];
            if (file) {
                window.loadImage(URL.createObjectURL(file), img => {
                    img = window.resizeToSquare(img, 255);
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
            }
        };
        input.click();
    });

    document.getElementById('useArchive')?.addEventListener('click', showImageArchiveSection);
    document.getElementById('useCamera')?.addEventListener('click', startCamera);
    document.getElementById('capture-photo')?.addEventListener('click', capturePhoto);
    document.getElementById('saveImage')?.addEventListener('click', () => {
        const name = document.getElementById('portraitName')?.value || 'quantum_portrait';
        if (typeof window.quantumSketch?.saveCanvas === 'function') {
            window.quantumSketch.saveCanvas(name, 'png');
            window.terminalMessages.push(`[SAVE] Saved as ${name}.png`);
            window.updateTerminalLog();
        } else {
            console.warn('saveCanvas not defined, cannot save image');
        }
    });
    document.getElementById('shareObservation')?.addEventListener('click', () => window.open('https://t.me/quantumportret', '_blank'));
    document.getElementById('restart')?.addEventListener('click', () => window.location.reload());
    document.getElementById('archive')?.addEventListener('click', () => window.open('https://t.me/quantumportret', '_blank'));
    document.getElementById('aboutAuthors')?.addEventListener('click', () => {
        window.moveToNextStep('about-authors');
    });

    document.getElementById('close-archive-section')?.addEventListener('click', () => {
        const section = document.getElementById('image-archive-section');
        if (section) {
            section.classList.remove('visible');
            setTimeout(() => {
                section.style.display = 'none';
                console.log('close-archive-section clicked');
            }, 500);
            window.currentStep = stepIds.indexOf('step-2');
            window.currentStepId = 'step-2';
            updateStepVisibility();
        }
    });

    document.getElementById('close-camera-section')?.addEventListener('click', () => {
        stopCamera();
        window.currentStep = stepIds.indexOf('step-2');
        window.currentStepId = 'step-2';
        updateStepVisibility();
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
