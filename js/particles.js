```javascript
console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];

// Инициализация частиц на основе загруженного изображения
window.initializeParticles = (img) => {
    console.log('initializeParticles called, img:', !!img, 'img dimensions:', img?.width, img?.height);
    if (!img || !img.pixels) {
        console.error('Error: window.img is not defined or pixels not loaded');
        return;
    }
    window.particles = [];
    window.quantumStates = [];
    try {
        img.loadPixels();
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty or not loaded');
            return;
        }
        const pixelStep = Math.floor(Math.max(img.width, img.height) / 20); // Шаг для выборки пикселей
        const centerX = img.width / 2;
        const centerY = img.height / 2;
        const maxRadius = Math.min(img.width, img.height) / 2;
        const numParticles = 314; // Количество частиц

        let validParticles = 0;
        for (let i = 0; i < numParticles; i++) {
            let angle = Math.random() * Math.PI * 2;
            let radius = Math.random() * maxRadius;
            let x = centerX + Math.cos(angle) * radius;
            let y = centerY + Math.sin(angle) * radius;

            // Проверка, что координаты в пределах изображения
            if (x >= 0 && x < img.width && y >= 0 && y < img.height) {
                let index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
                let r = img.pixels[index] || 255;
                let g = img.pixels[index + 1] || 255;
                let b = img.pixels[index + 2] || 255;
                let a = img.pixels[index + 3] || 255;

                // Добавление частицы с квантовыми свойствами
                window.particles.push({
                    x: x * 400 / img.width, // Масштабирование на холст 400x400
                    y: y * 400 / img.height,
                    baseX: x * 400 / img.width, // Базовая позиция для суперпозиции
                    baseY: y * 400 / img.height,
                    offsetX: 0, // Смещение для анимации
                    offsetY: 0,
                    size: 5 + Math.random() * 10, // Размер частицы
                    phase: Math.random() * Math.PI * 2, // Фаза для волнового движения
                    frequency: 0.01 + Math.random() * 0.02, // Частота колебаний
                    entangledPartner: Math.random() < 0.2 ? Math.floor(Math.random() * numParticles) : null // 20% шанс запутанности
                });

                // Квантовое состояние частицы
                window.quantumStates.push({
                    r: r,
                    g: g,
                    b: b,
                    a: a,
                    probability: 1.0, // Вероятность состояния
                    decoherenceTimer: 0 // Таймер декогеренции
                });
                validParticles++;
            }
        }
        console.log('Initialized ' + window.particles.length + ' particles, valid: ' + validParticles);
        if (validParticles === 0) {
            console.error('No valid particles created. Check image dimensions or pixel data.');
        }
    } catch (error) {
        console.error('Error in initializeParticles:', error);
    }
};

// Обновление частиц для анимации на шагах 4 и 5
window.updateParticles = (sketch) => {
    if (!window.quantumSketch || !window.particles || window.particles.length === 0) {
        console.error('Cannot update particles:', {
            quantumSketch: !!window.quantumSketch,
            particlesLength: window.particles?.length
        });
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('updateParticles skipped: not on step 4 or 5, currentStep:', window.currentStep);
        return;
    }
    console.log('updateParticles called, particles:', window.particles.length, 'currentStep:', window.currentStep);
    window.frame = window.frame || 0;
    window.frame++;

    window.particles.forEach((p, i) => {
        try {
            let state = window.quantumStates[i];

            // Суперпозиция: случайное движение с использованием шума
            let n = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * 0.01);
            p.phase += p.frequency;
            p.offsetX = Math.cos(p.phase) * 20 * n * window.chaosFactor;
            p.offsetY = Math.sin(p.phase) * 20 * n * window.chaosFactor;

            // Квантовое туннелирование: 1% шанс перепрыгнуть через край холста
            if (Math.random() < 0.01) {
                p.x = Math.random() * 400;
                p.y = Math.random() * 400;
                console.log('Particle ' + i + ' tunneled to x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2));
            }

            // Запутанность: синхронизация цвета с запутанным партнером
            if (p.entangledPartner !== null && window.particles[p.entangledPartner]) {
                let partner = window.particles[p.entangledPartner];
                let partnerState = window.quantumStates[p.entangledPartner];
                state.r = partnerState.r = (state.r + partnerState.r) / 2;
                state.g = partnerState.g = (state.g + partnerState.g) / 2;
                state.b = partnerState.b = (state.b + partnerState.b) / 2;
                console.log('Particle ' + i + ' entangled with ' + p.entangledPartner + ', synced color: rgb(' + state.r + ', ' + state.g + ', ' + state.b + ')');
            }

            // Движение частицы с ограничением в пределах холста
            p.x = Math.max(0, Math.min(400, p.baseX + p.offsetX));
            p.y = Math.max(0, Math.min(400, p.baseY + p.offsetY));

            // Декогеренция: постепенное уменьшение вероятности и прозрачности
            state.decoherenceTimer += 0.01;
            if (state.decoherenceTimer > 10) {
                state.probability = Math.max(0.1, state.probability - 0.005); // Минимум 0.1 для видимости
                state.a = Math.floor(state.probability * 255);
                console.log('Particle ' + i + ' decohering, probability: ' + state.probability.toFixed(2) + ', alpha: ' + state.a);
            }

            // Рендеринг частицы
            sketch.fill(state.r, state.g, state.b, state.a);
            sketch.noStroke();
            sketch.ellipse(p.x, p.y, p.size, p.size);

            // Логирование первых 5 частиц для отладки
            if (i < 5) {
                console.log('Particle ' + i + ' at x: ' + p.x.toFixed(2) + ', y: ' + p.y.toFixed(2) + ', color: rgb(' + state.r + ', ' + state.g + ', ' + state.b + ', ' + state.a + ')');
            }
        } catch (error) {
            console.error('Error updating particle ' + i + ':', error);
        }
    });
};

// Реакция частиц на наблюдение (движение мыши)
window.observeParticles = (mouseX, mouseY) => {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('observeParticles: No particles or quantum states available');
        return;
    }
    if (window.currentStep !== 4) {
        console.log('observeParticles skipped: not on step 4, currentStep:', window.currentStep);
        return;
    }
    console.log('observeParticles called, mouseX:', mouseX, 'mouseY:', mouseY);
    window.particles.forEach((p, i) => {
        try {
            let dx = mouseX - p.x;
            let dy = mouseY - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let state = window.quantumStates[i];

            // Коллапс при измерении: если курсор близко, частица фиксируется
            if (distance < window.mouseInfluenceRadius && distance > 0) {
                let force = (window.mouseInfluenceRadius - distance) / window.mouseInfluenceRadius;
                p.offsetX += dx * force * 0.05;
                p.offsetY += dy * force * 0.05;
                state.probability = Math.max(0.1, state.probability - 0.01); // Уменьшение вероятности
                state.a = Math.floor(state.probability * 255); // Изменение прозрачности
                p.phase = 0; // Замораживание фазы для коллапса
                console.log('Particle ' + i + ' collapsed, probability: ' + state.probability.toFixed(2) + ', alpha: ' + state.a);
            }
        } catch (error) {
            console.error('Error observing particle ' + i + ':', error);
        }
    });
};
```
