// particles.js

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

  // Создаём буфер для следов
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

// Функция для рендеринга трансформации портрета
function renderTransformingPortrait(img, currentFrame) {
  img.loadPixels();
  let blockList = [];
  let maxBlockSize = 16;
  let blockSize = map(currentFrame, 1, 100, 1, maxBlockSize);
  blockSize = constrain(blockSize, 1, maxBlockSize);

  for (let y = 0; y < img.height; y += blockSize) {
    for (let x = 0; x < img.width; x += blockSize) {
      blockList.push({
        x,
        y,
        startFrame: random(51, 90),
        endFrame: random(101, 150),
        superpositionT: 0,
        wavePhase: random(TWO_PI)
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
        r = min(r / count * 1.1, 255); // Увеличение насыщенности
        g = min(g / count * 1.1, 255);
        b = min(b / count * 1.1, 255);
      }

      // Эффекты трансформации
      let alpha = 255;
      let offsetX = 0, offsetY = 0;
      if (currentFrame >= 1) {
        // Дрожание (неопределённость)
        offsetX += cachedNoise(x * 0.1 + currentFrame * 0.03, y * 0.1, 0) * 2 - 1;
        offsetY += cachedNoise(y * 0.1 + currentFrame * 0.03, x * 0.1, 0) * 2 - 1;
      }
      if (currentFrame >= block.startFrame) {
        // Мерцание
        alpha = map(cachedNoise(x * 0.1 + currentFrame * 0.05, y * 0.1, 0), 0, 1, 200, 255);
        // Волновые смещения
        let waveOffset = sin(currentFrame * 0.03 + block.wavePhase) * 10;
        offsetX += waveOffset * cos(block.wavePhase);
        offsetY += waveOffset * sin(block.wavePhase);
      }
      if (currentFrame >= block.endFrame - 50) {
        block.superpositionT = map(currentFrame, block.endFrame - 50, block.endFrame, 0, 1);
        block.superpositionT = constrain(block.superpositionT, 0, 1);
        // Полупрозрачность
        alpha *= (1 - 0.5 * block.superpositionT);
      }
      let canvasX = x + (width - img.width) / 2 + offsetX;
      let canvasY = y + (height - img.height) / 2 + offsetY;

      // Основной блок/пиксель
      fill(r, g, b, alpha);
      stroke(r, g, b, 50); // Лёгкий контур
      strokeWeight(0.5);
      rect(canvasX, canvasY, size, size);

      // Двойная экспозиция (суперпозиция)
      if (currentFrame >= block.startFrame && random() < 0.3) {
        fill(r, g, b, alpha * 0.7);
        stroke(r, g, b, 30);
        strokeWeight(0.5);
        let superX = canvasX + random(-20, 20);
        let superY = canvasY + random(-20, 20);
        rect(superX, superY, size, size);
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

  // Очистка канвы
  background(0);

  // Затухание следов в буфере
  window.trailBuffer.fill(0, 0, 0, 20);
  window.trailBuffer.rect(0, 0, width, height);

  let blockList = [];
  if (window.frame <= 150) {
    blockList = renderTransformingPortrait(window.img, window.frame);
    if (window.frame === 101) {
      initializeParticles(blockList);
    }
  }

  if (window.quantumStates.length === 0 && window.frame > 150) return;

  // Рендеринг фона
  let backgroundParticles = window.particles.filter(p => p.layer === 'background');
  for (let particle of backgroundParticles) {
    let state = window.quantumStates[window.particles.indexOf(particle)];
    let noiseVal = cachedNoise(particle.baseX * window.noiseScale, particle.baseY * window.noiseScale, window.frame * 0.01);
    particle.offsetX = sin(particle.phase) * 15 * noiseVal;
    particle.offsetY = cos(particle.phase) * 15 * noiseVal;
    particle.phase += 0.03;
    renderParticle(particle, state);
  }

  // Рендеринг основных частиц
  let mainParticles = window.particles.filter(p => p.layer === 'main');
  for (let particle of mainParticles) {
    let state = window.quantumStates[window.particles.indexOf(particle)];
    updateParticle(particle, state);
    renderParticle(particle, state);
  }

  // Отрисовка буфера следов
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
        superpositionT: 0
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
      r: min((isMonochrome ? gray : red(col)) * 1.1, 255),
      g: min((isMonochrome ? gray : green(col)) * 1.1, 255),
      b: min((isMonochrome ? gray : blue(col)) * 1.1, 255),
      a: 200,
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
  if (window.frame >= particle.startFrame - 50 && window.frame <= particle.startFrame) {
    particle.superpositionT = map(window.frame, particle.startFrame - 50, particle.startFrame, 0, 1);
  } else if (window.frame > particle.startFrame) {
    particle.superpositionT = 1;
  }

  // Квантовые эффекты
  if (particle.superpositionT >= 1) {
    // Неопределённость Гейзенберга
    particle.offsetX += noiseX * particle.uncertainty * 5;
    particle.offsetY += noiseY * particle.uncertainty * 5;
    state.a = map(cachedNoise(particle.chaosSeed + window.frame * 0.05, 0, 0), 0, 1, 200, 255);
    particle.size = particle.targetSize * (1 + 0.2 * sin(window.frame * 0.04 + particle.phase));

    // Интерференция
    let waveOffset = sin(window.frame * 0.03 + particle.wavePhase) * 10;
    particle.offsetX += waveOffset * cos(particle.wavePhase);
    particle.offsetY += waveOffset * sin(particle.wavePhase);

    // Туннелирование
    if (random() < 0.02 && !particle.tunneled) {
      particle.tunneled = true;
      particle.tunnelTargetX = particle.x + random(-200, 200);
      particle.tunnelTargetY = particle.y + random(-200, 200);
      state.a = 100;
      setTimeout(() => {
        particle.tunneled = false;
        particle.x = particle.tunnelTargetX;
        particle.y = particle.tunnelTargetY;
        state.a = 200;
      }, 500);
    }

    // Временные аномалии
    let breakupT = map(window.frame, particle.startFrame, particle.startFrame + 350, 0, 1);
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
    state.a = lerp(0, 200, easedT);
  }

  // Влияние мыши (измерение)
  let d = dist(mouseX, mouseY, particle.x + particle.offsetX, particle.y + particle.offsetY);
  let influence = d < window.mouseInfluenceRadius ? map(d, 0, window.mouseInfluenceRadius, 0.5, 0) : 0;
  if (influence > 0 && !window.isPaused && particle.superposition && !state.collapsed) {
    state.collapsed = true;
    particle.superposition = false;
    particle.shapeType = random() < 0.5 ? floor(random(4)) : particle.shapeType;
    particle.uncertainty = 0;
    // Волновой фронт в буфере
    window.trailBuffer.noFill();
    window.trailBuffer.stroke(state.r, state.g, state.b, 150);
    window.trailBuffer.strokeWeight(1);
    window.trailBuffer.ellipse(particle.x + particle.offsetX, particle.y + particle.offsetY, 50, 50);
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

  // Следы в буфере
  if (particle.layer === 'main' && window.frame >= particle.startFrame && particle.superpositionT >= 1 && random() < 0.3) {
    window.trailBuffer.fill(state.r, state.g, state.b, 15);
    window.trailBuffer.noStroke();
    window.trailBuffer.ellipse(particle.x + particle.offsetX, particle.y + particle.offsetY, particle.size / 4, particle.size / 4);
  }

  particle.phase += 0.02;
}

function renderParticle(particle, state) {
  push();
  translate(particle.x + particle.offsetX, particle.y + particle.offsetY);
  stroke(state.r * 1.1, state.g * 1.1, state.b * 1.1, 100); // Контур частиц
  strokeWeight(0.5);
  fill(state.r, state.g, state.b, state.a);

  // Усиленное свечение
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = `rgba(${state.r}, ${state.g}, ${state.b}, 0.5)`;

  let size = particle.size;

  // Волновое искажение
  let waveDistort = 0.2 * sin(window.frame * 0.05 + particle.wavePhase);

  // Отрисовка в фазе перехода
  if (particle.superpositionT < 1) {
    // Рендеринг как блок
    fill(state.r * 1.1, state.g * 1.1, state.b * 1.1, state.a * (1 - 0.5 * particle.superpositionT));
    stroke(state.r * 1.1, state.g * 1.1, state.b * 1.1, 50);
    strokeWeight(0.5);
    rect(-size / 2, -size / 2, size, size);
    // Двойная экспозиция (суперпозиция)
    if (random() < 0.3) {
      fill(state.r * 1.1, state.g * 1.1, state.b * 1.1, state.a * 0.7 * (1 - 0.5 * particle.superpositionT));
      stroke(state.r * 1.1, state.g * 1.1, state.b * 1.1, 30);
      strokeWeight(0.5);
      let superX = random(-20, 20);
      let superY = random(-20, 20);
      rect(superX - size / 2, superY - size / 2, size, size);
    }
  } else {
    // Отрисовка квантовых форм
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

    // Суперпозиция
    if (particle.superposition && !state.collapsed) {
      fill(state.r * 1.1, state.g * 1.1, state.b * 1.1, state.a * 0.7);
      stroke(state.r * 1.1, state.g * 1.1, state.b * 1.1, 100);
      strokeWeight(0.5);
      for (let i = 0; i < 2; i++) {
        let offsetX = random(-20, 20);
        let offsetY = random(-20, 20);
        push();
        translate(offsetX, offsetY);
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
        pop();
      }
    }
  }

  pop();
}
