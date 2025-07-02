console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;

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
    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty or not loaded');
            return;
        }
        var numParticles = 200; // Увеличено для детализации силуэта
        var validParticles = 0;

        // Определение ключевых точек лица (примерные координаты глаз, носа, рта)
        var faceFeatures = [
            { x: img.width * 0.35, y: img.height * 0.3, weight: 0.3 }, // Левый глаз
            { x: img.width * 0.65, y: img.height * 0.3, weight: 0.3 }, // Правый глаз
            { x: img.width * 0.5, y: img.height * 0.5, weight: 0.2 }, // Нос
            { x: img.width * 0.5, y: img.height * 0.7, weight: 0.2 }  // Рот
        ];

        for (var i = 0; i < numParticles; i++) {
            // Распределяем частицы с учётом ключевых точек
            var useFeature = Math.random() < 0.5;
            var x, y;
            if (useFeature) {
                var feature = faceFeatures[Math.floor(Math.random() * faceFeatures.length)];
                x = feature.x + (Math.random() - 0.5) * img.width * 0.2;
                y = feature.y + (Math.random() - 0.5) * img.height * 0.2;
            } else {
                x = Math.random() * img.width;
                y = Math.random() * img.height;
            }
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
                    size: 4,
                    phase: Math.random() * Math.PI * 2,
                    frequency: 0.015,
                    entangledPartner: Math.random() < 0.15 ? Math.floor(Math.random() * numParticles) : null,
                    collapsed: false,
                    decompositionProgress: 0,
                    shape: 'ribbon', // Лентообразная форма
                    featureWeight: useFeature ? faceFeatures.find(f => Math.abs(f.x - x) < img.width * 0.1 && Math.abs(f.y - y) < img.height * 0.1)?.weight || 0.1 : 0.1
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
        console.log('Initialized ' + window.particles.length + ' particles, valid: ' + validParticles);
        if (validParticles === 0) {
            console.error('No valid particles created. Check image dimensions or pixel data.');
        }
    } catch (error) {
        console.error('Error in initializeParticles: ' + error);
    }
};

// Отрисовка лентообразной формы
function drawRibbon(sketch, x, y, size, rotation, r, g, b, a) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    sketch.fill(r, g, b, a);
    sketch.beginShape();
    sketch.vertex(-size * 1.5, size * 0.2);
    sketch.quadraticVertex(0, size * 0.5, size * 1.5, size * 0.2);
    sketch.quadraticVertex(0, -size * 0.5, -size * 1.5, -size * 0.2);
    sketch.endShape(sketch.CLOSE);
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

    // Минималистичный фон с градиентом
    let gradient = sketch.drawingContext.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, 'rgba(20, 20, 30, 0.8)');
    gradient.addColorStop(1, 'rgba(10, 10, 20, 0.8)');
    sketch.drawingContext.fillStyle = gradient;
    sketch.rect(0, 0, 400, 400);

    // Квантовая декомпозиция
    if (window.currentStep === 4 && window.decompositionTimer < 4) {
        window.decompositionTimer += 0.015;
        if (window.img) {
            var imgAlpha = Math.max(0, 255 * (1 - window.decompositionTimer / 4));
            sketch.tint(255, imgAlpha);
            sketch.image(window.img, 0, 0, 400, 400);
            console.log('Decomposition: Image alpha ' + imgAlpha.toFixed(0));
        }
    }

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];

            // Квантовая декомпозиция с волновым движением
            if (window.currentStep === 4 && window.decompositionTimer < 4) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.015);
                state.a = Math.floor(p.decompositionProgress * 255);
                var dx = p.x - 200;
                var dy = p.y - 200;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var wave = Math.sin(dist * 0.03 + window.decompositionTimer * 1.5);
                p.offsetX += wave * 5 * p.featureWeight;
                p.offsetY += wave * 5 * p.featureWeight;
            } else if (window.currentStep === 4) {
                state.a = 255;
            }

            // Суперпозиция и неопределённость
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.015);
            p.phase += p.frequency * p.featureWeight;
            p.offsetX = Math.cos(p.phase) * 8 * n * window.chaosFactor;
            p.offsetY = Math.sin(p.phase) * 8 * n * window.chaosFactor;
            p.size = 4 + 3 * n * state.probability;

            // Притяжение к ключевым точкам лица
            var feature = window.particles[i].featureWeight > 0.1 ? window.particles[i] : null;
            if (feature) {
                var fx = p.baseX;
                var fy = p.baseY;
                p.offsetX += (fx - p.x) * 0.05 * p.featureWeight;
                p.offsetY += (fy - p.y) * 0.05 * p.featureWeight;
            }

            // Тонкие цветовые изменения
            if (!p.collapsed) {
                state.r = Math.min(255, Math.max(0, state.r + (n - 0.5) * 10));
                state.g = Math.min(255, Math.max(0, state.g + (n - 0.5) * 10));
                state.b = Math.min(255, Math.max(0, state.b + (n - 0.5) * 10));
            }

            // Интерференция
            var interference = 0;
            window.particles.forEach(function(other, j) {
                if (i !== j) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 50) {
                        var wave = Math.sin(distance * 0.08 + state.interferencePhase + window.frame * 0.03);
                        interference += wave * 0.1;
                        if (Math.random() < 0.005) {
                            sketch.stroke(state.r, state.g, state.b, 30);
                            sketch.line(p.x, p.y, other.x, other.y);
                        }
                    }
                }
            });
            p.offsetX += interference * 6;
            p.offsetY += interference * 6;

            // Отталкивание от краёв
            var margin = 20;
            if (p.x < margin) p.offsetX += (margin - p.x) * 0.1;
            if (p.x > 400 - margin) p.offsetX -= (p.x - (400 - margin)) * 0.1;
            if (p.y < margin) p.offsetY += (margin - p.y) * 0.1;
            if (p.y > 400 - margin) p.offsetY -= (p.y - (400 - margin)) * 0.1;

            // Квантовое туннелирование
            if (Math.random() < 0.008 && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 30;
                sketch.stroke(state.r, state.g, state.b, 100);
                sketch.line(oldX, oldY, p.x, p.y);
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
                    partner.size = 5;
                    partner.collapsed = true;
                    state.entanglementFlash = 20;
                    console.log('Non-locality: Particle ' + p.entangledPartner + ' flashed due to ' + i);
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(state.r, state.g, state.b, state.entanglementFlash * 8);
                    sketch.line(p.x, p.y, partner.x, partner.y);
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
                    state.probability = Math.max(0, state.probability - 0.01);
                    state.a = Math.floor(state.probability * 255);
                    p.size = 4 * state.probability;
                    if (state.probability <= 0 && p.featureWeight < 0.2) {
                        p.size = 0;
                    }
                    console.log('Particle ' + i + ' decohering, probability: ' + state.probability.toFixed(2) + ', alpha: ' + state.a);
                }
            }

            // Отрисовка частицы
            if (p.size > 0) {
                // Эфирное свечение
                sketch.fill(state.r, state.g, state.b, state.a / 4);
                sketch.ellipse(p.x, p.y, p.size + 8, p.size + 8);
                // Основная частица
                drawRibbon(sketch, p.x, p.y, p.size, p.phase, state.r, state.g, state.b, state.a);
                // Вспышка при туннелировании
                if (state.tunnelFlash > 0) {
                    sketch.fill(state.r, state.g, state.b, state.tunnelFlash * 6);
                    sketch.ellipse(p.x, p.y, p.size + 6, p.size + 6);
                    state.tunnelFlash--;
                }
            }

            // Логирование первых 5 частиц
            if (i < 5) {
                console.log('Particle ' + i + ' at x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2) + ', size: ' + p.size.toFixed(2) + ', shape: ribbon, color: rgb(' + state.r + ', ' + state.g + ', ' + state.b + ', ' + state.a + ')');
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
                p.size = 5;
                sketch.fill(state.r, state.g, state.b, 200);
                sketch.ellipse(p.x, p.y, 15, 15);
                console.log('Particle ' + i + ' collapsed, shape: ribbon, alpha: ' + state.a);
            }
        } catch (error) {
            console.error('Error observing particle ' + i + ': ' + error);
        }
    });
};
