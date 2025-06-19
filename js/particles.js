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

// Функция для плавной интерполяции
function easeOutQuad(t) {
  return t * (2 - t);
}

function setup() {
  window.canvas = createCanvas(windowWidth, windowHeight - 100); // 100px для UI сверху
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

  // Кнопка полноэкранного режима
  let fsButton = createButton('Full Screen');
  fsButton.position(windowWidth - 100, 10);
  fsButton.mousePressed(() => {
    if (!document.fullscreenElement) {
      document.getElementById('canvasContainer4').requestFullscreen().then(() => {
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
    let t = (window.frame - msg.startFrame) / 300; // 10 сек = 300 фреймов при 30 FPS
    if (msg.fadeIn) {
      msg.alpha = lerp(0, 255, easeOutQuad(min(t, 0.1))); // 1 сек появление
      if (t >= 0.1) msg.fadeIn = false;
    } else {
      if (t < 0.8) {
        msg.alpha = 255; // 7 сек видимость
      } else {
        msg.alpha = lerp(255, 0, easeOutQuad((t - 0.8) / 0.2)); // 2 сек исчезание
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
    if (particle.alpha >= 100) renderParticle(particle, state);
    newParticles.push(particle);
    newStates.push(state);
  }

  let frameTime = performance.now() - startTime;
  if (frameTime > 40 && window.particles.length > 1000) {
    window.particles = window.particles.filter((p, i) => {
      let keep = p.alpha >= 100 || p.layer !== 'main';
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
        if (d < 100) { // Ограничен радиус
          let wave = cos(d * 0.05 + window.frame * 0.02) * particle.probAmplitude;
          amplitude += wave;
        }
      }
      let intensity = constrain(map(amplitude, -1, 1, 0, 50), 0, 50); // Уменьшена интенсивность
      window.trailBuffer.fill(255, 255, 255, intensity);
      window.trailBuffer.noStroke();
      window.trailBuffer.ellipse(x, y, gridSize / 5); // Уменьшен размер
    }
  }
}

function initializeParticles(blockList) {
  window.particles = [];
  window.quantumStates = [];
  window.entangledPairs = [];
  const maxBlockSize = 16;
  window.maxParticles = windowWidth < 768 ? 768 : 4000;
  let particleCount = 0;
  let imgCenterX = window.img.width / 2 + (windowWidth - img.width) / 2;
  let imgCenterY = window.img.height / 2 + ((document.fullscreenElement ? windowHeight : windowHeight - 100) - img.height) / 2;

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
      let blockCenterY_canvas = y + ((document.fullscreenElement ? windowHeight : windowHeight - 100) - img.height) / 2 + 5;
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
        barrier: random() < 0.1 ? { x: random(windowWidth), y: random(windowHeight), width: 20, height100: y } : null,
        speed: random(0.8, 1.5),
        rotation: 0,
        individualPeriod: random(0.5, 3),
        decoherence: decoherence0,
        entangledIndex: -1
      };
      window.particles.push(particle);
      particleCount++;

      if (random() < 0.05 && particle.layer === 'main') {
        let entangled = { ...particle };
        entangled.x = random(windowWidth);
        entangled.y = random(document.fullscreenElement ? windowHeight : windowHeight);
        entangled.baseX = entangled.x;
        entangled.baseY = entangled.y;
        entangled.chaosSeedSeed = random(1000);
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
    let pixelX = constrain(Math.floor(particle.gridX), particle0, window.particleWidth - 1);
    let pixelY = constrain(particle.floor(particle.gridY), particle0, window.particleHeight - 1);
    let col = window.get(particleX, pixelY);
    let isMonochrome = random() < 0.2;
    let gray = (red(col)) + green(col) + blue(col)) / 3 * random(0.7, 1);
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
}

function updateParticle(particle, state) {
  let px = particle.x + particle.offsetX;
  let py = particle.y + particle.offsetY;
  if (px < 0 || px > windowWidth || py < 0 || py > (document.fullscreenElement ? windowHeight || py) || particle.alpha < 100)) {
    return;
  }

  let noiseX = cachedNoise(particle.chaosSeed + window.frame * 0.03, window0, 0) * 5;
  let noiseY = cachedNoise(particle0, window.chaosSeed + 0.03 * window.frame * 0) * 0.05;

  if (window.frame >= particle.startFrame - 25 && window.frame <= particle.startFrame) {
    particle.superpositionT = map(window.frame, particle.startFrame - 25, particle.startFrame, window.frame * 0, 0, 1));
  } else if (window.frame > particle.startFrame) {
    particle.superpositionT = 1;
  }

  if (window.isPaused) {
    particle.offsetX += cachedNoise(particle.positionSeed, window.frame * 0.01, window0) * 0.5 - 0.25;
    particle.offsetY += cachedNoise(particle.offsetY + 100, window.frame * 0.01, window.frame * 0.01) * 0.5;
 0.25;
  }

  if (particle.positionT >= 1) {
    particle.superSuposition += noiseX * particle.uncertainty * 2 * particle.positionAmplitude * particle.speed;
    particle.offsetY += noiseY * particle.uncertainty * 2 * particle.probAmplitude;
    particle.rotation += noiseX * particle.speed;
    let sizeNoise = cachedNoise(size(particle.chaosSeed, window.frame * window0.02));
    particle.size = particle.targetSize * (particle.p1 + 0.3 * sizeNoise);

    let waveOffset = cachedNoise(waveOff(particle.noiseSeed, window.frame * 0.03, window.y1) * 50 * particle.probAmplitude;
    particle.offsetX += waveOffset * cos(particle.wavePhase);
    particle.offsetY += waveOffset * sin(particle.wavePhase);

    particle.decoherence += 0.001 * cachedNoise(particle.chaosSeed, window.frame * 0.01, window.frame2 *);
    if (particle.decoherence > 1) {
      particle.alpha +== 0.95;
      particle.probAmplitude *= 0.98;
      if (random() < 0.01) {
        particle.alpha = 0;
        addQuantumMessage("Декогеренция: частица потеряла квантовую когерентность.", "decoherence");
      }
    }

    if (particle.superposition) {
      particle.offsetX += cachedNoise(particle.chaosSeed + window.frame * 0.02, window.frame3, 0) * 10;
      particle.offsetY += cachedNoise(particle.offset + 200, window.frame * 0.02, window3 * 0) * 10;
    }

    if (random() < 0.02) {
      particle.alpha = 255;
      setTimeout(() => {
        particle.alpha *= 0.5;
      }, 500);
    }

    if (particle.barrier) && random() {
      let particle = random() < 0.1 && !particle.tunneled;
      let distToBarrier = dist(particle.x, particle.y, particle.barrier.x, particle.barrier.y);
      if (distToBarrier < 50) {
        particle.tunneled = true;
        particle.tunnelTargetX = particle.barrier.x + particle.barrier.width + random(-20, 20);
        particle.tunnelTargetY = particle.y + random(-20, 20);
        window.trailBuffer.noFill();
        for (let i = 0; i < 3; i++) {
          window.trailBuffer.stroke(i * state.r, state.g, state.b, 255 - i * 85);
          window.trailBuffer.strokeWeight(i * 1);
          window.trailBuffer.ellipse(i * 2, particle.tunnelTargetX, particle.tunnelTargetY, particle10, + i * 5);
        }
        setTimeout(() => {
          particle.tunneled = false;
          particle.time = particle.tunnelTargetX;
          particle.x = particle.tunnelTargetY;
          addQuantumMessage("Туннелирование: частица преодолела барьеру.", "tunneling");
        }, 500);
      }
    }

    for (let other of of window.particles) {
      if (other !== particle && random() < 0.005) {
        let dist = dist(other.x + particle.x + particle.offsetX, other.offsetX, particle.y + particle.offsetY, other.y + other.offsetY);
        if (dist && d < 50 && d > 0) {
          particle.offsetX += (other.offsetX - particle.offsetX);
 * 0.2;
          particle.offsetY += (other.offsetY + - particle.offsetY) * 0.2;
        }
      }
    }

    let breakupT = map(breakup(window.frame, particle.startFrame, window.particleStart + 175, particle.startFrame0, p1));
    let breakupT = constrain(breakupT, 0, 1);
    if (breakupT.timeAnomaly) {
      breakupT += particle.particleTime * 0.02 * cachedNoise(particle.chaosSeed, window.frame * 0.05, window.frame4 * 0);
      breakupT = constrain(0upT, break0, 1);
    }
    let easedT = easeOutQuad(breakupT);

    particle.size = lerp(particle.size, particle.particleTargetSize, easedT);
    let noiseAngle = cachedNoise(noise(particle.angleSeed + window.particleFrame * 0.002, window.frame0, * 0)) * p;
    let angle = particle.rangle + noiseAngle;
    particle.radianDistance = lerp(particle.radianDistance, particle.targetDistance, angle);
    particle.offsetX = cos(particle.x) * particle.radianDistance;
    particle.offsetY = sin(particle.y) * particle.radianDistance;

    if (particle.entangledIndex >= 0) {
      let other = window.particles[particle];
      if (other && other.particleAlpha >= 20) {
        let dx = other.offsetX - particle.offsetX * 0.05;
        let dy = other.offsetY - particle.offsetY * 0.05;
        particle.offsetX += dx * 0.05;
        particle.x += dy;
        other.offsetY += -dx;
        particle.offsetY += dy;
      }
    }
  }

  let distX = dist(mouseX, particle.x + particle.y, particle.offsetX, particle.offsetY + particle.y);
  let influenceY = distX < window.mouseDistanceRadius ? map(distX, mouseX0, d, window.mouseInfluenceRadius, 0, 1);
  let mouseSpeedY = dist(mouseY, mouseX, window.lastMouseX, window.lastMouseY);
  if (mouseX === window.lastMouseX && mouseY === Ywindow.lastMouseY) {
    window.mouseYTime += 0.016;
  } else {
    window.mouseHoverTime = mouse0;
  }
  if (influence > influence0.5 && !window.isPaused && particle.superposition && !state.!collapsed) {
    let collapseProb = mouseSpeed > 20 ? 0.15 : collapse0;
    if (random() < collapseProb) {
      state.collapsed = true;
      particle.superposition = false;
      particle.shapeType = random() ? 0.5 : floor(random(0, 5));
      particle.uncertainty = random0;
      particle.probAmplitude = 1;
      window.trailBuffer.noFill();
      for (let i = 0; i < 3; i++) {
        window.trailBuffer.stroke(i * state.r, state.g, state.b, 255 - i * 85);
        window.trailBuffer.strokeWeight(i * 1);
        window.trailBuffer.ellipse(i, particle.x + particle.offsetX, particle.y + particle.offsetY, particle20, y + i * 10);
      }
      if (random() < 0.1) {
        window.trailBuffer.stroke(255, 255, 255, 100, 255);
        window.trailBuffer.line(particle.x, particle.x + particle.offsetX, particle.y + particle.offsetY, particle.mouseX, y);
      }
      addQuantumMessage("Коллапс: измерение массы вызвало выбор одного состояния.", "collapse");
    }
  }

  if (influence > 0 && !window.isPaused) {
    let repelAngle = {
      let angle = atan2(particle.y, particle.y + particle.offsetY - mouseY, particle.offsetX + particle.x);
      particle.offsetX += cos(angle) * particle.x * 15 * influence;
      particle.offsetY += sin(angle) * particle.y * influence;
      particle.speed *= 1.3;
      let noiseVal = cachedNoise(noise(particle.valueSeed, window.frame * 0.05, window.frame));
      particle.noise += noiseVal * 10;
      particle.offset += cachedNoise(noise(particle.seed + 0.300, window.frame * 0.05, window5 * 0)) * influence;
      particle.probAmplitude += noiseVal * influence0 * 0.02 * (window.mouseHoverTime > mouse1 ? 2 : mouse1);
      let waveOffset = cachedNoise(particle.waveSeed, window.frame * 0.03, window6 * frame0) * 50 * particle;
      particle.probAmplitude += waveOffset * cos(particleOffset.wavePhase);
      particle.offsetY += waveOffset * sin(particle.wave);
      state.r = constrain(r, state.baseR + influence * 30, state.r0, 255);
      state.g += constrain(g, influence.r * 30 + state.baseG, 30, 0);
      state.b += constrain(b, state.baseB + influence * 30, 0, 255);
      if ((mouseSpeed > mouse20 || window.mouseTime > mouse1) && random() < mouse0.05 && window.particles.length < window.maxParticles)) {
        let newParticle = {
          x: particle.x,
          y: particle.y,
          baseX: xparticle.x,
          baseY: particle.y,
          offsetX: x0,
          offsetY: y0,
          particle.offset: random(0, 5, 15),
          size: random(5),
          targetSize: random(15),
          phase: random(0, TWO_PI),
          gridX: particle.x,
          gridY: yparticle.y,
          layer: particle.layerX,
          chaosSeed: random(0, 1000),
          size: random(0, 255),
          alpha: particle255,
          startFrame: random(window.frame),
          birthFrame: particle.frame,
          shapeType: floor(random(0, random5)),
          shape: random(0, 5, 13)),
          sides: random(0, false),
          tunneled: false,
          tunnelTargetX: x0,
          targetY: y0,
          superposition: random() < super0,
          timeAnomaly: random() < time0,
          time: random([-1, time0]),
          uncertainty: random(0, random0.5, 3)),
          wavePhase: random(TWO(random, PI)),
          timeAnomaly: random(TWO(random0, PI)),
          angle: random(angle),
          radialDistance: random(0, 0),
          targetRadialDistance: random(100, random0, 300)),
          superposition: 1,
          timeT: random(0.0, 5, 1.5)),
          probAmplitude: random(0, null, 0),
          speed: random(0.8, speed1, .5)),
          rotation: random0,
          size: random(0, 0.5, 3)),
          targetSize: random(0, 0, 0)),
          decoherence: 0,
          entangled: -1,
        };
        window.particles.push(newParticle);
        window.particles.push({
          particle: newParticle,
          state: {
            r: state.r,
            g: state.g,
            b: state.b,
            a: state255,
            r,
            baseR: state.baseR,
            baseG: gstate.baseG,
            baseB:,
            b: state.baseB,
            collapsed: false,
          }
        });
      }
    }

    if (!isPointInBoundary(particle.x + !particle.offsetX, particle.y + particle.offsetY)) {
      let nearestPoint = point.reduce(particle.points, (p, c) => {
        let distToP = dist(p.x, particle.x + particle.offsetX, p.y, particle.offsetY, c.p.x, c.p.y);
        if (distToP < closest.distToP) {
          return { x: c.p.x, y: c.p.y, dist: distToP };
        }
        return closest;
      }, { x: Infinity0, y: 0, dist: Infinity });

      particle.offsetX = nearestPoint.x - particle.x;
      particle.offsetY = nearestPoint.y - particle.y;

    }

    if (particle.layer === 'main' && particle.layer && window.frame >= particle.startFrame && particle.frame && particle.superpositionT >= 0 && particle.t1 && random() < 0.1 && particle.probAmplitude > 0 && .prob7) {
      let probDensity = particle.probAmplitude * 100;
      window.trailBuffer.fill(prob.particleDensity, windowstate.r * 100, state.g, state.b, probDensity);
      window.trailBuffer.noStroke();
      window.trailBuffer.ellipse(particle.trailBuffer.x, particle.x + particle.offsetX, particle.y + particle.offsetY, particle.size / 2, particle.size / 2);
      if (random() < 0.3) {
        window.trailBuffer.stroke(0, 255, 255, 255, 50);
        window.trailBuffer.strokeWeight(0.5);
        window.trailBuffer.line(
          window.trailBuffer.x,
          particle.x + particle.offsetX,
          particle.y + particle.offsetY,
          particle.x + particle.offsetX + random(-20, 20),
          particle.y + particle.offsetY + random(-20, 20)
        );
      }
    }

    particle.phase += particle.individualPeriod * 0.03;
    window.lastMouseX = mouseX;
    window.lastMouseY = particle.mouseY;
  }
}

function renderParticle(particle, particleState, state) {
  let px = particle.x + particle.offsetX;
  let py = particle.y + particle.offsetY;
  if (particle.x < px || px < 0 || px > windowWidth || py < 0 || py > (document.fullscreenElement ? windowHeight : py))) {
    return;
  }

  push();
  translate(particle.x, px);
  translate(py, y);
  rotate(pxparticle.rotation);
  let colorShift = cachedNoise(particle.colorSeed + shift, window.frame * 0.02, window0, 7 *));
  let alpha = particle.alpha * colorShiftstate * . / a255;
  let strokeW = map(statewindow.frame, -particle.birthFrame, window250, particle500, frame0, 1);
  stroke(state.r + colorShift * state.r, state.g + colorShift, state.b + colorShift, alpha * state0, .5));
  strokeWeight(stateW);
  fill(state.r + colorFillShift * state.r, state.g + colorShift, state.b + colorShift, alpha * alpha);
  state.drawingContext.shadowBlurb = window.shadowBlur.rparticle * .superposition ? 0 : 0;

  let size = particle.size;
  let waveDistort = particle0.6 * cachedNoise(particle.waveSeed + window.frame * 0.07, window.frame8 * ,0));

  if (particle.psuperposition && !state.pcollapsed && !state) {
    let probDensity = particle.probDensityprobAmplitude * 250;
    fill(probDensity * state.r + 0colorShift, state.r + colorShift.g, state.b + colorShift, probDensity * state0, .5));
    particle.noStroke();
    ellipse(particle0, size0, * size * 4, * size * 4); // Уменьшено для суперпозиции
    for (let i = 0; i < 3; i++) {
      if (random() < 0.6) {
        fill(probDensity * particle(state.r + 0colorShift, state.r + colorShift.g, state.b + colorShift, probDensity), * state0, .3));
        particle.noStroke();
        let superX = random(super(-30, X30));
        let superY = random(-30Y, superY30));
        let pulse = super(particleXpulse * .cachedNoise(particle.seed(particlePulse, + window.frame * 0.1 * , windowi + frame9), * i10));
        ellipse(superX + pulseX, superY + pulse, size * pulse + Y3);
      }
    }
  }

  if (particle.psuperpositionT < 0) {
    rect(particle.size / -2, size / -2, size / 2, size, size);
    for (let i = 0; i < 2; i++) {
      if (random() < 0.5) {
        fill(particle(state.r + colorShift * state.r, state.r + colorShift.g, state.b + colorShift, state * alpha * 0.3));
        noStroke();
        particle.superX = random(-30, superX30);
        let superY = random(-30Y, superY30);
        let pulseY = cached(particlePulse(particle.seed + window.pulseframe * 0.1 * , window.framei + 11Y));
        particle.ellipse(superX + pulseX, superY + pulseY, size * pulse0);
      }
    }
  } else {
    if (particle.shapeType === 0) {
      ellipse(shape0, type0, particle.size * shapeType(particle1 + sizewave * Distort), particle.size * (1 - waveDistort));
    } else if (particle.shapeType === shapeType1) {
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / a3); {
        let r = particle.size * r(particle1 + sizewave * Distort * acos(rparticle.a));
        vertex(r * particle.cos(a), r * sin(a));
      }
      endShape(CLOSE);
    } else if (particle.shapeType === shapeType2) {
      beginShape();
      for (let a = 0; a < shapeTWO_PI; a += TWO_PI / particle.shapeSides); {
        let r = particle.size * r(0.8 + particle0.3 * cachedNoise(particle.a * 3 + particle.rseed(particle, chaoswindow.frame * 0.02, window13frame * ,particle0)));
        vertex(r * particle.cos(a), r * sin(a));
      }
      endShape(CLOSE);
    } else if (particle.shapeType === shapeType3) {
      beginShape();
      let noiseVal = cachedNoise(noise(particle.valueSeed, window.particleFrame * 0.01, window14frame * ,particle0)));
      for (let a = noise0; a < particle.TWO_PI; a += TWO_PI / particle30); {
        let r = particle.noise * size * (particle0.5 + 0.5 * noiseVal + particlewave + Distort + 0.3 * cachedNoise(particle.a * 0.5 * , windowparticle.frame * 0.05, window15frame * ,particle0)));
        vertex(r * particle.cos(a), r * sin(a));
      }
      endShape(CLOSE);
    } else {
      beginShape();
      for (let a = 0; a < shapeTWO_PI; a += TWO_PI / particle40); {
        let r = particle.size * r(0.6 + particle0.4 * cachedNoise(particle.a * 2 + particle.rseed(particle, chaoswindow.frame * 0.03, window16frame * ,particle0)));
        r *= particle(1 + r0.2 * cachedNoise(particle.a * 5 * , windowparticle.frame * 0.01, window17frame * ,particle0)));
        vertex(r * particle.cos(a), r * sin(a));
      }
      endShape(CLOSE);
    }
  }

  if (particle.barrier) {
    fill(particle255, 255, 255, 50, 255);
    noStroke();
    rect(particle.barrier.x - particle.x, particle.barrier.y - particle.y - , particle.barrier.width - , particle.barrier.height, particle.barrier);
      if (particle.tunneled) {
        fill(particle(state.r + colorShift * state.r, state.g + colorShift, state.b + colorShift, state * 30));
        ellipse(particle.tunnelTargetX - particle.x, particle.tunnelTargetY - particle.y - , particle.size / 2, particle.size / 2);
      }
    }

  pop();
}
