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
        "Инициализация квантовой системы портрета. Пиксели готовы к текучей декомпозиции.",
        "Формирование квантовой сетки портрета. Пиксели в гармонии.",
        "Квантовая декомпозиция начата. Пиксели готовы к элегантному переходу."
    ],
    initializeSuccess: [
        "Квантовая система инициализирована: ${validParticles} пикселей.",
        "Успешная инициализация: ${validParticles} пикселей для текучего перехода.",
        "Портрет декомпозирован на ${validParticles} элегантных состояний."
    ],
    initializeError: [
        "Ошибка инициализации: пиксельная сетка не сформирована.",
        "Не удалось инициализировать квантовую систему. Требуется изображение.",
        "Ошибка: данные изображения недоступны для декомпозиции."
    ],
    update: [
        "Квантовая система обновляется. Кванты текут со спином.",
        "Кванты взаимодействуют в элегантном квантовом поле.",
        "Эволюция системы: спины квантов создают текучий танец."
    ],
    decomposition: [
        "Пиксельная декомпозиция портрета: прозрачность ${imgAlpha}/255.",
        "Изображение растворяется в квантовом потоке: ${imgAlpha}/255.",
        "Декомпозиция в текучее квантовое поле: ${imgAlpha}/255."
    ],
    blockFormation: [
        "Пиксели сливаются в мягкие блоки формы ${shape}.",
        "Формирование текучих блоков: портрет обретает текстуру.",
        "Квантовая агрегация: пиксели образуют блоки ${shape}."
    ],
    stabilized: [
        "Квантовая система стабилизирована. Кванты текут гармонично.",
        "Стабилизация текучих состояний завершена.",
        "Кванты со спином стабилизированы в элегантном движении."
    ],
    scatter: [
        "Кванты текут по канве, создавая квантовую гармонию.",
        "Квантовая система: спины формируют текучий узор.",
        "Элегантное рассеяние квантов по канве."
    ],
    superposition: [
        "Квант в суперпозиции: форма ${shape}, спин ${spin}.",
        "Квантовая суперпозиция: текучая форма ${shape}, спин ${spin}.",
        "Квант в гармоничной суперпозиции: ${shape}, спин ${spin}."
    ],
    mouseInfluence: [
        "Наблюдение мягко возмущает кванты со спином.",
        "Волновой пакет наблюдателя направляет текучие кванты.",
        "Квантовое воздействие изменяет спины и потоки."
    ],
    featureAttraction: [
        "Кванты притягиваются к ключевым точкам портрета.",
        "Квантовая система формирует текстуру через притяжение.",
        "Кванты текут к ключевым координатам лица."
    ],
    interference: [
        "Квантовая интерференция создаёт тонкие узоры между спинами.",
        "Интерференция квантов формирует элегантные связи.",
        "Волновые функции квантов текут в гармонии."
    ],
    tunneling: [
        "Квант со спином ${spin} мягко туннелировал.",
        "Квантовая система: текучий переход через барьер.",
        "Квант элегантно туннелировал в новое состояние."
    ],
    entanglement: [
        "Запутанные кванты синхронизированы в текучем танце.",
        "Квантовая запутанность: спины связаны нелокально.",
        "Запутанность создаёт гармоничную корреляцию спинов."
    ],
    collapse: [
        "Коллапс волновой функции: форма ${shape}, спин ${spin}.",
        "Квант стабилизировался: форма ${shape}, спин ${spin}.",
        "Наблюдение зафиксировало квант: ${shape}, спин ${spin}."
    ],
    superpositionRestore: [
        "Квант восстановлен в текучую суперпозицию со спином ${spin}.",
        "Квантовая гармония и спин восстановлены.",
        "Квант возвращён в суперпозицию: спин ${spin}."
    ],
    error: [
        "Ошибка в квантовой системе: квант ${index} не обновлён.",
        "Квантовая ошибка: спин кванта ${index} не изменился.",
        "Аномалия: квант ${index} не обработан."
    ]
};

// Функция для выбора случайного сообщения
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
            `<div class="${msg.includes('туннелировал') ? 'tunneling' : msg.includes('интерференция') ? 'interference' : ''}">${msg}</div>`
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

        // Разбиение на пиксели (сетка 5x5 px)
        const pixelSize = 5;
        const blockSize = 20;
        const numParticles = Math.floor((img.width * img.height) / (pixelSize * pixelSize));
        let validParticles = 0;

        // Ключевые точки лица
        const faceFeatures = [
            { x: img.width * 0.35, y: img.height * 0.3, weight: 0.3 },
            { x: img.width * 0.65, y: img.height * 0.3, weight: 0.3 },
            { x: img.width * 0.5, y: img.height * 0.5, weight: 0.2 },
            { x: img.width * 0.5, y: img.height * 0.7, weight: 0.2 }
        ];

        // Создание пикселей
        for (let y = 0; y < img.height; y += pixelSize) {
            for (let x = 0; x < img.width; x += pixelSize) {
                const index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
                const r = img.pixels[index] || 0; // Без запасного цвета
                const g = img.pixels[index + 1] || 0;
                const b = img.pixels[index + 2] || 0;
                const a = img.pixels[index + 3] || 255;
                const brightness = (r + g + b) / 3;

                if (brightness > 50 || Math.random() < 0.15) {
                    const useFeature = Math.random() < 0.5;
                    let featureWeight = 0.1;
                    if (useFeature) {
                        const feature = faceFeatures.find(f => Math.abs(f.x - x) < img.width * 0.1 && Math.abs(f.y - y) < img.height * 0.1);
                        featureWeight = feature ? feature.weight : 0.1;
                    }

                    window.particles.push({
                        x: x * 400 / img.width,
                        y: y * 400 / img.height,
                        baseX: x * 400 / img.width,
                        baseY: y * 400 / img.height,
                        velocityX: 0,
                        velocityY: 0,
                        size: pixelSize,
                        phase: Math.random() * 2 * Math.PI,
                        frequency: 0.008,
                        spin: Math.random() < 0.5 ? 0.5 : -0.5,
                        entangledPartner: Math.random() < 0.15 ? Math.floor(Math.random() * numParticles) : null,
                        collapsed: false,
                        decompositionProgress: 0,
                        shape: 'pixel',
                        featureWeight: featureWeight,
                        blockId: Math.floor(x / blockSize) + Math.floor(y / blockSize) * Math.floor(img.width / blockSize)
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

// Отрисовка форм в стиле Рона Нагеля
function drawShape(sketch, x, y, size, shape, rotation, spin, r, g, b, a, featureWeight) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation + spin * Math.PI / 2); // Мягкое вращение
    sketch.fill(r, g, b, a * 0.7); // Полупрозрачность для глазури
    sketch.noStroke();
    if (shape === 'pixel') {
        sketch.ellipse(0, 0, size, size); // Мягкие пиксели
    } else if (shape === 'ellipse') {
        sketch.ellipse(0, 0, size * 1.3 * (1 + featureWeight + Math.abs(spin)), size * 0.7);
    } else if (shape === 'soft-ribbon') {
        sketch.beginShape();
        let stretch = 1 + featureWeight + Math.abs(spin) * 0.5;
        sketch.vertex(-size * 1.1 * stretch, size * 0.2);
        sketch.bezierVertex(
            -size * 0.5 * stretch, size * 0.4,
            size * 0.5 * stretch, size * 0.4,
            size * 1.1 * stretch, size * 0.2
        );
        sketch.bezierVertex(
            size * 0.5 * stretch, -size * 0.4,
            -size * 0.5 * stretch, -size * 0.4,
            -size * 1.1 * stretch, -size * 0.2
        );
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'cluster') {
        for (let i = 0; i < 4; i++) {
            let dx = (Math.sin(i * Math.PI / 2 + spin) * size * 0.4);
            let dy = (Math.cos(i * Math.PI / 2 + spin) * size * 0.4);
            sketch.ellipse(dx, dy, size * 0.25 * (1 + Math.abs(spin)), size * 0.25);
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
    gradient.addColorStop(0, 'rgba(209, 209, 230, 0.2)');
    gradient.addColorStop(1, 'rgba(209, 209, 230, 0)');
    sketch.drawingContext.strokeStyle = gradient;
    sketch.strokeWeight(1);
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2);

    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 50 * (1 - i / window.mouseWave.trail.length);
        sketch.stroke(209, 209, 230, alpha);
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
            window.globalMessageCooldown = 300;
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
        window.globalMessageCooldown = 300;
        messageAddedThisFrame = true;
    }
    window.globalMessageCooldown--;
    window.frame = window.frame || 0;
    window.frame++;

    // Тёмный фон
    sketch.background(1, 0, 4); // #010004

    // Этапы декомпозиции
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

    // Обновление волнового пакета мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 0.5);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 8) window.mouseWave.trail.shift();
    }

    // Группировка частиц по blockId
    const blocks = {};
    window.particles.forEach(p => {
        if (!blocks[p.blockId]) {
            blocks[p.blockId] = [];
        }
        blocks[p.blockId].push(p);
    });

    let potentialMessages = [];

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];

            // Этапы трансформации
            if (window.currentStep === 4) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.015);
                state.a = Math.floor(p.decompositionProgress * 200); // Смягчённая прозрачность

                // Этап 1: Пиксели (0–4с)
                if (window.decompositionTimer < 4) {
                    p.shape = 'pixel';
                    p.velocityX = 0;
                    p.velocityY = 0;
                }
                // Этап 2: Блоки (4–8с)
                else if (window.decompositionTimer < 8) {
                    p.shape = Math.random() < 0.5 ? 'ellipse' : 'soft-ribbon';
                    const block = blocks[p.blockId];
                    if (block && block.length > 0) {
                        const centerX = block.reduce((sum, p) => sum + p.baseX, 0) / block.length;
                        const centerY = block.reduce((sum, p) => sum + p.baseY, 0) / block.length;
                        p.velocityX += (centerX - p.x) * 0.03;
                        p.velocityY += (centerY - p.y) * 0.03;
                        p.size = 8;
                        if (Math.random() < 0.008 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            potentialMessages.push({ type: 'blockFormation', params: { shape: p.shape } });
                        }
                    }
                }
                // Этап 3: Кванты (8–12с)
                else {
                    p.shape = ['ellipse', 'soft-ribbon', 'cluster'][Math.floor(Math.random() * 3)];
                    p.size = (2 + 1.5 * sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * state.probability) * (1 + p.featureWeight * 0.4 + Math.abs(p.spin));
                    if (Math.random() < 0.01 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        p.shape = ['ellipse', 'soft-ribbon', 'cluster'][Math.floor(Math.random() * 3)];
                        potentialMessages.push({ type: 'superposition', params: { shape: p.shape, spin: p.spin.toFixed(1) } });
                        if (typeof window.playNote === 'function' && window.noteFrequencies) {
                            const notes = ['C4', 'E4', 'G4'];
                            const note = notes[Math.floor(Math.random() * notes.length)];
                            const freq = window.noteFrequencies[note] || 261.63;
                            window.playNote(freq, 'sine', 0.3, 0.2);
                        }
                    }
                }
            } else if (window.currentStep === 5) {
                p.decompositionProgress = 1;
                state.a = 200;
                p.shape = ['ellipse', 'soft-ribbon', 'cluster'][Math.floor(Math.random() * 3)];
                p.size = (2 + 1.5 * sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * state.probability) * (1 + p.featureWeight * 0.4 + Math.abs(p.spin));
            }

            // Плавное движение квантов по всей канве
            if (window.decompositionTimer >= 8 || window.currentStep === 5) {
                const n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.01);
                p.velocityX += (Math.cos(p.phase + p.spin * Math.PI / 2) * n * window.chaosFactor * 0.5 - p.velocityX) * 0.05;
                p.velocityY += (Math.sin(p.phase + p.spin * Math.PI / 2) * n * window.chaosFactor * 0.5 - p.velocityY) * 0.05;
                p.phase += p.frequency * (1 + Math.abs(p.spin) * 0.5);
            } else {
                p.velocityX *= 0.95;
                p.velocityY *= 0.95;
            }

            // Влияние мыши
            if (window.currentStep === 4 || window.currentStep === 5) {
                var dx = p.x - window.mouseWave.x;
                var dy = p.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                    p.velocityX += dx * influence * 0.05;
                    p.velocityY += dy * influence * 0.05;
                    if (Math.random() < 0.008) {
                        p.spin = -p.spin;
                        potentialMessages.push({ type: 'mouseInfluence', params: { spin: p.spin.toFixed(1) } });
                    }
                }
            }

            // Притяжение к ключевым точкам лица (ослаблено)
            if (p.featureWeight > 0.1 && window.decompositionTimer < 8 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                p.velocityX += (p.baseX - p.x) * 0.04 * p.featureWeight;
                p.velocityY += (p.baseY - p.y) * 0.04 * p.featureWeight;
                potentialMessages.push({ type: 'featureAttraction', params: {} });
            }

            // Цвета строго из портрета
            state.r = Math.min(255, Math.max(0, state.r));
            state.g = Math.min(255, Math.max(0, state.g));
            state.b = Math.min(255, Math.max(0, state.b));

            // Интерференция
            if (window.decompositionTimer >= 8) {
                window.particles.forEach(function(other, j) {
                    if (i !== j) {
                        var dx = p.x - other.x;
                        var dy = p.y - other.y;
                        var distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 80 && p.featureWeight > 0.1 && other.featureWeight > 0.1) {
                            var wave = Math.sin(distance * 0.05 + state.interferencePhase + window.frame * 0.02 + p.spin);
                            p.velocityX += wave * 0.04 * 3;
                            p.velocityY += wave * 0.04 * 3;
                            if (Math.random() < 0.0008 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                                sketch.stroke(204, 51, 51, 50); // #cc3333, alpha 0.2
                                sketch.strokeWeight(0.5);
                                sketch.line(p.x, p.y, other.x, other.y);
                                potentialMessages.push({ type: 'interference', params: { spin: p.spin.toFixed(1) } });
                                if (typeof window.playInterference === 'function') {
                                    window.playInterference(400, 405, 0.8, 0.1);
                                }
                            }
                        }
                    }
                });
            }

            // Туннелирование
            if (Math.random() < 0.001 && !p.collapsed && window.decompositionTimer >= 8) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                p.velocityX = (Math.random() - 0.5) * 1.5;
                p.velocityY = (Math.random() - 0.5) * 1.5;
                state.tunnelFlash = 20;
                sketch.stroke(204, 51, 51, 50); // #cc3333, alpha 0.2
                sketch.strokeWeight(0.5);
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(204, 51, 51, 30);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.3, state.tunnelFlash * 0.3);
                console.log('Particle ' + i + ' tunneled from x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'tunneling', params: { spin: p.spin.toFixed(1) } });
                    if (typeof window.playTunneling === 'function') {
                        const freq = (p.x * p.y) % 400 + 200;
                        window.playTunneling(freq, 0.15, 0.2);
                    }
                }
            } else {
                sketch.noStroke();
            }

            // Запутанность
            if (p.entangledPartner !== null && window.particles[p.entangledPartner] && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                var partner = window.particles[p.entangledPartner];
                var partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                if (p.collapsed && !partner.collapsed) {
                    partnerState.a = 200;
                    partner.size = 3;
                    partner.collapsed = true;
                    partner.shape = p.shape;
                    partner.spin = -p.spin;
                    state.entanglementFlash = 12;
                    console.log('Non-locality: Particle ' + p.entangledPartner + ' flashed due to ' + i + ', spin: ' + partner.spin.toFixed(1));
                    potentialMessages.push({ type: 'entanglement', params: { spin: p.spin.toFixed(1) } });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['E4'] || 329.63;
                        window.playNote(freq, 'sine', 0.3, 0.2);
                    }
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(63, 22, 127, state.entanglementFlash * 5); // #3f167f, alpha 0.2
                    sketch.strokeWeight(0.5);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                }
            }

            // Отталкивание от краёв канвы
            const margin = 20;
            if (p.x < margin) p.velocityX += (margin - p.x) * 0.05;
            if (p.x > 400 - margin) p.velocityX -= (p.x - (400 - margin)) * 0.05;
            if (p.y < margin) p.velocityY += (margin - p.y) * 0.05;
            if (p.y > 400 - margin) p.velocityY -= (p.y - (400 - margin)) * 0.05;

            // Обновление позиции
            p.x = Math.max(0, Math.min(400, p.x + p.velocityX));
            p.y = Math.max(0, Math.min(400, p.y + p.velocityY));

            // Отрисовка частицы
            if (p.size > 0) {
                sketch.fill(state.r, state.g, state.b, state.a / 6);
                sketch.ellipse(p.x, p.y, p.size + 4, p.size + 4);
                drawShape(sketch, p.x, p.y, p.size, p.shape, p.phase, p.spin, state.r, state.g, state.b, state.a, p.featureWeight);
                if (state.tunnelFlash > 0) {
                    sketch.fill(204, 51, 51, state.tunnelFlash * 3); // #cc3333, alpha 0.2
                    sketch.ellipse(p.x, p.y, p.size + 3, p.size + 3);
                    state.tunnelFlash--;
                }
            }

            // Логирование первых 5 частиц
            if (i < 5) {
                console.log('Particle ' + i + ' at x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2) + ', size: ' + p.size.toFixed(2) + ', shape: ' + p.shape + ', spin: ' + p.spin.toFixed(1) + ', color: rgb(' + state.r + ', ' + state.g + ', ' + state.b + ', ' + state.a + ')');
            }
        } catch (error) {
            console.error('Error updating particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                potentialMessages.push({ type: 'error', params: { index: i } });
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

// Реакция частиц на движение мыши
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

// Реакция частиц на клик
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

            if (distance < window.mouseInfluenceRadius && distance > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                if (!p.collapsed) {
                    p.collapsed = true;
                    state.a = 200;
                    p.size = 3;
                    p.shape = ['ellipse', 'soft-ribbon', 'cluster'][Math.floor(Math.random() * 3)];
                    p.spin = Math.random() < 0.5 ? 0.5 : -0.5;
                    sketch.fill(204, 51, 51, 100); // #cc3333, alpha 0.4
                    sketch.ellipse(p.x, p.y, 10, 10);
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
                    p.spin = Math.random() < 0.5 ? 0.5 : -0.5;
                    state.a = 200;
                    p.size = 2 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * 1.5);
                    console.log('Particle ' + i + ' restored to superposition, shape: ' + p.shape + ', spin: ' + p.spin.toFixed(1) + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('superpositionRestore', { spin: p.spin.toFixed(1) }));
                    window.updateTerminalLog();
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['E4'] || 329.63;
                        window.playNote(freq, 'sine', 0.3, 0.2);
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
