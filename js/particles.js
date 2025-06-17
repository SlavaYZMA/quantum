let particles = [];
let quantumStates = [];
let compressionProgress = 0;
let compressionTargets = [];
let isCompressionComplete = false;
let gridSize; // Добавлена как глобальная переменная

function initializeCompressionParticles(img) {
  particles = [];
  quantumStates = [];
  compressionTargets = [];
  let initialSize = 256;
  let targetSize = 16;
  gridSize = initialSize / targetSize; // Инициализация gridSize

  // Инициализация начального изображения 256x256
  img.resize(initialSize, initialSize);
  img.loadPixels();

  // Создание списка всех целевых блоков 16x16
  for (let y = 0; y < targetSize; y++) {
    for (let x = 0; x < targetSize; x++) {
      compressionTargets.push({ x: x * gridSize, y: y * gridSize, active: false, startTime: null });
    }
  }
  shuffleArray(compressionTargets); // Случайный порядок активации блоков

  // Инициализация частиц для начального изображения
  for (let y = 0; y < initialSize; y += 1) {
    for (let x = 0; x < initialSize; x += 1) {
      let col = img.get(x, y);
      let brightnessVal = brightness(col);
      if (brightnessVal > 10) {
        particles.push({
          x: x,
          y: y,
          origX: x,
          origY: y,
          targetX: null,
          targetY: null,
          size: 1,
          targetSize: 1,
          offsetX: 0,
          offsetY: 0,
          phase: random(TWO_PI),
          color: col,
          alpha: 255,
          compressionTarget: null
        });
      }
    }
  }

  // Назначение каждой частице целевого блока для сжатия
  let targetIndex = 0;
  for (let particle of particles) {
    if (targetIndex < compressionTargets.length) {
      particle.compressionTarget = compressionTargets[targetIndex];
      targetIndex++;
    }
  }
}

function updateCompression(frame) {
  if (!isCompressionComplete && compressionProgress < 1) {
    compressionProgress = min((frame - 25) / 150, 1); // Сжатие занимает 150 кадров (6 секунд при 25 FPS)

    // Активация блоков по частям
    let activeTargets = floor(compressionProgress * compressionTargets.length);
    for (let i = 0; i < compressionTargets.length; i++) {
      if (i < activeTargets && !compressionTargets[i].active) {
        compressionTargets[i].active = true;
        compressionTargets[i].startTime = frame;
      }
    }

    // Обновление позиций частиц
    for (let particle of particles) {
      if (particle.compressionTarget && particle.compressionTarget.active) {
        let t = (frame - particle.compressionTarget.startTime) / 50; // 2 секунды на сжатие каждого блока
        if (t < 1) {
          let easeT = t * t * (3 - 2 * t); // Плавная интерполяция
          particle.targetX = lerp(particle.origX, particle.compressionTarget.x + gridSize / 2, easeT);
          particle.targetY = lerp(particle.origY, particle.compressionTarget.y + gridSize / 2, easeT);
          particle.size = lerp(1, gridSize / 4, easeT); // Размер частиц уменьшается
        } else {
          particle.x = particle.targetX;
          particle.y = particle.targetY;
          particle.size = gridSize / 4;
        }
      }
    }

    if (compressionProgress >= 1) {
      isCompressionComplete = true;
      initializeQuantumParticles(); // Переход к квантовому состоянию
    }
  }
}

function initializeQuantumParticles() {
  let targetSize = 16;
  let gridSize = 256 / targetSize; // Переопределение для квантовых частиц

  // Пересоздание частиц для 16x16
  particles = [];
  quantumStates = [];
  for (let y = 0; y < targetSize; y++) {
    for (let x = 0; x < targetSize; x++) {
      let centerX = x * gridSize + gridSize / 2;
      let centerY = y * gridSize + gridSize / 2;
      let avgColor = [0, 0, 0];
      let count = 0;

      // Средний цвет для каждого блока 16x16
      for (let py = y * gridSize; py < (y + 1) * gridSize; py++) {
        for (let px = x * gridSize; px < (x + 1) * gridSize; px++) {
          let col = img.get(px, py);
          avgColor[0] += red(col);
          avgColor[1] += green(col);
          avgColor[2] += blue(col);
          count++;
        }
      }
      avgColor[0] /= count;
      avgColor[1] /= count;
      avgColor[2] /= count;

      particles.push({
        x: centerX,
        y: centerY,
        origX: centerX,
        origY: centerY,
        targetX: centerX,
        targetY: centerY,
        size: gridSize / 4,
        targetSize: gridSize / 4,
        offsetX: 0,
        offsetY: 0,
        phase: random(TWO_PI),
        color: color(avgColor[0], avgColor[1], avgColor[2]),
        alpha: 255,
        shapeType: floor(random(5)),
        targetShapeType: floor(random(5)),
        shapeMorphT: 0,
        motionMode: floor(random(3)),
        explosionT: 0
      });

      quantumStates.push({
        superpositionStates: [
          { r: random(255), g: random(255), b: random(255) },
          { r: random(255), g: random(255), b: random(255) }
        ],
        collapsed: false,
        phase: random(TWO_PI),
        amplitude: random(20, 40),
        colorNoise: random(1000)
      });
    }
  }
}

function updateQuantumParticles(frame, chaosFactor) {
  if (isCompressionComplete) {
    let explosionProgress = min((frame - 175) / 150, 1); // Взрыв начинается после сжатия (150 + 25 кадров)

    for (let i = 0; i < particles.length; i++) {
      let particle = particles[i];
      let state = quantumStates[i];

      // Оживление: изменение формы и размера
      if (explosionProgress < 0.5) {
        let t = explosionProgress * 2;
        particle.size = lerp(particle.targetSize, particle.targetSize * random(1, 3), t);
        particle.shapeMorphT = t;
        if (random() < 0.1) particle.targetShapeType = floor(random(5));
      }

      // Разлет и растворение
      if (explosionProgress >= 0.5) {
        let t = (explosionProgress - 0.5) * 2;
        let angle = random(TWO_PI);
        let dist = t * 200 * chaosFactor;
        particle.targetX = particle.origX + cos(angle) * dist;
        particle.targetY = particle.origY + sin(angle) * dist;
        particle.size = lerp(particle.size, 1, t);
        particle.alpha = lerp(255, 0, t);

        // Генерация мелких частиц
        if (random() < 0.02 && particle.size > 2) {
          let subParticle = {
            x: particle.x,
            y: particle.y,
            targetX: particle.x + random(-50, 50),
            targetY: particle.y + random(-50, 50),
            size: particle.size / 2,
            alpha: 255,
            life: 100
          };
          particles.push(subParticle);
        }
      }

      // Обновление позиции
      particle.x = lerp(particle.x, particle.targetX, 0.05);
      particle.y = lerp(particle.y, particle.targetY, 0.05);

      // Цветовая суперпозиция
      let colorNoiseVal = noise(state.colorNoise + frame * 0.05);
      if (!state.collapsed && random() < 0.1) {
        let newState = random(state.superpositionStates);
        state.r = newState.r;
        state.g = newState.g;
        state.b = newState.b;
      }
      particle.color = lerpColor(particle.color, color(random(state.r, state.g, state.b)), 0.1);
    }

    // Удаление мелких частиц с истекшим сроком жизни
    particles = particles.filter(p => p.life === undefined || --p.life > 0);
  }
}

function drawParticles() {
  noStroke();
  for (let particle of particles) {
    fill(particle.color, particle.alpha);
    push();
    translate(particle.x, particle.y);
    let size = particle.size * (1 + 0.2 * sin(frameCount * 0.05));
    if (particle.shapeMorphT < 1 && particle.targetShapeType !== particle.shapeType) {
      drawMixedShape(particle.shapeType, particle.targetShapeType, size, particle.shapeMorphT);
    } else {
      drawShape(particle.targetShapeType, size);
    }
    pop();
  }
}

function drawShape(shapeType, size) {
  switch (shapeType) {
    case 0: rect(-size / 2, -size / 2, size, size); break;
    case 1: ellipse(0, 0, size, size); break;
    case 2: triangle(0, -size / 2, size / 2, size / 2, -size / 2, size / 2); break;
    case 3:
      beginShape();
      for (let a = 0; a < TWO_PI; a += PI / 5) vertex(cos(a) * size / 2, sin(a) * size / 2);
      endShape(CLOSE);
      break;
    case 4:
      beginShape();
      let sides = floor(random(5, 8));
      for (let a = 0; a < TWO_PI; a += TWO_PI / sides) vertex(cos(a) * size / 2, sin(a) * size / 2);
      endShape(CLOSE);
      break;
  }
}

function drawMixedShape(shapeType, targetShapeType, size, t) {
  let mixedSize = lerp(size, size * 0.8, t);
  if (shapeType === 0 && targetShapeType === 1) ellipse(0, 0, mixedSize, mixedSize);
  else if (shapeType === 0 && targetShapeType === 2) triangle(0, -mixedSize / 2, mixedSize / 2, mixedSize / 2, -mixedSize / 2, mixedSize / 2);
  else drawShape(targetShapeType, mixedSize);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}