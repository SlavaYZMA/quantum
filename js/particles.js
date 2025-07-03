console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;

// Поэтические сообщения в биологическом стиле
const messages = {
    initialize: [
        "Квантовая ткань оживает, частицы текут в пустоте.",
        "Портрет расплетается в органическом потоке.",
        "Частицы портрета пульсируют в квантовом море."
    ],
    initializeSuccess: [
        "Ткань соткана: ${validParticles} узлов дышат в гармонии.",
        "Портрет ожил: ${validParticles} квантовых существ.",
        "Квантовая жизнь: ${validParticles} частиц в движении."
    ],
    initializeError: [
        "Ошибка: ткань портрета не соткана.",
        "Квантовая жизнь не зародилась. Изображение отсутствует.",
        "Сбой: данные портрета недоступны."
    ],
    update: [
        "Квантовая ткань пульсирует, плутая в пространстве.",
        "Частицы текут, переплетаясь в квантовом поле.",
        "Органический поток портрета вибрирует."
    ],
    decomposition: [
        "${scatteredParticles} частиц растворяются в квантовом течении.",
        "Энтропия: ${scatteredParticles} узлов теряют форму.",
        "Портрет расплывается: ${scatteredParticles} частиц в потоке."
    ],
    stabilized: [
        "Квантовая ткань свободно течёт в пустоте.",
        "Портрет растворился в квантовом дыхании.",
        "Частицы плутают в свободном квантовом поле."
    ],
    scatter: [
        "Частицы текут, растворяясь в квантовом море.",
        "Квантовая ткань распадается, унося ${scatteredParticles} узлов.",
        "Энтропия растёт: частицы плутают в пустоте."
    ],
    superposition: [
        "Частица пульсирует в форме ${shape}.",
        "Суперпозиция: частица течёт как ${shape}.",
        "Квантовая жизнь: форма ${shape} оживает."
    ],
    mouseInfluence: [
        "Наблюдение вызывает рябь в квантовой ткани.",
        "Прикосновение наблюдателя направляет поток частиц.",
        "Квантовая жизнь откликается на взгляд."
    ],
    interference: [
        "Волны частиц сплетаются в тонкие узоры.",
        "Квантовая интерференция ткёт невесомые нити.",
        "Частицы вибрируют, создавая волновую гармонию."
    ],
    tunneling: [
        "Частица проскальзывает через квантовую пустоту.",
        "Квантовая нить туннелирует в новое пространство.",
        "Частица растворяется и возникает заново."
    ],
    entanglement: [
        "Запутанные нити связаны квантовым дыханием.",
        "Частицы пульсируют в унисон через пустоту.",
        "Нелокальная связь сплетает квантовые узлы."
    ],
    collapse: [
        "Наблюдение фиксирует форму ${shape}.",
        "Волновая функция застыла в ${shape}.",
        "Частица ожила в форме ${shape}."
    ],
    superpositionRestore: [
        "Частица вернулась в квантовое течение.",
        "Квантовая неопределённость оживает.",
        "Частица плутает в суперпозиции."
    ],
    error: [
        "Сбой в квантовой ткани: узел ${index} не откликнулся.",
        "Аномалия: частица ${index} потеряла связь.",
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
    const maxMessages = 5;
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
        var gridSize = 16; // Сетка 16x16 = 256 частиц
        var cellWidth = img.width / gridSize;
        var cellHeight = img.height / gridSize;
        var validParticles = 0;

        for (var i = 0; i < gridSize; i++) {
            for (var j = 0; j < gridSize; j++) {
                var x = (i + 0.5 + (Math.random() - 0.5) * 0.5) * cellWidth; // Лёгкое отклонение от сетки
                var y = (j + 0.5 + (Math.random() - 0.5) * 0.5) * cellHeight;
                var index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
                var r = img.pixels[index] || 255;
                var g = img.pixels[index + 1] || 255;
                var b = img.pixels[index + 2] || 255;
                var a = img.pixels[index + 3] || 255;
                var brightness = (r + g + b) / 3;

                // Мягкие, пастельные цвета
                r = Math.min(180, r * 0.7 + 60);
                g = Math.min(180, g * 0.7 + 60);
                b = Math.min(180, b * 0.7 + 60);

                window.particles.push({
                    x: x * 500 / img.width, // Увеличенный канвас 500x500
                    y: y * 500 / img.height,
                    baseX: x * 500 / img.width,
                    baseY: y * 500 / img.height,
                    offsetX: 0,
                    offsetY: 0,
                    size: 8, // Маленький размер для утончённости
                    phase: Math.random() * 2 * Math.PI,
                    frequency: 0.035,
                    entangledPartner: Math.random() < 0.6 ? Math.floor(Math.random() * gridSize * gridSize) : null,
                    collapsed: false,
                    hideTime: Math.random() * 4, // Распад за 4 сек
                    shape: ['amoeba', 'filament', 'pulse', 'tendril'][Math.floor(Math.random() * 4)],
                    featureWeight: brightness / 255,
                    depth: Math.random() * 0.5 + 0.5 // Глубина для 3D-эффекта
                });

                window.quantumStates.push({
                    r: r,
                    g: g,
                    b: b,
                    a: 180, // Полупрозрачность для воздушности
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

// Отрисовка органичных форм
function drawShape(sketch, x, y, size, shape, rotation, r, g, b, a, featureWeight, depth) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    let gradient = sketch.drawingContext.createRadialGradient(0, 0, 0, 0, 0, size * 1.8);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a / 255 * 0.6 * depth})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    sketch.drawingContext.fillStyle = gradient;
    sketch.drawingContext.shadowBlur = 6 * (1 + featureWeight * 0.4) * depth;
    sketch.drawingContext.shadowColor = 'rgba(255, 255, 255, 0.25)';
    if (shape === 'amoeba') {
        sketch.beginShape();
        for (let i = 0; i < 16; i++) {
            let angle = i * Math.PI / 8;
            let r = size * (0.6 + sketch.noise(x * 0.02, y * 0.02, i * 0.1) * 0.4) * depth;
            sketch.vertex(r * Math.cos(angle), r * Math.sin(angle));
        }
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'filament') {
        sketch.beginShape();
        for (let t = -size; t <= size; t += 0.3) {
            let offset = sketch.noise(x * 0.02, y * 0.02, t * 0.1 + sketch.frameCount * 0.015) * size * 0.4;
            sketch.vertex(t * depth, offset);
        }
        sketch.endShape();
    } else if (shape === 'pulse') {
        sketch.beginShape();
        for (let i = 0; i < 10; i++) {
            let angle = i * Math.PI / 5;
            let r = size * (0.5 + Math.sin(sketch.frameCount * 0.02 + i) * 0.3) * depth;
            sketch.vertex(r * Math.cos(angle), r * Math.sin(angle));
        }
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'tendril') {
        sketch.beginShape();
        for (let t = -size * 0.8; t <= size * 0.8; t += 0.2) {
            let offset = Math.cos(t * 0.5 + sketch.noise(x * 0.02, y * 0.02, sketch.frameCount * 0.02)) * size * 0.3;
            sketch.vertex(t * depth, offset);
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
    gradient.addColorStop(0, 'rgba(170, 190, 210, 0.35)');
    gradient.addColorStop(1, 'rgba(170, 190, 210, 0)');
    sketch.drawingContext.strokeStyle = gradient;
    sketch.strokeWeight(1.2);
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2);
    
    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 60 * (1 - i / window.mouseWave.trail.length);
        sketch.stroke(170, 190, 210, alpha);
        sketch.ellipse(point.x, point.y, window.mouseWave.radius * 0.3);
    });
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

    // Мягкий фон с глубиной
    let gradient = sketch.drawingContext.createLinearGradient(0, 0, 500, 500);
    gradient.addColorStop(0, 'rgba(10, 15, 20, 0.9)');
    gradient.addColorStop(1, 'rgba(5, 10, 15, 0.9)');
    sketch.drawingContext.fillStyle = gradient;
    sketch.rect(0, 0, 500, 500);

    // Счётчик распавшихся частиц
    let scatteredParticles = 0;

    // Квантовая декомпозиция на шаге 4
    if (window.currentStep === 4) {
        window.decompositionTimer += 0.0125; // ~4 секунды для распада
    }

    // Обновление волнового пакета мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 0.6);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 5) window.mouseWave.trail.shift();
    }

    let potentialMessages = [];

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];

            // Суперпозиция: блуждающее движение
            var n = sketch.noise(p.x * window.noiseScale * 0.5, p.y * window.noiseScale * 0.5, window.frame * 0.03);
            if (!p.collapsed) {
                p.phase += p.frequency;
                p.offsetX += Math.cos(p.phase + n * Math.PI) * 5 * window.chaosFactor * p.depth;
                p.offsetY += Math.sin(p.phase + n * Math.PI) * 5 * window.chaosFactor * p.depth;
                p.size = 8 * (1 + 0.2 * Math.sin(window.frame * 0.08)) * (1 + p.featureWeight * 0.2) * p.depth;
                if (Math.random() < 0.03 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    p.shape = ['amoeba', 'filament', 'pulse', 'tendril'][Math.floor(Math.random() * 4)];
                    potentialMessages.push({ type: 'superposition', params: { shape: p.shape } });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const notes = ['C4', 'D4', 'F4'];
                        const note = notes[Math.floor(Math.random() * notes.length)];
                        const freq = window.noteFrequencies[note] || 261.63;
                        window.playNote(freq, 'sine', 0.25, 0.08);
                    }
                }
            } else {
                p.offsetX *= 0.92;
                p.offsetY *= 0.92;
                p.size = 10 * p.depth; // Фиксированный размер при коллапсе
            }

            // Квантовая декомпозиция на шаге 4
            if (window.currentStep === 4 && window.decompositionTimer < 4) {
                if (window.decompositionTimer >= p.hideTime) {
                    // Плавное блуждающее движение
                    var dx = p.x - 250;
                    var dy = p.y - 250;
                    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    var angle = Math.atan2(dy, dx) + window.decompositionTimer * 1.2 + sketch.noise(p.x * 0.02, p.y * 0.02) * Math.PI;
                    var wave = Math.sin(dist * 0.15 + window.decompositionTimer * 2.5) * 15 * p.featureWeight * p.depth;
                    p.offsetX += Math.cos(angle) * wave;
                    p.offsetY += Math.sin(angle) * wave;
                    state.a = Math.max(0, 180 * (1 - (window.decompositionTimer - p.hideTime) / (4 - p.hideTime)));
                    p.size = Math.max(0, 8 * (1 - (window.decompositionTimer - p.hideTime) / (4 - p.hideTime))) * p.depth;
                    scatteredParticles++;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'scatter', params: {} });
                    }
                }
            } else if (window.currentStep === 5) {
                // Блуждающее движение в свободном поле
                var angle = sketch.noise(p.x * 0.02, p.y * 0.02, window.frame * 0.025) * Math.PI * 2;
                var wave = Math.sin(window.frame * 0.03 + p.phase) * 8 * p.depth;
                p.offsetX += Math.cos(angle) * wave * window.chaosFactor;
                p.offsetY += Math.sin(angle) * wave * window.chaosFactor;
                state.a = 180;
                p.size = 8 * (1 + 0.2 * Math.sin(window.frame * 0.08)) * p.depth;
                scatteredParticles++;
            }

            // Влияние мыши
            if (window.currentStep === 4 || window.currentStep === 5) {
                var dx = p.x - window.mouseWave.x;
                var dy = p.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed) {
                    var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                    p.offsetX += dx * influence * 0.15 * p.depth;
                    p.offsetY += dy * influence * 0.15 * p.depth;
                    p.size = 10 * (1 + influence * 0.3) * p.depth;
                    state.a = 180;
                    if (Math.random() < 0.03 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'mouseInfluence', params: {} });
                        if (typeof window.playNote === 'function' && window.noteFrequencies) {
                            const freq = window.noteFrequencies['F4'] || 349.23;
                            window.playNote(freq, 'sine', 0.2, 0.07);
                        }
                    }
                }
            }

            // Интерференция
            window.particles.forEach(function(other, j) {
                if (i !== j && Math.random() < 0.01) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 80 && p.featureWeight > 0.5 && other.featureWeight > 0.5) {
                        var wave = Math.sin(distance * 0.2 + state.interferencePhase + window.frame * 0.04);
                        if (Math.random() < 0.025 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            sketch.stroke(170, 190, 210, 40 * Math.abs(wave));
                            sketch.strokeWeight(0.8);
                            sketch.line(p.x, p.y, other.x, other.y);
                            potentialMessages.push({ type: 'interference', params: {} });
                            if (typeof window.playInterference === 'function') {
                                window.playInterference(380, 390, 0.5, 0.07);
                            }
                        }
                    }
                }
            });

            // Отталкивание от краёв
            var margin = 15;
            if (p.x < margin) p.offsetX += (margin - p.x) * 0.08;
            if (p.x > 500 - margin) p.offsetX -= (p.x - (500 - margin)) * 0.08;
            if (p.y < margin) p.offsetY += (margin - p.y) * 0.08;
            if (p.y > 500 - margin) p.offsetY -= (p.y - (500 - margin)) * 0.08;

            // Квантовое туннелирование
            if (Math.random() < 0.015 && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 500;
                p.y = Math.random() * 500;
                state.tunnelFlash = 30;
                sketch.stroke(170, 190, 210, 50);
                sketch.strokeWeight(0.8);
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(170, 190, 210, 35);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.4, state.tunnelFlash * 0.4);
                console.log('Particle ' + i + ' tunneled from x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'tunneling', params: {} });
                    if (typeof window.playTunneling === 'function') {
                        const freq = (p.x * p.y) % 300 + 160;
                        window.playTunneling(freq, 0.08, 0.15);
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
                if (Math.random() < 0.025 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    state.entanglementFlash = 15;
                    sketch.stroke(170, 190, 210, 40);
                    sketch.strokeWeight(0.8);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    potentialMessages.push({ type: 'entanglement', params: {} });
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['D4'] || 293.66;
                        window.playNote(freq, 'sine', 0.25, 0.08);
                    }
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(170, 190, 210, state.entanglementFlash * 2.5);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                }
            }

            // Обновление позиции
            p.x = Math.max(0, Math.min(500, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(500, p.baseY + p.offsetY));

            // Отрисовка частицы
            if (p.size > 0) {
                drawShape(sketch, p.x, p.y, p.size, p.shape, Math.sin(window.frame * 0.12) * 0.25, state.r, state.g, state.b, state.a, p.featureWeight, p.depth);
                if (state.tunnelFlash > 0) {
                    sketch.fill(170, 190, 210, state.tunnelFlash * 2);
                    sketch.ellipse(p.x, p.y, p.size + 5, p.size + 5);
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
    window.particles.forEach(function(p, i) {
        try {
            var dx = mouseX - p.x;
            var dy = mouseY - p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[i];

            if (distance < window.mouseInfluenceRadius && distance > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                if (!p.collapsed) {
                    p.collapsed = true;
                    state.a = 180;
                    p.size = 10 * p.depth;
                    p.shape = ['amoeba', 'filament', 'pulse', 'tendril'][Math.floor(Math.random() * 4)];
                    sketch.fill(170, 190, 210, 120);
                    sketch.ellipse(p.x, p.y, 10, 10);
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape }));
                    window.updateTerminalLog();
                    if (typeof window.playArpeggio === 'function') {
                        window.playArpeggio(p.shape);
                    }
                    window.globalMessageCooldown = 180;
                    messageAddedThisFrame = true;
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    state.a = 180;
                    p.size = 8 * (1 + 0.2 * Math.sin(window.frame * 0.08)) * p.depth;
                    console.log('Particle ' + i + ' restored to superposition, shape: ' + p.shape + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('superpositionRestore'));
                    window.updateTerminalLog();
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['D4'] || 293.66;
                        window.playNote(freq, 'sine', 0.25, 0.08);
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
};
