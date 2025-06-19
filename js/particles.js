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

function preload() {
  console.log('Attempting to load image from: assets/portrait.jpg');
  window.img = loadImage('assets/portrait.jpg', () => {
    console.log('Image loaded successfully:', window.img.width, 'x', window.img.height);
    loop();
  }, () => {
    console.error('Failed to load image from assets/portrait.jpg. Trying fallback path: portrait.jpg');
    window.img = loadImage('portrait.jpg', () => {
      console.log('Fallback image loaded successfully:', window.img.width, 'x', window.img.height);
      loop();
    }, () => {
      console.error('Failed to load fallback image. Using empty image.');
      window.img = createImage(100, 100);
      window.img.loadPixels();
      loop();
    });
  });
}

function easeOutQuad(t) {
  return t * (2 - t);
}

function setup() {
  console.time("Setup");
  window.canvas = createCanvas(windowWidth, windowHeight - 100);
  window.canvas.parent('canvasContainer4');
  pixelDensity(1);
  frameRate(navigator.hardwareConcurrency < 4 ? 20 : 25);
  noLoop();
  window.canvas.elt.style.display = 'block';
  window.canvas.elt.style.position = 'absolute';
  window.canvas.elt.style.top = '100px';
  window.canvas.elt.style.left = '0';
  window.canvas.elt.style.zIndex = '-1';
  document.getElementById('canvasContainer4').style.zIndex = '1';
  document.getElementById('canvasContainer4').style.position = 'relative';
  document.getElementById('canvasContainer4').style.border = 'none';

  let fsButton = createButton('Full Screen');
  fsButton.position(windowWidth - 100, 10);
  fsButton.mousePressed(() => {
    if (!document.fullscreenElement) {
      document.getElementById('canvasContainer4').requestFullscreen().then(() => {
        resizeCanvas(windowWidth, windowHeight);
        updateBoundary();
        window.trailBuffer = createGraphics(windowWidth, windowHeight);
        window.trailBuffer.pixelDensity(1);
      });
    } else {
      document.exitFullscreen().then(() => {
        resizeCanvas(windowWidth, windowHeight - 100);
        updateBoundary();
        window.trailBuffer = createGraphics(windowWidth, windowHeight - 100);
        window.trailBuffer.pixelDensity(1);
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
  console.timeEnd("Setup");
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
      let canvasY = y + ((document.fullscreenElement ? windowHeight : windowHeight - 100) - img.height) / 2 + offsetY - 150;

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
  console.time("Draw");
  console.log("Draw called, frame:", window.frame, "particles:", window.particles.length);

  if (!window.img || !window.img.width) {
    console.warn("Image not loaded yet.");
    return;
  }

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

  if (window.particles.length > window.maxParticles) {
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

  console.log("FPS:", Math.round(frameRate()));
  console.timeEnd("Draw");
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
  console.time("InitializeParticles");
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
      let blockCenterX_canvas = x + (windowWidth - window.img.width) / 2 + maxBlockSize / 2;
      let blockCenterY_canvas = y + ((document.fullscreenElement ? windowHeight : windowHeight - 100) - window.img.height) / 2 + maxBlockSize / 2 - 150;
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
        sides: shapeType === 2 ? floor(random(5, 13)) : 0,
        tunneled: false,
        tunnelTargetX: 0,
        tunnelTargetY: 0,
        superposition: superposition,
        timeAnomaly: timeAnomaly,
        timeDirection: timeAnomaly ? random([-1, 1]) : 1,
        uncertainty: random(0.5, 3),
        wavePhase: block.wavePhase,
        radialAngle: angle,
        radialDistance: 0,
        targetRadialDistance: random(100, 300),
        superpositionT: 0,
        probAmplitude: random(0.5, 1.5),
        barrier: random() < 0.1 ? { x: random(windowWidth), y: random(windowHeight), width: 20, height: 100 } : null,
        speed: random(0.8, 1.5),
        rotation: 0,
        individualPeriod: random(0.5, 3),
        decoherence: 0,
        entangledIndex: -1
      };
      window.particles.push(particle);
      particleCount++;

      if (random() < 0.05 && particle.layer === 'main') {
        let entangled = { ...particle };
        entangled.x = random(windowWidth);
        entangled.y = random(document.fullscreenElement ? windowHeight : windowHeight - 100);
        entangled.baseX = entangled.x;
        entangled.baseY = entangled.y;
        entangled.chaosSeed = random(1000);
        entangled.entangledIndex = window.particles.length;
        particle.entangledIndex = window.particles.length + 1;
        window.particles.push(entangled);
        window.entangledPairs.push([particleCount - 1, particleCount]);
        particleCount++;
        addQuantumMessage("Запутанность: две частицы связаны, их состояния синхронизированы.", "entanglement");
      }
    }
  }

  for (let i = 0; i < window.particles.length; i++) {
    let particle = window.particles[i];
    let pixelX = constrain(Math.floor(particle.gridX), 0, window.img.width - 1);
    let pixelY = constrain(Math.floor(particle.gridY), 0, window.img.height - 1);
    let col = window.img.get(pixelX, pixelY);
    let isMonochrome = random() < 0.2;
    let gray = (red(col) + green(col) + blue(col)) / 3 * random(0.7, 1);
    window.quantumStates[i] = {
      r: isMonochrome ? gray : red(col),
      g: isMonochrome ? gray : green(col),
      b: isMonochrome ? gray : blue(col),
      a: 255,
      baseR: red(col),
      baseG: green(col),
      baseB: blue(col),
      collapsed: false
    };
  }
  console.log(`Initialized ${particleCount} particles, canvas: ${windowWidth}x${windowHeight - 100}`);
  console.timeEnd("InitializeParticles");
}

function updateParticle(particle, state) {
  let px = particle.x + particle.offsetX;
  let py = particle.y + particle.offsetY;
  if (px < 0 || px > windowWidth || py < 0 || py > (document.fullscreenElement ? windowHeight : windowHeight - 100) || particle.alpha < 20) {
    return;
  }

  let noiseX = cachedNoise(particle.chaosSeed + window.frame * 0.03, 0, 0) * 2 - 1;
  let noiseY = cachedNoise(0, particle.chaosSeed + window.frame * 0.03, 0) * 2 - 1;

  if (window.frame >= particle.startFrame - 25 && window.frame <= particle.startFrame) {
    particle.superpositionT = map(window.frame, particle.startFrame - 25, particle.startFrame, 0, 1);
  } else if (window.frame > particle.startFrame) {
    particle.superpositionT = 1;
  }

  if (window.isPaused) {
    particle.offsetX += cachedNoise(particle.chaosSeed, window.frame * 0.01, 0) * 0.5 - 0.25;
    particle.offsetY += cachedNoise(particle.chaosSeed + 100, window.frame * 0.01, 0) * 0.5 - 0.25;
  }

  if (particle.superpositionT >= 1) {
    particle.offsetX += noiseX * particle.uncertainty * 15 * particle.probAmplitude * particle.speed;
    particle.offsetY += noiseY * particle.uncertainty * 15 * particle.probAmplitude * particle.speed;
    particle.rotation += noiseX * 0.05;
    let sizeNoise = cachedNoise(particle.chaosSeed, window.frame * 0.02, 0);
    particle.size = particle.targetSize * (1 + 0.3 * sizeNoise);

    let waveOffset = cachedNoise(particle.chaosSeed, window.frame * 0.03, 1) * 50 * particle.probAmplitude;
    particle.offsetX += waveOffset * cos(particle.wavePhase);
    particle.offsetY += waveOffset * sin(particle.wavePhase);

    particle.decoherence += 0.001 * cachedNoise(particle.chaosSeed, window.frame * 0.01, 2);
    if (particle.decoherence > 1) {
      particle.alpha *= 0.95;
      particle.probAmplitude *= 0.98;
      if (random() < 0.01) {
        particle.alpha = 0;
        addQuantumMessage("Декогеренция: частица потеряла квантовую когерентность.", "decoherence");
      }
    }

    if (particle.superposition) {
      particle.offsetX += cachedNoise(particle.chaosSeed, window.frame * 0.02, 3) * 10;
      particle.offsetY += cachedNoise(particle.chaosSeed + 200, window.frame * 0.02, 3) * 10;
    }

    if (random() < 0.02) {
      particle.alpha = 255;
      setTimeout(() => particle.alpha *= 0.9, 200);
    }

    if (particle.barrier && random() < 0.1 && !particle.tunneled) {
      let distToBarrier = dist(particle.x, particle.y, particle.barrier.x, particle.barrier.y);
      if (distToBarrier < 50) {
        particle.tunneled = true;
        particle.tunnelTargetX = particle.barrier.x + random(-20, 20);
        particle.tunnelTargetY = particle.y + random(-20, 20);
        window.trailBuffer.noFill();
        for (let i = 0; i < 3; i++) {
          window.trailBuffer.stroke(state.r, state.g, state.b, 255 - i * 85);
          window.trailBuffer.strokeWeight(1);
          window.trailBuffer.ellipse(particle.tunnelTargetX, particle.tunnelTargetY, 10 + i * 5);
        }
        setTimeout(() => {
          particle.tunneled = false;
          particle.x = particle.tunnelTargetX;
          particle.y = particle.tunnelTargetY;
          addQuantumMessage("Туннелирование: частица преодолела барьер.", "tunneling");
        }, 500);
      }
    }

    for (let other of window.particles) {
      if (other !== particle && random() < 0.005) {
        let d = dist(particle.x + particle.offsetX, particle.y + particle.offsetY, other.x + other.offsetX, other.y + other.offsetY);
        if (d < 50 && d > 0) {
          particle.offsetX += (other.offsetX - particle.offsetX) * 0.2;
          particle.offsetY += (other.offsetY - particle.offsetY) * 0.2;
        }
      }
    }

    let breakupT = map(window.frame, particle.startFrame, particle.startFrame + 175, 0, 1);
    breakupT = constrain(breakupT, 0, 1);
    if (particle.timeAnomaly) {
      breakupT += particle.timeDirection * 0.02 * cachedNoise(particle.chaosSeed, window.frame * 0.05, 4);
      breakupT = constrain(breakupT, 0, 1);
    }
    let easedT = easeOutQuad(breakupT);

    particle.size = lerp(particle.size, particle.targetSize, easedT);
    let noiseAngle = cachedNoise(particle.chaosSeed + window.frame * 0.02, 0, 0) * PI / 4;
    let angle = particle.radialAngle + noiseAngle;
    particle.radialDistance = lerp(particle.radialDistance, particle.targetRadialDistance, easedT);
    particle.offsetX = cos(angle) * particle.radialDistance;
    particle.offsetY = sin(angle) * particle.radialDistance;

    if (particle.entangledIndex >= 0) {
      let other = window.particles[particle.entangledIndex];
      if (other && other.alpha >= 20) {
        let dx = (other.offsetX - particle.offsetX) * 0.05;
        let dy = (other.offsetY - particle.offsetY) * 0.05;
        particle.offsetX += dx;
        particle.offsetY += dy;
        other.offsetX -= dx;
        other.offsetY -= dy;
      }
    }
  }

  let d = dist(mouseX, mouseY, particle.x + particle.offsetX, particle.y + particle.offsetY);
  let influence = d < window.mouseInfluenceRadius ? map(d, 0, window.mouseInfluenceRadius, 1, 0) : 0;
  let mouseSpeed = dist(mouseX, mouseY, window.lastMouseX, window.lastMouseY);
  if (mouseX === window.lastMouseX && mouseY === window.lastMouseY) {
    window.mouseHoverTime += 0.016;
  } else {
    window.mouseHoverTime = 0;
  }
  if (influence > 0.5 && !window.isPaused && particle.superposition && !state.collapsed) {
    let collapseProb = mouseSpeed > 20 ? 0.15 : 0.1;
    if (random() < collapseProb) {
      state.collapsed = true;
      particle.superposition = false;
      particle.shapeType = random() < 0.5 ? floor(random(5)) : particle.shapeType;
      particle.uncertainty = 0;
      particle.probAmplitude = 1;
      window.trailBuffer.noFill();
      for (let i = 0; i < 3; i++) {
        window.trailBuffer.stroke(state.r, state.g, state.b, 255 - i * 85);
        window.trailBuffer.strokeWeight(1);
        window.trailBuffer.ellipse(particle.x + particle.offsetX, particle.y + particle.offsetY, 20 + i * 10);
      }
      if (random() < 0.1) {
        window.trailBuffer.stroke(255, 255, 255, 100);
        window.trailBuffer.line(particle.x + particle.offsetX, particle.y + particle.offsetY, mouseX, mouseY);
      }
      addQuantumMessage("Коллапс: измерение вызвало выбор одного состояния.", "collapse");
    }
  }
  if (influence > 0 && !window.isPaused) {
    let repelAngle = atan2(particle.y + particle.offsetY - mouseY, particle.x + particle.offsetX - mouseX);
    particle.offsetX += cos(repelAngle) * 15 * influence;
    particle.offsetY += sin(repelAngle) * 15 * influence;
    particle.speed *= 1.3;
    let noiseVal = cachedNoise(particle.chaosSeed, window.frame * 0.05, 5);
    particle.offsetX += noiseVal * 10 * influence;
    particle.offsetY += cachedNoise(particle.chaosSeed + 300, window.frame * 0.05, 5) * 10 * influence;
    particle.probAmplitude += influence * 0.02 * (window.mouseHoverTime > 1 ? 2 : 1);
    let waveOffset = cachedNoise(particle.chaosSeed, window.frame * 0.03, 6) * 50 * influence;
    particle.offsetX += waveOffset * cos(particle.wavePhase);
    particle.offsetY += waveOffset * sin(particle.wavePhase);
    state.r = constrain(state.baseR + influence * 30, 0, 255);
    state.g = constrain(state.baseG + influence * 30, 0, 255);
    state.b = constrain(state.baseB + influence * 30, 0, 255);
    if ((mouseSpeed > 20 || window.mouseHoverTime > 1) && random() < 0.05 && window.particles.length < window.maxParticles) {
      let newParticle = {
        x: particle.x,
        y: particle.y,
        baseX: particle.x,
        baseY: particle.y,
        offsetX: 0,
        offsetY: 0,
        size: random(5, 15),
        targetSize: random(5, 15),
        phase: random(TWO_PI),
        gridX: particle.gridX,
        gridY: particle.gridY,
        layer: 'main',
        chaosSeed: random(1000),
        alpha: 255,
        startFrame: window.frame,
        birthFrame: window.frame,
        shapeType: floor(random(5)),
        sides: floor(random(5, 13)),
        tunneled: false,
        tunnelTargetX: 0,
        tunnelTargetY: 0,
        superposition: random() < 0.3,
        timeAnomaly: random() < 0.05,
        timeDirection: random([-1, 1]),
        uncertainty: random(0.5, 3),
        wavePhase: random(TWO_PI),
        radialAngle: random(TWO_PI),
        radialDistance: 0,
        targetRadialDistance: random(100, 300),
        superpositionT: 1,
        probAmplitude: random(0.5, 1.5),
        barrier: null,
        speed: random(0.8, 1.5),
        rotation: 0,
        individualPeriod: random(0.5, 3),
        decoherence: 0,
        entangledIndex: -1
      };
      window.particles.push(newParticle);
      window.quantumStates.push({
        r: state.r,
        g: state.g,
        b: state.b,
        a: 255,
        baseR: state.baseR,
        baseG: state.baseG,
        baseB: state.baseB,
        collapsed: false
      });
    }
  }

  if (!isPointInBoundary(particle.x + particle.offsetX, particle.y + particle.offsetY)) {
    let nearestPoint = window.boundaryPoints.reduce((closest, p) => {
      let distToP = dist(particle.x + particle.offsetX, particle.y + particle.offsetY, p.x, p.y);
      return distToP < closest.dist ? { x: p.x, y: p.y, dist: distToP } : closest;
    }, { x: 0, y: 0, dist: Infinity });
    particle.offsetX = nearestPoint.x - particle.x;
    particle.offsetY = nearestPoint.y - particle.y;
  }

  if (particle.layer === 'main' && window.frame >= particle.startFrame && particle.superpositionT >= 1 && random() < 0.1 && particle.probAmplitude > 0.7) {
    let probDensity = particle.probAmplitude * 100;
    window.trailBuffer.fill(state.r, state.g, state.b, probDensity);
    window.trailBuffer.noStroke();
    window.trailBuffer.ellipse(particle.x + particle.offsetX, particle.y + particle.offsetY, particle.size / 2, particle.size / 2);
    if (random() < 0.3) {
      window.trailBuffer.stroke(255, 255, 255, 50);
      window.trailBuffer.strokeWeight(0.5);
      window.trailBuffer.line(
        particle.x + particle.offsetX,
        particle.y + particle.offsetY,
        particle.x + particle.offsetX + random(-20, 20),
        particle.y + particle.offsetY + random(-20, 20)
      );
    }
  }

  particle.phase += particle.individualPeriod * 0.03;
  window.lastMouseX = mouseX;
  window.lastMouseY = mouseY;
}

function renderParticle(particle, state) {
  let px = particle.x + particle.offsetX;
  let py = particle.y + particle.offsetY;
  if (px < 0 || px > windowWidth || py < 0 || py > (document.fullscreenElement ? windowHeight : windowHeight - 100)) return;

  push();
  translate(px, py);
  rotate(particle.rotation);
  let colorShift = cachedNoise(particle.chaosSeed, window.frame * 0.02, 7) * 20;
  let alpha = particle.alpha * state.a / 255;
  let strokeW = map(window.frame - particle.birthFrame, 250, 500, 1, 0);
  stroke(state.r + colorShift, state.g + colorShift, state.b + colorShift, alpha * 0.5);
  strokeWeight(strokeW);
  fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, alpha);
  drawingContext.shadowBlur = particle.superposition ? 10 : 0;

  let size = particle.size;
  let waveDistort = 0.7 * cachedNoise(particle.chaosSeed, window.frame * 0.07, 8);

  if (particle.superposition && !state.collapsed) {
    let probDensity = particle.probAmplitude * 250;
    fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, probDensity * 0.5);
    noStroke();
    ellipse(0, 0, size * 4, size * 4);
    for (let i = 0; i < 3; i++) {
      if (random() < 0.6) {
        fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, probDensity * 0.3);
        noStroke();
        let superX = random(-30, 30);
        let superY = random(-30, 30);
        let pulse = cachedNoise(particle.chaosSeed, window.frame * 0.1, i + 9) * 10;
        ellipse(superX + pulse, superY + pulse, size * 3);
      }
    }
  }

  if (particle.superpositionT < 1) {
    rect(-size / 2, -size / 2, size, size);
    for (let i = 0; i < 2; i++) {
      if (random() < 0.5) {
        fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, alpha * 0.3);
        noStroke();
        let superX = random(-30, 30);
        let superY = random(-30, 30);
        let pulse = cachedNoise(particle.chaosSeed, window.frame * 0.1, i + 11) * 5;
        ellipse(superX + pulse, superY, size * 2);
      }
    }
  } else {
    if (particle.shapeType === 0) {
      ellipse(0, 0, size * (1 + waveDistort), size * (1 - waveDistort));
    } else if (particle.shapeType === 1) {
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / 3) {
        let r = size * (1 + waveDistort * cos(a));
        vertex(r * cos(a), r * sin(a));
      }
      endShape(CLOSE);
    } else if (particle.shapeType === 2) {
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / particle.sides) {
        let r = size * (0.8 + 0.3 * cachedNoise(a * 3 + particle.chaosSeed, window.frame * 0.02, 13));
        vertex(r * cos(a), r * sin(a));
      }
      endShape(CLOSE);
    } else if (particle.shapeType === 3) {
      beginShape();
      let noiseVal = cachedNoise(particle.chaosSeed, window.frame * 0.01, 14);
      for (let a = 0; a < TWO_PI; a += TWO_PI / 30) {
        let r = size * (0.5 + 0.5 * noiseVal + waveDistort + 0.3 * cachedNoise(a * 0.5, window.frame * 0.05, 15));
        vertex(r * cos(a), r * sin(a));
      }
      endShape(CLOSE);
    } else {
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / 40) {
        let r = size * (0.6 + 0.4 * cachedNoise(a * 2 + particle.chaosSeed, window.frame * 0.03, 16));
        r *= (1 + 0.2 * cachedNoise(a * 5, window.frame * 0.01, 17));
        vertex(r * cos(a), r * sin(a));
      }
      endShape(CLOSE);
    }
  }

  if (particle.barrier) {
    fill(255, 255, 255, 50);
    noStroke();
    rect(particle.barrier.x - particle.x, particle.barrier.y - particle.y, particle.barrier.width, particle.barrier.height);
    if (particle.tunneled) {
      fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, 30);
      ellipse(particle.tunnelTargetX - particle.x, particle.tunnelTargetY - particle.y, size / 2);
    }
  }

  pop();
}
