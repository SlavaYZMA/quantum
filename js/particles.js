console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0; // Глобальный кулдаун для всех сообщений

// Варианты сообщений для разнообразия
const messages = {
    initialize: [
        "Инициализация квантовой системы портрета. Частицы установлены в состояние суперпозиции.",
        "Формирование квантовой системы портрета. Частицы подготовлены для наблюдения.",
        "Квантовая декомпозиция портрета начата. Частицы находятся в суперпозиции."
    ],
    initializeSuccess: [
        "Квантовая система портрета инициализирована: ${validParticles} частиц в суперпозиции.",
        "Успешная инициализация: ${validParticles} квантовых частиц готовы для наблюдения.",
        "Портрет декомпозирован на ${validParticles} квантовых состояний. Наблюдение начато."
    ],
    initializeError: [
        "Ошибка инициализации: квантовая система портрета не сформирована.",
        "Не удалось инициализировать квантовую систему. Требуется загрузка изображения.",
        "Ошибка: данные изображения недоступны для квантовой декомпозиции."
    ],
    update: [
        "Квантовая система портрета обновляется. Волновые функции частиц эволюционируют.",
        "Частицы портрета взаимодействуют в квантовом поле под воздействием наблюдения.",
        "Эволюция квантовой системы портрета. Частицы изменяют состояния."
    ],
    decomposition: [
        "Квантовая декомпозиция портрета: прозрачность изображения ${imgAlpha}/255.",
        "Изображение подвергается квантовой декогеренции: прозрачность ${imgAlpha}/255.",
        "Декомпозиция портрета в квантовое поле: прозрачность достигла ${imgAlpha}/255."
    ],
    stabilized: [
        "Квантовая система портрета стабилизирована. Волновые функции фиксированы.",
        "Стабилизация квантовой системы завершена. Портрет сформирован.",
        "Наблюдение зафиксировало квантовые состояния. Портрет стабилизирован."
    ],
    scatter: [
        "Частицы портрета рассеиваются в квантовом поле, увеличивая неопределённость.",
        "Квантовая система портрета демонстрирует рост энтропии. Частицы рассеяны.",
        "Рассеяние частиц портрета в суперпозиции. Неопределённость возрастает."
    ],
    superposition: [
        "Частица портрета находится в суперпозиции с формой ${shape}.",
        "Квантовая суперпозиция: частица принимает состояние ${shape}.",
        "Частица портрета в суперпозиции. Форма изменена на ${shape}."
    ],
    mouseInfluence: [
        "Наблюдение вызывает возмущение волновой функции, влияя на частицы портрета.",
        "Волновой пакет наблюдателя изменяет траектории частиц портрета.",
        "Квантовое воздействие наблюдения модифицирует состояния частиц портрета."
    ],
    featureAttraction: [
        "Частицы портрета притягиваются к ключевым координатам лица.",
        "Квантовая система портрета формирует структуру лица через притяжение частиц.",
        "Частицы портрета локализуются у ключевых точек изображения."
    ],
    interference: [
        "Квантовые волновые функции частиц интерферируют, формируя структуру портрета.",
        "Интерференция волн частиц приводит к изменению квантовой системы портрета.",
        "Квантовая интерференция: частицы портрета создают когерентные узоры.",
        "Волновые функции частиц демонстрируют интерференцию в квантовой системе."
    ],
    tunneling: [
        "Частица портрета осуществила квантовое туннелирование через потенциальный барьер.",
        "Квантовое туннелирование: частица портрета переместилась в новое состояние.",
        "Частица портрета демонстрирует туннелирование через квантовый барьер."
    ],
    entanglement: [
        "Запутанные частицы портрета демонстрируют квантовую корреляцию.",
        "Квантовая запутанность: частицы портрета синхронизированы через нелокальность.",
        "Запутанность частиц портрета вызывает когерентное изменение состояний."
    ],
    collapse: [
        "Наблюдение вызвало коллапс волновой функции частицы портрета в состояние ${shape}.",
        "Квантовая система портрета: частица коллапсировала в форму ${shape}.",
        "Коллапс волновой функции: частица портрета фиксирована в состоянии ${shape}."
    ],
    superpositionRestore: [
        "Частица портрета восстановлена в состояние суперпозиции.",
        "Квантовая неопределённость частицы портрета восстановлена.",
        "Частица портрета возвращена в суперпозицию для дальнейшего наблюдения."
    ],
    error: [
        "Ошибка в квантовой системе: частица ${index} не обновлена.",
        "Квантовая ошибка: частица ${index} не изменила состояние.",
        "Аномалия в квантовой системе портрета: частица ${index} не обработана."
    ]
};

// Функция для выбора случайного сообщения из массива
function getRandomMessage(type, params = {}) {
    let msgArray = messages[type];
    let msg = msgArray[Math.floor(Math.random() * msgArray.length)];
    for (let key in params) {
        msg = msg.replace(`\${${key}}`, params[key]);
    }
    return msg;
}

// Обновление терминального лога с сообщениями для зрителя
window.updateTerminalLog = function() {
    const maxMessages = 10;
    while (window.terminalMessages.length > maxMessages) {
        window.terminalMessages.shift();
    }
    const terminalDiv = document.getElementById(`terminal-log-step-${window.currentStep}`);
    if (terminalDiv) {
        terminalDiv.innerHTML = window.terminalMessages.map(msg => `<div>${msg}</div>`).join('');
    }
};

// Инициализация частиц из портрета
window.initializeParticles = function(img) {
    console.log('initializeParticles called, img defined: ' + !!img + ', dimensions: ' + (img ? img.width + 'x' + img.height : 'undefined'));
    window.terminalMessages.push(getRandomMessage('initialize'));
    window.updateTerminalLog();
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
        var numParticles = 250;
        var validParticles = 0;

        // Ключевые точки лица (глаза, нос, рот)
        var faceFeatures = [
            { x: img.width * 0.35, y: img.height * 0.3, weight: 0.4 }, // Левый глаз
            { x: img.width * 0.65, y: img.height * 0.3, weight: 0.4 }, // Правый глаз
            { x: img.width * 0.5, y: img.height * 0.5, weight: 0.3 }, // Нос
            { x: img.width * 0.5, y: img.height * 0.7, weight: 0.3 }  // Рот
        ];

        for (var i = 0; i < numParticles; i++) {
            var x, y, brightness;
            var useFeature = Math.random() < 0.6;
            if (useFeature) {
                var feature = faceFeatures[Math.floor(Math.random() * faceFeatures.length)];
                x = feature.x + (Math.random() - 0.5) * img.width * 0.15;
                y = feature.y + (Math.random() - 0.5) * img.height * 0.15;
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

                window.particles.push({
                    x: x * 400 / img.width,
                    y: y * 400 / img.height,
                    baseX: x * 400 / img.width,
                    baseY: y * 400 / img.height,
                    offsetX: 0,
                    offsetY: 0,
                    size: 3 + brightness / 255 * 3,
                    phase: Math.random() * 2 * Math.PI,
                    frequency: 0.01,
                    entangledPartner: Math.random() < 0.2 ? Math.floor(Math.random() * numParticles) : null,
                    collapsed: false,
                    decompositionProgress: 0,
                    shape: ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)],
                    featureWeight: useFeature ? faceFeatures.find(f => Math.abs(f.x - x) < img.width * 0.1 && Math.abs(f.y - y) < img.height * 0.1)?.weight || 0.1 : 0.1
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
    sketch.fill(r, g, b, a);
    if (shape === 'ribbon') {
        sketch.beginShape();
        sketch.vertex(-size * 1.2 * (1 + featureWeight), size * 0.3);
        sketch.quadraticVertex(0, size * 0.4, size * 1.2 * (1 + featureWeight), size * 0.3);
        sketch.quadraticVertex(0, -size * 0.4, -size * 1.2 * (1 + featureWeight), -size * 0.3);
        sketch.endShape(sketch.CLOSE);
    } else if (shape === 'ellipse') {
        sketch.ellipse(0, 0, size * 1.5 * (1 + featureWeight), size * 0.5);
    } else if (shape === 'cluster') {
        for (let i = 0; i < 5; i++) {
            let dx = (Math.random() - 0.5) * size * 0.5;
            let dy = (Math.random() - 0.5) * size * 0.5;
            sketch.ellipse(dx, dy, size * 0.3, size * 0.3);
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
    gradient.addColorStop(0, 'rgba(200, 200, 200, 0.3)');
    gradient.addColorStop(1, 'rgba(200, 200, 200, 0)');
    sketch.drawingContext.strokeStyle = gradient;
    sketch.strokeWeight(2);
    sketch.ellipse(window.mouseWave.x, window.mouseWave.y, window.mouseWave.radius * 2);
    
    // Шлейф
    window.mouseWave.trail.forEach((point, i) => {
        let alpha = 100 * (1 - i / window.mouseWave.trail.length);
        sketch.stroke(200, 200, 200, alpha);
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
            window.globalMessageCooldown = 300; // ~10 секунд
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('updateParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    console.log('updateParticles called, particles: ' + window.particles.length + ', currentStep: ' + window.currentStep);
    let messageAddedThisFrame = false; // Флаг для ограничения одного сообщения за кадр
    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('update'));
        window.updateTerminalLog();
        window.globalMessageCooldown = 600; // ~10 секунд
        messageAddedThisFrame = true;
    }
    window.globalMessageCooldown--;
    window.frame = window.frame || 0;
    window.frame++;

    // Тёмный градиентный фон
    let gradient = sketch.drawingContext.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, 'rgba(20, 20, 30, 0.9)');
    gradient.addColorStop(1, 'rgba(10, 10, 20, 0.9)');
    sketch.drawingContext.fillStyle = gradient;
    sketch.rect(0, 0, 400, 400);

    // Квантовая декомпозиция только на шаге 4
    if (window.currentStep === 4 && window.decompositionTimer < 4) {
        window.decompositionTimer += 0.015;
        if (window.img) {
            var imgAlpha = Math.max(0, 255 * (1 - window.decompositionTimer / 4));
            sketch.tint(255, imgAlpha);
            sketch.image(window.img, 0, 0, 400, 400);
            console.log('Decomposition: Image alpha ' + imgAlpha.toFixed(0));
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('decomposition', { imgAlpha: imgAlpha.toFixed(0) }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 600; // ~10 секунд
                messageAddedThisFrame = true;
            }
        }
    } else if (window.currentStep === 5 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        window.terminalMessages.push(getRandomMessage('stabilized'));
        window.updateTerminalLog();
        window.globalMessageCooldown = 600; // ~10 секунд
        messageAddedThisFrame = true;
    }

    // Обновление волнового пакета мыши
    if (window.currentStep === 4 || window.currentStep === 5) {
        window.mouseWave.radius = Math.max(0, window.mouseWave.radius - 1);
        window.mouseWave.trail.push({ x: window.mouseWave.x, y: window.mouseWave.y });
        if (window.mouseWave.trail.length > 10) window.mouseWave.trail.shift();
    }

    // Список событий для приоритизации (интерференция и туннелирование имеют больший вес)
    let potentialMessages = [];

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];

            // Квантовая декомпозиция с "взрывным" эффектом только на шаге 4
            if (window.currentStep === 4 && window.decompositionTimer < 4) {
                p.decompositionProgress = Math.min(1, p.decompositionProgress + 0.015);
                state.a = Math.floor(p.decompositionProgress * 255);
                var dx = p.x - 200;
                var dy = p.y - 200;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var wave = Math.sin(dist * 0.04 + window.decompositionTimer * 2);
                p.offsetX += wave * 6 * p.featureWeight * (dx / (dist + 1));
                p.offsetY += wave * 6 * p.featureWeight * (dy / (dist + 1));
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'scatter', params: {} });
                }
            } else {
                state.a = 255; // Keep particles "alive" on steps 4 and 5
            }

            // Суперпозиция и неопределённость
            var n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.015);
            if (!p.collapsed) {
                p.phase += p.frequency * p.featureWeight;
                p.offsetX = Math.cos(p.phase) * 6 * n * window.chaosFactor;
                p.offsetY = Math.sin(p.phase) * 6 * n * window.chaosFactor;
                p.size = (3 + 2 * n * state.probability) * (1 + p.featureWeight * 0.5);
                if (Math.random() < 0.015 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    p.shape = ['ribbon', 'ellipse', 'cluster'][Math.floor(Math.random() * 3)];
                    potentialMessages.push({ type: 'superposition', params: { shape: p.shape } });
                }
            } else {
                p.offsetX *= 0.9; // Замедление движения при коллапсе
                p.offsetY *= 0.9;
            }

            // Влияние мыши как волнового пакета
            if (window.currentStep === 4 || window.currentStep === 5) {
                var dx = p.x - window.mouseWave.x;
                var dy = p.y - window.mouseWave.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < window.mouseInfluenceRadius && distance > 0 && !p.collapsed && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    var influence = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                    p.offsetX += dx * influence * 0.1;
                    p.offsetY += dy * influence * 0.1;
                    potentialMessages.push({ type: 'mouseInfluence', params: {} });
                }
            }

            // Притяжение к ключевым точкам лица
            if (p.featureWeight > 0.1 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                p.offsetX += (p.baseX - p.x) * 0.06 * p.featureWeight;
                p.offsetY += (p.baseY - p.y) * 0.06 * p.featureWeight;
                potentialMessages.push({ type: 'featureAttraction', params: {} });
            }

            // Цвета, приближенные к портрету
            if (!p.collapsed) {
                state.r = Math.min(255, Math.max(0, state.r + (n - 0.5) * 5));
                state.g = Math.min(255, Math.max(0, state.g + (n - 0.5) * 5));
                state.b = Math.min(255, Math.max(0, state.b + (n - 0.5) * 5));
            }

            // Интерференция
            var interference = 0;
            window.particles.forEach(function(other, j) {
                if (i !== j) {
                    var dx = p.x - other.x;
                    var dy = p.y - other.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 60 && p.featureWeight > 0.1 && other.featureWeight > 0.1) {
                        var wave = Math.sin(distance * 0.07 + state.interferencePhase + window.frame * 0.025);
                        interference += wave * 0.08;
                        if (Math.random() < 0.001 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                            sketch.stroke(state.r, state.g, state.b, 25);
                            sketch.line(p.x, p.y, other.x, other.y);
                            potentialMessages.push({ type: 'interference', params: {} });
                        }
                    }
                }
            });
            p.offsetX += interference * 5;
            p.offsetY += interference * 5;

            // Отталкивание от краёв
            var margin = 20;
            if (p.x < margin) p.offsetX += (margin - p.x) * 0.1;
            if (p.x > 400 - margin) p.offsetX -= (p.x - (400 - margin)) * 0.1;
            if (p.y < margin) p.offsetY += (margin - p.y) * 0.1;
            if (p.y > 400 - margin) p.offsetY -= (p.y - (400 - margin)) * 0.1;

            // Квантовое туннелирование
            if (Math.random() < 0.002 && !p.collapsed) {
                var oldX = p.x, oldY = p.y;
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                state.tunnelFlash = 25;
                sketch.stroke(state.r, state.g, state.b, 80);
                sketch.line(oldX, oldY, p.x, p.y);
                sketch.noFill();
                sketch.stroke(state.r, state.g, state.b, 50);
                sketch.ellipse(p.x, p.y, state.tunnelFlash * 0.5, state.tunnelFlash * 0.5);
                console.log('Particle ' + i + ' tunneled from x: ' + oldX.toFixed(2) + ', y: ' + oldY.toFixed(2) + ' to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
                if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                    potentialMessages.push({ type: 'tunneling', params: {} });
                }
            } else {
                sketch.noStroke();
            }

            // Запутанность и нелокальность
            if (p.entangledPartner !== null && window.particles[p.entangledPartner] && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                var partner = window.particles[p.entangledPartner];
                var partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                if (p.collapsed && !partner.collapsed) {
                    partnerState.a = 255;
                    partner.size = 4;
                    partner.collapsed = true;
                    partner.shape = p.shape;
                    state.entanglementFlash = 15;
                    console.log('Non-locality: Particle ' + p.entangledPartner + ' flashed due to ' + i);
                    potentialMessages.push({ type: 'entanglement', params: {} });
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(state.r, state.g, state.b, state.entanglementFlash * 10);
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                }
            }

            // Обновление позиции
            p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));

            // Отрисовка частицы
            if (p.size > 0) {
                sketch.fill(state.r, state.g, state.b, state.a / 5);
                sketch.ellipse(p.x, p.y, p.size + 6, p.size + 6);
                drawShape(sketch, p.x, p.y, p.size, p.shape, p.phase, state.r, state.g, state.b, state.a, p.featureWeight);
                if (state.tunnelFlash > 0) {
                    sketch.fill(state.r, state.g, state.b, state.tunnelFlash * 5);
                    sketch.ellipse(p.x, p.y, p.size + 5, p.size + 5);
                    state.tunnelFlash--;
                }
            }

            // Логирование первых 5 частиц (в консоль, не в терминал)
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

    // Выбор сообщения с приоритетом для интерференции и туннелирования
    if (potentialMessages.length > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
        // Приоритет: туннелирование > интерференция > запутанность > остальные
        let selectedMessage = potentialMessages.find(msg => msg.type === 'tunneling') ||
                             potentialMessages.find(msg => msg.type === 'interference') ||
                             potentialMessages.find(msg => msg.type === 'entanglement') ||
                             potentialMessages[Math.floor(Math.random() * potentialMessages.length)];
        window.terminalMessages.push(getRandomMessage(selectedMessage.type, selectedMessage.params));
        window.updateTerminalLog();
        window.globalMessageCooldown = 600; // ~10 секунд
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
            window.globalMessageCooldown = 600; // ~10 секунд
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
        window.globalMessageCooldown = 600; // ~10 секунд
    }
    window.mouseWave.x = mouseX;
    window.mouseWave.y = mouseY;
    window.mouseWave.radius = window.mouseInfluenceRadius;
};

// Реакция частиц на клик (коллапс/восстановление)
window.clickParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('clickParticles: No particles or quantum states available');
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 600; // ~10 секунд
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
                    sketch.fill(state.r, state.g, state.b, 180);
                    sketch.ellipse(p.x, p.y, 12, 12);
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape }));
                    window.updateTerminalLog();
                    window.globalMessageCooldown = 600; // ~10 секунд
                    messageAddedThisFrame = true;
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    state.a = 255;
                    p.size = 3 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * 2);
                    console.log('Particle ' + i + ' restored to superposition, shape: ' + p.shape + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('superpositionRestore'));
                    window.updateTerminalLog();
                    window.globalMessageCooldown = 600; // ~10 секунд
                    messageAddedThisFrame = true;
                }
            }
        } catch (error) {
            console.error('Error clicking particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 600; // ~10 секунд
                messageAddedThisFrame = true;
            }
        }
    });
};
