console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;

// Варианты сообщений в научном стиле
const messages = {
    initialize: [
        "Инициализация квантовой системы портрета. Частицы установлены в состояние суперпозиции.",
        "Формирование квантовой системы портрета. Частицы подготовлены для наблюдения.",
        "Квантовая декомпозиция портрета начата. Частицы находятся в суперпозиции."
    ],
    initializeSuccess: [
        "Квантовая система портрета инициализирована: ${validParticles} частиц в суперпозиции.",
        "Успешная инициализация: ${validParticles} квантовых частиц готовы для наблюдения.",
        "Портрет декомпозирован на ${validParticles} квантовых состояний. Наблюдение начато."
    ],
    initializeError: [
        "Ошибка инициализации: квантовая система портрета не сформирована.",
        "Не удалось инициализировать квантовую систему. Требуется загрузка изображения.",
        "Ошибка: данные изображения недоступны для квантовой декомпозиции."
    ],
    update: [
        "Квантовая система портрета обновляется. Волновые функции частиц эволюционируют.",
        "Частицы портрета взаимодействуют в квантовом поле под воздействием наблюдения.",
        "Эволюция квантовой системы портрета. Частицы изменяют состояния."
    ],
    decomposition: [
        "${scatteredParticles} частиц портрета распалось в квантовое поле.",
        "Квантовая декогеренция: ${scatteredParticles} частиц потеряли когерентность.",
        "Декомпозиция портрета: ${scatteredParticles} фрагментов в квантовом состоянии."
    ],
    stabilized: [
        "Квантовая система портрета стабилизирована. Волновые функции фиксированы.",
        "Стабилизация квантовой системы завершена. Портрет сформирован.",
        "Наблюдение зафиксировало квантовые состояния. Портрет стабилизирован."
    ],
    scatter: [
        "Частицы портрета рассеиваются в квантовом поле, увеличивая неопределённость.",
        "Квантовая система портрета демонстрирует рост энтропии. Частицы рассеяны.",
        "Рассеяние частиц портрета в суперпозиции. Неопределённость возрастает."
    ],
    superposition: [
        "Частица портрета находится в суперпозиции с формой ${shape}.",
        "Квантовая суперпозиция: частица принимает состояние ${shape}.",
        "Частица портрета в суперпозиции. Форма изменена на ${shape}."
    ],
    mouseInfluence: [
        "Наблюдение вызывает возмущение волновой функции, влияя на частицы портрета.",
        "Волновой пакет наблюдателя изменяет траектории частиц портрета.",
        "Квантовое воздействие наблюдения модифицирует состояния частиц портрета."
    ],
    featureAttraction: [
        "Частицы портрета притягиваются к ключевым координатам лица.",
        "Квантовая система портрета формирует структуру лица через притяжение частиц.",
        "Частицы портрета локализуются у ключевых точек изображения."
    ],
    interference: [
        "Квантовая интерференция волновых функций частиц формирует структуру портрета.",
        "Интерференция волн частиц приводит к изменению квантовой системы портрета.",
        "Квантовая интерференция: частицы портрета создают когерентные узоры."
    ],
    tunneling: [
        "Частица портрета осуществила квантовое туннелирование через потенциальный барьер.",
        "Квантовая система: частица портрета переместилась в новое состояние туннелированием.",
        "Частица портрета демонстрирует квантовое туннелирование через барьер."
    ],
    entanglement: [
        "Запутанные частицы портрета демонстрируют квантовую корреляцию.",
        "Квантовая запутанность: частицы портрета синхронизированы через нелокальность.",
        "Запутанность частиц портрета вызывает когерентное изменение состояний."
    ],
    collapse: [
        "Наблюдение вызвало коллапс волновой функции частицы портрета в состояние ${shape}.",
        "Квантовая система портрета: частица коллапсировала в форму ${shape}.",
        "Коллапс волновой функции: частица портрета фиксирована в состоянии ${shape}."
    ],
    superpositionRestore: [
        "Частица портрета восстановлена в состояние суперпозиции.",
        "Квантовая неопределённость частицы портрета восстановлена.",
        "Частица портрета возвращена в суперпозицию для дальнейшего наблюдения."
    ],
    error: [
        "Ошибка в квантовой системе: частица ${index} не обновлена.",
        "Квантовая ошибка: частица ${index} не изменила состояние.",
        "Аномалия в квантовой системе портрета: частица ${index} не обработана."
    ]
};

// Функция для выбора случайного сообщения
function getRandomMessage(type, params = {}) {
    let msgArray = messages[type];
    let msg = msgArray[Math.floor(Math.random() * msgArray.length)];
    for (let key in params) {
        msg = msg.replace(`\${${key}}`, params[key]);
    }
    return `[${new Date().toLocaleTimeString()}] ${msg}`;
}

// Обновление терминального лога
window.updateTerminalLog = function() {
    const maxMessages = 10;
    while (window.terminalMessages.length > maxMessages) {
        window.terminalMessages.shift();
    }
    const terminalDiv = document.getElementById(`terminal-log-step-${window.currentStep}`);
    if (terminalDiv) {
        terminalDiv.innerHTML = window.terminalMessages.map(msg => 
            `<div class="${msg.includes('туннелирование') ? 'tunneling' : msg.includes('интерфери') ? 'interference' : ''}">${msg}</div>`
        ).join('');
    }
};

// Инициализация частиц из портрета
window.initializeParticles = function(img) {
    console.log('initializeParticles called, img defined: ' + !!img + ', dimensions: ' + (img ? img.width + 'x' + img.height : 'undefined'));
    window.terminalMessages.push(getRandomMessage('initialize'));
    window.updateTerminalLog();
    if (typeof window.playInitialization === 'function') {
        window.playInitialization();
    }
    if (!img || !img.pixels) {
        console.error('Error: window.img is not defined or pixels not loaded');
        window.terminalMessages.push(getRandomMessage('initializeError'));
        window.updateTerminalLog();
        return;
    }
    window.particles = [];
    window.quantumStates = [];
    window.decompositionTimer = 0;
    window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
    window.globalMessageCooldown = 0;
    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty or not loaded');
            window.terminalMessages.push(getRandomMessage('initializeError'));
            window.updateTerminalLog();
            return;
        }
        var gridSize = 50; // Сетка 50x50 = 2500 частиц
        var cellWidth = img.width / gridSize;
        var cellHeight = img.height / gridSize;
        var validParticles = 0;

        for (var i = 0; i < gridSize; i++) {
            for (var j = 0; j < gridSize; j++) {
                var x = (i + 0.5) * cellWidth;
                var y = (j + 0.5) * cellHeight;
                var index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
                var r = img.pixels[index] || 255;
                var g = img.pixels[index + 1] || 255;
                var b = img.pixels[index + 2] || 255;
                var a = img.pixels[index + 3] || 255;
                var brightness = (r + g + b) / 3;

                window.particles.push({
                    x: x * 400 / img.width,
                    y: y * 400 / img.height,
                    baseX: x * 400 / img.width,
                    baseY: y * 400 / img.height,
                    offsetX: 0,
                    offsetY: 0,
                    size: 8, // Размер частицы ~8 пикселей
                    phase: Math.random() * 2 * Math.PI,
                    frequency: 0.02,
                    entangledPartner: Math.random() < 0.3 ? Math.floor(Math.random() * gridSize * gridSize) : null,
                    collapsed: false,
                    hideTime: Math.random() * 3, // Случайное время распада (0–3 сек)
                    shape: ['square', 'circle'][Math.floor(Math.random() * 2)], // Простые формы для шага 4
                    featureWeight: brightness / 255 // Используем яркость вместо ключевых точек
                });

                window.quantumStates.push({
                    r: r,
                    g: g,
                    b: b,
                    a: 255,
                    probability: 1.0,
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
        if (typeof window.playInitialization === 'function') {
            window.playInitialization();
        }
        if (validParticles === 0) {
            console.error('No valid particles created. Check image dimensions or pixel data.');
            window.terminalMessages.push(getRandomMessage('initializeError'));
            window.updateTerminalLog();
        }
    } catch (error) {
        console.error('Error in initializeParticles: ' + error);
        window.terminalMessages.push(getRandomMessage('initializeError'));
        window.updateTerminalLog();
    }
};

// Отрисовка форм
function drawShape(sketch, x, y, size, shape, rotation, r, g, b, a, featureWeight) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    // Создаём градиент для "объёмности"
    let gradient = sketch.drawingContext.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a / 255})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    sketch.drawingContext.fillStyle = gradient;
    // Добавляем тень для глубины
    sketch.drawingContext.shadowBlur = 10 * (1 + featureWeight);
    sketch.drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
    if (shape === 'square') {
        sketch.square(-size / 2, -size / 2, size);
    } else if (shape === 'circle') {
        sketch.ellipse(0, 0, size, size);
    } else if (shape === 'ribbon') {
        sketch.beginShape();
        sketch.vertex(-size * 1.2, size * 0.3);
        sketch.quadraticVertex(0, size * 0.4, size * 1.2, size * 0.3);
        sketch.quadraticVertex(0, -size * 0.4, -size * 1.2, -size * 0.3);
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'ellipse') {
        sketch.ellipse(0, 0, size * 1.5, size * 0.5);
    } else if (shape === 'cluster') {
        for (let i = 0; i < 5; i++) {
            let dx = (Math.random() - 0.5) * size * 0.5;
            let dy = (Math.random() - 0.5) * size * 0.5;
            sketch.ellipse(dx, dy, size * 0.3, size * 0.3);
        }
    }
    sketch.drawingContext.shadowBlur = 0; // Сбрасываем тень
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
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 180;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('updateParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    console.log('updateParticles called, particles: ' + window.particles.length + ', currentStep: ' + window.currentStep);
    let messageAddedThisFrame = false;
    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('update'));
        window.updateTerminalLog();
        window.globalMessageCooldown = 180;
        messageAddedThisFrame = true;
    }
    window.globalMessageCooldown--;
    window.frame = window.frame || 0;
    window.frame++;

    // Тёмный градиентный фон
    let gradient = sketch.drawingContext.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, 'rgba(20, 20, 30, 0.9)');
    gradient.addColorStop(1, 'rgba(10, 10, 20, 0.9)');
    sketch.drawingContext.fillStyle = gradient;
    sketch.rect(0, 0, 400, 400);

    // Счётчик распавшихся частиц
    let scatteredParticles = 0;

    // Квантовая декомпозиция на шаге 4
    if (window.currentStep === 4) {
        window.decompositionTimer += 0.015; // ~3 секунды для полного распада
    }

    // Обновление волнового пакета мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 1);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 10) window.mouseWave.trail.shift();
    }

    let potentialMessages = [];

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];

            // Суперпозиция: лёгкое дрожание
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.015);
            if (!p.collapsed) {
                p.phase += p.frequency;
                p.offsetX = Math.cos(p.phase) * 4 * n * window.chaosFactor;
                p.offsetY = Math.sin(p.phase) * 4 * n * window.chaosFactor;
                p.size = 8 * (1 + 0.3 * Math.sin(window.frame * 0.1)) * (1 + p.featureWeight * 0.5);
                if (Math.random() < 0.01 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    p.shape = ['square', 'circle', 'ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 5)];
                    potentialMessages.push({ type: 'superposition', params: { shape: p.shape } });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const notes = ['C4', 'D#4', 'F4', 'G4', 'A#4'];
                        const note = notes[Math.floor(Math.random() * notes.length)];
                        const freq = window.noteFrequencies[note] || 261.63;
                        window.playNote(freq, 'sine', 0.5, 0.2);
                    }
                }
            } else {
                p.offsetX *= 0.9;
                p.offsetY *= 0.9;
                p.size = 10; // Фиксированный размер при коллапсе
            }

            // Квантовая декомпозиция на шаге 4
            if (window.currentStep === 4 && window.decompositionTimer < 3) {
                if (window.decompositionTimer >= p.hideTime) {
                    // "Взрывной" разлёт
                    var dx = p.x - 200;
                    var dy = p.y - 200;
                    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    var angle = Math.random() * 2 * Math.PI;
                    var wave = Math.sin(dist * 0.06 + window.decompositionTimer * 3) * 15;
                    p.offsetX += Math.cos(angle) * wave * p.featureWeight;
                    p.offsetY += Math.sin(angle) * wave * p.featureWeight;
                    state.a = Math.max(0, 255 * (1 - (window.decompositionTimer - p.hideTime) / (3 - p.hideTime)));
                    p.size = Math.max(0, 8 * (1 - (window.decompositionTimer - p.hideTime) / (3 - p.hideTime)));
                    scatteredParticles++;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'scatter', params: {} });
                    }
                }
            } else if (window.currentStep === 5) {
                // На шаге 5 частицы свободны
                var angle = Math.random() * 2 * Math.PI;
                var wave = Math.sin(window.frame * 0.05 + p.phase) * 10;
                p.offsetX += Math.cos(angle) * wave * window.chaosFactor;
                p.offsetY += Math.sin(angle) * wave * window.chaosFactor;
                state.a = 255;
                p.size = 8 * (1 + 0.3 * Math.sin(window.frame * 0.1));
                scatteredParticles++;
            }

            // Влияние мыши
            if (window.currentStep === 4 || window.currentStep === 5) {
                var dx = p.x - window.mouseWave.x;
                var dy = p.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed) {
                    var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                    p.offsetX += dx * influence * 0.2;
                    p.offsetY += dy * influence * 0.2;
                    p.size = 10 * (1 + influence); // Увеличение при наблюдении
                    state.a = 255;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'mouseInfluence', params: {} });
                    }
                }
            }

            // Интерференция
            window.particles.forEach(function(other, j) {
                if (i !== j) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 80 && p.featureWeight > 0.2 && other.featureWeight > 0.2) {
                        var wave = Math.sin(distance * 0.07 + state.interferencePhase + window.frame * 0.04);
                        if (Math.random() < 0.005 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            sketch.stroke(state.r, state.g, state.b, 50 * Math.abs(wave));
                            sketch.line(p.x, p.y, other.x, other.y);
                            potentialMessages.push({ type: 'interference', params: {} });
                            if (typeof window.playInterference === 'function') {
                                window.playInterference(440, 445, 1.0, 0.15);
                            }
                        }
                    }
                }
            });

            // Отталкивание от краёв
            var margin = 20;
            if (p.x < margin) p.offsetX += (margin - p.x) * 0.1;
            if (p.x > 400 - margin) p.offsetX -= (p.x - (400 - margin)) * 0.1;
            if (p.y < margin) p.offsetY += (margin - p.y) * 0.1;
            if (p.y > 400 - margin) p.offsetY -= (p.y - (400 - margin)) * 0.1;

            // Квантовое туннелирование
            if (Math.random() < 0.005 && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 40;
                sketch.stroke(state.r, state.g, state.b, 80);
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(state.r, state.g, state.b, 50);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.5, state.tunnelFlash * 0.5);
                console.log('Particle ' + i + ' tunneled from x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'tunneling', params: {} });
                    if (typeof window.playTunneling === 'function') {
                        const freq = (p.x * p.y) % 440 + 220;
                        window.playTunneling(freq, 0.2, 0.3);
                    }
                }
            }

            // Запутанность
            if (p.entangledPartner !== null && window.particles[p.entangledPartner] && !p.collapsed) {
                var partner = window.particles[p.entangledPartner];
                var partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                p.shape = partner.shape;
                if (Math.random() < 0.005 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    state.entanglementFlash = 20;
                    sketch.stroke(state.r, state.g, state.b, 50);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    potentialMessages.push({ type: 'entanglement', params: {} });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['C4'] || 261.63;
                        window.playNote(freq, 'sine', 0.5, 0.2);
                    }
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(state.r, state.g, state.b, state.entanglementFlash * 5);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                }
            }

            // Обновление позиции
            p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));

            // Отрисовка частицы
            if (p.size > 0) {
                drawShape(sketch, p.x, p.y, p.size, p.shape, Math.sin(window.frame * 0.05) * 0.2, state.r, state.g, state.b, state.a, p.featureWeight);
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
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                potentialMessages.push({ type: 'error', params: { index: i } });
            }
        }
    });

    // Сообщение о декомпозиции
    if (window.currentStep === 4 && window.decompositionTimer < 3 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('decomposition', { scatteredParticles }));
        window.updateTerminalLog();
        window.globalMessageCooldown = 180;
        messageAddedThisFrame = true;
    }

    // Сообщение о стабилизации на шаге 5
    if (window.currentStep === 5 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('stabilized'));
        window.updateTerminalLog();
        if (typeof window.playStabilization === 'function') {
            window.playStabilization();
        }
        window.globalMessageCooldown = 180;
        messageAddedThisFrame = true;
    }

    // Выбор сообщения с приоритетом
    if (potentialMessages.length > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        let selectedMessage = potentialMessages.find(msg => msg.type === 'tunneling') ||
                             potentialMessages.find(msg => msg.type === 'interference') ||
                             potentialMessages.find(msg => msg.type === 'entanglement') ||
                             potentialMessages[Math.floor(Math.random() * potentialMessages.length)];
        window.terminalMessages.push(getRandomMessage(selectedMessage.type, selectedMessage.params));
        window.updateTerminalLog();
        window.globalMessageCooldown = 180;
        messageAddedThisFrame = true;
    }

    // Отрисовка мыши
    drawMouseWave(sketch);
};

// Реакция частиц на движение мыши
window.observeParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('observeParticles: No particles or quantum states available');
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 180;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('observeParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    console.log('observeParticles called, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    if (window.globalMessageCooldown <= 0) {
        window.terminalMessages.push(getRandomMessage('mouseInfluence'));
        window.updateTerminalLog();
        window.globalMessageCooldown = 180;
    }
    window.mouseWave.x = mouseX;
    window.mouseWave.y = mouseY;
    window.mouseWave.radius = window.mouseInfluenceRadius;
};

// Реакция частиц на клик
window.clickParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('clickParticles: No particles or quantum states available');
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 180;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('clickParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    console.log('clickParticles called, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    let messageAddedThisFrame = false;
    window.particles.forEach(function(p, i) {
        try {
            var dx = mouseX - p.x;
            var dy = mouseY - p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[i];

            if (distance < window.mouseInfluenceRadius && distance > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                if (!p.collapsed) {
                    p.collapsed = true;
                    state.a = 255;
                    p.size = 10;
                    p.shape = ['square', 'circle', 'ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 5)];
                    sketch.fill(state.r, state.g, state.b, 180);
                    sketch.ellipse(p.x, p.y, 12, 12);
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape }));
                    window.updateTerminalLog();
                    if (typeof window.playArpeggio === 'function') {
                        window.playArpeggio(p.shape);
                    }
                    window.globalMessageCooldown = 180;
                    messageAddedThisFrame = true;
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    state.a = 255;
                    p.size = 8 * (1 + 0.3 * Math.sin(window.frame * 0.1));
                    console.log('Particle ' + i + ' restored to superposition, shape: ' + p.shape + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('superpositionRestore'));
                    window.updateTerminalLog();
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['C4'] || 261.63;
                        window.playNote(freq, 'sine', 0.5, 0.2);
                    }
                    window.globalMessageCooldown = 180;
                    messageAddedThisFrame = true;
                }
            }
        } catch (error) {
            console.error('Error clicking particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 180;
                messageAddedThisFrame = true;
            }
        }
    });
};
