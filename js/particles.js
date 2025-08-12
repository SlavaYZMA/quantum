console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;
window.phaseTimer = 0;
window.globalPhase = 'chaos';
window.grid = [];
window.vortexCenters = [];
window.branchParticles = [];
window.webIntensity = 0;
window.webGrowthRate = 0.01;
window.webConnections = 0;
window.maxWebConnections = 100;
window.webGrowthThreshold = 4;
window.baseWebColor = { r: 63, g: 22, b: 127 };
window.mouseInfluenceRadius = 80;

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
        "Наблюдение сильно возмущает биокванты, изменяя спины.",
        "Волновой пакет наблюдателя усиливает квантовый танец.",
        "Квантовое воздействие создаёт мощные биопотоки."
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
    spiralMigration: [
        "Кванты закручиваются в биоквантовые вихри.",
        "Спиральная миграция: кванты текут, как живые потоки.",
        "Биокванты формируют вихревые биоструктуры."
    ],
    vortexSingularity: [
        "Вихревая сингулярность: кванты схлопываются в центр.",
        "Квантовая сингулярность активировала биопотоки.",
        "Глобальный вихрь оживляет квантовую экосистему."
    ],
    branching: [
        "Кванты ветвятся, как нейронные сети.",
        "Биоквантовая структура разрастается.",
        "Ветвление активирует живой рост."
    ],
    webFormation: [
        "Квантовая паутина начинает расти с нуля.",
        "Паутина запутанности медленно формируется.",
        "Биокванты создают первые связи паутины."
    ],
    error: [
        "Ошибка в биоквантовой системе: квант ${index} не обновлён.",
        "Аномалия: спин кванта ${index} не изменился.",
        "Биоквантовая ошибка: квант ${index} не ожил."
    ],
    collapse: [
        "Квант коллапсировал в определённое состояние.",
        "Биоквант стабилизировался в новой форме.",
        "Коллапс волновой функции зафиксирован."
    ]
};

// Выбор случайного сообщения
function getRandomMessage(type, params = {}) {
    let msgArray = messages[type] || ['Unknown message type'];
    let msg = msgArray[Math.floor(Math.random() * msgArray.length)];
    for (let key in params) {
        msg = msg.replace(`\${${key}}`, params[key]);
    }
    return `[${new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${msg}`;
}

// Инициализация terminalMessages
window.terminalMessages = window.terminalMessages || [];
window.updateTerminalLog = window.updateTerminalLog || function() {
    console.log('updateTerminalLog called, messages:', window.terminalMessages);
};

// Обновление терминального лога
window.updateTerminalLog = function() {
    const maxMessages = 10;
    while (window.terminalMessages.length > maxMessages) {
        window.terminalMessages.shift();
    }
    const terminalDiv = document.getElementById(`terminal-log-step-${window.currentStep}`);
    if (terminalDiv) {
        terminalDiv.innerHTML = window.terminalMessages.map(msg => 
            `<div class="${msg.includes('туннелировал') || msg.includes('мигрировал') ? 'tunneling' : msg.includes('интерференция') ? 'interference' : msg.includes('запутанность') || msg.includes('нелокальность') ? 'entanglement' : msg.includes('сингулярность') ? 'vortex' : msg.includes('ветвится') ? 'branching' : msg.includes('паутина') ? 'web' : ''}">${msg}</div>`
        ).join('');
    }
};

// p5.js setup to create canvas
function setup() {
    console.log('p5.js setup called');
    const canvas = createCanvas(800, 800);
    canvas.parent('canvas-container');
    console.log('Canvas created and parented to canvas-container');
}
function draw() {
    console.log('p5.js draw called');
    if (window.currentStep !== 7 && window.currentStep !== 8) return; // step-4 (индекс 7), step-5 (индекс 8)
    background(0); // Очистка canvas черным фоном
    if (window.decompositionTimer === undefined) window.decompositionTimer = 0;
    if (window.globalPhase === undefined) window.globalPhase = 'chaos';
    if (!window.particles || !window.quantumStates || window.particles.length === 0 || window.quantumStates.length === 0) {
        console.warn('Particles or quantum states not initialized', {
            particles: window.particles ? window.particles.length : 'undefined',
            quantumStates: window.quantumStates ? window.quantumStates.length : 'undefined'
        });
        return;
    }
    const collapsedCount = window.particles.filter(p => p.collapsed).length;
    console.log('Collapsed particles:', collapsedCount, 'Total particles:', window.particles.length);
    window.decompositionTimer += 0.015; // Обновляем таймер для анимации
    window.updateParticles(window.quantumSketch); // Обновляем частицы
    window.particles.forEach((particle, index) => {
        const state = window.quantumStates[index];
        console.log('Drawing particle', index, 'at', particle.x, particle.y, 'collapsed:', particle.collapsed, 'alpha:', state.a);
        if (!particle.collapsed) {
            drawShape(window.quantumSketch, particle.x, particle.y, particle.size, particle.shape, particle.phase, particle.spin, particle.spinPhase, state.r, state.g, state.b, state.a || 180, particle.featureWeight, 1 + 0.3 * Math.sin(particle.pulsePhase + particle.spin));
            if (state.wavePacketAlpha > 0) {
                drawWavePacket(window.quantumSketch, particle.x, particle.y, particle.uncertaintyRadius, state.r, state.g, state.b, state.wavePacketAlpha);
            }
            if (state.tunnelFlash > 0) {
                window.quantumSketch.fill(204, 51, 51, state.tunnelFlash * 2.5);
                window.quantumSketch.ellipse(particle.x, particle.y, particle.size + 2 * (1 + 0.3 * Math.sin(particle.pulsePhase + particle.spin)), particle.size + 2 * (1 + 0.3 * Math.sin(particle.pulsePhase + particle.spin)));
            }
        } else {
            window.quantumSketch.fill(state.r, state.g, state.b, 255); // Полная непрозрачность для коллапса
            window.quantumSketch.ellipse(particle.x, particle.y, particle.size, particle.size);
        }
    });
    // Рендеринг ветвящихся частиц
    window.branchParticles.forEach(bp => bp.show(window.quantumSketch));
    // Рендеринг мыши
    drawMouseWave(window.quantumSketch);
}

// p5.js draw function for quantum animation
window.updateParticles = function(sketch) {
    console.log('updateParticles called, decompositionTimer:', window.decompositionTimer, 'globalPhase:', window.globalPhase);
    if (!sketch || !window.particles || window.particles.length === 0 || !window.quantumStates || window.quantumStates.length === 0) {
        console.error('Cannot update particles:', {
            sketch: !!sketch,
            particlesLength: window.particles ? window.particles.length : 0,
            quantumStatesLength: window.quantumStates ? window.quantumStates.length : 0
        });
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 200;
        }
        return;
    }
    if (window.currentStep !== 7 && window.currentStep !== 8) {
        console.log('updateParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    window.particles.forEach((particle, index) => {
        const state = window.quantumStates[index];
        if (!particle.collapsed) {
            let dx = sketch.mouseX - particle.x;
            let dy = sketch.mouseY - particle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < window.mouseInfluenceRadius) {
                particle.velocityX += dx * 0.01 * particle.featureWeight;
                particle.velocityY += dy * 0.01 * particle.featureWeight;
                state.probability *= 0.99;
                if (Math.random() < 0.01) {
                    particle.collapsed = true;
                    state.a = 255;
                    window.terminalMessages.push(getRandomMessage('collapse'));
                    window.updateTerminalLog();
                }
            }
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.velocityX *= 0.95;
            particle.velocityY *= 0.95;
            particle.phase += particle.frequency;
            state.wavePacketAlpha = 50 * state.probability * (1 + 0.3 * Math.sin(particle.pulsePhase + particle.spin));
        }
    });
}

// Создание сетки для оптимизации
function createGrid() {
    window.grid = [];
    const gridSize = 80;
    const gridWidth = Math.ceil(800 / gridSize);
    const gridHeight = Math.ceil(800 / gridSize);
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
    window.branchParticles.forEach((p, i) => {
        const gridX = Math.floor(p.x / gridSize);
        const gridY = Math.floor(p.y / gridSize);
        const gridIndex = gridY * gridWidth + gridX;
        if (gridIndex >= 0 && gridIndex < window.grid.length) {
            window.grid[gridIndex].push({ index: i, isBranch: true });
        }
    });
}

// Получение соседей из сетки (оптимизировано до 4 клеток)
function getNeighbors(p, i, gridSize = 80) {
    const gridWidth = Math.ceil(800 / gridSize);
    const gridX = Math.floor(p.x / gridSize);
    const gridY = Math.floor(p.y / gridSize);
    let neighbors = [];
    const directions = [[0, 0], [-1, 0], [0, -1], [1, 0], [0, 1]];
    directions.forEach(([dx, dy]) => {
        const nx = gridX + dx;
        const ny = gridY + dy;
        const gridIndex = ny * gridWidth + nx;
        if (gridIndex >= 0 && gridIndex < window.grid.length) {
            neighbors = neighbors.concat(window.grid[gridIndex]);
        }
    });
    return neighbors;
}

// Создание вихревых центров
function createVortexCenters() {
    window.vortexCenters = [];
    const numVortices = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < numVortices; i++) {
        window.vortexCenters.push({
            x: Math.random() * 800,
            y: Math.random() * 800,
            strength: 0.02 + Math.random() * 0.03
        });
    }
}

// Инициализация частиц и определение базового цвета паутины
window.initializeParticles = function(img) {
    console.log('initializeParticles called, img defined: ' + !!img + ', dimensions: ' + (img ? img.width + 'x' + img.height : 'undefined'));
    window.terminalMessages.push(getRandomMessage('initialize'));
    window.updateTerminalLog();
    if (typeof window.playInitialization === 'function') {
        console.log('Playing initialization sound');
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
    window.grid = [];
    window.vortexCenters = [];
    window.branchParticles = [];
    window.webIntensity = 0;
    window.webConnections = 0;

    let totalR = 0, totalG = 0, totalB = 0, pixelCount = 0;
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        totalR += img.pixels[i];
        totalG += img.pixels[i + 1];
        totalB += img.pixels[i + 2];
        pixelCount++;
    }
    window.baseWebColor = {
        r: Math.floor(totalR / pixelCount),
        g: Math.floor(totalG / pixelCount),
        b: Math.floor(totalB / pixelCount)
    };

    console.log('window.img:', window.img, 'img.pixels:', window.img ? window.img.pixels : 'undefined');
try {
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

                    window.particles.push({
                        x: x * 800 / img.width,
                        y: y * 800 / img.height,
                        baseX: x * 800 / img.width,
                        baseY: y * 800 / img.height,
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
                        shape: 'pixel',
                        featureWeight: featureWeight,
                        blockId: Math.floor(x / blockSize) + Math.floor(y / blockSize) * Math.floor(img.width / blockSize),
                        clusterId: null,
                        vortexId: null,
                        pulsePhase: Math.random() * 2 * Math.PI,
                        uncertaintyRadius: 6,
                        originalColor: { r: r, g: g, b: b }
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
                        wavePacketAlpha: 0
                    });
                    validParticles++;
                }
            }
        }

        console.log('Initialized ' + window.particles.length + ' particles, valid: ' + validParticles);
        console.log('Particles initialized:', window.particles.length, 'Quantum states:', window.quantumStates.length);
        window.terminalMessages.push(getRandomMessage('initializeSuccess', { validParticles }));
        window.updateTerminalLog();
        if (typeof window.playInitialization === 'function') {
            console.log('Playing initialization success sound');
            window.playInitialization();
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
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${wavePacketAlpha})`);
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
        for (let i = 0; i < 5; i++) {
            let dx = (Math.sin(i * Math.PI / 2.5 + spin + pulse + spinPhase) * size * 0.3);
            let dy = (Math.cos(i * Math.PI / 2.5 + spin + pulse + spinPhase) * size * 0.3);
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
    gradient.addColorStop(0, 'rgba(209, 209, 230, 0.2)');
    gradient.addColorStop(1, 'rgba(209, 209, 230, 0)');
    sketch.drawingContext.strokeStyle = gradient;
    sketch.strokeWeight(1.2);
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2);

    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 60 * (1 - i / window.mouseWave.trail.length);
        sketch.stroke(209, 209, 230, alpha);
        sketch.ellipse(point.x, point.y, window.mouseWave.radius * 0.6);
    });
}

// Обновление частиц с звуковыми эффектами
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
    if (window.currentStep !== 7 && window.currentStep !== 8) {
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

    if (window.currentStep === 4 || window.currentStep === 5) {
        if (window.decompositionTimer < 4) {
            if (window.globalPhase !== 'chaos') {
                window.globalPhase = 'chaos';
                window.terminalMessages.push(getRandomMessage('phaseTransition', { phase: 'хаос' }));
                window.updateTerminalLog();
            }
        } else if (window.decompositionTimer < 8) {
            if (window.globalPhase !== 'clustering') {
                window.globalPhase = 'clustering';
                window.terminalMessages.push(getRandomMessage('phaseTransition', { phase: 'кластеризация' }));
                window.updateTerminalLog();
            }
        } else {
            if (window.globalPhase !== 'synchronization') {
                window.globalPhase = 'synchronization';
                window.terminalMessages.push(getRandomMessage('phaseTransition', { phase: 'синхронизация' }));
                window.updateTerminalLog();
            }
        }
    }

    if ((window.currentStep === 4 || window.currentStep === 5) && window.decompositionTimer < 12) {
        window.decompositionTimer += 0.015;
        if (window.img) {
            var imgAlpha = Math.max(0, 255 * (1 - window.decompositionTimer / 4));
            sketch.tint(255, imgAlpha);
            sketch.image(window.img, 0, 0, 800, 800);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('decomposition', { imgAlpha: imgAlpha.toFixed(0) }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 200;
                messageAddedThisFrame = true;
            }
        }
    } else if (window.currentStep === 5 && window.decompositionTimer >= 12) {
        if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
            window.terminalMessages.push(getRandomMessage('stabilized'));
            window.updateTerminalLog();
            if (typeof window.playStabilization === 'function') {
                console.log('Playing stabilization sound');
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
    if ((window.currentStep === 4 || window.currentStep === 5) && window.decompositionTimer >= 4) {
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
    let globalEntanglement = Math.random() < 0.002;
    let wavefrontEvent = Math.random() < 0.001 && window.globalPhase === 'synchronization';

    if ((window.currentStep === 4 || window.currentStep === 5) && window.decompositionTimer >= window.webGrowthThreshold) {
        if (window.globalPhase === 'clustering' || window.globalPhase === 'synchronization') {
            window.webIntensity = Math.min(1, window.webIntensity + window.webGrowthRate);
            window.webConnections = Math.min(window.maxWebConnections, window.webConnections + Math.floor(window.webIntensity * 2));
            if (window.webConnections === 1 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('webFormation'));
                window.updateTerminalLog();
                window.globalMessageCooldown = 200;
                messageAddedThisFrame = true;
            }
        }
    }

    // Постоянный звуковой фон
    if (typeof window.playBackgroundTone === 'function' && (window.currentStep === 4 || window.currentStep === 5)) {
        const avgVelocity = window.particles.reduce((sum, p) => sum + Math.sqrt(p.velocityX * p.velocityX + p.velocityY * p.velocityY), 0) / window.particles.length;
        const baseFreq = 80 + avgVelocity * 10;
        const pulse = 1 + 0.3 * Math.sin(window.phaseTimer);
        console.log('Playing background tone:', baseFreq, pulse);
        window.playBackgroundTone(baseFreq, 'sine', 0.1 * pulse, 0.1);
    }

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];
            var pulse = 1 + 0.3 * Math.sin(p.pulsePhase + p.spin);

            p.pulsePhase += 0.06 * (1 + Math.abs(p.spin) * 0.4);
            p.spinPhase += 0.03;

            var speed = Math.sqrt(p.velocityX * p.velocityX + p.velocityY * p.velocityY);
            p.uncertaintyRadius = 6 + speed * 12 + 5 * Math.sin(p.pulsePhase);
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
                        if (typeof window.playNote === 'function') {
                            const freq = noteFrequencies['C4'] || 261.63;
                            console.log('Playing decoherence sound:', freq);
                            window.playNote(freq, 'sine', 0.2, 0.15);
                        }
                    }
                } else if (state.decoherenceTimer > 100 && Math.random() < 0.003) {
                    p.collapsed = false;
                    state.probability = 1.0;
                    state.decoherenceTimer = 0;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'decoherenceRestore', params: { index: i } });
                        if (typeof window.playNote === 'function') {
                            const freq = noteFrequencies['E4'] || 329.63;
                            console.log('Playing decoherence restore sound:', freq);
                            window.playNote(freq, 'sine', 0.2, 0.15);
                        }
                    }
                }
            }

            if (window.currentStep === 4 || window.currentStep === 5) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.02);
                state.a = Math.floor(p.decompositionProgress * 180) || 180; // Гарантируем видимость

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
                        p.velocityX += (centerX - p.x) * 0.03;
                        p.velocityY += (centerY - p.y) * 0.03;
                        p.size = 7 * pulse;
                        if (Math.random() < 0.1 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            potentialMessages.push({ type: 'blockFormation', params: { shape: p.shape } });
                        }
                    }
                } else {
                    p.shape = ['ellipse', 'soft-ribbon', 'bio-cluster'][Math.floor(Math.random() * 3)];
                    p.size = (1.8 + 1.5 * sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * state.probability) * (1 + p.featureWeight * 0.3 + Math.abs(p.spin)) * pulse;
                    if (Math.random() < 0.2 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'superposition', params: { shape: p.shape, spin: p.spin.toFixed(1) } });
                        if (typeof window.playNote === 'function') {
                            const notes = ['C4', 'E4', 'G4'];
                            const note = notes[Math.floor(Math.random() * notes.length)];
                            const freq = noteFrequencies[note] || 261.63;
                            console.log('Playing superposition note:', note, freq);
                            window.playNote(freq, 'sine', 0.2, 0.15);
                        }
                    }
                    if (window.globalPhase === 'synchronization') {
                        p.spin = Math.sin(window.phaseTimer * 0.12 + p.x * 0.01 + p.y * 0.01) > 0 ? 0.5 : -0.5;
                    }
                }
            }

            if ((window.currentStep === 4 || window.currentStep === 5) && window.decompositionTimer >= 8) {
                const n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.01);
                const bioRhythm = 1 + 0.4 * Math.sin(p.pulsePhase + p.spin);
                p.velocityX += (Math.cos(p.phase + p.spin * Math.PI / 2) * n * window.chaosFactor * 0.5 * bioRhythm - p.velocityX) * 0.05;
                p.velocityY += (Math.sin(p.phase + p.spin * Math.PI / 2) * n * window.chaosFactor * 0.5 * bioRhythm - p.velocityY) * 0.05;
                p.phase += p.frequency * (1 + Math.abs(p.spin) * 0.5);
                if (Math.random() < 0.03) {
                    p.velocityX += (Math.random() - 0.5) * 2.0 * bioRhythm;
                    p.velocityY += (Math.random() - 0.5) * 2.0 * bioRhythm;
                }
                if (Math.random() < 0.1 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'precession', params: { index: i } });
                }
                if (Math.random() < 0.1 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'diffusion', params: { index: i } });
                }
            } else {
                p.velocityX *= 0.95;
                p.velocityY *= 0.95;
            }

            if (window.currentStep === 4 || window.currentStep === 5) {
                var dx = p.x - window.mouseWave.x;
                var dy = p.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed) {
                    var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                    p.velocityX += dx * influence * 0.07 * pulse;
                    p.velocityY += dy * influence * 0.07 * pulse;
                    if (Math.random() < 0.2 * influence) {
                        p.spin = -p.spin;
                        p.size += 2.5 * pulse;
                        if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            potentialMessages.push({ type: 'mouseInfluence', params: { spin: p.spin.toFixed(1) } });
                        }
                    }
                    if (distance < window.mouseInfluenceRadius / 2) {
                        window.webIntensity = Math.min(1, window.webIntensity + 0.03 * influence);
                    }
                }
            }

            if (p.featureWeight > 0.1 && window.decompositionTimer < 8 && (window.currentStep === 4 || window.currentStep === 5) && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                p.velocityX += (p.baseX - p.x) * 0.04 * p.featureWeight;
                p.velocityY += (p.baseY - p.y) * 0.04 * p.featureWeight;
                potentialMessages.push({ type: 'featureAttraction', params: {} });
            }

            if (globalEntanglement && !p.collapsed) {
                p.entangledPartner = Math.floor(Math.random() * window.particles.length);
                state.entanglementFlash = 15;
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'globalEntanglement', params: {} });
                    window.webIntensity = Math.min(1, window.webIntensity + 0.15);
                    if (typeof window.playNote === 'function') {
                        const freq = noteFrequencies['E4'] || 329.63;
                        console.log('Playing entanglement sound:', freq);
                        window.playNote(freq, 'sine', 0.2, 0.15);
                    }
                }
            }

            if (wavefrontEvent) {
                state.wavePacketAlpha = 90 * pulse;
                p.uncertaintyRadius = 18;
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'wavefront', params: {} });
                    window.webIntensity = Math.min(1, window.webIntensity + 0.15);
                    if (typeof window.playNote === 'function') {
                        const freq = noteFrequencies['C4'] || 261.63;
                        console.log('Playing wavefront sound:', freq);
                        window.playNote(freq, 'sine', 0.3, 0.2);
                    }
                }
            }

            state.r = p.originalColor.r + (Math.random() - 0.5) * 20;
            state.g = p.originalColor.g + (Math.random() - 0.5) * 20;
            state.b = p.originalColor.b + (Math.random() - 0.5) * 20;
            state.r = Math.min(255, Math.max(0, state.r));
            state.g = Math.min(255, Math.max(0, state.g));
            state.b = Math.min(255, Math.max(0, state.b));

            if ((window.currentStep === 4 || window.currentStep === 5) && window.decompositionTimer >= 8) {
                const neighbors = getNeighbors(p, i);
                neighbors.forEach(n => {
                    if (n.isBranch) {
                        const bp = window.branchParticles[n.index];
                        var dx = p.x - bp.x;
                        var dy = p.y - bp.y;
                        var distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 80) {
                            var wave = Math.sin(distance * 0.05 + state.interferencePhase + window.frame * 0.02 + p.spin + bp.spin);
                            p.velocityX += wave * 0.04 * 2.5 * pulse;
                            p.velocityY += wave * 0.04 * 2.5 * pulse;
                            bp.velocityX -= wave * 0.04 * 2.5 * pulse;
                            bp.velocityY -= wave * 0.04 * 2.5 * pulse;
                            if (Math.random() < 0.3 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) { // Увеличена вероятность
                                sketch.push();
                                sketch.noFill();
                                let webAlpha = 40 * window.webIntensity;
                                let colorVariation = {
                                    r: window.baseWebColor.r + (Math.random() - 0.5) * 50,
                                    g: window.baseWebColor.g + (Math.random() - 0.5) * 50,
                                    b: window.baseWebColor.b + (Math.random() - 0.5) * 50
                                };
                                sketch.stroke(colorVariation.r, colorVariation.g, colorVariation.b, webAlpha);
                                sketch.strokeWeight(0.5 + 0.2 * Math.abs(wave));
                                sketch.beginShape();
                                for (let t = 0; t < 1; t += 0.1) {
                                    let ix = p.x + t * (bp.x - p.x);
                                    let iy = p.y + t * (bp.y - p.y);
                                    let offset = Math.sin(t * Math.PI * 2 + state.interferencePhase) * 2 * wave;
                                    sketch.vertex(ix + offset * (dy / distance), iy - offset * (dx / distance));
                                }
                                sketch.endShape();
                                sketch.pop();
                                potentialMessages.push({ type: 'interference', params: { spin: p.spin.toFixed(1) } });
                                if (typeof window.playInterference === 'function') {
                                    console.log('Playing interference sound');
                                    window.playInterference(380, 385, 0.7, 0.1);
                                }
                            }
                        }
                    } else {
                        const other = window.particles[n];
                        var dx = p.x - other.x;
                        var dy = p.y - other.y;
                        var distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 80 && p.featureWeight > 0.1 && other.featureWeight > 0.1 && !p.collapsed && !other.collapsed && window.webConnections > 0) {
                            var wave = Math.sin(distance * 0.05 + state.interferencePhase + window.frame * 0.02 + p.spin + other.spin);
                            p.velocityX += wave * 0.04 * (window.globalPhase === 'synchronization' ? 4 : 2.5) * pulse;
                            p.velocityY += wave * 0.04 * (window.globalPhase === 'synchronization' ? 4 : 2.5) * pulse;
                            if (Math.random() < 0.3 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) { // Увеличена вероятность
                                sketch.push();
                                sketch.noFill();
                                let webAlpha = 40 * window.webIntensity;
                                let colorVariation = {
                                    r: window.baseWebColor.r + (Math.random() - 0.5) * 50,
                                    g: window.baseWebColor.g + (Math.random() - 0.5) * 50,
                                    b: window.baseWebColor.b + (Math.random() - 0.5) * 50
                                };
                                sketch.stroke(colorVariation.r, colorVariation.g, colorVariation.b, webAlpha);
                                sketch.strokeWeight(0.5 + 0.2 * Math.abs(wave));
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
                                    console.log('Playing interference sound');
                                    window.playInterference(380, 385, 0.7, 0.1);
                                }
                            }
                        }
                    }
                });
            }

            if (Math.random() < 0.1 && !p.collapsed && ((window.currentStep === 4 || window.currentStep === 5) && window.decompositionTimer >= 8)) { // Увеличена вероятность
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 800;
                p.y = Math.random() * 800;
                p.velocityX = (Math.random() - 0.5) * 1.5 * pulse;
                p.velocityY = (Math.random() - 0.5) * 1.5 * pulse;
                state.tunnelFlash = 12;
                sketch.stroke(204, 51, 51, 40);
                sketch.strokeWeight(0.5);
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(204, 51, 51, 25);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.3, state.tunnelFlash * 0.3);
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'tunneling', params: { spin: p.spin.toFixed(1) } });
                    if (typeof window.playTunneling === 'function') {
                        const freq = (p.x * p.y) % 380 + 190;
                        console.log('Playing tunneling sound:', freq);
                        window.playTunneling(freq, 0.12, 0.15);
                    }
                }
            } else {
                sketch.noStroke();
            }

            if (p.entangledPartner !== null && window.particles[p.entangledPartner] && ((window.currentStep === 4 || window.currentStep === 5) && window.decompositionTimer >= 8)) {
                var partner = window.particles[p.entangledPartner];
                var partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2 + (p.originalColor.r - state.r) * 0.2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2 + (p.originalColor.g - state.g) * 0.2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2 + (p.originalColor.b - state.b) * 0.2;
                if (!p.collapsed && !partner.collapsed && Math.random() < 0.2 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) { // Увеличена вероятность
                    state.entanglementFlash = 15;
                    partnerState.entanglementFlash = 15;
                    potentialMessages.push({ type: 'entanglement', params: { spin: p.spin.toFixed(1) } });
                    window.webIntensity = Math.min(1, window.webIntensity + 0.15);
                    if (typeof window.playNote === 'function') {
                        const freq = noteFrequencies['E4'] || 329.63;
                        console.log('Playing entanglement sound:', freq);
                        window.playNote(freq, 'sine', 0.2, 0.15);
                    }
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(63, 22, 127, state.entanglementFlash * 4);
                    sketch.strokeWeight(0.5);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                    partnerState.entanglementFlash--;
                }
            }

            const margin = 20;
            if (p.x < margin) p.velocityX += (margin - p.x) * 0.05 * pulse;
            if (p.x > 800 - margin) p.velocityX -= (p.x - (800 - margin)) * 0.05 * pulse;
            if (p.y < margin) p.velocityY += (margin - p.y) * 0.05 * pulse;
            if (p.y > 800 - margin) p.velocityY -= (p.y - (800 - margin)) * 0.05 * pulse;

            p.x = Math.max(0, Math.min(800, p.x + p.velocityX * 1.2));
            p.y = Math.max(0, Math.min(800, p.y + p.velocityY * 1.2));

            if (!p.collapsed && state.wavePacketAlpha > 0) {
                drawWavePacket(sketch, p.x, p.y, p.uncertaintyRadius, state.r, state.g, state.b, state.wavePacketAlpha);
            }

            if (p.size > 0 && !p.collapsed) {
                sketch.fill(state.r, state.g, state.b, state.a / 7);
                sketch.ellipse(p.x, p.y, p.size + 3 * pulse, p.size + 3 * pulse);
                drawShape(sketch, p.x, p.y, p.size, p.shape, p.phase, p.spin, p.spinPhase, state.r, state.g, state.b, state.a, p.featureWeight, pulse);
                if (state.tunnelFlash > 0) {
                    sketch.fill(204, 51, 51, state.tunnelFlash * 2.5);
                    sketch.ellipse(p.x, p.y, p.size + 2 * pulse, p.size + 2 * pulse);
                    state.tunnelFlash--;
                }
            }
        } catch (error) {
            console.error('Error updating particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                potentialMessages.push({ type: 'error', params: { index: i } });
            }
        }
    });

    for (let i = window.branchParticles.length - 1; i >= 0; i--) {
        let bp = window.branchParticles[i];
        bp.update();
        bp.show(sketch);
        if (bp.isDone()) {
            window.branchParticles.splice(i, 1);
        } else if (Math.random() < 0.15) {
            for (let j = 0; j < 2 + Math.floor(Math.random() * 3); j++) {
                let newBranch = bp.branch();
                newBranch.size = 5 + Math.random() * 5;
                window.branchParticles.push(newBranch);
            }
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('branching'));
                window.updateTerminalLog();
                window.globalMessageCooldown = 200;
                messageAddedThisFrame = true;
            }
        }
    }

    if (window.webIntensity > 0 && ((window.currentStep === 4 || window.currentStep === 5) && window.decompositionTimer >= window.webGrowthThreshold)) {
        let webAlpha = 40 * window.webIntensity;
        window.particles.forEach((p, i) => {
            const neighbors = getNeighbors(p, i);
            let connectionCount = 0;
            for (let n of neighbors) {
                if (!n.isBranch && connectionCount < 50) {
                    const other = window.particles[n];
                    let dx = p.x - other.x;
                    let dy = p.y - other.y;
                    let d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 80 && !p.collapsed && !other.collapsed && window.webConnections > 0) {
                        let colorVariation = {
                            r: window.baseWebColor.r + (Math.random() - 0.5) * 50,
                            g: window.baseWebColor.g + (Math.random() - 0.5) * 50,
                            b: window.baseWebColor.b + (Math.random() - 0.5) * 50
                        };
                        sketch.stroke(colorVariation.r, colorVariation.g, colorVariation.b, webAlpha);
                        sketch.strokeWeight(0.4 + 0.1 * Math.sin(window.frame * 0.06));
                        sketch.line(p.x, p.y, other.x, other.y);
                        connectionCount++;
                    }
                }
            }
        });
    }

    if (potentialMessages.length > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        let selectedMessage = potentialMessages.find(msg => msg.type === 'tunneling') ||
                             potentialMessages.find(msg => msg.type === 'interference') ||
                             potentialMessages.find(msg => msg.type === 'entanglement') ||
                             potentialMessages.find(msg => msg.type === 'globalEntanglement') ||
                             potentialMessages.find(msg => msg.type === 'wavefront') ||
                             potentialMessages[Math.floor(Math.random() * potentialMessages.length)];
        window.terminalMessages.push(getRandomMessage(selectedMessage.type, selectedMessage.params));
        window.updateTerminalLog();
        window.globalMessageCooldown = 200;
        messageAddedThisFrame = true;
    }

    drawMouseWave(sketch);
};

class BranchParticle {
    constructor(x, y, parentColor, level = 0) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() - 0.5;
        this.vy = Math.random() - 0.5;
        this.life = 255;
        this.size = 3 + Math.random() * 3;
        this.color = parentColor || { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 };
        this.level = level;
        this.maxLevel = 3;
        this.collapseProgress = 0;
    }

    update() {
        this.x += this.vx * 2.0;
        this.y += this.vy * 2.0;
        this.vx += (Math.random() - 0.5) * 0.3;
        this.vy += (Math.random() - 0.5) * 0.3;
        this.life -= 2.0;

        if (this.level < this.maxLevel && Math.random() < 0.2 && window.currentStep === 5 && this.collapseProgress === 0) {
            for (let j = 0; j < 2; j++) {
                let angle = Math.random() * Math.PI * 2;
                let length = 12 + Math.random() * 25;
                let newX = this.x + Math.cos(angle) * length;
                let newY = this.y + Math.sin(angle) * length;
                let newColor = {
                    r: this.color.r + (Math.random() - 0.5) * 30,
                    g: this.color.g + (Math.random() - 0.5) * 30,
                    b: this.color.b + (Math.random() - 0.5) * 30
                };
                newColor.r = Math.min(255, Math.max(0, newColor.r));
                newColor.g = Math.min(255, Math.max(0, newColor.g));
                newColor.b = Math.min(255, Math.max(0, newColor.b));
                window.branchParticles.push(new BranchParticle(newX, newY, newColor, this.level + 1));
            }
        }

        if (this.collapseProgress > 0) {
            this.life -= 6;
            this.collapseProgress += 0.15;
            if (this.collapseProgress >= 1) this.life = 0;
        }
    }

    show(sketch) {
        sketch.stroke(this.color.r, this.color.g, this.color.b, this.life * (1 - this.collapseProgress));
        sketch.strokeWeight(this.size * (1 - this.collapseProgress));
        sketch.point(this.x, this.y);

        for (let other of window.branchParticles) {
            let dx = this.x - other.x;
            let dy = this.y - other.y;
            let d = Math.sqrt(dx * dx + dy * dy);
            if (d < 50 && this !== other && this.collapseProgress === 0 && other.collapseProgress === 0) {
                sketch.stroke(this.color.r, this.color.g, this.color.b, this.life * 0.5);
                sketch.line(this.x, this.y, other.x, other.y);
            }
        }

        if (window.mouseClicked && Math.sqrt((this.x - window.mouseWave.x) ** 2 + (this.y - window.mouseWave.y) ** 2) < 20 && this.collapseProgress === 0) {
            this.collapseProgress = 0.1;
            sketch.fill(204, 51, 51, 80 * (1 - this.collapseProgress));
            sketch.ellipse(this.x, this.y, 20 * (1 - this.collapseProgress), 20 * (1 - this.collapseProgress));
            if (typeof window.playArpeggio === 'function') {
                console.log('Playing branch collapse sound');
                window.playArpeggio('ellipse');
            }
        }
    }

    branch() {
        return new BranchParticle(this.x, this.y, {
            r: this.color.r + (Math.random() - 0.5) * 20,
            g: this.color.g + (Math.random() - 0.5) * 20,
            b: this.color.b + (Math.random() - 0.5) * 20
        }, this.level + 1);
    }

    isDone() {
        return this.life < 0 || this.x < 0 || this.x > 800 || this.y < 0 || this.y > 800 || this.collapseProgress >= 1;
    }
}

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
    if (typeof window.playBackgroundTone === 'function') {
        const freq = 80 + Math.random() * 20; // Лёгкое изменение тона при движении
        console.log('Playing mouse move tone:', freq);
        window.playBackgroundTone(freq, 'sine', 0.1, 0.1);
    }
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
    window.particles.forEach(function(p, i) {
        try {
            var dx = mouseX - p.x;
            var dy = mouseY - p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[i];
            var pulse = 1 + 0.3 * Math.sin(p.pulsePhase + p.spin);

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
                    sketch.strokeWeight(0.5);
                    sketch.ellipse(p.x, p.y, 20, 20);
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape + ', spin: ' + p.spin.toFixed(1) + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape, spin: p.spin.toFixed(1) }));
                    window.updateTerminalLog();
                    if (typeof window.playArpeggio === 'function') {
                        console.log('Playing collapse arpeggio sound');
                        window.playArpeggio(p.shape);
                    }
                    for (let j = 0; j < 3 + Math.random() * 3; j++) {
                        window.branchParticles.push(new BranchParticle(p.x, p.y, { r: state.r, g: state.g, b: state.b }));
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
                    p.size = 1.8 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * state.probability);
                    console.log('Particle ' + i + ' uncollapsed, shape: ' + p.shape + ', spin: ' + p.spin.toFixed(1) + ', alpha: ' + state.a);
                    window.globalMessageCooldown = 200;
                    messageAddedThisFrame = true;
                    if (typeof window.playNote === 'function') {
                        const freq = noteFrequencies['G4'] || 392.00;
                        console.log('Playing uncollapse sound:', freq);
                        window.playNote(freq, 'sine', 0.2, 0.15);
                    }
                }
            }
        } catch (error) {
            console.error('Error collapsing particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 200;
            }
        }
    });
};
