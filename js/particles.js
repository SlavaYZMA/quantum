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
        "Инициализация квантовой системы портрета. Частицы в суперпозиции.",
        "Формирование квантового портрета. Частицы готовы к наблюдению.",
        "Квантовая декомпозиция портрета начата."
    ],
    initializeSuccess: [
        "Система инициализирована: ${validParticles} частиц в суперпозиции.",
        "Успешная инициализация: ${validParticles} квантовых состояний.",
        "Портрет декомпозирован на ${validParticles} частиц."
    ],
    initializeError: [
        "Ошибка: квантовая система портрета не сформирована.",
        "Не удалось инициализировать. Изображение не загружено.",
        "Ошибка: данные изображения недоступны."
    ],
    update: [
        "Квантовая система портрета эволюционирует.",
        "Частицы взаимодействуют в квантовом поле.",
        "Волновые функции частиц обновляются."
    ],
    decomposition: [
        "${scatteredParticles} частиц распалось в квантовое поле.",
        "Декогеренция: ${scatteredParticles} частиц потеряли структуру.",
        "Декомпозиция: ${scatteredParticles} фрагментов в хаосе."
    ],
    stabilized: [
        "Квантовая система стабилизирована.",
        "Портрет перешёл в свободное квантовое состояние.",
        "Наблюдение зафиксировало квантовый хаос."
    ],
    scatter: [
        "Частицы портрета рассеиваются в квантовом поле.",
        "Квантовая энтропия возрастает. Частицы рассеяны.",
        "Рассеяние частиц усиливает неопределённость."
    ],
    superposition: [
        "Частица в суперпозиции с формой ${shape}.",
        "Квантовая суперпозиция: форма ${shape}.",
        "Частица приняла состояние ${shape}."
    ],
    mouseInfluence: [
        "Наблюдение возмущает волновые функции частиц.",
        "Квантовая интерференция под воздействием наблюдателя.",
        "Мышь изменяет квантовые траектории."
    ],
    interference: [
        "Интерференция волн формирует узоры портрета.",
        "Квантовая интерференция создаёт когерентные структуры.",
        "Волновые узоры частиц портрета усиливаются."
    ],
    tunneling: [
        "Частица осуществила квантовое туннелирование.",
        "Туннелирование: частица переместилась через барьер.",
        "Квантовая частица совершила прыжок."
    ],
    entanglement: [
        "Запутанные частицы демонстрируют корреляцию.",
        "Квантовая запутанность синхронизирует состояния.",
        "Нелокальная связь частиц портрета."
    ],
    collapse: [
        "Коллапс волновой функции в состояние ${shape}.",
        "Наблюдение зафиксировало форму ${shape}.",
        "Частица коллапсировала в ${shape}."
    ],
    superpositionRestore: [
        "Частица восстановлена в суперпозицию.",
        "Квантовая неопределённость частицы восстановлена.",
        "Частица вернулась в суперпозицию."
    ],
    error: [
        "Ошибка: частица ${index} не обновлена.",
        "Квантовая аномалия: частица ${index} не обработана.",
        "Сбой в квантовой системе: частица ${index}."
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
    const maxMessages = 8;
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
        var gridSize = 20; // Сетка 20x20 = 400 частиц
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

                window.particles.push({
                    x: x * 400 / img.width,
                    y: y * 400 / img.height,
                    baseX: x * 400 / img.width,
                    baseY: y * 400 / img.height,
                    offsetX: 0,
                    offsetY: 0,
                    size: 14, // Размер частицы ~14 пикселей
                    phase: Math.random() * 2 * Math.PI,
                    frequency: 0.025,
                    entangledPartner: Math.random() < 0.4 ? Math.floor(Math.random() * gridSize * gridSize) : null,
                    collapsed: false,
                    hideTime: Math.random() * 2.5, // Распад за 2.5 сек
                    shape: ['triangle', 'spiral', 'star', 'cluster'][Math.floor(Math.random() * 4)],
                    featureWeight: brightness / 255
                });

                window.quantumStates.push({
                    r: r,
                    g: g,
                    b: b,
                    a: 255,
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

// Отрисовка форм
function drawShape(sketch, x, y, size, shape, rotation, r, g, b, a, featureWeight) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    let gradient = sketch.drawingContext.createRadialGradient(0, 0, 0, 0, 0, size * 1.3);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a / 255})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    sketch.drawingContext.fillStyle = gradient;
    sketch.drawingContext.shadowBlur = 10 * (1 + featureWeight);
    sketch.drawingContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
    if (shape === 'triangle') {
        sketch.beginShape();
        sketch.vertex(0, -size * 0.8);
        sketch.vertex(size * 0.9, size * 0.7);
        sketch.vertex(-size * 0.7, size * 0.6);
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'spiral') {
        sketch.beginShape();
        for (let t = 0; t < Math.PI * 2; t += 0.2) {
            let r = size * 0.3 * (1 + t / (Math.PI * 2));
            sketch.vertex(r * Math.cos(t), r * Math.sin(t));
        }
        sketch.endShape();
    } else if (shape === 'star') {
        sketch.beginShape();
        for (let i = 0; i < 8; i++) {
            let r = i % 2 === 0 ? size * 0.9 : size * 0.4;
            let angle = i * Math.PI / 4;
            sketch.vertex(r * Math.cos(angle), r * Math.sin(angle));
        }
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'cluster') {
        for (let i = 0; i < 3; i++) {
            let dx = (Math.random() - 0.5) * size * 0.7;
            let dy = (Math.random() - 0.5) * size * 0.7;
            sketch.ellipse(dx, dy, size * 0.5, size * 0.5 * (0.7 + Math.random() * 0.3));
        }
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
    gradient.addColorStop(0, 'rgba(200, 200, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
    sketch.drawingContext.strokeStyle = gradient;
    sketch.strokeWeight(2);
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2);
    
    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 100 * (1 - i / window.mouseWave.trail.length);
        sketch.stroke(200, 200, 255, alpha);
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
            window.globalMessageCooldown = 120;
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
        window.globalMessageCooldown = 120;
        messageAddedThisFrame = true;
    }
    window.globalMessageCooldown--;
    window.frame = window.frame || 0;
    window.frame++;

    // Тёмный фон с мягким градиентом
    let gradient = sketch.drawingContext.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, 'rgba(10, 10, 20, 0.8)');
    gradient.addColorStop(1, 'rgba(5, 5, 15, 0.8)');
    sketch.drawingContext.fillStyle = gradient;
    sketch.rect(0, 0, 400, 400);

    // Счётчик распавшихся частиц
    let scatteredParticles = 0;

    // Квантовая декомпозиция на шаге 4
    if (window.currentStep === 4) {
        window.decompositionTimer += 0.02; // ~2.5 секунды для распада
    }

    // Обновление волнового пакета мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 0.8);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 8) window.mouseWave.trail.shift();
    }

    let potentialMessages = [];

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];

            // Суперпозиция: мягкое дрожание
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.02);
            if (!p.collapsed) {
                p.phase += p.frequency;
                p.offsetX = Math.cos(p.phase) * 5 * n * window.chaosFactor;
                p.offsetY = Math.sin(p.phase) * 5 * n * window.chaosFactor;
                p.size = 14 * (1 + 0.3 * Math.sin(window.frame * 0.15)) * (1 + p.featureWeight * 0.4);
                if (Math.random() < 0.02 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    p.shape = ['triangle', 'spiral', 'star', 'cluster'][Math.floor(Math.random() * 4)];
                    potentialMessages.push({ type: 'superposition', params: { shape: p.shape } });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const notes = ['C4', 'E4', 'G4', 'B4'];
                        const note = notes[Math.floor(Math.random() * notes.length)];
                        const freq = window.noteFrequencies[note] || 261.63;
                        window.playNote(freq, 'sine', 0.4, 0.15);
                    }
                }
            } else {
                p.offsetX *= 0.85;
                p.offsetY *= 0.85;
                p.size = 16; // Фиксированный размер при коллапсе
            }

            // Квантовая декомпозиция на шаге 4
            if (window.currentStep === 4 && window.decompositionTimer < 2.5) {
                if (window.decompositionTimer >= p.hideTime) {
                    // Вихревое движение
                    var dx = p.x - 200;
                    var dy = p.y - 200;
                    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    var angle = Math.atan2(dy, dx) + window.decompositionTimer * 2;
                    var wave = Math.sin(dist * 0.1 + window.decompositionTimer * 4) * 25 * p.featureWeight;
                    p.offsetX += Math.cos(angle) * wave;
                    p.offsetY += Math.sin(angle) * wave;
                    state.a = Math.max(0, 255 * (1 - (window.decompositionTimer - p.hideTime) / (2.5 - p.hideTime)));
                    p.size = Math.max(0, 14 * (1 - (window.decompositionTimer - p.hideTime) / (2.5 - p.hideTime)));
                    scatteredParticles++;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'scatter', params: {} });
                    }
                }
            } else if (window.currentStep === 5) {
                // Свободное движение с вихрями
                var angle = Math.atan2(p.y - 200, p.x - 200) + sketch.noise(p.x * 0.01, p.y * 0.01, window.frame * 0.03) * Math.PI;
                var wave = Math.sin(window.frame * 0.05 + p.phase) * 12;
                p.offsetX += Math.cos(angle) * wave * window.chaosFactor;
                p.offsetY += Math.sin(angle) * wave * window.chaosFactor;
                state.a = 255;
                p.size = 14 * (1 + 0.3 * Math.sin(window.frame * 0.15));
                scatteredParticles++;
            }

            // Влияние мыши
            if (window.currentStep === 4 || window.currentStep === 5) {
                var dx = p.x - window.mouseWave.x;
                var dy = p.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed) {
                    var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                    p.offsetX += dx * influence * 0.3;
                    p.offsetY += dy * influence * 0.3;
                    p.size = 16 * (1 + influence * 0.5);
                    state.a = 255;
                    if (Math.random() < 0.02 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'mouseInfluence', params: {} });
                        if (typeof window.playNote === 'function' && window.noteFrequencies) {
                            const freq = window.noteFrequencies['G4'] || 392;
                            window.playNote(freq, 'sine', 0.3, 0.1);
                        }
                    }
                }
            }

            // Интерференция
            window.particles.forEach(function(other, j) {
                if (i !== j && Math.random() < 0.02) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 120 && p.featureWeight > 0.3 && other.featureWeight > 0.3) {
                        var wave = Math.sin(distance * 0.1 + state.interferencePhase + window.frame * 0.06);
                        if (Math.random() < 0.015 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            sketch.stroke(state.r, state.g, state.b, 70 * Math.abs(wave));
                            sketch.strokeWeight(1.5);
                            sketch.line(p.x, p.y, other.x, other.y);
                            potentialMessages.push({ type: 'interference', params: {} });
                            if (typeof window.playInterference === 'function') {
                                window.playInterference(440, 450, 0.8, 0.1);
                            }
                        }
                    }
                }
            });

            // Отталкивание от краёв
            var margin = 15;
            if (p.x < margin) p.offsetX += (margin - p.x) * 0.15;
            if (p.x > 400 - margin) p.offsetX -= (p.x - (400 - margin)) * 0.15;
            if (p.y < margin) p.offsetY += (margin - p.y) * 0.15;
            if (p.y > 400 - margin) p.offsetY -= (p.y - (400 - margin)) * 0.15;

            // Квантовое туннелирование
            if (Math.random() < 0.01 && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 60;
                sketch.stroke(state.r, state.g, state.b, 120);
                sketch.strokeWeight(2);
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(state.r, state.g, state.b, 80);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.7, state.tunnelFlash * 0.7);
                console.log('Particle ' + i + ' tunneled from x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'tunneling', params: {} });
                    if (typeof window.playTunneling === 'function') {
                        const freq = (p.x * p.y) % 400 + 200;
                        window.playTunneling(freq, 0.15, 0.25);
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
                if (Math.random() < 0.015 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    state.entanglementFlash = 30;
                    sketch.stroke(state.r, state.g, state.b, 80);
                    sketch.strokeWeight(1.5);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    potentialMessages.push({ type: 'entanglement', params: {} });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['E4'] || 329.63;
                        window.playNote(freq, 'sine', 0.4, 0.15);
                    }
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(state.r, state.g, state.b, state.entanglementFlash * 4);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                }
            }

            // Обновление позиции
            p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));

            // Отрисовка частицы
            if (p.size > 0) {
                drawShape(sketch, p.x, p.y, p.size, p.shape, Math.sin(window.frame * 0.08) * 0.4, state.r, state.g, state.b, state.a, p.featureWeight);
                if (state.tunnelFlash > 0) {
                    sketch.fill(state.r, state.g, state.b, state.tunnelFlash * 4);
                    sketch.ellipse(p.x, p.y, p.size + 8, p.size + 8);
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
    if (window.currentStep === 4 && window.decompositionTimer < 2.5 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('decomposition', { scatteredParticles }));
        window.updateTerminalLog();
        window.globalMessageCooldown = 120;
        messageAddedThisFrame = true;
    }

    // Сообщение о стабилизации на шаге 5
    if (window.currentStep === 5 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('stabilized'));
        window.updateTerminalLog();
        if (typeof window.playStabilization === 'function') {
            window.playStabilization();
        }
        window.globalMessageCooldown = 120;
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
        window.globalMessageCooldown = 120;
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
            window.globalMessageCooldown = 120;
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
        window.globalMessageCooldown = 120;
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
            window.globalMessageCooldown = 120;
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
                    p.size = 16;
                    p.shape = ['triangle', 'spiral', 'star', 'cluster'][Math.floor(Math.random() * 4)];
                    sketch.fill(state.r, state.g, state.b, 200);
                    sketch.ellipse(p.x, p.y, 16, 16);
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape }));
                    window.updateTerminalLog();
                    if (typeof window.playArpeggio === 'function') {
                        window.playArpeggio(p.shape);
                    }
                    window.globalMessageCooldown = 120;
                    messageAddedThisFrame = true;
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    state.a = 255;
                    p.size = 14 * (1 + 0.3 * Math.sin(window.frame * 0.15));
                    console.log('Particle ' + i + ' restored to superposition, shape: ' + p.shape + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('superpositionRestore'));
                    window.updateTerminalLog();
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['E4'] || 329.63;
                        window.playNote(freq, 'sine', 0.4, 0.15);
                    }
                    window.globalMessageCooldown = 120;
                    messageAddedThisFrame = true;
                }
            }
        } catch (error) {
            console.error('Error clicking particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 120;
                messageAddedThisFrame = true;
            }
        }
    });
};
