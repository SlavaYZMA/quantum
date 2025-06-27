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
      let noiseVal = cachedNoise(block.noiseSeed + currentFrame * 0.05, 0, 0);
      if (currentFrame >= 1) {
        offsetX += noiseVal * 10 - 5;
        offsetY += cachedNoise(0, block.noiseSeed + currentFrame * 0.05, 0) * 10 - 5;
      }
      if (currentFrame >= block.startFrame) {
        let waveOffset = cachedNoise(block.noiseSeed, currentFrame * 0.03, 0) * 30 * block.probAmplitude;
        offsetX += waveOffset * cos(block.wavePhase);
        offsetY += waveOffset * sin(block.wavePhase);
        rotation += noiseVal * 0.1;
        if (random() < 0.05 && currentFrame === block.startFrame) {
          addQuantumMessage("Суперпозиция: частица в нескольких состояниях одновременно.", "superposition");
        }
      }
      let canvasX = x + (windowWidth - img.width) / 2 + offsetX;
      let canvasY = y + ((document.fullscreenElement ? windowHeight : windowHeight - 100) - img.height) / 2 + offsetY;

      if (currentFrame >= block.startFrame) {
        let probDensity = block.probAmplitude * 100;
        fill(r, g, b, probDensity);
        noStroke();
        ellipse(canvasX, canvasY, size * 4, size * 4);
      }
      let alpha = map(currentFrame, block.endFrame, block.endFrame + 500, 255, 0);
      let strokeW = map(currentFrame, block.endFrame, block.endFrame + 500, 1, 0);
      let colorShift = cachedNoise(block.noiseSeed, currentFrame * 0.02, 0) * 15;
      fill(r + colorShift, g + colorShift, b + colorShift, alpha);
      noStroke();
      push();
      translate(canvasX, canvasY);
      rotate(rotation);
      rect(-size / 2, -size / 2, size, size);
      pop();

      if (currentFrame >= block.startFrame && random() < 0.5) {
        for (let i = 0; i < 2; i++) {
          fill(r + colorShift, g + colorShift, b + colorShift, alpha * 0.3);
          noStroke();
          let superX = canvasX + random(-30, 30);
          let superY = canvasY + random(-30, 30);
          let pulse = cachedNoise(block.noiseSeed, currentFrame * 0.1, i) * 5;
          ellipse(superX + pulse, superY + pulse, size * 2);
        }
      }
    }
  }
  return blockList;
}

function draw() {
  let startTime = performance.now();
  if (!window.img || !window.img.width) return;

  window.frame++;
  window.chaosTimer += 0.016;
  window.chaosFactor = map(cachedNoise(window.frame * 0.01, 0, 0), 0, 1, 0.3, 1) * (window.weirdnessFactor || 0.5);

  if (window.chaosTimer > 5) {
    window.chaosTimer = 0;
    updateBoundary();
    window.mouseInfluenceRadius = random(150, 250);
    window.noiseScale = random(0.02, 0.04);
    if (random() < 0.1) {
      addQuantumMessage("Декогеренция: система теряет квантовую когерентность.", "decoherence");
    }
  }

  background(0);
  window.trailBuffer.clear();

  let blockList = [];
  if (window.frame <= 60) {
    blockList = renderTransformingPortrait(window.img, window.frame);
    if (window.frame === 31) {
      initializeParticles(blockList);
    }
  }

  let updateBackground = window.frame % 2 === 0;
  let vacuumParticles = window.particles.filter(p => p.layer === 'vacuum');
  let vacuumAlpha = map(cachedNoise(window.frame * 0.005, 0, 0), 0, 1, 30, 70);
  if (updateBackground) {
    for (let particle of vacuumParticles) {
      let state = window.quantumStates[window.particles.indexOf(particle)];
      let noiseVal = cachedNoise(particle.baseX * window.noiseScale, particle.baseY * window.noiseScale, window.frame * 0.005);
      particle.offsetX = noiseVal * 20 - 10;
      particle.offsetY = cachedNoise(particle.baseY * window.noiseScale, window.frame * 0.005, 0) * 20 - 10;
      particle.phase += 0.01;
      state.a = vacuumAlpha;
      if (particle.alpha >= 20) renderParticle(particle, state);
    }
  }

  let backgroundParticles = window.particles.filter(p => p.layer === 'background');
  if (updateBackground) {
    for (let particle of backgroundParticles) {
      let state = window.quantumStates[window.particles.indexOf(particle)];
      let noiseVal = cachedNoise(particle.baseX * window.noiseScale, particle.baseY * window.noiseScale, window.frame * 0.01);
      particle.offsetX = noiseVal * 30 - 15;
      particle.offsetY = cachedNoise(particle.baseY * window.noiseScale, window.frame * 0.01, 0) * 30 - 15;
      particle.phase += particle.individualPeriod * 0.02;
      if (particle.alpha >= 20) renderParticle(particle, state);
    }
  }

  let mainParticles = window.particles.filter(p => p.layer === 'main');
  let newParticles = [];
  let newStates = [];
  for (let i = 0; i < mainParticles.length; i++) {
    let particle = mainParticles[i];
    let state = window.quantumStates[window.particles.indexOf(particle)];
    updateParticle(particle, state);
    if (particle.alpha >= 20) {
      renderParticle(particle, state);
      newParticles.push(particle);
      newStates.push(state);
    }
  }

  let frameTime = performance.now() - startTime;
  if (frameTime > 40 && window.particles.length > 1000) {
    window.particles = window.particles.filter((p, i) => {
      let keep = p.alpha >= 20 || p.layer !== 'main';
      if (!keep) window.quantumStates.splice(i, 1);
      return keep;
    });
  }

  if (window.frame % 60 === 0) {
    renderInterference();
    addQuantumMessage("Интерференция: волновые узоры усиливают или подавляют друг друга.", "interference");
  }

  image(window.trailBuffer, 0, 0);
  renderQuantumMessages();
  window.lastFrameTime = frameTime;
}

function renderInterference() {
  let gridSize = 50;
  let maxY = document.fullscreenElement ? windowHeight : windowHeight - 100;
  for (let x = 0; x < windowWidth; x += gridSize) {
    for (let y = 0; y < maxY; y += gridSize) {
      let amplitude = 0;
      for (let particle of window.particles.filter(p => p.layer === 'main' && p.superposition)) {
        let d = dist(x, y, particle.x + particle.offsetX, particle.y + particle.offsetY);
        if (d < 100) {
          let wave = cos(d * 0.05 + window.frame * 0.02) * particle.probAmplitude;
          amplitude += wave;
        }
      }
      let intensity = constrain(map(amplitude, -1, 1, 0, 50), 0, 50);
      window.trailBuffer.fill(255, 255, 255, intensity);
      window.trailBuffer.noStroke();
      window.trailBuffer.ellipse(x, y, gridSize / 5);
    }
  }
}

function initializeParticles(blockList) {
  window.particles = [];
  window.quantumStates = [];
  window.entangledPairs = [];
  const maxBlockSize = 16;
  window.maxParticles = windowWidth < 768 ? 2000 : 4000;
  let particleCount = 0;

  window.img.loadPixels();
  let usedPositions = new Set();
  for (let block of blockList) {
    let x = block.x;
    let y = block.y;
    let pixelX = constrain(x, 0, window.img.width - 1);
    let pixelY = constrain(y, 0, window.img.height - 1);
    let posKey = `${pixelX},${pixelY}`;
    if (usedPositions.has(posKey)) continue;
    usedPositions.add(posKey);
    let col = window.img.get(pixelX, pixelY);
    let brightnessVal = brightness(col);
    if (brightnessVal > 10 && particleCount < window.maxParticles) {
      let blockCenterX_canvas = x + (windowWidth - img.width) / 2 + maxBlockSize / 2;
      let blockCenterY_canvas = y + ((document.fullscreenElement ? windowHeight : windowHeight - 100) - img.height) / 2 + maxBlockSize / 2;
      let layer = random() < 0.1 ? 'vacuum' : random() < 0.2 ? 'background' : 'main';
      let shapeType = floor(random(5));
      let targetSize = random(5, 30);
      let superposition = random() < 0.3;
      let timeAnomaly = random() < 0.05;
      let angle = random(TWO_PI);
      let particle = {
        x: blockCenterX_canvas,
        y: blockCenterY_canvas,
        baseX: blockCenterX_canvas,
        baseY: blockCenterY_canvas,
        offsetX: 0,
        offsetY: 0,
        size: maxBlockSize,
        targetSize: targetSize,
        phase: random(TWO_PI),
        gridX: x,
        gridY: y,
        layer: layer,
        chaosSeed: random(1000),
        alpha: 255,
        startFrame: block.endFrame,
        birthFrame: window.frame,
        shapeType: shapeType,
        sides:
