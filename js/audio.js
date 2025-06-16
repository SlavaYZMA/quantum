let cursorHistory = [];

export function addCursorPosition(x, y) {
  cursorHistory.push({ x, y, time: Date.now() });
  if (cursorHistory.length > 100) cursorHistory.shift();
}

export function generateSoundFromCursor() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = 1.5;
  const numSamples = sampleRate * duration;
  const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
  const channelData = buffer.getChannelData(0);

  const now = Date.now();
  const recentCursorData = cursorHistory.filter(c => now - c.time < 1500);

  let amplitude = 0;
  let speed = 0;
  if (recentCursorData.length > 1) {
    for (let i = 1; i < recentCursorData.length; i++) {
      const dx = recentCursorData[i].x - recentCursorData[i - 1].x;
      const dy = recentCursorData[i].y - recentCursorData[i - 1].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      speed += dist;
      amplitude = Math.max(amplitude, dist);
    }
    speed /= recentCursorData.length - 1;
  }

  const normalizedAmplitude = Math.min(amplitude / 100, 1);
  const normalizedSpeed = Math.min(speed / 50, 1);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noise = Math.random() * 2 - 1;
    const freq = 200 + normalizedSpeed * 800;
    const wave = Math.sin(2 * Math.PI * freq * t) * (1 - t / duration);
    channelData[i] = noise * 0.3 * normalizedAmplitude + wave * 0.2;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();

  const wavBuffer = audioBufferToWav(buffer);
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'observer-sound.wav';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numChannels * 2 + 44;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  let offset = 0;
  writeString(view, offset, 'RIFF'); offset += 4;
  view.setUint32(offset, length - 8, true); offset += 4;
  writeString(view, offset, 'WAVE'); offset += 4;
  writeString(view, offset, 'fmt '); offset += 4;
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2; // PCM
  view.setUint16(offset, numChannels, true); offset += 2;
  view.setUint32(offset, sampleRate, true); offset += 4;
  view.setUint32(offset, sampleRate * numChannels * 2, true); offset += 4;
  view.setUint16(offset, numChannels * 2, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString(view, offset, 'data'); offset += 4;
  view.setUint32(offset, buffer.length * numChannels * 2, true); offset += 4;

  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < buffer.length; i++, offset += 2) {
    view.setInt16(offset, channelData[i] * 0x7FFF, true);
  }

  return arrayBuffer;
}