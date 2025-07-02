console.log('particles.js loaded');
window.particles = [];
window.quantumStates = [];

window.initializeParticles = (img) => {
    console.log('initializeParticles called, img:', !!img, 'img dimensions:', img?.width, img?.height);
    if (!img) {
        console.error('Error: window.img is not defined');
        return;
    }
    window.particles = [];
    window.quantumStates = [];
    img.loadPixels();
    const pixelStep = Math.floor(Math.max(img.width, img.height) / 20);
    const centerX = img.width / 2;
    const centerY = img.height / 2;
    const maxRadius = Math.min(img.width, img.height) / 2;
    const numParticles = 314;

    let validParticles = 0;
    for (let i = 0; i < numParticles; i++) {
        let angle = Math.random() * Math.PI * 2;
        let radius = Math.random() * maxRadius;
        let x = centerX + Math.cos(angle) * radius;
        let y = centerY + Math.sin(angle) * radius;

        if (x >= 0 && x < img.width && y >= 0 && y < img.height) {
            let index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
            let r = img.pixels[index];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];
            let a = img.pixels[index + 3] || 255;

            window.particles.push({
                x: x * 400 / img.width, // Масштабирование для canvas 400x400
                y: y * 400 / img.height,
                baseX: x * 400 / img.width,
                baseY: y * 400 / img.height,
                offsetX: 0,
                offsetY: 0,
                size: 5 + Math.random() * 10,
                phase: Math.random() * Math.PI * 2,
                frequency: 0.01 + Math.random() * 0.02
            });

            window.quantumStates.push({
                r: r,
                g: g,
                b: b,
                a: a,
                probability: 1.0
            });
            validParticles++;
        }
    }
    console.log(`Initialized ${window.particles.length} particles, valid: ${validParticles}`);
    if (validParticles === 0) {
        console.error('No valid particles created. Check image dimensions or pixel data.');
    }
};

window.updateParticles = (sketch) => {
    if (!window.quantumSketch || !window.particles || window.particles.length === 0) {
        console.error('Cannot update particles: quantumSketch or particles not initialized', {
            quantumSketch: !!window.quantumSketch,
            particlesLength: window.particles?.length
        });
        return;
    }
    console.log('updateParticles called, particles:', window.particles.length, 'quantumSketch:', !!window.quantumSketch);
    window.particles.forEach((p, i) => {
        let n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.01);
        p.phase += p.frequency;
        p.offsetX = Math.cos(p.phase) * 20 * n * window.chaosFactor;
        p.offsetY = Math.sin(p.phase) * 20 * n * window.chaosFactor;

        let mouseX = sketch.mouseX;
        let mouseY = sketch.mouseY;
        if (mouseX > 0 && mouseX < 400 && mouseY > 0 && mouseY < 400) {
            let dx = mouseX - (p.x + p.offsetX);
            let dy = mouseY - (p.y + p.offsetY);
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < window.mouseInfluenceRadius && distance > 0) {
                let force = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                p.offsetX += dx * force * 0.05;
                p.offsetY += dy * force * 0.05;

                let state = window.quantumStates[i];
                state.probability = Math.max(0.1, state.probability - 0.01);
                state.a = Math.floor(state.probability * 255);
            }
        }

        p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
        p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));

        // Рендеринг частицы
        let state = window.quantumStates[i];
        sketch.fill(state.r, state.g, state.b, state.a);
        sketch.noStroke();
        sketch.ellipse(p.x, p.y, p.size, p.size);
        console.log(`Particle ${i} at x: ${p.x}, y: ${p.y}, color: rgb(${state.r}, ${state.g}, ${state.b}, ${state.a})`);
    });
};
