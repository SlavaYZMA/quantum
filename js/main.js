// main.js - Reworked for minimalist design with smooth animations and navigation

console.log('main.js loaded');

window.currentStep = 0; // Tracks the current visible step for progress and animations
window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;

// Define step IDs for navigation and progress
const stepIds = ['step-0', 'step-1', 'step-2', 'step-2.1', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'];
const totalSteps = stepIds.length;

// Archive images (assuming public folder)
const archiveImages = [
    '/public/images/image1.jpg',
    '/public/images/image2.jpg',
    '/public/images/image3.jpg'
];

// Camera stream variable
let cameraStream = null;

// Function for typewriter animation on text blocks
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

// Show image archive modal
function showImageArchiveModal() {
    const modal = document.getElementById('image-archive-modal');
    const grid = document.getElementById('image-grid');
    grid.innerHTML = '';
    archiveImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'archive-image';
        img.onclick = () => {
            selectArchiveImage(src);
            modal.style.display = 'none';
        };
        grid.appendChild(img);
    });
    modal.style.display = 'flex';
}

// Select archive image
function selectArchiveImage(src) {
    if (window.quantumSketch && typeof window.quantumSketch.loadImage === 'function') {
        window.quantumSketch.loadImage(src, img => {
            window.img = img;
            window.initializeParticles && window.initializeParticles(img);
            document.querySelectorAll('.thumbnail-portrait').forEach(thumb => thumb.src = src);
            moveToNextStep('2.1');
        });
    } else {
        console.error('quantumSketch не инициализирован');
    }
}

// Start camera
function startCamera() {
    const modal = document.getElementById('camera-modal');
    const video = document.getElementById('camera-video');
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        cameraStream = stream;
        video.srcObject = stream;
        modal.style.display = 'flex';
    }).catch(err => console.error('Camera error:', err));
}

// Stop camera
function stopCamera() {
    if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
}

// Capture photo from camera
function capturePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 400, 400);
    const url = canvas.toDataURL('image/png');
    if (window.quantumSketch && typeof window.quantumSketch.loadImage === 'function') {
        window.quantumSketch.loadImage(url, img => {
            window.img = img;
            window.initializeParticles && window.initializeParticles(img);
            document.querySelectorAll('.thumbnail-portrait').forEach(thumb => thumb.src = url);
            moveToNextStep('2.1');
            stopCamera();
            document.getElementById('camera-modal').style.display = 'none';
        });
    } else {
        console.error('quantumSketch не инициализирован');
    }
}

// Smooth scroll to step
window.moveToNextStep = function(stepIndex) {
    const id = `step-${stepIndex}`.replace('.', '.');
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};

// Update terminal log
window.updateTerminalLog = function() {
    const terminals = document.querySelectorAll('.terminal-log');
    terminals.forEach(terminal => {
        terminal.innerHTML = window.terminalMessages.join('<br>');
        terminal.scrollTop = terminal.scrollHeight;
    });
};

// Language switch preserving position
window.setLanguageAndStay = function(lang) {
    const currentScroll = window.scrollY;
    window.setLanguage(lang);
    setTimeout(() => window.scrollTo(0, currentScroll), 100);
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Setup IntersectionObserver
    const observer = new IntersectionObserver(entries => {
        let maxRatio = 0;
        let currentId = '';
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const textBlock = entry.target.querySelector('.text-block');
                if (textBlock && !textBlock.classList.contains('animated')) {
                    typewriter(textBlock);
                    textBlock.classList.add('animated');
                }
                if (entry.intersectionRatio > maxRatio) {
                    maxRatio = entry.intersectionRatio;
                    currentId = entry.target.id;
                }
            }
        });
        if (currentId) {
            window.currentStep = stepIds.indexOf(currentId);
            // Update progress
            const progress = ((window.currentStep + 1) / totalSteps) * 100;
            document.getElementById('progress-fill').style.width = `${progress}%`;
            // Update active menu
            document.querySelectorAll('#menu a').forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
            });
            // Handle canvas for steps 4 and 5
            if (currentId === 'step-4' || currentId === 'step-5') {
                if (window.quantumSketch) {
                    window.quantumSketch.switchCanvasParent && window.quantumSketch.switchCanvasParent(window.currentStep);
                    window.quantumSketch.startAnimation && window.quantumSketch.startAnimation();
                    window.terminalMessages = [`[INIT] Started for ${currentId}`];
                    window.updateTerminalLog();
                } else {
                    console.warn('quantumSketch отсутствует, пропуск анимации');
                }
            } else {
                if (window.quantumSketch && typeof window.quantumSketch.noLoop === 'function') {
                    window.quantumSketch.noLoop();
                }
            }
        }
    }, { threshold: 0.5 });

    // Observe all sections
    document.querySelectorAll('.step').forEach(section => observer.observe(section));

    // Menu click for smooth scroll
    document.querySelectorAll('#menu a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Hamburger toggle
    document.getElementById('hamburger').addEventListener('click', () => {
        const menu = document.getElementById('menu');
        menu.classList.toggle('visible');
    });

    // Event listeners
    document.getElementById('uploadImage').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
            const file = e.target.files[0];
            if (window.quantumSketch && typeof window.quantumSketch.loadImage === 'function') {
                window.quantumSketch.loadImage(URL.createObjectURL(file), img => {
                    window.img = img;
                    window.initializeParticles && window.initializeParticles(img);
                    document.querySelectorAll('.thumbnail-portrait').forEach(thumb => thumb.src = URL.createObjectURL(file));
                    moveToNextStep('2.1');
                });
            } else {
                console.error('quantumSketch не инициализирован');
            }
        };
        input.click();
    });

    document.getElementById('useArchive').addEventListener('click', showImageArchiveModal);
    document.getElementById('useCamera').addEventListener('click', startCamera);
    document.getElementById('capture-photo').addEventListener('click', capturePhoto);
    document.getElementById('saveImage').addEventListener('click', () => {
        const name = document.getElementById('portraitName').value || 'quantum_portrait';
        if (window.quantumSketch && typeof window.quantumSketch.saveCanvas === 'function') {
            window.quantumSketch.saveCanvas(name, 'png');
            window.terminalMessages.push(`[SAVE] Saved as ${name}.png`);
            window.updateTerminalLog();
        } else {
            console.error('quantumSketch не инициализирован');
        }
    });
    document.getElementById('shareObservation').addEventListener('click', () => window.open('https://t.me/quantum_portrait_channel', '_blank'));
    document.getElementById('restart').addEventListener('click', () => window.location.reload());
    document.getElementById('archive').addEventListener('click', () => window.open('https://t.me/quantum_portrait_channel', '_blank'));
    document.getElementById('aboutAuthors').addEventListener('click', () => window.location.href = './about.html');

    // Close modals
    document.getElementById('close-modal').addEventListener('click', () => document.getElementById('image-archive-modal').style.display = 'none');
    document.getElementById('close-camera-modal').addEventListener('click', () => {
        document.getElementById('camera-modal').style.display = 'none';
        stopCamera();
    });

    // Continue/back buttons
    document.querySelectorAll('.continue').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextIndex = window.currentStep + 1;
            if (nextIndex < totalSteps) moveToNextStep(stepIds[nextIndex].replace('step-', ''));
        });
    });
    document.querySelectorAll('.back').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevIndex = window.currentStep - 1;
            if (prevIndex >= 0) moveToNextStep(stepIds[prevIndex].replace('step-', ''));
        });
    });

    // Audio init on click
    document.addEventListener('click', () => window.initAudioContext && window.initAudioContext(), { once: true });
});
