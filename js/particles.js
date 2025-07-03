console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [], echo: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;

// Варианты сообщений в научном стиле
const messages = {
    initialize: [
        "Инициализация квантовой системы портрета. Частицы установлены в суперпозицию.",
        "Формирование квантового портрета. Частицы готовы к декогеренции.",
        "Квантовая декомпозиция начата. Портрет фрагментирован в суперпозиции."
    ],
    initializeSuccess: [
        "Квантовая система инициализирована: ${validParticles} частиц в суперпозиции.",
        "Успешно: ${validParticles} квантовых фрагментов готовы к наблюдению.",
        "Портрет декомпозирован на ${validParticles} квантовых состояний."
    ],
    initializeError: [
        "Ошибка: квантовая система не сформирована. Отсутствуют данные портрета.",
        "Не удалось инициализировать квантовую систему. Проверьте изображение.",
        "Аномалия: данные портрета недоступны для квантовой декомпозиции."
    ],
    update: [
        "Эволюция квантовой системы портрета. Частицы в динамическом равновесии.",
        "Квантовая система портрета обновляется под воздействием наблюдения.",
        "Волновые функции частиц портрета изменяются в реальном времени."
    ],
    decomposition: [
        "${scatteredParticles} частиц портрета распалось в квантовое поле.",
        "Квантовая декогеренция: ${scatteredParticles} частиц в состоянии энтропии.",
        "Фрагментация портрета: ${scatteredParticles} частиц в квантовом хаосе."
    ],
    stabilized: [
        "Квантовая система стабилизирована. Портрет достиг хаотического равновесия.",
        "Стабилизация квантового поля завершена. Частицы свободны.",
        "Квантовое поле портрета зафиксировано в состоянии неопределённости."
    ],
    scatter: [
        "Частицы портрета рассеиваются, отражая квантовую энтропию.",
        "Квантовая система портрета демонстрирует хаотическое рассеяние.",
        "Распад портрета: частицы переходят в состояние неопределённости."
    ],
    superposition: [
        "Частица портрета в суперпозиции с формой ${shape}.",
        "Квантовая суперпозиция: частица приняла форму ${shape}.",
        "Суперпозиция частицы портрета: форма изменена на ${shape}."
    ],
    mouseInfluence: [
        "Наблюдение вызывает коллапс волновых функций частиц портрета.",
        "Волновой пакет наблюдателя формирует структуру в квантовом поле.",
        "Квантовое воздействие наблюдателя изменяет траектории частиц."
    ],
    interference: [
        "Интерференция волн частиц формирует динамические узоры портрета.",
        "Квантовая интерференция создаёт когерентные структуры в портрете.",
        "Волновая интерференция частиц портрета порождает визуальные паттерны."
    ],
    tunneling: [
        "Частица портрета туннелировала через квантовый барьер.",
        "Квантовое туннелирование: частица переместилась в новое состояние.",
        "Частица портрета преодолела барьер через туннелирование."
    ],
    entanglement: [
        "Запутанные частицы портрета демонстрируют квантовую синхронизацию.",
        "Квантовая запутанность: частицы портрета коррелированы.",
        "Запутанность вызывает синхронное изменение частиц портрета."
    ],
    collapse: [
        "Коллапс волновой функции: частица портрета в состоянии ${shape}.",
        "Наблюдение зафиксировало частицу портрета в форме ${shape}.",
        "Квантовая система: частица коллапсировала в форму ${shape}."
    ],
    superpositionRestore: [
        "Частица портрета вернулась в состояние квантовой суперпозиции.",
        "Квантовая неопределённость частицы портрета восстановлена.",
        "Суперпозиция частицы портрета активирована заново."
    ],
    error: [
        "Ошибка в квантовой системе: частица ${index} не обновлена.",
        "Квантовая аномалия: частица ${index} не изменила состояние.",
        "Сбой в обработке частицы ${index} квантовой системы портрета."
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
    window.mouseWave = { x: 0, y: 0, radius: 0, trail: [], echo: [] };
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
                    size: 14, // Базовый размер ~14 пикселей
                    phase: Math.random() * 2 * Math.PI,
                    frequency: 0.025,
                    entangledPartner: Math.random() < 0.4 ? Math.floor(Math.random() * gridSize * gridSize) : null,
                    collapsed: false,
                    hideTime: Math.random() * 4, // Случайное время распада (0–4 сек)
                    shape: ['square', 'circle', 'triangle', 'hexagon', 'star', 'spiral', 'wave', 'cluster'][Math.floor(Math.random() * 8)],
                    featureWeight: brightness / 255,
                    clusterInfluence: 0 // Для кластеризации при распаде
                });

                window.quantumStates.push({
                    r: r,
                    g: g,
                    b: b,
                    a: 255,
                    probability: 1.0,
                    tunnelFlash: 0,
                    interferencePhase: Math.random() * 2 * Math.PI,
                    entanglementFlash: 0,
                    echoPulse: 0
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
    let gradient = sketch.drawingContext.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a / 255})`);
    gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${a * 0.5 / 255})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    sketch.drawingContext.fillStyle = gradient;
    sketch.drawingContext.shadowBlur = 15 * (1 + featureWeight);
    sketch.drawingContext.shadowColor = `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)}, 0.7)`;
    
    if (shape === 'square') {
        sketch.square(-size / 2, -size / 2, size);
    } else if (shape === 'circle') {
        sketch.ellipse(0, 0, size, size);
    } else if (shape === 'triangle') {
        sketch.beginShape();
        sketch.vertex(0, -size);
        sketch.vertex(size * 0.866, size * 0.5);
        sketch.vertex(-size * 0.866, size * 0.5);
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'hexagon') {
        sketch.beginShape();
        for (let i = 0; i < 6; i++) {
            let angle = i * Math.PI / 3;
            sketch.vertex(size * Math.cos(angle), size * Math.sin(angle));
        }
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'star') {
        sketch.beginShape();
        for (let i = 0; i < 10; i++) {
            let r = i % 2 === 0 ? size : size * 0.4;
            let angle = i * Math.PI / 5;
            sketch.vertex(r * Math.cos(angle), r * Math.sin(angle));
        }
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'spiral') {
        sketch.beginShape();
        for (let t = 0; t < 2 * Math.PI; t += 0.1) {
            let r = size * 0.2 * (1 + t / (2 * Math.PI));
            sketch.vertex(r * Math.cos(t), r * Math.sin(t));
        }
        sketch.endShape();
    } else if (shape === 'wave') {
        sketch.beginShape();
        for (let x = -size; x <= size; x += 0.1) {
            let y = Math.sin(x * 0.5) * size * 0.3;
            sketch.vertex(x, y);
        }
        sketch.endShape();
    } else if (shape === 'cluster') {
        for (let i = 0; i < 5; i++) {
            let dx = (Math.random() - 0.5) * size * 0.7;
            let dy = (Math.random() - 0.5) * size * 0.7;
            sketch.ellipse(dx, dy, size * 0.3, size * 0.3);
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
    sketch.strokeWeight(4);
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2);
    
    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 150 * (1 - i / window.mouseWave.trail.length);
        sketch.stroke(200, 200, 255, alpha);
        sketch.ellipse(point.x, point.y, window.mouseWave.radius * 0.7);
    });

    // Отрисовка эха мыши
    window.mouseWave.echo.forEach((echo, i) => {
        let alpha = 100 * (1 - echo.age / 60);
        sketch.noFill();
        sketch.stroke(200, 200, 255, alpha);
        sketch.ellipse(echo.x, echo.y, echo.radius);
        echo.age++;
        echo.radius += 2;
    });
    window.mouseWave.echo = window.mouseWave.echo.filter(echo => echo.age < 60);
}

// Обновление частиц
window.updateParticles = function(sketch) {
    if (!window.quantumSketch || !window.particles || window.particles.length === 0) {
        console.error('Cannot update particles: quantumSketch: ' + !!window.quantumSketch + ', particlesLength: ' + (window.particles ? window.particles.length : 0));
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 180;
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
        window.globalMessageCooldown = 180;
        messageAddedThisFrame = true;
    }
    window.globalMessageCooldown--;
    window.frame = window.frame || 0;
    window.frame++;

    // Тёмный градиентный фон с текстурой
    let gradient = sketch.drawingContext.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, 'rgba(15, 15, 25, 0.9)');
    gradient.addColorStop(1, 'rgba(5, 5, 15, 0.9)');
    sketch.drawingContext.fillStyle = gradient;
    sketch.rect(0, 0, 400, 400);

    // Счётчик распавшихся частиц
    let scatteredParticles = 0;

    // Квантовая декомпозиция на шаге 4
    if (window.currentStep === 4) {
        window.decompositionTimer += 0.0125; // ~4 секунды для распада
    }

    // Обновление волнового пакета мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 0.8);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 12) window.mouseWave.trail.shift();
        if (Math.random() < 0.05) {
            window.mouseWave.echo.push({ x: window.mouseWave.x, y: window.mouseWave.y, radius: window.mouseWave.radius * 0.5, age: 0 });
        }
    }

    let potentialMessages = [];

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];

            // Суперпозиция: дрожание, пульсация, вариации прозрачности
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.02);
            if (!p.collapsed) {
                p.phase += p.frequency;
                p.offsetX = Math.cos(p.phase) * 8 * n * window.chaosFactor;
                p.offsetY = Math.sin(p.phase) * 8 * n * window.chaosFactor;
                p.size = 14 * (1 + 0.5 * Math.sin(window.frame * 0.15)) * (1 + p.featureWeight * 0.6);
                state.a = 255 * (0.8 + 0.2 * Math.sin(p.phase));
                if (Math.random() < 0.02 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    p.shape = ['square', 'circle', 'triangle', 'hexagon', 'star', 'spiral', 'wave', 'cluster'][Math.floor(Math.random() * 8)];
                    potentialMessages.push({ type: 'superposition', params: { shape: p.shape } });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const notes = ['C4', 'D#4', 'F4', 'G4', 'A#4'];
                        const note = notes[Math.floor(Math.random() * notes.length)];
                        const freq = window.noteFrequencies[note] || 261.63;
                        window.playNote(freq, 'sine', 0.6, 0.25);
                    }
                }
            } else {
                p.offsetX *= 0.85;
                p.offsetY *= 0.85;
                p.size = 16;
                state.a = 255;
            }

            // Квантовая декомпозиция на шаге 4
            if (window.currentStep === 4 && window.decompositionTimer < 4) {
                if (window.decompositionTimer >= p.hideTime) {
                    // Нелинейный разлёт с вихрями
                    var dx = p.x - 200;
                    var dy = p.y - 200;
                    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    var angle = Math.atan2(dy, dx) + Math.sin(window.decompositionTimer + dist * 0.05) * Math.PI;
                    var wave = Math.sin(dist * 0.1 + window.decompositionTimer * 4) * 25 * (1 + p.featureWeight);
                    p.offsetX += Math.cos(angle) * wave;
                    p.offsetY += Math.sin(angle) * wave;
                    p.clusterInfluence += 0.05; // Для кластеризации
                    state.a = Math.max(0, 255 * (1 - (window.decompositionTimer - p.hideTime) / (4 - p.hideTime)));
                    p.size = Math.max(0, 14 * (1 - (window.decompositionTimer - p.hideTime) / (4 - p.hideTime)));
                    scatteredParticles++;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'scatter', params: {} });
                    }
                }
            } else if (window.currentStep === 5) {
                // Хаотичное движение с кластеризацией
                var angle = Math.random() * 2 * Math.PI;
                var wave = Math.sin(window.frame * 0.07 + p.phase) * 20;
                p.offsetX += Math.cos(angle) * wave * window.chaosFactor;
                p.offsetY += Math.sin(angle) * wave * window.chaosFactor;
                p.clusterInfluence += 0.02;
                state.a = 255 * (0.8 + 0.2 * Math.sin(p.phase));
                p.size = 14 * (1 + 0.5 * Math.sin(window.frame * 0.15));
                scatteredParticles++;
            }

            // Кластеризация частиц
            if (p.clusterInfluence > 0.5) {
                window.particles.forEach(function(other, j) {
                    if (i !== j && Math.random() < 0.01) {
                        var dx = p.x - other.x;
                        var dy = p.y - other.y;
                        var distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 50 && distance > 0) {
                            p.offsetX += dx * 0.05 * p.clusterInfluence;
                            p.offsetY += dy * 0.05 * p.clusterInfluence;
                        }
                    }
                });
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
                    p.size = 16 * (1 + influence * 1.2);
                    state.a = 255;
                    state.echoPulse = 30;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'mouseInfluence', params: {} });
                    }
                }
                if (state.echoPulse > 0) {
                    sketch.noFill();
                    sketch.stroke(state.r, state.g, state.b, state.echoPulse * 5);
                    sketch.ellipse(p.x, p.y, p.size + state.echoPulse * 0.5);
                    state.echoPulse--;
                }
            }

            // Интерференция
            window.particles.forEach(function(other, j) {
                if (i !== j) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 120 && p.featureWeight > 0.2 && other.featureWeight > 0.2) {
                        var wave = Math.sin(distance * 0.1 + state.interferencePhase + window.frame * 0.06);
                        if (Math.random() < 0.015 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            let gradient = sketch.drawingContext.createLinearGradient(p.x, p.y, other.x, other.y);
                            gradient.addColorStop(0, `rgba(${state.r}, ${state.g}, ${state.b}, ${70 * Math.abs(wave) / 255})`);
                            gradient.addColorStop(1, `rgba(${state.r}, ${state.g}, ${state.b}, 0)`);
                            sketch.drawingContext.strokeStyle = gradient;
                            sketch.line(p.x, p.y, other.x, other.y);
                            potentialMessages.push({ type: 'interference', params: {} });
                            if (typeof window.playInterference === 'function') {
                                window.playInterference(440, 450, 1.2, 0.2);
                            }
                        }
                    }
                }
            });

            // Отталкивание от краёв
            var margin = 20;
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
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(state.r, state.g, state.b, 80);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.7, state.tunnelFlash * 0.7);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.4, state.tunnelFlash * 0.4);
                console.log('Particle ' + i + ' tunneled from x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'tunneling', params: {} });
                    if (typeof window.playTunneling === 'function') {
                        const freq = (p.x * p.y) % 440 + 220;
                        window.playTunneling(freq, 0.25, 0.35);
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
                    let gradient = sketch.drawingContext.createLinearGradient(p.x, p.y, partner.x, partner.y);
                    gradient.addColorStop(0, `rgba(${state.r}, ${state.g}, ${state.b}, 0.8)`);
                    gradient.addColorStop(1, `rgba(${state.r}, ${state.g}, ${state.b}, 0)`);
                    sketch.drawingContext.strokeStyle = gradient;
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    potentialMessages.push({ type: 'entanglement', params: {} });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['C4'] || 261.63;
                        window.playNote(freq, 'sine', 0.6, 0.25);
                    }
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(state.r, state.g, state.b, state.entanglementFlash * 6);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                }
            }

            // Обновление позиции
            p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));
            p.clusterInfluence = Math.max(0, p.clusterInfluence - 0.01);

            // Отрисовка частицы
            if (p.size > 0) {
                drawShape(sketch, p.x, p.y, p.size, p.shape, Math.sin(window.frame * 0.08) * 0.4, state.r, state.g, state.b, state.a, p.featureWeight);
                if (state.tunnelFlash > 0) {
                    sketch.fill(state.r, state.g, state.b, state.tunnelFlash * 5);
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
    if (window.currentStep === 4 && window.decompositionTimer < 4 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('decomposition', { scatteredParticles }));
        window.updateTerminalLog();
        window.globalMessageCooldown = 180;
        messageAddedThisFrame = true;
    }

    // Сообщение о стабилизации на шаге 5
    if (window.currentStep === 5 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('stabilized'));
        window.updateTerminalLog();
        if (typeof window.playStabilization === 'function') {
            window.playStabilization();
        }
        window.globalMessageCooldown = 180;
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
        window.globalMessageCooldown = 180;
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
            window.globalMessageCooldown = 180;
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
        window.globalMessageCooldown = 180;
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
            window.globalMessageCooldown = 180;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('clickParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    console.log('clickParticles called, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    let messageAddedThisFrame = false;
    let affectedParticles = [];
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
                    p.shape = ['square', 'circle', 'triangle', 'hexagon', 'star', 'spiral', 'wave', 'cluster'][Math.floor(Math.random() * 8)];
                    p.clusterInfluence = 1.0; // Запуск кластеризации
                    sketch.fill(state.r, state.g, state.b, 200);
                    sketch.ellipse(p.x, p.y, 16, 16);
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape }));
                    window.updateTerminalLog();
                    if (typeof window.playArpeggio === 'function') {
                        window.playArpeggio(p.shape);
                    }
                    window.globalMessageCooldown = 180;
                    messageAddedThisFrame = true;
                    affectedParticles.push(p);
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    state.a = 255;
                    p.size = 14 * (1 + 0.5 * Math.sin(window.frame * 0.15));
                    p.clusterInfluence = 0;
                    console.log('Particle ' + i + ' restored to superposition, shape: ' + p.shape + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('superpositionRestore'));
                    window.updateTerminalLog();
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['C4'] || 261.63;
                        window.playNote(freq, 'sine', 0.6, 0.25);
                    }
                    window.globalMessageCooldown = 180;
                    messageAddedThisFrame = true;
                }
            }
        } catch (error) {
            console.error('Error clicking particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 180;
                messageAddedThisFrame = true;
            }
        }
    });

    // Радиальный импульс при клике
    if (affectedParticles.length > 0) {
        affectedParticles.forEach(p => {
            window.mouseWave.echo.push({ x: p.x, y: p.y, radius: 10, age: 0 });
        });
    }
};
