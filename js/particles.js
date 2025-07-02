console.log('particles.js загружен');

window.particles = [];
window.quantumStates = [];
window.textParticles = [];
window.textQuantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };

// Инициализация частиц из портрета
window.initializeParticles = function(img) {
    console.log('initializeParticles вызван, img определён: ' + !!img + ', размеры: ' + (img ? img.width + 'x' + img.height : 'не определено'));
    if (!img || !img.pixels) {
        console.error('Ошибка: window.img не определён или пиксели не загружены');
        return;
    }
    window.particles = [];
    window.quantumStates = [];
    window.decompositionTimer = 0;
    window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Ошибка: img.pixels пуст или не загружен');
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
        console.log('Инициализировано ' + window.particles.length + ' частиц, валидных: ' + validParticles);
        if (validParticles === 0) {
            console.error('Не создано валидных частиц. Проверьте размеры изображения или данные пикселей.');
        }
    } catch (error) {
        console.error('Ошибка в initializeParticles: ' + error);
    }
};

// Инициализация текстовых частиц
window.initializeTextParticles = function(sketch) {
    console.log('initializeTextParticles вызван, текущий шаг: ' + window.currentStep);
    window.textParticles = [];
    window.textQuantumStates = [];

    // Получаем текст текущего шага
    const textBlock = document.querySelector(`#step-${window.currentStep} .text-block`);
    const textElements = textBlock.querySelectorAll('div[data-i18n]');
    let fullText = Array.from(textElements).map(el => el.innerText).join('\n');

    // Создаём временный холст для рендеринга текста
    let textCanvas = sketch.createGraphics(600, 100);
    textCanvas.background(0);
    textCanvas.fill(255);
    textCanvas.textSize(16);
    textCanvas.textFont('Courier New');
    textCanvas.textAlign(sketch.LEFT, sketch.TOP);
    textCanvas.text(fullText, 10, 10, 580, 80);
    textCanvas.loadPixels();

    // Создаём частицы для текста
    const numTextParticles = 50;
    const step = Math.max(1, Math.floor(textCanvas.width / 10));
    let validTextParticles = 0;

    for (let x = 0; x < textCanvas.width; x += step) {
        for (let y = 0; y < textCanvas.height; y += step) {
            const index = (x + y * textCanvas.width) * 4;
            const brightness = (textCanvas.pixels[index] + textCanvas.pixels[index + 1] + textCanvas.pixels[index + 2]) / 3;
            if (brightness > 50 && Math.random() < 0.1) {
                const r = window.img ? window.img.pixels[index % (window.img.width * 4)] || 15 : 15; // Используем цвета портрета или зелёный (#0f0)
                const g = window.img ? window.img.pixels[(index % (window.img.width * 4)) + 1] || 255 : 255;
                const b = window.img ? window.img.pixels[(index % (window.img.width * 4)) + 2] || 15 : 15;
                window.textParticles.push({
                    x: x,
                    y: y,
                    baseX: x,
                    baseY: y,
                    offsetX: 0,
                    offsetY: 0,
                    size: 3 + brightness / 255 * 2,
                    phase: Math.random() * 2 * Math.PI,
                    frequency: 0.01,
                    entangledPartner: Math.random() < 0.2 ? Math.floor(Math.random() * numTextParticles) : null,
                    collapsed: false,
                    shape: ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)],
                    featureWeight: 0.3
                });

                window.textQuantumStates.push({
                    r: r,
                    g: g,
                    b: b,
                    a: 200,
                    probability: 1.0,
                    tunnelFlash: 0,
                    interferencePhase: Math.random() * 2 * Math.PI,
                    entanglementFlash: 0
                });
                validTextParticles++;
            }
        }
    }
    console.log('Инициализировано ' + window.textParticles.length + ' текстовых частиц, валидных: ' + validTextParticles);
    sketch.removeSprite(textCanvas); // Удаляем временный холст
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

// Обновление частиц портрета
window.updateParticles = function(sketch) {
    if (!window.quantumSketch || !window.particles || window.particles.length === 0) {
        console.error('Невозможно обновить частицы: quantumSketch: ' + !!window.quantumSketch + ', particlesLength: ' + (window.particles ? window.particles.length : 0));
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('updateParticles пропущен: не на шаге 4 или 5, текущий шаг: ' + window.currentStep);
        return;
    }
    console.log('updateParticles вызван, частиц: ' + window.particles.length + ', текущий шаг: ' + window.currentStep);
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
            console.log('Декомпозиция: прозрачность изображения ' + imgAlpha.toFixed(0));
        }
    }

    // Обновление волнового пакета мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 1);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 10) window.mouseWave.trail.shift();
    }

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
                state.a = 255; // Поддерживаем частицы "живыми" на шагах 4 и 5
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
                console.log('Частица ' + i + ' туннелировала с x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' на x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
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
                    console.log('Нелокальность: частица ' + p.entangledPartner + ' вспыхнула из-за ' + i);
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
                console.log('Частица ' + i + ' на x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2) + ', размер: ' + p.size.toFixed(2) + ', форма: ' + p.shape + ', цвет: rgb(' + state.r + ', ' + state.g + ', ' + state.b + ', ' + state.a + ')');
            }
        } catch (error) {
            console.error('Ошибка обновления частицы ' + i + ': ' + error);
        }
    });

    // Отрисовка мыши
    drawMouseWave(sketch);
};

// Обновление текстовых частиц
window.updateTextParticles = function(sketch) {
    if (!window.textParticles || window.textParticles.length === 0) {
        console.error('Невозможно обновить текстовые частицы: textParticlesLength: ' + (window.textParticles ? window.textParticles.length : 0));
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('updateTextParticles пропущен: не на шаге 4 или 5, текущий шаг: ' + window.currentStep);
        return;
    }
    console.log('updateTextParticles вызван, текстовых частиц: ' + window.textParticles.length + ', текущий шаг: ' + window.currentStep);

    window.textParticles.forEach(function(p, i) {
        try {
            var state = window.textQuantumStates[i];

            // Суперпозиция
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.015);
            if (!p.collapsed) {
                p.phase += p.frequency * p.featureWeight;
                p.offsetX = Math.cos(p.phase) * 5 * n * window.chaosFactor;
                p.offsetY = Math.sin(p.phase) * 5 * n * window.chaosFactor;
                p.size = (3 + 2 * n * state.probability) * (1 + p.featureWeight * 0.5);
                state.a = Math.min(255, Math.max(200, state.a + (n - 0.5) * 10));
                if (Math.random() < 0.015) {
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
                }
            } else {
                p.offsetX *= 0.9;
                p.offsetY *= 0.9;
                state.a = 255;
            }

            // Влияние мыши
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

            // Притяжение к базовой позиции
            if (p.featureWeight > 0.1) {
                p.offsetX += (p.baseX - p.x) * 0.06 * p.featureWeight;
                p.offsetY += (p.baseY - p.y) * 0.06 * p.featureWeight;
            }

            // Интерференция
            var interference = 0;
            window.textParticles.forEach(function(other, j) {
                if (i !== j) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 30 && p.featureWeight > 0.1 && other.featureWeight > 0.1) {
                        var wave = Math.sin(distance * 0.07 + state.interferencePhase + window.frame * 0.025);
                        interference += wave * 0.08;
                        if (Math.random() < 0.004) {
                            sketch.stroke(state.r, state.g, state.b, 25);
                            sketch.line(p.x, p.y, other.x, other.y);
                        }
                    }
                }
            });
            p.offsetX += interference * 3;
            p.offsetY += interference * 3;

            // Квантовое туннелирование
            if (Math.random() < 0.007 && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 600;
                p.y = Math.random() * 100;
                state.tunnelFlash = 25;
                sketch.stroke(state.r, state.g, state.b, 80);
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(state.r, state.g, state.b, 50);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.5, state.tunnelFlash * 0.5);
                console.log('Текстовая частица ' + i + ' туннелировала с x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' на x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
            } else {
                sketch.noStroke();
            }

            // Запутанность
            if (p.entangledPartner !== null && window.textParticles[p.entangledPartner]) {
                var partner = window.textParticles[p.entangledPartner];
                var partnerState = window.textQuantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                if (p.collapsed && !partner.collapsed) {
                    partnerState.a = 255;
                    partner.size = 4;
                    partner.collapsed = true;
                    partner.shape = p.shape;
                    state.entanglementFlash = 15;
                    console.log('Нелокальность: текстовая частица ' + p.entangledPartner + ' вспыхнула из-за ' + i);
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(state.r, state.g, state.b, state.entanglementFlash * 10);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                }
            }

            // Обновление позиции
            p.x = Math.max(0, Math.min(600, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(100, p.baseY + p.offsetY));

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

            // Логирование первых 5 текстовых частиц
            if (i < 5) {
                console.log('Текстовая частица ' + i + ' на x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2) + ', размер: ' + p.size.toFixed(2) + ', форма: ' + p.shape + ', цвет: rgb(' + state.r + ', ' + state.g + ', ' + state.b + ', ' + state.a + ')');
            }
        } catch (error) {
            console.error('Ошибка обновления текстовой частицы ' + i + ': ' + error);
        }
    });
};

// Реакция частиц на движение мыши
window.observeParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('observeParticles: Нет частиц или квантовых состояний');
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('observeParticles пропущен: не на шаге 4 или 5, текущий шаг: ' + window.currentStep);
        return;
    }
    console.log('observeParticles вызван, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    window.mouseWave.x = mouseX;
    window.mouseWave.y = mouseY;
    window.mouseWave.radius = window.mouseInfluenceRadius;
};

// Реакция текстовых частиц на движение мыши
window.observeTextParticles = function(sketch, mouseX, mouseY) {
    if (!window.textParticles || !window.textQuantumStates || window.textParticles.length === 0) {
        console.error('observeTextParticles: Нет текстовых частиц или квантовых состояний');
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('observeTextParticles пропущен: не на шаге 4 или 5, текущий шаг: ' + window.currentStep);
        return;
    }
    console.log('observeTextParticles вызван, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    window.mouseWave.x = mouseX;
    window.mouseWave.y = mouseY;
    window.mouseWave.radius = window.mouseInfluenceRadius;
};

// Реакция частиц на клик (коллапс/восстановление)
window.clickParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('clickParticles: Нет частиц или квантовых состояний');
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('clickParticles пропущен: не на шаге 4 или 5, текущий шаг: ' + window.currentStep);
        return;
    }
    console.log('clickParticles вызван, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
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
                    console.log('Частица ' + i + ' коллапсировала, форма: ' + p.shape + ', прозрачность: ' + state.a);
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    state.a = 255;
                    p.size = 3 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * 2);
                    console.log('Частица ' + i + ' восстановлена в суперпозицию, форма: ' + p.shape + ', прозрачность: ' + state.a);
                }
            }
        } catch (error) {
            console.error('Ошибка клика по частице ' + i + ': ' + error);
        }
    });
};

// Реакция текстовых частиц на клик (коллапс/восстановление)
window.clickTextParticles = function(sketch, mouseX, mouseY) {
    if (!window.textParticles || !window.textQuantumStates || window.textParticles.length === 0) {
        console.error('clickTextParticles: Нет текстовых частиц или квантовых состояний');
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('clickTextParticles пропущен: не на шаге 4 или 5, текущий шаг: ' + window.currentStep);
        return;
    }
    console.log('clickTextParticles вызван, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    window.textParticles.forEach(function(p, i) {
        try {
            var dx = mouseX - p.x;
            var dy = mouseY - p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.textQuantumStates[i];

            if (distance < window.mouseInfluenceRadius && distance > 0) {
                if (!p.collapsed) {
                    p.collapsed = true;
                    state.a = 255;
                    p.size = 4;
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
                    sketch.fill(state.r, state.g, state.b, 180);
                    sketch.ellipse(p.x, p.y, 12, 12);
                    console.log('Текстовая частица ' + i + ' коллапсировала, форма: ' + p.shape + ', прозрачность: ' + state.a);
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    state.a = 255;
                    p.size = 3 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * 2);
                    console.log('Текстовая частица ' + i + ' восстановлена в суперпозицию, форма: ' + p.shape + ', прозрачность: ' + state.a);
                }
            }
        } catch (error) {
            console.error('Ошибка клика по текстовой частице ' + i + ': ' + error);
        }
    });
};
