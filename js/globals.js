window.currentStep = 0;
window.uploadedImageUrl = '';
window.img = null;
window.particles = [];
window.quantumStates = [];
window.entangledPairs = [];
window.isPaused = false;
window.simplifyAnimations = false;
window.weirdnessFactor = 0.5;
window.isCanvasReady = false;
window.p5Canvas = null;
window.p5Instance = null;
window.cursorX = 0;
window.cursorY = 0;
window.frame = 0;
window.noiseScale = 0.03;
window.mouseInfluenceRadius = 200;
window.chaosFactor = 0;
window.boundaryPoints = [];
window.chaosTimer = 0;
window.trailBuffer = null;
window.lastMouseX = 0;
window.lastMouseY = 0;
window.mouseHoverTime = 0;
window.noiseCache = new Map();
window.lastFrameTime = 0;
window.maxParticles = 0;
window.textMessages = { active: null, queue: [] };
window.portraitUrls = [
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/150/0000FF',
  'https://via.placeholder.com/150/FF0000'
];
