window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
let noteFrequencies = { 'C4': 261.63, 'E4': 329.63, 'G4': 392.00 };
let backgroundOsc = null;
let backgroundAmp = null;

window.playInitialization = () => {
    console.log('Playing initialization sound');
    playTone(200, 'sine', 0.3, 0.5);
};

window.playNote = (freq, type, gain, duration) => {
    console.log('Playing note:', freq);
    playTone(freq, type, gain, duration);
};

window.playInterference = (freq1, freq2, gain, duration) => {
    console.log('Playing interference sound');
    playTone(freq1, 'sine', gain, duration);
    playTone(freq2, 'sine', gain, duration);
};

window.playTunneling = (freq, gain, duration) => {
    console.log('Playing tunneling sound:', freq);
    playTone(freq, 'triangle', gain, duration);
};

window.playStabilization = () => {
    console.log('Playing stabilization sound');
    playTone(300, 'sine', 0.4, 0.7);
};

window.playArpeggio = (shape) => {
    console.log('Playing arpeggio sound for shape:', shape);
    let freqs = [261.63, 329.63, 392.00];
    freqs.forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.2, 0.15), i * 100));
};

window.playBackgroundTone = (freq, type, gain, duration) => {
    console.log('Playing background tone:', freq);
    if (backgroundOsc) {
        backgroundOsc.stop();
        backgroundAmp.disconnect();
    }
    const osc = window.audioContext.createOscillator();
    const amp = window.audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, window.audioContext.currentTime);
    amp.gain.setValueAtTime(gain, window.audioContext.currentTime);
    amp.gain.linearRampToValueAtTime(0.01, window.audioContext.currentTime + duration);
    osc.connect(amp);
    amp.connect(window.audioContext.destination);
    osc.start();
    osc.stop(window.audioContext.currentTime + duration);
    backgroundOsc = osc;
    backgroundAmp = amp;
};

function playTone(freq, type, gain, duration) {
    const osc = window.audioContext.createOscillator();
    const amp = window.audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, window.audioContext.currentTime);
    amp.gain.setValueAtTime(gain, window.audioContext.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + duration);
    osc.connect(amp);
    amp.connect(window.audioContext.destination);
    osc.start();
    osc.stop(window.audioContext.currentTime + duration);
}

document.addEventListener('click', () => {
    if (window.audioContext.state === 'suspended') {
        console.log('AudioContext resumed');
        window.audioContext.resume();
    }
});

console.log('audio.js loaded');
