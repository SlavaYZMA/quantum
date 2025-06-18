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

// Функция для рендеринга мозаики по частям
function renderPartialMosaic(img, blockSize, currentFrame) {
  img.loadPixels();
  let blockList = [];
  for (let y = 0; y < img.height; y += blockSize) {
    for (let x = 0; x < img.width; x += blockSize) {
      blockList.push({ x, y, startFrame: random(50, 90) });
    }
  }
  blockList.sort((a, b) => a.startFrame - b.startFrame);
  let totalBlocks = blockList.length;
  let activeBlocks = map(currentFrame, 50, 100, 0.1 * totalBlocks, totalBlocks);
  activeBlocks = constrain(floor(activeBlocks), 0, totalBlocks);

  for (let i = 0; i < activeBlocks; i++) {
    let block = blockList[i];
    if (currentFrame >= block.startFrame) {
      let x = block.x;
      let y = block.y;
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = 0; dy < blockSize && y + dy < img.height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < img.width; dx++) {
          let col = img.get(x + dx, y + dy);
          r += red(col);
          g += green(col);
          b += blue(col);
          count++;
        }
      }
      if (count > 0) {
        r /= count;
        g /= count;
        b /= count;
      }
      let alpha = map(currentFrame, block.startFrame, block.startFrame + 10, 0, 255);
      alpha = constrain(alpha, 0, 255);
      fill(r, g, b, alpha);
      noStroke();
      rect(x + (width - img.width) / 2, y + (height - img.height) / 2, blockSize, blockSize);
    }
  }
}

function draw() {
  if (!window.img || !window.img.width) return;

  window.frame += 1;
  window.chaosTimer += 0.016;
  window.chaosFactor = map(sin(window.frame * 0.01), -1, 1, 0.3, 1) * window.weirdnessFactor;

  if (window.chaosTimer > 5) {
    window.chaosTimer = 0;
    updateBoundary();
    window.mouseInfluenceRadius = random(100, 200);
    window.noiseScale = random(0.02, 0.05);
  }

  background(0);

  if (window.frame <= 100) {
    let portraitAlpha = 0;
    if (window.frame <= 50) {
      portraitAlpha = map(window.frame, 1, 50, 0, 255);
      image(window.img, (width - window.img.width) / 2, (height - window.img.height) / 2, window.img.width, window.img.height);
      tint(255, portraitAlpha);
    } else {
      portraitAlpha = map(window.frame, 50, 100, 255, 0);
      image(window.img, (width - window.img.width) / 2, (height - window.img.height) / 2, window.img.width, window.img.height);
      tint(255, portraitAlpha);
      renderPartialMosaic(window.img, 16, window.frame);
    }
    noTint();
  } else if (window.frame === 101) {
    initializeParticles();
  }

  if (window.quantumStates.length === 0) return;

  let backgroundParticles = window.particles.filter(p => p.layer === 'background');
  for (let i = 0; i < backgroundParticles.length; i++) {
    let particle = backgroundParticles[i];
    let state = window.quantumStates[window.particles.indexOf(particle)];
    let noiseVal = cachedNoise(particle.baseX * window.noiseScale, particle.baseY * window.noiseScale, window.frame * 0.02);
    particle.offsetX = sin(particle.phase) * 10 * noiseVal; // Уменьшено движение фона
    particle.offsetY = cos(particle.phase) * 10 * noiseVal;
    particle.phase += 0.02;
    renderParticle(particle, state);
  }

  let mainParticles = window.particles.filter(p => p.layer === 'main');
  for (let i = 0; i < mainParticles.length; i++) {
    let particle = mainParticles[i];
    let state = window.quantumStates[window.particles.indexOf(particle)];
    updateParticle(particle, state);
    renderParticle(particle, state);
  }
}

function initializeParticles() {
  window.particles = [];
  window.quantumStates = [];
  const blockSize = 16;
  let gridSize = 4;
  let maxParticles = windowWidth < 768 ? 1500 : 3000;
  let particleCount = 0;

  window.img.loadPixels();
  for (let y = 0; y < window.img.height; y += gridSize) {
    for (let x = 0; x < window.img.width; x += gridSize) {
      let pixelX = constrain(x, 0, window.img.width - 1);
      let pixelY = constrain(y, 0, window.img.height - 1);
      let col = window.img.get(pixelX, pixelY);
      let brightnessVal = brightness(col);
      if (brightnessVal > 10 && particleCount < maxParticles) {
        let block_i = Math.floor(x / blockSize);
        let block_j = Math.floor(y / blockSize);
        let blockCenterX_img = (block_i * blockSize) + (blockSize / 2);
        let blockCenterY_img = (block_j * blockSize) + (blockSize / 2);
        let blockCenterX_canvas = blockCenterX_img + (width - window.img.width) / 2;
        let blockCenterY_canvas = blockCenterY_img + (height - window.img.height) / 2;
        let layer = random() < 0.2 ? 'background' : 'main';
        let targetSize = random() < 0.5 ? 2 : 4;
        window.particles.push({
          x: blockCenterX_canvas,
          y: blockCenterY_canvas,
          baseX: blockCenterX_canvas,
          baseY: blockCenterY_canvas,
          offsetX: 0,
          offsetY: 0,
          size: blockSize,
          targetSize: targetSize,
          phase: random(TWO_PI),
          gridX: x,
          gridY: y,
          layer: layer,
          chaosSeed: random(1000),
          alpha: 255,
          startFrame: random(100, 300), // Волнообразный распад
          localOffsetMax: 10 // Минимальное смещение
        });
        particleCount++;
      }
    }
  }

  for (let i = 0; i < window.particles.length; i++) {
    let particle = window.particles[i];
    let pixelX = constrain(Math.floor(particle.gridX), 0, window.img.width - 1);
    let pixelY = constrain(Math.floor(particle.gridY), 0, window.img.height - 1);
    let col = window.img.get(pixelX, pixelY);
    let muteFactor = random() < 0.5 ? 0.8 : 1.0; // Случайное приглушение
    window.quantumStates[i] = {
      r: red(col) * muteFactor,
      g: green(col) * muteFactor,
      b: blue(col) * muteFactor,
      a: 255
    };
  }
}

function updateParticle(particle, state) {
  let noiseX = cachedNoise(particle.chaosSeed + window.frame * 0.02, 0, 0) * 2 - 1;
  let noiseY = cachedNoise(0, particle.chaosSeed + window.frame * 0.02, 0) * 2 - 1;

  if (window.frame <= 400 && window.frame >= particle.startFrame) {
    let breakupT = map(window.frame, particle.startFrame, particle.startFrame + 300, 0, 1);
    breakupT = constrain(breakupT, 0, 1);
    let easedT = easeOutQuad(breakupT);
    // Минимальное смещение с затуханием
    particle.offsetX = noiseX * particle.localOffsetMax * (1 - easedT);
    particle.offsetY = noiseY * particle.localOffsetMax * (1 - easedT);
    particle.size = lerp(particle.size, particle.targetSize, easedT);
    state.a = lerp(0, 255, easedT); // Плавное появление
  } else if (window.frame > 400) {
    // Статичное состояние
    particle.offsetX = 0;
    particle.offsetY = 0;
  }

  // Влияние мыши
  let d = dist(mouseX, mouseY, particle.x + particle.offsetX, particle.y + particle.offsetY);
  let influence = d < window.mouseInfluenceRadius ? map(d, 0, window.mouseInfluenceRadius, 0.5, 0) : 0;
  if (influence > 0 && !window.isPaused && window.frame > 400) {
    let repelAngle = atan2(particle.y + particle.offsetY - mouseY, particle.x + particle.offsetX - mouseX);
    particle.offsetX += cos(repelAngle) * 10 * influence;
    particle.offsetY += sin(repelAngle) * 10 * influence;
  }

  // Границы
  if (!isPointInBoundary(particle.x + particle.offsetX, particle.y + particle.offsetY) && window.frame > 400) {
    let nearestPoint = window.boundaryPoints.reduce((closest, p) => {
      let distToP = dist(particle.x + particle.offsetX, particle.y + particle.offsetY, p.x, p.y);
      return distToP < closest.dist ? { x: p.x, y: p.y, dist: distToP } : closest;
    }, { x: 0, y: 0, dist: Infinity });
    particle.offsetX = nearestPoint.x - particle.x;
    particle.offsetY = nearestPoint.y - particle.y;
  }
}

function renderParticle(particle, state) {
  push();
  translate(particle.x + particle.offsetX, particle.y + particle.offsetY);
  noStroke();
  fill(state.r, state.g, state.b, state.a);
  rect(0, 0, particle.size, particle.size); // Только квадраты
  pop();
}
