console.log('particles.js loaded');

window.particles = [];
window.blocks = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;

// Варианты сообщений в научном стиле
const messages = {
    initialize: [
        "Инициализация квантового разбиения портрета. Портрет видим.",
        "Квантовая система активирована. Подготовка к фрагментации.",
        "Начало декомпозиции портрета на квантовые фрагменты."
    ],
    initializeSuccess: [
        "Квантовая система готова: ${validBlocks} блоков, ${validParticles} частиц.",
        "Успешная фрагментация: ${validBlocks} блоков, ${validParticles} частиц.",
        "Портрет разбит на ${validBlocks} блоков и ${validParticles} частиц."
    ],
    initializeError: [
        "Ошибка: данные изображения недоступны для разбиения.",
        "Квантовая система не инициализирована. Требуется портрет.",
        "Аномалия: портрет не разбит на фрагменты."
    ],
    update: [
        "Эволюция квантовой системы. Фрагменты в волновом движении.",
        "Квантовая динамика: блоки и частицы взаимодействуют.",
        "Обновление волновых функций фрагментов портрета."
    ],
    decompositionStart: [
        "Инициировано квантовое разбиение портрета: фаза ${phase}.",
        "Фрагментация портрета начата: сетка формируется.",
        "Разрыв портрета на квантовые фрагменты: фаза ${phase}."
    ],
    decomposition: [
        "Квантовое разбиение: ${blockCount} блоков, прогресс ${progress}%.",
        "Фрагментация портрета: ${blockCount} блоков, фаза ${phase}.",
        "Разрыв портрета: ${blockCount} фрагментов, прогресс ${progress}%."
    ],
    stabilized: [
        "Квантовая система стабилизирована. Фрагменты зафиксированы.",
        "Стабилизация квантовых фрагментов завершена.",
        "Фрагменты портрета в квантовом равновесии."
    ],
    scatter: [
        "Фрагменты рассеиваются в квантовом поле.",
        "Квантовая энтропия возрастает. Фрагменты разлетаются.",
        "Фрагменты увеличивают квантовую неопределённость."
    ],
    superposition: [
        "Фрагмент в суперпозиции: амплитуда ψ=${amplitude}.",
        "Квантовая суперпозиция: состояние ψ=${amplitude}.",
        "Фрагмент в суперпозиции: |ψ|²=${probability}."
    ],
    mouseInfluence: [
        "Наблюдение вызывает коллапс волновой функции фрагментов.",
        "Волновое возмущение от наблюдателя влияет на фрагменты.",
        "Квантовая интерференция инициирована наблюдением."
    ],
    interference: [
        "Интерференция волновых функций формирует узоры.",
        "Квантовая интерференция: амплитуда ${amplitude}.",
        "Волновая интерференция фрагментов: ${amplitude}."
    ],
    tunneling: [
        "Фрагмент туннелировал с вероятностью P=${probability}.",
        "Квантовое туннелирование: фрагмент переместился.",
        "Фрагмент преодолел квантовый барьер."
    ],
    entanglement: [
        "Запутанные фрагменты демонстрируют квантовую корреляцию.",
        "Квантовая запутанность синхронизирует фрагменты.",
        "Фрагменты связаны квантовой запутанностью."
    ],
    collapse: [
        "Коллапс волновой функции: позиция (${x}, ${y}).",
        "Наблюдение зафиксировало фрагмент: (${x}, ${y}).",
        "Фрагмент коллапсировал в квантовом поле."
    ],
    superpositionRestore: [
        "Фрагмент восстановлен: |ψ|²=${probability}.",
        "Квантовая неопределённость восстановлена.",
        "Фрагмент вернулся в суперпозицию."
    ],
    error: [
        "Квантовая ошибка: фрагмент ${index} не обновлён.",
        "Аномалия: фрагмент ${index} не изменил состояние.",
        "Ошибка: фрагмент ${index} не обработан."
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

// Инициализация блоков и частиц из портрета
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
        const gridSize = 20; // Сетка 20x20 пикселей
        const numBlocks = Math.floor(img.width / gridSize) * Math.floor(img.height / gridSize);
        const numParticlesPerBlock = 5;
        let validBlocks = 0;
        let validParticles = 0;

        // Разбиение на блоки
        for (let y = 0; y < img.height; y += gridSize) {
            for (let x = 0; x < img.width; x += gridSize) {
                let index = (Math.floor(x + gridSize / 2) + Math.floor(y + gridSize / 2) * img.width) * 4;
                let brightness = (img.pixels[index] + img.pixels[index + 1] + img.pixels[index + 2]) / 3;
                if (brightness > 50 || Math.random() < 0.3) {
                    let r = img.pixels[index] || 30; // #1e1b4b
                    let g = img.pixels[index + 1] || 27;
                    let b = img.pixels[index + 2] || 75;
                    let a = img.pixels[index + 3] || 255;

                    let block = {
                        x: (x + gridSize / 2) * 400 / img.width,
                        y: (y + gridSize / 2) * 400 / img.height,
                        baseX: (x + gridSize / 2) * 400 / img.width,
                        baseY: (y + gridSize / 2) * 400 / img.height,
                        offsetX: 0,
                        offsetY: 0,
                        width: gridSize * 400 / img.width * (0.8 + Math.random() * 0.4),
                        height: gridSize * 400 / img.height * (0.8 + Math.random() * 0.4),
                        phase: Math.random() * 2 * Math.PI,
                        frequency: 0.005,
                        entangledPartner: Math.random() < 0.2 ? Math.floor(Math.random() * (numBlocks + numBlocks * numParticlesPerBlock)) : null,
                        collapsed: false,
                        decompositionProgress: 0,
                        vertices: [
                            { x: -gridSize / 2 * (0.8 + Math.random() * 0.4), y: -gridSize / 2 * (0.8 + Math.random() * 0.4) },
                            { x: gridSize / 2 * (0.8 + Math.random() * 0.4), y: -gridSize / 2 * (0.8 + Math.random() * 0.4) },
                            { x: gridSize / 2 * (0.8 + Math.random() * 0.4), y: gridSize / 2 * (0.8 + Math.random() * 0.4) },
                            { x: -gridSize / 2 * (0.8 + Math.random() * 0.4), y: gridSize / 2 * (0.8 + Math.random() * 0.4) }
                        ]
                    };
                    window.blocks.push(block);
                    window.quantumStates.push({
                        r: r,
                        g: g,
                        b: b,
                        a: 0, // Блоки невидимы до разбиения
                        probability: 1.0,
                        decoherenceTimer: 0,
                        tunnelFlash: 0,
                        interferencePhase: Math.random() * 2 * Math.PI,
                        entanglementFlash: 0
                    });
                    validBlocks++;

                    // Частицы внутри блока
                    for (let i = 0; i < numParticlesPerBlock; i++) {
                        let px = x + Math.random() * gridSize;
                        let py = y + Math.random() * gridSize;
                        let pIndex = (Math.floor(px) + Math.floor(py) * img.width) * 4;
                        let pr = img.pixels[pIndex] || 209; // #d1d1e6
                        let pg = img.pixels[pIndex + 1] || 209;
                        let pb = img.pixels[pIndex + 2] || 230;
                        let pa = img.pixels[pIndex + 3] || 255;

                        window.particles.push({
                            x: px * 400 / img.width,
                            y: py * 400 / img.height,
                            baseX: px * 400 / img.width,
                            baseY: py * 400 / img.height,
                            offsetX: 0,
                            offsetY: 0,
                            size: 3 + brightness / 255 * 3,
                            phase: Math.random() * 2 * Math.PI,
                            frequency: 0.01,
                            entangledPartner: Math.random() < 0.2 ? Math.floor(Math.random() * (numBlocks + numBlocks * numParticlesPerBlock)) : null,
                            collapsed: false,
                            decompositionProgress: 0,
                            shape: ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)],
                            blockIndex: validBlocks - 1
                        });

                        window.quantumStates.push({
                            r: pr,
                            g: pg,
                            b: pb,
                            a: 0, // Частицы невидимы до разбиения
                            probability: 1.0,
                            decoherenceTimer: 0,
                            tunnelFlash: 0,
                            interferencePhase: Math.random() * 2 * Math.PI,
                            entanglementFlash: 0
                        });
                        validParticles++;
                    }
                }
            }
        }

        console.log('Initialized ' + window.blocks.length + ' blocks, ' + window.particles.length + ' particles, valid: ' + validBlocks + ' blocks, ' + validParticles + ' particles');
        window.terminalMessages.push(getRandomMessage('initializeSuccess', { validBlocks, validParticles }));
        window.updateTerminalLog();
        if (typeof window.playInitialization === 'function') {
            window.playInitialization();
        }
        if (validBlocks + validParticles === 0) {
            console.error('No valid blocks or particles created.');
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
function drawShape(sketch, x, y, size, shape, rotation, r, g, b, a) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    sketch.fill(r, g, b, a);
    if (shape === 'ribbon') {
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
    sketch.pop();
}

// Отрисовка блоков с текстурой
function drawBlock(sketch, block, r, g, b, a) {
    sketch.push();
    sketch.translate(block.x, block.y);
    sketch.fill(r, g, b, a);
    sketch.beginShape();
    block.vertices.forEach(v => {
        sketch.vertex(v.x + sketch.noise(v.x * 0.1, v.y * 0.1, window.frame * 0.01) * 2, 
                      v.y + sketch.noise(v.x * 0.1 + 100, v.y * 0.1 + 100, window.frame * 0.01) * 2);
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

    // Отображение портрета в начале шага 4
    if (window.currentStep === 4 && window.decompositionTimer < 1 && window.img) {
        sketch.image(window.img, 0, 0, 400, 400);
    }

    // Квантовая декомпозиция на шаге 4
    if (window.currentStep === 4) {
        window.decompositionTimer += 0.015;
        if (window.decompositionTimer >= 1 && window.decompositionTimer < 4) {
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame && window.decompositionTimer < 1.015) {
                window.terminalMessages.push(getRandomMessage('decompositionStart', { phase: window.decompositionTimer.toFixed(2) }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
            let progress = ((window.decompositionTimer - 1) / 3 * 100).toFixed(0);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('decomposition', { blockCount: window.blocks.length, progress, phase: window.decompositionTimer.toFixed(2) }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
        }
        // Плавное появление блоков и частиц
        window.blocks.forEach((b, i) => {
            let state = window.quantumStates[i];
            state.a = Math.min(255, state.a + (window.decompositionTimer >= 1 ? 255 * 0.015 : 0));
        });
        window.particles.forEach((p, i) => {
            let state = window.quantumStates[window.blocks.length + i];
            state.a = Math.min(255, state.a + (window.decompositionTimer >= 1 ? 255 * 0.015 : 0));
        });
        // Скрытие портрета после разбиения
        if (window.decompositionTimer >= 4 && window.img) {
            sketch.image(window.img, 0, 0, 400, 400, 0, 0, 0, 0); // Пустое изображение
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
        window.blocks.forEach((b, i) => window.quantumStates[i].a = 255);
        window.particles.forEach((p, i) => window.quantumStates[window.blocks.length + i].a = 255);
    }

    // Обновление мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 1);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 10) window.mouseWave.trail.shift();
    }

    let potentialMessages = [];

    // Обновление блоков
    window.blocks.forEach(function(b, i) {
        try {
            var state = window.quantumStates[i];

            // Квантовая декомпозиция
            if (window.currentStep === 4 && window.decompositionTimer >= 1 && window.decompositionTimer < 4) {
                b.decompositionProgress = Math.min(1, b.decompositionProgress + 0.015);
                var dx = b.x - 200;
                var dy = b.y - 200;
                var dist = Math.sqrt(dx * dx + dy * dy) + 1;
                var wave = Math.sin(dist * 0.04 + window.decompositionTimer * 2);
                b.offsetX += wave * 15 * (dx / dist);
                b.offsetY += wave * 15 * (dy / dist);
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'scatter', params: {} });
                }
            }

            // Волновая функция (суперпозиция)
            var n = sketch.noise(b.x * window.noiseScale, b.y * window.noiseScale, window.frame * 0.015);
            if (!b.collapsed) {
                b.phase += b.frequency;
                var amplitude = Math.sin(b.phase) * 6 * n * window.chaosFactor;
                b.offsetX += Math.cos(b.phase) * amplitude;
                b.offsetY += Math.sin(b.phase) * amplitude;
                if (Math.random() < 0.015 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    b.vertices = b.vertices.map(v => ({
                        x: v.x + (Math.random() - 0.5) * 3,
                        y: v.y + (Math.random() - 0.5) * 3
                    }));
                    potentialMessages.push({ type: 'superposition', params: { amplitude: amplitude.toFixed(2) } });
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
                    b.offsetX += dx * influence * 0.15;
                    b.offsetY += dy * influence * 0.15;
                    potentialMessages.push({ type: 'mouseInfluence', params: {} });
                }
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
                        interference += wave * 0.1;
                        if (Math.random() < 0.001 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            sketch.stroke(204, 51, 51, 25); // #cc3333
                            sketch.line(b.x, b.y, other.x, other.y);
                            potentialMessages.push({ type: 'interference', params: { amplitude: wave.toFixed(2) } });
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
            let tunnelProbability = Math.exp(-0.1 * Math.sqrt(2 * (100 - 50))); // Упрощённая модель P = exp(-2a√(2m(V-E))/ħ)
            if (Math.random() < tunnelProbability / 100 && !b.collapsed) {
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
                    potentialMessages.push({ type: 'tunneling', params: { probability: (tunnelProbability / 100).toFixed(4) } });
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
                var partner = b.entangledPartner < window.blocks.length ? window.blocks[b.entangledPartner] : window.particles[b.entangledPartner - window.blocks.length];
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
                potentialMessages.push({ type: 'error', params: { index: i } });
            }
        }
    });

    // Обновление частиц
    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[window.blocks.length + i];

            // Квантовая декомпозиция
            if (window.currentStep === 4 && window.decompositionTimer >= 1 && window.decompositionTimer < 4) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.015);
                var dx = p.x - 200;
                var dy = p.y - 200;
                var dist = Math.sqrt(dx * dx + dy * dy) + 1;
                var wave = Math.sin(dist * 0.04 + window.decompositionTimer * 2);
                p.offsetX += wave * 10 * (dx / dist);
                p.offsetY += wave * 10 * (dy / dist);
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'scatter', params: {} });
                }
            }

            // Волновая функция (суперпозиция)
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.015);
            if (!p.collapsed) {
                p.phase += p.frequency;
                var amplitude = Math.sin(p.phase) * 4 * n * window.chaosFactor;
                p.offsetX += Math.cos(p.phase) * amplitude;
                p.offsetY += Math.sin(p.phase) * amplitude;
                p.size = (3 + 2 * n * state.probability);
                if (Math.random() < 0.015 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
                    potentialMessages.push({ type: 'superposition', params: { amplitude: amplitude.toFixed(2) } });
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

            // Интерференция
            var interference = 0;
            window.particles.forEach(function(other, j) {
                if (i !== j) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 60) {
                        var wave = Math.sin(distance * 0.07 + state.interferencePhase + window.frame * 0.025);
                        interference += wave * 0.08;
                        if (Math.random() < 0.001 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            sketch.stroke(204, 51, 51, 25); // #cc3333
                            sketch.line(p.x, p.y, other.x, other.y);
                            potentialMessages.push({ type: 'interference', params: { amplitude: wave.toFixed(2) } });
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
            let tunnelProbability = Math.exp(-0.1 * Math.sqrt(2 * (100 - 50))); // Упрощённая модель
            if (Math.random() < tunnelProbability / 100 && !p.collapsed) {
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
                    potentialMessages.push({ type: 'tunneling', params: { probability: (tunnelProbability / 100).toFixed(4) } });
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
                var partner = p.entangledPartner < window.blocks.length ? window.blocks[p.entangledPartner] : window.particles[p.entangledPartner - window.blocks.length];
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
                drawShape(sketch, p.x, p.y, p.size, p.shape, p.phase, state.r, state.g, state.b, state.a);
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
                potentialMessages.push({ type: 'error', params: { index: window.blocks.length + i } });
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

    // Блоки
    window.blocks.forEach(function(b, i) {
        try {
            var dx = mouseX - b.x;
            var dy = mouseY - b.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[i];

            if (distance < window.mouseInfluenceRadius && distance > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                if (!b.collapsed) {
                    b.collapsed = true;
                    state.a = 255;
                    sketch.fill(204, 51, 51, 180); // #cc3333
                    drawBlock(sketch, b, state.r, state.g, state.b, state.a);
                    console.log('Block ' + i + ' collapsed');
                    window.terminalMessages.push(getRandomMessage('collapse', { x: b.x.toFixed(2), y: b.y.toFixed(2) }));
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
                    window.terminalMessages.push(getRandomMessage('superpositionRestore', { probability: state.probability.toFixed(2) }));
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
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
        }
    });

    // Частицы
    window.particles.forEach(function(p, i) {
        try {
            var dx = mouseX - p.x;
            var dy = mouseY - p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[window.blocks.length + i];

            if (distance < window.mouseInfluenceRadius && distance > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                if (!p.collapsed) {
                    p.collapsed = true;
                    state.a = 255;
                    p.size = 4;
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
                    sketch.fill(204, 51, 51, 180); // #cc3333
                    sketch.ellipse(p.x, p.y, 12, 12);
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape);
                    window.terminalMessages.push(getRandomMessage('collapse', { x: p.x.toFixed(2), y: p.y.toFixed(2) }));
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
                    window.terminalMessages.push(getRandomMessage('superpositionRestore', { probability: state.probability.toFixed(2) }));
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
                window.terminalMessages.push(getRandomMessage('error', { index: window.blocks.length + i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
        }
    });
};
