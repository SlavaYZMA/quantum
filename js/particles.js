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
window.scaleFactor = 1;

// Функция для плавной интерполяции
function easeOutQuad(t) {
  return t * (2 - t);
}

function setup() {
  window.canvas = createCanvas(windowWidth * 0.7, windowHeight * 0.6);
  window.canvas.parent('canvasContainer4');
  pixelDensity(1);
  frameRate(25);
  noLoop();
  window.canvas.elt.style.display = 'none';

  // Буфер для следов
  window.trailBuffer = createGraphics(width, height);
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
    resizeCanvas(windowWidth * 0.7, windowHeight * 0.6);
    window.trailBuffer = createGraphics(width, height);
    window.trailBuffer.pixelDensity(1);
    updateBoundary();
  });

  updateBoundary();
  window.isCanvasReady = true;
}

function updateBoundary() {
  window.boundaryPoints = [];
  let numPoints = 20;
  for (let i = 0; i < numPoints; i++) {
    let angle = TWO_PI * i / numPoints;
    let radius = (width / 2) * (0.7 + 0.3 * noise(i * 0.1, window.frame * 0.01));
    window.boundaryPoints.push({
      x: width / 2 + cos(angle) * radius,
      y: height / 2 + sin(angle) * radius
    });
  }
}

function isPointInBoundary(x, y) {
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
  return noise(x, y, z);
}

// Рендеринг трансформации портрета
function renderTransformingPortrait(img, currentFrame) {
  img.loadPixels();
  let blockList = [];
  let maxBlockSize = 16;
  let blockSize = map(currentFrame, 1, 50, 1, maxBlockSize);
  blockSize = constrain(blockSize, 1, maxBlockSize);
  window.scaleFactor = map(currentFrame, 1, 50, 1, 0.01);

  for (let y = 0; y < img.height; y += blockSize) {
    for (let x = 0; x < img.width; x += blockSize) {
      blockList.push({
        x,
        y,
        startFrame: random(25, 45),
        endFrame: random(51, 75),
        superpositionT: 0,
        wavePhase: random(TWO_PI),
        probAmplitude: random(0.5, 1)
      });
    }
  }

  for (let block of blockList) {
    if (currentFrame <= block.endFrame) {
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

      let offsetX = 0, offsetY = 0;
      if (currentFrame >= 1) {
        offsetX += cachedNoise(x * 0.1 + currentFrame * 0.05, y * 0.1, 0) * 5 - 2.5;
        offsetY += cachedNoise(y * 0.1 + currentFrame * 0.05, x * 0.1, 0) * 5 - 2.5;
      }
      if (currentFrame >= block.startFrame) {
        let waveOffset = sin(currentFrame * 0.05 + block.wavePhase) * 20 * block.probAmplitude;
        offsetX += waveOffset * cos(block.wavePhase);
        offsetY += waveOffset * sin(block.wavePhase);
      }
      let canvasX = x + (width - img.width) / 2 + offsetX;
      let canvasY = y + (height - img.height) / 2 + offsetY;

      // Вероятностное облако
      if (currentFrame >= block.startFrame) {
        let probDensity = block.probAmplitude * 150;
        fill(r, g, b, probDensity);
        noStroke();
        ellipse(canvasX, canvasY, size * 3, size * 3);
      }
      let colorShift = sin(currentFrame * 0.02 + block.wavePhase) * 20;
      fill(r + colorShift, g + colorShift, b + colorShift, 255);
      stroke(r + colorShift, g + colorShift, b + colorShift, 100);
      strokeWeight(1);
      rect(canvasX, canvasY, size, size);

      // Тройная экспозиция
      if (currentFrame >= block.startFrame) {
        for (let i = 0; i < 2; i++) {
          if (random() < 0.5) {
            fill(r + colorShift, g + colorShift, b + colorShift, 100);
            stroke(r + colorShift, g + colorShift, b + colorShift, 50);
            strokeWeight(0.5);
            let superX = canvasX + random(-30, 30);
            let superY = canvasY + random(-30, 30);
            let pulse = sin(currentFrame * 0.1 + block.wavePhase) * 5;
            rect(superX + pulse, superY + pulse, size, size);
          }
        }
      }
    }
  }
  return blockList;
}

function draw() {
  if (!window.img || !window.img.width) return;

  window.frame++;
  window.chaosTimer += 0.016;
  window.chaosFactor = map(sin(window.frame * 0.01), -1, 1, 0.3, 1) * (window.weirdnessFactor || 0.5);

  if (window.chaosTimer > 5) {
    window.chaosTimer = 0;
    updateBoundary();
    window.mouseInfluenceRadius = random(100, 200);
    window.noiseScale = random(0.02, 0.04);
  }

  // Фоновое дыхание
  let bgColor = 20 + 30 * sin(window.frame * 0.01);
  background(bgColor);
  window.trailBuffer.clear();

  push();
  translate(width / 2, height / 2);
  scale(window.scaleFactor);
  translate(-width / 2, -height / 2);
  let blockList = [];
  if (window.frame <= 75) {
    blockList = renderTransformingPortrait(window.img, window.frame);
    if (window.frame === 51) {
      initializeParticles(blockList);
    }
  }
  pop();

  if (window.quantumStates.length === 0 && window.frame > 75) return;

  let backgroundParticles = window.particles.filter(p => p.layer === 'background');
  for (let particle of backgroundParticles) {
    let state = window.quantumStates[window.particles.indexOf(particle)];
    let noiseVal = cachedNoise(particle.baseX * window.noiseScale, particle.baseY * window.noiseScale, window.frame * 0.01);
    particle.offsetX = sin(particle.phase) * 15 * noiseVal;
    particle.offsetY = cos(particle.phase) * 15 * noiseVal;
    particle.phase += 0.03;
    renderParticle(particle, state);
  }

  let mainParticles = window.particles.filter(p => p.layer === 'main');
  for (let particle of mainParticles) {
    let state = window.quantumStates[window.particles.indexOf(particle)];
    updateParticle(particle, state);
    renderParticle(particle, state);
  }

  image(window.trailBuffer, 0, 0);
}

function initializeParticles(blockList) {
  window.particles = [];
  window.quantumStates = [];
  const maxBlockSize = 16;
  let maxParticles = windowWidth < 768 ? 1500 : 3000;
  let particleCount = 0;
  let imgCenterX = window.img.width / 2 + (width - window.img.width) / 2;
  let imgCenterY = window.img.height / 2 + (height - window.img.height) / 2;

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
    if (brightnessVal > 10 && particleCount < maxParticles) {
      let blockCenterX_canvas = x + (width - window.img.width) / 2 + maxBlockSize / 2;
      let blockCenterY_canvas = y + (height - window.img.height) / 2 + maxBlockSize / 2;
      let layer = random() < 0.2 ? 'background' : 'main';
      let shapeType = floor(random(4));
      let targetSize = random(1, 20);
      let superposition = random() < 0.1;
      let timeAnomaly = random() < 0.05;
      let angle = atan2(blockCenterY_canvas - imgCenterY, blockCenterX_canvas - imgCenterX) + random(-PI / 6, PI / 6);
      window.particles.push({
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
        shapeType: shapeType,
        sides: shapeType === 2 ? floor(random(5, 13)) : 0,
        tunneled: false,
        tunnelTargetX: 0,
        tunnelTargetY: 0,
        superposition: superposition,
        timeAnomaly: timeAnomaly,
        timeDirection: timeAnomaly ? random([-1, 1]) : 1,
        uncertainty: random(0.5, 2),
        wavePhase: block.wavePhase,
        radialAngle: angle,
        radialDistance: 0,
        targetRadialDistance: random(50, 100),
        superpositionT: 0,
        probAmplitude: random(0.5, 1),
        barrier: random() < 0.1 ? { x: random(width), y: random(height), width: 20, height: 100 } : null,
        speed: random(0.8, 1.2) // Индивидуальный темп
      });
      particleCount++;
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
  let noiseX = cachedNoise(particle.chaosSeed + window.frame * 0.03, 0, 0) * 2 - 1;
  let noiseY = cachedNoise(0, particle.chaosSeed + window.frame * 0.03, 0) * 2 - 1;

  // Суперпозиция во время перехода
  if (window.frame >= particle.startFrame - 25 && window.frame <= particle.startFrame) {
    particle.superpositionT = map(window.frame, particle.startFrame - 25, particle.startFrame, 0, 1);
  } else if (window.frame > particle.startFrame) {
    particle.superpositionT = 1;
  }

  // Колебания в паузе
  if (window.isPaused) {
    particle.offsetX += sin(window.frame * 0.01 + particle.phase) * 0.5;
    particle.offsetY += cos(window.frame * 0.01 + particle.phase) * 0.5;
  }

  // Квантовые эффекты
  if (particle.superpositionT >= 1) {
    // Неопределённость Гейзенберга
    particle.offsetX += noiseX * particle.uncertainty * 10 * particle.probAmplitude * particle.speed;
    particle.offsetY += noiseY * particle.uncertainty * 10 * particle.probAmplitude * particle.speed;
    particle.size = particle.targetSize * (1 + 0.3 * sin(window.frame * 0.06 + particle.phase));

    // Интерференция
    let waveOffset = sin(window.frame * 0.05 + particle.wavePhase) * 20 * particle.probAmplitude;
    particle.offsetX += waveOffset * cos(particle.wavePhase);
    particle.offsetY += waveOffset * sin(particle.wavePhase);

    // Вихри вероятности
    if (particle.superposition) {
      particle.offsetX += cos(window.frame * 0.02 + particle.wavePhase) * 2;
      particle.offsetY += sin(window.frame * 0.02 + particle.wavePhase) * 2;
    }

    // Туннелирование
    if (particle.barrier && random() < 0.02 && !particle.tunneled) {
      let distToBarrier = dist(particle.x, particle.y, particle.barrier.x, particle.barrier.y);
      if (distToBarrier < 50) {
        particle.tunneled = true;
        particle.tunnelTargetX = particle.barrier.x + particle.barrier.width + random(-20, 20);
        particle.tunnelTargetY = particle.y + random(-20, 20);
        // Туннельные сполохи
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
        }, 500);
      }
    }

    // Временные аномалии
    let breakupT = map(window.frame, particle.startFrame, particle.startFrame + 175, 0, 1);
    breakupT = constrain(breakupT, 0, 1);
    if (particle.timeAnomaly) {
      breakupT += particle.timeDirection * 0.02 * sin(window.frame * 0.05);
      breakupT = constrain(breakupT, 0, 1);
    }
    let easedT = easeOutQuad(breakupT);

    // Радиальный разлёт
    particle.size = lerp(particle.size, particle.targetSize, easedT);
    let noiseAngle = cachedNoise(particle.chaosSeed + window.frame * 0.02, 0, 0) * PI / 6;
    let angle = particle.radialAngle + noiseAngle;
    particle.radialDistance = lerp(particle.radialDistance, particle.targetRadialDistance, easedT);
    particle.offsetX = cos(angle) * particle.radialDistance;
    particle.offsetY = sin(angle) * particle.radialDistance;
  }

  // Измерение через мышь
  let d = dist(mouseX, mouseY, particle.x + particle.offsetX, particle.y + particle.offsetY);
  let influence = d < window.mouseInfluenceRadius ? map(d, 0, window.mouseInfluenceRadius, 1, 0) : 0;
  if (influence > 0.5 && !window.isPaused && particle.superposition && !state.collapsed) {
    state.collapsed = true;
    particle.superposition = false;
    particle.shapeType = random() < 0.5 ? floor(random(4)) : particle.shapeType;
    particle.uncertainty = 0;
    particle.probAmplitude = 1;
    // Световые кольца при измерении
    window.trailBuffer.noFill();
    for (let i = 0; i < 5; i++) {
      window.trailBuffer.stroke(state.r, state.g, state.b, 255 - i * 51);
      window.trailBuffer.strokeWeight(1);
      window.trailBuffer.ellipse(particle.x + particle.offsetX, particle.y + particle.offsetY, 20 + i * 10);
    }
    // Намёк на многомировую интерпретацию
    if (random() < 0.1) {
      window.trailBuffer.stroke(255, 255, 255, 100);
      window.trailBuffer.line(particle.x + particle.offsetX, particle.y + particle.offsetY, mouseX, mouseY);
    }
  }
  if (influence > 0 && !window.isPaused) {
    let repelAngle = atan2(particle.y + particle.offsetY - mouseY, particle.x + particle.offsetX - mouseX);
    particle.offsetX += cos(repelAngle) * 15 * influence;
    particle.offsetY += sin(repelAngle) * 15 * influence;
  }

  // Границы
  if (!isPointInBoundary(particle.x + particle.offsetX, particle.y + particle.offsetY)) {
    let nearestPoint = window.boundaryPoints.reduce((closest, p) => {
      let distToP = dist(particle.x + particle.offsetX, particle.y + particle.offsetY, p.x, p.y);
      return distToP < closest.dist ? { x: p.x, y: p.y, dist: distToP } : closest;
    }, { x: 0, y: 0, dist: Infinity });
    particle.offsetX = nearestPoint.x - particle.x;
    particle.offsetY = nearestPoint.y - particle.y;
  }

  // Следы интерференции
  if (particle.layer === 'main' && window.frame >= particle.startFrame && particle.superpositionT >= 1 && random() < 0.5) {
    let probDensity = particle.probAmplitude * 300;
    window.trailBuffer.fill(state.r, state.g, state.b, probDensity);
    window.trailBuffer.noStroke();
    window.trailBuffer.ellipse(particle.x + particle.offsetX, particle.y + particle.offsetY, particle.size / 2, particle.size / 2);
  }

  particle.phase += 0.02 * particle.speed;
}

function renderParticle(particle, state) {
  push();
  translate(particle.x + particle.offsetX, particle.y + particle.offsetY);
  let colorShift = sin(window.frame * 0.02 + particle.wavePhase) * 20;
  stroke(state.r + colorShift, state.g + colorShift, state.b + colorShift, 255);
  strokeWeight(1);
  fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, 255);
  drawingContext.shadowBlur = 0;

  let size = particle.size;
  let waveDistort = 0.3 * sin(window.frame * 0.07 + particle.wavePhase);

  // Вероятностное облако
  if (particle.superposition && !state.collapsed) {
    let probDensity = particle.probAmplitude * 150;
    fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, probDensity);
    noStroke();
    ellipse(0, 0, size * 4, size * 4);
    // Отражения в мирах
    for (let i = 0; i < 2; i++) {
      if (random() < 0.5) {
        fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, 100);
        stroke(state.r + colorShift, state.g + colorShift, state.b + colorShift, 50);
        strokeWeight(0.5);
        let superX = random(-30, 30);
        let superY = random(-30, 30);
        let pulse = sin(window.frame * 0.1 + particle.wavePhase) * 5;
        ellipse(superX + pulse, superY + pulse, size * 0.5);
      }
    }
  }

  // Отрисовка частиц
  if (particle.superpositionT < 1) {
    fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, 255);
    stroke(state.r + colorShift, state.g + colorShift, state.b + colorShift, 100);
    strokeWeight(1);
    rect(-size / 2, -size / 2, size, size);
    for (let i = 0; i < 2; i++) {
      if (random() < 0.5) {
        fill(state.r + colorShift, state.g + colorShift, state.b + colorShift, 100);
        stroke(state.r + colorShift, state.g + colorShift, state.b + colorShift, 50);
        strokeWeight(0.5);
        let superX = random(-30, 30);
        let superY = random(-30, 30);
        let pulse = sin(window.frame * 0.1 + particle.wavePhase) * 5;
        rect(superX + pulse - size / 2, superY + pulse - size / 2, size, size);
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
        let r = size * (0.8 + 0.2 * cos(a * 3 + window.frame * 0.02 + waveDistort));
        vertex(r * cos(a), r * sin(a));
      }
      endShape(CLOSE);
    } else {
      beginShape();
      for (let a = 0; a < TWO_PI; a += TWO_PI / 20) {
        let r = size * (0.7 + 0.3 * cachedNoise(a * 2 + particle.chaosSeed, window.frame * 0.01, 0) + waveDistort);
        vertex(r * cos(a), r * sin(a));
      }
      endShape(CLOSE);
    }
  }

  // Потенциальный барьер
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
