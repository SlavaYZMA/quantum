console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;

// Константы квантовой физики
const HBAR = 1.0545718e-34; // Постоянная Планка (Js)
const MASS = 1e-30; // Масса частицы (кг)
const BARRIER_WIDTH = 1e-9; // Ширина барьера (м)
const BARRIER_HEIGHT = 1e-19; // Высота барьера (Дж)
const ENERGY = 0.5e-19; // Энергия частицы (Дж)

// Варианты сообщений с квантовыми параметрами
const messages = {
    initialize: [
        "Инициализация когерентного состояния портрета. |ψ⟩ = ∏|α_i⟩.",
        "Квантовая система активирована. Портрет в когерентном состоянии.",
        "Подготовка к декогеренции портрета на пиксельные состояния."
    ],
    initializeSuccess: [
        "Квантовая система готова: ${validParticles} пиксельных частиц, ρ = ∑|ψ_i⟩⟨ψ_i|.",
        "Успешное разбиение: ${validParticles} квантовых состояний.",
        "Портрет декогерирован в ${validParticles} пиксельных частиц."
    ],
    initializeError: [
        "Ошибка: когерентное состояние портрета недоступно.",
        "Квантовая система не инициализирована. Требуется |ψ⟩.",
        "Аномалия: портрет не разбит на пиксели."
    ],
    update: [
        "Эволюция квантовых состояний: ψ(x,t) = A * exp(i(kx - ωt)).",
        "Квантовая динамика: |ψ|² определяет позиции пикселей.",
        "Обновление волновых функций: k=${waveVector}, ω=${frequency}."
    ],
    decompositionStart: [
        "Инициирована декогеренция: мгновенное разбиение на пиксели.",
        "Рассыпание портрета: пиксели в суперпозиции.",
        "Квантовый разрыв: |ψ⟩ → ∑|ψ_i⟩, |ψ|²=${probability}."
    ],
    decomposition: [
        "Декогеренция завершена: ${particleCount} пиксельных частиц, |ψ|²=${probability}.",
        "Пиксельные частицы: ${particleCount} состояний, ρ = ∑p_i|ψ_i⟩⟨ψ_i|.",
        "Квантовый распад: ${particleCount} частиц в квантовом поле."
    ],
    stabilized: [
        "Квантовая система стабилизирована: пиксели в суперпозиции.",
        "Стабилизация квантовых состояний пикселей завершена.",
        "Пиксельные частицы в равновесии: |ψ|²=${probability}."
    ],
    scatter: [
        "Пиксельные частицы рассеиваются: S=${entropy}.",
        "Квантовая энтропия возрастает: |ψ|² уменьшается.",
        "Частицы в квантовом поле: неопределённость растёт."
    ],
    superposition: [
        "Пиксель в суперпозиции: |Ψ|²=${probability}, A=${amplitude}.",
        "Квантовая суперпозиция: ψ(x,t) = ${amplitude} * exp(iφ).",
        "Суперпозиция пикселя: |ψ|²=${probability}, φ=${phase}."
    ],
    mouseInfluence: [
        "Наблюдение вызывает коллапс: |ψ⟩ → |x⟩.",
        "Волновое возмущение: ∂ψ/∂t от наблюдателя.",
        "Квантовая интерференция: |ψ|²=${probability}."
    ],
    interference: [
        "Интерференция: |ψ_i + ψ_j|²=${amplitude}, φ=${phase}.",
        "Квантовая интерференция пикселей: узоры в |ψ|².",
        "Волновая интерференция: A=${amplitude}, k=${waveVector}."
    ],
    tunneling: [
        "Туннелирование пикселя: P=${probability}, V=${barrierHeight} Дж.",
        "Квантовое туннелирование: Δx=${deltaX} м.",
        "Пиксель туннелировал: P=${probability}, E=${energy} Дж."
    ],
    entanglement: [
        "Запутанность: |ψ_ij⟩ = (1/√2)(|0_i⟩|1_j⟩ - |1_i⟩|0_j⟩).",
        "Квантовая корреляция: пиксели синхронизированы.",
        "Запутанные пиксели: φ=${phase}, |ψ|²=${probability}."
    ],
    collapse: [
        "Коллапс волновой функции: |x⟩=(${x}, ${y}), |ψ|²=${probability}.",
        "Наблюдение: пиксель в |x⟩=(${x}, ${y}).",
        "Коллапс пикселя: |ψ⟩ → |x⟩, позиция (${x}, ${y})."
    ],
    superpositionRestore: [
        "Восстановлена суперпозиция: |ψ|²=${probability}.",
        "Квантовая неопределённость: ψ(x,t) = ${amplitude} * exp(iφ).",
        "Пиксель в суперпозиции: |ψ|²=${probability}."
    ],
    error: [
        "Квантовая ошибка: пиксель ${index} не обновлён.",
        "Аномалия: |ψ_${index}⟩ не определено.",
        "Ошибка: пиксель ${index}, ρ нестабильно."
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

// Инициализация частиц из пикселей портрета
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
        const gridSize = 1; // Каждый пиксель — блок
        let validParticles = 0;

        // Разбиение на пиксельные блоки
        for (let y = 0; y < img.height; y += gridSize) {
            for (let x = 0; x < img.width; x += gridSize) {
                let index = (x + y * img.width) * 4;
                let brightness = (img.pixels[index] + img.pixels[index + 1] + img.pixels[index + 2]) / 3;
                if (brightness > 50) { // Игнорируем тёмные пиксели
                    let pr = img.pixels[index] || 209; // #d1d1e6
                    let pg = img.pixels[index + 1] || 209;
                    let pb = img.pixels[index + 2] || 230;
                    let pa = img.pixels[index + 3] || 255;

                    let probability = Math.min(1, Math.max(0.1, brightness / 255)); // |ψ|²
                    window.particles.push({
                        x: x * 400 / img.width,
                        y: y * 400 / img.height,
                        baseX: x * 400 / img.width,
                        baseY: y * 400 / img.height,
                        offsetX: 0,
                        offsetY: 0,
                        size: 1 + probability * 3, // Размер зависит от яркости
                        phase: Math.random() * 2 * Math.PI,
                        frequency: 0.02 * probability,
                        waveVector: 0.05,
                        entangledPartner: Math.random() < 0.3 ? Math.floor(Math.random() * (img.width * img.height)) : null,
                        collapsed: false,
                        shape: ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)]
                    });

                    window.quantumStates.push({
                        r: pr,
                        g: pg,
                        b: pb,
                        a: 0, // Невидимы до разбиения
                        probability: probability,
                        decoherenceTimer: 0,
                        tunnelFlash: 0,
                        interferencePhase: Math.random() * 2 * Math.PI,
                        entanglementFlash: 0
                    });
                    validParticles++;
                }
            }
        }

        console.log('Initialized ' + window.particles.length + ' pixel particles, valid: ' + validParticles + ' particles');
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

// Отрисовка форм частиц с текстурой Миелго
function drawShape(sketch, x, y, size, shape, rotation, r, g, b, a) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    sketch.fill(r, g, b, a);
    if (shape === 'ribbon') {
        sketch.beginShape();
        let noiseScale = 0.1;
        sketch.vertex(-size * 1.2 + sketch.noise(x * noiseScale, y * noiseScale, window.frame * 0.01) * 2, size * 0.3);
        sketch.quadraticVertex(0, size * 0.4 + sketch.noise(x * noiseScale + 100, y * noiseScale + 100, window.frame * 0.01) * 2, size * 1.2 - sketch.noise(x * noiseScale + 200, y * noiseScale + 200, window.frame * 0.01) * 2, size * 0.3);
        sketch.quadraticVertex(0, -size * 0.4 - sketch.noise(x * noiseScale + 300, y * noiseScale + 300, window.frame * 0.01) * 2, -size * 1.2 + sketch.noise(x * noiseScale + 400, y * noiseScale + 400, window.frame * 0.01) * 2, -size * 0.3);
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

// Отрисовка волны от мыши
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
        window.terminalMessages.push(getRandomMessage('update', { 
            waveVector: (window.particles[0]?.waveVector || 0.05).toFixed(3), 
            frequency: (window.particles[0]?.frequency || 0.02).toFixed(3) 
        }));
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

    // Отображение портрета (когерентное состояние)
    if (window.currentStep === 4 && window.decompositionTimer < 2 && window.img) {
        sketch.image(window.img, 0, 0, 400, 400);
    }

    // Мгновенное разбиение на пиксели
    if (window.currentStep === 4) {
        window.decompositionTimer += 0.015;
        if (window.decompositionTimer >= 2 && window.decompositionTimer < 2.015) {
            // Мгновенное появление пиксельных частиц
            window.particles.forEach((p, i) => {
                let state = window.quantumStates[i];
                state.a = 255; // Полная видимость
                state.probability = Math.max(0.1, state.probability); // |ψ|²
            });
            // Отрисовка "трещин" при разбиении
            for (let y = 0; y < 400; y += 10) {
                for (let x = 0; x < 400; x += 10) {
                    if (Math.random() < 0.5) {
                        sketch.stroke(204, 51, 51, 120); // #cc3333
                        sketch.line(x, y, x + 10, y + 10);
                        sketch.line(x + 10, y, x, y + 10);
                    }
                }
            }
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('decompositionStart', { 
                    probability: (window.quantumStates[0]?.probability || 1.0).toFixed(2) 
                }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
            // Скрытие портрета
            if (window.img) {
                sketch.image(window.img, 0, 0, 400, 400, 0, 0, 0, 0);
            }
        }
        if (window.decompositionTimer >= 2 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
            window.terminalMessages.push(getRandomMessage('decomposition', { 
                particleCount: window.particles.length, 
                probability: (window.quantumStates[0]?.probability || 1.0).toFixed(2) 
            }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 300;
            messageAddedThisFrame = true;
        }
    } else if (window.currentStep === 5) {
        if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
            window.terminalMessages.push(getRandomMessage('stabilized', { 
                probability: (window.quantumStates[0]?.probability || 1.0).toFixed(2) 
            }));
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

            // Квантовая динамика после разбиения
            if (window.currentStep === 4 && window.decompositionTimer >= 2 || window.currentStep === 5) {
                var dx = p.x - 200;
                var dy = p.y - 200;
                var dist = Math.sqrt(dx * dx + dy * dy) + 1;
                var wave = Math.sin(dist * 0.05 + window.frame * 0.02);
                p.offsetX += wave * 10 * (dx / dist);
                p.offsetY += wave * 10 * (dy / dist);
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'scatter', params: { entropy: (Math.log(window.particles.length) * state.probability).toFixed(2) } });
                }
            }

            // Волновая функция (суперпозиция)
            if (!p.collapsed) {
                p.phase += p.frequency;
                let amplitude = state.probability * 5 * sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.015);
                p.offsetX += Math.cos(p.phase) * amplitude * Math.cos(p.waveVector * p.x);
                p.offsetY += Math.sin(p.phase) * amplitude * Math.cos(p.waveVector * p.y);
                p.size = 1 + 3 * state.probability * sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale);
                if (Math.random() < 0.02 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
                    potentialMessages.push({ 
                        type: 'superposition', 
                        params: { 
                            amplitude: amplitude.toFixed(2), 
                            probability: state.probability.toFixed(2), 
                            phase: p.phase.toFixed(2) 
                        } 
                    });
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

            // Влияние мыши (наблюдение)
            if (window.currentStep === 4 || window.currentStep === 5) {
                var dx = p.x - window.mouseWave.x;
                var dy = p.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                    p.offsetX += dx * influence * 0.15;
                    p.offsetY += dy * influence * 0.15;
                    state.probability *= 0.95;
                    potentialMessages.push({ type: 'mouseInfluence', params: { probability: state.probability.toFixed(2) } });
                }
            }

            // Интерференция
            var interference = 0;
            window.particles.forEach(function(other, j) {
                if (i !== j) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 40 && distance > 0) {
                        var wave = Math.sin(distance * p.waveVector + state.interferencePhase + window.frame * 0.035);
                        interference += wave * 0.12;
                        if (Math.random() < 0.0025 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            sketch.stroke(204, 51, 51, 35); // #cc3333
                            sketch.line(p.x, p.y, other.x, other.y);
                            potentialMessages.push({ 
                                type: 'interference', 
                                params: { 
                                    amplitude: wave.toFixed(2), 
                                    phase: state.interferencePhase.toFixed(2), 
                                    waveVector: p.waveVector.toFixed(3) 
                                } 
                            });
                            if (typeof window.playInterference === 'function') {
                                window.playInterference(440, 445, 1.0, 0.15);
                            }
                        }
                    }
                }
            });
            p.offsetX += interference * 7;
            p.offsetY += interference * 7;

            // Туннелирование
            let tunnelProbability = Math.exp(-2 * BARRIER_WIDTH * Math.sqrt(2 * MASS * (BARRIER_HEIGHT - ENERGY)) / HBAR);
            if (Math.random() < tunnelProbability && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 30;
                sketch.stroke(204, 51, 51, 100); // #cc3333
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(204, 51, 51, 60);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.5, state.tunnelFlash * 0.5);
                console.log('Pixel ' + i + ' tunneled, P=' + tunnelProbability.toFixed(6));
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ 
                        type: 'tunneling', 
                        params: { 
                            probability: tunnelProbability.toFixed(6), 
                            barrierHeight: BARRIER_HEIGHT.toExponential(2), 
                            energy: ENERGY.toExponential(2), 
                            deltaX: Math.sqrt((p.x - oldX) ** 2 + (p.y - oldY) ** 2).toFixed(2) 
                        } 
                    });
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
                    partner.waveVector = p.waveVector;
                    state.entanglementFlash = 20;
                    console.log('Entanglement: Pixel ' + p.entangledPartner + ' synchronized');
                    potentialMessages.push({ 
                        type: 'entanglement', 
                        params: { 
                            phase: p.phase.toFixed(2), 
                            probability: state.probability.toFixed(2) 
                        } 
                    });
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

            // Отрисовка пиксельной частицы
            if (p.size > 0) {
                sketch.fill(state.r, state.g, state.b, state.a / 3);
                sketch.ellipse(p.x, p.y, p.size + 4, p.size + 4);
                drawShape(sketch, p.x, p.y, p.size, p.shape, p.phase, state.r, state.g, state.b, state.a);
                if (state.tunnelFlash > 0) {
                    sketch.fill(204, 51, 51, state.tunnelFlash * 5); // #cc3333
                    sketch.ellipse(p.x, p.y, p.size + 5, p.size + 5);
                    state.tunnelFlash--;
                }
            }

            if (i < 5) {
                console.log('Pixel ' + i + ': x=' + p.x.toFixed(2) + ', y=' + p.y.toFixed(2) + ', |ψ|²=' + state.probability.toFixed(2) + ', shape=' + p.shape);
            }
        } catch (error) {
            console.error('Error updating pixel ' + i + ': ' + error);
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
        console.error('observeParticles: No pixels available');
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
        window.terminalMessages.push(getRandomMessage('mouseInfluence', { 
            probability: (window.quantumStates[0]?.probability || 1.0).toFixed(2) 
        }));
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
        console.error('clickParticles: No pixels available');
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
                    state.probability = 1.0;
                    p.size = 4;
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
                    sketch.fill(204, 51, 51, 180); // #cc3333
                    sketch.ellipse(p.x, p.y, 12, 12);
                    console.log('Pixel ' + i + ' collapsed, |ψ|²=' + state.probability.toFixed(2));
                    window.terminalMessages.push(getRandomMessage('collapse', { 
                        x: p.x.toFixed(2), 
                        y: p.y.toFixed(2), 
                        probability: state.probability.toFixed(2) 
                    }));
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
                    state.probability = Math.min(1, Math.max(0.1, sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale)));
                    p.size = 1 + 3 * state.probability;
                    console.log('Pixel ' + i + ' restored to superposition, |ψ|²=' + state.probability.toFixed(2));
                    window.terminalMessages.push(getRandomMessage('superpositionRestore', { 
                        probability: state.probability.toFixed(2), 
                        amplitude: (state.probability * 5).toFixed(2) 
                    }));
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
            console.error('Error clicking pixel ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
        }
    });
};console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;

// Константы квантовой физики
const HBAR = 1.0545718e-34; // Постоянная Планка (Js)
const MASS = 1e-30; // Масса частицы (кг)
const BARRIER_WIDTH = 1e-9; // Ширина барьера (м)
const BARRIER_HEIGHT = 1e-19; // Высота барьера (Дж)
const ENERGY = 0.5e-19; // Энергия частицы (Дж)

// Варианты сообщений с квантовыми параметрами
const messages = {
    initialize: [
        "Инициализация когерентного состояния портрета. |ψ⟩ = ∏|α_i⟩.",
        "Квантовая система активирована. Портрет в когерентном состоянии.",
        "Начало декогеренции портрета на квантовые состояния."
    ],
    initializeSuccess: [
        "Квантовая система готова: ${validParticles} частиц, ρ = ∑|ψ_i⟩⟨ψ_i|.",
        "Успешная декогеренция: ${validParticles} квантовых состояний.",
        "Портрет декогерирован в ${validParticles} частиц."
    ],
    initializeError: [
        "Ошибка: когерентное состояние портрета недоступно.",
        "Квантовая система не инициализирована. Требуется |ψ⟩.",
        "Аномалия: портрет не декогерирован."
    ],
    update: [
        "Эволюция квантовых состояний: ψ(x,t) = A * exp(i(kx - ωt)).",
        "Квантовая динамика: |ψ|² определяет позиции частиц.",
        "Обновление волновых функций: k=${waveVector}, ω=${frequency}."
    ],
    decompositionStart: [
        "Инициирована декогеренция: фаза ${phase}, ρ = ∑p_i|ψ_i⟩⟨ψ_i|.",
        "Рассыпание портрета: переход в суперпозицию.",
        "Квантовый разрыв: фаза ${phase}, |ψ|²=${probability}."
    ],
    decomposition: [
        "Декогеренция: ${particleCount} частиц, прогресс ${progress}%, |ψ|²=${probability}.",
        "Фрагментация портрета: ${particleCount} частиц, фаза ${phase}.",
        "Квантовый распад: ${particleCount} состояний, прогресс ${progress}%."
    ],
    stabilized: [
        "Квантовая система стабилизирована: все частицы в суперпозиции.",
        "Стабилизация квантовых состояний завершена.",
        "Частицы в квантовом равновесии: |ψ|²=${probability}."
    ],
    scatter: [
        "Частицы рассеиваются: увеличение квантовой энтропии.",
        "Квантовая декогеренция: рост неопределённости |ψ|².",
        "Частицы в квантовом поле: S=${entropy}."
    ],
    superposition: [
        "Частица в суперпозиции: |ψ|²=${probability}, A=${amplitude}.",
        "Квантовая суперпозиция: ψ(x,t) = ${amplitude} * exp(iφ).",
        "Суперпозиция: |ψ|²=${probability}, φ=${phase}."
    ],
    mouseInfluence: [
        "Наблюдение вызывает коллапс: |ψ⟩ → |x⟩.",
        "Волновое возмущение: ∂ψ/∂t от наблюдателя.",
        "Квантовая интерференция инициирована: |ψ|²=${probability}."
    ],
    interference: [
        "Интерференция: |ψ_i + ψ_j|²=${amplitude}, φ=${phase}.",
        "Квантовая интерференция: узоры в поле |ψ|².",
        "Волновая интерференция: A=${amplitude}, k=${waveVector}."
    ],
    tunneling: [
        "Туннелирование: P=${probability}, V=${barrierHeight} Дж.",
        "Квантовое туннелирование: Δx=${deltaX} м.",
        "Частица туннелировала: P=${probability}, E=${energy} Дж."
    ],
    entanglement: [
        "Запутанность: |ψ_ij⟩ = (1/√2)(|0_i⟩|1_j⟩ - |1_i⟩|0_j⟩).",
        "Квантовая корреляция: синхронизация состояний.",
        "Запутанные частицы: φ=${phase}, |ψ|²=${probability}."
    ],
    collapse: [
        "Коллапс волновой функции: |x⟩=(${x}, ${y}), |ψ|²=${probability}.",
        "Наблюдение: частица в |x⟩=(${x}, ${y}).",
        "Коллапс: |ψ⟩ → |x⟩, позиция (${x}, ${y})."
    ],
    superpositionRestore: [
        "Восстановлена суперпозиция: |ψ|²=${probability}.",
        "Квантовая неопределённость: ψ(x,t) = ${amplitude} * exp(iφ).",
        "Частица в суперпозиции: |ψ|²=${probability}."
    ],
    error: [
        "Квантовая ошибка: состояние ${index} не обновлено.",
        "Аномалия: |ψ_${index}⟩ не определено.",
        "Ошибка: частица ${index}, ρ нестабильно."
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
        const gridSize = 8; // Сетка 8x8 пикселей для большей плотности
        const numParticlesPerCell = 4;
        let validParticles = 0;

        // Разбиение на частицы
        for (let y = 0; y < img.height; y += gridSize) {
            for (let x = 0; x < img.width; x += gridSize) {
                let index = (Math.floor(x + gridSize / 2) + Math.floor(y + gridSize / 2) * img.width) * 4;
                let brightness = (img.pixels[index] + img.pixels[index + 1] + img.pixels[index + 2]) / 3;
                if (brightness > 60 || Math.random() < 0.5) {
                    for (let i = 0; i < numParticlesPerCell; i++) {
                        let px = x + Math.random() * gridSize;
                        let py = y + Math.random() * gridSize;
                        let pIndex = (Math.floor(px) + Math.floor(py) * img.width) * 4;
                        let pr = img.pixels[pIndex] || 209; // #d1d1e6
                        let pg = img.pixels[pIndex + 1] || 209;
                        let pb = img.pixels[pIndex + 2] || 230;
                        let pa = img.pixels[pIndex + 3] || 255;

                        let probability = Math.min(1, Math.max(0, brightness / 255)); // |ψ|²
                        window.particles.push({
                            x: px * 400 / img.width,
                            y: py * 400 / img.height,
                            baseX: px * 400 / img.width,
                            baseY: py * 400 / img.height,
                            offsetX: 0,
                            offsetY: 0,
                            size: 2 + probability * 4,
                            phase: Math.random() * 2 * Math.PI,
                            frequency: 0.02 * probability, // Частота зависит от |ψ|²
                            waveVector: 0.05, // k в ψ(x,t)
                            entangledPartner: Math.random() < 0.3 ? Math.floor(Math.random() * numParticlesPerCell * Math.floor(img.width / gridSize) * Math.floor(img.height / gridSize)) : null,
                            collapsed: false,
                            decompositionProgress: 0,
                            shape: ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)]
                        });

                        window.quantumStates.push({
                            r: pr,
                            g: pg,
                            b: pb,
                            a: 0, // Частицы невидимы до декогеренции
                            probability: probability,
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

// Отрисовка форм частиц с текстурой Миелго
function drawShape(sketch, x, y, size, shape, rotation, r, g, b, a) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    sketch.fill(r, g, b, a);
    if (shape === 'ribbon') {
        sketch.beginShape();
        let noiseScale = 0.1;
        sketch.vertex(-size * 1.2 + sketch.noise(x * noiseScale, y * noiseScale, window.frame * 0.01) * 2, size * 0.3);
        sketch.quadraticVertex(0, size * 0.4 + sketch.noise(x * noiseScale + 100, y * noiseScale + 100, window.frame * 0.01) * 2, size * 1.2 - sketch.noise(x * noiseScale + 200, y * noiseScale + 200, window.frame * 0.01) * 2, size * 0.3);
        sketch.quadraticVertex(0, -size * 0.4 - sketch.noise(x * noiseScale + 300, y * noiseScale + 300, window.frame * 0.01) * 2, -size * 1.2 + sketch.noise(x * noiseScale + 400, y * noiseScale + 400, window.frame * 0.01) * 2, -size * 0.3);
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

// Отрисовка волны от мыши
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
        window.terminalMessages.push(getRandomMessage('update', { 
            waveVector: (window.particles[0]?.waveVector || 0.05).toFixed(3), 
            frequency: (window.particles[0]?.frequency || 0.02).toFixed(3) 
        }));
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

    // Отображение портрета (когерентное состояние)
    if (window.currentStep === 4 && window.decompositionTimer < 2 && window.img) {
        sketch.image(window.img, 0, 0, 400, 400);
    }

    // Декогеренция на шаге 4
    if (window.currentStep === 4) {
        window.decompositionTimer += 0.015;
        if (window.decompositionTimer >= 2 && window.decompositionTimer < 5) {
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame && window.decompositionTimer < 2.015) {
                window.terminalMessages.push(getRandomMessage('decompositionStart', { 
                    phase: window.decompositionTimer.toFixed(2), 
                    probability: (window.quantumStates[0]?.probability || 1.0).toFixed(2) 
                }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
            let progress = ((window.decompositionTimer - 2) / 3 * 100).toFixed(0);
            let probability = Math.min(1, (window.decompositionTimer - 2) / 3);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('decomposition', { 
                    particleCount: window.particles.length, 
                    progress, 
                    phase: window.decompositionTimer.toFixed(2), 
                    probability: probability.toFixed(2) 
                }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 300;
                messageAddedThisFrame = true;
            }
            // Плавное появление частиц
            window.particles.forEach((p, i) => {
                let state = window.quantumStates[i];
                state.a = Math.min(255, state.a + 255 * 0.015);
                state.probability = Math.max(0.1, state.probability * (1 - 0.01)); // Декогеренция уменьшает |ψ|²
            });
            // Отрисовка "трещин" (декогеренция)
            for (let y = 0; y < 400; y += 8) {
                for (let x = 0; x < 400; x += 8) {
                    if (Math.random() < (window.decompositionTimer - 2) / 3) {
                        sketch.stroke(204, 51, 51, 120); // #cc3333
                        sketch.line(x, y, x + 8, y + 8);
                        sketch.line(x + 8, y, x, y + 8);
                    }
                }
            }
            // Скрытие портрета после декогеренции
            if (window.decompositionTimer >= 5 && window.img) {
                sketch.image(window.img, 0, 0, 400, 400, 0, 0, 0, 0);
            }
        }
    } else if (window.currentStep === 5) {
        if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
            window.terminalMessages.push(getRandomMessage('stabilized', { 
                probability: (window.quantumStates[0]?.probability || 1.0).toFixed(2) 
            }));
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

            // Декогеренция
            if (window.currentStep === 4 && window.decompositionTimer >= 2 && window.decompositionTimer < 5) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.015);
                var dx = p.x - 200;
                var dy = p.y - 200;
                var dist = Math.sqrt(dx * dx + dy * dy) + 1;
                var wave = Math.sin(dist * 0.05 + window.decompositionTimer * 2.5);
                p.offsetX += wave * 15 * (dx / dist);
                p.offsetY += wave * 15 * (dy / dist);
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'scatter', params: { entropy: (Math.log(window.particles.length) * p.decompositionProgress).toFixed(2) } });
                }
            }

            // Волновая функция (суперпозиция)
            if (!p.collapsed) {
                p.phase += p.frequency;
                let amplitude = state.probability * 6 * sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.015);
                p.offsetX += Math.cos(p.phase) * amplitude * Math.cos(p.waveVector * p.x);
                p.offsetY += Math.sin(p.phase) * amplitude * Math.cos(p.waveVector * p.y);
                p.size = 2 + 4 * state.probability * sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale);
                if (Math.random() < 0.025 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
                    potentialMessages.push({ 
                        type: 'superposition', 
                        params: { 
                            amplitude: amplitude.toFixed(2), 
                            probability: state.probability.toFixed(2), 
                            phase: p.phase.toFixed(2) 
                        } 
                    });
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

            // Влияние мыши (наблюдение)
            if (window.currentStep === 4 || window.currentStep === 5) {
                var dx = p.x - window.mouseWave.x;
                var dy = p.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                    p.offsetX += dx * influence * 0.15;
                    p.offsetY += dy * influence * 0.15;
                    state.probability *= 0.95; // Уменьшение |ψ|² при наблюдении
                    potentialMessages.push({ type: 'mouseInfluence', params: { probability: state.probability.toFixed(2) } });
                }
            }

            // Интерференция
            var interference = 0;
            window.particles.forEach(function(other, j) {
                if (i !== j) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 40 && distance > 0) {
                        var wave = Math.sin(distance * p.waveVector + state.interferencePhase + window.frame * 0.035);
                        interference += wave * 0.12;
                        if (Math.random() < 0.0025 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            sketch.stroke(204, 51, 51, 35); // #cc3333
                            sketch.line(p.x, p.y, other.x, other.y);
                            potentialMessages.push({ 
                                type: 'interference', 
                                params: { 
                                    amplitude: wave.toFixed(2), 
                                    phase: state.interferencePhase.toFixed(2), 
                                    waveVector: p.waveVector.toFixed(3) 
                                } 
                            });
                            if (typeof window.playInterference === 'function') {
                                window.playInterference(440, 445, 1.0, 0.15);
                            }
                        }
                    }
                }
            });
            p.offsetX += interference * 7;
            p.offsetY += interference * 7;

            // Туннелирование
            let tunnelProbability = Math.exp(-2 * BARRIER_WIDTH * Math.sqrt(2 * MASS * (BARRIER_HEIGHT - ENERGY)) / HBAR);
            if (Math.random() < tunnelProbability && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 30;
                sketch.stroke(204, 51, 51, 100); // #cc3333
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(204, 51, 51, 60);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.5, state.tunnelFlash * 0.5);
                console.log('Particle ' + i + ' tunneled, P=' + tunnelProbability.toFixed(6));
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ 
                        type: 'tunneling', 
                        params: { 
                            probability: tunnelProbability.toFixed(6), 
                            barrierHeight: BARRIER_HEIGHT.toExponential(2), 
                            energy: ENERGY.toExponential(2), 
                            deltaX: Math.sqrt((p.x - oldX) ** 2 + (p.y - oldY) ** 2).toFixed(2) 
                        } 
                    });
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
                    partner.waveVector = p.waveVector;
                    state.entanglementFlash = 20;
                    console.log('Entanglement: Particle ' + p.entangledPartner + ' synchronized');
                    potentialMessages.push({ 
                        type: 'entanglement', 
                        params: { 
                            phase: p.phase.toFixed(2), 
                            probability: state.probability.toFixed(2) 
                        } 
                    });
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
                sketch.fill(state.r, state.g, state.b, state.a / 3);
                sketch.ellipse(p.x, p.y, p.size + 6, p.size + 6);
                drawShape(sketch, p.x, p.y, p.size, p.shape, p.phase, state.r, state.g, state.b, state.a);
                if (state.tunnelFlash > 0) {
                    sketch.fill(204, 51, 51, state.tunnelFlash * 5); // #cc3333
                    sketch.ellipse(p.x, p.y, p.size + 5, p.size + 5);
                    state.tunnelFlash--;
                }
            }

            if (i < 5) {
                console.log('Particle ' + i + ': x=' + p.x.toFixed(2) + ', y=' + p.y.toFixed(2) + ', |ψ|²=' + state.probability.toFixed(2) + ', shape=' + p.shape);
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
        window.terminalMessages.push(getRandomMessage('mouseInfluence', { 
            probability: (window.quantumStates[0]?.probability || 1.0).toFixed(2) 
        }));
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
                    state.probability = 1.0;
                    p.size = 4;
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
                    sketch.fill(204, 51, 51, 180); // #cc3333
                    sketch.ellipse(p.x, p.y, 12, 12);
                    console.log('Particle ' + i + ' collapsed, |ψ|²=' + state.probability.toFixed(2));
                    window.terminalMessages.push(getRandomMessage('collapse', { 
                        x: p.x.toFixed(2), 
                        y: p.y.toFixed(2), 
                        probability: state.probability.toFixed(2) 
                    }));
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
                    state.probability = Math.min(1, Math.max(0.1, sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale)));
                    p.size = 2 + 4 * state.probability;
                    console.log('Particle ' + i + ' restored to superposition, |ψ|²=' + state.probability.toFixed(2));
                    window.terminalMessages.push(getRandomMessage('superpositionRestore', { 
                        probability: state.probability.toFixed(2), 
                        amplitude: (state.probability * 6).toFixed(2) 
                    }));
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
