console.log('Начало particles.js');
console.log('p5Instance:', window.p5Instance);
console.log('trailBuffer:', window.trailBuffer);
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
  if (!window.img || !window.img.width) return [];
  window.img.loadPixels();
  let blockList = [];
  let maxBlockSize = 16;
  let blockSize = window.p5Instance.map(window.frame, 1, 30, 1, maxBlockSize);
  blockSize = window.p5Instance.constrain(blockSize, 1, maxBlockSize);

  for (let y = 0; y < window.img.height; y += blockSize) {
    for (let x = 0; x < window.img.width; x += blockSize) {
      blockList.push({
        x,
        y,
        startFrame: window.p5Instance.random(15, 30),
        endFrame: window.p5Instance.random(31, 60),
        superpositionT: 0,
        wavePhase: window.p5Instance.random(window.p5Instance.TWO_PI),
        probAmplitude: window.p5Instance.random(0.5, 1),
        noiseSeed: window.p5Instance.random(1000)
      });
    }
  }

  for (let block of blockList) {
    if (window.frame <= block.endFrame + 500) {
      let x = block.x;
      let y = block.y;
      let r = 0, g = 0, b = 0, count = 0;
      let size = window.p5Instance.min(blockSize, window.img.width - x, window.img.height - y);
      for (let dy = 0; dy < size && y + dy < window.img.height; dy++) {
        for (let dx = 0; dx < size && x + dx < window.img.width; dx++) {
          let col = window.img.get(x + dx, y + dy);
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
      }

      let offsetX = 0, offsetY = 0, rotation = 0;
      let noiseVal = cachedNoise(block.noiseSeed + window.frame * 0.05, 0, 0);
      if (window.frame >= 1) {
        offsetX += noiseVal * 10 - 5;
        offsetY += cachedNoise(0, block.noiseSeed + window.frame * 0.05, 0) * 10 - 5;
      }
      if (window.frame >= block.startFrame) {
        let waveOffset = cachedNoise(block.noiseSeed, window.frame * 0.03, 0) * 30 * block.probAmplitude;
        offsetX += waveOffset * window.p5Instance.cos(block.wavePhase);
        offsetY += waveOffset * window.p5Instance.sin(block.wavePhase);
        rotation += noiseVal * 0.1;
        if (window.p5Instance.random() < 0.05 && window.frame === block.startFrame) {
          addQuantumMessage("Суперпозиция: частица в нескольких состояниях одновременно.", "superposition");
        }
      }
      let canvasX = x + (window.p5Instance.width - window.img.width) / 2 + offsetX;
      let canvasY = y + (window.p5Instance.height - window.img.height) / 2 + offsetY;

      if (window.frame >= block.startFrame) {
        let probDensity = block.probAmplitude * 100;
        window.p5Instance.fill(r, g, b, probDensity);
        window.p5Instance.noStroke();
        window.p5Instance.ellipse(canvasX, canvasY, size * 4, size * 4);
      }
      let alpha = window.p5Instance.map(window.frame, block.endFrame, block.endFrame + 500, 255, 0);
      let strokeW = window.p5Instance.map(window.frame, block.endFrame, block.endFrame + 500, 1, 0);
      let colorShift = cachedNoise(block.noiseSeed, window.frame * 0.02, 0) * 15;
      window.p5Instance.fill(r + colorShift, g + colorShift, b + colorShift, alpha);
      window.p5Instance.noStroke();
      window.p5Instance.push();
      window.p5Instance.translate(canvasX, canvasY);
      window.p5Instance.rotate(rotation);
      window.p5Instance.rect(-size / 2, -size / 2, size, size);
      window.p5Instance.pop();

      if (window.frame >= block.startFrame && window.p5Instance.random() < 0.5) {
        for (let i = 0; i < 2; i++) {
          window.p5Instance.fill(r + colorShift, g + colorShift, b + colorShift, alpha * 0.3);
          window.p5Instance.noStroke();
          let superX = canvasX + window.p5Instance.random(-30, 30);
          let superY = canvasY + window.p5Instance.random(-30, 30);
          let pulse = cachedNoise(block.noiseSeed, window.frame * 0.1, i) * 5;
          window.p5Instance.ellipse(superX + pulse, superY + pulse, size * 2);
        }
      }
    }
  }
  return blockList;
}

window.initializeParticles = function(blockList) {
  if (!window.img || !window.p5Canvas || !window.isCanvasReady || !window.p5Instance) {
    console.warn('Cannot initialize particles: image, canvas, or p5 instance not ready');
    return;
  }
  if (!Array.isArray(blockList)) {
    console.warn('blockList is not an array, initializing empty particles');
    blockList = [];
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
      let layer = window.p5Instance.random() < 0.1 ? 'vacuum' : window.p5Instance.random() < 0.2 ? 'background' : 'main';
      let shapeType = window.p5Instance.floor(window.p5Instance.random(5));
      let targetSize = window.p5Instance.random(5, 30);
      let superposition = window.p5Instance.random() < 0.3;
      let timeAnomaly = window.p5Instance.random() < 0.05;
      let angle = window.p5Instance.random(window.p5Instance.TWO_PI);
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
        gridX: x,
        gridY: y,
        layer: layer,
        chaosSeed: window.p5Instance.random(1000),
        alpha: 255,
        startFrame: block.endFrame || window.frame + 1,
        birthFrame: window.frame,
        shapeType: shapeType,
        sides: shapeType === 2 ? window.p5Instance.floor(window.p5Instance.random(5, 13)) : 0,
        tunneled: false,
        tunnelTargetX: 0,
        tunnelTargetY: 0,
        superposition: superposition,
        timeAnomaly: timeAnomaly,
        timeDirection: timeAnomaly ? window.p5Instance.random([-1, 1]) : 1,
        uncertainty: window.p5Instance.random(0.5, 3),
        wavePhase: block.wavePhase || window.p5Instance.random(window.p5Instance.TWO_PI),
        radialAngle: angle,
        radialDistance: 0,
        targetRadialDistance: window.p5Instance.random(100, 300),
        superpositionT: 0,
        probAmplitude: window.p5Instance.random(0.5, 1.5),
        barrier: window.p5Instance.random() < 0.1 ? { x: window.p5Instance.random(window.p5Instance.width), y: window.p5Instance.random(window.p5Instance.height), width: 20, height: 100 } : null,
        speed: window.p5Instance.random(0.8, 1.5),
        rotation: 0,
        individualPeriod: window.p5Instance.random(0.5, 3),
        decoherence: 0,
        entangledIndex: -1
      };
      window.particles.push(particle);
      particleCount++;

      if (window.p5Instance.random() < 0.05 && particle.layer === 'main') {
        let entangled = { ...particle };
        entangled.x = window.p5Instance.random(window.p5Instance.width);
        entangled.y = window.p5Instance.random(window.p5Instance.height);
        entangled.baseX = entangled.x;
        entangled.baseY = entangled.y;
        entangled.chaosSeed = window.p5Instance.random(1000);
        entangled.entangledIndex = window.particles.length;
        particle.entangledIndex = window.particles.length + 1;
        window.particles.push(entangled);
        window.entangledPairs.push([particleCount - 1, particleCount]);
        particleCount++;
        window.addQuantumMessage("Запутанность: две частицы связаны, их состояния синхронизированы.", "entanglement");
      }
        playSound('entanglement');
      }
    }

    for (let i = 0; i < window.particles.length; i++) {
      let particle = window.particles[i];
      let pixelX = window.p5Instance.constrain(Math.floor(particle.gridX), 0, window.img.width - 1);
      let pixelY = window.p5Instance.constrain(Math.floor(particle.gridY), 0, window.img.height - 1);
      let col = window.img.get(pixelX, pixelY);
      let isMonochrome = window.p5Instance.random() < 0.2;
      let gray = (window.p5Instance.red(col) + window.p5Instance.green(col) + window.p5Instance.blue(col)) / 3 * window.p5Instance.random(0.7, 1);
      window.quantumStates[i] = {
        r: isMonochrome ? gray : window.p5Instance.red(col),
        g: isMonochrome ? gray : window.p5Instance.green(col),
        b: isMonochrome ? gray : window.p5Instance.blue(col),
        a: 255,
        baseR: window.p5Instance.red(col),
        baseG: window.p5Instance.green(col),
        baseB: window.p5Instance.blue(col),
        collapsed: false
      };
    }
  console.log('Created', particleCount, 'particles');
}

function updateParticle(particle, state) {
  let px = particle.x + particle.offsetX;
  let py = particle.y + particle.offsetY;
  if (px < 0 || px > window.p5Instance.width || py < 0 || py > window.p5Instance.height || particle.alpha < 20) {
    return;
  }

  let noiseX = cachedNoise(particle.chaosSeed + window.frame * 0.03, 0, 0) * 2 - 1;
  let noiseY = cachedNoise(0, particle.chaosSeed + window.frame * 0.03, 0) * 2 - 1;

  if (window.frame >= particle.startFrame - 25 && window.frame <= particle.startFrame) {
    particle.superpositionT = window.p5Instance.map(window.frame, particle.startFrame - 25, particle.startFrame, 0, 1);
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
    particle.offsetX += waveOffset * window.p5Instance.cos(particle.wavePhase);
    particle.offsetY += waveOffset * window.p5Instance.sin(particle.wavePhase);

    particle.decoherence += 0.001 * cachedNoise(particle.chaosSeed, window.frame * 0.01, 2);
    if (particle.decoherence > 1) {
      particle.alpha *= 0.95;
      particle.probAmplitude *= 0.98;
      if (window.p5Instance.random() < 0.01) {
        particle.alpha = 0;
        window.addQuantumMessage("Декогеренция: частица потеряла квантовую когерентность.", "decoherence");
      }
    }

    if (particle.superposition) {
      particle.offsetX += cachedNoise(particle.chaosSeed, window.frame * 0.02, 3) * 10;
      particle.offsetY += cachedNoise(particle.chaosSeed + 200, window.frame * 0.02, 3) * 10;
    }

    if (window.p5Instance.random() < 0.02) {
      particle.alpha = 255;
      setTimeout(() => particle.alpha *= 0.9, 200);
    }

    if (particle.barrier && window.p5Instance.random() < 0.1 && !particle.tunneled) {
      let distToBarrier = window.p5Instance.dist(particle.x, particle.y, particle.barrier.x, particle.barrier.y);
      if (distToBarrier < 50) {
        particle.tunneled = true;
        particle.tunnelTargetX = particle.barrier.x + particle.barrier.width + window.p5Instance.random(-20, 20);
        particle.tunnelTargetY = particle.y + window.p5Instance.random(-20, 20);
        if (window.trailBuffer) {
          window.trailBuffer.noFill();
          for (let i = 0; i < 3; i++) {
            window.trailBuffer.stroke(state.r, state.g, state.b, 255 - i * 85);
            window.trailBuffer.strokeWeight(1);
            window.trailBuffer.ellipse(particle.tunnelTargetX, particle.tunnelTargetY, 10 + i * 5);
          }
        }
        setTimeout(() => {
          particle.tunneled = false;
          particle.x = particle.tunnelTargetX;
          particle.y = particle.tunnelTargetY;
          window.addQuantumMessage("Туннелирование: частица преодолела барьер.", "tunneling");
          playSound('tunneling');
        }, 500);
      }
    }

    for (let other of window.particles) {
      if (other !== particle && window.p5Instance.random() < 0.005) {
        let d = window.p5Instance.dist(particle.x + particle.offsetX, particle.y + particle.offsetY, other.x + other.offsetX, other.y + other.offsetY);
        if (d < 50 && d > 0) {
          particle.offsetX += (other.offsetX - particle.offsetX) * 0.2;
          particle.offsetY += (other.offsetY - particle.offsetY) * 0.2;
        }
      }
    }

    let breakupT = window.p5Instance.map(window.frame, particle.startFrame, particle.startFrame + 175, 0, 1);
    breakupT = window.p5Instance.constrain(breakupT, 0, 1);
    if (particle.timeAnomaly) {
      breakupT += particle.timeDirection * 0.02 * cachedNoise(particle.chaosSeed, window.frame * 0.05, 4);
      breakupT = window.p5Instance.constrain(breakupT, 0, 1);
    }
    let easedT = easeOutQuad(breakupT);

    particle.size = window.p5Instance.lerp(particle.size, particle.targetSize, easedT);
    let noiseAngle = cachedNoise(particle.chaosSeed + window.frame * 0.02, 0, 0) * window.p5Instance.PI / 4;
    let angle = particle.radialAngle + noiseAngle;
    particle.radialDistance = window.p5Instance.lerp(particle.radialDistance, particle.targetRadialDistance, easedT);
    particle.offsetX = window.p5Instance.cos(angle) * particle.radialDistance;
    particle.offsetY = window.p5Instance.sin(angle) * particle.radialDistance;

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

  let d = window.p5Instance.dist(window.cursorX, window.cursorY, particle.x + particle.offsetX, particle.y + particle.offsetY);
  let influence = d < window.mouseInfluenceRadius ? window.p5Instance.map(d, 0, window.mouseInfluenceRadius, 1, 0) : 0;
  if (window.cursorX === window.lastMouseX && window.cursorY === window.lastMouseY) {
    window.mouseHoverTime += 0.016;
  } else {
    window.mouseHoverTime = 0;
  }
  if (influence > 0 && !window.isPaused) {
    let repelAngle = window.p5Instance.atan2(particle.y + particle.offsetY - window.cursorY, particle.x + particle.offsetX - window.cursorX);
    particle.offsetX += window.p5Instance.cos(repelAngle) * 15 * influence;
    particle.offsetY += window.p5Instance.sin(repelAngle) * 15 * influence;
    particle.speed *= 1.3;
    let noiseVal = cachedNoise(particle.chaosSeed, window.frame * 0.05, 5);
    particle.offsetX += noiseVal * 10 * influence;
    particle.offsetY += cachedNoise(particle.chaosSeed + 300, window.frame * 0.05, 5) * 10 * influence;
    particle.probAmplitude += influence * 0.02 * (window.mouseHoverTime > 1 ? 2 : 1);
    let waveOffset = cachedNoise(particle.chaosSeed, window.frame * 0.03, 6) * 50 * influence;
    particle.offsetX += waveOffset * window.p5Instance.cos(particle.wavePhase);
    particle.offsetY += waveOffset * window.p5Instance.sin(particle.wavePhase);
    state.r = window.p5Instance.constrain(state.baseR + influence * 30, 0, 255);
    state.g = window.p5Instance.constrain(state.baseG + influence * 30, 0, 255);
    state.b = window.p5Instance.constrain(state.baseB + influence * 30, 0, 255);
    if ((window.p5Instance.dist(window.cursorX, window.cursorY, window.lastMouseX, window.lastMouseY) > 20 || window.mouseHoverTime > 1) && window.p5Instance.random() < 0.05 && window.particles.length < window.maxParticles) {
      let newParticle = {
        x: particle.x,
        y: particle.y,
        baseX: particle.x,
        baseY: particle.y,
        offsetX: 0,
        offsetY: 0,
        size: window.p5Instance.random(5, 15),
        targetSize: window.p5Instance.random(5, 15),
        phase: window.p5Instance.random(window.p5Instance.TWO_PI),
        gridX: particle.gridX,
        gridY: particle.gridY,
        layer: 'main',
        chaosSeed: window.p5Instance.random(1000),
        alpha: 255,
        startFrame: window.frame,
        birthFrame: window.frame,
        shapeType: window.p5Instance.floor(window.p5Instance.random(5)),
        sides: window.p5Instance.floor(window.p5Instance.random(5, 13)),
        tunneled: false,
        tunnelTargetX: 0,
        tunnelTargetY: 0,
        superposition: window.p5Instance.random() < 0.3,
        timeAnomaly: window.p5Instance.random() < 0.05,
        timeDirection: window.p5Instance.random([-1, 1]),
        uncertainty: window.p5Instance.random(0.5, 3),
        wavePhase: window.p5Instance.random(window.p5Instance.TWO_PI),
        radialAngle: window.p5Instance.random(window.p5Instance.TWO_PI),
        radialDistance: 0,
        targetRadialDistance: window.p5Instance.random(100, 300),
        superpositionT: 1,
        probAmplitude: window.p5Instance.random(0.5, 1.5),
        barrier: null,
        speed: window.p5Instance.random(0.8, 1.5),
        rotation: 0,
        individualPeriod: window.p5Instance.random(0.5, 3),
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
      let distToP = window.p5Instance.dist(particle.x + particle.offsetX, particle.y + particle.offsetY, p.x, p.y);
      return distToP < closest.dist ? { x: p.x, y: p.y, dist: distToP } : closest;
    }, { x: 0, y: 0, dist: Infinity });
    particle.offsetX = nearestPoint.x - particle.x;
    particle.offsetY = nearestPoint.y - particle.y;
  }

  if (particle.layer === 'main' && window.frame >= particle.startFrame && particle.superpositionT >= 1 && window.p5Instance.random() < 0.1 && particle.probAmplitude > 0.7) {
    let probDensity = particle.probAmplitude * 100;
    if (window.trailBuffer) {
      window.trailBuffer.fill(state.r, state.g, state.b, probDensity);
      window.trailBuffer.noStroke();
      window.trailBuffer.ellipse(particle.x + particle.offsetX, particle.y + particle.offsetY, particle.size / 2, particle.size / 2);
      if (window.p5Instance.random() < 0.3) {
        window.trailBuffer.stroke(255, 255, 255, 50);
        window.trailBuffer.strokeWeight(0.5);
        window.trailBuffer.line(
          particle.x + particle.offsetX,
          particle.y + particle.offsetY,
          particle.x + particle.offsetX + window.p5Instance.random(-20, 20),
          particle.y + particle.offsetY + window.p5Instance.random(-20, 20)
        );
      }
    }
  }

  particle.phase += particle.individualPeriod * 0.03;
  window.lastMouseX = window.cursorX;
  window.lastMouseY = window.cursorY;
}

function renderParticle(particle, state) {
  let px = particle.x + particle.offsetX;
  let py = particle.y + particle.offsetY;
  if (px < 0 || px > window.p5Instance.width || py < 0 || py > window.p5Instance.height) return;

  window.p5Instance.push();
  window.p5Instance.translate(px, py);
  window.p5Instance.rotate(particle.rotation);
  let colorShift = cachedNoise(particle.chaosSeed, window.frame * 0.02, 7) * 20;
  let alpha = particle.alpha * state.a / 255;
  let strokeW = window.p5Instance.map(window.frame - particle.birthFrame, 250, 500, 1, 0);
  window.p5Instance.stroke(state.r + colorShift, state.g + colorShift, state.b + colorShift, alpha * 0.5);
  window.p5Instance.strokeWeight(strokeW);
  window.p5Instance.fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, alpha);
  window.p5Instance.drawingContext.shadowBlur = particle.superposition ? 10 : 0;

  let size = particle.size;
  let waveDistort = 0.7 * cachedNoise(particle.chaosSeed, window.frame * 0.07, 8);

  if (particle.superposition && !state.collapsed) {
    let probDensity = particle.probAmplitude * 250;
    window.p5Instance.fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, probDensity * 0.5);
    window.p5Instance.noStroke();
    window.p5Instance.ellipse(0, 0, size * 4, size * 4);
    for (let i = 0; i < 3; i++) {
      if (window.p5Instance.random() < 0.6) {
        window.p5Instance.fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, probDensity * 0.3);
        window.p5Instance.noStroke();
        let superX = window.p5Instance.random(-30, 30);
        let superY = window.p5Instance.random(-30, 30);
        let pulse = cachedNoise(particle.chaosSeed, window.frame * 0.1, i + 9) * 10;
        window.p5Instance.ellipse(superX + pulse, superY + pulse, size * 3);
      }
    }
  }

  if (particle.superpositionT < 1) {
    window.p5Instance.rect(-size / 2, -size / 2, size, size);
    for (let i = 0; i < 2; i++) {
      if (window.p5Instance.random() < 0.5) {
        window.p5Instance.fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, alpha * 0.3);
        window.p5Instance.noStroke();
        let superX = window.p5Instance.random(-30, 30);
        let superY = window.p5Instance.random(-30, 30);
        let pulse = cachedNoise(particle.chaosSeed, window.frame * 0.1, i + 11) * 5;
        window.p5Instance.ellipse(superX + pulse, superY + pulse, size * 2);
      }
    }
  } else {
    if (particle.shapeType === 0) {
      window.p5Instance.ellipse(0, 0, size * (1 + waveDistort), size * (1 - waveDistort));
    } else if (particle.shapeType === 1) {
      window.p5Instance.beginShape();
      for (let a = 0; a < window.p5Instance.TWO_PI; a += window.p5Instance.TWO_PI / 3) {
        let r = size * (1 + waveDistort);
        window.p5Instance.vertex(r * window.p5Instance.cos(a), r * window.p5Instance.sin(a));
      }
      window.p5Instance.endShape(window.p5Instance.CLOSE);
    } else if (particle.shapeType === 2) {
      window.p5Instance.beginShape();
      for (let a = 0; a < window.p5Instance.TWO_PI; a += window.p5Instance.TWO_PI / particle.sides) {
        let r = size * (0.8 + 0.3 * cachedNoise(a * 3 + particle.chaosSeed, window.frame * 0.02, 13));
        window.p5Instance.vertex(r * window.p5Instance.cos(a), r * window.p5Instance.sin(a));
      }
      window.p5Instance.endShape(window.p5Instance.CLOSE);
    } else if (particle.shapeType === 3) {
      window.p5Instance.beginShape();
      let noiseVal = cachedNoise(particle.chaosSeed, window.frame * 0.01, 14);
      for (let a = 0; a < window.p5Instance.TWO_PI; a += window.p5Instance.TWO_PI / 30) {
        let r = size * (0.5 + 0.5 * noiseVal + waveDistort + 0.3 * cachedNoise(a * 0.5, window.frame * 0.05, 15));
        window.p5Instance.vertex(r * window.p5Instance.cos(a), r * window.p5Instance.sin(a));
      }
      window.p5Instance.endShape(window.p5Instance.CLOSE);
    } else {
      window.p5Instance.beginShape();
      for (let a = 0; a < window.p5Instance.TWO_PI; a += window.p5Instance.TWO_PI / 40) {
        let r = size * (0.6 + 0.4 * cachedNoise(a * 2 + particle.chaosSeed, window.frame * 0.03, 16));
        r *= (1 + 0.2 * cachedNoise(a * 5, window.frame * 0.01, 17));
        window.p5Instance.vertex(r * window.p5Instance.cos(a), r * window.p5Instance.sin(a));
      }
      window.p5Instance.endShape(window.p5Instance.CLOSE);
    }
  }

  if (particle.barrier) {
    window.p5Instance.fill(255, 255, 255, 50);
    window.p5Instance.noStroke();
    window.p5Instance.rect(particle.barrier.x - particle.x, particle.barrier.y - particle.y, particle.barrier.width, particle.barrier.height);
    if (particle.tunneled) {
      window.p5Instance.fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, 30);
      window.p5Instance.ellipse(particle.tunnelTargetX - particle.x, particle.tunnelTargetY - particle.y, size / 2);
    }
  }

  window.p5Instance.pop();
}

function renderInterference() {
  if (!window.trailBuffer) return;
  let gridSize = 50;
  let maxY = window.p5Instance.height;
  for (let x = 0; x < window.p5Instance.width; x += gridSize) {
    for (let y = 0; y < maxY; y += gridSize) {
      let amplitude = 0;
      for (let particle of window.particles.filter(p => p.layer === 'main' && p.superposition)) {
        let d = window.p5Instance.dist(x, y, particle.x + particle.offsetX, particle.y + particle.offsetY);
        if (d < 100) {
          let wave = window.p5Instance.cos(d * 0.05 + window.frame * 0.02) * particle.probAmplitude;
          amplitude += wave;
        }
      }
      // Рендеринг интерференционного узора
      let intensity = window.p5Instance.map(amplitude, -1, 1, 0, 255);
      window.trailBuffer.fill(intensity, intensity, intensity, 50);
      window.trailBuffer.noStroke();
      window.trailBuffer.ellipse(x, y, gridSize / 2, gridSize / 2);
    }
  }
}
console.log('Конец particles.js');
