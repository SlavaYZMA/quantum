console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;

// Инициализация частиц на основе изображения
window.initializeParticles = function(img) {
    console.log('initializeParticles called, img defined: ' + !!img + ', dimensions: ' + (img ? img.width + 'x' + img.height : 'undefined'));
    if (!img || !img.pixels) {
        console.error('Error: window.img is not defined or pixels not loaded');
        return;
    }
    window.particles = [];
    window.quantumStates = [];
    window.decompositionTimer = 0;
    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty or not loaded');
            return;
        }
        var pixelStep = Math.floor(Math.max(img.width, img.height) / 15);
        var centerX = img.width / 2;
        var centerY = img.height / 2;
        var maxRadius = Math.min(img.width, img.height) / 2;
        var numParticles = 150;

        var validParticles = 0;
        for (var i = 0; i < numParticles; i++) {
            var angle = Math.random() * Math.PI * 2;
            var radius = Math.random() * maxRadius;
            var x = centerX + Math.cos(angle) * radius;
            var y = centerY + Math.sin(angle) * radius;

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
                    decompositionProgress: 0
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
                    pulse: 1.0 // Для пульсации запутанных пар
                });
                validParticles++;
            }
        }
        console.log('Initialized ' + window.particles.length + ' particles, valid: ' + validParticles);
        if (validParticles === 0) {
            console.error('No valid particles created. Check image dimensions or pixel data.');
        }
    } catch (error) {
        console.error('Error in initializeParticles: ' + error);
    }
};

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

    // Мерцающий фон с радиальным градиентом
    sketch.background(0, 0, 10, 50);
    let gradient = sketch.drawingContext.createRadialGradient(200, 200, 0, 200, 200, 200);
    gradient.addColorStop(0, 'rgba(20, 20, 50, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 20, 0.1)');
    sketch.drawingContext.fillStyle = gradient;
    sketch.rect(0, 0, 400, 400);

    // Квантовая флуктуация (разбиение портрета)
    if (window.currentStep === 4 && window.decompositionTimer < 3) {
        window.decompositionTimer += 0.02;
        if (window.img) {
            let imgAlpha = Math.max(0, 255 * (1 - window.decompositionTimer / 3));
            sketch.tint(255, imgAlpha);
            sketch.image(window.img, 0, 0, 400, 400);
            console.log('Decomposition: Image alpha ' + imgAlpha.toFixed(0));
        }
    }

    window.particles.forEach(function(p, i) {
        try {
            let state = window.quantumStates[i];

            // Квантовая флуктуация
            if (window.currentStep === 4 && window.decompositionTimer < 3) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.02);
                state.a = Math.floor(p.decompositionProgress * 255);
                // Случайные смещения для эффекта распыления
                p.offsetX = Math.random() * 10 - 5;
                p.offsetY = Math.random() * 10 - 5;
            } else if (window.currentStep === 4) {
                state.a = 255;
            }

            // Суперпозиция и неопределённость
            if (!p.collapsed) {
                let n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.02);
                p.phase += p.frequency;
                p.offsetX = Math.cos(p.phase) * 10 * n * window.chaosFactor;
                p.offsetY = Math.sin(p.phase) * 10 * n * window.chaosFactor;

                // Отталкивание от краёв
                let margin = 30;
                if (p.x < margin) p.offsetX += (margin - p.x) * 0.15;
                if (p.x > 400 - margin) p.offsetX -= (p.x - (400 - margin)) * 0.15;
                if (p.y < margin) p.offsetY += (margin - p.y) * 0.15;
                if (p.y > 400 - margin) p.offsetY -= (p.y - (400 - margin)) * 0.15;
            }

            // Интерференция
            let interference = 0;
            window.particles.forEach(function(other, j) {
                if (i !== j && !p.collapsed) {
                    let dx = p.x - other.x;
                    let dy = p.y - other.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 60) {
                        let wave = Math.sin(distance * 0.2 + state.interferencePhase + window.frame * 0.04);
                        interference += wave * 0.2;
                        // Вихревой след
                        sketch.push();
                        sketch.translate(p.x, p.y);
                        sketch.rotate(window.frame * 0.1);
                        sketch.fill(255, 255, 255, 50);
                        sketch.ellipse(10 * wave, 0, 5, 5);
                        sketch.pop();
                    }
                }
            });
            p.offsetX += interference * 10;
            p.offsetY += interference * 10;

            // Квантовое туннелирование
            if (Math.random() < 0.01 && !p.collapsed) {
                let oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 30;
                // Волнообразный след
                sketch.stroke(255, 255, 255, 150);
                sketch.noFill();
                sketch.bezier(oldX, oldY, oldX + 50, oldY - 50, p.x - 50, p.y + 50, p.x, p.y);
                console.log('Particle ' + i + ' tunneled from x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
            } else {
                sketch.noStroke();
            }

            // Запутанность и нелокальность
            if (p.entangledPartner !== null && window.particles[p.entangledPartner]) {
                let partner = window.particles[p.entangledPartner];
                let partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                state.pulse = partnerState.pulse = Math.abs(Math.sin(window.frame * 0.1));
                if (p.collapsed && !partner.collapsed) {
                    partnerState.a = 255;
                    partner.size = 10;
                    partner.collapsed = true;
                    console.log('Non-locality: Particle ' + p.entangledPartner + ' flashed due to ' + i);
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
                    if (state.probability <= 0) {
                        p.size = 0;
                    }
                    console.log('Particle ' + i + ' decohering, probability: ' + state.probability.toFixed(2) + ', alpha: ' + state.a);
                }
            }

            // Отрисовка частицы
            if (p.size > 0) {
                // Яркое свечение
                let gradient = sketch.drawingContext.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size + 10);
                gradient.addColorStop(0, `rgba(${state.r}, ${state.g}, ${state.b}, ${state.a / 2})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                sketch.drawingContext.fillStyle = gradient;
                sketch.ellipse(p.x, p.y, p.size + 10, p.size + 10);
                // Основная частица с пульсацией для запутанных
                sketch.fill(state.r, state.g, state.b, state.a * (p.entangledPartner ? state.pulse : 1));
                sketch.ellipse(p.x, p.y, p.size, p.size);
                // Вспышка при туннелировании
                if (state.tunnelFlash > 0) {
                    sketch.fill(255, 255, 255, state.tunnelFlash * 10);
                    sketch.ellipse(p.x, p.y, p.size + 8, p.size + 8);
                    state.tunnelFlash--;
                }
            }

            // Логирование первых 5 частиц
            if (i < 5) {
                console.log('Particle ' + i + ' at x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2) + ', size: ' + p.size.toFixed(2) + ', color: rgb(' + state.r + ', ' + state.g + ', ' + state.b + ', ' + state.a + ')');
            }
        } catch (error) {
            console.error('Error updating particle ' + i + ': ' + error);
        }
    });
};

// Реакция на клик мыши (коллапс и размораживание)
window.observeParticles = function(mouseX, mouseY) {
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
            let dx = mouseX - p.x;
            let dy = mouseY - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let state = window.quantumStates[i];

            if (distance < window.mouseInfluenceRadius && distance > 0) {
                if (!p.collapsed) {
                    p.collapsed = true;
                    p.size = 8;
                    state.a = 255;
                    sketch.fill(255, 255, 255, 200);
                    sketch.ellipse(p.x, p.y, 20, 20);
                    console.log('Particle ' + i + ' collapsed, alpha: ' + state.a);
                } else {
                    p.collapsed = false;
                    p.size = 6;
                    p.phase = Math.random() * Math.PI * 2;
                    console.log('Particle ' + i + ' uncollapsed');
                }
            }
        } catch (error) {
            console.error('Error observing particle ' + i + ': ' + error);
        }
    });
};
