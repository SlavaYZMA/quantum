console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.textParticles = [];

// Инициализация частиц текста
window.initializeTextParticles = function(sketch) {
    console.log('initializeTextParticles called, currentStep: ' + window.currentStep);
    window.textParticles = [];
    const textBlock = document.querySelector(`#step-${String(window.currentStep).replace('.', '-')} .text-block`);
    if (!textBlock) {
        console.error('Text block not found for step ' + window.currentStep);
        return;
    }
    const textElements = textBlock.querySelectorAll('[data-i18n]');
    let yOffset = 20;
    textElements.forEach((element, index) => {
        const text = element.textContent || ''; // Используем textContent напрямую
        for (let i = 0; i < text.length; i++) {
            window.textParticles.push({
                char: text[i],
                x: 20 + i * 10,
                y: yOffset,
                baseX: 20 + i * 10,
                baseY: yOffset,
                offsetX: 0,
                offsetY: 0,
                phase: Math.random() * 2 * Math.PI,
                frequency: 0.01,
                alpha: 255,
                interferencePhase: Math.random() * 2 * Math.PI
            });
        }
        yOffset += 30;
    });
    console.log('Initialized ' + window.textParticles.length + ' text particles');
};

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
    window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty or not loaded');
            return;
        }
        var numParticles = 250;
        var validParticles = 0;

        // Ключевые точки лица (глаза, нос, рот)
        var faceFeatures = [
            { x: img.width * 0.35, y: img.height * 0.3, weight: 0.4 }, // Левый глаз
            { x: img.width * 0.65, y: img.height * 0.3, weight: 0.4 }, // Правый глаз
            { x: img.width * 0.5, y: img.height * 0.5, weight: 0.3 }, // Нос
            { x: img.width * 0.5, y: img.height * 0.7, weight: 0.3 }  // Рот
        ];

        for (var i = 0; i < numParticles; i++) {
            var x, y, brightness;
            var useFeature = Math.random() < 0.6;
            if (useFeature) {
                var feature = faceFeatures[Math.floor(Math.random() * faceFeatures.length)];
                x = feature.x + (Math.random() - 0.5) * img.width * 0.15;
                y = feature.y + (Math.random() - 0.5) * img.height * 0.15;
            } else {
                do {
                    x = Math.random() * img.width;
                    y = Math.random() * img.height;
                    var index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
                    brightness = (img.pixels[index] + img.pixels[index + 1] + img.pixels[index + 2]) / 3;
                } while (brightness < 50 && Math.random() > 0.2);
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
                    size: 3 + brightness / 255 * 3,
                    phase: Math.random() * 2 * Math.PI,
                    frequency: 0.01,
                    entangledPartner: Math.random() < 0.2 ? Math.floor(Math.random() * numParticles) : null,
                    collapsed: false,
                    decompositionProgress: 0,
                    shape: ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)],
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
                    interferencePhase: Math.random() * 2 * Math.PI,
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

// Отрисовка форм
function drawShape(sketch, x, y, size, shape, rotation, r, g, b, a, featureWeight) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    sketch.fill(r, g, b, a);
    if (shape === 'ribbon') {
        sketch.beginShape();
        sketch.vertex(-size * 1.2 * (1 + featureWeight), size * 0.3);
        sketch.quadraticVertex(0, size * 0.4, size * 1.2 * (1 + featureWeight), size * 0.3);
        sketch.quadraticVertex(0, -size * 0.4, -size * 1.2 * (1 + featureWeight), -size * 0.3);
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'ellipse') {
        sketch.ellipse(0, 0, size * 1.5 * (1 + featureWeight), size * 0.5);
    } else if (shape === 'cluster') {
        for (let i = 0; i < 5; i++) {
            let dx = (Math.random() - 0.5) * size * 0.5;
            let dy = (Math.random() - 0.5) * size * 0.5;
            sketch.ellipse(dx, dy, size * 0.3, size * 0.3);
        }
    }
    sketch.pop();
}

// Отрисовка мыши как квантового объекта
function drawMouseWave(sketch) {
    if (window.currentStep !== 4 && window.currentStep !== 5 || window.mouseWave.radius <= 0) return;
    sketch.noFill();
    let gradient = sketch.drawingContext.createRadialGradient(
        window.mouseWave.x, window.mouseWave.y, 0,
        window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius
    );
    gradient.addColorStop(0, 'rgba(200, 200, 200, 0.3)');
    gradient.addColorStop(1, 'rgba(200, 200, 200, 0)');
    sketch.drawingContext.strokeStyle = gradient;
    sketch.strokeWeight(2);
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2);
    
    // Шлейф
    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 100 * (1 - i / window.mouseWave.trail.length);
        sketch.stroke(200, 200, 200, alpha);
        sketch.ellipse(point.x, point.y, window.mouseWave.radius * 0.5);
    });
}

// Обновление частиц
window.updateParticles = function(sketch) {
    if (!window.quantumSketch || !window.particles || window.particles.length === 0) {
        console.error('Cannot update particles: quantumSketch: ' + !!window.quantumSketch + ', particlesLength: ' + (window.particles ? window.particles.length : 0));
        return;
    }
    console.log('updateParticles called, particles: ' + window.particles.length + ', textParticles: ' + window.textParticles.length + ', currentStep: ' + window.currentStep);
    window.frame = window.frame || 0;
    window.frame++;

    // Тёмный градиентный фон
    let gradient = sketch.drawingContext.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, 'rgba(20, 20, 30, 0.9)');
    gradient.addColorStop(1, 'rgba(10, 10, 20, 0.9)');
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

    // Обновление волнового пакета мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 1);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 10) window.mouseWave.trail.shift();
    }

    // Обновление частиц портрета
    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];

            // Квантовая декомпозиция с "взрывным" эффектом
            if (window.currentStep === 4 && window.decompositionTimer < 4) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.015);
                state.a = Math.floor(p.decompositionProgress * 255);
                var dx = p.x - 200;
                var dy = p.y - 200;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var wave = Math.sin(dist * 0.04 + window.decompositionTimer * 2);
                p.offsetX += wave * 6 * p.featureWeight * (dx / (dist + 1));
                p.offsetY += wave * 6 * p.featureWeight * (dy / (dist + 1));
            } else {
                state.a = 255; // Keep particles "alive" on steps 4 and 5
            }

            // Суперпозиция и неопределённость
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.015);
            if (!p.collapsed) {
                p.phase += p.frequency * p.featureWeight;
                p.offsetX = Math.cos(p.phase) * 6 * n * window.chaosFactor;
                p.offsetY = Math.sin(p.phase) * 6 * n * window.chaosFactor;
                p.size = (3 + 2 * n * state.probability) * (1 + p.featureWeight * 0.5);
                if (Math.random() < 0.015) {
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
                }
            } else {
                p.offsetX *= 0.9; // Замедление движения при коллапсе
                p.offsetY *= 0.9;
            }

            // Влияние мыши как волнового пакета
            if (window.currentStep === 4 || window.currentStep === 5) {
                var dx = p.x - window.mouseWave.x;
                var dy = p.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed) {
                    var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                    p.offsetX += dx * influence * 0.1;
                    p.offsetY += dy * influence * 0.1;
                }
            }

            // Притяжение к ключевым точкам лица
            if (p.featureWeight > 0.1) {
                p.offsetX += (p.baseX - p.x) * 0.06 * p.featureWeight;
                p.offsetY += (p.baseY - p.y) * 0.06 * p.featureWeight;
            }

            // Цвета, приближенные к портрету
            if (!p.collapsed) {
                state.r = Math.min(255, Math.max(0, state.r + (n - 0.5) * 5));
                state.g = Math.min(255, Math.max(0, state.g + (n - 0.5) * 5));
                state.b = Math.min(255, Math.max(0, state.b + (n - 0.5) * 5));
            }

            // Интерференция
            var interference = 0;
            window.particles.forEach(function(other, j) {
                if (i !== j) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 60 && p.featureWeight > 0.1 && other.featureWeight > 0.1) {
                        var wave = Math.sin(distance * 0.07 + state.interferencePhase + window.frame * 0.025);
                        interference += wave * 0.08;
                        if (Math.random() < 0.004) {
                            sketch.stroke(state.r, state.g, state.b, 25);
                            sketch.line(p.x, p.y, other.x, other.y);
                        }
                    }
                }
            });
            p.offsetX += interference * 5;
            p.offsetY += interference * 5;

            // Отталкивание от краёв
            var margin = 20;
            if (p.x < margin) p.offsetX += (margin - p.x) * 0.1;
            if (p.x > 400 - margin) p.offsetX -= (p.x - (400 - margin)) * 0.1;
            if (p.y < margin) p.offsetY += (margin - p.y) * 0.1;
            if (p.y > 400 - margin) p.offsetY -= (p.y - (400 - margin)) * 0.1;

            // Квантовое туннелирование
            if (Math.random() < 0.007 && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 25;
                sketch.stroke(state.r, state.g, state.b, 80);
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(state.r, state.g, state.b, 50);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.5, state.tunnelFlash * 0.5);
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
                    partner.size = 4;
                    partner.collapsed = true;
                    partner.shape = p.shape;
                    state.entanglementFlash = 15;
                    console.log('Non-locality: Particle ' + p.entangledPartner + ' flashed due to ' + i);
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(state.r, state.g, state.b, state.entanglementFlash * 10);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                }
            }

            // Обновление позиции
            p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));

            // Отрисовка частицы
            if (p.size > 0) {
                sketch.fill(state.r, state.g, state.b, state.a / 5);
                sketch.ellipse(p.x, p.y, p.size + 6, p.size + 6);
                drawShape(sketch, p.x, p.y, p.size, p.shape, p.phase, state.r, state.g, state.b, state.a, p.featureWeight);
                if (state.tunnelFlash > 0) {
                    sketch.fill(state.r, state.g, state.b, state.tunnelFlash * 5);
                    sketch.ellipse(p.x, p.y, p.size + 5, p.size + 5);
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

    // Обновление и отрисовка текста на всех шагах
    if (window.textParticles.length > 0) {
        window.textParticles.forEach(function(tp, i) {
            // Суперпозиция: дрожание текста
            var n = sketch.noise(tp.x * window.noiseScale, tp.y * window.noiseScale, window.frame * 0.015);
            tp.phase += tp.frequency;
            tp.offsetX = Math.cos(tp.phase) * 2 * n;
            tp.offsetY = Math.sin(tp.phase) * 2 * n;
            tp.alpha = 255 * (0.8 + 0.2 * n);

            // Влияние мыши
            var dx = tp.x - window.mouseWave.x;
            var dy = tp.y - window.mouseWave.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < window.mouseInfluenceRadius && distance > 0) {
                var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                tp.offsetX += dx * influence * 0.05;
                tp.offsetY += dy * influence * 0.05;
                tp.alpha = Math.min(255, tp.alpha + influence * 50);
            }

            // Интерференция между буквами
            var interference = 0;
            window.textParticles.forEach(function(other, j) {
                if (i !== j) {
                    var dx = tp.x - other.x;
                    var dy = tp.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 30) {
                        var wave = Math.sin(distance * 0.07 + tp.interferencePhase + window.frame * 0.025);
                        interference += wave * 0.04;
                        if (Math.random() < 0.004) {
                            sketch.stroke(0, 255, 0, 25);
                            sketch.line(tp.x + tp.offsetX, tp.y + tp.offsetY, other.x + other.offsetX, other.y + other.offsetY);
                        }
                    }
                }
            });
            tp.offsetX += interference * 2;
            tp.offsetY += interference * 2;

            // Отрисовка буквы
            sketch.fill(0, 255, 0, tp.alpha); // Зеленый цвет для текста
            sketch.textSize(16);
            sketch.textFont('Courier New');
            sketch.text(tp.char, tp.x + tp.offsetX, tp.y + tp.offsetY);
        });
    }

    // Отрисовка мыши
    drawMouseWave(sketch);
};

// Реакция частиц на движение мыши
window.observeParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('observeParticles: No particles or quantum states available');
        return;
    }
    console.log('observeParticles called, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    window.mouseWave.x = mouseX;
    window.mouseWave.y = mouseY;
    window.mouseWave.radius = window.mouseInfluenceRadius;

    // Инициализация текста при первом вызове
    if (!window.textParticles || window.textParticles.length === 0) {
        window.initializeTextParticles(sketch);
    }
};

// Реакция частиц на клик (коллапс/восстановление)
window.clickParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('clickParticles: No particles or quantum states available');
        return;
    }
    console.log('clickParticles called, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    window.particles.forEach(function(p, i) {
        try {
            var dx = mouseX - p.x;
            var dy = mouseY - p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[i];

            if (distance < window.mouseInfluenceRadius && distance > 0) {
                if (!p.collapsed) {
                    p.collapsed = true;
                    state.a = 255;
                    p.size = 4;
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
                    sketch.fill(state.r, state.g, state.b, 180);
                    sketch.ellipse(p.x, p.y, 12, 12);
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape + ', alpha: ' + state.a);
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    state.a = 255;
                    p.size = 3 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * 2);
                    console.log('Particle ' + i + ' restored to superposition, shape: ' + p.shape + ', alpha: ' + state.a);
                }
            }
        } catch (error) {
            console.error('Error clicking particle ' + i + ': ' + error);
        }
    });
};
