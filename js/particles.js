// Глобальные переменные для анимации
window.frame = 0;
window.isPaused = false;
window.particles = [];
window.quantumStates = [];
window.canvas = null;
window.isCanvasReady = false;
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
window.entangledPairs = [];
window.img = null; // Ссылка на загруженное изображение

function easeOutQuad(t) {
  return t * (2 - t);
}

function setup() {
  window.canvas = createCanvas(windowWidth, windowHeight - 100);
  window.canvas.parent('portrait-animation-container');
  pixelDensity(1);
  frameRate(navigator.hardwareConcurrency < 4 ? 20 : 25);
  noLoop();
  window.canvas.elt.style.display = 'block';
  window.canvas.elt.style.position = 'absolute';
  window.canvas.elt.style.top = '0';
  window.canvas.elt.style.left = '0';
  window.canvas.elt.style.zIndex = '0';

  let fsButton = createButton('Full Screen');
  fsButton.position(windowWidth - 100, 10);
  fsButton.mousePressed(() => {
    if (!document.fullscreenElement) {
      document.getElementById('portrait-animation-container').requestFullscreen().then(() => {
        resizeCanvas(windowWidth, windowHeight);
        updateBoundary();
      });
    } else {
      document.exitFullscreen().then(() => {
        resizeCanvas(windowWidth, windowHeight - 100);
        updateBoundary();
      });
    }
  });

  window.trailBuffer = createGraphics(windowWidth, windowHeight - 100);
  window.trailBuffer.pixelDensity(1);

  window.canvas.elt.addEventListener('click', function() {
    if (window.currentStep === 5) {
      if (!window.isPaused) {
        window.isPaused = true;
        noLoop();
        document.getElementById('saveButton').style.display = 'block';
      } else {
        window.isPaused = false;
        loop();
        document.getElementById('saveButton').style.display = 'none';
      }
    }
  });

  window.canvas.elt.addEventListener('touchmove', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    mouseX = touch.clientX - window.canvas.elt.offsetLeft;
    mouseY = touch.clientY - window.canvas.elt.offsetTop;
  }, { passive: false });

  window.addEventListener('resize', () => {
    resizeCanvas(windowWidth, document.fullscreenElement ? windowHeight : windowHeight - 100);
    window.trailBuffer = createGraphics(windowWidth, document.fullscreenElement ? windowHeight : windowHeight - 100);
    window.trailBuffer.pixelDensity(1);
    updateBoundary();
  });

  updateBoundary();
  window.isCanvasReady = true;
}

function updateBoundary() {
  window.boundaryPoints = [];
  let numPoints = 40;
  let margin = 10;
  let maxX = windowWidth - margin;
  let maxY = (document.fullscreenElement ? windowHeight : windowHeight - 100) - margin;
  for (let i = 0; i < numPoints / 4; i++) {
    let x = lerp(margin, maxX, i / (numPoints / 4));
    window.boundaryPoints.push({ x, y: margin });
  }
  for (let i = 0; i < numPoints / 4; i++) {
    let y = lerp(margin, maxY, i / (numPoints / 4));
    window.boundaryPoints.push({ x: maxX, y });
  }
  for (let i = 0; i < numPoints / 4; i++) {
    let x = lerp(maxX, margin, i / (numPoints / 4));
    window.boundaryPoints.push({ x, y: maxY });
  }
  for (let i = 0; i < numPoints / 4; i++) {
    let y = lerp(maxY, margin, i / (numPoints / 4));
    window.boundaryPoints.push({ x: margin, y });
  }
}

function isPointInBoundary(x, y) {
  let margin = 10;
  let maxY = document.fullscreenElement ? windowHeight : windowHeight - 100;
  if (x < margin || x > windowWidth - margin || y < margin || y > maxY - margin) return false;
  let inside = false;
  for (let i = 0, j = window.boundaryPoints.length - 1; i < window.boundaryPoints.length; j = i++) {
    let xi = window.boundaryPoints[i].x, yi = window.boundaryPoints[i].y;
    let xj = window.boundaryPoints[j].x, yj = window.boundaryPoints[j].y;
    let intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function cachedNoise(x, y, z) {
  let key = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`;
  if (window.noiseCache.has(key)) {
    return window.noiseCache.get(key);
  }
  let value = noise(x, y, z);
  window.noiseCache.set(key, value);
  if (window.noiseCache.size > 10000) {
    window.noiseCache.clear();
  }
  return value;
}

function addQuantumMessage(message, eventType) {
  let newMessage = {
    text: message,
    x: random(100, windowWidth - 300),
    y: random(150, (document.fullscreenElement ? windowHeight : windowHeight - 100) - 50),
    alpha: 0,
    fadeIn: true,
    startFrame: window.frame,
    eventType: eventType
  };
  if (window.textMessages.active) {
    window.textMessages.queue.push(newMessage);
  } else {
    window.textMessages.active = newMessage;
  }
}

function renderQuantumMessages() {
  textAlign(LEFT, TOP);
  textSize(16);
  if (window.textMessages.active) {
    let msg = window.textMessages.active;
    let t = (window.frame - msg.startFrame) / 300;
    if (msg.fadeIn) {
      msg.alpha = lerp(0, 255, easeOutQuad(min(t, 0.1)));
      if (t >= 0.1) msg.fadeIn = false;
    } else {
      if (t < 0.8) {
        msg.alpha = 255;
      } else {
        msg.alpha = lerp(255, 0, easeOutQuad((t - 0.8) / 0.2));
      }
    }
    fill(255, 255, 255, msg.alpha);
    noStroke();
    text(msg.text, msg.x, msg.y);

    if (t > 1) {
      window.textMessages.active = null;
      if (window.textMessages.queue.length > 0) {
        window.textMessages.active = window.textMessages.queue.shift();
        window.textMessages.active.startFrame = window.frame;
      }
    }
  }
}

function renderTransformingPortrait(img, currentFrame) {
  img.loadPixels();
  let blockList = [];
  let maxBlockSize = 16;
  let blockSize = map(currentFrame, 1, 30, 1, maxBlockSize);
  blockSize = constrain(blockSize, 1, maxBlockSize);

  for (let y = 0; y < img.height; y += blockSize) {
    for (let x = 0; x < img.width; x += blockSize) {
      blockList.push({
        x,
        y,
        startFrame: random(15, 30),
        endFrame: random(31, 60),
        superpositionT: 0,
        wavePhase: random(TWO_PI),
        probAmplitude: random(0.5, 1),
        noiseSeed: random(1000)
      });
    }
  }

  for (let block of blockList) {
    if (currentFrame <= block.endFrame + 500) {
      let x = block.x;
      let y = block.y;
      let r = 0, g = 0, b = 0, count = 0;
      let size = min(blockSize, img.width - x, img.height - y);
      for (let dy = 0; dy < size && y + dy < img.height; dy++) {
        for (let dx = 0; dx < size && x + dx < img.width; dx++) {
          let col = img.get(x + dx, y + dy);
          r += red(col);
          g += green(col);
          b += blue(col);
          count++;
        }
      }
      if (count > 0) {
        r = r / count;
        g = g / count;
        b = b / count;
      }

      let offsetX = 0, offsetY = 0, rotation = 0;
      let noiseVal = cachedNoise(block.noiseSeed + currentFrame * 0.01, 0, 0);
      if (currentFrame > block.startFrame && currentFrame < block.endFrame) {
        let t = (currentFrame - block.startFrame) / (block.endFrame - block.startFrame);
        block.superpositionT = t;
        offsetX = noiseVal * 50 * (1 - t);
        offsetY = noiseVal * 50 * (1 - t);
        rotation = noiseVal * TWO_PI * (1 - t);
      } else if (currentFrame >= block.endFrame) {
        block.superpositionT = 1;
        offsetX = noiseVal * 50;
        offsetY = noiseVal * 50;
        rotation = noiseVal * TWO_PI;
      }

      push();
      translate(x + offsetX, y + offsetY);
      rotate(rotation);
      noStroke();
      fill(r, g, b);
      rect(0, 0, blockSize, blockSize);
      pop();
    }
  }
}

function draw() {
  if (!window.img || !window.img.width) {
    background(0);
    return;
  }

  let currentTime = millis();
  let deltaTime = (currentTime - window.lastFrameTime) / 1000;
  window.lastFrameTime = currentTime;
  window.frame++;

  background(0, 10);

  window.trailBuffer.background(0, 10);
  window.trailBuffer.noStroke();

  if (window.mouseIsPressed || (mouseX !== window.lastMouseX || mouseY !== window.lastMouseY)) {
    window.mouseHoverTime += deltaTime;
    if (window.mouseHoverTime > 0.5) {
      window.chaosFactor = min(window.chaosFactor + deltaTime * 0.5, 1);
    }
  } else {
    window.mouseHoverTime = max(window.mouseHoverTime - deltaTime * 0.5, 0);
    window.chaosFactor = max(window.chaosFactor - deltaTime * 0.5, 0);
  }

  window.lastMouseX = mouseX;
  window.lastMouseY = mouseY;

  if (window.chaosFactor > 0.1) {
    window.chaosTimer += deltaTime;
    if (window.chaosTimer > 0.1) {
      addQuantumMessage('COLLAPSE DETECTED', 'collapse');
      window.chaosTimer = 0;
    }
  }

  renderTransformingPortrait(window.img, window.frame);

  image(window.trailBuffer, 0, 0);
  renderQuantumMessages();
}
