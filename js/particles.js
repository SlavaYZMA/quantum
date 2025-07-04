console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;
window.phaseTimer = 0;
window.globalPhase = 'chaos';
window.performanceFactor = 1; // 1 для мощных устройств, <1 для слабых
window.grid = null; // Для оптимизации интерференции

// Сообщения
const messages = {
    initialize: ["Инициализация биоквантовой экосистемы портрета.", "Формирование квантовой биосетки.", "Запуск квантовой биодекомпозиции."],
    initializeSuccess: ["Экосистема активна: ${validParticles} биоквантов.", "Успешно оживлено: ${validParticles} состояний.", "Портрет трансформирован в ${validParticles} квантов."],
    initializeError: ["Ошибка: биоквантовая сетка не сформирована.", "Не удалось оживить систему.", "Аномалия: данные изображения не пригодны."],
    update: ["Биоквантовая экосистема пульсирует в фазе ${phase}.", "Кванты текут в живом поле.", "Эволюция: биоквантовый танец."],
    decomposition: ["Декомпозиция портрета: прозрачность ${imgAlpha}/255.", "Изображение растворяется в биоквантовом потоке.", "Переход в квантовую биосреду."],
    blockFormation: ["Пиксели сливаются в биокластеры формы ${shape}.", "Формирование живых блоков.", "Квантовая биология: форма ${shape}."],
    stabilized: ["Биоквантовая экосистема стабилизирована.", "Органические кванты синхронизированы.", "Кванты живут в бесконечном танце."],
    scatter: ["Кванты текут, как микроорганизмы.", "Биоквантовая система: спины формируют узоры.", "Органическое рассеяние квантов."],
    superposition: ["Квант в суперпозиции: форма ${shape}, спин ${spin}.", "Биоквантовая суперпозиция: ${shape}.", "Квант живёт: спин ${spin}."],
    mouseInfluence: ["Наблюдение возмущает биокванты.", "Волновой пакет оживляет кванты.", "Квантовое воздействие меняет биопотоки."],
    featureAttraction: ["Кванты текут к ключевым точкам.", "Биоквантовая структура у лица.", "Кванты пульсируют у координат."],
    interference: ["Квантовая интерференция создаёт узоры.", "Волновые функции текут.", "Интерференция формирует связи."],
    tunneling: ["Квант со спином ${spin} мигрировал.", "Биоквантовая миграция.", "Квант туннелировал, как клетка."],
    entanglement: ["Запутанные кванты пульсируют синхронно.", "Нелокальность: спины связаны.", "Запутанность создаёт корреляцию."],
    globalEntanglement: ["Глобальная запутанность: синхронизация.", "Экосистема в глобальной корреляции.", "Нелокальная гармония активирована."],
    wavefront: ["Глобальный волновой фронт оживляет систему.", "Кванты текут, как волна.", "Волновой всплеск синхронизирует."],
    phaseTransition: ["Фазовый переход: фаза ${phase}.", "Биоквантовая эволюция: ${phase}.", "Экосистема трансформируется в ${phase}."],
    precession: ["Спиновая прецессия кванта ${index}.", "Квант ${index} прецессирует.", "Биоквант ${index} меняет ритм."],
    diffusion: ["Квант ${index} диффундирует.", "Биоквантовая диффузия: ${index}.", "Квант ${index} расширяет функцию."],
    decoherence: ["Квант ${index} потерял когерентность.", "Биоквант ${index} стабилизирован.", "Декогеренция кванта ${index}."],
    decoherenceRestore: ["Квант ${index} восстановил когерентность.", "Биоквант ${index} ожил.", "Квант ${index} вернулся к квантовости."],
    error: ["Ошибка: квант ${index} не обновлён.", "Аномалия: спин ${index} не изменился.", "Биоквантовая ошибка: ${index}."]
};

// Выбор случайного сообщения
function getRandomMessage(type, params = {}) {
    let msgArray = messages[type];
    let msg = msgArray[Math.floor(Math.random() * msgArray.length)];
    for (let key in params) {
        msg = msg.replace(`\${${key}}`, params[key]);
    }
    return `[${new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${msg}`;
}

// Обновление терминала
window.updateTerminalLog = function() {
    const maxMessages = 8;
    while (window.terminalMessages.length > maxMessages) {
        window.terminalMessages.shift();
    }
    const terminalDiv = document.getElementById(`terminal-log-step-${window.currentStep}`);
    if (terminalDiv) {
        terminalDiv.innerHTML = window.terminalMessages.map(msg => 
            `<div class="${msg.includes('туннелировал') || msg.includes('мигрировал') ? 'tunneling' : msg.includes('интерференция') ? 'interference' : msg.includes('запутанность') || msg.includes('нелокальность') ? 'entanglement' : ''}">${msg}</div>`
        ).join('');
    }
};

// Создание сетки для оптимизации интерференции
function createGrid(width, height, cellSize) {
    const grid = [];
    for (let y = 0; y < Math.ceil(height / cellSize); y++) {
        grid[y] = [];
        for (let x = 0; x < Math.ceil(width / cellSize); x++) {
            grid[y][x] = [];
        }
    }
    return grid;
}

// Добавление частицы в сетку
function addToGrid(grid, particle, cellSize) {
    const gridX = Math.floor(particle.x / cellSize);
    const gridY = Math.floor(particle.y / cellSize);
    if (grid[gridY] && grid[gridY][gridX]) {
        grid[gridY][gridX].push(particle);
    }
}

// Получение соседей из сетки
function getNeighbors(grid, x, y, cellSize) {
    const neighbors = [];
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const ny = gridY + dy;
            const nx = gridX + dx;
            if (grid[ny] && grid[ny][nx]) {
                neighbors.push(...grid[ny][nx]);
            }
        }
    }
    return neighbors;
}

// Определение производительности
function detectPerformance() {
    const start = performance.now();
    let sum = 0;
    for (let i = 0; i < 100000; i++) {
        sum += Math.sin(i);
    }
    const end = performance.now();
    const time = end - start;
    return time < 50 ? 1 : time < 100 ? 0.75 : 0.5; // Мощное: 1, среднее: 0.75, слабое: 0.5
}

// Инициализация частиц
window.initializeParticles = function(img) {
    console.log('initializeParticles called');
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
    window.phaseTimer = 0;
    window.globalPhase = 'chaos';
    window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
    window.globalMessageCooldown = 0;
    window.performanceFactor = detectPerformance();
    window.grid = createGrid(400, 400, 40); // Сетка 40x40

    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty');
            window.terminalMessages.push(getRandomMessage('initializeError'));
            window.updateTerminalLog();
            return;
        }

        const pixelSize = 7 * (1 / window.performanceFactor); // Уменьшаем для слабых устройств
        const blockSize = 20;
        const numParticles = Math.floor((img.width * img.height) / (pixelSize * pixelSize));
        let validParticles = 0;

        const faceFeatures = [
            { x: img.width * 0.35, y: img.height * 0.3, weight: 0.25 },
            { x: img.width * 0.65, y: img.height * 0.3, weight: 0.25 },
            { x: img.width * 0.5, y: img.height * 0.5, weight: 0.15 },
            { x: img.width * 0.5, y: img.height * 0.7, weight: 0.15 }
        ];

        for (let y = 0; y < img.height; y += pixelSize) {
            for (let x = 0; x < img.width; x += pixelSize) {
                const index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
                const r = img.pixels[index] || 0;
                const g = img.pixels[index + 1] || 0;
                const b = img.pixels[index + 2] || 0;
                const brightness = (r + g + b) / 3;

                if (brightness > 100 || Math.random() < 0.1) {
                    const useFeature = Math.random() < 0.5;
                    let featureWeight = 0.1;
                    if (useFeature) {
                        const feature = faceFeatures.find(f => Math.abs(f.x - x) < img.width * 0.1 && Math.abs(f.y - y) < img.height * 0.1);
                        featureWeight = feature ? feature.weight : 0.1;
                    }

                    const particle = {
                        x: x * 400 / img.width,
                        y: y * 400 / img.height,
                        baseX: x * 400 / img.width,
                        baseY: y * 400 / img.height,
                        velocityX: 0,
                        velocityY: 0,
                        size: pixelSize * 0.8,
                        phase: Math.random() * 2 * Math.PI,
                        frequency: 0.007,
                        spin: Math.random() < 0.5 ? 0.5 : -0.5,
                        spinPhase: Math.random() * 2 * Math.PI,
                        entangledPartner: Math.random() < 0.1 ? Math.floor(Math.random() * numParticles) : null,
                        collapsed: false,
                        decompositionProgress: 0,
                        shape: 'pixel',
                        featureWeight: featureWeight,
                        blockId: Math.floor(x / blockSize) + Math.floor(y / blockSize) * Math.floor(img.width / blockSize),
                        clusterId: null,
                        pulsePhase: Math.random() * 2 * Math.PI,
                        uncertaintyRadius: 5
                    };
                    window.particles.push(particle);
                    addToGrid(window.grid, particle, 40);

                    window.quantumStates.push({
                        r: r,
                        g: g,
                        b: b,
                        a: 0,
                        probability: 1.0,
                        decoherenceTimer: 0,
                        tunnelFlash: 0,
                        interferencePhase: Math.random() * 2 * Math.PI,
                        entanglementFlash: 0,
                        wavePacketAlpha: 0
                    });
                    validParticles++;
                }
            }
        }

        console.log('Initialized ' + window.particles.length + ' particles');
        window.terminalMessages.push(getRandomMessage('initializeSuccess', { validParticles }));
        window.updateTerminalLog();
        if (validParticles === 0) {
            console.error('No valid particles created');
            window.terminalMessages.push(getRandomMessage('initializeError'));
            window.updateTerminalLog();
        }
    } catch (error) {
        console.error('Error in initializeParticles: ' + error);
        window.terminalMessages.push(getRandomMessage('initializeError'));
        window.updateTerminalLog();
    }
};

// Кэширование градиента
let cachedGradient = null;
function getWavePacketGradient(sketch, x, y, uncertaintyRadius, r, g, b, wavePacketAlpha) {
    if (!cachedGradient) {
        cachedGradient = sketch.drawingContext.createRadialGradient(x, y, 0, x, y, uncertaintyRadius);
        cachedGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${wavePacketAlpha})`);
        cachedGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    }
    return cachedGradient;
}

// Отрисовка волнового пакета
function drawWavePacket(sketch, x, y, uncertaintyRadius, r, g, b, wavePacketAlpha) {
    sketch.noStroke();
    sketch.drawingContext.fillStyle = getWavePacketGradient(sketch, x, y, uncertaintyRadius, r, g, b, wavePacketAlpha);
    sketch.ellipse(x, y, uncertaintyRadius * 2, uncertaintyRadius * 2);
}

// Отрисовка форм
function drawShape(sketch, x, y, size, shape, rotation, spin, spinPhase, r, g, b, a, featureWeight, pulse, frame) {
    if (frame % 2 === 0 && (shape === 'soft-ribbon' || shape === 'bio-cluster')) return; // Пропуск сложных форм на каждом втором кадре
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation + spin * Math.PI / 2 + spinPhase);
    sketch.fill(r, g, b, a * 0.6);
    sketch.noStroke();
    if (shape === 'pixel') {
        sketch.ellipse(0, 0, size * pulse, size * pulse);
    } else if (shape === 'ellipse') {
        sketch.ellipse(0, 0, size * 1.2 * (1 + featureWeight + Math.abs(spin)) * pulse, size * 0.6 * pulse);
    } else if (shape === 'soft-ribbon') {
        let stretch = 1 + featureWeight + Math.abs(spin) * 0.4 + 0.2 * Math.sin(spinPhase);
        sketch.beginShape();
        sketch.vertex(-size * 1.0 * stretch * pulse, size * 0.15 * pulse);
        sketch.bezierVertex(-size * 0.4 * stretch * pulse, size * 0.3 * pulse, size * 0.4 * stretch * pulse, size * 0.3 * pulse, size * 1.0 * stretch * pulse, size * 0.15 * pulse);
        sketch.bezierVertex(size * 0.4 * stretch * pulse, -size * 0.3 * pulse, -size * 0.4 * stretch * pulse, -size * 0.3 * pulse, -size * 1.0 * stretch * pulse, -size * 0.15 * pulse);
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'bio-cluster') {
        for (let i = 0; i < 3; i++) { // Уменьшено с 5 до 3
            let dx = (Math.sin(i * Math.PI / 1.5 + spin + pulse + spinPhase) * size * 0.3);
            let dy = (Math.cos(i * Math.PI / 1.5 + spin + pulse + spinPhase) * size * 0.3);
            sketch.ellipse(dx, dy, size * 0.2 * (1 + Math.abs(spin)) * pulse, size * 0.2 * pulse);
        }
    }
    sketch.pop();
}

// Отрисовка мыши
function drawMouseWave(sketch) {
    if (window.currentStep !== 4 && window.currentStep !== 5 || window.mouseWave.radius <= 0) return;
    sketch.noFill();
    let gradient = sketch.drawingContext.createRadialGradient(window.mouseWave.x, window.mouseWave.y, 0, window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius);
    gradient.addColorStop(0, 'rgba(209, 209, 230, 0.15)');
    gradient.addColorStop(1, 'rgba(209, 209, 230, 0)');
    sketch.drawingContext.strokeStyle = gradient;
    sketch.strokeWeight(0.8);
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2);
    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 40 * (1 - i / window.mouseWave.trail.length);
        sketch.stroke(209, 209, 230, alpha);
        sketch.ellipse(point.x, point.y, window.mouseWave.radius * 0.4);
    });
}

// Обновление частиц
window.updateParticles = function(sketch) {
    if (!window.quantumSketch || !window.particles || window.particles.length === 0) {
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 600;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) return;
    let messageAddedThisFrame = false;
    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('update', { phase: window.globalPhase }));
        window.updateTerminalLog();
        window.globalMessageCooldown = 600;
        messageAddedThisFrame = true;
    }
    window.globalMessageCooldown--;
    window.frame = window.frame || 0;
    window.frame++;
    window.phaseTimer += 0.015 * window.performanceFactor;

    // Фазовый переход
    if (window.currentStep === 5) {
        if (window.phaseTimer < 30) {
            if (window.globalPhase !== 'chaos') {
                window.globalPhase = 'chaos';
                window.terminalMessages.push(getRandomMessage('phaseTransition', { phase: 'хаос' }));
                window.updateTerminalLog();
            }
        } else if (window.phaseTimer < 60) {
            if (window.globalPhase !== 'clustering') {
                window.globalPhase = 'clustering';
                window.terminalMessages.push(getRandomMessage('phaseTransition', { phase: 'кластеризация' }));
                window.updateTerminalLog();
            }
        } else if (window.phaseTimer < 90) {
            if (window.globalPhase !== 'synchronization') {
                window.globalPhase = 'synchronization';
                window.terminalMessages.push(getRandomMessage('phaseTransition', { phase: 'синхронизация' }));
                window.updateTerminalLog();
            }
        } else if (window.phaseTimer < 120) {
            if (window.globalPhase !== 'wavefront') {
                window.globalPhase = 'wavefront';
                window.terminalMessages.push(getRandomMessage('phaseTransition', { phase: 'волновой фронт' }));
                window.updateTerminalLog();
            }
        } else {
            window.phaseTimer = 0;
            window.globalPhase = 'chaos';
            window.terminalMessages.push(getRandomMessage('phaseTransition', { phase: 'хаос' }));
            window.updateTerminalLog();
        }
    }

    // Декомпозиция
    if (window.currentStep === 4 && window.decompositionTimer < 12) {
        window.decompositionTimer += 0.015 * window.performanceFactor;
        if (window.img) {
            let imgAlpha = Math.max(0, 255 * (1 - window.decompositionTimer / 4));
            sketch.tint(255, imgAlpha);
            sketch.image(window.img, 0, 0, 400, 400);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('decomposition', { imgAlpha: imgAlpha.toFixed(0) }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 600;
                messageAddedThisFrame = true;
            }
        }
    } else if (window.currentStep === 5 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('stabilized'));
        window.updateTerminalLog();
        if (typeof window.playStabilization === 'function') {
            window.playStabilization();
        }
        window.globalMessageCooldown = 600;
        messageAddedThisFrame = true;
    }

    // Обновление мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 0.4 * window.performanceFactor);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 8) window.mouseWave.trail.shift();
    }

    // Обновление сетки
    window.grid = createGrid(400, 400, 40);
    window.particles.forEach(p => addToGrid(window.grid, p, 40));

    // Формирование кластеров
    const blocks = {};
    const clusters = {};
    if (window.globalPhase === 'clustering') {
        window.particles.forEach(p => {
            if (!p.clusterId) p.clusterId = Math.floor(Math.random() * 30); // Меньше кластеров
            if (!clusters[p.clusterId]) clusters[p.clusterId] = [];
            clusters[p.clusterId].push(p);
        });
    } else {
        window.particles.forEach(p => {
            p.clusterId = null;
            if (!blocks[p.blockId]) blocks[p.blockId] = [];
            blocks[p.blockId].push(p);
        });
    }

    let potentialMessages = [];
    let globalEntanglement = Math.random() < 0.001 && window.currentStep === 5;
    let wavefrontEvent = Math.random() < 0.0005 && window.currentStep === 5 && window.globalPhase === 'wavefront';

    window.particles.forEach(function(p, i) {
        try {
            let state = window.quantumStates[i];
            let pulse = 1 + 0.2 * Math.sin(p.pulsePhase + p.spin * Math.PI);
            p.pulsePhase += 0.05 * window.performanceFactor * (1 + Math.abs(p.spin) * 0.3);
            p.spinPhase += 0.02 * window.performanceFactor;

            // Неопределённость и диффузия
            let speed = Math.sqrt(p.velocityX * p.velocityX + p.velocityY * p.velocityY);
            p.uncertaintyRadius = 5 + speed * 8 + 4 * Math.sin(p.pulsePhase);
            state.wavePacketAlpha = p.collapsed ? 0 : 40 * state.probability * pulse;

            // Декогеренция
            if (!p.collapsed && window.decompositionTimer >= 8) {
                state.decoherenceTimer += 0.01 * window.performanceFactor;
                if (state.decoherenceTimer > 100 && Math.random() < 0.005) {
                    p.collapsed = true;
                    state.probability = 0.3;
                    state.wavePacketAlpha = 0;
                    p.size = 2;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'decoherence', params: { index: i } });
                    }
                } else if (state.decoherenceTimer > 100 && Math.random() < 0.005) {
                    p.collapsed = false;
                    state.probability = 1.0;
                    state.decoherenceTimer = 0;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'decoherenceRestore', params: { index: i } });
                    }
                }
            }

            // Этапы и фазы
            if (window.currentStep === 4) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.015 * window.performanceFactor);
                state.a = Math.floor(p.decompositionProgress * 180);
                if (window.decompositionTimer < 4) {
                    p.shape = 'pixel';
                    p.velocityX = 0;
                    p.velocityY = 0;
                } else if (window.decompositionTimer < 8) {
                    p.shape = Math.random() < 0.5 ? 'ellipse' : 'soft-ribbon';
                    const block = blocks[p.blockId];
                    if (block && block.length > 0) {
                        const centerX = block.reduce((sum, p) => sum + p.baseX, 0) / block.length;
                        const centerY = block.reduce((sum, p) => sum + p.baseY, 0) / block.length;
                        p.velocityX += (centerX - p.x) * 0.02;
                        p.velocityY += (centerY - p.y) * 0.02;
                        p.size = 6 * pulse;
                        if (Math.random() < 0.007 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            potentialMessages.push({ type: 'blockFormation', params: { shape: p.shape } });
                        }
                    }
                } else {
                    p.shape = ['ellipse', 'soft-ribbon', 'bio-cluster'][Math.floor(Math.random() * 3)];
                    p.size = (1.6 + sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * state.probability) * (1 + p.featureWeight * 0.3 + Math.abs(p.spin)) * pulse;
                    if (Math.random() < 0.01 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        p.shape = ['ellipse', 'soft-ribbon', 'bio-cluster'][Math.floor(Math.random() * 3)];
                        potentialMessages.push({ type: 'superposition', params: { shape: p.shape, spin: p.spin.toFixed(1) } });
                        if (typeof window.playNote === 'function' && window.noteFrequencies) {
                            const notes = ['C4', 'E4', 'G4'];
                            const note = notes[Math.floor(Math.random() * notes.length)];
                            const freq = window.noteFrequencies[note] || 261.63;
                            window.playNote(freq, 'sine', 0.2, 0.15);
                        }
                    }
                }
            } else if (window.currentStep === 5) {
                p.decompositionProgress = 1;
                state.a = 180;
                p.shape = ['ellipse', 'soft-ribbon', 'bio-cluster'][Math.floor(Math.random() * 3)];
                p.size = (1.6 + sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * state.probability) * (1 + p.featureWeight * 0.3 + Math.abs(p.spin)) * pulse;

                // Фазовое поведение
                if (window.globalPhase === 'clustering' && p.clusterId !== null) {
                    const cluster = clusters[p.clusterId];
                    if (cluster && cluster.length > 0) {
                        const centerX = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length;
                        const centerY = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length;
                        p.velocityX += (centerX - p.x) * 0.03;
                        p.velocityY += (centerY - p.y) * 0.03;
                    }
                } else if (window.globalPhase === 'synchronization') {
                    p.spin = Math.sin(window.phaseTimer * 0.1 + p.x * 0.01 + p.y * 0.01) > 0 ? 0.5 : -0.5;
                } else if (window.globalPhase === 'wavefront' || wavefrontEvent) {
                    p.velocityX += Math.sin(p.x * 0.02 + window.phaseTimer) * 0.5 * pulse;
                    p.velocityY += Math.cos(p.y * 0.02 + window.phaseTimer) * 0.5 * pulse;
                }
            }

            // Биологичное движение
            if (window.decompositionTimer >= 8 || window.currentStep === 5) {
                const n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.008);
                const bioRhythm = 1 + 0.3 * Math.sin(p.pulsePhase + p.spin);
                p.velocityX += (Math.cos(p.phase + p.spin * Math.PI / 2) * n * window.chaosFactor * 0.4 * bioRhythm - p.velocityX) * 0.04;
                p.velocityY += (Math.sin(p.phase + p.spin * Math.PI / 2) * n * window.chaosFactor * 0.4 * bioRhythm - p.velocityY) * 0.04;
                p.phase += p.frequency * (1 + Math.abs(p.spin) * 0.4) * window.performanceFactor;
                if (Math.random() < 0.02) {
                    p.velocityX += (Math.random() - 0.5) * 1.2 * bioRhythm;
                    p.velocityY += (Math.random() - 0.5) * 1.2 * bioRhythm;
                }
                if (Math.random() < 0.005 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'precession', params: { index: i } });
                }
                if (Math.random() < 0.005 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'diffusion', params: { index: i } });
                }
            } else {
                p.velocityX *= 0.96;
                p.velocityY *= 0.96;
            }

            // Влияние мыши
            if (window.currentStep === 4 || window.currentStep === 5) {
                let dx = p.x - window.mouseWave.x;
                let dy = p.y - window.mouseWave.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    let influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                    p.velocityX += dx * influence * 0.03 * pulse;
                    p.velocityY += dy * influence * 0.03 * pulse;
                    if (Math.random() < 0.007) {
                        p.spin = -p.spin;
                        potentialMessages.push({ type: 'mouseInfluence', params: { spin: p.spin.toFixed(1) } });
                    }
                }
            }

            // Притяжение к ключевым точкам
            if (p.featureWeight > 0.1 && window.decompositionTimer < 8 && window.currentStep === 4 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                p.velocityX += (p.baseX - p.x) * 0.03 * p.featureWeight;
                p.velocityY += (p.baseY - p.y) * 0.03 * p.featureWeight;
                potentialMessages.push({ type: 'featureAttraction', params: {} });
            }

            // Глобальная запутанность
            if (globalEntanglement && !p.collapsed) {
                p.entangledPartner = Math.floor(Math.random() * window.particles.length);
                state.entanglementFlash = 20;
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'globalEntanglement', params: {} });
                }
            }

            // Волновой фронт
            if (wavefrontEvent) {
                state.wavePacketAlpha = 80 * pulse;
                p.uncertaintyRadius = 15;
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'wavefront', params: {} });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['C4'] || 261.63;
                        window.playNote(freq, 'sine', 0.3, 0.2);
                    }
                }
            }

            // Цвета
            state.r = Math.min(255, Math.max(0, state.r));
            state.g = Math.min(255, Math.max(0, state.g));
            state.b = Math.min(255, Math.max(0, state.b));

            // Интерференция с использованием сетки
            if (window.decompositionTimer >= 8 || window.currentStep === 5) {
                let neighbors = getNeighbors(window.grid, p.x, p.y, 40);
                neighbors.forEach(other => {
                    if (p !== other) {
                        let dx = p.x - other.x;
                        let dy = p.y - other.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 80 && p.featureWeight > 0.1 && other.featureWeight > 0.1 && !p.collapsed && !other.collapsed) {
                            let wave = Math.sin(distance * 0.04 + state.interferencePhase + window.frame * 0.015 + p.spin + other.spin);
                            p.velocityX += wave * 0.03 * (window.globalPhase === 'synchronization' ? 4 : 2.5) * pulse;
                            p.velocityY += wave * 0.03 * (window.globalPhase === 'synchronization' ? 4 : 2.5) * pulse;
                            if (Math.random() < 0.0007 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                                sketch.push();
                                sketch.noFill();
                                sketch.stroke(63, 22, 127, 40); // #3f167f
                                sketch.strokeWeight(0.4 + 0.2 * Math.abs(wave));
                                sketch.beginShape();
                                for (let t = 0; t < 1; t += 0.1) {
                                    let ix = p.x + t * (other.x - p.x);
                                    let iy = p.y + t * (other.y - p.y);
                                    let offset = Math.sin(t * Math.PI * 2 + state.interferencePhase) * 2 * wave;
                                    sketch.vertex(ix + offset * (dy / distance), iy - offset * (dx / distance));
                                }
                                sketch.endShape();
                                sketch.pop();
                                potentialMessages.push({ type: 'interference', params: { spin: p.spin.toFixed(1) } });
                                if (typeof window.playInterference === 'function') {
                                    window.playInterference(380, 385, 0.7, 0.1);
                                }
                            }
                        }
                    }
                });
            }

            // Туннелирование
            if (Math.random() < 0.001 && !p.collapsed && (window.decompositionTimer >= 8 || window.currentStep === 5)) {
                let oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                p.velocityX = (Math.random() - 0.5) * 1.2 * pulse;
                p.velocityY = (Math.random() - 0.5) * 1.2 * pulse;
                state.tunnelFlash = 18;
                sketch.stroke(204, 51, 51, 40);
                sketch.strokeWeight(0.4);
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(204, 51, 51, 25);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.25, state.tunnelFlash * 0.25);
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'tunneling', params: { spin: p.spin.toFixed(1) } });
                    if (typeof window.playTunneling === 'function') {
                        const freq = (p.x * p.y) % 380 + 190;
                        window.playTunneling(freq, 0.12, 0.15);
                    }
                }
                addToGrid(window.grid, p, 40); // Обновление сетки
            } else {
                sketch.noStroke();
            }

            // Запутанность
            if (p.entangledPartner !== null && window.particles[p.entangledPartner] && (window.decompositionTimer >= 8 || window.currentStep === 5)) {
                let partner = window.particles[p.entangledPartner];
                let partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                if (!p.collapsed && !partner.collapsed && Math.random() < 0.005 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    state.entanglementFlash = 10;
                    partnerState.entanglementFlash = 10;
                    potentialMessages.push({ type: 'entanglement', params: { spin: p.spin.toFixed(1) } });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['E4'] || 329.63;
                        window.playNote(freq, 'sine', 0.2, 0.15);
                    }
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(63, 22, 127, state.entanglementFlash * 4);
                    sketch.strokeWeight(0.4);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                    partnerState.entanglementFlash--;
                }
            }

            // Отталкивание от краёв
            const margin = 20;
            if (p.x < margin) p.velocityX += (margin - p.x) * 0.04 * pulse;
            if (p.x > 400 - margin) p.velocityX -= (p.x - (400 - margin)) * 0.04 * pulse;
            if (p.y < margin) p.velocityY += (margin - p.y) * 0.04 * pulse;
            if (p.y > 400 - margin) p.velocityY -= (p.y - (400 - margin)) * 0.04 * pulse;

            // Обновление позиции
            p.x = Math.max(0, Math.min(400, p.x + p.velocityX));
            p.y = Math.max(0, Math.min(400, p.y + p.velocityY));
            addToGrid(window.grid, p, 40); // Обновление сетки

            // Отрисовка волнового пакета
            if (!p.collapsed && state.wavePacketAlpha > 0) {
                drawWavePacket(sketch, p.x, p.y, p.uncertaintyRadius, state.r, state.g, state.b, state.wavePacketAlpha);
            }

            // Отрисовка частицы
            if (p.size > 0) {
                sketch.fill(state.r, state.g, state.b, state.a / 7);
                sketch.ellipse(p.x, p.y, p.size + 2 * pulse, p.size + 2 * pulse);
                drawShape(sketch, p.x, p.y, p.size, p.shape, p.phase, p.spin, p.spinPhase, state.r, state.g, state.b, state.a, p.featureWeight, pulse, window.frame);
                if (state.tunnelFlash > 0) {
                    sketch.fill(204, 51, 51, state.tunnelFlash * 2.5);
                    sketch.ellipse(p.x, p.y, p.size + 2 * pulse, p.size + 2 * pulse);
                    state.tunnelFlash--;
                }
            }
        } catch (error) {
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                potentialMessages.push({ type: 'error', params: { index: i } });
            }
        }
    });

    if (potentialMessages.length > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        let selectedMessage = potentialMessages.find(msg => msg.type === 'tunneling') ||
                             potentialMessages.find(msg => msg.type === 'interference') ||
                             potentialMessages.find(msg => msg.type === 'entanglement') ||
                             potentialMessages.find(msg => msg.type === 'globalEntanglement') ||
                             potentialMessages.find(msg => msg.type === 'wavefront') ||
                             potentialMessages.find(msg => msg.type === 'decoherence') ||
                             potentialMessages.find(msg => msg.type === 'decoherenceRestore') ||
                             potentialMessages[Math.floor(Math.random() * potentialMessages.length)];
        window.terminalMessages.push(getRandomMessage(selectedMessage.type, selectedMessage.params));
        window.updateTerminalLog();
        window.globalMessageCooldown = 600;
        messageAddedThisFrame = true;
    }

    drawMouseWave(sketch);
};

// Реакция на движение мыши
window.observeParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 600;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) return;
    if (window.globalMessageCooldown <= 0) {
        window.terminalMessages.push(getRandomMessage('mouseInfluence'));
        window.updateTerminalLog();
        window.globalMessageCooldown = 600;
    }
    window.mouseWave.x = mouseX;
    window.mouseWave.y = mouseY;
    window.mouseWave.radius = window.mouseInfluenceRadius;
};

// Реакция на клик
window.clickParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 600;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) return;
    let messageAddedThisFrame = false;
    window.particles.forEach(function(p, i) {
        try {
            let dx = mouseX - p.x;
            let dy = mouseY - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let state = window.quantumStates[i];
            let pulse = 1 + 0.2 * Math.sin(p.pulsePhase + p.spin * Math.PI);

            if (distance < window.mouseInfluenceRadius && distance > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                if (!p.collapsed) {
                    p.collapsed = true;
                    state.a = 180;
                    p.size = 2.5 * pulse;
                    p.uncertaintyRadius = 2;
                    state.wavePacketAlpha = 0;
                    p.shape = ['ellipse', 'soft-ribbon', 'bio-cluster'][Math.floor(Math.random() * 3)];
                    p.spin = Math.random() < 0.5 ? 0.5 : -0.5;
                    sketch.fill(204, 51, 51, 80);
                    sketch.ellipse(p.x, p.y, 8 * pulse, 8 * pulse);
                    sketch.noFill();
                    sketch.stroke(204, 51, 51, 40);
                    sketch.strokeWeight(0.4);
                    sketch.ellipse(p.x, p.y, 20, 20);
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape, spin: p.spin.toFixed(1) }));
                    window.updateTerminalLog();
                    if (typeof window.playArpeggio === 'function') {
                        window.playArpeggio(p.shape);
                    }
                    window.globalMessageCooldown = 600;
                    messageAddedThisFrame = true;
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    p.pulsePhase = Math.random() * 2 * Math.PI;
                    p.spin = Math.random() < 0.5 ? 0.5 : -0.5;
                    state.a = 180;
                    state.wavePacketAlpha = 40;
                    p.uncertaintyRadius = 5;
                    p.size = 1.6 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * 1.2) * pulse;
                    window.terminalMessages.push(getRandomMessage('superpositionRestore', { spin: p.spin.toFixed(1) }));
                    window.updateTerminalLog();
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['E4'] || 329.63;
                        window.playNote(freq, 'sine', 0.2, 0.15);
                    }
                    window.globalMessageCooldown = 600;
                    messageAddedThisFrame = true;
                }
            }
        } catch (error) {
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 600;
                messageAddedThisFrame = true;
            }
        }
    });
};
