console.log('particles.js loaded');

window.particles = [];
window.blocks = []; // Массив для блоков
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;

// Варианты сообщений в научном стиле
const messages = {
    initialize: [
        "Инициализация квантовой декомпозиции портрета. Формирование блоков и частиц.",
        "Квантовая система портрета активирована. Подготовка к разрыву на фрагменты.",
        "Начало квантового разрыва портрета. Блоки и частицы в суперпозиции."
    ],
    initializeSuccess: [
        "Квантовая система инициализирована: ${validParticles} частиц, ${validBlocks} блоков.",
        "Успешная инициализация: ${validParticles} частиц и ${validBlocks} блоков готовы.",
        "Портрет разорван на ${validParticles} частиц и ${validBlocks} блоков."
    ],
    initializeError: [
        "Ошибка инициализации: данные изображения недоступны.",
        "Квантовая система не сформирована. Требуется загрузка портрета.",
        "Аномалия: портрет не декомпозирован на квантовые фрагменты."
    ],
    update: [
        "Эволюция квантовой системы. Блоки и частицы взаимодействуют.",
        "Квантовая система портрета обновляется. Фрагменты в движении.",
        "Частицы и блоки портрета изменяют квантовые состояния."
    ],
    decomposition: [
        "Квантовый разрыв портрета: фрагментация на ${blockCount} блоков, прозрачность ${imgAlpha}/255.",
        "Декомпозиция портрета: блоки и частицы в состоянии ${imgAlpha}/255.",
        "Разрыв портрета в квантовом поле: прозрачность ${imgAlpha}/255."
    ],
    stabilized: [
        "Квантовая система стабилизирована. Фрагменты зафиксированы.",
        "Стабилизация блоков и частиц завершена. Портрет сформирован.",
        "Квантовые фрагменты портрета стабилизированы."
    ],
    scatter: [
        "Фрагменты портрета рассеиваются в квантовом поле.",
        "Квантовая энтропия возрастает. Блоки и частицы разлетаются.",
        "Частицы и блоки портрета увеличивают квантовую неопределённость."
    ],
    superposition: [
        "Фрагмент в суперпозиции: форма ${shape}.",
        "Квантовая суперпозиция фрагмента: состояние ${shape}.",
        "Фрагмент портрета перешёл в суперпозицию: ${shape}."
    ],
    mouseInfluence: [
        "Наблюдение вызывает квантовое возмущение фрагментов портрета.",
        "Волновой пакет наблюдателя влияет на блоки и частицы.",
        "Квантовая интерференция от наблюдения изменяет фрагменты."
    ],
    featureAttraction: [
        "Фрагменты притягиваются к ключевым точкам лица.",
        "Квантовая локализация: блоки и частицы формируют лицо.",
        "Частицы и блоки притягиваются к координатам портрета."
    ],
    interference: [
        "Квантовая интерференция фрагментов формирует структуру портрета.",
        "Волновая интерференция блоков и частиц создаёт узоры.",
        "Интерференция квантовых фрагментов изменяет портрет."
    ],
    tunneling: [
        "Фрагмент портрета туннелировал через квантовый барьер.",
        "Квантовое туннелирование: фрагмент переместился в новое состояние.",
        "Блок/частица портрета осуществила квантовое туннелирование."
    ],
    entanglement: [
        "Запутанные фрагменты портрета демонстрируют квантовую корреляцию.",
        "Квантовая запутанность синхронизирует блоки и частицы.",
        "Фрагменты портрета связаны квантовой запутанностью."
    ],
    collapse: [
        "Коллапс волновой функции фрагмента: форма ${shape}.",
        "Наблюдение зафиксировало фрагмент в состоянии ${shape}.",
        "Квантовая система: фрагмент коллапсировал в ${shape}."
    ],
    superpositionRestore: [
        "Фрагмент восстановлен в квантовую суперпозицию.",
        "Квантовая неопределённость фрагмента восстановлена.",
        "Фрагмент портрета вернулся в суперпозицию."
    ],
    error: [
        "Ошибка в квантовой системе: фрагмент ${index} не обновлён.",
        "Аномалия: фрагмент ${index} не изменил состояние.",
        "Квантовая ошибка: фрагмент ${index} не обработан."
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

// Инициализация частиц и блоков из портрета
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
    window.blocks = [];
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
        var numParticles = 150; // Меньше частиц для баланса с блоками
        var numBlocks = 50; // Количество блоков
        var validParticles = 0;
        var validBlocks = 0;

        // Ключевые точки лица
        var faceFeatures = [
            { x: img.width * 0.35, y: img.height * 0.3, weight: 0.4 }, // Левый глаз
            { x: img.width * 0.65, y: img.height * 0.3, weight: 0.4 }, // Правый глаз
            { x: img.width * 0.5, y: img.height * 0.5, weight: 0.3 }, // Нос
            { x: img.width * 0.5, y: img.height * 0.7, weight: 0.3 }  // Рот
        ];

        // Инициализация частиц
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
                var r = img.pixels[index] || 209; // #d1d1e6
                var g = img.pixels[index + 1] || 209;
                var b = img.pixels[index + 2] || 230;
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
                    entangledPartner: Math.random() < 0.2 ? Math.floor(Math.random() * (numParticles + numBlocks)) : null,
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

        // Инициализация блоков
        for (var i = 0; i < numBlocks; i++) {
            var x = Math.random() * img.width;
            var y = Math.random() * img.height;
            if (x >= 0 && x < img.width && y >= 0 && y < img.height) {
                var index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
                var r = img.pixels[index] || 30; // #1e1b4b
                var g = img.pixels[index + 1] || 27;
                var b = img.pixels[index + 2] || 75;
                var a = img.pixels[index + 3] || 255;

                window.blocks.push({
                    x: x * 400 / img.width,
                    y: y * 400 / img.height,
                    baseX: x * 400 / img.width,
                    baseY: y * 400 / img.height,
                    offsetX: 0,
                    offsetY: 0,
                    width: 10 + Math.random() * 20,
                    height: 10 + Math.random() * 20,
                    phase: Math.random() * 2 * Math.PI,
                    frequency: 0.005,
                    entangledPartner: Math.random() < 0.2 ? Math.floor(Math.random() * (numParticles + numBlocks)) : null,
                    collapsed: false,
                    decompositionProgress: 0,
                    vertices: [
                        { x: -5 - Math.random() * 5, y: -5 - Math.random() * 5 },
                        { x: 5 + Math.random() * 5, y: -5 - Math.random() * 5 },
                        { x: 5 + Math.random() * 5, y: 5 + Math.random() * 5 },
                        { x: -5 - Math.random() * 5, y: 5 + Math.random() * 5 }
                    ]
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
                validBlocks++;
            }
        }

        console.log('Initialized ' + window.particles.length + ' particles, ' + window.blocks.length + ' blocks, valid: ' + validParticles + ' particles, ' + validBlocks + ' blocks');
        window.terminalMessages.push(getRandomMessage('initializeSuccess', { validParticles, validBlocks }));
        window.updateTerminalLog();
        if (typeof window.playInitialization === 'function') {
            window.playInitialization();
        }
        if (validParticles + validBlocks === 0) {
            console.error('No valid particles or blocks created.');
            window.terminalMessages.push(getRandomMessage('initializeError'));
            window.updateTerminalLog();
        }
    } catch (error) {
        console.error('Error in initializeParticles: ' + error);
        window.terminalMessages.push(getRandomMessage('initializeError'));
        window.updateTerminalLog();
    }
};

// Отрисовка форм частиц
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

// Отрисовка блоков
function drawBlock(sketch, block, r, g, b, a) {
    sketch.push();
    sketch.translate(block.x, block.y);
    sketch.fill(r, g, b, a);
    sketch.beginShape();
    block.vertices.forEach(v => {
        sketch.vertex(v.x, v.y);
    });
    sketch.endShape(sketch.CLOSE);
    sketch.pop();
}

// Отрисовка мыши
function drawMouseWave(sketch) {
    if (window.currentStep !== 4 && window.currentStep !== 5 || window.mouseWave.radius <= 0) return;
    sketch.noFill();
    let gradient = sketch.drawingContext.createRadialGradient(
        window.mouseWave.x, window.mouseWave.y, 0,
        window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius
    );
    gradient.addColorStop(0, 'rgba(209, 209, 230, 0.3)'); // #d1d1e6
    gradient.addColorStop(1, 'rgba(209, 209, 230, 0)');
    sketch.drawingContext.strokeStyle = gradient;
    sketch.strokeWeight(2);
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2);
    
    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 100 * (1 - i / window.mouseWave.trail.length);
        sketch.stroke(209, 209, 230, alpha);
        sketch.ellipse(point.x, point.y, window.mouseWave.radius * 0.5);
    });
}

// Обновление частиц и блоков
window.updateParticles = function(sketch) {
    if (!window.quantumSketch || (!window.particles && !window.blocks) || (window.particles.length === 0 && window.blocks.length === 0)) {
        console.error('Cannot update particles/blocks: quantumSketch: ' + !!window.quantumSketch + ', particlesLength: ' + (window.particles ? window.particles.length : 0) + ', blocksLength: ' + (window.blocks ? window.blocks.length : 0));
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 300;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('updateParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    console.log('updateParticles called, particles: ' + window.particles.length + ', blocks: ' + window.blocks.length + ', currentStep: ' + window.currentStep);
    let messageAddedThisFrame = false;
    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('update'));
        window.updateTerminalLog();
        window.globalMessageCooldown = 300;
        messageAddedThisFrame = true;
    }
    window.globalMessageCooldown--;
    window.frame = window.frame || 0;
    window.frame++;

    // Тёмный фон
    sketch.drawingContext.fillStyle = '#010004';
    sketch.rect(0, 0, 400, 400);

    // Квантовая декомпозиция на шаге 4
    if (window.currentStep === 4 && window.decompositionTimer < 4) {
        window.decompositionTimer += 0.015;
        if (window.img) {
            var imgAlpha = Math.max(0, 255 * (1 - window.decompositionTimer / 4));
            sketch.tint(255, imgAlpha);
            sketch.image(window.img, 0, 0, 400, 400);
            console.log('Decomposition: Image alpha ' + imgAlpha.toFixed(0));
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('decomposition', { imgAlpha: imgAlpha.toFixed(0), blockCount: window.blocks.length }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
        }
    } else if (window.currentStep === 5) {
        if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
            window.terminalMessages.push(getRandomMessage('stabilized'));
            window.updateTerminalLog();
            if (typeof window.playStabilization === 'function') {
                window.playStabilization();
            }
            window.globalMessageCooldown = 300;
            messageAddedThisFrame = true;
        }
    }

    // Обновление мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 1);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 10) window.mouseWave.trail.shift();
    }

    let potentialMessages = [];

    // Обновление частиц
    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];

            // Квантовая декомпозиция с "взрывным" эффектом
            if (window.currentStep === 4 && window.decompositionTimer < 4) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.015);
                state.a = Math.floor(p.decompositionProgress * 255);
                var dx = p.x - 200;
                var dy = p.y - 200;
                var dist = Math.sqrt(dx * dx + dy * dy) + 1;
                var wave = Math.sin(dist * 0.04 + window.decompositionTimer * 2);
                p.offsetX += wave * 8 * p.featureWeight * (dx / dist);
                p.offsetY += wave * 8 * p.featureWeight * (dy / dist);
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'scatter', params: {} });
                }
            } else {
                state.a = 255;
            }

            // Суперпозиция
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.015);
            if (!p.collapsed) {
                p.phase += p.frequency * p.featureWeight;
                p.offsetX = Math.cos(p.phase) * 4 * n * window.chaosFactor;
                p.offsetY = Math.sin(p.phase) * 4 * n * window.chaosFactor;
                p.size = (3 + 2 * n * state.probability) * (1 + p.featureWeight * 0.5);
                if (Math.random() < 0.015 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
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
            }

            // Влияние мыши
            if (window.currentStep === 4 || window.currentStep === 5) {
                var dx = p.x - window.mouseWave.x;
                var dy = p.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                    p.offsetX += dx * influence * 0.1;
                    p.offsetY += dy * influence * 0.1;
                    potentialMessages.push({ type: 'mouseInfluence', params: {} });
                }
            }

            // Притяжение к ключевым точкам
            if (p.featureWeight > 0.1 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                p.offsetX += (p.baseX - p.x) * 0.06 * p.featureWeight;
                p.offsetY += (p.baseY - p.y) * 0.06 * p.featureWeight;
                potentialMessages.push({ type: 'featureAttraction', params: {} });
            }

            // Цвета
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
                        if (Math.random() < 0.001 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            sketch.stroke(204, 51, 51, 25); // #cc3333
                            sketch.line(p.x, p.y, other.x, other.y);
                            potentialMessages.push({ type: 'interference', params: {} });
                            if (typeof window.playInterference === 'function') {
                                window.playInterference(440, 445, 1.0, 0.15);
                            }
                        }
                    }
                }
            });
            p.offsetX += interference * 5;
            p.offsetY += interference * 5;

            // Туннелирование
            if (Math.random() < 0.002 && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 25;
                sketch.stroke(204, 51, 51, 80); // #cc3333
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(204, 51, 51, 50);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.5, state.tunnelFlash * 0.5);
                console.log('Particle ' + i + ' tunneled');
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'tunneling', params: {} });
                    if (typeof window.playTunneling === 'function') {
                        const freq = (p.x * p.y) % 440 + 220;
                        window.playTunneling(freq, 0.2, 0.3);
                    }
                }
            } else {
                sketch.noStroke();
            }

            // Запутанность
            if (p.entangledPartner !== null && window.quantumStates[p.entangledPartner] && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                var partner = p.entangledPartner < window.particles.length ? window.particles[p.entangledPartner] : window.blocks[p.entangledPartner - window.particles.length];
                var partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                if (p.collapsed && !partner.collapsed) {
                    partnerState.a = 255;
                    partner.collapsed = true;
                    partner.shape = p.shape;
                    state.entanglementFlash = 15;
                    console.log('Non-locality: Fragment ' + p.entangledPartner + ' flashed');
                    potentialMessages.push({ type: 'entanglement', params: {} });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['C4'] || 261.63;
                        window.playNote(freq, 'sine', 0.5, 0.2);
                    }
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(63, 22, 127, state.entanglementFlash * 10); // #3f167f
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
                    sketch.fill(204, 51, 51, state.tunnelFlash * 5); // #cc3333
                    sketch.ellipse(p.x, p.y, p.size + 5, p.size + 5);
                    state.tunnelFlash--;
                }
            }

            if (i < 5) {
                console.log('Particle ' + i + ' at x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2) + ', size: ' + p.size.toFixed(2) + ', shape: ' + p.shape);
            }
        } catch (error) {
            console.error('Error updating particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                potentialMessages.push({ type: 'error', params: { index: i } });
            }
        }
    });

    // Обновление блоков
    window.blocks.forEach(function(b, i) {
        try {
            var state = window.quantumStates[window.particles.length + i];

            // Квантовая декомпозиция
            if (window.currentStep === 4 && window.decompositionTimer < 4) {
                b.decompositionProgress = Math.min(1, b.decompositionProgress + 0.015);
                state.a = Math.floor(b.decompositionProgress * 255);
                var dx = b.x - 200;
                var dy = b.y - 200;
                var dist = Math.sqrt(dx * dx + dy * dy) + 1;
                var wave = Math.sin(dist * 0.04 + window.decompositionTimer * 2);
                b.offsetX += wave * 10 * (dx / dist);
                b.offsetY += wave * 10 * (dy / dist);
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'scatter', params: {} });
                }
            } else {
                state.a = 255;
            }

            // Суперпозиция
            var n = sketch.noise(b.x * window.noiseScale, b.y * window.noiseScale, window.frame * 0.015);
            if (!b.collapsed) {
                b.phase += b.frequency;
                b.offsetX = Math.cos(b.phase) * 6 * n * window.chaosFactor;
                b.offsetY = Math.sin(b.phase) * 6 * n * window.chaosFactor;
                if (Math.random() < 0.015 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    b.vertices = b.vertices.map(v => ({
                        x: v.x + (Math.random() - 0.5) * 2,
                        y: v.y + (Math.random() - 0.5) * 2
                    }));
                    potentialMessages.push({ type: 'superposition', params: { shape: 'block' } });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const notes = ['C4', 'D#4', 'F4', 'G4', 'A#4'];
                        const note = notes[Math.floor(Math.random() * notes.length)];
                        const freq = window.noteFrequencies[note] || 261.63;
                        window.playNote(freq, 'sine', 0.5, 0.2);
                    }
                }
            } else {
                b.offsetX *= 0.9;
                b.offsetY *= 0.9;
            }

            // Влияние мыши
            if (window.currentStep === 4 || window.currentStep === 5) {
                var dx = b.x - window.mouseWave.x;
                var dy = b.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !b.collapsed && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                    b.offsetX += dx * influence * 0.1;
                    b.offsetY += dy * influence * 0.1;
                    potentialMessages.push({ type: 'mouseInfluence', params: {} });
                }
            }

            // Цвета
            if (!b.collapsed) {
                state.r = Math.min(255, Math.max(0, state.r + (n - 0.5) * 5));
                state.g = Math.min(255, Math.max(0, state.g + (n - 0.5) * 5));
                state.b = Math.min(255, Math.max(0, state.b + (n - 0.5) * 5));
            }

            // Интерференция
            var interference = 0;
            window.blocks.forEach(function(other, j) {
                if (i !== j) {
                    var dx = b.x - other.x;
                    var dy = b.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 60) {
                        var wave = Math.sin(distance * 0.07 + state.interferencePhase + window.frame * 0.025);
                        interference += wave * 0.08;
                        if (Math.random() < 0.001 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            sketch.stroke(204, 51, 51, 25); // #cc3333
                            sketch.line(b.x, b.y, other.x, other.y);
                            potentialMessages.push({ type: 'interference', params: {} });
                            if (typeof window.playInterference === 'function') {
                                window.playInterference(440, 445, 1.0, 0.15);
                            }
                        }
                    }
                }
            });
            b.offsetX += interference * 5;
            b.offsetY += interference * 5;

            // Туннелирование
            if (Math.random() < 0.002 && !b.collapsed) {
                var oldX = b.x, oldY = b.y;
                b.x = Math.random() * 400;
                b.y = Math.random() * 400;
                state.tunnelFlash = 25;
                sketch.stroke(204, 51, 51, 80); // #cc3333
                sketch.line(oldX, oldY, b.x, b.y);
                sketch.noFill();
                sketch.stroke(204, 51, 51, 50);
                sketch.ellipse(b.x, b.y, state.tunnelFlash * 0.5, state.tunnelFlash * 0.5);
                console.log('Block ' + i + ' tunneled');
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'tunneling', params: {} });
                    if (typeof window.playTunneling === 'function') {
                        const freq = (b.x * b.y) % 440 + 220;
                        window.playTunneling(freq, 0.2, 0.3);
                    }
                }
            } else {
                sketch.noStroke();
            }

            // Запутанность
            if (b.entangledPartner !== null && window.quantumStates[b.entangledPartner] && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                var partner = b.entangledPartner < window.particles.length ? window.particles[b.entangledPartner] : window.blocks[b.entangledPartner - window.particles.length];
                var partnerState = window.quantumStates[b.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                if (b.collapsed && !partner.collapsed) {
                    partnerState.a = 255;
                    partner.collapsed = true;
                    state.entanglementFlash = 15;
                    console.log('Non-locality: Fragment ' + b.entangledPartner + ' flashed');
                    potentialMessages.push({ type: 'entanglement', params: {} });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['C4'] || 261.63;
                        window.playNote(freq, 'sine', 0.5, 0.2);
                    }
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(63, 22, 127, state.entanglementFlash * 10); // #3f167f
                    sketch.line(b.x, b.y, partner.x, partner.y);
                    state.entanglementFlash--;
                }
            }

            // Обновление позиции
            b.x = Math.max(0, Math.min(400, b.baseX + b.offsetX));
            b.y = Math.max(0, Math.min(400, b.baseY + b.offsetY));

            // Отрисовка блока
            drawBlock(sketch, b, state.r, state.g, state.b, state.a);

            if (i < 5) {
                console.log('Block ' + i + ' at x: ' + b.x.toFixed(2) + ', y: ' + b.y.toFixed(2));
            }
        } catch (error) {
            console.error('Error updating block ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                potentialMessages.push({ type: 'error', params: { index: i + window.particles.length } });
            }
        }
    });

    // Выбор сообщения
    if (potentialMessages.length > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        let selectedMessage = potentialMessages.find(msg => msg.type === 'tunneling') ||
                             potentialMessages.find(msg => msg.type === 'interference') ||
                             potentialMessages.find(msg => msg.type === 'entanglement') ||
                             potentialMessages[Math.floor(Math.random() * potentialMessages.length)];
        window.terminalMessages.push(getRandomMessage(selectedMessage.type, selectedMessage.params));
        window.updateTerminalLog();
        window.globalMessageCooldown = 300;
        messageAddedThisFrame = true;
    }

    // Отрисовка мыши
    drawMouseWave(sketch);
};

// Реакция частиц и блоков на движение мыши
window.observeParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.blocks || !window.quantumStates || (window.particles.length === 0 && window.blocks.length === 0)) {
        console.error('observeParticles: No particles or blocks available');
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 300;
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
        window.globalMessageCooldown = 300;
    }
    window.mouseWave.x = mouseX;
    window.mouseWave.y = mouseY;
    window.mouseWave.radius = window.mouseInfluenceRadius;
};

// Реакция частиц и блоков на клик
window.clickParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.blocks || !window.quantumStates || (window.particles.length === 0 && window.blocks.length === 0)) {
        console.error('clickParticles: No particles or blocks available');
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 300;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('clickParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    console.log('clickParticles called, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    let messageAddedThisFrame = false;

    // Частицы
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
                    p.size = 4;
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
                    sketch.fill(204, 51, 51, 180); // #cc3333
                    sketch.ellipse(p.x, p.y, 12, 12);
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape);
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape }));
                    window.updateTerminalLog();
                    if (typeof window.playArpeggio === 'function') {
                        window.playArpeggio(p.shape);
                    }
                    window.globalMessageCooldown = 300;
                    messageAddedThisFrame = true;
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    state.a = 255;
                    p.size = 3 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * 2);
                    console.log('Particle ' + i + ' restored to superposition');
                    window.terminalMessages.push(getRandomMessage('superpositionRestore'));
                    window.updateTerminalLog();
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['C4'] || 261.63;
                        window.playNote(freq, 'sine', 0.5, 0.2);
                    }
                    window.globalMessageCooldown = 300;
                    messageAddedThisFrame = true;
                }
            }
        } catch (error) {
            console.error('Error clicking particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
        }
   迄今

    // Блоки
    window.blocks.forEach(function(b, i) {
        try {
            var dx = mouseX - b.x;
            var dy = mouseY - b.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[window.particles.length + i];

            if (distance < window.mouseInfluenceRadius && distance > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                if (!b.collapsed) {
                    b.collapsed = true;
                    state.a = 255;
                    sketch.fill(204, 51, 51, 180); // #cc3333
                    drawBlock(sketch, b, state.r, state.g, state.b, state.a);
                    console.log('Block ' + i + ' collapsed');
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: 'block' }));
                    window.updateTerminalLog();
                    if (typeof window.playArpeggio === 'function') {
                        window.playArpeggio('block');
                    }
                    window.globalMessageCooldown = 300;
                    messageAddedThisFrame = true;
                } else {
                    b.collapsed = false;
                    b.phase = Math.random() * 2 * Math.PI;
                    state.a = 255;
                    console.log('Block ' + i + ' restored to superposition');
                    window.terminalMessages.push(getRandomMessage('superpositionRestore'));
                    window.updateTerminalLog();
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['C4'] || 261.63;
                        window.playNote(freq, 'sine', 0.5, 0.2);
                    }
                    window.globalMessageCooldown = 300;
                    messageAddedThisFrame = true;
                }
            }
        } catch (error) {
            console.error('Error clicking block ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i + window.particles.length }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
        }
    });
};
