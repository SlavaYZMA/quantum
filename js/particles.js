window.frame = 0;
window.isPaused = false;
window.particles = [];
window.quantumStates = [];
window.isCanvasReady = false;
window.noiseScale = 0.03;
window.mouseInfluenceRadius = 200;
window.chaosFactor = 0.5;
window.boundaryPoints = [];
window.trailBuffer = null;

function initializeParticles(img) {
    if (!window.quantumSketch || !img) {
        console.warn('quantumSketch or img not available in initializeParticles');
        return;
    }
    window.particles = [];
    window.quantumStates = [];
    window.maxParticles = window.quantumSketch.windowWidth < 768 ? 500 : 1000;
    img.loadPixels();
    let step = Math.floor(img.width / 20);
    for (let y = 0; y < img.height; y += step) {
        for (let x = 0; x < img.width; x += step) {
            let col = img.get(x, y);
            let brightness = window.quantumSketch.brightness(col);
            if (brightness > 10 && window.particles.length < window.maxParticles) {
                let canvasX = x + (400 - img.width) / 2;
                let canvasY = y + (400 - img.height) / 2;
                let particle = {
                    x: canvasX,
                    y: canvasY,
                    baseX: canvasX,
                    baseY: canvasY,
                    offsetX: 0,
                    offsetY: 0,
                    size: window.quantumSketch.random(5, 15),
                    phase: window.quantumSketch.random(window.quantumSketch.TWO_PI),
                    layer: 'main',
                    chaosSeed: window.quantumSketch.random(1000),
                    alpha: 255
                };
                window.particles.push(particle);
                window.quantumStates.push({
                    r: window.quantumSketch.red(col),
                    g: window.quantumSketch.green(col),
                    b: window.quantumSketch.blue(col),
                    a: 255
                });
            }
        }
    }
    console.log(`Initialized ${window.particles.length} particles`);
}

function updateBoundary() {
    if (!window.quantumSketch) {
        console.warn('quantumSketch not available in updateBoundary');
        return;
    }
    window.boundaryPoints = [];
    let numPoints = 40;
    let margin = 10;
    let maxX = 400 - margin;
    let maxY = 400 - margin;
    for (let i = 0; i < numPoints / 4; i++) {
        let x = window.quantumSketch.lerp(margin, maxX, i / (numPoints / 4));
        window.boundaryPoints.push({ x, y: margin });
    }
    for (let i = 0; i < numPoints / 4; i++) {
        let y = window.quantumSketch.lerp(margin, maxY, i / (numPoints / 4));
        window.boundaryPoints.push({ x: maxX, y });
    }
    for (let i = 0; i < numPoints / 4; i++) {
        let x = window.quantumSketch.lerp(maxX, margin, i / (numPoints / 4));
        window.boundaryPoints.push({ x, y: maxY });
    }
    for (let i = 0; i < numPoints / 4; i++) {
        let y = window.quantumSketch.lerp(maxY, margin, i / (numPoints / 4));
        window.boundaryPoints.push({ x: margin, y });
    }
}

function updateParticles() {
    if (!window.quantumSketch) {
        console.warn('quantumSketch not available in updateParticles');
        return;
    }
    for (let i = 0; i < window.particles.length; i++) {
        let particle = window.particles[i];
        let state = window.quantumStates[i];
        let noiseX = window.quantumSketch.noise(particle.chaosSeed + window.frame * 0.03) * 2 - 1;
        let noiseY = window.quantumSketch.noise(particle.chaosSeed + 100 + window.frame * 0.03) * 2 - 1;
        particle.offsetX += noiseX * 2;
        particle.offsetY += noiseY * 2;
        let d = window.quantumSketch.dist(window.quantumSketch.mouseX, window.quantumSketch.mouseY, particle.x + particle.offsetX, particle.y + particle.offsetY);
        if (d < window.mouseInfluenceRadius) {
            let influence = window.quantumSketch.map(d, 0, window.mouseInfluenceRadius, 1, 0);
            let angle = window.quantumSketch.atan2(particle.y + particle.offsetY - window.quantumSketch.mouseY, particle.x + particle.offsetX - window.quantumSketch.mouseX);
            particle.offsetX += window.quantumSketch.cos(angle) * 10 * influence;
            particle.offsetY += window.quantumSketch.sin(angle) * 10 * influence;
        }
        if (particle.x + particle.offsetX < 10 || particle.x + particle.offsetX > 390 || particle.y + particle.offsetY < 10 || particle.y + particle.offsetY > 390) {
            particle.offsetX = 0;
            particle.offsetY = 0;
        }
        window.trailBuffer.fill(state.r, state.g, state.b, state.a);
        window.trailBuffer.noStroke();
        window.trailBuffer.ellipse(particle.x + particle.offsetX, particle.y + particle.offsetY, particle.size);
    }
}

if (window.quantumSketch) {
    window.quantumSketch.setup = () => {
        if (!window.quantumSketch) {
            console.error('quantumSketch not initialized in setup');
            return;
        }
        const container = document.getElementById('portrait-animation-container');
        if (!container) {
            console.error('Container portrait-animation-container not found');
            return;
        }
        window.quantumSketch.createCanvas(400, 400).parent('portrait-animation-container');
        window.quantumSketch.pixelDensity(1);
        window.trailBuffer = window.quantumSketch.createGraphics(400, 400);
        window.trailBuffer.pixelDensity(1);
        updateBoundary();
        window.isCanvasReady = true;
        console.log('Canvas setup completed');
    };

    window.quantumSketch.draw = () => {
        if (!window.quantumSketch) {
            console.error('quantumSketch not initialized in draw');
            return;
        }
        window.quantumSketch.background(0);
        window.trailBuffer.clear();
        if (window.currentStep < 2 || !window.img) {
            window.quantumSketch.fill(255);
            window.quantumSketch.textSize(16);
            window.quantumSketch.text('Пожалуйста, загрузите изображение', 10, 30);
            return;
        }
        window.frame++;
        let scale = Math.min(window.quantumSketch.width / window.img.width, window.quantumSketch.height / window.img.height);
        let displayWidth = window.img.width * scale;
        let displayHeight = window.img.height * scale;
        let x = (window.quantumSketch.width - displayWidth) / 2;
        let y = (window.quantumSketch.height - displayHeight) / 2;
        window.quantumSketch.image(window.img, x, y, displayWidth, displayHeight);
        if (window.currentStep >= 3) {
            if (window.particles.length === 0) {
                initializeParticles(window.img);
            }
            updateParticles();
            window.quantumSketch.image(window.trailBuffer, 0, 0);
        }
        window.quantumSketch.fill(255);
        window.quantumSketch.textSize(16);
        window.quantumSketch.text(`Frame: ${window.frame}`, 10, 20);
    };
}
