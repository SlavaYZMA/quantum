console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [], speed: 0 };
window.terminalMessages = [];
window.globalMessageCooldown = 0;

// Обновлённые сообщения в научном стиле
const messages = {
    initialize: [
        "Запуск квантовой декомпозиции портрета. Система в суперпозиции.",
        "Инициализация квантовой матрицы портрета. Частицы синхронизированы.",
        "Квантовая система портрета активирована. Наблюдение инициировано."
    ],
    initializeSuccess: [
        "Система инициализирована: ${validParticles} квантовых частиц в суперпозиции.",
        "Успешная декомпозиция: ${validParticles} частиц готовы к наблюдению.",
        "Квантовая матрица портрета сформирована: ${validParticles} состояний."
    ],
    initializeError: [
        "Ошибка: квантовая система не инициализирована. Требуется изображение.",
        "Аномалия в декомпозиции: данные портрета недоступны.",
        "Критическая ошибка: квантовая матрица не сформирована."
    ],
    update: [
        "Эволюция волновых функций частиц в квантовом поле портрета.",
        "Квантовая система портрета обновляется под воздействием наблюдения.",
        "Частицы портрета синхронизируются с квантовым полем."
    ],
    decomposition: [
        "Квантовая декогеренция портрета: прозрачность ${imgAlpha}/255.",
        "Изображение растворяется в квантовом поле: прозрачность ${imgAlpha}/255.",
        "Декомпозиция портрета: прозрачность достигла ${imgAlpha}/255."
    ],
    stabilized: [
        "Квантовая матрица портрета стабилизирована. Состояния фиксированы.",
        "Система портрета достигла когерентности. Наблюдение завершено.",
        "Квантовая структура портрета сформирована и стабилизирована."
    ],
    scatter: [
        "Частицы портрета рассеиваются, увеличивая квантовую энтропию.",
        "Квантовая система демонстрирует хаотическое рассеяние частиц.",
        "Энтропия портрета возрастает: частицы в суперпозиции."
    ],
    superposition: [
        "Частица в суперпозиции с формой ${shape}.",
        "Квантовая неопределённость: частица в состоянии ${shape}.",
        "Суперпозиция частицы портрета: форма ${shape}."
    ],
    mouseInfluence: [
        "Наблюдение вызывает коллапс волновой функции в области частиц.",
        "Волновой пакет наблюдателя влияет на квантовую систему портрета.",
        "Квантовая интерференция инициирована наблюдением пользователя."
    ],
    featureAttraction: [
        "Частицы локализуются у ключевых точек лица портрета.",
        "Квантовая система формирует структуру лица через притяжение.",
        "Частицы портрета притягиваются к координатам лица."
    ],
    interference: [
        "Интерференция волн формирует когерентные узоры в портрете.",
        "Квантовая интерференция: частицы синхронизируют состояния.",
        "Волновая интерференция изменяет структуру квантовой системы."
    ],
    tunneling: [
        "Квантовая частица осуществила туннелирование через барьер.",
        "Туннелирование частицы портрета в новое квантовое состояние.",
        "Частица портрета преодолела потенциальный барьер."
    ],
    entanglement: [
        "Запутанные частицы портрета демонстрируют нелокальную корреляцию.",
        "Квантовая запутанность синхронизирует состояния частиц.",
        "Запутанность частиц вызывает когерентное изменение портрета."
    ],
    collapse: [
        "Коллапс волновой функции: частица в состоянии ${shape}.",
        "Наблюдение зафиксировало частицу портрета в форме ${shape}.",
        "Квантовая система: частица коллапсировала в ${shape}."
    ],
    cascadeCollapse: [
        "Каскадный коллапс волновых функций в области наблюдения.",
        "Наблюдение вызвало цепную реакцию в квантовой системе.",
        "Квантовая матрица портрета претерпела каскадный коллапс."
    ],
    superpositionRestore: [
        "Частица восстановлена в состояние квантовой суперпозиции.",
        "Квантовая неопределённость частицы портрета восстановлена.",
        "Суперпозиция частицы портрета активирована заново."
    ],
    error: [
        "Ошибка в квантовой системе: частица ${index} не обновлена.",
        "Аномалия: частица ${index} не изменила квантовое состояние.",
        "Критическая ошибка: частица ${index} не обработана."
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
            `<div class="${msg.includes('туннелирование') || msg.includes('tunneling') ? 'tunneling' : msg.includes('интерфери') || msg.includes('interference') ? 'interference' : ''}">${msg}</div>`
        ).join('');
        terminalDiv.scrollTop = terminalDiv.scrollHeight;
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
    window.mouseWave = { x: 0, y: 0, radius: 0, trail: [], speed: 0 };
    window.globalMessageCooldown = 0;
    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty or not loaded');
            window.terminalMessages.push(getRandomMessage('initializeError'));
            window.updateTerminalLog();
            return;
        }
        var numParticles = 200; // Снижено для оптимизации
        var validParticles = 0;

        // Ключевые точки лица (усилены веса для большей локализации)
        var faceFeatures = [
            { x: img.width * 0.35, y: img.height * 0.3, weight: 0.6 }, // Левый глаз
            { x: img.width * 0.65, y: img.height * 0.3, weight: 0.6 }, // Правый глаз
            { x: img.width * 0.5, y: img.height * 0.5, weight: 0.5 }, // Нос
            { x: img.width * 0.5, y: img.height * 0.7, weight: 0.5 }  // Рот
        ];

        for (var i = 0; i < numParticles; i++) {
            var x, y, brightness;
            var useFeature = Math.random() < 0.7; // Увеличена вероятность привязки к лицу
            if (useFeature) {
                var feature = faceFeatures[Math.floor(Math.random() * faceFeatures.length)];
                x = feature.x + (Math.random() - 0.5) * img.width * 0.1;
                y = feature.y + (Math.random() - 0.5) * img.height * 0.1;
            } else {
                do {
                    x = Math.random() * img.width;
                    y = Math.random() * img.height;
                    var index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
                    brightness = (img.pixels[index] + img.pixels[index + 1] + img.pixels[index + 2]) / 3;
                } while (brightness < 50 && Math.random() > 0.2);
            }
            if (x >= 0 && x < img.width && y >= 0 && y < img.height) {
                var index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
                var r = img.pixels[index] || 255;
                var g = img.pixels[index + 1] || 255;
                var b = img.pixels[index + 2] || 255;
                var a = img.pixels[index + 3] || 255;

                // Новая форма: спираль
                var shapes = ['ribbon', 'ellipse', 'cluster', 'spiral'];
                var shape = shapes[Math.floor(brightness / 255 * shapes.length)]; // Форма зависит от яркости

                window.particles.push({
                    x: x * 400 / img.width,
                    y: y * 400 / img.height,
                    baseX: x * 400 / img.width,
                    baseY: y * 400 / img.height,
                    offsetX: 0,
                    offsetY: 0,
                    size: 2 + brightness / 255 * 4,
                    phase: Math.random() * 2 * Math.PI,
                    frequency: 0.015,
                    entangledPartner: Math.random() < 0.3 ? Math.floor(Math.random() * numParticles) : null,
                    collapsed: false,
                    decompositionProgress: 0,
                    shape: shape,
                    featureWeight: useFeature ? faceFeatures.find(f => Math.abs(f.x - x) < img.width * 0.1 && Math.abs(f.y - y) < img.height * 0.1)?.weight || 0.2 : 0.2
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

// Новая функция для отрисовки спирали
function drawSpiral(sketch, x, y, size, rotation, r, g, b, a) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    sketch.noFill();
    sketch.stroke(r, g, b, a);
    sketch.strokeWeight(1);
    sketch.beginShape();
    for (let t = 0; t < Math.PI * 4; t += 0.1) {
        let r = size * 0.5 * (1 + t / Math.PI);
        let px = r * Math.cos(t);
        let py = r * Math.sin(t);
        sketch.vertex(px, py);
    }
    sketch.endShape();
    sketch.pop();
}

// Обновлённая отрисовка форм
function drawShape(sketch, x, y, size, shape, rotation, r, g, b, a, featureWeight) {
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(rotation);
    sketch.fill(r, g, b, a);
    if (shape === 'ribbon') {
        sketch.beginShape();
        sketch.vertex(-size * 1.5 * (1 + featureWeight), size * 0.4);
        sketch.quadraticVertex(0, size * 0.5, size * 1.5 * (1 + featureWeight), size * 0.4);
        sketch.quadraticVertex(0, -size * 0.5, -size * 1.5 * (1 + featureWeight), -size * 0.4);
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'ellipse') {
        sketch.ellipse(0, 0, size * 2 * (1 + featureWeight), size * 0.6);
    } else if (shape === 'cluster') {
        for (let i = 0; i < 6; i++) {
            let dx = (Math.random() - 0.5) * size * 0.6;
            let dy = (Math.random() - 0.5) * size * 0.6;
            sketch.ellipse(dx, dy, size * 0.4, size * 0.4);
        }
    } else if (shape === 'spiral') {
        drawSpiral(sketch, 0, 0, size * 1.5, rotation, r, g, b, a);
    }
    sketch.pop();
}

// Обновлённая отрисовка мыши
function drawMouseWave(sketch) {
    if (window.currentStep !== 4 && window.currentStep !== 5 || window.mouseWave.radius <= 0) return;
    sketch.noFill();
    let gradient = sketch.drawingContext.createRadialGradient(
        window.mouseWave.x, window.mouseWave.y, 0,
        window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius
    );
    gradient.addColorStop(0, 'rgba(0, 255, 0, 0.5)'); // Зелёный для киберпанка
    gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
    sketch.drawingContext.strokeStyle = gradient;
    sketch.strokeWeight(3);
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2);

    // Шлейф с усиленным эффектом
    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 150 * (1 - i / window.mouseWave.trail.length);
        sketch.stroke(0, 255, 0, alpha);
        sketch.ellipse(point.x, point.y, window.mouseWave.radius * 0.7);
    });
}

// Обновление частиц
window.updateParticles = function(sketch) {
    if (!window.quantumSketch || !window.particles || window.particles.length === 0) {
        console.error('Cannot update particles: quantumSketch: ' + !!window.quantumSketch + ', particlesLength: ' + (window.particles ? window.particles.length : 0));
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 180; // ~3 секунды
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('updateParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    console.log('updateParticles called, particles: ' + window.particles.length + ', currentStep: ' + window.currentStep);

    // Пульсирующий фон
    let pulse = Math.sin(sketch.frameCount * 0.02) * 0.1 + 0.9;
    let gradient = sketch.drawingContext.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, `rgba(20, 20, 30, ${pulse})`);
    gradient.addColorStop(1, `rgba(10, 10, 20, ${pulse})`);
    sketch.drawingContext.fillStyle = gradient;
    sketch.rect(0, 0, 400, 400);

    // Эффект свечения
    sketch.drawingContext.filter = 'blur(2px)';

    // Квантовая декомпозиция на шаге 4
    if (window.currentStep === 4 && window.decompositionTimer < 4) {
        window.decompositionTimer += 0.02;
        if (window.img) {
            var imgAlpha = Math.max(0, 255 * (1 - Math.pow(window.decompositionTimer / 4, 2))); // Нелинейное затухание
            sketch.tint(255, imgAlpha);
            // Волновое искажение
            sketch.push();
            sketch.translate(200, 200);
            sketch.rotate(Math.sin(window.decompositionTimer) * 0.1);
            sketch.image(window.img, -200, -200, 400, 400);
            sketch.pop();
            console.log('Decomposition: Image alpha ' + imgAlpha.toFixed(0));
            if (window.globalMessageCooldown <= 0) {
                window.terminalMessages.push(getRandomMessage('decomposition', { imgAlpha: imgAlpha.toFixed(0) }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 180;
                if (typeof window.playNote === 'function') {
                    window.playNote(110, 'sawtooth', 0.3, 0.5); // Низкий гул
                }
            }
        }
    } else if (window.currentStep === 5) {
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('stabilized'));
            window.updateTerminalLog();
            if (typeof window.playStabilization === 'function') {
                window.playStabilization();
            }
            window.globalMessageCooldown = 180;
        }
    }

    // Обновление волнового пакета мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 1.5);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 15) window.mouseWave.trail.shift();
    }

    let potentialMessages = [];

    // Оптимизированный цикл: проверяем только ближайшие частицы для интерференции
    let particlesToCheck = window.particles.map((p, i) => ({ p, i }));
    particlesToCheck.sort((a, b) => {
        let distA = Math.sqrt((a.p.x - window.mouseWave.x) ** 2 + (a.p.y - window.mouseWave.y) ** 2);
        let distB = Math.sqrt((b.p.x - window.mouseWave.x) ** 2 + (b.p.y - window.mouseWave.y) ** 2);
        return distA - distB;
    });
    particlesToCheck = particlesToCheck.slice(0, 50); // Ограничиваем 50 ближайшими

    particlesToCheck.forEach(({ p, i }) => {
        try {
            var state = window.quantumStates[i];

            // Квантовая декомпозиция
            if (window.currentStep === 4 && window.decompositionTimer < 4) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.02);
                state.a = Math.floor(p.decompositionProgress * 255);
                var dx = p.x - 200;
                var dy = p.y - 200;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var wave = Math.sin(dist * 0.05 + window.decompositionTimer * 3);
                p.offsetX += wave * 8 * p.featureWeight * (dx / (dist + 1));
                p.offsetY += wave * 8 * p.featureWeight * (dy / (dist + 1));
                if (window.globalMessageCooldown <= 0) {
                    potentialMessages.push({ type: 'scatter', params: {} });
                }
            } else {
                state.a = 255;
            }

            // Суперпозиция
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, sketch.frameCount * 0.02);
            if (!p.collapsed) {
                p.phase += p.frequency * p.featureWeight;
                p.offsetX = Math.cos(p.phase) * 8 * n * window.chaosFactor;
                p.offsetY = Math.sin(p.phase) * 8 * n * window.chaosFactor;
                p.size = (2 + 3 * n * state.probability) * (1 + p.featureWeight);
                if (Math.random() < 0.02 && window.globalMessageCooldown <= 0) {
                    p.shape = ['ribbon', 'ellipse', 'cluster', 'spiral'][Math.floor(n * 4)];
                    potentialMessages.push({ type: 'superposition', params: { shape: p.shape } });
                    if (typeof window.playNote === 'function') {
                        const freq = 220 + n * 440;
                        window.playNote(freq, 'sine', 0.4, 0.3);
                    }
                }
            } else {
                p.offsetX *= 0.85;
                p.offsetY *= 0.85;
            }

            // Влияние мыши
            if (window.currentStep === 4 || window.currentStep === 5) {
                var dx = p.x - window.mouseWave.x;
                var dy = p.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseWave.radius && distance > 0 && !p.collapsed) {
                    var influence = (window.mouseWave.radius - distance) / window.mouseWave.radius;
                    p.offsetX += dx * influence * 0.15;
                    p.offsetY += dy * influence * 0.15;
                    if (window.globalMessageCooldown <= 0) {
                        potentialMessages.push({ type: 'mouseInfluence', params: {} });
                    }
                }
            }

            // Усиленное притяжение к ключевым точкам
            if (p.featureWeight > 0.2) {
                p.offsetX += (p.baseX - p.x) * 0.08 * p.featureWeight;
                p.offsetY += (p.baseY - p.y) * 0.08 * p.featureWeight;
                if (window.globalMessageCooldown <= 0) {
                    potentialMessages.push({ type: 'featureAttraction', params: {} });
                }
            }

            // Цвета с акцентами
            if (!p.collapsed) {
                state.r = Math.min(255, Math.max(0, state.r + (n - 0.5) * 10));
                state.g = Math.min(255, Math.max(0, state.g + (n - 0.5) * 10));
                state.b = Math.min(255, Math.max(0, state.b + (n - 0.5) * 10));
            }

            // Интерференция
            let interference = 0;
            particlesToCheck.forEach(({ p: other, i: j }) => {
                if (i !== j) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 80 && p.featureWeight > 0.2 && other.featureWeight > 0.2) {
                        var wave = Math.sin(distance * 0.08 + state.interferencePhase + sketch.frameCount * 0.03);
                        interference += wave * 0.1;
                        if (Math.random() < 0.002 && window.globalMessageCooldown <= 0) {
                            sketch.stroke(0, 255, 0, 50); // Зелёная линия
                            sketch.line(p.x, p.y, other.x, other.y);
                            potentialMessages.push({ type: 'interference', params: {} });
                            if (typeof window.playInterference === 'function') {
                                window.playInterference(440, 445, 1.0, 0.2);
                            }
                        }
                    }
                }
            });
            p.offsetX += interference * 6;
            p.offsetY += interference * 6;

            // Квантовое туннелирование
            if (Math.random() < 0.003 && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 30;
                sketch.stroke(0, 255, 0, 100); // Зелёная вспышка
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(0, 255, 0, 80);
                sketch.ellipse(p.x, p.y, state.tunnelFlash, state.tunnelFlash);
                console.log('Particle ' + i + ' tunneled from x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
                if (window.globalMessageCooldown <= 0) {
                    potentialMessages.push({ type: 'tunneling', params: {} });
                    if (typeof window.playTunneling === 'function') {
                        const freq = (p.x * p.y) % 440 + 220;
                        window.playTunneling(freq, 0.3, 0.4);
                    }
                }
            } else {
                sketch.noStroke();
            }

            // Запутанность
            if (p.entangledPartner !== null && window.particles[p.entangledPartner]) {
                var partner = window.particles[p.entangledPartner];
                var partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                if (p.collapsed && !partner.collapsed && window.globalMessageCooldown <= 0) {
                    partnerState.a = 255;
                    partner.size = 4;
                    partner.collapsed = true;
                    partner.shape = p.shape;
                    state.entanglementFlash = 20;
                    sketch.stroke(0, 255, 0, state.entanglementFlash * 15);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    potentialMessages.push({ type: 'entanglement', params: {} });
                    if (typeof window.playNote === 'function') {
                        window.playNote(330, 'sine', 0.5, 0.3);
                    }
                }
                state.entanglementFlash = Math.max(0, state.entanglementFlash - 1);
            }

            // Обновление позиции
            p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));

            // Отрисовка частицы
            if (p.size > 0) {
                sketch.fill(state.r, state.g, state.b, state.a / 4);
                sketch.ellipse(p.x, p.y, p.size + 8, p.size + 8);
                drawShape(sketch, p.x, p.y, p.size, p.shape, p.phase, state.r, state.g, state.b, state.a, p.featureWeight);
                if (state.tunnelFlash > 0) {
                    sketch.fill(0, 255, 0, state.tunnelFlash * 6);
                    sketch.ellipse(p.x, p.y, p.size + 6, p.size + 6);
                    state.tunnelFlash--;
                }
            }
        } catch (error) {
            console.error('Error updating particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 180;
            }
        }
    });

    // Выбор сообщения с приоритетом
    if (potentialMessages.length > 0 && window.globalMessageCooldown <= 0) {
        let selectedMessage = potentialMessages.find(msg => msg.type === 'tunneling') ||
                             potentialMessages.find(msg => msg.type === 'interference') ||
                             potentialMessages.find(msg => msg.type === 'entanglement') ||
                             potentialMessages[Math.floor(Math.random() * potentialMessages.length)];
        window.terminalMessages.push(getRandomMessage(selectedMessage.type, selectedMessage.params));
        window.updateTerminalLog();
        window.globalMessageCooldown = 180;
    }

    // Сброс свечения
    sketch.drawingContext.filter = 'none';
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
    // Динамический радиус на основе скорости мыши
    let dx = mouseX - window.mouseWave.x;
    let dy = mouseY - window.mouseWave.y;
    window.mouseWave.speed = Math.sqrt(dx * dx + dy * dy);
    window.mouseWave.x = mouseX;
    window.mouseWave.y = mouseY;
    window.mouseWave.radius = Math.min(80, 30 + window.mouseWave.speed * 2);
    if (window.globalMessageCooldown <= 0) {
        window.terminalMessages.push(getRandomMessage('mouseInfluence'));
        window.updateTerminalLog();
        window.globalMessageCooldown = 180;
    }
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
    let collapsedParticles = [];
    window.particles.forEach(function(p, i) {
        try {
            var dx = mouseX - p.x;
            var dy = mouseY - p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[i];

            if (distance < window.mouseWave.radius && distance > 0) {
                if (!p.collapsed) {
                    p.collapsed = true;
                    state.a = 255;
                    p.size = 5;
                    p.shape = ['ribbon', 'ellipse', 'cluster', 'spiral'][Math.floor(Math.random() * 4)];
                    sketch.fill(0, 255, 0, 200); // Зелёная вспышка
                    sketch.ellipse(p.x, p.y, 15, 15);
                    collapsedParticles.push(i);
                    if (!messageAddedThisFrame && window.globalMessageCooldown <= 0) {
                        window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape }));
                        window.updateTerminalLog();
                        if (typeof window.playArpeggio === 'function') {
                            window.playArpeggio(p.shape);
                        }
                        window.globalMessageCooldown = 180;
                        messageAddedThisFrame = true;
                    }
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    state.a = 255;
                    p.size = 2 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * 3);
                    if (!messageAddedThisFrame && window.globalMessageCooldown <= 0) {
                        window.terminalMessages.push(getRandomMessage('superpositionRestore'));
                        window.updateTerminalLog();
                        if (typeof window.playNote === 'function') {
                            window.playNote(330, 'sine', 0.4, 0.3);
                        }
                        window.globalMessageCooldown = 180;
                        messageAddedThisFrame = true;
                    }
                }
            }
        } catch (error) {
            console.error('Error clicking particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 180;
            }
        }
    });

    // Каскадный коллапс
    if (collapsedParticles.length > 0) {
        window.particles.forEach(function(p, i) {
            if (!collapsedParticles.includes(i)) {
                collapsedParticles.forEach(j => {
                    var dx = p.x - window.particles[j].x;
                    var dy = p.y - window.particles[j].y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 60 && Math.random() < 0.1) {
                        p.collapsed = true;
                        window.quantumStates[i].a = 255;
                        p.size = 5;
                        p.shape = ['ribbon', 'ellipse', 'cluster', 'spiral'][Math.floor(Math.random() * 4)];
                        sketch.fill(0, 255, 0, 150);
                        sketch.ellipse(p.x, p.y, 10, 10);
                    }
                });
            }
        });
        if (collapsedParticles.length > 3 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
            window.terminalMessages.push(getRandomMessage('cascadeCollapse'));
            window.updateTerminalLog();
            window.globalMessageCooldown = 180;
            if (typeof window.playNote === 'function') {
                window.playNote(220, 'sawtooth', 0.5, 0.5);
            }
        }
    }
};
