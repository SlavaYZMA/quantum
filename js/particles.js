console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [], zoom: 1.0 };
window.terminalMessages = [];
window.globalMessageCooldown = 0;
window.evolutionStage = 'chaos'; // Этапы: chaos, transition, order, collapse
window.stageTimer = 0;
window.faceFeatures = [];
window.pulseFactor = 0;

// Варианты сообщений с учетом этапов эволюции
const messages = {
    initialize: [
        "Инициализация квантовой системы портрета. Частицы в хаотической суперпозиции.",
        "Формирование квантового поля портрета. Начальная энтропия максимальна.",
        "Квантовая декомпозиция начата. Частицы в состоянии хаоса."
    ],
    initializeSuccess: [
        "Система инициализирована: ${validParticles} частиц в хаотическом состоянии.",
        "Успешная декомпозиция: ${validParticles} квантовых частиц готовы.",
        "Портрет разложен на ${validParticles} квантовых состояний."
    ],
    initializeError: [
        "Ошибка: квантовая система не сформирована.",
        "Не удалось загрузить данные изображения.",
        "Аномалия: изображение не декомпозировано."
    ],
    chaos: [
        "Частицы портрета находятся в хаотическом состоянии, энтропия максимальна.",
        "Квантовая система демонстрирует высокую неопределённость.",
        "Хаотическое движение частиц формирует квантовое поле портрета."
    ],
    transition: [
        "Система переходит к упорядочиванию. Частицы начинают формировать структуру.",
        "Квантовая интерференция приводит к появлению узоров в портрете.",
        "Частицы начинают синхронизироваться, снижая энтропию."
    ],
    order: [
        "Квантовая система достигла упорядоченного состояния. Портрет формируется.",
        "Частицы синхронизированы, образуя узнаваемую структуру лица.",
        "Система стабилизирована: портрет в квазиклассическом состоянии."
    ],
    collapse: [
        "Полный коллапс волновой функции. Портрет фиксирован в одном состоянии.",
        "Квантовая система коллапсировала под воздействием наблюдения.",
        "Все частицы зафиксированы, портрет стабилизирован."
    ],
    decomposition: [
        "Квантовая декомпозиция: прозрачность изображения ${imgAlpha}/255.",
        "Изображение подвергается декогеренции: прозрачность ${imgAlpha}/255.",
        "Декомпозиция портрета: прозрачность достигла ${imgAlpha}/255."
    ],
    mouseInfluence: [
        "Наблюдение вызывает возмущение волновой функции частиц.",
        "Волновой пакет наблюдателя изменяет траектории частиц.",
        "Квантовая интерференция инициирована наблюдением."
    ],
    featureAttraction: [
        "Частицы притягиваются к ключевым точкам лица, усиливая структуру.",
        "Квантовая система локализуется вокруг черт лица.",
        "Притяжение частиц формирует узнаваемый образ."
    ],
    interference: [
        "Квантовая интерференция создаёт когерентные узоры в портрете.",
        "Волновые функции частиц интерферируют, формируя структуру.",
        "Интерференция усиливает квантовую корреляцию частиц."
    ],
    tunneling: [
        "Частица осуществила квантовое туннелирование через барьер.",
        "Квантовая система: туннелирование частицы в новое состояние.",
        "Туннелирование усиливает неопределённость в системе."
    ],
    entanglement: [
        "Запутанные частицы демонстрируют квантовую корреляцию.",
        "Квантовая запутанность синхронизирует состояния частиц.",
        "Нелокальная корреляция изменяет квантовую систему."
    ],
    collapseParticle: [
        "Частица коллапсировала в состояние ${shape} под воздействием наблюдения.",
        "Квантовая частица фиксирована в форме ${shape}.",
        "Коллапс волновой функции: частица в состоянии ${shape}."
    ],
    superpositionRestore: [
        "Частица восстановлена в состояние суперпозиции.",
        "Квантовая неопределённость частицы восстановлена.",
        "Частица возвращена в суперпозицию."
    ],
    error: [
        "Ошибка в квантовой системе: частица ${index} не обновлена.",
        "Квантовая аномалия: частица ${index} не обработана.",
        "Сбой в системе: частица ${index} не изменила состояние."
    ]
};

// Выбор сообщения с учетом контекста
function getRandomMessage(type, params = {}) {
    let msgArray = messages[type];
    let msg = msgArray[Math.floor(Math.random() * msgArray.length)];
    for (let key in params) {
        msg = msg.replace(`\${${key}}`, params[key]);
    }
    return `[${new Date().toLocaleTimeString()}] ${msg}`;
}

// Обновление терминала
window.updateTerminalLog = function() {
    const maxMessages = 10;
    while (window.terminalMessages.length > maxMessages) {
        window.terminalMessages.shift();
    }
    const terminalDiv = document.getElementById(`terminal-log-step-${window.currentStep}`);
    if (terminalDiv) {
        terminalDiv.innerHTML = window.terminalMessages.map(msg => 
            `<div class="${msg.includes('туннелирование') ? 'tunneling' : msg.includes('интерфери') ? 'interference' : msg.includes('запутанность') ? 'entanglement' : ''}">${msg}</div>`
        ).join('');
    }
};

// Инициализация частиц
window.initializeParticles = function(img) {
    console.log('initializeParticles called, img defined: ' + !!img + ', dimensions: ' + (img ? img.width + 'x' + img.height : 'undefined'));
    window.terminalMessages.push(getRandomMessage('initialize'));
    window.updateTerminalLog();
    window.playInitialization();
    if (!img || !img.pixels) {
        console.error('Error: window.img is not defined or pixels not loaded');
        window.terminalMessages.push(getRandomMessage('initializeError'));
        window.updateTerminalLog();
        return;
    }
    window.particles = [];
    window.quantumStates = [];
    window.decompositionTimer = 0;
    window.stageTimer = 0;
    window.evolutionStage = 'chaos';
    window.mouseWave = { x: 0, y: 0, radius: 0, trail: [], zoom: 1.0 };
    window.globalMessageCooldown = 0;
    window.faceFeatures = [
        { x: img.width * 0.35, y: img.height * 0.3, weight: 0.5 }, // Левый глаз
        { x: img.width * 0.65, y: img.height * 0.3, weight: 0.5 }, // Правый глаз
        { x: img.width * 0.5, y: img.height * 0.5, weight: 0.4 }, // Нос
        { x: img.width * 0.5, y: img.height * 0.7, weight: 0.4 }  // Рот
    ];
    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty or not loaded');
            window.terminalMessages.push(getRandomMessage('initializeError'));
            window.updateTerminalLog();
            return;
        }
        var numParticles = 200; // Уменьшено для оптимизации
        var validParticles = 0;

        for (var i = 0; i < numParticles; i++) {
            var x, y, brightness;
            var useFeature = Math.random() < 0.7; // Увеличена вероятность привязки к лицу
            if (useFeature) {
                var feature = window.faceFeatures[Math.floor(Math.random() * window.faceFeatures.length)];
                x = feature.x + (Math.random() - 0.5) * img.width * 0.1;
                y = feature.y + (Math.random() - 0.5) * img.height * 0.1;
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
                    frequency: 0.01 + Math.random() * 0.02,
                    entangledPartner: Math.random() < 0.3 ? Math.floor(Math.random() * numParticles) : null,
                    collapsed: false,
                    decompositionProgress: 0,
                    shape: ['spiral', 'wave', 'fractal', 'ellipse'][Math.floor(Math.random() * 4)],
                    featureWeight: useFeature ? window.faceFeatures.find(f => Math.abs(f.x - x) < img.width * 0.1 && Math.abs(f.y - y) < img.height * 0.1)?.weight || 0.2 : 0.2
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
        window.terminalMessages.push(getRandomMessage('initializeSuccess', { validParticles }));
        window.updateTerminalLog();
        window.playInitialization();
        if (validParticles === 0) {
            console.error('No valid particles created.');
            window.terminalMessages.push(getRandomMessage('initializeError'));
            window.updateTerminalLog();
        }
    } catch (error) {
        console.error('Error in initializeParticles: ' + error);
        window.terminalMessages.push(getRandomMessage('initializeError'));
        window.updateTerminalLog();
    }
};

// Новые формы частиц
function drawShape(sketch, x, y, size, shape, rotation, r, g, b, a, featureWeight) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    sketch.fill(r, g, b, a);
    sketch.noStroke();
    if (shape === 'spiral') {
        sketch.beginShape();
        for (let t = 0; t < 2 * Math.PI; t += 0.1) {
            let r = size * (1 + t * 0.2) * (1 + featureWeight);
            sketch.vertex(r * Math.cos(t), r * Math.sin(t));
        }
        sketch.endShape();
    } else if (shape === 'wave') {
        sketch.beginShape();
        for (let x = -size * 1.5; x < size * 1.5; x += 0.5) {
            let y = Math.sin(x * 0.3 + rotation) * size * 0.5 * (1 + featureWeight);
            sketch.vertex(x, y);
        }
        sketch.endShape();
    } else if (shape === 'fractal') {
        drawFractal(sketch, 0, 0, size * 1.2 * (1 + featureWeight), 3);
    } else if (shape === 'ellipse') {
        sketch.ellipse(0, 0, size * 1.5 * (1 + featureWeight), size * 0.5);
    }
    sketch.pop();
}

// Рекурсивная функция для фрактальной формы
function drawFractal(sketch, x, y, size, depth) {
    if (depth <= 0) return;
    sketch.ellipse(x, y, size, size);
    let newSize = size * 0.5;
    drawFractal(sketch, x + newSize, y, newSize, depth - 1);
    drawFractal(sketch, x - newSize, y, newSize, depth - 1);
    drawFractal(sketch, x, y + newSize, newSize, depth - 1);
    drawFractal(sketch, x, y - newSize, newSize, depth - 1);
}

// Динамичный фон
function drawDynamicBackground(sketch) {
    window.pulseFactor = Math.sin(window.frame * 0.02) * 0.1 + 0.9;
    let gradient = sketch.drawingContext.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, `rgba(20, 20, 40, ${window.pulseFactor})`);
    gradient.addColorStop(1, `rgba(10, 10, 30, ${window.pulseFactor})`);
    sketch.drawingContext.fillStyle = gradient;
    sketch.rect(0, 0, 400, 400);
}

// Отрисовка мыши
function drawMouseWave(sketch) {
    if (window.currentStep !== 4 && window.currentStep !== 5 || window.mouseWave.radius <= 0) return;
    sketch.noFill();
    let gradient = sketch.drawingContext.createRadialGradient(
        window.mouseWave.x, window.mouseWave.y, 0,
        window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius
    );
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
    sketch.drawingContext.strokeStyle = gradient;
    sketch.strokeWeight(3);
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2 * window.mouseWave.zoom);
    
    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 150 * (1 - i / window.mouseWave.trail.length);
        sketch.stroke(0, 255, 255, alpha);
        sketch.ellipse(point.x, point.y, window.mouseWave.radius * 0.5 * window.mouseWave.zoom);
    });
}

// Полный коллапс всех частиц
window.triggerFullCollapse = function() {
    window.evolutionStage = 'collapse';
    window.particles.forEach((p, i) => {
        p.collapsed = true;
        p.size = 5;
        p.shape = 'ellipse';
        window.quantumStates[i].a = 255;
        p.offsetX = 0;
        p.offsetY = 0;
        p.x = p.baseX;
        p.y = p.baseY;
    });
    window.terminalMessages.push(getRandomMessage('collapse'));
    window.updateTerminalLog();
    window.playCollapse();
};

// Обновление частиц
window.updateParticles = function(sketch) {
    if (!window.quantumSketch || !window.particles || window.particles.length === 0) {
        console.error('Cannot update particles: quantumSketch: ' + !!window.quantumSketch + ', particlesLength: ' + (window.particles ? window.particles.length : 0));
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 180;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) return;
    console.log('updateParticles called, particles: ' + window.particles.length + ', stage: ' + window.evolutionStage);
    let messageAddedThisFrame = false;
    window.stageTimer++;
    window.globalMessageCooldown--;
    
    // Управление этапами эволюции
    if (window.evolutionStage === 'chaos' && window.stageTimer > 600) {
        window.evolutionStage = 'transition';
        window.stageTimer = 0;
        window.terminalMessages.push(getRandomMessage('transition'));
        window.updateTerminalLog();
        window.playTransition();
    } else if (window.evolutionStage === 'transition' && window.stageTimer > 600) {
        window.evolutionStage = 'order';
        window.stageTimer = 0;
        window.terminalMessages.push(getRandomMessage('order'));
        window.updateTerminalLog();
        window.playStabilization();
    }

    // Динамичный фон
    drawDynamicBackground(sketch);

    // Декомпозиция на шаге 4
    if (window.currentStep === 4 && window.decompositionTimer < 4) {
        window.decompositionTimer += 0.02;
        if (window.img) {
            var imgAlpha = Math.max(0, 255 * (1 - window.decompositionTimer / 4));
            sketch.tint(255, imgAlpha);
            sketch.image(window.img, 0, 0, 400, 400);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('decomposition', { imgAlpha: imgAlpha.toFixed(0) }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 180;
                messageAddedThisFrame = true;
            }
        }
    } else if (window.currentStep === 5 && window.evolutionStage !== 'collapse') {
        if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
            window.terminalMessages.push(getRandomMessage(window.evolutionStage));
            window.updateTerminalLog();
            window.globalMessageCooldown = 180;
            messageAddedThisFrame = true;
        }
    }

    // Обновление мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 1);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 15) window.mouseWave.trail.shift();
    }

    // Обработка частиц (оптимизировано)
    let potentialMessages = [];
    for (let i = 0; i < window.particles.length; i++) {
        let p = window.particles[i];
        let state = window.quantumStates[i];

        // Декомпозиция с эффектом взрыва
        if (window.currentStep === 4 && window.decompositionTimer < 4) {
            p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.02);
            state.a = Math.floor(p.decompositionProgress * 255);
            let dx = p.x - 200;
            let dy = p.y - 200;
            let dist = Math.sqrt(dx * dx + dy * dy) + 1;
            let wave = Math.sin(dist * 0.05 + window.decompositionTimer * 3);
            p.offsetX += wave * 8 * p.featureWeight * (dx / dist);
            p.offsetY += wave * 8 * p.featureWeight * (dy / dist);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                potentialMessages.push({ type: 'scatter', params: {} });
            }
        } else {
            state.a = 255;
        }

        // Поведение в зависимости от этапа
        let n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.01);
        if (!p.collapsed) {
            if (window.evolutionStage === 'chaos') {
                p.phase += p.frequency * p.featureWeight;
                p.offsetX = Math.cos(p.phase) * 10 * n * window.chaosFactor;
                p.offsetY = Math.sin(p.phase) * 10 * n * window.chaosFactor;
                p.size = (3 + 3 * n * state.probability) * (1 + p.featureWeight);
            } else if (window.evolutionStage === 'transition') {
                p.offsetX *= 0.95;
                p.offsetY *= 0.95;
                p.size = (3 + 2 * n * state.probability) * (1 + p.featureWeight * 0.7);
            } else if (window.evolutionStage === 'order') {
                p.offsetX += (p.baseX - p.x) * 0.1 * p.featureWeight;
                p.offsetY += (p.baseY - p.y) * 0.1 * p.featureWeight;
                p.size = 4 * (1 + p.featureWeight);
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'featureAttraction', params: {} });
                }
            }
            if (Math.random() < 0.01 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                p.shape = ['spiral', 'wave', 'fractal', 'ellipse'][Math.floor(Math.random() * 4)];
                potentialMessages.push({ type: 'superposition', params: { shape: p.shape } });
                window.playNote(window.noteFrequencies[p.shape] || 261.63, 'sine', 0.5, 0.3);
            }
        } else {
            p.offsetX *= 0.9;
            p.offsetY *= 0.9;
        }

        // Влияние мыши
        if (window.currentStep === 4 || window.currentStep === 5) {
            let dx = p.x - window.mouseWave.x;
            let dy = p.y - window.mouseWave.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < window.mouseInfluenceRadius * window.mouseWave.zoom && distance > 0 && !p.collapsed) {
                let influence = (window.mouseInfluenceRadius * window.mouseWave.zoom - distance) / (window.mouseInfluenceRadius * window.mouseWave.zoom);
                p.offsetX += dx * influence * 0.15;
                p.offsetY += dy * influence * 0.15;
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'mouseInfluence', params: {} });
                }
            }
        }

        // Цвета с акцентами
        if (!p.collapsed) {
            state.r = Math.min(255, Math.max(0, state.r + (n - 0.5) * 10));
            state.g = Math.min(255, Math.max(0, state.g + (n - 0.5) * 10));
            state.b = Math.min(255, Math.max(0, state.b + (n - 0.5) * 10));
            if (p.featureWeight > 0.3) {
                state.r = Math.min(255, state.r + 20); // Акцент для черт лица
                state.b = Math.min(255, state.b + 20);
            }
        }

        // Интерференция
        let interference = 0;
        for (let j = i + 1; j < window.particles.length; j++) { // Оптимизация цикла
            let other = window.particles[j];
            let dx = p.x - other.x;
            let dy = p.y - other.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 50 && p.featureWeight > 0.2 && other.featureWeight > 0.2) {
                let wave = Math.sin(distance * 0.08 + state.interferencePhase + window.frame * 0.03);
                interference += wave * 0.1;
                if (Math.random() < 0.002 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    sketch.stroke(0, 255, 255, 50); // Циан для интерференции
                    sketch.line(p.x, p.y, other.x, other.y);
                    potentialMessages.push({ type: 'interference', params: {} });
                    window.playInterference(440, 445, 1.0, 0.2);
                }
            }
        }
        p.offsetX += interference * 6;
        p.offsetY += interference * 6;

        // Туннелирование
        if (Math.random() < 0.003 && !p.collapsed && window.evolutionStage !== 'order') {
            let oldX = p.x, oldY = p.y;
            p.x = Math.random() * 400;
            p.y = Math.random() * 400;
            state.tunnelFlash = 30;
            sketch.stroke(255, 0, 255, 100); // Фиолетовый для туннелирования
            sketch.line(oldX, oldY, p.x, p.y);
            sketch.noFill();
            sketch.stroke(255, 0, 255, 70);
            sketch.ellipse(p.x, p.y, state.tunnelFlash, state.tunnelFlash);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                potentialMessages.push({ type: 'tunneling', params: {} });
                window.playTunneling((p.x * p.y) % 440 + 220, 0.3, 0.4);
            }
        }

        // Запутанность
        if (p.entangledPartner !== null && window.particles[p.entangledPartner]) {
            let partner = window.particles[p.entangledPartner];
            let partnerState = window.quantumStates[p.entangledPartner];
            state.r = partnerState.r = (state.r + partnerState.r) / 2;
            state.g = partnerState.g = (state.g + partnerState.g) / 2;
            state.b = partnerState.b = (state.b + partnerState.b) / 2;
            if (p.collapsed && !partner.collapsed && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                partnerState.a = 255;
                partner.size = 5;
                partner.collapsed = true;
                partner.shape = p.shape;
                state.entanglementFlash = 20;
                sketch.stroke(255, 255, 0, 80); // Жёлтый для запутанности
                sketch.line(p.x, p.y, partner.x, partner.y);
                potentialMessages.push({ type: 'entanglement', params: {} });
                window.playNote(261.63, 'sine', 0.5, 0.3);
            }
            if (state.entanglementFlash > 0) {
                sketch.stroke(255, 255, 0, state.entanglementFlash * 10);
                sketch.line(p.x, p.y, partner.x, partner.y);
                state.entanglementFlash--;
            }
        }

        // Границы
        let margin = 15;
        if (p.x < margin) p.offsetX += (margin - p.x) * 0.1;
        if (p.x > 400 - margin) p.offsetX -= (p.x - (400 - margin)) * 0.1;
        if (p.y < margin) p.offsetY += (margin - p.y) * 0.1;
        if (p.y > 400 - margin) p.offsetY -= (p.y - (400 - margin)) * 0.1;

        // Обновление позиции
        p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
        p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));

        // Отрисовка
        if (p.size > 0) {
            sketch.fill(state.r, state.g, state.b, state.a / 4);
            sketch.ellipse(p.x, p.y, p.size + 8 * window.pulseFactor, p.size + 8 * window.pulseFactor);
            drawShape(sketch, p.x, p.y, p.size, p.shape, p.phase, state.r, state.g, state.b, state.a, p.featureWeight);
            if (state.tunnelFlash > 0) {
                sketch.fill(255, 0, 255, state.tunnelFlash * 5);
                sketch.ellipse(p.x, p.y, p.size + 6, p.size + 6);
                state.tunnelFlash--;
            }
        }
    }

    // Выбор сообщения
    if (potentialMessages.length > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        let selectedMessage = potentialMessages.find(msg => msg.type === 'tunneling') ||
                             potentialMessages.find(msg => msg.type === 'interference') ||
                             potentialMessages.find(msg => msg.type === 'entanglement') ||
                             potentialMessages[Math.floor(Math.random() * potentialMessages.length)];
        window.terminalMessages.push(getRandomMessage(selectedMessage.type, selectedMessage.params));
        window.updateTerminalLog();
        window.globalMessageCooldown = 180;
    }

    drawMouseWave(sketch);
    window.frame++;
};

// Реакция на движение мыши
window.observeParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 180;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) return;
    window.mouseWave.x = mouseX;
    window.mouseWave.y = mouseY;
    window.mouseWave.radius = window.mouseInfluenceRadius * window.mouseWave.zoom;
    if (window.globalMessageCooldown <= 0) {
        window.terminalMessages.push(getRandomMessage('mouseInfluence'));
        window.updateTerminalLog();
        window.globalMessageCooldown = 180;
    }
};

// Реакция на клик
window.clickParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 180;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) return;
    let messageAddedThisFrame = false;
    window.particles.forEach((p, i) => {
        let dx = mouseX - p.x;
        let dy = mouseY - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let state = window.quantumStates[i];
        if (distance < window.mouseInfluenceRadius * window.mouseWave.zoom && distance > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
            if (!p.collapsed) {
                p.collapsed = true;
                state.a = 255;
                p.size = 5;
                p.shape = ['spiral', 'wave', 'fractal', 'ellipse'][Math.floor(Math.random() * 4)];
                sketch.fill(255, 255, 0, 200); // Жёлтый акцент
                sketch.ellipse(p.x, p.y, 15, 15);
                window.terminalMessages.push(getRandomMessage('collapseParticle', { shape: p.shape }));
                window.updateTerminalLog();
                window.playArpeggio(p.shape);
                window.globalMessageCooldown = 180;
                messageAddedThisFrame = true;
            } else {
                p.collapsed = false;
                p.phase = Math.random() * 2 * Math.PI;
                state.a = 255;
                p.size = 3 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * 3);
                window.terminalMessages.push(getRandomMessage('superpositionRestore'));
                window.updateTerminalLog();
                window.playNote(261.63, 'sine', 0.5, 0.3);
                window.globalMessageCooldown = 180;
                messageAddedThisFrame = true;
            }
        }
    });
};
