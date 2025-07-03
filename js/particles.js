console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;

// Варианты сообщений в биологическом и поэтическом стиле
const messages = {
    initialize: [
        "Квантовая ткань портрета оживает. Частицы пульсируют в суперпозиции.",
        "Формируется органическая квантовая сеть портрета.",
        "Портрет растворяется в квантовое дыхание частиц."
    ],
    initializeSuccess: [
        "Квантовая ткань соткана: ${validParticles} частиц в гармонии.",
        "Портрет ожил: ${validParticles} квантовых узлов готовы.",
        "Квантовая сущность портрета: ${validParticles} частиц."
    ],
    initializeError: [
        "Ошибка: ткань портрета не соткана.",
        "Квантовая сеть не сформирована. Изображение отсутствует.",
        "Сбой: данные портрета недоступны."
    ],
    update: [
        "Квантовая сеть портрета пульсирует, эволюционируя.",
        "Частицы переплетаются в квантовом танце.",
        "Органическая структура портрета вибрирует."
    ],
    decomposition: [
        "${scatteredParticles} частиц растворяются в квантовом потоке.",
        "Декогеренция: ${scatteredParticles} узлов теряют связь.",
        "Портрет расплетается: ${scatteredParticles} фрагментов в движении."
    ],
    stabilized: [
        "Квантовая сеть стабилизирована в свободном потоке.",
        "Портрет растворился в квантовом дыхании.",
        "Частицы обрели свободу в квантовом поле."
    ],
    scatter: [
        "Частицы текут, растворяясь в квантовом море.",
        "Энтропия растёт: частицы портрета расплетаются.",
        "Квантовая ткань распадается, унося ${scatteredParticles} узлов."
    ],
    superposition: [
        "Частица вибрирует в форме ${shape}.",
        "Суперпозиция: частица течёт в ${shape}.",
        "Квантовая пульсация: форма ${shape}."
    ],
    mouseInfluence: [
        "Наблюдение волнует квантовую ткань.",
        "Прикосновение наблюдателя вызывает рябь в частицах.",
        "Квантовая сеть откликается на взгляд."
    ],
    interference: [
        "Волны частиц сплетаются в узоры.",
        "Квантовая интерференция ткёт когерентные нити.",
        "Частицы вибрируют, создавая волновую гармонию."
    ],
    tunneling: [
        "Частица проскальзывает через квантовый барьер.",
        "Квантовая нить туннелирует в новое состояние.",
        "Частица растворяется и возникает заново."
    ],
    entanglement: [
        "Запутанные нити связаны квантовой гармонией.",
        "Частицы пульсируют в унисон через квантовую связь.",
        "Нелокальная связь сплетает частицы."
    ],
    collapse: [
        "Наблюдение фиксирует форму ${shape}.",
        "Волновая функция коллапсировала в ${shape}.",
        "Частица застыла в форме ${shape}."
    ],
    superpositionRestore: [
        "Частица вернулась в квантовую пульсацию.",
        "Квантовая неопределённость восстановлена.",
        "Частица течёт в суперпозиции."
    ],
    error: [
        "Сбой в квантовой ткани: узел ${index} не обновлён.",
        "Аномалия: частица ${index} не откликнулась.",
        "Ошибка: квантовая нить ${index} разорвана."
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
    const maxMessages = 6;
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
        var gridSize = 18; // Сетка 18x18 = 324 частицы
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

                // Приглушённые цвета
                r = Math.min(200, r * 0.8 + 50);
                g = Math.min(200, g * 0.8 + 50);
                b = Math.min(200, b * 0.8 + 50);

                window.particles.push({
                    x: x * 400 / img.width,
                    y: y * 400 / img.height,
                    baseX: x * 400 / img.width,
                    baseY: y * 400 / img.height,
                    offsetX: 0,
                    offsetY: 0,
                    size: 10, // Меньший размер для утончённости
                    phase: Math.random() * 2 * Math.PI,
                    frequency: 0.03,
                    entangledPartner: Math.random() < 0.5 ? Math.floor(Math.random() * gridSize * gridSize) : null,
                    collapsed: false,
                    hideTime: Math.random() * 3, // Распад за 3 сек
                    shape: ['fiber', 'cell', 'neuron', 'wave'][Math.floor(Math.random() * 4)],
                    featureWeight: brightness / 255
                });

                window.quantumStates.push({
                    r: r,
                    g: g,
                    b: b,
                    a: 200, // Полупрозрачность для мягкости
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

// Отрисовка биологических форм
function drawShape(sketch, x, y, size, shape, rotation, r, g, b, a, featureWeight) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    let gradient = sketch.drawingContext.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a / 255 * 0.7})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    sketch.drawingContext.fillStyle = gradient;
    sketch.drawingContext.shadowBlur = 8 * (1 + featureWeight * 0.5);
    sketch.drawingContext.shadowColor = 'rgba(255, 255, 255, 0.3)';
    if (shape === 'fiber') {
        sketch.beginShape();
        for (let t = -size; t <= size; t += 0.2) {
            let offset = Math.sin(t * 0.5 + sketch.noise(x * 0.01, y * 0.01, sketch.frameCount * 0.02)) * size * 0.3;
            sketch.vertex(t, offset);
        }
        sketch.endShape();
    } else if (shape === 'cell') {
        sketch.beginShape();
        for (let i = 0; i < 12; i++) {
            let angle = i * Math.PI / 6;
            let r = size * (0.7 + sketch.noise(x * 0.01, y * 0.01, i) * 0.3);
            sketch.vertex(r * Math.cos(angle), r * Math.sin(angle));
        }
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'neuron') {
        sketch.beginShape();
        sketch.vertex(0, -size * 0.8);
        sketch.quadraticVertex(size * 0.4, 0, 0, size * 0.8);
        sketch.quadraticVertex(-size * 0.4, 0, 0, -size * 0.8);
        sketch.endShape(sketch.CLOSE);
        sketch.ellipse(0, 0, size * 0.3, size * 0.3);
    } else if (shape === 'wave') {
        sketch.beginShape();
        for (let t = -size; t <= size; t += 0.3) {
            let offset = Math.cos(t * 0.4 + sketch.noise(x * 0.01, y * 0.01, sketch.frameCount * 0.03)) * size * 0.4;
            sketch.vertex(t, offset);
        }
        sketch.endShape();
    }
    sketch.drawingContext.shadowBlur = 0;
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
    gradient.addColorStop(0, 'rgba(180, 200, 220, 0.4)');
    gradient.addColorStop(1, 'rgba(180, 200, 220, 0)');
    sketch.drawingContext.strokeStyle = gradient;
    sketch.strokeWeight(1.5);
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2);
    
    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 80 * (1 - i / window.mouseWave.trail.length);
        sketch.stroke(180, 200, 220, alpha);
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
            window.globalMessageCooldown = 150;
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
        window.globalMessageCooldown = 150;
        messageAddedThisFrame = true;
    }
    window.globalMessageCooldown--;
    window.frame = window.frame || 0;
    window.frame++;

    // Мягкий фон
    let gradient = sketch.drawingContext.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, 'rgba(15, 20, 25, 0.85)');
    gradient.addColorStop(1, 'rgba(5, 10, 15, 0.85)');
    sketch.drawingContext.fillStyle = gradient;
    sketch.rect(0, 0, 400, 400);

    // Счётчик распавшихся частиц
    let scatteredParticles = 0;

    // Квантовая декомпозиция на шаге 4
    if (window.currentStep === 4) {
        window.decompositionTimer += 0.0167; // ~3 секунды для распада
    }

    // Обновление волнового пакета мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 0.7);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 6) window.mouseWave.trail.shift();
    }

    let potentialMessages = [];

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];

            // Суперпозиция: мягкое колебание
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.025);
            if (!p.collapsed) {
                p.phase += p.frequency;
                p.offsetX = Math.cos(p.phase) * 4 * n * window.chaosFactor;
                p.offsetY = Math.sin(p.phase) * 4 * n * window.chaosFactor;
                p.size = 10 * (1 + 0.25 * Math.sin(window.frame * 0.1)) * (1 + p.featureWeight * 0.3);
                if (Math.random() < 0.025 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    p.shape = ['fiber', 'cell', 'neuron', 'wave'][Math.floor(Math.random() * 4)];
                    potentialMessages.push({ type: 'superposition', params: { shape: p.shape } });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const notes = ['C4', 'E4', 'G4'];
                        const note = notes[Math.floor(Math.random() * notes.length)];
                        const freq = window.noteFrequencies[note] || 261.63;
                        window.playNote(freq, 'sine', 0.3, 0.1);
                    }
                }
            } else {
                p.offsetX *= 0.9;
                p.offsetY *= 0.9;
                p.size = 12; // Фиксированный размер при коллапсе
            }

            // Квантовая декомпозиция на шаге 4
            if (window.currentStep === 4 && window.decompositionTimer < 3) {
                if (window.decompositionTimer >= p.hideTime) {
                    // Плавное вихревое движение
                    var dx = p.x - 200;
                    var dy = p.y - 200;
                    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    var angle = Math.atan2(dy, dx) + window.decompositionTimer * 1.5;
                    var wave = Math.sin(dist * 0.12 + window.decompositionTimer * 3) * 20 * p.featureWeight;
                    p.offsetX += Math.cos(angle) * wave;
                    p.offsetY += Math.sin(angle) * wave;
                    state.a = Math.max(0, 200 * (1 - (window.decompositionTimer - p.hideTime) / (3 - p.hideTime)));
                    p.size = Math.max(0, 10 * (1 - (window.decompositionTimer - p.hideTime) / (3 - p.hideTime)));
                    scatteredParticles++;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'scatter', params: {} });
                    }
                }
            } else if (window.currentStep === 5) {
                // Плавное движение с органическими вихрями
                var angle = Math.atan2(p.y - 200, p.x - 200) + sketch.noise(p.x * 0.015, p.y * 0.015, window.frame * 0.02) * Math.PI;
                var wave = Math.sin(window.frame * 0.04 + p.phase) * 10;
                p.offsetX += Math.cos(angle) * wave * window.chaosFactor;
                p.offsetY += Math.sin(angle) * wave * window.chaosFactor;
                state.a = 200;
                p.size = 10 * (1 + 0.25 * Math.sin(window.frame * 0.1));
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
                    p.size = 12 * (1 + influence * 0.4);
                    state.a = 200;
                    if (Math.random() < 0.025 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'mouseInfluence', params: {} });
                        if (typeof window.playNote === 'function' && window.noteFrequencies) {
                            const freq = window.noteFrequencies['G4'] || 392;
                            window.playNote(freq, 'sine', 0.25, 0.08);
                        }
                    }
                }
            }

            // Интерференция
            window.particles.forEach(function(other, j) {
                if (i !== j && Math.random() < 0.015) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100 && p.featureWeight > 0.4 && other.featureWeight > 0.4) {
                        var wave = Math.sin(distance * 0.15 + state.interferencePhase + window.frame * 0.05);
                        if (Math.random() < 0.02 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            sketch.stroke(180, 200, 220, 50 * Math.abs(wave));
                            sketch.strokeWeight(1);
                            sketch.line(p.x, p.y, other.x, other.y);
                            potentialMessages.push({ type: 'interference', params: {} });
                            if (typeof window.playInterference === 'function') {
                                window.playInterference(400, 410, 0.6, 0.08);
                            }
                        }
                    }
                }
            });

            // Отталкивание от краёв
            var margin = 10;
            if (p.x < margin) p.offsetX += (margin - p.x) * 0.1;
            if (p.x > 400 - margin) p.offsetX -= (p.x - (400 - margin)) * 0.1;
            if (p.y < margin) p.offsetY += (margin - p.y) * 0.1;
            if (p.y > 400 - margin) p.offsetY -= (p.y - (400 - margin)) * 0.1;

            // Квантовое туннелирование
            if (Math.random() < 0.012 && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 40;
                sketch.stroke(180, 200, 220, 60);
                sketch.strokeWeight(1);
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(180, 200, 220, 40);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.5, state.tunnelFlash * 0.5);
                console.log('Particle ' + i + ' tunneled from x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'tunneling', params: {} });
                    if (typeof window.playTunneling === 'function') {
                        const freq = (p.x * p.y) % 350 + 180;
                        window.playTunneling(freq, 0.1, 0.2);
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
                if (Math.random() < 0.02 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    state.entanglementFlash = 20;
                    sketch.stroke(180, 200, 220, 50);
                    sketch.strokeWeight(1);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    potentialMessages.push({ type: 'entanglement', params: {} });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['E4'] || 329.63;
                        window.playNote(freq, 'sine', 0.3, 0.1);
                    }
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(180, 200, 220, state.entanglementFlash * 3);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                }
            }

            // Обновление позиции
            p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));

            // Отрисовка частицы
            if (p.size > 0) {
                drawShape(sketch, p.x, p.y, p.size, p.shape, Math.sin(window.frame * 0.1) * 0.3, state.r, state.g, state.b, state.a, p.featureWeight);
                if (state.tunnelFlash > 0) {
                    sketch.fill(180, 200, 220, state.tunnelFlash * 3);
                    sketch.ellipse(p.x, p.y, p.size + 6, p.size + 6);
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
        window.globalMessageCooldown = 150;
        messageAddedThisFrame = true;
    }

    // Сообщение о стабилизации на шаге 5
    if (window.currentStep === 5 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('stabilized'));
        window.updateTerminalLog();
        if (typeof window.playStabilization === 'function') {
            window.playStabilization();
        }
        window.globalMessageCooldown = 150;
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
        window.globalMessageCooldown = 150;
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
            window.globalMessageCooldown = 150;
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
        window.globalMessageCooldown = 150;
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
            window.globalMessageCooldown = 150;
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
                    p.size = 12;
                    p.shape = ['fiber', 'cell', 'neuron', 'wave'][Math.floor(Math.random() * 4)];
                    sketch.fill(180, 200, 220, 150);
                    sketch.ellipse(p.x, p.y, 12, 12);
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape }));
                    window.updateTerminalLog();
                    if (typeof window.playArpeggio === 'function') {
                        window.playArpeggio(p.shape);
                    }
                    window.globalMessageCooldown = 150;
                    messageAddedThisFrame = true;
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    state.a = 200;
                    p.size = 10 * (1 + 0.25 * Math.sin(window.frame * 0.1));
                    console.log('Particle ' + i + ' restored to superposition, shape: ' + p.shape + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('superpositionRestore'));
                    window.updateTerminalLog();
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['E4'] || 329.63;
                        window.playNote(freq, 'sine', 0.3, 0.1);
                    }
                    window.globalMessageCooldown = 150;
                    messageAddedThisFrame = true;
                }
            }
        } catch (error) {
            console.error('Error clicking particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 150;
                messageAddedThisFrame = true;
            }
        }
    });
};
