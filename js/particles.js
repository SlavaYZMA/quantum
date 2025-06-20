window.frame = 0;
window.isPaused = false;
window.particles = [];
window.quantumStates = [];
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
window.textMessages = { active: [], queue: [] };
window.entangledPairs = [];
window.img = null;

function easeOutQuad(t) {
  return t * (2 - t);
}

function setup() {
  // Удалено createCanvas, position, style и прочее
  pixelDensity(1);
  frameRate(navigator.hardwareConcurrency < 4 ? 20 : 25);
  noLoop();
  window.trailBuffer = createGraphics(windowWidth, windowHeight - 100);
  window.trailBuffer.pixelDensity(1);
  updateBoundary();
  window.isCanvasReady = true;
}

function handleFile(file) {
  if (file.type === 'image') {
    window.img = loadImage(file.data, () => {
      console.log('User image loaded successfully:', window.img.width, 'x', window.img.height);
      loop();
    }, () => {
      console.error('Failed to load user image.');
      window.img = null;
    });
  } else {
    console.error('Please upload an image file.');
    window.img = null;
  }
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
    y: 150,
    alpha: 0,
    offsetX: -20,
    fadeIn: true,
    startFrame: window.frame,
    eventType: eventType
  };
  window.textMessages.queue.push(newMessage);
}

function renderQuantumMessages() {
  // Перенесено в index.html, но оставлено для совместимости
  textAlign(LEFT, TOP);
  textSize(16);
  fill(0, 255, 0); // Зелёный для терминала
  noStroke();

  if (window.textMessages.queue.length > 0 && window.textMessages.active.length < 5) {
    let newMsg = window.textMessages.queue.shift();
    newMsg.startFrame = window.frame;
    window.textMessages.active.push(newMsg);
  }

  let spacing = 30;
  let baseY = 10; // Смещение для терминала
  for (let i = 0; i < window.textMessages.active.length; i++) {
    let msg = window.textMessages.active[i];
    let t = (window.frame - msg.startFrame) / (10 * frameRate());
    let xPos = 20 + msg.offsetX;

    if (msg.fadeIn) {
      let fadeT = min(t * 2, 1);
      msg.alpha = lerp(0, 255, easeOutQuad(fadeT));
      msg.offsetX = lerp(-20, 0, easeOutQuad(fadeT));
      if (fadeT >= 1) msg.fadeIn = false;
    } else {
      if (t >= 0.95) {
        let fadeOutT = (t - 0.95) / 0.05;
        msg.alpha = lerp(255, 0, easeOutQuad(fadeOutT));
        msg.offsetX = lerp(0, -20, easeOutQuad(fadeOutT));
      } else {
        msg.alpha = 255;
        msg.offsetX = 0;
      }
    }

    msg.y = baseY + i * spacing;
    fill(0, 255, 0, msg.alpha);
    text(msg.text, xPos, msg.y);

    if (t > 1) {
      window.textMessages.active.splice(i, 1);
      i--;
    }
  }
}

function renderTransformingPortrait(img, currentFrame) {
  if (!img || !img.width) return [];
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
          addQuantumMessage("Инициализация суперпозиции…", "superposition");
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
      addQuantumMessage("Система вступила в фазу декогеренции.", "decoherence");
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
    addQuantumMessage("Интерференционные узоры стабилизированы.", "interference");
  }

  image(window.trailBuffer, 0, 0);
  renderQuantumMessages();
  window.lastFrameTime = frameTime;

  // Отрисовка на мини-канве
  let explainerCanvas = select('#quantum-explainer');
  if (explainerCanvas) {
    renderQuantumExplainer(explainerCanvas.elt.getContext('2d'));
  }
}

function renderQuantumExplainer(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';

  // Простая визуализация в зависимости от событий
  let lastMessage = window.textMessages.active[window.textMessages.active.length - 1];
  if (lastMessage) {
    switch (lastMessage.eventType) {
      case 'superposition':
        ctx.beginPath();
        for (let i = 0; i < 2; i++) {
          ctx.arc(50 + i * 100, 50, 20, 0, TWO_PI);
          ctx.fill();
        }
        break;
      case 'interference':
        ctx.beginPath();
        for (let x = 0; x < ctx.canvas.width; x += 10) {
          let y = 50 + Math.sin(x * 0.1 + window.frame * 0.05) * 20;
          ctx.arc(x, y, 2, 0, TWO_PI);
          ctx.fill();
        }
        break;
      case 'tunneling':
        ctx.beginPath();
        ctx.rect(100, 20, 10, 60);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(80, 50, 5, 0, TWO_PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(130, 50, 5, 0, TWO_PI);
        ctx.fill();
        break;
      case 'entanglement':
        ctx.beginPath();
        ctx.arc(50, 50, 10, 0, TWO_PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(150, 50, 10, 0, TWO_PI);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(150, 50);
        ctx.stroke();
        break;
      case 'collapse':
        ctx.beginPath();
        ctx.arc(100, 50, 15, 0, TWO_PI);
        ctx.fill();
        break;
      case 'decoherence':
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          ctx.arc(random(0, ctx.canvas.width), random(0, ctx.canvas.height), 3, 0, TWO_PI);
          ctx.fill();
        }
        break;
    }
  }
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
        addQuantumMessage("Обнаружена квантовая запутанность.", "entanglement");
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
    particle.offsetX += noiseX * particle.uncertainty * 10 * particle.probAmplitude * particle.speed;
    particle.offsetX += noiseY * particle.uncertainty * 10 * particle.probAmplitude * particle.speed;
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
        addQuantumMessage("Система вступила в фазу декогеренции.", "decoherence");
      }
    }

    if (particle.superposition) {
      particle.offsetX += cachedNoise(particle.chaosSeed, window.frame * 0.02, 3) * 5;
      particle.offsetY += cachedNoise(particle.chaosSeed + 200, window.frame * 0.02, 3) * 5;
    }

    if (random() < 0.02) {
      particle.alpha = 255;
      setTimeout(() => particle.alpha *= 0.9, 200);
    }

    if (particle.barrier && random() < 0.1 && !particle.tunneled) {
      let distToBarrier = dist(particle.x, particle.y, particle.barrier.x, particle.barrier.y);
      if (distToBarrier < 50) {
        particle.tunneled = true;
        particle.tunnelTargetX = particle.barrier.x + particle.barrier.width + random(-20, 20);
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
          addQuantumMessage("Обнаружено туннелирование: частицы пересекли барьер.", "tunneling");
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
      addQuantumMessage("Наблюдение подтверждено. Волновая функция коллапсирует.", "collapse");
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
        tunnelнах
//main.js
- **Файл**: `main.js`
- **Где**: В функции `setup` (около строки 50), где ранее создавался `createFileInput` и `fsButton`
- **Изменение**: Удалить создание элементов и перенести их в `index.html`
  ```javascript
  function setup() {
    // Удалено:
    // let fileInput = createFileInput(handleFile);
    // fileInput.position(10, 10);
    // fileInput.attribute('accept', 'image/*');
    // let fsButton = createButton('Full Screen');
    // fsButton.position(windowWidth - 100, 10);
    // fsButton.mousePressed(() => { ... });
    // Остальная логика setup перенесена в particles.js
  }
  ```
- **Эффект**: Удаляет управление элементами интерфейса, оставляя только логику canvas.

#### index.html
Добавлены:
- Контейнер `<div id="terminal">` для сообщений.
- Мини-канва `<canvas id="quantum-explainer">` для квантовых эффектов.
- Рамки для всех элементов.
- Контейнеры для шагов 4 и 5 обновлены для новой структуры.

<xaiArtifact artifact_id="081502cd-c3a2-49af-a785-bd1a9da827e8" artifact_version_id="fd9d8310-7a90-4b62-b3d6-a7e478216094" title="index.html" contentType="text/html">
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quantum Portraits</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.2/p5.min.js"></script>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="noiseOverlay"></div>
  <div class="flash" id="flashEffect"></div>
  <div id="loader">Загрузка...</div>
  <div class="container">
    <button class="back-button" id="backButton" style="display: none;" aria-label="Вернуться на предыдущий шаг" onclick="debouncedGoBack()">Назад / Back</button>
    <button class="continue-button" id="continueButton" style="display: none;" disabled aria-label="Перейти к следующему шагу" onclick="debouncedNextStep()">Продолжить / Continue</button>

    <div class="step" id="step0">
      <div class="text-container">
        <div class="typewriter" id="typewriter0"></div>
      </div>
      <div class="button-container" id="step0Buttons">
        <button class="button" aria-label="Выбрать русский язык" onclick="selectLanguage('ru')">RU</button>
        <button class="button" aria-label="Выбрать английский язык" onclick="selectLanguage('en')">ENG</button>
      </div>
    </div>

    <div class="step" id="step1">
      <div class="text-container">
        <div class="typewriter" id="typewriter1"></div>
      </div>
      <div class="button-container"></div>
    </div>

    <div class="step" id="step2">
      <div class="text-container">
        <div class="typewriter" id="typewriter2"></div>
      </div>
      <div class="button-container" id="step2Buttons">
        <input type="file" id="imageInput" accept="image/*" style="display: none;">
        <button class="button" aria-label="Загрузить фото" onclick="document.getElementById('imageInput').click()">Загрузить фото / Upload Photo</button>
        <button class="button" aria-label="Выбрать из архива" onclick="openGallery()">Выбрать готовое / Select from Archive</button>
      </div>
    </div>

    <div class="step" id="step3">
      <div class="text-container">
        <div class="typewriter" id="typewriter3"></div>
      </div>
      <div class="button-container"></div>
    </div>

    <div class="step" id="step4">
      <div class="top-section">
        <div class="text-container">
          <div class="typewriter" id="typewriter4"></div>
        </div>
        <div class="portrait-container">
          <img id="previewImage4" class="preview-image" alt="Uploaded portrait preview">
        </div>
      </div>
      <div class="middle-section">
        <div id="terminal" class="terminal"></div>
        <canvas id="quantum-explainer" class="quantum-explainer"></canvas>
      </div>
      <div class="canvas-container" id="canvasContainer4"></div>
      <div class="button-container"></div>
    </div>

    <div class="step" id="step5">
      <div class="top-section">
        <div class="text-container">
          <div class="typewriter" id="typewriter5"></div>
        </div>
        <div class="portrait-container">
          <img id="previewImage5" class="preview-image" alt="Uploaded portrait preview">
        </div>
      </div>
      <div class="middle-section">
        <div id="terminal" class="terminal"></div>
        <canvas id="quantum-explainer" class="quantum-explainer"></canvas>
      </div>
      <button class="save-button" id="saveButton" style="display: none;" aria-label="Сохранить изображение" onclick="saveCurrentState()">Сохранить изображение / Save Image</button>
      <div class="canvas-container" id="canvasContainer5"></div>
      <div class="button-container"></div>
    </div>

    <div class="step" id="step6">
      <div class="text-container">
        <div class="typewriter" id="typewriter6"></div>
      </div>
      <div class="button-container">
        <button class="button" aria-label="Поделиться наблюдением" onclick="shareObservation()">ПОДЕЛИТЬСЯ НАБЛЮДЕНИЕМ / SHARE OBSERVATION</button>
      </div>
    </div>

    <div class="step" id="step7">
      <div class="text-container">
        <div class="typewriter" id="typewriter7"></div>
      </div>
      <div class="button-container">
        <button class="button" aria-label="Начать заново" onclick="restart()">↻ НАЧАТЬ СНАЧАЛА / RESTART</button>
        <button class="button" aria-label="Перейти в архив" onclick="goToArchive()">⧉ ПЕРЕЙТИ В АРХИВ НАБЛЮДЕНИЙ / GO TO ARCHIVE</button>
        <button class="button" aria-label="О разработчиках" onclick="openAuthors()">ОБ АВТОРАХ / ABOUT US</button>
        <button class="button" aria-label="Упростить анимацию" onclick="simplifyAnimation()">УПРОСТИТЬ АНИМАЦИЮ / SIMPLIFY ANIMATION</button>
      </div>
    </div>

    <div id="portraitGallery"></div>
    <div id="authorsPage">
      <button class="button" aria-label="Закрыть страницу авторов" onclick="closeAuthors()">Закрыть / Close</button>
      <div class="text-container">
        <div class="typewriter">Слава Саша</div>
      </div>
    </div>
  </div>

  <script src="js/particles.js"></script>
  <script src="js/textSteps.js"></script>
  <script src="js/main.js"></script>
  <script src="js/observer.js"></script>
</body>
</html>
