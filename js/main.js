console.log('main.js loaded');
let currentStep = 0;
let img = null;
window.currentStep = currentStep;
window.noiseScale = 0.02;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 50;

function preload() {
    console.log('preload called');
}

function setup() {
    console.log('setup called');
    let canvas = createCanvas(400, 400);
    canvas.class('quantum-canvas');
    canvas.parent('portrait-animation-container-step-4');
    window.quantumSketch = this;
    pixelDensity(1);
    updateStepVisibility();
}

function draw() {
    if (window.currentStep === 4 || window.currentStep === 5) {
        if (window.updateParticles) {
            window.updateParticles(window.quantumSketch);
        } else {
            console.error('updateParticles not defined');
        }
    }
}

function mouseClicked() {
    if (window.currentStep === 4 && window.observeParticles) {
        window.observeParticles(mouseX, mouseY);
        console.log('mouseClicked triggered observeParticles');
    }
}

function updateStepVisibility() {
    console.log('updateStepVisibility called, currentStep: ' + window.currentStep);
    selectAll('.step').forEach(elt => elt.style('display', 'none'));
    select('#step-' + window.currentStep).style('display', 'flex');
    if (window.currentStep === 4) {
        select('.quantum-canvas').style('display', 'block');
    } else {
        select('.quantum-canvas').style('display', 'none');
    }
}

function advanceStep() {
    console.log('advanceStep called, currentStep: ' + window.currentStep);
    if (window.currentStep < 5) {
        window.currentStep++;
        updateStepVisibility();
        if (window.currentStep === 4 && window.initializeParticles && window.img) {
            console.log('Initializing particles for step 4');
            window.initializeParticles(window.img);
        }
    }
}

function handleFile(file) {
    console.log('handleFile called, file type: ' + file.type);
    if (file.type === 'image') {
        window.img = loadImage(file.data, () => {
            console.log('Image loaded, dimensions: ' + window.img.width + 'x' + window.img.height);
            window.currentStep = 2.1;
            updateStepVisibility();
            setTimeout(() => {
                advanceStep();
            }, 2000);
        });
    } else {
        console.error('File is not an image');
    }
}

function setupEventListeners() {
    console.log('setupEventListeners called');
    select('#language-ru').mousePressed(() => {
        console.log('Language RU selected');
        window.currentStep = 1;
        updateStepVisibility();
        setTimeout(() => {
            advanceStep();
        }, 2000);
    });

    select('#file-input').changed((event) => {
        console.log('File input changed');
        if (event.elt.files.length > 0) {
            handleFile(event.elt.files[0]);
        }
    });

    select('#download-button').mousePressed(() => {
        console.log('Download button pressed');
        saveCanvas('quantum_portrait_frame_' + frameCount, 'png');
    });
}

function setup() {
    console.log('setup called');
    let canvas = createCanvas(400, 400);
    canvas.class('quantum-canvas');
    canvas.parent('portrait-animation-container-step-4');
    window.quantumSketch = this;
    pixelDensity(1);
    updateStepVisibility();
    setupEventListeners();
}
