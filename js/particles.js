console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;
window.phaseTimer = 0;
window.evolutionTimer = 0;
window.globalPhase = 'chaos';
window.grid = [];

const messages = {
    initialize: [
        "Инициализация биоквантовой экосистемы портрета.",
        "Формирование квантовой биосетки. Пиксели оживают.",
        "Запуск квантовой биодекомпозиции."
    ],
    initializeSuccess: [
        "Экосистема активна: ${validParticles} квантовых состояний.",
        "Успешно оживлено: ${validParticles} биоквантов.",
        "Портрет трансформирован в ${validParticles} состояний."
    ],
    initializeError: [
        "Ошибка: биоквантовая сетка не сформирована.",
        "Не удалось оживить систему. Требуется изображение.",
        "Аномалия: данные изображения не пригодны."
    ],
    update: [
        "Биоквантовая экосистема пульсирует в фазе ${phase}.",
        "Кванты текут в живом квантовом поле.",
        "Эволюция: кванты создают биоквантовый танец."
    ],
    decomposition: [
        "Декомпозиция портрета: прозрачность ${imgAlpha}/255.",
        "Изображение растворяется в биоквантовом потоке.",
        "Переход в квантовую биосреду: ${imgAlpha}/255."
    ],
    blockFormation: [
        "Пиксели сливаются в биокластеры формы ${shape}.",
        "Формирование живых блоков: текстура оживает.",
        "Квантовая биология: пиксели образуют ${shape}."
    ],
    stabilized: [
        "Биоквантовая экосистема стабилизирована.",
        "Органические квантовые состояния синхронизированы.",
        "Кванты живут в бесконечном квантовом танце."
    ],
    scatter: [
        "Кванты текут, как микроорганизмы в биосреде.",
        "Биоквантовая система: спины формируют узоры.",
        "Органическое рассеяние квантов."
    ],
    superposition: [
        "Квант в суперпозиции: форма ${shape}, спин ${spin}.",
        "Биоквантовая суперпозиция: живая форма ${shape}.",
        "Квант живёт в суперпозиции: спин ${spin}."
    ],
    mouseInfluence: [
        "Наблюдение возмущает биокванты, изменяя спины.",
        "Волновой пакет наблюдателя оживляет кванты.",
        "Квантовое воздействие меняет биопотоки."
    ],
    featureAttraction: [
        "Кванты текут к ключевым точкам, как клетки.",
        "Биоквантовая структура формируется у лица.",
        "Кванты пульсируют у ключевых координат."
    ],
    interference: [
        "Квантовая интерференция создаёт живые узоры.",
        "Волновые функции текут, как мембраны.",
        "Интерференция формирует биоквантовые связи."
    ],
    tunneling: [
        "Квант со спином ${spin} мигрировал через барьер.",
        "Биоквантовая миграция: квант ожил в новом состоянии.",
        "Квант туннелировал, как живая клетка."
    ],
    entanglement: [
        "Запутанные кванты пульсируют синхронно.",
        "Квантовая нелокальность: спины связаны.",
        "Запутанность создаёт живую корреляцию."
    ],
    globalEntanglement: [
        "Глобальная запутанность: кванты синхронизированы.",
        "Экосистема вошла в состояние глобальной корреляции.",
        "Нелокальная гармония квантов активирована."
    ],
    wavefront: [
        "Глобальный волновой фронт оживляет экосистему.",
        "Кванты текут, как волна в биосреде.",
        "Волновой всплеск синхронизирует кванты."
    ],
    phaseTransition: [
        "Квантовый фазовый переход: система в фазе ${phase}.",
        "Биоквантовая эволюция: переход к ${phase}.",
        "Экосистема трансформируется в фазу ${phase}."
    ],
    precession: [
        "Спиновая прецессия кванта ${index}: ритм изменён.",
        "Квант ${index} прецессирует, как живая структура.",
        "Биоквант ${index} меняет спиновый ритм."
    ],
    diffusion: [
        "Квант ${index} диффундирует в биосреде.",
        "Биоквантовая диффузия: квант ${index} расплывается.",
        "Квант ${index} расширяет волновую функцию."
    ],
    decoherence: [
        "Квант ${index} потерял когерентность.",
        "Биоквант ${index} стабилизировался из-за декогеренции.",
        "Декогеренция: квант ${index} утратил квантовые свойства."
    ],
    decoherenceRestore: [
        "Квант ${index} восстановил квантовую когерентность.",
        "Биоквант ${index} ожил в суперпозиции.",
        "Квант ${index} вернулся к квантовой жизни."
    ],
    error: [
        "Ошибка в биоквантовой системе: квант ${index} не обновлён.",
        "Аномалия: спин кванта ${index} не изменился.",
        "Биоквантовая ошибка: квант ${index} не ожил."
    ],
    collapse: [
        "Квант ${index} коллапсировал в форму ${shape}.",
        "Биоквант ${index} зафиксирован, спин: ${spin}.",
        "Коллапс волновой функции кванта ${index}."
    ],
    superpositionRestore: [
        "Квант ${index} вернулся в суперпозицию, спин: ${spin}.",
        "Биоквант ${index} ожил в квантовом поле.",
        "Квант ${index} восстановил волновую функцию."
    ],
    quantumPulse: [
        "Квантовый импульс оживил экосистему!",
        "Система пульсирует в биоквантовой гармонии.",
        "Глобальный импульс синхронизировал кванты."
    ],
    entanglementCascade: [
        "Каскад запутанности связал кванты в сеть.",
        "Биоквантовая сеть ожила в нелокальности.",
        "Кванты запутались в глобальной гармонии."
    ],
    echoWave: [
        "Эхо-волна прошла через биоквантовую систему.",
        "Кванты синхронизированы волной наблюдения.",
        "Эхо-волна оживила квантовое поле."
    ],
    teleportation: [
        "Квант ${index} телепортирован к партнёру ${partner}.",
        "Биоквантовая телепортация: состояние передано.",
        "Нелокальная передача кванта ${index}."
    ],
    pauliExclusion: [
        "Запрет Паули: кванты ${index} и ${other} отталкиваются.",
        "Биокванты ${index} и ${other} не могут сосуществовать.",
        "Кванты ${index} и ${other} разделили состояния."
    ]
};

function getRandomMessage(type, params = {}) {
    let msgArray = messages[type];
    let msg = msgArray[Math.floor(Math.random() * msgArray.length)];
    for (let key in params) {
        msg = msg.replace(`\${${key}}`, params[key]);
    }
    return `[${new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${msg}`;
}

window.updateTerminalLog = function() {
    const maxMessages = 10;
    while (window.terminalMessages.length > maxMessages) {
        window.terminalMessages.shift();
    }
    const terminalDiv = document.getElementById(`terminal-log-step-${window.currentStep}`);
    if (terminalDiv) {
        terminalDiv.innerHTML = window.terminalMessages.map(msg => 
            `<div class="${msg.includes('туннелировал') || msg.includes('мигрировал') ? 'tunneling' : msg.includes('интерференция') ? 'interference' : msg.includes('запутанность') || msg.includes('нелокальность') || msg.includes('каскад') ? 'entanglement' : msg.includes('импульс') || msg.includes('эхо-волна') ? 'quantum-pulse' : msg.includes('телепортирован') ? 'teleportation' : msg.includes('Паули') ? 'pauli' : ''}">${msg}</div>`
        ).join('');
    }
};

function createGrid() {
    window.grid = [];
    const gridSize = 80;
    const gridWidth = Math.ceil(400 / gridSize);
    const gridHeight = Math.ceil(400 / gridSize);
    for (let i = 0; i < gridWidth * gridHeight; i++) {
        window.grid[i] = [];
    }
    window.particles.forEach((p, i) => {
        const gridX = Math.floor(p.x / gridSize);
        const gridY = Math.floor(p.y / gridSize);
        const gridIndex = gridY * gridWidth + gridX;
        if (gridIndex >= 0 && gridIndex < window.grid.length) {
            window.grid[gridIndex].push(i);
        }
    });
}

function getNeighbors(p, i, gridSize = 80) {
    const gridWidth = Math.ceil(400 / gridSize);
    const gridX = Math.floor(p.x / gridSize);
    const gridY = Math.floor(p.y / gridSize);
    let neighbors = [];
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const nx = gridX + dx;
            const ny = gridY + dy;
            const gridIndex = ny * gridWidth + nx;
            if (gridIndex >= 0 && gridIndex < window.grid.length) {
                neighbors = neighbors.concat(window.grid[gridIndex]);
            }
        }
    }
    return neighbors;
}

function drawWavePacket(sketch, x, y, uncertaintyRadius, r, g, b, wavePacketAlpha) {
    sketch.noStroke();
    let gradient = sketch.drawingContext.createRadialGradient(
        x, y, 0,
        x, y, uncertaintyRadius
    );
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${wavePacketAlpha})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    sketch.drawingContext.fillStyle = gradient;
    sketch.ellipse(x, y, uncertaintyRadius * 2, uncertaintyRadius * 2);
}

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
        for (let i = 0; i < 5; i++) {
            let dx = (Math.sin(i * Math.PI / 2.5 + spin + pulse + spinPhase) * size * 0.3);
            let dy = (Math.cos(i * Math.PI / 2.5 + spin + pulse + spinPhase) * size * 0.3);
            sketch.ellipse(dx, dy, size * 0.2 * (1 + Math.abs(spin)) * pulse, size * 0.2 * pulse);
        }
    } else if (shape === 'neural-cluster') {
        sketch.beginShape();
        for (let i = 0; i < 4; i++) {
            let angle = i * Math.PI / 2 + spinPhase + spin;
            let dx = Math.cos(angle) * size * 0.5 * pulse;
            let dy = Math.sin(angle) * size * 0.5 * pulse;
            sketch.vertex(dx, dy);
            sketch.ellipse(dx, dy, size * 0.15 * (1 + Math.abs(spin)) * pulse, size * 0.15 * pulse);
        }
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'superposed') {
        const shapes = ['ellipse', 'soft-ribbon', 'bio-cluster', 'neural-cluster'];
        const shapeIndex = Math.floor((window.frame % 6) / 1.5); // Переключение каждые 0.1с
        const currentShape = shapes[shapeIndex];
        if (currentShape === 'ellipse') {
            sketch.ellipse(0, 0, size * 1.2 * (1 + featureWeight + Math.abs(spin)) * pulse, size * 0.6 * pulse);
        } else if (currentShape === 'soft-ribbon') {
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
        } else if (currentShape === 'bio-cluster') {
            for (let i = 0; i < 5; i++) {
                let dx = (Math.sin(i * Math.PI / 2.5 + spin + pulse + spinPhase) * size * 0.3);
                let dy = (Math.cos(i * Math.PI / 2.5 + spin + pulse + spinPhase) * size * 0.3);
                sketch.ellipse(dx, dy, size * 0.2 * (1 + Math.abs(spin)) * pulse, size * 0.2 * pulse);
            }
        } else if (currentShape === 'neural-cluster') {
            sketch.beginShape();
            for (let i = 0; i < 4; i++) {
                let angle = i * Math.PI / 2 + spinPhase + spin;
                let dx = Math.cos(angle) * size * 0.5 * pulse;
                let dy = Math.sin(angle) * size * 0.5 * pulse;
                sketch.vertex(dx, dy);
                sketch.ellipse(dx, dy, size * 0.15 * (1 + Math.abs(spin)) * pulse, size * 0.15 * pulse);
            }
            sketch.endShape(sketch.CLOSE);
        }
    }
    sketch.pop();
}

function drawMouseWave(sketch) {
    if (window.currentStep !== 4 && window.currentStep !== 5 || window.mouseWave.radius <= 0) return;
    sketch.noFill();
    let gradient = sketch.drawingContext.createRadialGradient(
        window.mouseWave.x, window.mouseWave.y, 0,
        window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius
    );
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
    window.evolutionTimer = 0;
    window.globalPhase = 'chaos';
    window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
    window.globalMessageCooldown = 0;
    window.grid = [];

    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty or not loaded');
            window.terminalMessages.push(getRandomMessage('initializeError'));
            window.updateTerminalLog();
            return;
        }

        const pixelSize = 7;
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
                const a = img.pixels[index + 3] || 255;
                const brightness = (r + g + b) / 3;

                if (brightness > 60 || Math.random() < 0.2) {
                    const useFeature = Math.random() < 0.5;
                    let featureWeight = 0.1;
                    if (useFeature) {
                        const feature = faceFeatures.find(f => Math.abs(f.x - x) < img.width * 0.1 && Math.abs(f.y - y) < img.height * 0.1);
                        featureWeight = feature ? feature.weight : 0.1;
                    }

                    const shape = Math.random() < 0.1 ? 'superposed' : 'pixel';

                    window.particles.push({
                        x: x * 400 / img.width,
                        y: y * 400 / img.height,
                        baseX: x * 400 / img.width,
                        baseY: y * 400 / img.height,
                        velocityX: 0,
                        velocityY: 0,
                        size: pixelSize * 1.2,
                        phase: Math.random() * 2 * Math.PI,
                        frequency: 0.007,
                        spin: Math.random() < 0.5 ? 0.5 : -0.5,
                        spinPhase: Math.random() * 2 * Math.PI,
                        entangledPartner: Math.random() < 0.1 ? Math.floor(Math.random() * numParticles) : null,
                        collapsed: false,
                        decompositionProgress: 0,
                        shape: shape,
                        featureWeight: featureWeight,
                        blockId: Math.floor(x / blockSize) + Math.floor(y / blockSize) * Math.floor(img.width / blockSize),
                        clusterId: null,
                        pulsePhase: Math.random() * 2 * Math.PI,
                        uncertaintyRadius: 6
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
                        entanglementFlash: 0,
                        wavePacketAlpha: 0,
                        pauliFlash: 0
                    });
                    validParticles++;
                }
            }
        }

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

window.updateParticles = function(sketch) {
    if (!window.quantumSketch || !window.particles || window.particles.length === 0) {
        console.error('Cannot update particles: quantumSketch: ' + !!window.quantumSketch + ', particlesLength: ' + (window.particles ? window.particles.length : 0));
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 200;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('updateParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    let messageAddedThisFrame = false;
    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('update', { phase: window.globalPhase }));
        window.updateTerminalLog();
        window.globalMessageCooldown = 200;
        messageAddedThisFrame = true;
    }
    window.globalMessageCooldown--;
    window.frame = window.frame || 0;
    window.frame++;
    window.phaseTimer += 0.015;
    window.evolutionTimer += 0.015;

    if (window.globalPhase === 'singularity') {
        let gradient = sketch.drawingContext.createRadialGradient(
            200, 200, 0,
            200, 200, 400
        );
        gradient.addColorStop(0, 'rgba(63, 22, 127, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        sketch.drawingContext.fillStyle = gradient;
        sketch.rect(0, 0, 400, 400);
    }

    if (window.currentStep === 5) {
        const epoch = Math.floor(window.evolutionTimer / 120);
        const phaseDuration = 30 - epoch * 2;
        const phases = [
            { time: phaseDuration * 0, phase: 'chaos', name: 'хаос' },
            { time: phaseDuration * 1, phase: 'clustering', name: 'кластеризация' },
            { time: phaseDuration * 2, phase: 'synchronization', name: 'синхронизация' },
            { time: phaseDuration * 3, phase: 'wavefront', name: 'волновой фронт' },
            { time: phaseDuration * 4, phase: 'coalescence', name: 'слияние' },
            { time: phaseDuration * 5, phase: 'fractal collapse', name: 'фрактальный коллапс' },
            { time: phaseDuration * 6, phase: 'singularity', name: 'сингулярность' }
        ];
        const currentPhase = phases.find(p => window.phaseTimer < p.time + phaseDuration) || phases[0];
        if (window.globalPhase !== currentPhase.phase) {
            window.globalPhase = currentPhase.phase;
            window.terminalMessages.push(getRandomMessage('phaseTransition', { phase: currentPhase.name }));
            window.updateTerminalLog();
            if (currentPhase.phase === 'singularity' && typeof window.playNote === 'function') {
                window.playNote(110, 'sine', 0.4, 0.3);
            }
        }
        if (window.phaseTimer > phaseDuration * 7) {
            window.phaseTimer = 0;
        }
    }

    if (window.currentStep === 4 && window.decompositionTimer < 12) {
        window.decompositionTimer += 0.015;
        if (window.img) {
            var imgAlpha = Math.max(0, 255 * (1 - window.decompositionTimer / 4));
            sketch.tint(255, imgAlpha);
            sketch.image(window.img, 0, 0, 400, 400);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('decomposition', { imgAlpha: imgAlpha.toFixed(0) }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 200;
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
            window.globalMessageCooldown = 200;
            messageAddedThisFrame = true;
        }
    }

    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 0.4);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 8) window.mouseWave.trail.shift();
    }

    const blocks = {};
    const clusters = {};
    if (window.globalPhase === 'clustering' || window.globalPhase === 'coalescence') {
        window.particles.forEach(p => {
            if (!p.clusterId) {
                p.clusterId = Math.floor(Math.random() * 50);
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

    createGrid();

    let potentialMessages = [];
    let globalEntanglement = Math.random() < 0.002 && window.currentStep === 5;
    let wavefrontEvent = Math.random() < 0.001 && window.currentStep === 5 && window.globalPhase === 'wavefront';
    let quantumPulse = Math.random() < 0.0005 && window.currentStep === 5;
    let entanglementCascade = Math.random() < 0.0003 && window.currentStep === 5;
    let teleportationEvent = Math.random() < 0.0004 && window.currentStep === 5;

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];
            const epoch = Math.floor(window.evolutionTimer / 120);
            var pulse = 1 + (0.2 + epoch * 0.07) * Math.sin(p.pulsePhase + p.spin * Math.PI);
            p.pulsePhase += 0.05 * (1 + Math.abs(p.spin) * 0.3);
            p.spinPhase += 0.02;

            var speed = Math.sqrt(p.velocityX * p.velocityX + p.velocityY * p.velocityY);
            p.uncertaintyRadius = 6 + speed * 10 + 5 * Math.sin(p.pulsePhase);
            state.wavePacketAlpha = p.collapsed ? 0 : 50 * state.probability * pulse;

            if (!p.collapsed && window.decompositionTimer >= 8) {
                state.decoherenceTimer += 0.01;
                if (state.decoherenceTimer > 100 && Math.random() < 0.003) {
                    p.collapsed = true;
                    state.probability = 0.3;
                    state.wavePacketAlpha = 0;
                    p.size = 2;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'decoherence', params: { index: i } });
                    }
                } else if (state.decoherenceTimer > 100 && Math.random() < 0.003) {
                    p.collapsed = false;
                    state.probability = 1.0;
                    state.decoherenceTimer = 0;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'decoherenceRestore', params: { index: i } });
                    }
                }
            }

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
                    p.shape = Math.random() < (window.globalPhase === 'synchronization' ? 0.5 : 0.2) ? 'superposed' : ['ellipse', 'soft-ribbon', 'bio-cluster', 'neural-cluster'][Math.floor(Math.random() * 4)];
                    p.size = (1.8 + 1.2 * sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * state.probability) * (1 + p.featureWeight * 0.3 + Math.abs(p.spin)) * pulse;
                    if (Math.random() < 0.01 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        p.shape = Math.random() < (window.globalPhase === 'synchronization' ? 0.5 : 0.2) ? 'superposed' : ['ellipse', 'soft-ribbon', 'bio-cluster', 'neural-cluster'][Math.floor(Math.random() * 4)];
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
                p.shape = Math.random() < (window.globalPhase === 'synchronization' ? 0.5 : 0.2) ? 'superposed' : ['ellipse', 'soft-ribbon', 'bio-cluster', 'neural-cluster'][Math.floor(Math.random() * 4)];
                p.size = (1.8 + 1.2 * sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * state.probability) * (1 + p.featureWeight * 0.3 + Math.abs(p.spin)) * pulse;

                if (window.globalPhase === 'clustering' || window.globalPhase === 'coalescence') {
                    const cluster = clusters[p.clusterId];
                    if (cluster && cluster.length > 0) {
                        const centerX = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length;
                        const centerY = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length;
                        p.velocityX += (centerX - p.x) * (window.globalPhase === 'coalescence' ? 0.05 : 0.03);
                        p.velocityY += (centerY - p.y) * (window.globalPhase === 'coalescence' ? 0.05 : 0.03);
                        if (window.globalPhase === 'coalescence') {
                            p.size = 10 * pulse;
                            p.shape = Math.random() < 0.7 ? 'neural-cluster' : 'bio-cluster';
                        }
                    }
                } else if (window.globalPhase === 'synchronization') {
                    p.spin = Math.sin(window.phaseTimer * 0.1 + p.x * 0.01 + p.y * 0.01) > 0 ? 0.5 : -0.5;
                } else if (window.globalPhase === 'wavefront' || wavefrontEvent) {
                    p.velocityX += Math.sin(p.x * 0.02 + window.phaseTimer) * 0.5 * pulse;
                    p.velocityY += Math.cos(p.y * 0.02 + window.phaseTimer) * 0.5 * pulse;
                } else if (window.globalPhase === 'fractal collapse') {
                    p.uncertaintyRadius = 3;
                    p.velocityX += Math.sin(p.x * 0.05 + p.y * 0.05 + window.phaseTimer) * 0.3 * pulse;
                    p.velocityY += Math.cos(p.x * 0.05 + p.y * 0.05 + window.phaseTimer) * 0.3 * pulse;
                    if (Math.random() < 0.005) {
                        p.velocityX += (Math.random() - 0.5) * 2 * pulse;
                        p.velocityY += (Math.random() - 0.5) * 2 * pulse;
                    }
                } else if (window.globalPhase === 'singularity') {
                    const centerX = 200, centerY = 200;
                    p.velocityX += (centerX - p.x) * 0.1 * pulse;
                    p.velocityY += (centerY - p.y) * 0.1 * pulse;
                    p.size = 12 * pulse;
                    state.wavePacketAlpha = 100 * pulse;
                }
            }

            if (quantumPulse && !p.collapsed) {
                state.wavePacketAlpha = 120 * pulse;
                p.uncertaintyRadius = 15;
                sketch.fill(204, 51, 51, 80);
                sketch.ellipse(p.x, p.y, p.size + 5 * pulse, p.size + 5 * pulse);
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'quantumPulse', params: {} });
                    if (typeof window.playArpeggio === 'function') {
                        window.playArpeggio('quantum-pulse');
                    }
                }
            }

            if (entanglementCascade && !p.collapsed && p.entangledPartner === null) {
                let chainLength = Math.floor(Math.random() * 5) + 3;
                let current = i;
                for (let j = 0; j < chainLength; j++) {
                    let next = Math.floor(Math.random() * window.particles.length);
                    if (next !== current) {
                        window.particles[current].entangledPartner = next;
                        window.quantumStates[current].entanglementFlash = 15;
                        current = next;
                    }
                }
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'entanglementCascade', params: {} });
                    if (typeof window.playNote === 'function') {
                        window.playNote(440, 'sine', 0.3, 0.2);
                    }
                }
            }

            if (teleportationEvent && !p.collapsed && p.entangledPartner !== null && window.particles[p.entangledPartner] && !window.particles[p.entangledPartner].collapsed) {
                let partner = window.particles[p.entangledPartner];
                let partnerState = window.quantumStates[p.entangledPartner];
                partnerState.r = state.r;
                partnerState.g = state.g;
                partnerState.b = state.b;
                partner.shape = p.shape;
                partner.spin = p.spin;
                p.size = 0;
                state.wavePacketAlpha = 0;
                state.a = 0;
                p.collapsed = true;
                sketch.stroke(63, 22, 127, 80);
                sketch.strokeWeight(0.6);
                sketch.line(p.x, p.y, partner.x, partner.y);
                sketch.fill(204, 51, 51, 80);
                sketch.ellipse(p.x, p.y, 10 * pulse, 10 * pulse);
                sketch.ellipse(partner.x, partner.y, 10 * pulse, 10 * pulse);
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'teleportation', params: { index: i, partner: p.entangledPartner } });
                    if (typeof window.playNote === 'function') {
                        window.playNote(330, 'sine', 0.3, 0.2);
                    }
                }
            }

            if (window.decompositionTimer >= 8 || window.currentStep === 5) {
                const n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.008);
                const bioRhythm = 1 + (0.3 + epoch * 0.07) * Math.sin(p.pulsePhase + p.spin);
                p.velocityX += (Math.cos(p.phase + p.spin * Math.PI / 2) * n * window.chaosFactor * 0.4 * bioRhythm - p.velocityX) * 0.04;
                p.velocityY += (Math.sin(p.phase + p.spin * Math.PI / 2) * n * window.chaosFactor * 0.4 * bioRhythm - p.velocityY) * 0.04;
                p.phase += p.frequency * (1 + Math.abs(p.spin) * 0.4);
                if (Math.random() < 0.02) {
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

            if (p.featureWeight > 0.1 && window.decompositionTimer < 8 && window.currentStep === 4 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                p.velocityX += (p.baseX - p.x) * 0.03 * p.featureWeight;
                p.velocityY += (p.baseY - p.y) * 0.03 * p.featureWeight;
                potentialMessages.push({ type: 'featureAttraction', params: {} });
            }

            if (globalEntanglement && !p.collapsed) {
                p.entangledPartner = Math.floor(Math.random() * window.particles.length);
                state.entanglementFlash = 15;
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'globalEntanglement', params: {} });
                }
            }

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

            state.r = Math.min(255, Max.max(0, state.r));
            state.g = Math.min(255, Math.max(0, state.g));
            state.b = Math.min(255, Math.max(0, state.b));

            const neighbors = getNeighbors(p, i);
            neighbors.forEach(j => {
                if (i !== j) {
                    const other = window.particles[j];
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 80 && p.featureWeight > 0.1 && other.featureWeight > 0.1 && !p.collapsed && !other.collapsed) {
                        var wave = Math.sin(distance * 0.04 + state.interferencePhase + window.frame * 0.015 + p.spin + other.spin);
                        p.velocityX += wave * 0.03 * (window.globalPhase === 'synchronization' ? 4 : 2.5) * pulse;
                        p.velocityY += wave * 0.03 * (window.globalPhase === 'synchronization' ? 4 : 2.5) * pulse;
                        if (Math.random() < 0.0005 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
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
                    if (distance < 10 && p.spin === other.spin && !p.collapsed && !other.collapsed && (window.decompositionTimer >= 8 || window.currentStep === 5)) {
                        const force = 0.5 * pulse * (window.globalPhase === 'fractal collapse' ? 2 : 1);
                        p.velocityX += (dx / distance) * force;
                        p.velocityY += (dy / distance) * force;
                        other.velocityX -= (dx / distance) * force;
                        other.velocityY -= (dy / distance) * force;
                        state.pauliFlash = 10;
                        window.quantumStates[j].pauliFlash = 10;
                        if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            potentialMessages.push({ type: 'pauliExclusion', params: { index: i, other: j } });
                            if (typeof window.playNote === 'function') {
                                window.playNote(400, 'sine', 0.2, 0.15);
                            }
                        }
                    }
                }
            });

            if (Math.random() < 0.001 && !p.collapsed && (window.decompositionTimer >= 8 || window.currentStep === 5)) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                p.velocityX = (Math.random() - 0.5) * 1.2 * pulse;
                p.velocityY = (Math.random() - 0.5) * 1.2 * pulse;
                state.tunnelFlash = 12;
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
            } else {
                sketch.noStroke();
            }

            if (p.entangledPartner !== null && window.particles[p.entangledPartner] && (window.decompositionTimer >= 8 || window.currentStep === 5)) {
                var partner = window.particles[p.entangledPartner];
                var partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                if (!p.collapsed && !partner.collapsed && Math.random() < 0.005 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    state.entanglementFlash = 15;
                    partnerState.entanglementFlash = 15;
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

            const margin = 20;
            if (p.x < margin) p.velocityX += (margin - p.x) * 0.04 * pulse;
            if (p.x > 400 - margin) p.velocityX -= (p.x - (400 - margin)) * 0.04 * pulse;
            if (p.y < margin) p.velocityY += (margin - p.y) * 0.04 * pulse;
            if (p.y > 400 - margin) p.velocityY -= (p.y - (400 - margin)) * 0.04 * pulse;

            p.x = Math.max(0, Math.min(400, p.x + p.velocityX));
            p.y = Math.max(0, Math.min(400, p.y + p.velocityY));

            if (!p.collapsed && state.wavePacketAlpha > 0) {
                drawWavePacket(sketch, p.x, p.y, p.uncertaintyRadius, state.r, state.g, state.b, state.wavePacketAlpha);
            }

            if (p.size > 0) {
                sketch.fill(state.r, state.g, state.b, state.a / 7);
                sketch.ellipse(p.x, p.y, p.size + 3 * pulse, p.size + 3 * pulse);
                drawShape(sketch, p.x, p.y, p.size, p.shape, p.phase, p.spin, p.spinPhase, state.r, state.g, state.b, state.a, p.featureWeight, pulse);
                if (state.tunnelFlash > 0) {
                    sketch.fill(204, 51, 51, state.tunnelFlash * 2.5);
                    sketch.ellipse(p.x, p.y, p.size + 2 * pulse, p.size + 2 * pulse);
                    state.tunnelFlash--;
                }
                if (state.pauliFlash > 0) {
                    sketch.fill(204, 51, 51, state.pauliFlash * 4);
                    sketch.ellipse(p.x, p.y, p.size + 1 * pulse, p.size + 1 * pulse);
                    state.pauliFlash--;
                }
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
                             potentialMessages.find(msg => msg.type === 'teleportation') ||
                             potentialMessages.find(msg => msg.type === 'pauliExclusion') ||
                             potentialMessages.find(msg => msg.type === 'interference') ||
                             potentialMessages.find(msg => msg.type === 'entanglement') ||
                             potentialMessages.find(msg => msg.type === 'globalEntanglement') ||
                             potentialMessages.find(msg => msg.type === 'wavefront') ||
                             potentialMessages.find(msg => msg.type === 'quantumPulse') ||
                             potentialMessages.find(msg => msg.type === 'entanglementCascade') ||
                             potentialMessages.find(msg => msg.type === 'decoherence') ||
                             potentialMessages.find(msg => msg.type === 'decoherenceRestore') ||
                             potentialMessages[Math.floor(Math.random() * potentialMessages.length)];
        window.terminalMessages.push(getRandomMessage(selectedMessage.type, selectedMessage.params));
        window.updateTerminalLog();
        window.globalMessageCooldown = 200;
        messageAddedThisFrame = true;
    }

    drawMouseWave(sketch);
};

window.observeParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('observeParticles: No particles or quantum states available');
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 200;
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
        window.globalMessageCooldown = 200;
    }
    window.mouseWave.x = mouseX;
    window.mouseWave.y = mouseY;
    window.mouseWave.radius = window.mouseInfluenceRadius;
};

window.clickParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('clickParticles: No particles or quantum states available');
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 200;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('clickParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    console.log('clickParticles called, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    let messageAddedThisFrame = false;
    let echoWaveTriggered = Math.random() < 0.1;
    window.particles.forEach(function(p, i) {
        try {
            var dx = mouseX - p.x;
            var dy = mouseY - p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[i];
            var pulse = 1 + (0.2 + Math.floor(window.evolutionTimer / 120) * 0.07) * Math.sin(p.pulsePhase + p.spin * Math.PI);

            if (distance < window.mouseInfluenceRadius && distance > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                if (!p.collapsed) {
                    p.collapsed = true;
                    state.a = 180;
                    p.size = 2.5 * pulse;
                    p.uncertaintyRadius = 2;
                    state.wavePacketAlpha = 0;
                    p.shape = p.shape === 'superposed' ? ['ellipse', 'soft-ribbon', 'bio-cluster', 'neural-cluster'][Math.floor(Math.random() * 4)] : p.shape;
                    p.spin = Math.random() < 0.5 ? 0.5 : -0.5;
                    sketch.fill(204, 51, 51, 80);
                    sketch.ellipse(p.x, p.y, 8 * pulse, 8 * pulse);
                    sketch.noFill();
                    sketch.stroke(204, 51, 51, 40);
                    sketch.strokeWeight(0.4);
                    sketch.ellipse(p.x, p.y, 20, 20);
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape + ', spin: ' + p.spin.toFixed(1) + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape, spin: p.spin.toFixed(1), index: i }));
                    window.updateTerminalLog();
                    if (typeof window.playArpeggio === 'function') {
                        window.playArpeggio(p.shape);
                    }
                    window.globalMessageCooldown = 200;
                    messageAddedThisFrame = true;
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    p.pulsePhase = Math.random() * 2 * Math.PI;
                    p.spin = Math.random() < 0.5 ? 0.5 : -0.5;
                    state.a = 180;
                    state.wavePacketAlpha = 50;
                    p.uncertaintyRadius = 5;
                    p.size = 1.8 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * 1.2) * pulse;
                    p.shape = Math.random() < 0.2 ? 'superposed' : ['ellipse', 'soft-ribbon', 'bio-cluster', 'neural-cluster'][Math.floor(Math.random() * 4)];
                    console.log('Particle ' + i + ' restored to superposition, shape: ' + p.shape + ', spin: ' + p.spin.toFixed(1) + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('superpositionRestore', { spin: p.spin.toFixed(1), index: i }));
                    window.updateTerminalLog();
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['E4'] || 329.63;
                        window.playNote(freq, 'sine', 0.2, 0.15);
                    }
                    window.globalMessageCooldown = 200;
                    messageAddedThisFrame = true;
                }
            }

            if (echoWaveTriggered && distance < window.mouseInfluenceRadius * 2 && !p.collapsed) {
                p.spin = Math.random() < 0.5 ? 0.5 : -0.5;
                state.wavePacketAlpha = 80 * pulse;
                p.uncertaintyRadius = 10;
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'echoWave', params: {} });
                    if (typeof window.playNote === 'function') {
                        window.playNote(523.25, 'sine', 0.3, 0.2);
                    }
                }
            }
        } catch (error) {
            console.error('Error clicking particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 200;
                messageAddedThisFrame = true;
            }
        }
    });
};
