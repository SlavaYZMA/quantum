console.log('audio.js loaded');

window.AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

try {
    audioCtx = new AudioContext();
    console.log('AudioContext initialized');
} catch (e) {
    console.error('Failed to initialize AudioContext:', e);
}

window.noteFrequencies = {
    'C4': 261.63,
    'D#4': 311.13,
    'F4': 349.23,
    'G4': 392.00,
    'A#4': 466.16,
    'spiral': 523.25, // C5
    'wave': 587.33,   // D5
    'fractal': 659.25,// E5
    'ellipse': 698.46 // F5
};

window.playNote = function(frequency, type = 'sine', gainValue = 0.5, duration = 0.2) {
    if (!audioCtx) return;
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(gainValue, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.currentTime ? audioCtx.destination : null);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    oscillator.stop(audioCtx.currentTime + duration);
};

window.playInitialization = function() {
    if (!audioCtx) return;
    window.playNote(261.63, 'sine', 0.3, 0.5);
    setTimeout(() => window.playNote(392.00, 'sine', 0.3, 0.5), 200);
};

window.playTransition = function() {
    if (!audioCtx) return;
    window.playNote(349.23, 'triangle', 0.4, 0.6);
    setTimeout(() => window.playNote(466.16, 'triangle', 0.4, 0.6), 300);
};

window.playStabilization = function() {
    if (!audioCtx) return;
    window.playNote(392.00, 'sine', 0.5, 0.7);
    setTimeout(() => window.playNote(523.25, 'sine', 0.5, 0.7), 400);
};

window.playCollapse = function() {
    if (!audioCtx) return;
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.8);
    gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.currentTime ? audioCtx.destination : null);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.8);
};

window.playInterference = function(freq1, freq2, gainValue = 0.3, duration = 0.15) {
    if (!audioCtx) return;
    let oscillator1 = audioCtx.createOscillator();
    let oscillator2 = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator1.frequency.setValueAtTime(freq1, audioCtx.currentTime);
    oscillator2.frequency.setValueAtTime(freq2, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(gainValue, audioCtx.currentTime);
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioCtx.currentTime ? audioCtx.destination : null);
    oscillator1.start();
    oscillator2.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    oscillator1.stop(audioCtx.currentTime + duration);
    oscillator2.stop(audioCtx.currentTime + duration);
};

window.playTunneling = function(frequency, gainValue = 0.2, duration = 0.3) {
    if (!audioCtx) return;
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(gainValue, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.currentTime ? audioCtx.destination : null);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    oscillator.stop(audioCtx.currentTime + duration);
};

window.playArpeggio = function(shape) {
    if (!audioCtx) return;
    let freqs = {
        'spiral': [523.25, 659.25, 783.99],
        'wave': [587.33, 698.46, 880.00],
        'fractal': [659.25, 783.99, 987.77],
        'ellipse': [698.46, 880.00, 1046.50]
    }[shape];
    let time = audioCtx.currentTime;
    freqs.forEach((freq, i) => {
        window.playNote(freq, 'triangle', 0.4, 0.2);
        setTimeout(() => window.playNote(freq, 'triangle', 0.4, 0.2), i * 150);
    });
};
