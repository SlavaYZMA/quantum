console.log('audio.js loaded');

// Инициализация AudioContext
let audioContext = null;
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('AudioContext initialized');
    }
    return audioContext;
}

// Частоты нот для расширенной C минорной гаммы (C3–C5)
window.noteFrequencies = {
    'C3': 130.81,
    'D#3': 155.56,
    'E3': 164.81,
    'F3': 174.61,
    'G3': 196.00,
    'A#3': 233.08,
    'C4': 261.63,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A#4': 466.16,
    'C5': 523.25
};

// Воспроизведение одной ноты с LFO модуляцией
window.playNote = function(frequency, type = 'sine', duration = 0.5, gainValue = 0.2) {
    if (!Number.isFinite(frequency)) {
        console.warn('playNote: Invalid frequency, using fallback 261.63');
        frequency = 261.63; // Fallback to C4
    }
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator(); // Низкочастотный осциллятор для модуляции
    const lfoGain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    // Настройка LFO (лёгкая пульсация частоты)
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(5, ctx.currentTime); // 5 Гц для мягкой модуляции
    lfoGain.gain.setValueAtTime(frequency * 0.05, ctx.currentTime); // Амплитуда модуляции 5%
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    lfo.start();
    lfo.stop(ctx.currentTime + duration);

    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
};

// Воспроизведение биений для интерференции с модуляцией
window.playInterference = function(frequency1 = 440, frequency2 = 445, duration = 1.0, gainValue = 0.15) {
    if (!Number.isFinite(frequency1) || !Number.isFinite(frequency2)) {
        console.warn('playInterference: Invalid frequency, using fallback 440/445');
        frequency1 = 440;
        frequency2 = 445;
    }
    const ctx = initAudioContext();
    const oscillator1 = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator(); // LFO для интерференции
    const lfoGain = ctx.createGain();

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator1.frequency.setValueAtTime(frequency1, ctx.currentTime);
    oscillator2.frequency.setValueAtTime(frequency2, ctx.currentTime);

    // LFO для дрожания тона
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(3, ctx.currentTime); // 3 Гц для тонкой модуляции
    lfoGain.gain.setValueAtTime(frequency1 * 0.03, ctx.currentTime); // Амплитуда 3%
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator1.frequency);
    lfo.start();
    lfo.stop(ctx.currentTime + duration);

    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator1.connect(gain);
    oscillator2.connect(gain);
    gain.connect(ctx.destination);

    oscillator1.start();
    oscillator2.start();
    oscillator1.stop(ctx.currentTime + duration);
    oscillator2.stop(ctx.currentTime + duration);
};

// Воспроизведение импульса с ревербом для туннелирования
window.playTunneling = function(frequency, duration = 0.2, gainValue = 0.3) {
    if (!Number.isFinite(frequency)) {
        console.warn('playTunneling: Invalid frequency, using fallback 440');
        frequency = 440;
    }
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const convolver = ctx.createConvolver();

    // Случайный выбор тембра для разнообразия
    const types = ['square', 'sawtooth', 'triangle'];
    oscillator.type = types[Math.floor(Math.random() * types.length)];

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Увеличенный реверб с шумовым хвостом
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * 0.7; // Увеличено до 0.7 сек
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.15)) * (1 + Math.random() * 0.2); // Шумовой хвост
    }
    convolver.buffer = buffer;

    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(convolver);
    convolver.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
};

// Воспроизведение арпеджио для коллапса с вариациями
window.playArpeggio = function(shape, duration = 0.5, gainValue = 0.2) {
    const ctx = initAudioContext();
    const notes = {
        'ribbon': ['C4', 'E4', 'G4'],
        'ellipse': ['D#4', 'F4', 'A#4'],
        'cluster': ['G4', 'C4', 'F4']
    }[shape] || ['C4', 'E4', 'G4'];
    
    notes.forEach((note, i) => {
        const frequency = window.noteFrequencies[note] || 261.63; // Fallback to C4
        const noteDuration = duration / 3 + Math.random() * 0.3; // Случайная длительность 0.3–0.6 сек
        const noteGain = gainValue * (0.8 + Math.random() * 0.2); // Случайная громкость 0.15–0.25
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(noteGain, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + noteDuration);

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start(ctx.currentTime + i * 0.15);
        oscillator.stop(ctx.currentTime + i * 0.15 + noteDuration);
    });
};

// Воспроизведение звука для инициализации (гул с двумя осцилляторами)
window.playInitialization = function(duration = 2.0, gainValue = 0.1) {
    const ctx = initAudioContext();
    const oscillator1 = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator1.frequency.setValueAtTime(150, ctx.currentTime); // Основной гул
    oscillator2.frequency.setValueAtTime(80, ctx.currentTime); // Низкий субтон
    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator1.connect(gain);
    oscillator2.connect(gain);
    gain.connect(ctx.destination);

    oscillator1.start();
    oscillator2.start();
    oscillator1.stop(ctx.currentTime + duration);
    oscillator2.stop(ctx.currentTime + duration);
};

// Воспроизведение звука для стабилизации (аккорд с панорамированием)
window.playStabilization = function(duration = 1.5, gainValue = 0.15) {
    const ctx = initAudioContext();
    const notes = ['C4', 'E4', 'G4'];
    notes.forEach((note, i) => {
        const frequency = window.noteFrequencies[note] || 261.63; // Fallback to C4
        if (!Number.isFinite(frequency)) {
            console.warn('playStabilization: Invalid frequency for note ' + note + ', using fallback 261.63');
            return;
        }
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner(); // Панорамирование
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        gain.gain.setValueAtTime(gainValue, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        panner.pan.setValueAtTime(i === 0 ? -0.5 : i === 1 ? 0 : 0.5, ctx.currentTime); // Разделение нот по стерео

        oscillator.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + duration);
    });
};

// Экспортируем функции в глобальную область
window.initAudioContext = initAudioContext;
