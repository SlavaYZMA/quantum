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

// Частоты нот для C минорной гаммы (C4, D#4, E4, F4, G4, A#4)
window.noteFrequencies = {
    'C4': 261.63,
    'D#4': 311.13,
    'E4': 329.63, // Добавлена E4 для аккорда в playStabilization
    'F4': 349.23,
    'G4': 392.00,
    'A#4': 466.16
};

// Воспроизведение одной ноты
window.playNote = function(frequency, type = 'sine', duration = 0.5, gainValue = 0.2) {
    if (!Number.isFinite(frequency)) {
        console.warn('playNote: Invalid frequency, using fallback 261.63');
        frequency = 261.63; // Fallback to C4
    }
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
};

// Воспроизведение биений для интерференции
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

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator1.frequency.setValueAtTime(frequency1, ctx.currentTime);
    oscillator2.frequency.setValueAtTime(frequency2, ctx.currentTime);
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

    // Создание импульса для реверба (короткий белый шум)
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * 0.5; // 0.5 сек реверба
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.1));
    }
    convolver.buffer = buffer;

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(convolver);
    convolver.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
};

// Воспроизведение арпеджио для коллапса
window.playArpeggio = function(shape, duration = 0.5, gainValue = 0.2) {
    const ctx = initAudioContext();
    const notes = {
        'ribbon': ['C4', 'E4', 'G4'],
        'ellipse': ['D#4', 'F4', 'A#4'],
        'cluster': ['G4', 'C4', 'F4']
    }[shape] || ['C4', 'E4', 'G4'];
    
    notes.forEach((note, i) => {
        const frequency = window.noteFrequencies[note] || 261.63; // Fallback to C4
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(gainValue, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + duration / 3);

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start(ctx.currentTime + i * 0.15);
        oscillator.stop(ctx.currentTime + i * 0.15 + duration / 3);
    });
};

// Воспроизведение звука для инициализации (гул)
window.playInitialization = function(duration = 2.0, gainValue = 0.1) {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime); // Низкий гул
    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
};

// Воспроизведение звука для стабилизации (аккорд)
window.playStabilization = function(duration = 1.5, gainValue = 0.15) {
    const ctx = initAudioContext();
    const notes = ['C4', 'E4', 'G4'];
    notes.forEach(note => {
        const frequency = window.noteFrequencies[note] || 261.63; // Fallback to C4
        if (!Number.isFinite(frequency)) {
            console.warn('playStabilization: Invalid frequency for note ' + note + ', using fallback 261.63');
            return;
        }
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        gain.gain.setValueAtTime(gainValue, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + duration);
    });
};

// Экспортируем функции в глобальную область
window.initAudioContext = initAudioContext;
