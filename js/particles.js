console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;
window.phaseTimer = 0;
window.globalPhase = 'chaos'; // Фазы: chaos, clustering, synchronization, wavefront
window.noiseCache = [];
window.lastNoiseUpdate = 0;
window.frameTimes = [];
window.interferenceCount = 0;

// Сообщения
const messages = {
    initialize: [
        "Инициализация биоквантовой экосистемы портрета.",
        "Формирование квантовой биосетки.",
        "Запуск квантовой биодекомпозиции."
    ],
    initializeSuccess: [
        "Экосистема активна: ${validParticles} биоквантов.",
        "Успешно оживлено: ${validParticles} состояний.",
        "Портрет трансформирован в ${validParticles} квантов."
    ],
    initializeError: [
        "Ошибка: биоквантовая сетка не сформирована.",
        "Не удалось оживить систему. Требуется изображение.",
        "Аномалия: данные изображения не пригодны."
    ],
    update: [
        "Биоквантовая экосистема в фазе ${phase}.",
        "Кванты текут в квантовом поле.",
        "Эволюция: биоквантовый танец."
    ],
    decomposition: [
        "Декомпозиция портрета: прозрачность ${imgAlpha}/255.",
        "Изображение растворяется в биоквантовом потоке.",
        "Переход в квантовую биосреду: ${imgAlpha}/255."
    ],
    blockFormation: [
        "Пиксели сливаются в биокластеры формы ${shape}.",
        "Формирование живых блоков.",
        "Квантовая биология: форма ${shape}."
    ],
    stabilized: [
        "Биоквантовая экосистема стабилизирована.",
        "Квантовые состояния синхронизированы.",
        "Кванты в бесконечном танце."
    ],
    scatter: [
        "Кванты текут, как микроорганизмы.",
        "Биоквантовая система формирует узоры.",
        "Органическое рассеяние квантов."
    ],
    superposition: [
        "Квант в суперпозиции: форма ${shape}, спин ${spin}.",
        "Биоквантовая суперпозиция: ${shape}.",
        "Квант в суперпозиции: спин ${spin}."
    ],
    mouseInfluence: [
        "Наблюдение возмущает биокванты.",
        "Волновой пакет меняет биопотоки.",
        "Квантовое воздействие активировано."
    ],
    featureAttraction: [
        "Кванты текут к ключевым точкам.",
        "Биоквантовая структура формируется.",
        "Кванты пульсируют у координат."
    ],
    interference: [
        "Квантовая интерференция создаёт узоры.",
        "Волновые функции текут, как мембраны.",
        "Интерференция формирует связи."
    ],
    tunneling: [
        "Квант со спином ${spin} мигрировал.",
        "Биоквантовая миграция: новое состояние.",
        "Квант туннелировал, как клетка."
    ],
    entanglement: [
        "Запутанные кванты пульсируют синхронно.",
        "Квантовая нелокальность: спины связаны.",
        "Запутанность создаёт корреляцию."
    ],
    globalEntanglement: [
        "Глобальная запутанность: синхронизация.",
        "Экосистема в глобальной корреляции.",
        "Нелокальная гармония активирована."
    ],
    wavefront: [
        "Глобальный волновой фронт оживляет систему.",
        "Кванты текут, как волна в биосреде.",
        "Волновой всплеск синхронизирует."
    ],
    phaseTransition: [
        "Фазовый переход: фаза ${phase}.",
        "Биоквантовая эволюция: ${phase}.",
        "Экосистема в фазе ${phase}."
    ],
    precession: [
        "Спиновая прецессия кванта ${index}.",
        "Квант ${index} прецессирует.",
        "Биоквант ${index} меняет ритм."
    ],
    diffusion: [
        "Квант ${index} диффундирует.",
        "Биоквантовая диффузия: ${index}.",
        "Квант ${index} расширяет функцию."
    ],
    decoherence: [
        "Квант ${index} потерял когерентность.",
        "Биоквант ${index} стабилизировался.",
        "Декогеренция: квант ${index}."
    ],
    decoherenceRestore: [
        "Квант ${index} восстановил когерентность.",
        "Биоквант ${index} ожил.",
        "Квант ${index} вернулся к квантовости."
    ],
    error: [
        "Ошибка: квант ${index} не обновлён.",
        "Аномалия: спин кванта ${index}.",
        "Биоквантовая ошибка: ${index}."
    ]
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

// Обновление терминального лога
window.updateTerminalLog = function() {
    const maxMessages = 10;
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

// Инициализация частиц
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
    window.phaseTimer = 0;
    window.globalPhase = 'chaos';
    window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
    window.globalMessageCooldown = 0;
    window.noiseCache = [];
    window.lastNoiseUpdate = 0;
    window.frameTimes = [];

    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty or not loaded');
            window.terminalMessages.push(getRandomMessage('initializeError'));
            window.updateTerminalLog();
            return;
        }

        const pixelSize = 10; // Увеличено с 5
        const blockSize = 20;
        const numParticles = Math.floor((img.width * img.height) / (pixelSize * pixelSize));
        let validParticles = 0;

        const faceFeatures = [
            { x: img.width * 0.35, y: img.height * 0.3, weight: 0.25 },
            { x: img.width * 0.65, y: img.height * 0.3, weight: 0.25 },
            { x: img.width * 0.5, y: img.height * 0.5, weight: 0.15 },
            { x: img.width * 0.5, y: img.height * 0.7, weight: 0.15 }
        ];

        // Создание пространственной сетки
        const gridSize = 40;
        const grid = {};
        for (let y = 0; y < img.height; y += pixelSize) {
            for (let x = 0; x < img.width; x += pixelSize) {
                const index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
                const r = img.pixels[index] || 0;
                const g = img.pixels[index + 1] || 0;
                const b = img.pixels[index + 2] || 0;
                const a = img.pixels[index + 3] || 255;
                const brightness = (r + g + b) / 3;

                if (brightness > 50 && Math.random() < 0.1) { // Уменьшено с 0.15
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
                        size: pixelSize,
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
                        uncertaintyRadius: 5,
                        gridX: Math.floor((x * 400 / img.width) / gridSize),
                        gridY: Math.floor((y * 400 / img.height) / gridSize)
                    };

                    window.particles.push(particle);
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

                    const gridKey = `${particle.gridX},${particle.gridY}`;
                    if (!grid[gridKey]) grid[gridKey] = [];
                    grid[gridKey].push(window.particles.length - 1);
                }
            }
        }

        window.grid = grid;
        console.log('Initialized ' + window.particles.length + ' particles, valid: ' + validParticles);
        window.terminalMessages.push(getRandomMessage('initializeSuccess', { validParticles }));
        window.updateTerminalLog();
        if (typeof window.playInitialization === 'function') {
            window.playInitialization();
        }
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

// Отрисовка волнового пакета
function drawWavePacket(sketch, x, y, uncertaintyRadius, r, g, b, wavePacketAlpha) {
    sketch.noStroke();
    let gradient = sketch.drawingContext.createRadialGradient(
        x, y, 0,
        x, y, uncertaintyRadius
    );
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${wavePacketAlpha / 255})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    sketch.drawingContext.fillStyle = gradient;
    sketch.ellipse(x, y, uncertaintyRadius * 2, uncertaintyRadius * 2);
}

// Отрисовка форм
function drawShape(sketch, x, y, size, shape, rotation, spin, spinPhase, r, g, b, a, featureWeight, pulse) {
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
        sketch.bezierVertex(
            -size * 0.4 * stretch * pulse, size * 0.3 * pulse,
            size * 0.4 * stretch * pulse, size * 0.3 * pulse,
            size * 1.0 * stretch * pulse, size * 0.15 * pulse
        );
        sketch.bezierVertex(
            size * 0.4 * stretch * pulse, -size * 0.3 * pulse,
            -size * 0.4 * stretch * pulse, -size * 0.3 * pulse,
            -size * 1.0 * stretch * pulse, -size * 0.15 * pulse
        );
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'bio-cluster') {
        for (let i = 0; i < 3; i++) { // Уменьшено с 5
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
    let gradient = sketch.drawingContext.createRadialGradient(
        window.mouseWave.x, window.mouseWave.y, 0,
        window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius
    );
    gradient.addColorStop(0, 'rgba(209, 209, 230, 0.1)'); // Уменьшено с 0.15
    gradient.addColorStop(1, 'rgba(209, 209, 230, 0)');
    sketch.drawingContext.strokeStyle = gradient;
    sketch.strokeWeight(0.6); // Уменьшено с 0.8
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2);

    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 30 * (1 - i / window.mouseWave.trail.length); // Уменьшено с 40
        sketch.stroke(209, 209, 230, alpha);
        sketch.ellipse(point.x, point.y, window.mouseWave.radius * 0.4);
    });
}

// Обновление частиц
window.updateParticles = function(sketch) {
    if (!window.quantumSketch || !window.particles || window.particles.length === 0) {
        console.error('Cannot update particles: quantumSketch: ' + !!window.quantumSketch + ', particlesLength: ' + (window.particles ? window.particles.length : 0));
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

    // Проверка FPS
    const now = performance.now();
    window.frameTimes.push(now);
    if (window.frameTimes.length > 30) window.frameTimes.shift();
    if (window.frameTimes.length >= 30) {
        const fps = 1000 / ((window.frameTimes[window.frameTimes.length - 1] - window.frameTimes[0]) / (window.frameTimes.length - 1));
        if (fps < 30 && window.particles.length > 100) {
            window.particles = window.particles.slice(0, Math.floor(window.particles.length * 0.8));
            window.quantumStates = window.quantumStates.slice(0, Math.floor(window.quantumStates.length * 0.8));
            console.log('Reduced particles to ' + window.particles.length + ' due to low FPS: ' + fps.toFixed(1));
        }
    }

    console.log('updateParticles called, particles: ' + window.particles.length + ', currentStep: ' + window.currentStep + ', phase: ' + window.globalPhase);
    let messageAddedThisFrame = false;
    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('update', { phase: window.globalPhase }));
        window.updateTerminalLog();
        window.globalMessageCooldown = 300;
        messageAddedThisFrame = true;
    }
    window.globalMessageCooldown--;
    window.frame = window.frame || 0;
    window.frame++;
    window.phaseTimer += 0.015;
    window.interferenceCount = 0;

    // Кэширование шума
    if (window.frame - window.lastNoiseUpdate >= 10) {
        window.noiseCache = [];
        for (let i = 0; i < window.particles.length; i++) {
            const p = window.particles[i];
            window.noiseCache[i] = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.008);
        }
        window.lastNoiseUpdate = window.frame;
    }

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

    // Декомпозиция (шаг 4)
    if (window.currentStep === 4 && window.decompositionTimer < 12) {
        window.decompositionTimer += 0.015;
        if (window.img) {
            var imgAlpha = Math.max(0, 255 * (1 - window.decompositionTimer / 4));
            sketch.tint(255, imgAlpha);
            sketch.image(window.img, 0, 0, 400, 400);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('decomposition', { imgAlpha: imgAlpha.toFixed(0) }));
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
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 0.4);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 8) window.mouseWave.trail.shift();
    }

    // Формирование кластеров
    const blocks = {};
    const clusters = {};
    if (window.globalPhase === 'clustering') {
        window.particles.forEach(p => {
            if (!p.clusterId) {
                p.clusterId = Math.floor(Math.random() * 20); // Уменьшено с 50
            }
            if (!clusters[p.clusterId]) {
                clusters[p.clusterId] = [];
            }
            clusters[p.clusterId].push(p);
        });
    } else {
        window.particles.forEach(p => {
            p.clusterId = null;
            if (!blocks[p.blockId]) {
                blocks[p.blockId] = [];
            }
            blocks[p.blockId].push(p);
        });
    }

    // Обновление сетки
    const grid = {};
    window.particles.forEach((p, i) => {
        p.gridX = Math.floor(p.x / 40);
        p.gridY = Math.floor(p.y / 40);
        const gridKey = `${p.gridX},${p.gridY}`;
        if (!grid[gridKey]) grid[gridKey] = [];
        grid[gridKey].push(i);
    });

    let potentialMessages = [];
    let globalEntanglement = Math.random() < 0.001 && window.currentStep === 5; // Уменьшено с 0.002
    let wavefrontEvent = Math.random() < 0.0005 && window.currentStep === 5 && window.globalPhase === 'wavefront'; // Уменьшено с 0.001

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];
            var pulse = 1 + 0.2 * Math.sin(p.pulsePhase + p.spin * Math.PI);
            p.pulsePhase += 0.05 * (1 + Math.abs(p.spin) * 0.3);
            p.spinPhase += 0.02;

            // Неопределённость и диффузия
            var speed = Math.sqrt(p.velocityX * p.velocityX + p.velocityY * p.velocityY);
            p.uncertaintyRadius = 5 + speed * 8 + 3 * Math.sin(p.pulsePhase); // Уменьшено с 10 и 5
            state.wavePacketAlpha = p.collapsed ? 0 : 40 * state.probability * pulse; // Уменьшено с 50

            // Декогеренция
            if (!p.collapsed && window.decompositionTimer >= 8) {
                state.decoherenceTimer += 0.01;
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
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.015);
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
                        p.size = 7 * pulse;
                        if (Math.random() < 0.007 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            potentialMessages.push({ type: 'blockFormation', params: { shape: p.shape } });
                        }
                    }
                } else {
                    p.shape = ['ellipse', 'soft-ribbon', 'bio-cluster'][Math.floor(Math.random() * 3)];
                    p.size = (1.8 + 1.2 * (window.noiseCache[i] || 0.5) * state.probability) * (1 + p.featureWeight * 0.3 + Math.abs(p.spin)) * pulse;
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
                p.size = (1.8 + 1.2 * (window.noiseCache[i] || 0.5) * state.probability) * (1 + p.featureWeight * 0.3 + Math.abs(p.spin)) * pulse;

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
                    p.spin = Math.sin(window.phaseTimer * 0.2 + p.x * 0.01 + p.y * 0.01) > 0 ? 0.5 : -0.5; // Уменьшено с 0.1
                } else if (window.globalPhase === 'wavefront' || wavefrontEvent) {
                    p.velocityX += Math.sin(p.x * 0.02 + window.phaseTimer) * 0.5 * pulse;
                    p.velocityY += Math.cos(p.y * 0.02 + window.phaseTimer) * 0.5 * pulse;
                }
            }

            // Биологичное движение
            if (window.decompositionTimer >= 8 || window.currentStep === 5) {
                const n = window.noiseCache[i] || 0.5;
                const bioRhythm = 1 + 0.3 * Math.sin(p.pulsePhase + p.spin);
                p.velocityX += (Math.cos(p.phase + p.spin * Math.PI / 2) * n * window.chaosFactor * 0.4 * bioRhythm - p.velocityX) * 0.04;
                p.velocityY += (Math.sin(p.phase + p.spin * Math.PI / 2) * n * window.chaosFactor * 0.4 * bioRhythm - p.velocityY) * 0.04;
                p.phase += p.frequency * (1 + Math.abs(p.spin) * 0.4);
                if (Math.random() < 0.01) { // Уменьшено с 0.02
                    p.velocityX += (Math.random() - 0.5) * 1.5 * bioRhythm;
                    p.velocityY += (Math.random() - 0.5) * 1.5 * bioRhythm;
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
                var dx = p.x - window.mouseWave.x;
                var dy = p.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
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
                p.uncertaintyRadius = 10; // Уменьшено с 15
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

            // Интерференция
            if (window.decompositionTimer >= 8 || window.currentStep === 5) {
                const gridX = p.gridX;
                const gridY = p.gridY;
                const neighbors = [];
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const key = `${gridX + dx},${gridY + dy}`;
                        if (grid[key]) neighbors.push(...grid[key]);
                    }
                }
                for (let j of neighbors) {
                    if (i !== j && window.interferenceCount < 50) { // Ограничение 50
                        var other = window.particles[j];
                        var dx = p.x - other.x;
                        var dy = p.y - other.y;
                        var distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 80 && p.featureWeight > 0.1 && other.featureWeight > 0.1 && !p.collapsed && !other.collapsed) {
                            var wave = Math.sin(distance * 0.04 + state.interferencePhase + window.frame * 0.015 + p.spin + other.spin);
                            p.velocityX += wave * 0.03 * (window.globalPhase === 'synchronization' ? 4 : 2.5) * pulse;
                            p.velocityY += wave * 0.03 * (window.globalPhase === 'synchronization' ? 4 : 2.5) * pulse;
                            if (Math.random() < 0.0005 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) { // Уменьшено с 0.0007
                                window.interferenceCount++;
                                sketch.push();
                                sketch.noFill();
                                sketch.stroke(63, 22, 127, 40);
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
                }
            }

            // Туннелирование
            if (Math.random() < 0.001 && !p.collapsed && (window.decompositionTimer >= 8 || window.currentStep === 5)) {
                var oldX = p.x, oldY = p.y;
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
                console.log('Particle ' + i + ' tunneled from x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'tunneling', params: { spin: p.spin.toFixed(1) } });
                    if (typeof window.playTunneling === 'function') {
                        const freq = (p.x * p.y) % 380 + 190;
                        window.playTunneling(freq, 0.12, 0.15);
                    }
                }
            } else {
                sketch.noStroke();
            }

            // Запутанность
            if (p.entangledPartner !== null && window.particles[p.entangledPartner] && (window.decompositionTimer >= 8 || window.currentStep === 5)) {
                var partner = window.particles[p.entangledPartner];
                var partnerState = window.quantumStates[p.entangledPartner];
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

            // Отрисовка волнового пакета
            if (!p.collapsed && state.wavePacketAlpha > 0) {
                drawWavePacket(sketch, p.x, p.y, p.uncertaintyRadius, state.r, state.g, state.b, state.wavePacketAlpha);
            }

            // Отрисовка частицы
            if (p.size > 0) {
                sketch.fill(state.r, state.g, state.b, state.a / 7);
                sketch.ellipse(p.x, p.y, p.size + 2 * pulse, p.size + 2 * pulse); // Уменьшено с 3
                drawShape(sketch, p.x, p.y, p.size, p.shape, p.phase, p.spin, p.spinPhase, state.r, state.g, state.b, state.a, p.featureWeight, pulse);
                if (state.tunnelFlash > 0) {
                    sketch.fill(204, 51, 51, state.tunnelFlash * 2.5);
                    sketch.ellipse(p.x, p.y, p.size + 2 * pulse, p.size + 2 * pulse);
                    state.tunnelFlash--;
                }
            }

            // Логирование (только 1 частица)
            if (i === 0) {
                console.log('Particle 0 at x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2) + ', size: ' + (p.size * pulse).toFixed(2) + ', shape: ' + p.shape + ', spin: ' + p.spin.toFixed(1) + ', pulse: ' + pulse.toFixed(2) + ', uncertainty: ' + p.uncertaintyRadius.toFixed(2) + ', phase: ' + window.globalPhase);
            }
        } catch (error) {
            console.error('Error updating particle ' + i + ': ' + error);
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
        window.globalMessageCooldown = 300;
        messageAddedThisFrame = true;
    }

    drawMouseWave(sketch);
};

// Реакция на движение мыши
window.observeParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('observeParticles: No particles or quantum states available');
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

// Реакция на клик
window.clickParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('clickParticles: No particles or quantum states available');
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
    window.particles.forEach(function(p, i) {
        try {
            var dx = mouseX - p.x;
            var dy = mouseY - p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[i];
            var pulse = 1 + 0.2 * Math.sin(p.pulsePhase + p.spin * Math.PI);

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
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape + ', spin: ' + p.spin.toFixed(1) + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape, spin: p.spin.toFixed(1) }));
                    window.updateTerminalLog();
                    if (typeof window.playArpeggio === 'function') {
                        window.playArpeggio(p.shape);
                    }
                    window.globalMessageCooldown = 300;
                    messageAddedThisFrame = true;
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    p.pulsePhase = Math.random() * 2 * Math.PI;
                    p.spin = Math.random() < 0.5 ? 0.5 : -0.5;
                    state.a = 180;
                    state.wavePacketAlpha = 40;
                    p.uncertaintyRadius = 5;
                    p.size = 1.8 + (window.noiseCache[i] || 0.5) * 1.2 * pulse;
                    console.log('Particle ' + i + ' restored to superposition, shape: ' + p.shape + ', spin: ' + p.spin.toFixed(1) + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('superpositionRestore', { spin: p.spin.toFixed(1) }));
                    window.updateTerminalLog();
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['E4'] || 329.63;
                        window.playNote(freq, 'sine', 0.2, 0.15);
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
    });
};
