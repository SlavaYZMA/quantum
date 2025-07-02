window.particles = [];

function initializeParticles(img) {
    console.log('initializeParticles called');
    window.particles = [];
    img.loadPixels();
    const density = 0.05;
    for (let x = 0; x < img.width; x += 10) {
        for (let y = 0; y < img.height; y += 10) {
            const index = (x + y * img.width) * 4;
            const alpha = img.pixels[index + 3];
            if (alpha > 0 && Math.random() < density) {
                const r = img.pixels[index];
                const g = img.pixels[index + 1];
                const b = img.pixels[index + 2];
                const shapes = ['ribbon', 'ellipse', 'cluster'];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                window.particles.push({
                    x: x,
                    y: y,
                    baseX: x,
                    baseY: y,
                    color: { r, g, b, a: alpha },
                    velocity: { x: 0, y: 0 },
                    shape: shape,
                    size: Math.random() * 5 + 5,
                    phase: Math.random() * 2 * Math.PI,
                    amplitude: 10,
                    collapsed: false
                });
            }
        }
    }
    console.log('Initialized ' + window.particles.length + ' particles, valid: ' + window.particles.filter(p => p.color.a > 0).length);
}

function updateParticles(sketch) {
    console.log('updateParticles called, particles: ' + window.particles.length + ', currentStep: ' + window.currentStep);
    if (!window.particles || window.particles.length === 0) {
        console.error('No particles to update');
        return;
    }
    window.frame = (window.frame || 0) + 1;
    window.particles.forEach(particle => {
        const noiseVal = sketch.noise(particle.x * window.noiseScale, particle.y * window.noiseScale, window.frame * 0.01);
        particle.velocity.x = Math.cos(noiseVal * 2 * Math.PI) * window.chaosFactor;
        particle.velocity.y = Math.sin(noiseVal * 2 * Math.PI) * window.chaosFactor;
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.x = sketch.constrain(particle.x, 0, sketch.width);
        particle.y = sketch.constrain(particle.y, 0, sketch.height);
        if (window.currentStep === 4 || window.currentStep === 5) {
            // No decoherence; keep particles "alive" with constant motion
            particle.amplitude = 10;
            particle.color.a = 255;
        }
        sketch.push();
        sketch.translate(particle.x, particle.y);
        sketch.fill(particle.color.r, particle.color.g, particle.color.b, particle.color.a);
        sketch.noStroke();
        if (particle.shape === 'ribbon') {
            sketch.beginShape();
            for (let i = -5; i <= 5; i++) {
                const offset = sketch.sin(particle.phase + i * 0.1 + window.frame * 0.05) * particle.amplitude;
                sketch.vertex(i * 2, offset);
            }
            sketch.endShape();
        } else if (particle.shape === 'ellipse') {
            sketch.ellipse(0, 0, particle.size, particle.size * 0.5);
        } else if (particle.shape === 'cluster') {
            for (let i = 0; i < 5; i++) {
                const offsetX = sketch.cos(i * 2 * Math.PI / 5) * particle.size * 0.5;
                const offsetY = sketch.sin(i * 2 * Math.PI / 5) * particle.size * 0.5;
                sketch.ellipse(offsetX, offsetY, particle.size * 0.3);
            }
        }
        sketch.pop();
    });
}

function observeParticles(sketch, mouseX, mouseY) {
    console.log('observeParticles called, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    if (!window.particles || window.particles.length === 0) {
        console.error('No particles to observe');
        return;
    }
    window.mouseWave = window.mouseWave || { radius: 0, phase: 0 };
    window.mouseWave.radius = sketch.sin(window.frame * 0.1) * 10 + window.mouseInfluenceRadius;
    window.mouseWave.phase += 0.1;
    sketch.push();
    sketch.translate(mouseX, mouseY);
    sketch.noFill();
    sketch.stroke(0, 255, 0, 100);
    sketch.ellipse(0, 0, window.mouseWave.radius * 2);
    sketch.stroke(0, 255, 0, 50);
    sketch.ellipse(0, 0, window.mouseWave.radius * 1.5);
    sketch.pop();
    window.particles.forEach(particle => {
        const dist = sketch.dist(mouseX, mouseY, particle.x, particle.y);
        if (dist < window.mouseWave.radius) {
            const angle = sketch.atan2(particle.y - mouseY, particle.x - mouseX);
            particle.velocity.x += sketch.cos(angle) * 0.5;
            particle.velocity.y += sketch.sin(angle) * 0.5;
        }
    });
}

function clickParticles(sketch, mouseX, mouseY) {
    console.log('clickParticles called, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    if (!window.particles || window.particles.length === 0) {
        console.error('No particles to click');
        return;
    }
    window.particles.forEach(particle => {
        const dist = sketch.dist(mouseX, mouseY, particle.x, particle.y);
        if (dist < window.mouseInfluenceRadius) {
            if (!particle.collapsed) {
                particle.collapsed = true;
                particle.color.a = 255;
                particle.x = particle.baseX;
                particle.y = particle.baseY;
                particle.velocity = { x: 0, y: 0 };
                console.log('Particle collapsed, shape: ' + particle.shape + ', alpha: ' + particle.color.a);
            } else {
                particle.collapsed = false;
                particle.color.a = 255;
                console.log('Particle restored to superposition, shape: ' + particle.shape + ', alpha: ' + particle.color.a);
            }
        }
    });
}
