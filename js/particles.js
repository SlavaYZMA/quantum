function initializeParticles(img) {
    console.log('initializeParticles called, img:', img, 'quantumSketch:', !!window.quantumSketch);
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
    console.log('updateBoundary called, quantumSketch:', !!window.quantumSketch);
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
    console.log(`Updated ${window.boundaryPoints.length} boundary points`);
}

function updateParticles() {
    console.log('updateParticles called, particles:', window.particles.length, 'quantumSketch:', !!window.quantumSketch);
    if (!window.quantumSketch || !window.trailBuffer) {
        console.warn('quantumSketch or trailBuffer not available in updateParticles');
        return;
    }
    window.trailBuffer.clear();
    for (let i = 0; i < window.particles.length; i++) {
        let particle = window.particles[i];
        let state = window.quantumStates[i];
        let noiseX = window.quantumSketch.noise(particle.chaosSeed + window.frame * 0.03) * 2 - 1;
        let noiseY = window.quantumSketch.noise(particle.chaosSeed + 100 + window.frame * 0.03) * 2 - 1;
        particle.offsetX += noiseX * 1; // Уменьшено для более плавного движения
        particle.offsetY += noiseY * 1;
        let d = window.quantumSketch.dist(window.quantumSketch.mouseX, window.quantumSketch.mouseY, particle.x + particle.offsetX, particle.y + particle.offsetY);
        if (d < window.mouseInfluenceRadius) {
            let influence = window.quantumSketch.map(d, 0, window.mouseInfluenceRadius, 1, 0);
            let angle = window.quantumSketch.atan2(particle.y + particle.offsetY - window.quantumSketch.mouseY, particle.x + particle.offsetX - window.quantumSketch.mouseX);
            particle.offsetX += window.quantumSketch.cos(angle) * 5 * influence; // Уменьшено влияние мыши
            particle.offsetY += window.quantumSketch.sin(angle) * 5 * influence;
        }
        // Ограничение перемещения частиц
        if (particle.x + particle.offsetX < 10 || particle.x + particle.offsetX > 390 || particle.y + particle.offsetY < 10 || particle.y + particle.offsetY > 390) {
            particle.offsetX = 0;
            particle.offsetY = 0;
        }
        window.trailBuffer.fill(state.r, state.g, state.b, state.a * 0.8); // Добавлена прозрачность
        window.trailBuffer.noStroke();
        window.trailBuffer.ellipse(particle.x + particle.offsetX, particle.y + particle.offsetY, particle.size);
    }
    console.log('Particles updated, frame:', window.frame);
}
