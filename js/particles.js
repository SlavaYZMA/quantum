window.frame = 0;
window.isPaused = false;
window.particles = [];
window.quantumStates = [];
window.canvas = null;
window.isCanvasReady = false;
window.noiseScale = 0.03;
window.mouseInfluenceRadius = 150;
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
window.textMessages = { activeMessages: [], queue: [] };
window.entangledPairs = [];
window.needsRedraw = true;
window.interferenceFrame = 0;

function easeOutQuad(t) {
  return t * (2 - t);
}

function setup() {
  console.time("Setup");
  window.canvas = createCanvas(windowWidth, windowHeight - 100, {
    willReadFrequently: true
  });
  window.canvas.parent('canvasContainer4');
  pixelDensity(1);
  frameRate(25);
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
        window.needsRedraw = true;
      });
    } else {
      document.exitFullscreen().then(() => {
        resizeCanvas(windowWidth, windowHeight - 100);
        updateBoundary();
        window.trailBuffer = createGraphics(windowWidth, windowHeight - 100);
        window.trailBuffer.pixelDensity(1);
        window.needsRedraw = true;
      });
    }
  });

  window.trailBuffer = createGraphics(windowWidth, windowHeight - 100);
  window.trailBuffer.pixelDensity(1);

  window.canvas.elt.addEventListener('click', function() {
    if (window.currentStep === 5) {
      window.isPaused = !window.isPaused;
      if (window.isPaused) {
        noLoop();
        document.getElementById('saveButton').style.display = 'block';
      } else {
        loop();
        document.getElementById('saveButton').style.display = 'none';
      }
      window.needsRedraw = true;
    }
  });

  window.canvas.elt.addEventListener('touchmove', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    mouseX = touch.clientX - window.canvas.elt.offsetLeft;
    mouseY = touch.clientY - window.canvas.elt.offsetTop;
    window.needsRedraw = true;
  }, { passive: false });

  window.addEventListener('resize', () => {
    resizeCanvas(windowWidth, document.fullscreenElement ? windowHeight : windowHeight - 100);
    window.trailBuffer = createGraphics(windowWidth, document.fullscreenElement ? windowHeight : windowHeight - 100);
    window.trailBuffer.pixelDensity(1);
    updateBoundary();
    window.needsRedraw = true;
  });

  console.log("Initializing particles...");
  initializeParticles();
  updateBoundary();
  window.isCanvasReady = true;
  window.needsRedraw = true;
  loop();
  console.timeEnd("Setup");
}

function initializeParticles() {
  console.time("InitializeParticles");
  window.particles = [];
  window.quantumStates = [];
  window.entangledPairs = [];
  window.maxParticles = windowWidth < 768 ? 500 : 1000;
  let particleCount = 0;

  let imgWidth = windowWidth / 2;
  let imgHeight = windowHeight / 2;
  let maxBlockSize = 24;
  let blockSize = maxBlockSize;
  let blockList = [];

  for (let y = 0; y < imgHeight; y += blockSize) {
    for (let x = 0; x < imgWidth; x += blockSize) {
      blockList.push({
        x,
        y,
        startFrame: random(15, 30),
        endFrame: random(31, 60),
        wavePhase: random(TWO_PI),
        probAmplitude: random(0.5, 1),
        noiseSeed: random(1000)
      });
    }
  }

  let usedPositions = new Set();
  for (let block of blockList) {
    let x = block.x;
    let y = block.y;
    let pixelX = constrain(x, 0, imgWidth - 1);
    let pixelY = constrain(y, 0, imgHeight - 1);
    let posKey = `${pixelX},${pixelY}`;
    if (usedPositions.has(posKey)) continue;
    usedPositions.add(posKey);

    let t = (pixelX / imgWidth + pixelY / imgHeight) / 2;
    let col = [lerp(100, 255, t), lerp(100, 200, t), lerp(150, 255, t)];
    let brightnessVal = (col[0] + col[1] + col[2]) / 3;

    if (brightnessVal > 10 && particleCount < window.maxParticles) {
      let blockCenterX_canvas = x + windowWidth / 2 - imgWidth / 2 + maxBlockSize / 2;
      let blockCenterY_canvas = y + (document.fullscreenElement ? windowHeight : windowHeight - 100) / 2 - imgHeight / 2 - 150 + maxBlockSize / 2;
      let layer = random() < 0.1 ? 'vacuum' : random() < 0.2 ? 'background' : 'main';
      let shapeType = floor(random(2)); // Только круги и треугольники
      let targetSize = random(5, 20);
      let superposition = random() < 0.2;
      let timeAnomaly = random() < 0.03;
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
        tunneled: false,
        superposition: superposition,
        timeAnomaly: timeAnomaly,
        timeDirection: timeAnomaly ? random([-1, 1]) : 1,
        uncertainty: random(0.5, 2),
        wavePhase: block.wavePhase,
        radialAngle: angle,
        radialDistance: 0,
        targetRadialDistance: random(50, 200),
        superpositionT: 0,
        probAmplitude: random(0.5, 1),
        speed: random(0.8, 1.2),
        rotation: 0,
        individualPeriod: random(0.5, 2),
        decoherence: 0,
        entangledIndex: -1
      };
      window.particles.push(particle);
      particleCount++;

      if (random() < 0.03 && particle.layer === 'main') {
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
        addQuantumMessage("Запутанность: две частицы связаны.", "entanglement");
      }
    }
  }

  for (let i = 0; i < window.particles.length; i++) {
    let particle = window.particles[i];
    let pixelX = constrain(Math.floor(particle.gridX), 0, imgWidth - 1);
    let pixelY = constrain(Math.floor(particle.gridY), 0, imgHeight - 1);
    let t = (pixelX / imgWidth + pixelY / imgHeight) / 2;
    let col = [lerp(100, 255, t), lerp(100, 200, t), lerp(150, 255, t)];
    let isMonochrome = random() < 0.2;
    let gray = (col[0] + col[1] + col[2]) / 3 * random(0.7, 1);
    window.quantumStates[i] = {
      r: isMonochrome ? gray : col[0],
      g: isMonochrome ? gray : col[1],
      b: isMonochrome ? gray : col[2],
      a: 255,
      baseR: col[0],
      baseG: col[1],
      baseB: col[2],
      collapsed: false
    };
  }
  console.log(`Initialized ${particleCount} particles, canvas: ${windowWidth}x${windowHeight - 100}`);
  console.timeEnd("InitializeParticles");
}

function updateBoundary() {
  window.boundaryPoints = [];
  let numPoints = 20; // Уменьшено для оптимизации
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
  return !(x < margin || x > windowWidth - margin || y < margin || y > maxY - margin);
}

function cachedNoise(x, y, z) {
  let key = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`;
  if (window.noiseCache.has(key)) return window.noiseCache.get(key);
  let value = noise(x, y, z);
  window.noiseCache.set(key, value);
  if (window.noiseCache.size > 2000) window.noiseCache.clear();
  return value;
}

function addQuantumMessage(message, eventType) {
  if (window.textMessages.activeMessages.length < 5) {
    let index = window.textMessages.activeMessages.length;
    window.textMessages.activeMessages.push({
      text: message,
      x: windowWidth - 300,
      y: 150 + index * 30,
      alpha: 0,
      fadeIn: true,
      startFrame: window.frame,
      eventType: eventType
    });
  } else {
    window.textMessages.queue.push({ text: message, eventType: eventType });
  }
  window.needsRedraw = true;
}

function renderQuantumMessages() {
  textAlign(LEFT, TOP);
  textSize(16);
  for (let i = window.textMessages.activeMessages.length - 1; i >= 0; i--) {
    let msg = window.textMessages.activeMessages[i];
    let t = (window.frame - msg.startFrame) / 120;
    if (msg.fadeIn) {
      msg.alpha = lerp(0, 255, easeOutQuad(min(t, 0.075)));
      if (t >= 0.075) msg.fadeIn = false;
    } else {
      if (t < 0.75) {
        msg.alpha = 255;
      } else {
        msg.alpha = lerp(255, 0, easeOutQuad((t - 0.75) / 0.175));
      }
    }
    fill(255, 255, 255, msg.alpha);
    noStroke();
    text(msg.text, msg.x, msg.y);

    if (t > 1) {
      window.textMessages.activeMessages.splice(i, 1);
      for (let j = i; j < window.textMessages.activeMessages.length; j++) {
        window.textMessages.activeMessages[j].y -= 30;
      }
      if (window.textMessages.queue.length > 0) {
        let newMsg = window.textMessages.queue.shift();
        window.textMessages.activeMessages.push({
          text: newMsg.text,
          x: windowWidth - 300,
          y: 150 + (window.textMessages.activeMessages.length * 30),
          alpha: 0,
          fadeIn: true,
          startFrame: window.frame,
          eventType: newMsg.eventType
        });
      }
      window.needsRedraw = true;
    }
  }
}

function draw() {
  console.time("Draw");
  console.log("Draw called, frame:", window.frame, "needsRedraw:", window.needsRedraw, "particles:", window.particles.length);

  if (!window.isCanvasReady) return;

  window.frame++;
  window.chaosTimer += 0.016;
  window.chaosFactor = map(cachedNoise(window.frame * 0.01, 0, 0), 0, 1, 0.3, 0.8);

  if (window.chaosTimer > 5) {
    window.chaosTimer = 0;
    updateBoundary();
    window.mouseInfluenceRadius = random(100, 200);
    window.noiseScale = random(0.02, 0.03);
    if (random() < 0.05) {
      addQuantumMessage("Декогеренция: потеря когерентности.", "decoherence");
    }
  }

  if (window.needsRedraw) {
    background(0);
    window.trailBuffer.clear();
  }

  let updateBackground = window.frame % 6 === 0;
  let vacuumParticles = window.particles.filter(p => p.layer === 'vacuum' && p.alpha >= 20);
  let vacuumAlpha = map(cachedNoise(window.frame * 0.005, 0, 0), 0, 1, 30, 50);
  if (updateBackground && window.needsRedraw) {
    for (let particle of vacuumParticles) {
      let state = window.quantumStates[window.particles.indexOf(particle)];
      if (!isPointInBoundary(particle.x + particle.offsetX, particle.y + particle.offsetY)) continue;
      let noiseVal = cachedNoise(particle.baseX * window.noiseScale, particle.baseY * window.noiseScale, window.frame * 0.005);
      particle.offsetX = noiseVal * 10 - 5;
      particle.offsetY = cachedNoise(particle.baseY * window.noiseScale, window.frame * 0.005, 0) * 10 - 5;
      particle.phase += 0.01;
      state.a = vacuumAlpha;
      renderParticle(particle, state);
    }
  }

  let backgroundParticles = window.particles.filter(p => p.layer === 'background' && p.alpha >= 20);
  if (updateBackground && window.needsRedraw) {
    for (let particle of backgroundParticles) {
      let state = window.quantumStates[window.particles.indexOf(particle)];
      if (!isPointInBoundary(particle.x + particle.offsetX, particle.y + particle.offsetY)) continue;
      let noiseVal = cachedNoise(particle.baseX * window.noiseScale, particle.baseY * window.noiseScale, window.frame * 0.01);
      particle.offsetX = noiseVal * 15 - 7.5;
      particle.offsetY = cachedNoise(particle.baseY * window.noiseScale, window.frame * 0.01, 0) * 15 - 7.5;
      particle.phase += particle.individualPeriod * 0.01;
      renderParticle(particle, state);
    }
  }

  let mainParticles = window.particles.filter(p => p.layer === 'main' && p.alpha >= 20);
  for (let particle of mainParticles) {
    let state = window.quantumStates[window.particles.indexOf(particle)];
    updateParticle(particle, state);
    if (window.needsRedraw && isPointInBoundary(particle.x + particle.offsetX, particle.y + particle.offsetY)) {
      renderParticle(particle, state);
    }
  }

  if (window.frame % 10 === 0) {
    renderInterference();
    if (random() < 0.1) {
      addQuantumMessage("Интерференция: волновые узоры.", "interference");
    }
    window.interferenceFrame = true;
  } else if (window.interferenceFrame && window.needsRedraw) {
    image(window.trailBuffer, 0, 0);
  }

  let frameTime = performance.now() - performance.now(); // Заменить для точного времени
  if (frameTime > 40 && window.particles.length > 500) {
    window.particles = window.particles.slice(0, window.maxParticles / 2);
    window.quantumStates = window.quantumStates.slice(0, window.maxParticles / 2);
    console.log("Reduced particles to:", window.particles.length);
  }

  if (window.needsRedraw) {
    image(window.trailBuffer, 0, 0);
    renderQuantumMessages();
  }
  window.lastFrameTime = performance.now() - performance.now(); // Заменить
  window.needsRedraw = window.isPaused ? false : true;

  console.log("FPS:", Math.round(1000 / (performance.now() - frameTime)));
  console.timeEnd("Draw");
  requestAnimationFrame(draw);
}

function renderInterference() {
  window.trailBuffer.clear();
  let gridSize = 100; // Увеличен для оптимизации
  let maxY = document.fullscreenElement ? windowHeight : windowHeight - 100;
  for (let x = 0; x < windowWidth; x += gridSize) {
    for (let y = 0; y < maxY; y += gridSize) {
      let amplitude = 0;
      for (let particle of window.particles.filter(p => p.layer === 'main' && p.superposition && p.alpha >= 20)) {
        let d = dist(x, y, particle.x + particle.offsetX, particle.y + particle.offsetY);
        if (d < 100) {
          let wave = cos(d * 0.05 + window.frame * 0.02) * particle.probAmplitude;
          amplitude += wave;
        }
      }
      let intensity = constrain(map(amplitude, -1, 1, 0, 30), 0, 30);
      window.trailBuffer.fill(255, 255, 255, intensity);
      window.trailBuffer.noStroke();
      window.trailBuffer.ellipse(x, y, gridSize / 5);
    }
  }
  window.interferenceFrame = true;
}

function updateParticle(particle, state) {
  let px = particle.x + particle.offsetX;
  let py = particle.y + particle.offsetY;
  if (px < 0 || px > windowWidth || py < 0 || py > (document.fullscreenElement ? windowHeight : windowHeight - 100)) {
    particle.alpha = 0;
    return;
  }

  let noiseVal = cachedNoise(particle.chaosSeed + window.frame * 0.03, 0, 0);
  particle.offsetX += (noiseVal * 2 - 1) * particle.uncertainty * 10 * particle.probAmplitude * particle.speed;
  particle.offsetY += (cachedNoise(particle.chaosSeed, window.frame * 0.03, 1) * 2 - 1) * particle.uncertainty * 10 * particle.probAmplitude * particle.speed;
  particle.rotation += noiseVal * 0.03;
  particle.size = particle.targetSize * (1 + 0.2 * noiseVal);

  if (window.frame >= particle.startFrame - 25 && window.frame <= particle.startFrame) {
    particle.superpositionT = map(window.frame, particle.startFrame - 25, particle.startFrame, 0, 1);
  } else if (window.frame > particle.startFrame) {
    particle.superpositionT = 1;
  }

  if (window.isPaused) {
    particle.offsetX += noiseVal * 0.3 - 0.15;
    particle.offsetY += cachedNoise(particle.chaosSeed + 100, window.frame * 0.01, 0) * 0.3 - 0.15;
  } else {
    let waveOffset = noiseVal * 30 * particle.probAmplitude;
    particle.offsetX += waveOffset * cos(particle.wavePhase);
    particle.offsetY += waveOffset * sin(particle.wavePhase);

    particle.decoherence += 0.001;
    if (particle.decoherence > 1) {
      particle.alpha *= 0.98;
      particle.probAmplitude *= 0.99;
      if (random() < 0.005) {
        particle.alpha = 0;
        addQuantumMessage("Декогеренция: частица исчезла.", "decoherence");
      }
    }

    if (particle.superposition) {
      particle.offsetX += noiseVal * 5;
      particle.offsetY += cachedNoise(particle.chaosSeed + 200, window.frame * 0.02, 2) * 5;
    }

    let breakupT = map(window.frame, particle.startFrame, particle.startFrame + 100, 0, 1);
    breakupT = constrain(breakupT, 0, 1);
    if (particle.timeAnomaly) {
      breakupT += particle.timeDirection * 0.03 * noiseVal;
      breakupT = constrain(breakupT, 0, 1);
    }
    let easedT = easeOutQuad(breakupT);
    particle.size = lerp(particle.size, particle.targetSize, easedT);
    let angle = particle.rradialAngle + noiseVal * PI / 4;
    particle.radialDistance = lerp(particleRad.radialDistance, particle.targetRad);
    particle.offsetX += cos(angle) * particle.radialDistance;
    particle.offsetY += sin(angle) * particle.radialDistance;

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

  let d = dist(mouseX, mouseY, px, py);
  let influence = d < window.mouseInfluenceRadius ? map(d, 0, window.mouseInfluenceRadius, 1, 0) : 0;
  let mouseSpeed = dist(mouseX, mouseY, window.lastMouseX, window.lastMouseY);
  if (mouseX === window.lastMouseX && mouseY === window.lastMouseY) {
    window.mouseHoverTime += 0.016;
  } else {
    window.mouseHoverTime = 0;
  }
  if (influence > 0.5 && !window.isPaused && particle.superposition && !state.collapsed) {
    let collapseProb = mouseSpeed > 20 ? 0.1 : 0.05;
    if (random() < collapseProb) {
      state.collapsed = true;
      particle.superposition = false;
      particle.shapeType = random() < 0.5 ? 0 : particle.shapeType;
      particle.uncertainty = 0;
      particle.probAmplitude = 1;
      window.trailBuffer.noFill();
      for (let i = 0; i < 2; i++) {
        window.trailBuffer.stroke(state.r, state.g, state.b, 255 - i * 127);
        window.trailBuffer.strokeWeight(1);
        window.trailBuffer.ellipse(px, py, 15 + i * 5);
      }
      addQuantumMessage("Коллапс: состояние определено.", "collapse");
    }
  }
  if (influence > 0 && !window.isPaused) {
    let repelAngle = atan2(py - mouseY, px - mouseX);
    particle.offsetX += cos(repelAngle) * 10 * influence;
    particle.offsetY += sin(repelAngle) * 10 * influence;
    particle.speed *= 1.2;
    particle.probAmplitude += influence * 0.01;
    state.r = constrain(state.baseR + influence * 20, 0, 255);
    state.g = constrain(state.baseG + influence * 20, 0, 255);
    state.b = constrain(state.baseB + influence * 20, 0, 255);
  }

  if (!isPointInBoundary(px, py)) {
    particle.alpha *= 0.95;
  }

  particle.phase += particle.individualPeriod * 0.02;
  window.lastMouseX = mouseX;
  window.lastMouseY = mouseY;
  window.needsRedraw = true;
}

function renderParticle(particle, state) {
  let px = particle.x + particle.offsetX;
  let py = particle.y + particle.offsetY;
  if (px < 0 || px > windowWidth || py < 0 || py > (document.fullscreenElement ? windowHeight : windowHeight - 100)) return;

  push();
  translate(px, py);
  rotate(particle.rotation);
  let colorShift = cachedNoise(particle.chaosSeed, window.frame * 0.02, 0) * 10;
  let alpha = particle.alpha * state.a / 255;
  fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, alpha);
  noStroke();

  let size = particle.size;
  if (particle.superposition && !state.collapsed) {
    let probDensity = particle.probAmplitude * 100;
    fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, probDensity * 0.5);
    ellipse(0, 0, size * 3, size * 3);
  }

  if (particle.superpositionT < 1) {
    rect(-size / 2, -size / 2, size, size);
  } else {
    if (particle.shapeType === 0) {
      ellipse(0, 0, size, size);
    } else {
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / 3) {
        vertex(size * cos(a), size * sin(a));
      }
      endShape(CLOSE);
    }
  }
  pop();
}
</script>
