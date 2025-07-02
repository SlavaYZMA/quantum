console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.backgroundParticles = [];

// Инициализация частиц из портрета
window.initializeParticles = function(img) {
    console.log('initializeParticles called, img defined: ' + !!img + ', dimensions: ' + (img ? img.width + 'x' + img.height : 'undefined'));
    if (!img || !img.pixels) {
        console.error('Error: window.img is not defined or pixels not loaded');
        return;
    }
    window.particles = [];
    window.quantumStates = [];
    window.decompositionTimer = 0;
    window.backgroundParticles = [];
    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty or not loaded');
            return;
        }
        var numParticles = 150;

        // Основные частицы
        var validParticles = 0;
        for (var i = 0; i < numParticles; i++) {
            var x = Math.random() * img.width;
            var y = Math.random() * img.height;
            if (x >= 0 && x < img.width && y >= 0 && y < img.height) {
                var index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
                var r = img.pixels[index] || 255;
                var g = img.pixels[index + 1] || 255;
                var b = img.pixels[index + 2] || 255;
                var a = img.pixels[index + 3] || 255;

                window.particles.push({
                    x: x * 400 / img.width,
                    y: y * 400 / img.height,
                    baseX: x * 400 / img.width,
                    baseY: y * 400 / img.height,
                    offsetX: 0,
                    offsetY: 0,
                    size: 6,
                    phase: Math.random() * Math.PI * 2,
                    frequency: 0.02,
                    entangledPartner: Math.random() < 0.2 ? Math.floor(Math.random() * numParticles) : null,
                    collapsed: false,
                    decompositionProgress: 0,
                    shape: ['circle', 'spiral', 'ellipse'][Math.floor(Math.random() * 3)],
                    rotation: Math.random() * Math.PI * 2
                });

                window.quantumStates.push({
                    r: r,
                    g: g,
                    b: b,
                    a: 0,
                    probability: 1.0,
                    decoherenceTimer: 0,
                    tunnelFlash: 0,
                    interferencePhase: Math.random() * Math.PI * 2,
                    entanglementFlash: 0
                });
                validParticles++;
            }
        }

        // Фоновые частицы для звёздного поля
        for (var i = 0; i < 50; i++) {
            window.backgroundParticles.push({
                x: Math.random() * 400,
                y: Math.random() * 400,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 50 + 50
            });
        }
        console.log('Initialized ' + window.particles.length + ' particles, valid: ' + validParticles + ', background particles: ' + window.backgroundParticles.length);
        if (validParticles === 0) {
            console.error('No valid particles created. Check image dimensions or pixel data.');
        }
    } catch (error) {
        console.error('Error in initializeParticles: ' + error);
    }
};

// Отрисовка сложных форм
function drawShape(sketch, x, y, size, shape, rotation, r, g, b, a) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    sketch.fill(r, g, b, a);
    if (shape === 'circle') {
        sketch.ellipse(0, 0, size, size);
    } else if (shape === 'spiral') {
        sketch.beginShape();
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
            let r = size * (1 + t / Math.PI);
            sketch.vertex(r * Math.cos(t), r * Math.sin(t));
        }
        sketch.endShape();
    } else if (shape === 'ellipse') {
        sketch.ellipse(0, 0, size * 1.5, size * 0.5);
    }
    sketch.pop();
}

// Обновление частиц
window.updateParticles = function(sketch) {
    if (!window.quantumSketch || !window.particles || window.particles.length === 0) {
        console.error('Cannot update particles: quantumSketch: ' + !!window.quantumSketch + ', particlesLength: ' + (window.particles ? window.particles.length : 0));
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('updateParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    console.log('updateParticles called, particles: ' + window.particles.length + ', currentStep: ' + window.currentStep);
    window.frame = window.frame || 0;
    window.frame++;

    // Динамичный фон (звёздное поле с вихрями)
    sketch.background(10, 0, 30, 50);
    window.backgroundParticles.forEach(function(bp) {
        sketch.fill(255, 255, 255, bp.alpha);
        sketch.ellipse(bp.x, bp.y, bp.size, bp.size);
        bp.x += Math.sin(window.frame * 0.01 + bp.y * 0.02) * 0.2;
        bp.y += Math.cos(window.frame * 0.01 + bp.x * 0.02) * 0.2;
        if (bp.x < 0) bp.x += 400;
        if (bp.x > 400) bp.x -= 400;
        if (bp.y < 0) bp.y += 400;
        if (bp.y > 400) bp.y -= 400;
    });

    // Квантовая декомпозиция
    if (window.currentStep === 4 && window.decompositionTimer < 3) {
        window.decompositionTimer += 0.02;
        if (window.img) {
            var imgAlpha = Math.max(0, 255 * (1 - window.decompositionTimer / 3));
            sketch.tint(255, imgAlpha);
            sketch.image(window.img, 0, 0, 400, 400);
            console.log('Decomposition: Image alpha ' + imgAlpha.toFixed(0));
        }
    }

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];

            // Квантовая декомпозиция с радиальными волнами
            if (window.currentStep === 4 && window.decompositionTimer < 3) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.02);
                state.a = Math.floor(p.decompositionProgress * 255);
                var dx = p.x - 200;
                var dy = p.y - 200;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var wave = Math.sin(dist * 0.05 + window.decompositionTimer * 2);
                p.offsetX += wave * 10 * (dx / (dist + 1));
                p.offsetY += wave * 10 * (dy / (dist + 1));
                p.rotation += wave * 0.1;
            } else if (window.currentStep === 4) {
                state.a = 255;
            }

            // Суперпозиция и неопределённость
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.02);
            p.phase += p.frequency;
            p.offsetX = Math.cos(p.phase) * 12 * n * window.chaosFactor;
            p.offsetY = Math.sin(p.phase) * 12 * n * window.chaosFactor;
            p.size = 6 + 5 * n * state.probability;
            p.rotation += 0.05 * n;
            if (Math.random() < 0.02 && !p.collapsed) {
                p.shape = ['circle', 'spiral', 'ellipse'][Math.floor(Math.random() * 3)];
            }

            // Неоновые цвета
            if (!p.collapsed) {
                state.r = Math.min(255, Math.max(50, 150 + Math.sin(window.frame * 0.01 + i) * 100));
                state.g = Math.min(255, Math.max(50, 100 + Math.cos(window.frame * 0.015 + i) * 80));
                state.b = Math.min(255, Math.max(50, 200 + Math.sin(window.frame * 0.02 + i) * 50));
            }

            // Интерференция с волновыми фронтами
            var interference = 0;
            window.particles.forEach(function(other, j) {
                if (i !== j) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 80) {
                        var wave = Math.sin(distance * 0.1 + state.interferencePhase + window.frame * 0.05);
                        interference += wave * 0.2;
                        if (Math.random() < 0.01) {
                            sketch.stroke(150, 100, 255, 50);
                            sketch.ellipse(p.x, p.y, distance, distance);
                        }
                    }
                }
            });
            p.offsetX += interference * 10;
            p.offsetY += interference * 10;

            // Отталкивание от краёв
            var margin = 20;
            if (p.x < margin) p.offsetX += (margin - p.x) * 0.15;
            if (p.x > 400 - margin) p.offsetX -= (p.x - (400 - margin)) * 0.15;
            if (p.y < margin) p.offsetY += (margin - p.y) * 0.15;
            if (p.y > 400 - margin) p.offsetY -= (p.y - (400 - margin)) * 0.15;

            // Квантовое туннелирование
            if (Math.random() < 0.01 && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 40;
                sketch.stroke(200, 150, 255, 150);
                sketch.line(oldX, oldY, p.x, p.y);
                // Портал
                sketch.noFill();
                sketch.stroke(255, 100, 200, 100);
                sketch.ellipse(p.x, p.y, state.tunnelFlash, state.tunnelFlash);
                console.log('Particle ' + i + ' tunneled from x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
            } else {
                sketch.noStroke();
            }

            // Запутанность и нелокальность
            if (p.entangledPartner !== null && window.particles[p.entangledPartner]) {
                var partner = window.particles[p.entangledPartner];
                var partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                if (p.collapsed && !partner.collapsed) {
                    partnerState.a = 255;
                    partner.size = 10;
                    partner.collapsed = true;
                    partner.shape = p.shape;
                    state.entanglementFlash = 20;
                    console.log('Non-locality: Particle ' + p.entangledPartner + ' flashed due to ' + i);
                }
                // Энергетическая дуга
                if (state.entanglementFlash > 0) {
                    sketch.noFill();
                    sketch.stroke(state.r, state.g, state.b, state.entanglementFlash * 10);
                    sketch.bezier(p.x, p.y, p.x + 20, p.y - 20, partner.x - 20, partner.y + 20, partner.x, partner.y);
                    state.entanglementFlash--;
                }
            }

            // Обновление позиции
            p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));

            // Декогеренция на шаге 5
            if (window.currentStep === 5) {
                state.decoherenceTimer += 0.03;
                if (state.decoherenceTimer > 8) {
                    state.probability = Math.max(0, state.probability - 0.015);
                    state.a = Math.floor(state.probability * 255);
                    p.size = 6 * state.probability;
                    if (state.probability <= 0) {
                        p.size = 0;
                    }
                    console.log('Particle ' + i + ' decohering, probability: ' + state.probability.toFixed(2) + ', alpha: ' + state.a);
                }
            }

            // Отрисовка частицы
            if (p.size > 0) {
                // Многослойное свечение
                sketch.fill(state.r, state.g, state.b, state.a / 4);
                sketch.ellipse(p.x, p.y, p.size + 15, p.size + 15);
                sketch.fill(state.r, state.g, state.b, state.a / 2);
                sketch.ellipse(p.x, p.y, p.size + 10, p.size + 10);
                // Основная частица
                drawShape(sketch, p.x, p.y, p.size, p.shape, p.rotation, state.r, state.g, state.b, state.a);
                // Вспышка при туннелировании
                if (state.tunnelFlash > 0) {
                    sketch.fill(255, 100, 200, state.tunnelFlash * 8);
                    sketch.ellipse(p.x, p.y, p.size + 10, p.size + 10);
                    state.tunnelFlash--;
                }
            }

            // Логирование первых 5 частиц
            if (i < 5) {
                console.log('Particle ' + i + ' at x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2) + ', size: ' + p.size.toFixed(2) + ', shape: ' + p.shape + ', color: rgb(' + state.r + ', ' + state.g + ', ' + state.b + ', ' + state.a + ')');
            }
        } catch (error) {
            console.error('Error updating particle ' + i + ': ' + error);
        }
    });
};

// Реакция частиц на наблюдение (коллапс)
window.observeParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('observeParticles: No particles or quantum states available');
        return;
    }
    if (window.currentStep !== 4) {
        console.log('observeParticles skipped: not on step 4, currentStep: ' + window.currentStep);
        return;
    }
    console.log('observeParticles called, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    window.particles.forEach(function(p, i) {
        try {
            var dx = mouseX - p.x;
            var dy = mouseY - p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[i];

            if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed) {
                p.collapsed = true;
                state.a = 255;
                p.shape = ['circle', 'spiral', 'ellipse'][Math.floor(Math.random() * 3)];
                sketch.fill(255, 100, 200, 200);
                sketch.ellipse(p.x, p.y, 25, 25);
                console.log('Particle ' + i + ' collapsed, shape: ' + p.shape + ', alpha: ' + state.a);
            }
        } catch (error) {
            console.error('Error observing particle ' + i + ': ' + error);
        }
    });
};
