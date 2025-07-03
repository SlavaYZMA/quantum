console.log('utils.js loaded');

window.loadImageOnce = function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        console.log('Image input changed, files: ' + e.target.files.length);
        if (!e.target || !e.target.files || e.target.files.length === 0 || !window.quantumSketch) {
            console.error('Error: Invalid file input or quantumSketch not initialized', {
                hasTarget: !!e.target,
                hasFiles: e.target.files ? e.target.files.length : 0,
                quantumSketch: !!window.quantumSketch
            });
            return;
        }
        var file = e.target.files[0];
        window.quantumSketch.loadImage(URL.createObjectURL(file), function(img) {
            console.log('Image loaded successfully, dimensions: ' + img.width + ', ' + img.height);
            window.img = img;
            window.initializeParticles(img);
            var thumbnails = document.querySelectorAll('#thumbnail-portrait');
            console.log('Found thumbnails: ' + thumbnails.length);
            thumbnails.forEach(function(thumbnail) {
                thumbnail.src = URL.createObjectURL(file);
                thumbnail.style.display = (window.currentStep === 4 || window.currentStep === 5) ? 'block' : 'none';
                console.log('Updated thumbnail src: ' + thumbnail.src + ', display: ' + thumbnail.style.display);
            });
            window.moveToNextStep(2.1);
            input.remove();
        }, function() {
            console.error('Error loading image');
            input.remove();
        });
    };
    input.click();
};

window.loadImage = function() {
    if (window.quantumSketch && typeof window.quantumSketch.loadImage === 'function') {
        window.loadImageOnce();
    } else {
        console.error('p5.js instance or loadImage not available');
    }
};

window.moveToNextStep = function(stepIndex) {
    console.log('moveToNextStep called with stepIndex: ' + stepIndex + ', currentStep: ' + window.currentStep);
    const steps = document.querySelectorAll('.step');
    if (!steps || steps.length === 0) {
        console.error('No steps found in DOM');
        return;
    }

    steps.forEach(function(step) {
        step.style.display = 'none';
    });

    const nextStepElement = document.getElementById('step-' + stepIndex);
    if (nextStepElement) {
        nextStepElement.style.display = 'flex';
        window.currentStep = stepIndex;

        const textBlock = nextStepElement.querySelector('.text-block');
        if (textBlock) {
            typewriter(textBlock, function() {
                console.log('Typewriter animation completed for step ' + stepIndex);
            });
        }

        const thumbnails = document.querySelectorAll('#thumbnail-portrait');
        thumbnails.forEach(function(thumbnail) {
            thumbnail.style.display = (stepIndex === 4 || stepIndex === 5) ? 'block' : 'none';
            console.log('Thumbnail display set to: ' + thumbnail.style.display + ' for step: ' + stepIndex);
        });

        if (stepIndex === 4 || stepIndex === 5) {
            window.quantumSketch.switchCanvasParent(stepIndex);
            window.quantumSketch.startAnimation();
            window.terminalMessages = [];
            window.terminalMessages.push(`[INIT] Quantum portrait animation started for step ${stepIndex}`);
            window.updateTerminalLog();
            window.initializeGestures();
        } else {
            window.quantumSketch.noLoop();
            window.terminalMessages = [];
            window.updateTerminalLog();
        }
    } else {
        console.error('Step element not found for stepIndex: ' + stepIndex);
    }
};
