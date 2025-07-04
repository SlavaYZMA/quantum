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
        "Инициализация квантового рассыпания портрета. Портрет видим.",
        "Квантовая система активирована. Подготовка частиц.",
        "Начало декомпозиции портрета на квантовые частицы."
    ],
    initializeSuccess: [
        "Квантовая система готова: ${validParticles} частиц.",
        "Успешная фрагментация: ${validParticles} квантовых частиц.",
        "Портрет разбит на ${validParticles} квантовых частиц."
    ],
    initializeError: [
        "Ошибка: данные изображения недоступны для разбиения.",
        "Квантовая система не инициализирована. Требуется портрет.",
        "Аномалия: портрет не разбит на частицы."
    ],
    update: [
        "Эволюция квантовой системы. Частицы в волновом движении.",
        "Квантовая динамика: частицы взаимодействуют.",
        "Обновление волновых функций квантовых частиц."
    ],
    decompositionStart: [
        "Инициировано квантовое рассыпание: фаза ${phase}.",
        "Рассыпание портрета начато: формирование частиц.",
        "Квантовый разрыв портрета: фаза ${phase}."
    ],
    decomposition: [
        "Квантовое рассыпание: ${particleCount} частиц, прогресс ${progress}%.",
        "Фрагментация портрета: ${particleCount} частиц, фаза ${phase}.",
        "Разрыв портрета: ${particleCount} квантовых частиц, прогресс ${progress}%."
    ],
    stabilized: [
        "Квантовая система стабилизирована. Частицы в равновесии.",
        "Стабилизация квантовых частиц завершена.",
        "Частицы портрета в квантовом равновесии."
    ],
    scatter: [
        "Частицы рассеиваются в квантовом поле.",
        "Квантовая энтропия возрастает. Частицы разлетаются.",
        "Частицы увеличивают квантовую неопределённость."
    ],
    superposition: [
        "Частица в суперпозиции: амплитуда ψ=${amplitude}.",
        "Квантовая суперпозиция: состояние ψ=${amplitude}.",
        "Частица в суперпозиции: |ψ|²=${probability}."
    ],
    mouseInfluence: [
        "Наблюдение вызывает коллапс волновой функции частиц.",
        "Волновое возмущение от наблюдателя влияет на частицы.",
        "Квантовая интерференция инициирована наблюдением."
    ],
    interference: [
        "Интерференция волновых функций формирует узоры.",
        "Квантовая интерференция: амплитуда ${amplitude}.",
        "Волновая интерференция частиц: ${amplitude}."
    ],
    tunneling: [
        "Частица туннелировала с вероятностью P=${probability}.",
        "Квантовое туннелирование: частица переместилась.",
        "Частица преодолела квантовый барьер."
    ],
    entanglement: [
        "Запутанные частицы демонстрируют квантовую корреляцию.",
        "Квантовая запутанность синхронизирует частицы.",
        "Частицы связаны квантовой запутанностью."
    ],
    collapse: [
        "Коллапс волновой функции: позиция (${x}, ${y}).",
        "Наблюдение зафиксировало частицу: (${x}, ${y}).",
        "Частица коллапсировала в квантовом поле."
    ],
    superpositionRestore: [
        "Частица восстановлена: |ψ|²=${probability}.",
        "Квантовая неопределённость восстановлена.",
        "Частица вернулась в суперпозицию."
    ],
    error: [
        "Квантовая ошибка: частица ${index} не обновлена.",
        "Аномалия: частица ${index} не изменила состояние.",
        "Ошибка: частица ${index} не обработана."
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
            `<div class="${msg.includes('туннелирование') ? 'tunneling' : msg.includes('интерфери') ? 'interference' : msg.includes('запутанность') ? 'entanglement' : ''}">${msg}</div>`
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
        const gridSize = 10; // Сетка 10x10 пикселей
        const numParticlesPerCell = 3;
        let validParticles = 0;

        // Разбиение на частицы
        for (let y = 0; y < img.height; y += gridSize) {
            for (let x = 0; x < img.width; x += gridSize) {
                let index = (Math.floor(x + gridSize / 2) + Math.floor(y + gridSize / 2) * img.width) * 4;
                let brightness = (img.pixels[index] + img.pixels[index + 1] + img.pixels[index + 2]) / 3;
                if (brightness > 50 || Math.random() < 0.4) {
                    for (let i = 0; i < numParticlesPerCell; i++) {
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
                            frequency: 0.015,
                            entangledPartner: Math.random() < 0.25 ? Math.floor(Math.random() * numParticlesPerCell * Math.floor(img.width / gridSize) * Math.floor(img.height / gridSize)) : null,
                            collapsed: false,
                            decompositionProgress: 0,
                            shape: ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)]
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

        console.log('Initialized ' + window.particles.length + ' particles, valid: ' + validParticles + ' particles');
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

// Отрисовка форм частиц
function drawShape(sketch, x, y, size, shape, rotation, r, g, b, a) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    sketch.fill(r, g, b, a);
    if (shape === 'ribbon') {
        sketch.beginShape();
        sketch.vertex(-size * 1.2, size * 0.3);
        sketch.quadraticVertex(0, size * 0.4 + sketch.noise(x * 0.1, y * 0.1, window.frame * 0.01) * 2, size * 1.2, size * 0.3);
        sketch.quadraticVertex(0, -size * 0.4 - sketch.noise(x * 0.1 + 100, y * 0.1 + 100, window.frame * 0.01) * 2, -size * 1.2, -size * 0.3);
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'ellipse') {
        sketch.ellipse(0, 0, size * 1.5 + sketch.noise(x * 0.1, y * 0.1, window.frame * 0.01) * 2, size * 0.5);
    } else if (shape === 'cluster') {
        for (let i = 0; i < 5; i++) {
            let dx = (Math.random() - 0.5) * size * 0.5 + sketch.noise(x * 0.1 + i, y * 0.1 + i, window.frame * 0.01) * 2;
            let dy = (Math.random() - 0.5) * size * 0.5 + sketch.noise(x * 0.1 + i + 100, y * 0.1 + i + 100, window.frame * 0.01) * 2;
            sketch.ellipse(dx, dy, size * 0.3, size * 0.3);
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
    sketch.drawingContext.fillStyle = '#010004';
    sketch.rect(0, 0, 400, 400);

    // Отображение портрета в начале шага 4
    if (window.currentStep === 4 && window.decompositionTimer < 2 && window.img) {
        sketch.image(window.img, 0, 0, 400, 400);
    }

    // Квантовая декомпозиция на шаге 4
    if (window.currentStep === 4) {
        window.decompositionTimer += 0.015;
        if (window.decompositionTimer >= 2 && window.decompositionTimer < 5) {
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame && window.decompositionTimer < 2.015) {
                window.terminalMessages.push(getRandomMessage('decompositionStart', { phase: window.decompositionTimer.toFixed(2) }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
            let progress = ((window.decompositionTimer - 2) / 3 * 100).toFixed(0);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('decomposition', { particleCount: window.particles.length, progress, phase: window.decompositionTimer.toFixed(2) }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
            // Плавное появление частиц
            window.particles.forEach((p, i) => {
                let state = window.quantumStates[i];
                state.a = Math.min(255, state.a + 255 * 0.015);
            });
            // Отрисовка "трещин"
            for (let y = 0; y < 400; y += 10) {
                for (let x = 0; x < 400; x += 10) {
                    if (Math.random() < (window.decompositionTimer - 2) / 3) {
                        sketch.stroke(204, 51, 51, 100); // #cc3333
                        sketch.line(x, y, x + 10, y + 10);
                        sketch.line(x + 10, y, x, y + 10);
                    }
                }
            }
            // Скрытие портрета после разбиения
            if (window.decompositionTimer >= 5 && window.img) {
                sketch.image(window.img, 0, 0, 400, 400, 0, 0, 0, 0); // Пустое изображение
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
        window.particles.forEach((p, i) => window.quantumStates[i].a = 255);
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

            // Квантовая декомпозиция
            if (window.currentStep === 4 && window.decompositionTimer >= 2 && window.decompositionTimer < 5) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.015);
                var dx = p.x - 200;
                var dy = p.y - 200;
                var dist = Math.sqrt(dx * dx + dy * dy) + 1;
                var wave = Math.sin(dist * 0.04 + window.decompositionTimer * 2);
                p.offsetX += wave * 12 * (dx / dist);
                p.offsetY += wave * 12 * (dy / dist);
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'scatter', params: {} });
                }
            }

            // Волновая функция (суперпозиция)
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.015);
            if (!p.collapsed) {
                p.phase += p.frequency;
                var amplitude = Math.sin(p.phase) * 5 * n * window.chaosFactor;
                p.offsetX += Math.cos(p.phase) * amplitude;
                p.offsetY += Math.sin(p.phase) * amplitude;
                p.size = (3 + 3 * n * state.probability);
                if (Math.random() < 0.02 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
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
                    p.offsetX += dx * influence * 0.12;
                    p.offsetY += dy * influence * 0.12;
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
                    if (distance < 50) {
                        var wave = Math.sin(distance * 0.08 + state.interferencePhase + window.frame * 0.03);
                        interference += wave * 0.1;
                        if (Math.random() < 0.002 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            sketch.stroke(204, 51, 51, 30); // #cc3333
                            sketch.line(p.x, p.y, other.x, other.y);
                            potentialMessages.push({ type: 'interference', params: { amplitude: wave.toFixed(2) } });
                            if (typeof window.playInterference === 'function') {
                                window.playInterference(440, 445, 1.0, 0.15);
                            }
                        }
                    }
                }
            });
            p.offsetX += interference * 6;
            p.offsetY += interference * 6;

            // Туннелирование
            let tunnelProbability = Math.exp(-0.12 * Math.sqrt(2 * (100 - 50))); // Упрощённая модель P = exp(-2a√(2m(V-E))/ħ)
            if (Math.random() < tunnelProbability / 100 && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 30;
                sketch.stroke(204, 51, 51, 100); // #cc3333
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(204, 51, 51, 60);
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
                var partner = window.particles[p.entangledPartner];
                var partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                if (p.collapsed && !partner.collapsed) {
                    partnerState.a = 255;
                    partner.collapsed = true;
                    partner.shape = p.shape;
                    state.entanglementFlash = 20;
                    console.log('Non-locality: Particle ' + p.entangledPartner + ' flashed');
                    potentialMessages.push({ type: 'entanglement', params: {} });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['C4'] || 261.63;
                        window.playNote(freq, 'sine', 0.5, 0.2);
                    }
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(63, 22, 127, state.entanglementFlash * 12); // #3f167f
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                }
            }

            // Обновление позиции
            p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));

            // Отрисовка частицы
            if (p.size > 0) {
                sketch.fill(state.r, state.g, state.b, state.a / 4);
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
        console.error('observeParticles: No particles available');
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
        console.error('clickParticles: No particles available');
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
                    p.size = 3 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * 3);
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
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
        }
    });
};
