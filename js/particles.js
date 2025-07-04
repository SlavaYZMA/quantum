console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.decompositionTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.terminalMessages = [];
window.globalMessageCooldown = 0;
window.phaseTimer = 0;
window.globalPhase = 'chaos'; // Фазы: chaos, clustering, synchronization, wavefront, spiral-migration
window.grid = [];
window.vortexCenters = [];
window.lastTerminalUpdate = 0; // Буфер для времени последнего обновления терминала

// Сообщения
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
        "Квант ${index} в суперпозиции: форма ${shape}, спин ${spin}.",
        "Биоквантовая суперпозиция: живая форма ${shape} (квант ${index}).",
        "Квант ${index} живёт в суперпозиции: спин ${spin}."
    ],
    mouseInfluence: [
        "Наблюдение возмущает биокванты, изменяя спины.",
        "Волновой пакет наблюдателя оживляет кванты.",
        "Квантовое воздействие меняет биопотоки."
    ],
    featureAttraction: [
        "Кванты текут к ключевым точкам, как клетки.",
        "Биоквантовая структура формируется у лица.",
        "Кванты пульсируют у ключевых координат."
    ],
    interference: [
        "Квантовая интерференция создаёт живые узоры (квант ${index}).",
        "Волновые функции текут, как мембраны (квант ${index}).",
        "Интерференция формирует биоквантовые связи (квант ${index})."
    ],
    tunneling: [
        "Квант ${index} со спином ${spin} мигрировал через барьер.",
        "Биоквантовая миграция: квант ${index} ожил в новом состоянии.",
        "Квант ${index} туннелировал, как живая клетка."
    ],
    entanglement: [
        "Запутанные кванты ${index} и ${partnerIndex} пульсируют синхронно.",
        "Квантовая нелокальность: спины квантов ${index} и ${partnerIndex} связаны.",
        "Запутанность создаёт живую корреляцию (кванты ${index}, ${partnerIndex})."
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
        "Вихревая сингулярность: квант ${index} схлопнулся в центр.",
        "Квантовая сингулярность активировала биопотоки (квант ${index}).",
        "Глобальный вихрь оживляет квантовую экосистему."
    ],
    error: [
        "Ошибка в биоквантовой системе: квант ${index} не обновлён.",
        "Аномалия: спин кванта ${index} не изменился.",
        "Биоквантовая ошибка: квант ${index} не ожил."
    ]
};

// Выбор случайного сообщения с выделением частицы
function getRandomMessage(type, params = {}) {
    let msgArray = messages[type];
    let msg = msgArray[Math.floor(Math.random() * msgArray.length)];
    for (let key in params) {
        msg = msg.replace(`\${${key}}`, params[key]);
    }
    const timestamp = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `[${timestamp}] ${msg}`;
}

// Обновление терминального лога с буфером
window.updateTerminalLog = function() {
    const now = Date.now();
    if (now - window.lastTerminalUpdate < 1000 && window.terminalMessages.length <= 10) {
        return; // Пропускаем, если прошло меньше 1000 мс и нет переполнения
    }
    window.lastTerminalUpdate = now;
    const maxMessages = 10;
    while (window.terminalMessages.length > maxMessages) {
        window.terminalMessages.shift();
    }
    const terminalDiv = document.getElementById(`terminal-log-step-${window.currentStep}`);
    if (terminalDiv) {
        terminalDiv.innerHTML = window.terminalMessages.map(msg => 
            `<div class="${msg.includes('туннелировал') || msg.includes('мигрировал') ? 'tunneling' : 
                          msg.includes('интерференция') ? 'interference' : 
                          msg.includes('запутанность') || msg.includes('нелокальность') ? 'entanglement' : 
                          msg.includes('сингулярность') ? 'vortex' : ''}">${msg}</div>`
        ).join('');
    }
};

// Создание сетки для оптимизации
function createGrid() {
    window.grid = [];
    const gridSize = 80;
    const gridWidth = Math.ceil(400 / gridSize);
    const gridHeight = Math.ceil(400 / gridSize);
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
}

// Получение соседей из сетки
function getNeighbors(p, i, gridSize = 80) {
    const gridWidth = Math.ceil(400 / gridSize);
    const gridX = Math.floor(p.x / gridSize);
    const gridY = Math.floor(p.y / gridSize);
    let neighbors = [];
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const nx = gridX + dx;
            const ny = gridY + dy;
            const gridIndex = ny * gridWidth + nx;
            if (gridIndex >= 0 && gridIndex < window.grid.length) {
                neighbors = neighbors.concat(window.grid[gridIndex]);
            }
        }
    }
    return neighbors;
}

// Инициализация частиц
window.initializeParticles = function(img) {
    console.log('initializeParticles called');
    window.particles = [];
    window.quantumStates = [];
    window.decompositionTimer = 0;
    window.terminalMessages.push(getRandomMessage('initialize'));
    window.updateTerminalLog();

    img.loadPixels();
    const step = 4;
    let validParticles = 0;
    for (let x = 0; x < img.width; x += step) {
        for (let y = 0; y < img.height; y += step) {
            const i = (y * img.width + x) * 4;
            const alpha = img.pixels[i + 3];
            if (alpha > 50) {
                const r = img.pixels[i];
                const g = img.pixels[i + 1];
                const b = img.pixels[i + 2];
                window.particles.push({
                    x: x,
                    y: y,
                    vx: 0,
                    vy: 0,
                    color: [r, g, b, alpha],
                    spin: Math.random() > 0.5 ? 1 : -1,
                    shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)],
                    coherence: 1,
                    highlight: 0, // Для подсветки частицы
                    highlightTime: 0 // Время действия подсветки
                });
                validParticles++;
            }
        }
    }
    window.terminalMessages.push(getRandomMessage('initializeSuccess', { validParticles }));
    window.updateTerminalLog();
    createGrid();
};

// Обновление частиц
window.updateParticles = function(sketch) {
    if (!window.particles || window.particles.length === 0) return;

    window.frame = (window.frame || 0) + 1;
    window.globalMessageCooldown--;
    window.phaseTimer--;

    const now = Date.now();
    const potentialMessages = [];

    // Обновление частиц
    window.particles.forEach((p, i) => {
        // Уменьшаем время подсветки
        if (p.highlight > 0 && now - p.highlightTime > 2000) {
            p.highlight = 0;
        }

        // Пример логики для туннелирования
        if (Math.random() < 0.001 && window.globalMessageCooldown <= 0) {
            p.x += Math.random() * 50 - 25;
            p.y += Math.random() * 50 - 25;
            p.highlight = 1; // Подсвечиваем частицу
            p.highlightTime = now;
            potentialMessages.push(getRandomMessage('tunneling', { index: i, spin: p.spin }));
        }

        // Пример логики для запутанности
        if (Math.random() < 0.0005 && window.globalMessageCooldown <= 0) {
            const neighbors = getNeighbors(p, i);
            if (neighbors.length > 0) {
                const partnerIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
                const partner = window.particles[partnerIndex];
                p.spin = partner.spin = Math.random() > 0.5 ? 1 : -1;
                p.highlight = partner.highlight = 1;
                p.highlightTime = partner.highlightTime = now;
                potentialMessages.push(getRandomMessage('entanglement', { index: i, partnerIndex }));
            }
        }

        // Пример логики для вихревой сингулярности
        if (window.globalPhase === 'spiral-migration' && Math.random() < 0.001 && window.globalMessageCooldown <= 0) {
            p.highlight = 1;
            p.highlightTime = now;
            potentialMessages.push(getRandomMessage('vortexSingularity', { index: i }));
        }
    });

    // Добавление сообщения в терминал
    if (potentialMessages.length > 0 && window.globalMessageCooldown <= 0) {
        window.terminalMessages.push(potentialMessages[Math.floor(Math.random() * potentialMessages.length)]);
        window.globalMessageCooldown = 200;
        window.updateTerminalLog();
    }

    // Отрисовка частиц
    window.particles.forEach((p, i) => {
        sketch.fill(p.color[0], p.color[1], p.color[2], p.color[3]);
        if (p.highlight > 0) {
            // Подсветка: увеличенный размер и яркое свечение
            sketch.stroke(255, 255, 255, 255);
            sketch.strokeWeight(2);
            sketch.fill(255, 255, 255, 200); // Яркий цвет для выделения
            sketch.circle(p.x, p.y, 10); // Увеличенный размер
        } else {
            sketch.noStroke();
            if (p.shape === 'circle') {
                sketch.circle(p.x, p.y, 5);
            } else if (p.shape === 'square') {
                sketch.square(p.x - 2.5, p.y - 2.5, 5);
            } else {
                sketch.triangle(
                    p.x, p.y - 3,
                    p.x - 3, p.y + 3,
                    p.x + 3, p.y + 3
                );
            }
        }
    });

    createGrid();
};

// Обработка наблюдения (движение мыши)
window.observeParticles = function(sketch, mx, my) {
    window.mouseWave = { x: mx, y: my, radius: 0 };
    if (Math.random() < 0.1 && window.globalMessageCooldown <= 0) {
        window.terminalMessages.push(getRandomMessage('mouseInfluence'));
        window.globalMessageCooldown = 200;
        window.updateTerminalLog();
    }
};

// Обработка клика
window.clickParticles = function(sketch, mx, my) {
    window.particles.forEach((p, i) => {
        const d = sketch.dist(mx, my, p.x, p.y);
        if (d < 20) {
            p.spin = -p.spin;
            p.highlight = 1;
            p.highlightTime = Date.now();
            window.terminalMessages.push(getRandomMessage('superposition', { index: i, shape: p.shape, spin: p.spin }));
            window.updateTerminalLog();
        }
    });
};
