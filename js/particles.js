let particles = [];
let quantumStates = [];
let canvas;
let img = null;
let frame = 0;
let isPaused = false;
let blockBreakupT = 0;
let noiseScale = 0.03;
let neonColors = [
  [0, 255, 255],
  [255, 0, 255],
  [255, 105, 180],
  [0, 255, 0],
  [255, 255, 0],
  [128, 0, 128]
];
let mouseInfluenceRadius = 150;
let chaosFactor = 0;
let boundaryPoints = [];
let chaosTimer = 0;
let isCanvasReady = false;

export function setImage(image) {
  img = image;
  if (img && img.width && img.height) {
    console.log('Image set with dimensions:', img.width, img.height);
    initializeParticles(); // Инициализируем частицы сразу после установки изображения
  } else {
    console.error('Invalid image provided to setImage');
    img = null;
  }
}

export function getCanvas() {
  return canvas;
}

export function setupParticles() {
  canvas = createCanvas(windowWidth * 0.7, windowHeight * 0.6);
  canvas.parent('canvasContainer4');
  pixelDensity(1);
  frameRate(25);
  noLoop();
  canvas.elt.style.display = 'none';

  canvas.elt.addEventListener('click', function() {
    if (currentStep === 5) {
      isPaused = !isPaused;
      if (isPaused) {
        noLoop();
        document.getElementById('saveButton').style.display = 'block';
      } else {
        loop();
        document.getElementById('saveButton').style.display = 'none';
      }
    }
  });

  canvas.elt.addEventListener('touchmove', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    mouseX = touch.clientX - canvas.elt.offsetLeft;
    mouseY = touch.clientY - canvas.elt.offsetTop;
  }, { passive: false });

  window.addEventListener('resize', () => {
    resizeCanvas(windowWidth * 0.7, windowHeight * 0.6);
    updateBoundary();
  });

  updateBoundary();
  isCanvasReady = true;
}

export function drawParticles() {
  if (!img || !img.width || !img.height) {
    console.warn('Image not available for rendering:', img);
    return;
  }

  frame += 1;
  chaosTimer += 0.016;
  chaosFactor = map(sin(frame * 0.01), -1, 1, 0.3, 1) * weirdnessFactor;

  if (chaosTimer > 5) {
    chaosTimer = 0;
    updateBoundary();
    mouseInfluenceRadius = random(100, 200);
    noiseScale = random(0.02, 0.05);
  }

  background(0);

  if (frame === 10 && particles.length === 0) {
    initializeParticles();
  }

  if (quantumStates.length === 0) return;

  if (frame <= 250) {
    blockBreakupT = frame < 100 ? 0 : map(frame, 100, 250, 0, 1);
    blockBreakupT = easeOutQuad(blockBreakupT);
  }

  let backgroundParticles = particles.filter(p => p.layer === 'background');
  for (let i = 0; i < backgroundParticles.length; i++) {
    let particle = backgroundParticles[i];
    let state = quantumStates[particles.indexOf(particle)];
    let noiseVal = cachedNoise(particle.baseX * noiseScale, particle.baseY * noiseScale, frame * 0.02);
    particle.offsetX = sin(particle.phase) * 20 * noiseVal;
    particle.offsetY = cos(particle.phase) * 20 * noiseVal;
    particle.phase += 0.02;
    renderParticle(particle, state);
  }

  let mainParticles = particles.filter(p => p.layer === 'main');
  if (random() < 0.5) {
    for (let i = 0; i < mainParticles.length; i++) {
      let particle = mainParticles[i];
      let state = quantumStates[particles.indexOf(particle)];
      if (state.entangledWith !== null) {
        let entangledParticle = particles[state.entangledWith];
        let alpha = 30 * (0.5 + 0.5 * sin(frame * 0.05));
        stroke(neonColors[floor(random(neonColors.length))][0], neonColors[floor(random(neonColors.length))][1], neonColors[floor(random(neonColors.length))][2], alpha);
        strokeWeight(0.3);
        line(particle.x + particle.offsetX, particle.y + particle.offsetY, entangledParticle.x + entangledParticle.offsetX, entangledParticle.y + entangledParticle.offsetY);
      }
    }
  }

  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];
    let state = quantumStates[i];
    if (particle.layer === 'background') continue;

    updateParticle(particle, state);
    renderParticle(particle, state);
  }
}

function initializeParticles() {
  if (!img || !img.width || !img.height) {
    console.error('Cannot initialize particles: image is not loaded');
    return;
  }

  particles = [];
  quantumStates = [];
  let blockSize = 16;
  let maxParticles = windowWidth < 768 ? 1500 : 3000;
  let particleCount = 0;

  img.loadPixels();
  console.log('Image dimensions after loadPixels:', img.width, img.height);
  for (let y = 0; y < img.height; y += blockSize) {
    for (let x = 0; x < img.width; x += blockSize) {
      let pixelX = constrain(x, 0, img.width - 1);
      let pixelY = constrain(y, 0, img.height - 1);
      let col = img.get(pixelX, pixelY);
      let brightnessVal = brightness(col);
      if (brightnessVal > 10 && particleCount < maxParticles) {
        let canvasX = x + (width - img.width) / 2;
        let canvasY = y + (height - img.height) / 2;
        let distFromCenter = dist(canvasX, canvasY, width / 2, height / 2);
        let angle = atan2(canvasY - height / 2, canvasX - width / 2);
        let explodeDist = distFromCenter * (0.5 + 0.5 * noise(x * 0.01, y * 0.01));
        let targetX = canvasX + cos(angle) * explodeDist * 0.5;
        let targetY = canvasY + sin(angle) * explodeDist * 0.5;
        let layer = random() < 0.2 ? 'background' : 'main';
        let chaosSeed = random(1000);
        let numSubParticles = random(4, 8);
        for (let i = 0; i < numSubParticles; i++) {
          let offsetX = (random() - 0.5) * blockSize;
          let offsetY = (random() - 0.5) * blockSize;
          particles.push({
            x: canvasX + offsetX,
            y: canvasY + offsetY,
            baseX: canvasX,
            baseY: canvasY,
            targetX: targetX + offsetX,
            targetY: targetY + offsetY,
            origX: canvasX + offsetX,
            origY: canvasY + offsetY,
            offsetX: 0,
            offsetY: 0,
            size: blockSize / numSubParticles,
            targetSize: blockSize / numSubParticles,
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
            transitionT: 0,
            blockSize: blockSize
          });
          particleCount++;
          if (particleCount >= maxParticles) break;
        }
      }
      if (particleCount >= maxParticles) break;
    }
  }

  console.log('Created particles:', particles.length);
  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];
    let pixelX = constrain(Math.floor(particle.gridX), 0, img.width - 1);
    let pixelY = constrain(Math.floor(particle.gridY), 0, img.height - 1);
    let col = img.get(pixelX, pixelY);
    let entangledIndex = null;
    if (random() < 0.15 && particle.layer === 'main') {
      let potentialPartners = particles.filter((p, idx) => idx !== i && !p.entangledWith && p.layer === 'main');
      if (potentialPartners.length > 0) {
        let partner = random(potentialPartners);
        entangledIndex = particles.indexOf(partner);
        partner.entangledWith = i;
      }
    }
    quantumStates[i] = {
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
  let influence = d < mouseInfluenceRadius ? map(d, 0, mouseInfluenceRadius, 1, 0) : 0;

  let noiseX = cachedNoise(particle.chaosSeed + frame * 0.03, 0, 0) * 2 - 1;
  let noiseY = cachedNoise(0, particle.chaosSeed + frame * 0.03, 0) * 2 - 1;
  let baseOffsetX = noiseX * 30 * chaosFactor;
  let baseOffsetY = noiseY * 30 * chaosFactor;

  if (frame <= 250) {
    let breakupT = blockBreakupT;
    particle.x = lerp(particle.origX, particle.targetX, breakupT);
    particle.y = lerp(particle.origY, particle.targetY, breakupT);
    particle.size = lerp(particle.blockSize, particle.targetSize, breakupT);
    particle.alpha = lerp(255, particle.targetAlpha, breakupT);
    state.a = particle.alpha;
    particle.offsetX = noiseX * 10 * (1 - breakupT);
    particle.offsetY = noiseY * 10 * (1 - breakupT);
    particle.transitionT = breakupT;
  } else {
    let motionOffsetX = 0;
    let motionOffsetY = 0;
    if (particle.motionMode === 0) {
      motionOffsetX = noiseX * 20;
      motionOffsetY = noiseY * 20;
    } else if (particle.motionMode === 1) {
      let radius = 10 + chaosFactor * 20;
      motionOffsetX = cos(frame * 0.05 + particle.phase) * radius;
      motionOffsetY = sin(frame * 0.05 + particle.phase) * radius;
    } else {
      let angle = atan2(particle.y - height / 2, particle.x - width / 2);
      let distToCenter = dist(particle.x, particle.y, width / 2, height / 2);
      motionOffsetX = -sin(angle) * distToCenter * 0.05 * chaosFactor;
      motionOffsetY = cos(angle) * distToCenter * 0.05 * chaosFactor;
    }

    particle.offsetX = baseOffsetX + motionOffsetX;
    particle.offsetY = baseOffsetY + motionOffsetY;

    if (influence > 0 && !isPaused) {
      let repelAngle = atan2(particle.y + particle.offsetY - mouseY, particle.x + particle.offsetX - mouseX);
      particle.offsetX += cos(repelAngle) * 20 * influence;
      particle.offsetY += sin(repelAngle) * 20 * influence;
    }

    if (!isPointInBoundary(particle.x + particle.offsetX, particle.y + particle.offsetY)) {
      let nearestPoint = boundaryPoints.reduce((closest, p) => {
        let distToP = dist(particle.x + particle.offsetX, particle.y + particle.offsetY, p.x, p.y);
        return distToP < closest.dist ? { x: p.x, y: p.y, dist: distToP } : closest;
      }, { x: 0, y: 0, dist: Infinity });
      particle.offsetX = nearestPoint.x - particle.x;
      particle.offsetY = nearestPoint.y - particle.y;
    }
  }

  particle.glitchTimer--;
  if (particle.glitchTimer <= 0 && !isPaused) {
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
    }, 100);
  }
}

function renderParticle(particle, state) {
  let x = particle.x + particle.offsetX;
  let y = particle.y + particle.offsetY;
  let size = particle.size;
  let alpha = particle.alpha;
  fill(state.r, state.g, state.b, alpha);
  noStroke();
  if (particle.transitionT < 0.5) {
    rect(x - size / 2, y - size / 2, size, size);
  } else {
    ellipse(x, y, size, size);
  }
}

function updateBoundary() {
  boundaryPoints = [];
  let numPoints = 20;
  for (let i = 0; i < numPoints; i++) {
    let angle = TWO_PI * i / numPoints;
    let radius = (width / 2) * (0.7 + 0.3 * noise(i * 0.1, frame * 0.01));
    boundaryPoints.push({
      x: width / 2 + cos(angle) * radius,
      y: height / 2 + sin(angle) * radius
    });
  }
}

function isPointInBoundary(x, y) {
  let inside = false;
  for (let i = 0, j = boundaryPoints.length - 1; i < boundaryPoints.length; j = i++) {
    let xi = boundaryPoints[i].x, yi = boundaryPoints[i].y;
    let xj = boundaryPoints[j].x, yj = boundaryPoints[j].y;
    let intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function cachedNoise(x, y, z) {
  return noise(x, y, z);
}

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}