// particles.js

window.frame = 0;
window.isPaused = false;
window.particles = [];
window.quantumStates = [];
window.canvas = null;
window.isCanvasReady = false;
window.neonColors = [
  [0, 255, 255],
  [255, 0, 255],
  [255, 105, 180],
  [0, 255, 0],
  [255, 255, 0],
  [128, 0, 128]
];
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

  if (window.frame === 10) {
    initializeParticles();
  }

  if (window.quantumStates.length === 0) return;

  let backgroundParticles = window.particles.filter(p => p.layer === 'background');
  for (let i = 0; i < backgroundParticles.length; i++) {
    let particle = backgroundParticles[i];
    let state = window.quantumStates[window.particles.indexOf(particle)];
    let noiseVal = cachedNoise(particle.baseX * window.noiseScale, particle.baseY * window.noiseScale, window.frame * 0.02);
    particle.offsetX = sin(particle.phase) * 20 * noiseVal;
    particle.offsetY = cos(particle.phase) * 20 * noiseVal;
    particle.phase += 0.02;
    renderParticle(particle, state);
  }

  let mainParticles = window.particles.filter(p => p.layer === 'main');
  if (random() < 0.5) {
    for (let i = 0; i < mainParticles.length; i++) {
      let particle = mainParticles[i];
      let state = window.quantumStates[window.particles.indexOf(particle)];
      if (state.entangledWith !== null) {
        let entangledParticle = window.particles[state.entangledWith];
        let alpha = 30 * (0.5 + 0.5 * sin(window.frame * 0.05));
        stroke(window.neonColors[floor(random(window.neonColors.length))][0], window.neonColors[floor(random(window.neonColors.length))][1], window.neonColors[floor(random(window.neonColors.length))][2], alpha);
        strokeWeight(0.3);
        line(particle.x + particle.offsetX, particle.y + particle.offsetY, entangledParticle.x + entangledParticle.offsetX, entangledParticle.y + entangledParticle.offsetY);
      }
    }
  }

  for (let i = 0; i < window.particles.length; i++) {
    let particle = window.particles[i];
    let state = window.quantumStates[i];
    if (particle.layer === 'background') continue;

    updateParticle(particle, state);
    renderParticle(particle, state);
  }
}

function initializeParticles() {
  window.particles = [];
  window.quantumStates = [];
  const blockSize = 16; // Размер блока мозаики 16x16
  let gridSize = 4; // Размер шага для частиц внутри блока
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
        // Вычисление центра блока 16x16
        let block_i = Math.floor(x / blockSize);
        let block_j = Math.floor(y / blockSize);
        let blockCenterX_img = (block_i * blockSize) + (blockSize / 2);
        let blockCenterY_img = (block_j * blockSize) + (blockSize / 2);
        let blockCenterX_canvas = blockCenterX_img + (width - window.img.width) / 2;
        let blockCenterY_canvas = blockCenterY_img + (height - window.img.height) / 2;
        let canvasX = x + (width - window.img.width) / 2;
        let canvasY = y + (height - window.img.height) / 2;
        let distFromCenter = dist(canvasX, canvasY, width / 2, height / 2);
        let angle = atan2(canvasY - height / 2, canvasX - width / 2);
        let explodeDist = distFromCenter * (0.5 + 0.5 * noise(x * 0.01, y * 0.01));
        let targetX = canvasX + cos(angle) * explodeDist * 0.5;
        let targetY = canvasY + sin(angle) * explodeDist * 0.5;
        let layer = random() < 0.2 ? 'background' : 'main';
        let chaosSeed = random(1000);
        window.particles.push({
          x: blockCenterX_canvas, // Начальная позиция в центре блока
          y: blockCenterY_canvas,
          baseX: canvasX,
          baseY: canvasY,
          targetX: targetX,
          targetY: targetY,
          origX: blockCenterX_canvas, // Исходная позиция для анимации
          origY: blockCenterY_canvas,
          offsetX: 0,
          offsetY: 0,
          size: blockSize, // Начальный размер 16
          targetSize: gridSize, // Целевой размер 4
          phase: random(TWO_PI),
          entangledWith: null,
          gridX: x,
          gridY: y,
          shapeType: 0,
          targetShapeType: 0,
          shapeMorphT: 0,
          wavePhase: random(TWO_PI),
          waveInfluence: 0,
          baseColor: [red(col), green(col), blue(col)],
          tunneled: false,
          tunnelTargetX: 0,
          tunnelTargetY: 0,
          tunnelReturnSpeed: 0.05,
          layer: layer,
          zDepth: random(0.7, 1.3),
          chaosSeed: chaosSeed,
          glitchTimer: random(50, 200),
          glitchActive: false,
          rotation: 0,
          motionMode: floor(random(3)),
          colorNoise: random(1000),
          alpha: 255,
          targetAlpha: 255,
          transitionT: 0
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
    let entangledIndex = null;
    if (random() < 0.15 && particle.layer === 'main') {
      let potentialPartners = window.particles.filter((p, idx) => idx !== i && !p.entangledWith && p.layer === 'main');
      if (potentialPartners.length > 0) {
        let partner = random(potentialPartners);
        entangledIndex = window.particles.indexOf(partner);
        partner.entangledWith = i;
      }
    }
    window.quantumStates[i] = {
      r: red(col),
      g: green(col),
      b: blue(col),
      a: 255,
      baseR: red(col),
      baseG: green(col),
      baseB: blue(col),
      superpositionStates: [
        { r: random(255), g: random(255), b: random(255) },
        { r: random(255), g: random(255), b: random(255) }
      ],
      collapsed: false,
      entangledWith: entangledIndex,
      phase: random(TWO_PI),
      amplitude: random(20, 40),
      brightColor: null,
      colorNoise: random(1000)
    };
  }
}

function updateParticle(particle, state) {
  let d = dist(mouseX, mouseY, particle.x + particle.offsetX, particle.y + particle.offsetY);
  let influence = d < window.mouseInfluenceRadius ? map(d, 0, window.mouseInfluenceRadius, 1, 0) : 0;

  let noiseX = cachedNoise(particle.chaosSeed + window.frame * 0.03, 0, 0) * 2 - 1;
  let noiseY = cachedNoise(0, particle.chaosSeed + window.frame * 0.03, 0) * 2 - 1;
  let baseOffsetX = noiseX * 30 * window.chaosFactor;
  let baseOffsetY = noiseY * 30 * window.chaosFactor;

  if (window.frame <= 150) {
    let breakupT = window.frame < 50 ? 0 : map(window.frame, 50, 150, 0, 1);
    let easedT = easeOutQuad(breakupT);
    particle.x = lerp(particle.origX, particle.targetX, easedT);
    particle.y = lerp(particle.origY, particle.targetY, easedT);
    particle.size = lerp(particle.size, particle.targetSize, easedT);
    particle.alpha = lerp(255, particle.targetAlpha, easedT);
    state.a = particle.alpha;
    particle.offsetX = noiseX * 10 * (1 - easedT);
    particle.offsetY = noiseY * 10 * (1 - easedT);
    particle.transitionT = easedT;
  } else {
    let motionOffsetX = 0;
    let motionOffsetY = 0;
    if (particle.motionMode === 0) {
      motionOffsetX = noiseX * 20;
      motionOffsetY = noiseY * 20;
    } else if (particle.motionMode === 1) {
      let radius = 10 + window.chaosFactor * 20;
      motionOffsetX = cos(window.frame * 0.05 + particle.phase) * radius;
      motionOffsetY = sin(window.frame * 0.05 + particle.phase) * radius;
    } else {
      let angle = atan2(particle.y - height / 2, particle.x - width / 2);
      let distToCenter = dist(particle.x, particle.y, width / 2, height / 2);
      motionOffsetX = -sin(angle) * distToCenter * 0.05 * window.chaosFactor;
      motionOffsetY = cos(angle) * distToCenter * 0.05 * window.chaosFactor;
    }

    particle.offsetX = baseOffsetX + motionOffsetX;
    particle.offsetY = baseOffsetY + motionOffsetY;

    if (influence > 0 && !window.isPaused) {
      let repelAngle = atan2(particle.y + particle.offsetY - mouseY, particle.x + particle.offsetX - mouseX);
      particle.offsetX += cos(repelAngle) * 20 * influence;
      particle.offsetY += sin(repelAngle) * 20 * influence;
    }

    if (!isPointInBoundary(particle.x + particle.offsetX, particle.y + particle.offsetY)) {
      let nearestPoint = window.boundaryPoints.reduce((closest, p) => {
        let distToP = dist(particle.x + particle.offsetX, particle.y + particle.offsetY, p.x, p.y);
        return distToP < closest.dist ? { x: p.x, y: p.y, dist: distToP } : closest;
      }, { x: 0, y: 0, dist: Infinity });
      particle.offsetX = nearestPoint.x - particle.x;
      particle.offsetY = nearestPoint.y - particle.y;
    }
  }

  particle.glitchTimer--;
  if (particle.glitchTimer <= 0 && !window.isPaused) {
    particle.glitchActive = true;
    particle.glitchTimer = random(50, 200);
    if (random() < 0.3) particle.size *= random(2, 5);
    if (random() < 0.2) {
      particle.x = random(width);
      particle.y = random(height);
    }
    if (random() < 0.4) particle.rotation += random(-PI, PI);
    setTimeout(() => {
      particle.glitchActive = false;
      particle.size = constrain(particle.size / 2, 2, 10);
    }, random(500, 1000));
  }

  if (random() < 0.05 + influence * 0.1 && !window.isPaused) {
    particle.targetShapeType = floor(random(5));
    particle.shapeMorphT = 0;
  }
  particle.shapeMorphT = min(particle.shapeMorphT + 0.05, 1);

  let colorNoiseVal = cachedNoise(state.colorNoise + window.frame * 0.05, 0, 0);
  if (random() < 0.1 + influence * 0.2 && !window.isPaused) {
    if (random() < 0.6 && !state.collapsed) {
      let newState = random(state.superpositionStates);
      state.r = newState.r;
      state.g = newState.g;
      state.b = newState.b;
    } else if (random() < 0.05) {
      state.brightColor = random(window.neonColors);
    }
  } else if (random() < 0.03 && state.brightColor && !window.isPaused) {
    state.brightColor = null;
  }

  if (d < 50 && !state.collapsed && !window.isPaused) {
    state.collapsed = true;
    let chosenState = random(state.superpositionStates);
    state.r = chosenState.r;
    state.g = chosenState.g;
    state.b = chosenState.b;

    if (state.entangledWith !== null) {
      let entangledState = window.quantumStates[state.entangledWith];
      if (!entangledState.collapsed) {
        entangledState.collapsed = true;
        entangledState.r = chosenState.r;
        entangledState.g = chosenState.g;
        entangledState.b = chosenState.b;
      }
    }
  }

  if (!state.collapsed) {
    let colorT = colorNoiseVal;
    state.r = lerp(state.superpositionStates[0].r, state.superpositionStates[1].r, colorT);
    state.g = lerp(state.superpositionStates[0].g, state.superpositionStates[1].g, colorT);
    state.b = lerp(state.superpositionStates[0].b, state.superpositionStates[1].b, colorT);
  }

  particle.rotation += 0.02 * window.chaosFactor;
  particle.phase += 0.03;
}

function renderParticle(particle, state) {
  push();
  translate(particle.x + particle.offsetX, particle.y + particle.offsetY);
  rotate(particle.rotation);
  noStroke();
  let alpha = state.a * (0.7 + 0.3 * cachedNoise(particle.chaosSeed + window.frame * 0.05, 0, 0));
  if (state.brightColor) {
    fill(state.brightColor[0], state.brightColor[1], state.brightColor[2], alpha);
  } else {
    fill(state.r, state.g, state.b, alpha);
  }

  if (particle.layer === 'main' && window.frame <= 150) {
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = `rgba(${state.brightColor ? state.brightColor[0] : state.r}, ${state.brightColor ? state.brightColor[1] : state.g}, ${state.brightColor ? state.brightColor[2] : state.b}, 0.7)`;
  }

  let size = particle.size * (1 + 0.2 * sin(window.frame * 0.05 + particle.phase));
  let morphT = particle.shapeMorphT;
  let shapeType = particle.shapeType;
  let targetShapeType = particle.targetShapeType;

  if (morphT < 1 && shapeType !== targetShapeType) {
    let t = easeOutQuad(morphT);
    if (shapeType === 0 && targetShapeType === 1) {
      rect(0, 0, size * (1 - t), size * (1 - t));
      ellipse(0, 0, size * t, size * t);
    } else if (shapeType === 0 && targetShapeType === 2) {
      rect(0, 0, size * (1 - t), size * (1 - t));
      beginShape();
      for (let a = 0; a < TWO_PI; a += PI / 3) {
        let r = size * t * (0.5 + 0.5 * cos(a * 3));
        vertex(r * cos(a), r * sin(a));
      }
      endShape(CLOSE);
    } else if (shapeType === 1 && targetShapeType === 0) {
      ellipse(0, 0, size * (1 - t), size * (1 - t));
      rect(0, 0, size * t, size * t);
    } else if (shapeType === 1 && targetShapeType === 2) {
      ellipse(0, 0, size * (1 - t), size * (1 - t));
      beginShape();
      for (let a = 0; a < TWO_PI; a += PI / 3) {
        let r = size * t * (0.5 + 0.5 * cos(a * 3));
        vertex(r * cos(a), r * sin(a));
      }
      endShape(CLOSE);
    } else if (shapeType === 2 && targetShapeType === 0) {
      beginShape();
      for (let a = 0; a < TWO_PI; a += PI / 3) {
        let r = size * (1 - t) * (0.5 + 0.5 * cos(a * 3));
        vertex(r * cos(a), r * sin(a));
      }
      endShape(CLOSE);
      rect(0, 0, size * t, size * t);
    } else if (shapeType === 2 && targetShapeType === 1) {
      beginShape();
      for (let a = 0; a < TWO_PI; a += PI / 3) {
        let r = size * (1 - t) * (0.5 + 0.5 * cos(a * 3));
        vertex(r * cos(a), r * sin(a));
      }
      endShape(CLOSE);
      ellipse(0, 0, size * t, size * t);
    }
  } else {
    if (shapeType === 0) {
      rect(0, 0, size, size);
    } else if (shapeType === 1) {
      ellipse(0, 0, size, size);
    } else if (shapeType === 2) {
      beginShape();
      for (let a = 0; a < TWO_PI; a += PI / 3) {
        let r = size * (0.5 + 0.5 * cos(a * 3));
        vertex(r * cos(a), r * sin(a));
      }
      endShape(CLOSE);
    }
  }

  pop();
}
