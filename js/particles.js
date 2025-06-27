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
window.terminalLog = []; // Массив для логов терминала

function easeOutQuad(t) {
  return t * (2 - t);
}

if (window.quantumSketch) {
  window.quantumSketch.setup = () => {
    window.canvas = window.quantumSketch.createCanvas(window.quantumSketch.windowWidth, window.quantumSketch.windowHeight - 100);
    window.canvas.parent('portrait-animation-container');
    window.quantumSketch.pixelDensity(1);
    window.quantumSketch.frameRate(navigator.hardwareConcurrency < 4 ? 20 : 25);
    window.quantumSketch.noLoop();
    window.canvas.elt.style.display = 'block';
    window.canvas.elt.style.position = 'absolute';
    window.canvas.elt.style.top = '0';
    window.canvas.elt.style.left = '0';
    window.canvas.elt.style.zIndex = '0';

    let fsButton = window.quantumSketch.createButton('Full Screen');
    fsButton.position(window.quantumSketch.windowWidth - 100, 10);
    fsButton.mousePressed(() => {
      if (!document.fullscreenElement) {
        document.getElementById('portrait-animation-container').requestFullscreen().then(() => {
          window.quantumSketch.resizeCanvas(window.quantumSketch.windowWidth, window.quantumSketch.windowHeight);
          updateBoundary();
        });
      } else {
        document.exitFullscreen().then(() => {
          window.quantumSketch.resizeCanvas(window.quantumSketch.windowWidth, window.quantumSketch.windowHeight - 100);
          updateBoundary();
        });
      }
    });

    window.trailBuffer = window.quantumSketch.createGraphics(window.quantumSketch.windowWidth, window.quantumSketch.windowHeight - 100);
    window.trailBuffer.pixelDensity(1);

    window.canvas.elt.addEventListener('click', function() {
      if (window.currentStep === 5) {
        if (!window.isPaused) {
          window.isPaused = true;
          window.quantumSketch.noLoop();
          document.getElementById('saveButton').style.display = 'block';
        } else {
          window.isPaused = false;
          window.quantumSketch.loop();
          document.getElementById('saveButton').style.display = 'none';
        }
      }
    });

    window.canvas.elt.addEventListener('touchmove', function(e) {
      e.preventDefault();
      const touch = e.touches[0];
      window.quantumSketch.mouseX = touch.clientX - window.canvas.elt.offsetLeft;
      window.quantumSketch.mouseY = touch.clientY - window.canvas.elt.offsetTop;
    }, { passive: false });

    window.addEventListener('resize', () => {
      window.quantumSketch.resizeCanvas(window.quantumSketch.windowWidth, document.fullscreenElement ? window.quantumSketch.windowHeight : window.quantumSketch.windowHeight - 100);
      window.trailBuffer = window.quantumSketch.createGraphics(window.quantumSketch.windowWidth, document.fullscreenElement ? window.quantumSketch.windowHeight : window.quantumSketch.windowHeight - 100);
      window.trailBuffer.pixelDensity(1);
      updateBoundary();
    });

    updateBoundary();
    window.isCanvasReady = true;
  };

  window.quantumSketch.draw = () => {
    console.log('Draw called');
    let startTime = performance.now();
    if (!window.img || !window.img.width) {
      console.warn('Image not available for animation');
      window.quantumSketch.background(0);
      return;
    }

    window.frame++;
    window.chaosTimer += 0.016;
    window.chaosFactor = window.quantumSketch.map(cachedNoise(window.frame * 0.01, 0, 0), 0, 1, 0.3, 1) * (window.weirdnessFactor || 0.5);

    if (window.chaosTimer > 5) {
      window.chaosTimer = 0;
      updateBoundary();
      window.mouseInfluenceRadius = window.quantumSketch.random(150, 250);
      window.noiseScale = window.quantumSketch.random(0.02, 0.04);
    }

    window.quantumSketch.background(0);
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
    let vacuumAlpha = window.quantumSketch.map(cachedNoise(window.frame * 0.005, 0, 0), 0, 1, 30, 70);
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
    }

    window.quantumSketch.image(window.trailBuffer, 0, 0);
    renderQuantumMessages();
    window.lastFrameTime = frameTime;

    // Минимальная проверка анимации
    window.quantumSketch.fill(255);
    window.quantumSketch.textSize(16);
    window.quantumSketch.text('Animation Active', 10, 20);
  };
}

function updateBoundary() {
  window.boundaryPoints = [];
  let numPoints = 40;
  let margin = 10;
  let maxX = window.quantumSketch.windowWidth - margin;
  let maxY = (document.fullscreenElement ? window.quantumSketch.windowHeight : window.quantumSketch.windowHeight - 100) - margin;
  for (let i = 0; i < numPoints / 4; i++) {
    let x = window.quantumSketch.lerp(margin, maxX, i / (numPoints / 4));
    window.boundaryPoints.push({ x, y: margin });
  }
  for (let i = 0; i < numPoints / 4; i++) {
    let y = window.quantumSketch.lerp(margin, maxY, i / (numPoints / 4));
    window.boundaryPoints.push({ x: maxX, y });
  }
  for (let i = 0; i < numPoints / 4; i++) {
    let x = window.quantumSketch.lerp(maxX, margin, i / (numPoints / 4));
    window.boundaryPoints.push({ x, y: maxY });
  }
  for (let i = 0; i < numPoints / 4; i++) {
    let y = window.quantumSketch.lerp(maxY, margin, i / (numPoints / 4));
    window.boundaryPoints.push({ x: margin, y });
  }
}

function isPointInBoundary(x, y) {
  let margin = 10;
  let maxY = document.fullscreenElement ? window.quantumSketch.windowHeight : window.quantumSketch.windowHeight - 100;
  if (x < margin || x > window.quantumSketch.windowWidth - margin || y < margin || y > maxY - margin) return false;
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
  let value = window.quantumSketch.noise(x, y, z);
  window.noiseCache.set(key, value);
  if (window.noiseCache.size > 10000) {
    window.noiseCache.clear();
  }
  return value;
}

function addQuantumMessage(message, eventType) {
  let newMessage = {
    text: message,
    alpha: 0,
    fadeIn: true,
    startFrame: window.frame,
    eventType: eventType
  };
  if (!window.textMessages.active && !window.textMessages.queue.some(m => m.eventType === eventType)) {
    window.textMessages.active = newMessage;
    updateTerminal();
  } else if (!window.textMessages.queue.some(m => m.eventType === eventType)) {
    window.textMessages.queue.push(newMessage);
  }
}

function renderQuantumMessages() {
  if (window.textMessages.active) {
    let msg = window.textMessages.active;
    let t = (window.frame - msg.startFrame) / 300;
    if (msg.fadeIn) {
      msg.alpha = window.quantumSketch.lerp(0, 255, easeOutQuad(window.quantumSketch.min(t, 0.1)));
      if (t >= 0.1) msg.fadeIn = false;
    } else {
      if (t < 0.8) {
        msg.alpha = 255;
      } else {
        msg.alpha = window.quantumSketch.lerp(255, 0, easeOutQuad((t - 0.8) / 0.2));
      }
    }
    updateTerminal();

    if (t > 1) {
      window.textMessages.active = null;
      if (window.textMessages.queue.length > 0) {
        window.textMessages.active = window.textMessages.queue.shift();
        window.textMessages.active.startFrame = window.frame;
        updateTerminal();
      }
    }
  }
}

function updateTerminal() {
  const terminal = document.querySelector('.terminal-container');
  if (terminal) {
    window.terminalLog = []; // Очищаем лог перед обновлением
    if (window.textMessages.active) {
      window.terminalLog.push(`> ${window.textMessages.active.text} (alpha: ${Math.round(window.textMessages.active.alpha)})`);
    }
    terminal.innerHTML = `<p>Терминал: Квантовая анимация обновляется...</p>` + 
                        window.terminalLog.map(msg => `<p style="margin: 5px 0;">${msg}</p>`).join('');
  }
}

function renderTransformingPortrait(img, currentFrame) {
  img.loadPixels();
  let blockList = [];
  let maxBlockSize = 16;
  let blockSize = window.quantumSketch.map(currentFrame, 1, 30, 1, maxBlockSize);
  blockSize = window.quantumSketch.constrain(blockSize, 1, maxBlockSize);

  for (let y = 0; y < img.height; y += blockSize) {
    for (let x = 0; x < img.width; x += blockSize) {
      blockList.push({
        x,
        y,
        startFrame: window.quantumSketch.random(15, 30),
        endFrame: window.quantumSketch.random(31, 60),
        superpositionT: 0,
        wavePhase: window.quantumSketch.random(window.quantumSketch.TWO_PI),
        probAmplitude: window.quantumSketch.random(0.5, 1),
        noiseSeed: window.quantumSketch.random(1000)
      });
    }
  }

  for (let block of blockList) {
    if (currentFrame <= block.endFrame + 500) {
      let x = block.x;
      let y = block.y;
      let r = 0, g = 0, b = 0, count = 0;
      let size = window.quantumSketch.min(blockSize, img.width - x, img.height - y);
      for (let dy = 0; dy < size && y + dy < img.height; dy++) {
        for (let dx = 0; dx < size && x + dx < img.width; dx++) {
          let col = img.get(x + dx, y + dy);
          r += window.quantumSketch.red(col);
          g += window.quantumSketch.green(col);
          b += window.quantumSketch.blue(col);
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
        offsetX += waveOffset * window.quantumSketch.cos(block.wavePhase);
        offsetY += waveOffset * window.quantumSketch.sin(block.wavePhase);
        rotation += noiseVal * 0.1;
      }
      let canvasX = x + (window.quantumSketch.windowWidth - img.width) / 2 + offsetX;
      let canvasY = y + ((document.fullscreenElement ? window.quantumSketch.windowHeight : window.quantumSketch.windowHeight - 100) - img.height) / 2 + offsetY;

      if (currentFrame >= block.startFrame) {
        let probDensity = block.probAmplitude * 100;
        window.quantumSketch.fill(r, g, b, probDensity);
        window.quantumSketch.noStroke();
        window.quantumSketch.ellipse(canvasX, canvasY, size * 4, size * 4);
      }
      let alpha = window.quantumSketch.map(currentFrame, block.endFrame, block.endFrame + 500, 255, 0);
      let strokeW = window.quantumSketch.map(currentFrame, block.endFrame, block.endFrame + 500, 1, 0);
      let colorShift = cachedNoise(block.noiseSeed, currentFrame * 0.02, 0) * 15;
      window.quantumSketch.fill(r + colorShift, g + colorShift, b + colorShift, alpha);
      window.quantumSketch.noStroke();
      window.quantumSketch.push();
      window.quantumSketch.translate(canvasX, canvasY);
      window.quantumSketch.rotate(rotation);
      window.quantumSketch.rect(-size / 2, -size / 2, size, size);
      window.quantumSketch.pop();

      if (currentFrame >= block.startFrame && window.quantumSketch.random() < 0.5) {
        for (let i = 0; i < 2; i++) {
          window.quantumSketch.fill(r + colorShift, g + colorShift, b + colorShift, alpha * 0.3);
          window.quantumSketch.noStroke();
          let superX = canvasX + window.quantumSketch.random(-30, 30);
          let superY = canvasY + window.quantumSketch.random(-30, 30);
          let pulse = cachedNoise(block.noiseSeed, currentFrame * 0.1, i) * 5;
          window.quantumSketch.ellipse(superX + pulse, superY + pulse, size * 2);
        }
      }
    }
  }
  return blockList;
}

function initializeParticles(blockList) {
  window.particles = [];
  window.quantumStates = [];
  window.entangledPairs = [];
  const maxBlockSize = 16;
  window.maxParticles = window.quantumSketch.windowWidth < 768 ? 1000 : 2000;
  let particleCount = 0;

  window.img.loadPixels();
  let usedPositions = new Set();
  for (let block of blockList) {
    let x = block.x;
    let y = block.y;
    let pixelX = window.quantumSketch.constrain(x, 0, window.img.width - 1);
    let pixelY = window.quantumSketch.constrain(y, 0, window.img.height - 1);
    let posKey = `${pixelX},${pixelY}`;
    if (usedPositions.has(posKey)) continue;
    usedPositions.add(posKey);
    let col = window.img.get(pixelX, pixelY);
    let brightnessVal = window.quantumSketch.brightness(col);
    if (brightnessVal > 10 && particleCount < window.maxParticles) {
      let blockCenterX_canvas = x + (window.quantumSketch.windowWidth - window.img.width) / 2 + maxBlockSize / 2;
      let blockCenterY_canvas = y + ((document.fullscreenElement ? window.quantumSketch.windowHeight : window.quantumSketch.windowHeight - 100) - window.img.height) / 2 + maxBlockSize / 2;
      let layer = window.quantumSketch.random() < 0.1 ? 'vacuum' : window.quantumSketch.random() < 0.2 ? 'background' : 'main';
      let shapeType = window.quantumSketch.floor(window.quantumSketch.random(5));
      let targetSize = window.quantumSketch.random(5, 30);
      let superposition = window.quantumSketch.random() < 0.3;
      let timeAnomaly = window.quantumSketch.random() < 0.05;
      let angle = window.quantumSketch.random(window.quantumSketch.TWO_PI);
      let particle = {
        x: blockCenterX_canvas,
        y: blockCenterY_canvas,
        baseX: blockCenterX_canvas,
        baseY: blockCenterY_canvas,
        offsetX: 0,
        offsetY: 0,
        size: maxBlockSize,
        targetSize: targetSize,
        phase: window.quantumSketch.random(window.quantumSketch.TWO_PI),
        gridX: x,
        gridY: y,
        layer: layer,
        chaosSeed: window.quantumSketch.random(1000),
        alpha: 255,
        startFrame: block.endFrame,
        birthFrame: window.frame,
        shapeType: shapeType,
        sides: shapeType === 2 ? window.quantumSketch.floor(window.quantumSketch.random(5, 13)) : 0,
        tunneled: false,
        tunnelTargetX: 0,
        tunnelTargetY: 0,
        superposition: superposition,
        timeAnomaly: timeAnomaly,
        timeDirection: timeAnomaly ? window.quantumSketch.random([-1, 1]) : 1,
        uncertainty: window.quantumSketch.random(0.5, 3),
        wavePhase: block.wavePhase,
        radialAngle: angle,
        radialDistance: 0,
        targetRadialDistance: window.quantumSketch.random(100, 300),
        superpositionT: 0,
        probAmplitude: window.quantumSketch.random(0.5, 1.5),
        barrier: window.quantumSketch.random() < 0.1 ? { x: window.quantumSketch.random(window.quantumSketch.windowWidth), y: window.quantumSketch.random(window.quantumSketch.windowHeight), width: 20, height: 100 } : null,
        speed: window.quantumSketch.random(0.8, 1.5),
        rotation: 0,
        individualPeriod: window.quantumSketch.random(0.5, 3),
        decoherence: 0,
        entangledIndex: -1
      };
      window.particles.push(particle);
      particleCount++;

      if (window.quantumSketch.random() < 0.05 && particle.layer === 'main') {
        let entangled = { ...particle };
        entangled.x = window.quantumSketch.random(window.quantumSketch.windowWidth);
        entangled.y = window.quantumSketch.random(document.fullscreenElement ? window.quantumSketch.windowHeight : window.quantumSketch.windowHeight - 100);
        entangled.baseX = entangled.x;
        entangled.baseY = entangled.y;
        entangled.chaosSeed = window.quantumSketch.random(1000);
        entangled.entangledIndex = window.particles.length;
        particle.entangledIndex = window.particles.length + 1;
        window.particles.push(entangled);
        window.entangledPairs.push([particleCount - 1, particleCount]);
        particleCount++;
      }
    }
  }

  for (let i = 0; i < window.particles.length; i++) {
    let particle = window.particles[i];
    let pixelX = window.quantumSketch.constrain(Math.floor(particle.gridX), 0, window.img.width - 1);
    let pixelY = window.quantumSketch.constrain(Math.floor(particle.gridY), 0, window.img.height - 1);
    let col = window.img.get(pixelX, pixelY);
    let isMonochrome = window.quantumSketch.random() < 0.2;
    let gray = (window.quantumSketch.red(col) + window.quantumSketch.green(col) + window.quantumSketch.blue(col)) / 3 * window.quantumSketch.random(0.7, 1);
    window.quantumStates[i] = {
      r: isMonochrome ? gray : window.quantumSketch.red(col),
      g: isMonochrome ? gray : window.quantumSketch.green(col),
      b: isMonochrome ? gray : window.quantumSketch.blue(col),
      a: 255,
      baseR: window.quantumSketch.red(col),
      baseG: window.quantumSketch.green(col),
      baseB: window.quantumSketch.blue(col),
      collapsed: false
    };
  }
}

function updateParticle(particle, state) {
  let px = particle.x + particle.offsetX;
  let py = particle.y + particle.offsetY;
  if (px < 0 || px > window.quantumSketch.windowWidth || py < 0 || py > (document.fullscreenElement ? window.quantumSketch.windowHeight : window.quantumSketch.windowHeight - 100) || particle.alpha < 20) {
    return;
  }

  let noiseX = cachedNoise(particle.chaosSeed + window.frame * 0.03, 0, 0) * 2 - 1;
  let noiseY = cachedNoise(0, particle.chaosSeed + window.frame * 0.03, 0) * 2 - 1;

  if (window.frame >= particle.startFrame - 25 && window.frame <= particle.startFrame) {
    particle.superpositionT = window.quantumSketch.map(window.frame, particle.startFrame - 25, particle.startFrame, 0, 1);
    if (window.frame === particle.startFrame - 25) {
      addQuantumMessage("Суперпозиция: частица входит в несколько состояний.", "superposition");
    }
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
    particle.offsetX += waveOffset * window.quantumSketch.cos(particle.wavePhase);
    particle.offsetY += waveOffset * window.quantumSketch.sin(particle.wavePhase);

    particle.decoherence += 0.001 * cachedNoise(particle.chaosSeed, window.frame * 0.01, 2);
    if (particle.decoherence > 1) {
      particle.alpha *= 0.95;
      particle.probAmplitude *= 0.98;
      if (window.quantumSketch.random() < 0.01 && !window.textMessages.queue.some(m => m.eventType === "decoherence")) {
        addQuantumMessage("Декогеренция: частица теряет квантовую когерентность.", "decoherence");
      }
    }

    if (particle.superposition) {
      particle.offsetX += cachedNoise(particle.chaosSeed, window.frame * 0.02, 3) * 10;
      particle.offsetY += cachedNoise(particle.chaosSeed + 200, window.frame * 0.02, 3) * 10;
    }

    if (particle.barrier && window.quantumSketch.random() < 0.1 && !particle.tunneled) {
      let distToBarrier = window.quantumSketch.dist(particle.x, particle.y, particle.barrier.x, particle.barrier.y);
      if (distToBarrier < 50) {
        particle.tunneled = true;
        particle.tunnelTargetX = particle.barrier.x + particle.barrier.width + window.quantumSketch.random(-20, 20);
        particle.tunnelTargetY = particle.y + window.quantumSketch.random(-20, 20);
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
          addQuantumMessage("Туннелирование: частица прошла через барьер.", "tunneling");
        }, 500);
      }
    }

    for (let other of window.particles) {
      if (other !== particle && window.quantumSketch.random() < 0.005) {
        let d = window.quantumSketch.dist(particle.x + particle.offsetX, particle.y + particle.offsetY, other.x + other.offsetX, other.y + other.offsetY);
        if (d < 50 && d > 0) {
          particle.offsetX += (other.offsetX - particle.offsetX) * 0.2;
          particle.offsetY += (other.offsetY - particle.offsetY) * 0.2;
        }
      }
    }

    let breakupT = window.quantumSketch.map(window.frame, particle.startFrame, particle.startFrame + 175, 0, 1);
    breakupT = window.quantumSketch.constrain(breakupT, 0, 1);
    if (particle.timeAnomaly) {
      breakupT += particle.timeDirection * 0.02 * cachedNoise(particle.chaosSeed, window.frame * 0.05, 4);
      breakupT = window.quantumSketch.constrain(breakupT, 0, 1);
    }
    let easedT = easeOutQuad(breakupT);

    particle.size = window.quantumSketch.lerp(particle.size, particle.targetSize, easedT);
    let noiseAngle = cachedNoise(particle.chaosSeed + window.frame * 0.02, 0, 0) * window.quantumSketch.PI / 4;
    let angle = particle.radialAngle + noiseAngle;
    particle.radialDistance = window.quantumSketch.lerp(particle.radialDistance, particle.targetRadialDistance, easedT);
    particle.offsetX = window.quantumSketch.cos(angle) * particle.radialDistance;
    particle.offsetY = window.quantumSketch.sin(angle) * particle.radialDistance;

    if (particle.entangledIndex >= 0) {
      let other = window.particles[particle.entangledIndex];
      if (other && other.alpha >= 20) {
        let dx = (other.offsetX - particle.offsetX) * 0.05;
        let dy = (other.offsetY - particle.offsetY) * 0.05;
        particle.offsetX += dx;
        particle.offsetY += dy;
        other.offsetX -= dx;
        other.offsetY -= dy;
        if (window.frame % 120 === 0 && !window.textMessages.queue.some(m => m.eventType === "entanglement")) {
          addQuantumMessage("Запутанность: частицы синхронизируют свои состояния.", "entanglement");
        }
      }
    }
  }

  let d = window.quantumSketch.dist(window.quantumSketch.mouseX, window.quantumSketch.mouseY, particle.x + particle.offsetX, particle.y + particle.offsetY);
  let influence = d < window.mouseInfluenceRadius ? window.quantumSketch.map(d, 0, window.mouseInfluenceRadius, 1, 0) : 0;
  let mouseSpeed = window.quantumSketch.dist(window.quantumSketch.mouseX, window.quantumSketch.mouseY, window.lastMouseX, window.lastMouseY);
  if (window.quantumSketch.mouseX === window.lastMouseX && window.quantumSketch.mouseY === window.lastMouseY) {
    window.mouseHoverTime += 0.016;
  } else {
    window.mouseHoverTime = 0;
  }
  if (influence > 0.5 && !window.isPaused && particle.superposition && !state.collapsed) {
    let collapseProb = mouseSpeed > 20 ? 0.15 : 0.1;
    if (window.quantumSketch.random() < collapseProb) {
      state.collapsed = true;
      particle.superposition = false;
      particle.shapeType = window.quantumSketch.random() < 0.5 ? window.quantumSketch.floor(window.quantumSketch.random(5)) : particle.shapeType;
      particle.uncertainty = 0;
      particle.probAmplitude = 1;
      window.trailBuffer.noFill();
      for (let i = 0; i < 3; i++) {
        window.trailBuffer.stroke(state.r, state.g, state.b, 255 - i * 85);
        window.trailBuffer.strokeWeight(1);
        window.trailBuffer.ellipse(particle.x + particle.offsetX, particle.y + particle.offsetY, 20 + i * 10);
      }
      if (window.quantumSketch.random() < 0.1) {
        window.trailBuffer.stroke(255, 255, 255, 100);
        window.trailBuffer.line(particle.x + particle.offsetX, particle.y + particle.offsetY, window.quantumSketch.mouseX, window.quantumSketch.mouseY);
      }
      addQuantumMessage("Коллапс: измерение зафиксировало состояние частицы.", "collapse");
    }
  }
  if (influence > 0 && !window.isPaused) {
    let repelAngle = window.quantumSketch.atan2(particle.y + particle.offsetY - window.quantumSketch.mouseY, particle.x + particle.offsetX - window.quantumSketch.mouseX);
    particle.offsetX += window.quantumSketch.cos(repelAngle) * 15 * influence;
    particle.offsetY += window.quantumSketch.sin(repelAngle) * 15 * influence;
    particle.speed *= 1.3;
    let noiseVal = cachedNoise(particle.chaosSeed, window.frame * 0.05, 5);
    particle.offsetX += noiseVal * 10 * influence;
    particle.offsetY += cachedNoise(particle.chaosSeed + 300, window.frame * 0.05, 5) * 10 * influence;
    particle.probAmplitude += influence * 0.02 * (window.mouseHoverTime > 1 ? 2 : 1);
    let waveOffset = cachedNoise(particle.chaosSeed, window.frame * 0.03, 6) * 50 * influence;
    particle.offsetX += waveOffset * window.quantumSketch.cos(particle.wavePhase);
    particle.offsetY += waveOffset * window.quantumSketch.sin(particle.wavePhase);
    state.r = window.quantumSketch.constrain(state.baseR + influence * 30, 0, 255);
    state.g = window.quantumSketch.constrain(state.baseG + influence * 30, 0, 255);
    state.b = window.quantumSketch.constrain(state.baseB + influence * 30, 0, 255);
    if ((mouseSpeed > 20 || window.mouseHoverTime > 1) && window.quantumSketch.random() < 0.05 && window.particles.length < window.maxParticles) {
      let newParticle = {
        x: particle.x,
        y: particle.y,
        baseX: particle.x,
        baseY: particle.y,
        offsetX: 0,
        offsetY: 0,
        size: window.quantumSketch.random(5, 15),
        targetSize: window.quantumSketch.random(5, 15),
        phase: window.quantumSketch.random(window.quantumSketch.TWO_PI),
        gridX: particle.gridX,
        gridY: particle.gridY,
        layer: 'main',
        chaosSeed: window.quantumSketch.random(1000),
        alpha: 255,
        startFrame: window.frame,
        birthFrame: window.frame,
        shapeType: window.quantumSketch.floor(window.quantumSketch.random(5)),
        sides: window.quantumSketch.floor(window.quantumSketch.random(5, 13)),
        tunneled: false,
        tunnelTargetX: 0,
        tunnelTargetY: 0,
        superposition: window.quantumSketch.random() < 0.3,
        timeAnomaly: window.quantumSketch.random() < 0.05,
        timeDirection: window.quantumSketch.random([-1, 1]),
        uncertainty: window.quantumSketch.random(0.5, 3),
        wavePhase: window.quantumSketch.random(window.quantumSketch.TWO_PI),
        radialAngle: window.quantumSketch.random(window.quantumSketch.TWO_PI),
        radialDistance: 0,
        targetRadialDistance: window.quantumSketch.random(100, 300),
        superpositionT: 1,
        probAmplitude: window.quantumSketch.random(0.5, 1.5),
        barrier: null,
        speed: window.quantumSketch.random(0.8, 1.5),
        rotation: 0,
        individualPeriod: window.quantumSketch.random(0.5, 3),
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
      let distToP = window.quantumSketch.dist(particle.x + particle.offsetX, particle.y + particle.offsetY, p.x, p.y);
      return distToP < closest.dist ? { x: p.x, y: p.y, dist: distToP } : closest;
    }, { x: 0, y: 0, dist: Infinity });
    particle.offsetX = nearestPoint.x - particle.x;
    particle.offsetY = nearestPoint.y - particle.y;
  }

  if (particle.layer === 'main' && window.frame >= particle.startFrame && particle.superpositionT >= 1 && window.quantumSketch.random() < 0.1 && particle.probAmplitude > 0.7) {
    let probDensity = particle.probAmplitude * 100;
    window.trailBuffer.fill(state.r, state.g, state.b, probDensity);
    window.trailBuffer.noStroke();
    window.trailBuffer.ellipse(particle.x + particle.offsetX, particle.y + particle.offsetY, particle.size / 2, particle.size / 2);
    if (window.quantumSketch.random() < 0.3) {
      window.trailBuffer.stroke(255, 255, 255, 50);
      window.trailBuffer.strokeWeight(0.5);
      window.trailBuffer.line(
        particle.x + particle.offsetX,
        particle.y + particle.offsetY,
        particle.x + particle.offsetX + window.quantumSketch.random(-20, 20),
        particle.y + particle.offsetY + window.quantumSketch.random(-20, 20)
      );
    }
  }

  particle.phase += particle.individualPeriod * 0.03;
  window.lastMouseX = window.quantumSketch.mouseX;
  window.lastMouseY = window.quantumSketch.mouseY;
}

function renderParticle(particle, state) {
  let px = particle.x + particle.offsetX;
  let py = particle.y + particle.offsetY;
  if (px < 0 || px > window.quantumSketch.windowWidth || py < 0 || py > (document.fullscreenElement ? window.quantumSketch.windowHeight : window.quantumSketch.windowHeight - 100)) return;

  window.quantumSketch.push();
  window.quantumSketch.translate(px, py);
  window.quantumSketch.rotate(particle.rotation);
  let colorShift = cachedNoise(particle.chaosSeed, window.frame * 0.02, 7) * 20;
  let alpha = particle.alpha * state.a / 255;
  let strokeW = window.quantumSketch.map(window.frame - particle.birthFrame, 250, 500, 1, 0);
  window.quantumSketch.stroke(state.r + colorShift, state.g + colorShift, state.b + colorShift, alpha * 0.5);
  window.quantumSketch.strokeWeight(strokeW);
  window.quantumSketch.fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, alpha);
  window.quantumSketch.drawingContext.shadowBlur = particle.superposition ? 10 : 0;

  let size = particle.size;
  let waveDistort = 0.7 * cachedNoise(particle.chaosSeed, window.frame * 0.07, 8);

  if (particle.superposition && !state.collapsed) {
    let probDensity = particle.probAmplitude * 250;
    window.quantumSketch.fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, probDensity * 0.5);
    window.quantumSketch.noStroke();
    window.quantumSketch.ellipse(0, 0, size * 4, size * 4);
    for (let i = 0; i < 3; i++) {
      if (window.quantumSketch.random() < 0.6) {
        window.quantumSketch.fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, probDensity * 0.3);
        window.quantumSketch.noStroke();
        let superX = window.quantumSketch.random(-30, 30);
        let superY = window.quantumSketch.random(-30, 30);
        let pulse = cachedNoise(particle.chaosSeed, window.frame * 0.1, i + 9) * 10;
        window.quantumSketch.ellipse(superX + pulse, superY + pulse, size * 3);
      }
    }
  }

  if (particle.superpositionT < 1) {
    window.quantumSketch.rect(-size / 2, -size / 2, size, size);
    for (let i = 0; i < 2; i++) {
      if (window.quantumSketch.random() < 0.5) {
        window.quantumSketch.fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, alpha * 0.3);
        window.quantumSketch.noStroke();
        let superX = window.quantumSketch.random(-30, 30);
        let superY = window.quantumSketch.random(-30, 30);
        let pulse = cachedNoise(particle.chaosSeed, window.frame * 0.1, i + 11) * 5;
        window.quantumSketch.ellipse(superX + pulse, superY + pulse, size * 2);
      }
    }
  } else {
    if (particle.shapeType === 0) {
      window.quantumSketch.ellipse(0, 0, size * (1 + waveDistort), size * (1 - waveDistort));
    } else if (particle.shapeType === 1) {
      window.quantumSketch.beginShape();
      for (let a = 0; a < window.quantumSketch.TWO_PI; a += window.quantumSketch.TWO_PI / 3) {
        let r = size * (1 + waveDistort * window.quantumSketch.cos(a));
        window.quantumSketch.vertex(r * window.quantumSketch.cos(a), r * window.quantumSketch.sin(a));
      }
      window.quantumSketch.endShape(window.quantumSketch.CLOSE);
    } else if (particle.shapeType === 2) {
      window.quantumSketch.beginShape();
      for (let a = 0; a < window.quantumSketch.TWO_PI; a += window.quantumSketch.TWO_PI / particle.sides) {
        let r = size * (1 + waveDistort * window.quantumSketch.cos(a * particle.sides));
        window.quantumSketch.vertex(r * window.quantumSketch.cos(a), r * window.quantumSketch.sin(a));
      }
      window.quantumSketch.endShape(window.quantumSketch.CLOSE);
    } else if (particle.shapeType === 3) {
      window.quantumSketch.rect(-size / 2, -size / 2, size, size);
    } else if (particle.shapeType === 4) {
      window.quantumSketch.triangle(-size / 2, size / 2, 0, -size / 2, size / 2, size / 2);
    }
  }
  window.quantumSketch.pop();
}

function renderInterference() {
  for (let i = 0; i < 5; i++) {
    let x1 = window.quantumSketch.random(window.quantumSketch.windowWidth);
    let y1 = window.quantumSketch.random(document.fullscreenElement ? window.quantumSketch.windowHeight : window.quantumSketch.windowHeight - 100);
    let x2 = x1 + window.quantumSketch.random(-100, 100);
    let y2 = y1 + window.quantumSketch.random(-100, 100);
    let interference = cachedNoise(x1 * 0.01, y1 * 0.01, window.frame * 0.01);
    window.trailBuffer.stroke(255, 255 * interference);
    window.trailBuffer.strokeWeight(1);
    window.trailBuffer.line(x1, y1, x2, y2);
    if (i === 0 && !window.textMessages.queue.some(m => m.eventType === "interference")) {
      addQuantumMessage("Интерференция: волны частиц создают узоры.", "interference");
    }
  }
}
