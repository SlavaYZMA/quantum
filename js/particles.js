console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];

// Инициализация частиц на основе загруженного изображения
window.initializeParticles = function(img) {
    console.log('initializeParticles called, img defined: ' + !!img + ', dimensions: ' + (img ? img.width + 'x' + img.height : 'undefined'));
    if (!img || !img.pixels) {
        console.error('Error: window.img is not defined or pixels not loaded');
        return;
    }
    window.particles = [];
    window.quantumStates = [];
    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty or not loaded');
            return;
        }
        var pixelStep = Math.floor(Math.max(img.width, img.height) / 20);
        var centerX = img.width / 2;
        var centerY = img.height / 2;
        var maxRadius = Math.min(img.width, img.height) / 2;
        var numParticles = 314;

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
                    size: 5 + Math.random() * 10,
                    phase: Math.random() * Math.PI * 2,
                    frequency: 0.01 + Math.random() * 0.02,
                    entangledPartner: Math.random() < 0.2 ? Math.floor(Math.random() * numParticles) : null,
                    collapsed: false,
                    uncertainty: 10 // Для неопределённости
                });

                window.quantumStates.push({
                    r: r,
                    g: g,
                    b: b,
                    a: a,
                    probability: 1.0,
                    decoherenceTimer: 0,
                    tunnelFlash: 0,
                    interferencePhase: Math.random() * Math.PI * 2 // Для интерференции
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

// Обновление частиц для анимации на шагах 4 и 5
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

    // Фон с лёгким градиентом для гипнотического эффекта
    sketch.background(0, 0, 20, 50);

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];

            // Суперпозиция: хаотичное движение и неопределённость
            if (!p.collapsed) {
                var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.01);
                p.phase += p.frequency;
                p.offsetX = Math.cos(p.phase) * 20 * n * window.chaosFactor;
                p.offsetY = Math.sin(p.phase) * 20 * n * window.chaosFactor;
                p.size = 5 + 10 * n; // Пульсация размера
                p.uncertainty = 10 + 5 * n; // Облако неопределённости
            }

            // Интерференция: влияние соседних частиц
            var interference = 0;
            window.particles.forEach(function(other, j) {
                if (i !== j) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 50) {
                        var wave = Math.sin(distance * 0.1 + state.interferencePhase + window.frame * 0.05);
                        interference += wave * 0.1;
                    }
                }
            });
            p.offsetX += interference * 5;
            p.offsetY += interference * 5;

            // Квантовое туннелирование
            if (Math.random() < 0.01) {
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 60;
                console.log('Particle ' + i + ' tunneled to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
            }

            // Запутанность: синхронизация и нелокальность
            if (p.entangledPartner !== null && window.particles[p.entangledPartner]) {
                var partner = window.particles[p.entangledPartner];
                var partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                // Пульсирующая линия с градиентом
                var pulse = Math.sin(window.frame * 0.1);
                sketch.stroke(255 * pulse, 255 * pulse, 255, 150);
                sketch.line(p.x, p.y, partner.x, partner.y);
                // Нелокальность: свечение при коллапсе партнёра
                if (p.collapsed && !partner.collapsed) {
                    partnerState.a = Math.max(50, partnerState.a - 10);
                    partner.size = 12;
                    partner.collapsed = true;
                    console.log('Non-locality: Particle ' + p.entangledPartner + ' affected by ' + i);
                }
                console.log('Particle ' + i + ' entangled with ' + p.entangledPartner + ', synced color: rgb(' + state.r + ', ' + state.g + ', ' + state.b + ')');
            } else {
                sketch.noStroke();
            }

            // Обновление позиции
            p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));

            // Декогеренция на шаге 5
            if (window.currentStep === 5) {
                state.decoherenceTimer += 0.02;
                if (state.decoherenceTimer > 10) {
                    state.probability = Math.max(0, state.probability - 0.01);
                    state.a = Math.floor(state.probability * 255);
                    // Спиральный след
                    sketch.push();
                    sketch.translate(p.x, p.y);
                    sketch.rotate(state.decoherenceTimer);
                    sketch.fill(255, 255, 255, state.a / 2);
                    sketch.ellipse(10, 0, 5, 5);
                    sketch.pop();
                    if (state.probability <= 0) {
                        p.size = 0;
                    }
                    console.log('Particle ' + i + ' decohering, probability: ' + state.probability.toFixed(2) + ', alpha: ' + state.a);
                }
            }

            // Отрисовка частицы с учётом неопределённости
            if (p.size > 0) {
                // Облако неопределённости
                sketch.fill(state.r, state.g, state.b, state.a / 2);
                sketch.ellipse(p.x, p.y, p.size + p.uncertainty, p.size + p.uncertainty);
                // Основная частица
                sketch.fill(state.r, state.g, state.b, state.a);
                sketch.ellipse(p.x, p.y, p.size, p.size);
                // Свечение при туннелировании
                if (state.tunnelFlash > 0) {
                    sketch.fill(255, 255, 255, state.tunnelFlash * 4);
                    sketch.ellipse(p.x, p.y, p.size * 2, p.size * 2);
                    state.tunnelFlash--;
                }
            }

            // Логирование первых 5 частиц
            if (i < 5) {
                console.log('Particle ' + i + ' at x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2) + ', size: ' + p.size.toFixed(2) + ', uncertainty: ' + p.uncertainty.toFixed(2) + ', color: rgb(' + state.r + ', ' + state.g + ', ' + state.b + ', ' + state.a + ')');
            }
        } catch (error) {
            console.error('Error updating particle ' + i + ': ' + error);
        }
    });
};

// Реакция частиц на наблюдение (движение мыши)
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
            var dx = mouseX - p.x;
            var dy = mouseY - p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[i];

            if (distance < window.mouseInfluenceRadius && distance > 0) {
                var force = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                p.offsetX += dx * force * 0.05;
                p.offsetY += dy * force * 0.05;
                state.probability = Math.max(0.1, state.probability - 0.02);
                state.a = Math.floor(state.probability * 255);
                p.collapsed = true;
                p.phase = 0;
                p.size = 8;
                p.uncertainty = 0; // Убираем облако при коллапсе
                // Радиальная волна при коллапсе
                sketch.fill(255, 255, 255, 100);
                sketch.ellipse(p.x, p.y, 20, 20);
                console.log('Particle ' + i + ' collapsed, probability: ' + state.probability.toFixed(2) + ', alpha: ' + state.a);
            }
        } catch (error) {
            console.error('Error observing particle ' + i + ': ' + error);
        }
    });
};
