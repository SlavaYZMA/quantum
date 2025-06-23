window.frame = 0;
window.isPaused = false;
window.particles = [];
window.quantumStates = [];
window.isCanvasReady = false;
window.noiseScale = 0.03;
window.mouseInfluenceRadius = 200;
window.chaoticFactor = 0;
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

function updateBoundary() {
  window.boundaryPoints = [];
  let numPoints = 40;
  let margin = 10;
  let maxX = window.p5Instance.width - margin;
  let maxY = window.p5Instance.height - margin;
  for (let i = 0; i < numPoints / 4; i++) {
    let x = window.p5Instance.lerp(margin, maxX, i / (numPoints / 4));
    window.boundaryPoints.push({ x, y: margin });
  }
  for (let i = 0; i < numPoints / 4; i++) {
    let y = window.p5Instance.lerp(margin, maxY, i / (numPoints / 4));
    window.boundaryPoints.push({ x: maxX, y });
  }
  for (let i = 0; i < numPoints / 4; i++) {
    let x = window.p5Instance.lerp(maxX, margin, i / (numPoints / 4));
    window.boundaryPoints.push({ x, y: maxY });
  }
  for (let i = 0; i < numPoints / 4; i++) {
    let y = window.p5Instance.lerp(maxY, margin, i / (numPoints / 4));
    window.boundaryPoints.push({ x: margin, y });
  }
}

function isPointInBoundary(x, y) {
  let margin = 10;
  let maxY = window.p5Instance.height;
  if (x < margin || x > window.p5Instance.width - margin || y < margin || y > maxY - margin) return false;
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
  let value = window.p5Instance.noise(x, y, z);
  window.noiseCache.set(key, value);
  if (window.noiseCache.size > 10000) {
    window.noiseCache.clear();
  }
  return value;
}

function addQuantumMessage(message, eventType) {
  let newMessage = {
    text: message,
    x: window.p5Instance.random(100, window.p5Instance.width - 100),
    y: window.p5Instance.random(150, window.p5Instance.height - 50),
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
  window.p5Instance.textAlign(window.p5Instance.LEFT, window.p5Instance.TOP);
  window.p5Instance.textSize(16);
  if (window.textMessages.active) {
    let msg = window.textMessages.active;
    let t = (window.frame - msg.startFrame) / 30;
    if (msg.fadeIn) {
      msg.alpha = window.p5Instance.lerp(0, 255, easeOutQuad(window.p5Instance.min(t, 0.1)));
      if (t >= 0.1) msg.fadeIn = false;
    } else {
      if (t < 0.8) {
        msg.alpha = 255;
      } else {
        msg.alpha = window.p5Instance.lerp(255, 0, easeOutQuad((t - 0.8) / 0.2));
      }
    }
    window.p5Instance.fill(255, 255, 255, msg.alpha);
    window.p5Instance.noStroke();
    window.p5Instance.text(msg.text, msg.x, msg.y);

    if (t > 1) {
      window.textMessages.active = null;
      if (window.textMessages.queue.length > 0) {
        window.textMessages.active = window.textMessages.queue.shift();
        window.textMessages.active.startFrame = window.frame;
      }
    }
  }
}

function renderTransformingPortrait() {
  console.log('Rendering portrait, img:', window.img, 'width:', window.img?.width);
  if (!window.img || !window.img.width) {
    console.warn('No image or invalid image width');
    return [];
  }
  window.img.loadPixels();
  let blockList = [];
  let maxBlockSize = 16;
  let blockSize = window.p5Instance.map(window.frame, 1, 60, 1, maxBlockSize); // Увеличен диапазон кадров
  blockSize = window.p5Instance.constrain(blockSize, 1, maxBlockSize);
  console.log('Block size:', blockSize, 'Frame:', window.frame);

  for (let y = 0; y < window.img.height; y += blockSize) {
    for (let x = 0; x < window.img.width; x += blockSize) {
      blockList.push({
        x,
        y,
        startFrame: 0,
        endFrame: 120, // Увеличен диапазон для частиц
        superpositionT: 0,
        wavePhase: window.p5Instance.random(window.p5Instance.TWO_PI),
        probAmplitude: window.p5Instance.random(0.5, 1),
        noiseSeed: window.p5Instance.random(1000)
      });
    }
  }
  console.log('Created blockList with', blockList.length, 'blocks');

  let pixelCache = new Map();
  for (let block of blockList) {
    let x = block.x;
    let y = block.y;
    let r = 0, g = 0, b = 0, count = 0;
    let size = window.p5Instance.min(blockSize, window.img.width - x, window.img.height - y);
    for (let dy = 0; dy < size && y + dy < window.img.height; dy++) {
      for (let dx = 0; dx < size && x + dx < window.img.width; dx++) {
        let key = `${x + dx},${y + dy}`;
        let col = pixelCache.get(key) || window.img.get(x + dx, y + dy);
        pixelCache.set(key, col);
        console.log('Pixel at', x + dx, y + dy, 'color:', col);
        r += window.p5Instance.red(col);
        g += window.p5Instance.green(col);
        b += window.p5Instance.blue(col);
        count++;
      }
    }
    if (count > 0) {
      r = r / count;
      g = g / count;
      b = b / count;
    } else {
      console.warn('No valid pixels for block at', x, y);
      continue;
    }
    console.log('Average color for block at', x, y, ':', r, g, b);

    let offsetX = 0, offsetY = 0, rotation = 0;
    let noiseVal = cachedNoise(block.noiseSeed + window.frame * 0.1, 0, 0); // Увеличен множитель
    if (window.frame >= 1) {
      offsetX += noiseVal * 20 - 10; // Увеличена амплитуда
      offsetY += cachedNoise(0, block.noiseSeed + window.frame * 0.1, 0) * 20 - 10;
      rotation = cachedNoise(block.noiseSeed, window.frame * 0.05, 0) * 0.2 - 0.1; // Добавлено вращение
    }
    console.log('Offsets for block at', x, y, ':', offsetX, offsetY, 'rotation:', rotation); // Отладка смещений
    let canvasX = x + (window.p5Instance.width - window.img.width) / 2 + offsetX;
    let canvasY = y + (window.p5Instance.height - window.img.height) / 2 + offsetY;
    console.log('Calculated canvas coords:', canvasX, canvasY, 'for block at', x, y);

    window.p5Instance.fill(r, g, b, 255);
    window.p5Instance.noStroke();
    window.p5Instance.push();
    window.p5Instance.translate(canvasX, canvasY);
    window.p5Instance.rotate(rotation);
    window.p5Instance.rect(-size / 2, -size / 2, size, size);
    window.p5Instance.pop();
    console.log('Drawing block at', canvasX, canvasY, 'size:', size, 'color:', r, g, b);

    if (window.frame >= block.startFrame && window.p5Instance.random() < 0.05) {
      addQuantumMessage("Суперпозиция: частица в нескольких состояниях.", "superposition");
    }
  }
  return blockList;
}

window.initializeParticles = function(blockList) {
  if (!window.img || !window.p5Canvas || !window.isCanvasReady || !window.p5Instance) {
    console.warn('Cannot initialize particles: image or canvas not ready');
    return;
  }
  console.log('Initializing particles with blockList:', blockList.length);
  window.particles = [];
  window.quantumStates = [];
  window.entangledPairs = [];
  const maxBlockSize = 16;
  window.maxParticles = window.p5Instance.width < 768 ? 2000 : 4000;
  let particleCount = 0;

  window.img.loadPixels();
  let usedPositions = new Set();
  for (let block of blockList) {
    let x = block.x;
    let y = block.y;
    let pixelX = window.p5Instance.constrain(x, 0, window.img.width - 1);
    let pixelY = window.p5Instance.constrain(y, 0, window.img.height - 1);
    let posKey = `${pixelX},${pixelY}`;
    if (usedPositions.has(posKey)) continue;
    usedPositions.add(posKey);
    let col = window.img.get(pixelX, pixelY);
    let brightnessVal = window.p5Instance.brightness(col);
    if (brightnessVal > 10 && particleCount < window.maxParticles) {
      let blockCenterX_canvas = x + (window.p5Instance.width - window.img.width) / 2 + maxBlockSize / 2;
      let blockCenterY_canvas = y + (window.p5Instance.height - window.img.height) / 2 + maxBlockSize / 2;
      let shapeType = window.p5Instance.random(['circle', 'spiral', 'star']);
      let targetSize = window.p5Instance.random(5, 20);
      let superposition = window.p5Instance.random() < 0.3;
      let particle = {
        x: blockCenterX_canvas,
        y: blockCenterY_canvas,
        baseX: blockCenterX_canvas,
        baseY: blockCenterY_canvas,
        offsetX: 0,
        offsetY: 0,
        size: maxBlockSize,
        targetSize: targetSize,
        phase: window.p5Instance.random(window.p5Instance.TWO_PI),
        shapeType: shapeType,
        chaosSeed: window.p5Instance.random(1000),
        alpha: 255,
        startFrame: block.endFrame || window.frame + 30,
        birthFrame: window.frame,
        superposition: superposition,
        speed: window.p5Instance.random(0.8, 1.5),
        rotation: 0,
        decoherence: 0,
        entangledIndex: -1,
        color: col
      };
      window.particles.push(particle);
      particleCount++;
      if (window.p5Instance.random() < 0.05 && particleCount < window.maxParticles - 1) {
        let entangled = { ...particle };
        entangled.x = window.p5Instance.random(window.p5Instance.width);
        entangled.y = window.p5Instance.random(window.p5Instance.height);
        entangled.entangledIndex = window.particles.length;
        particle.entangledIndex = window.particles.length + 1;
        window.particles.push(entangled);
        window.entangledPairs.push([particleCount - 1, particleCount]);
        particleCount++;
        addQuantumMessage("Запутанность: частицы связаны.", "entanglement");
      }
    }
  }

  for (let i = 0; i < window.particles.length; i++) {
    let particle = window.particles[i];
    let col = window.p5Instance.color(particle.color[0], particle.color[1], particle.color[2], particle.color[3]);
    let hue = window.p5Instance.hue(col);
    window.quantumStates[i] = {
      hue: hue,
      baseHue: hue,
      collapsed: false
    };
  }
  console.log('Created', particleCount, 'particles');
}

function updateParticle(particle, state, index) {
  if (window.isPaused || particle.startFrame > window.frame) return;
  let timeAlive = (window.frame - particle.birthFrame) * 0.01;
  let noiseX = particle.chaosSeed + timeAlive * window.noiseScale;
  let noiseY = particle.chaosSeed + 1000 + timeAlive * window.noiseScale;
  particle.offsetX = cachedNoise(noiseX, 0, 0) * 20 - 10;
  particle.offsetY = cachedNoise(0, noiseY, 0) * 20 - 10;

  if (particle.superposition) {
    let waveFreq = 0.05;
    let waveAmp = 15;
    particle.offsetX += waveAmp * Math.cos(particle.phase + timeAlive * waveFreq);
    particle.offsetY += waveAmp * Math.sin(particle.phase + timeAlive * waveFreq);
  }

  let mouseX = window.cursorX - (window.p5Canvas.elt.getBoundingClientRect().left - window.scrollX);
  let mouseY = window.cursorY - (window.p5Canvas.elt.getBoundingClientRect().top - window.scrollY);
  let distToMouse = window.p5Instance.dist(particle.x, particle.y, mouseX, mouseY);
  if (distToMouse < window.mouseInfluenceRadius && window.currentStep >= 4) {
    if (!state.collapsed && window.p5Instance.random() < 0.05) {
      state.collapsed = true;
      particle.superposition = false;
      particle.decoherence = 1;
      addQuantumMessage("Коллапс: состояние определено.", "collapse");
    }
    let pushStrength = window.p5Instance.map(distToMouse, 0, window.mouseInfluenceRadius, 5, 0);
    let angle = window.p5Instance.atan2(particle.y - mouseY, particle.x - mouseX);
    particle.offsetX += pushStrength * window.p5Instance.cos(angle);
    particle.offsetY += pushStrength * window.p5Instance.sin(angle);
  }

  if (particle.decoherence > 0) {
    particle.decoherence = window.p5Instance.max(0, particle.decoherence - 0.005);
    particle.alpha = window.p5Instance.lerp(particle.alpha, 100, 0.02);
  }

  particle.x = particle.baseX + particle.offsetX;
  particle.y = particle.baseY + particle.offsetY;
  if (!isPointInBoundary(particle.x, particle.y)) {
    particle.x = window.p5Instance.constrain(particle.x, 10, window.p5Instance.width - 10);
    particle.y = window.p5Instance.constrain(particle.y, 10, window.p5Instance.height - 10);
  }

  particle.size = window.p5Instance.lerp(particle.size, particle.targetSize, 0.05);
  particle.rotation += 0.01;

  if (particle.entangledIndex !== -1 && window.particles[particle.entangledIndex]) {
    let partner = window.particles[particle.entangledIndex];
    let syncFactor = 0.1;
    particle.offsetX += (partner.offsetX - particle.offsetX) * syncFactor;
    particle.offsetY += (partner.offsetY - particle.offsetY) * syncFactor;
  }

  if (window.p5Instance.random() < 0.001) {
    addQuantumMessage("Туннелирование: частица прошла барьер.", "tunneling");
    particle.x = window.p5Instance.random(window.p5Instance.width);
    particle.y = window.p5Instance.random(window.p5Instance.height);
  }
}

function renderParticle(particle, state) {
  if (window.isPaused || particle.startFrame > window.frame) return;
  window.p5Instance.push();
  window.p5Instance.translate(particle.x, particle.y);
  window.p5Instance.rotate(particle.rotation);
  window.p5Instance.noStroke();
  let h = state.hue;
  let s = 80;
  let l = 60;
  window.p5Instance.drawingContext.shadowBlur = 10;
  window.p5Instance.drawingContext.shadowColor = window.p5Instance.color(h, s, l);
  window.p5Instance.fill(h, s, l, particle.alpha);
  if (particle.shapeType === 'circle') {
    window.p5Instance.ellipse(0, 0, particle.size, particle.size);
  } else if (particle.shapeType === 'spiral') {
    window.p5Instance.beginShape();
    for (let a = 0; a < window.p5Instance.TWO_PI * 2; a += 0.1) {
      let r = particle.size * 0.5 * (1 + a / (window.p5Instance.TWO_PI * 2));
      let x = r * window.p5Instance.cos(a);
      let y = r * window.p5Instance.sin(a);
      window.p5Instance.vertex(x, y);
    }
    window.p5Instance.endShape();
  } else if (particle.shapeType === 'star') {
    let r1 = particle.size * 0.5;
    let r2 = particle.size * 0.25;
    window.p5Instance.beginShape();
    for (let a = 0; a < window.p5Instance.TWO_PI; a += window.p5Instance.PI / 5) {
      window.p5Instance.vertex(r1 * window.p5Instance.cos(a), r1 * window.p5Instance.sin(a));
      window.p5Instance.vertex(r2 * window.p5Instance.cos(a + window.p5Instance.PI / 10), r2 * window.p5Instance.sin(a + window.p5Instance.PI / 10));
    }
    window.p5Instance.endShape(window.p5Instance.CLOSE);
  }
  window.p5Instance.drawingContext.shadowBlur = 0;
  if (particle.superposition) {
    window.p5Instance.fill(h, 50, 30, particle.alpha * 0.3);
    for (let i = 0; i < 2; i++) {
      let offset = cachedNoise(particle.chaosSeed, window.frame * 0.1, i) * 10;
      window.p5Instance.ellipse(offset, offset, particle.size * 0.5);
    }
  }
  window.p5Instance.pop();
}

window.draw = function() {
  if (!window.isCanvasReady || !window.p5Instance) {
    console.warn('Canvas not ready or p5Instance undefined');
    return;
  }
  window.frame++;
  console.log('Current frame:', window.frame);
  console.log('Current step:', window.currentStep, 'Image available:', !!window.img);
  if (!window.trailBuffer) {
    window.trailBuffer = window.p5Instance.createGraphics(window.p5Instance.width, window.p5Instance.height);
    window.trailBuffer.pixelDensity(1);
  }
  window.trailBuffer.background(0, 10);
  let mouseX = window.cursorX - (window.p5Canvas.elt.getBoundingClientRect().left - window.scrollX);
  let mouseY = window.cursorY - (window.p5Canvas.elt.getBoundingClientRect().top - window.scrollY);
  let mouseMoved = window.p5Instance.dist(mouseX, mouseY, window.lastMouseX, window.lastMouseY) > 1;
  if (mouseMoved) {
    window.mouseHoverTime = window.frame;
    window.lastMouseX = mouseX;
    window.lastMouseY = mouseY;
  }
  if (window.currentStep === 3 && window.img) {
    console.log('Attempting to render portrait for step 3');
    window.p5Instance.background(0);
    let blockList = renderTransformingPortrait();
    if (window.frame >= 60 && window.particles.length === 0) {
      console.log('Initializing particles for step 3');
      window.initializeParticles(blockList);
    }
  } else if (window.currentStep >= 4 && window.particles.length > 0) {
    console.log('Rendering particles for step', window.currentStep);
    window.p5Instance.background(0);
    for (let i = 0; i < window.particles.length; i++) {
      let particle = window.particles[i];
      let state = window.quantumStates[i];
      updateParticle(particle, state, i);
      renderParticle(particle, state);
    }
  } else {
    console.warn('No rendering: Step', window.currentStep, 'Image:', !!window.img);
    window.p5Instance.background(0);
  }
  window.p5Instance.image(window.trailBuffer, 0, 0);
  renderQuantumMessages();
};
