```javascript
// particles.js

window.draw = function() {
  if (!window.isCanvasReady || !window.img || window.currentStep < 4) {
    return;
  }

  background(0); // Чёрный фон

  // Если анимация не упрощена, обновляем частицы
  if (!window.simplifyAnimations) {
    updateParticles();
  }

  // Отрисовка частиц
  window.particles.forEach(p => {
    fill(p.color[0], p.color[1], p.color[2], p.alpha);
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
  });

  // Если пауза включена, показываем кнопку сохранения
  if (window.isPaused) {
    document.getElementById('saveButton').style.display = 'block';
  }
};

// Инициализация частиц на основе изображения
window.initializeParticles = function() {
  if (!window.img || !window.p5Canvas) return;

  window.particles = [];
  window.img.loadPixels();
  const d = pixelDensity();
  const stepSize = window.simplifyAnimations ? 10 : 5;

  for (let y = 0; y < window.img.height; y += stepSize) {
    for (let x = 0; x < window.img.width; x += stepSize) {
      const index = (x * d + y * d * window.img.width) * 4;
      const r = window.img.pixels[index];
      const g = window.img.pixels[index + 1];
      const b = window.img.pixels[index + 2];
      const a = window.img.pixels[index + 3];

      if (a > 128) { // Игнорируем прозрачные пиксели
        const scaledX = map(x, 0, window.img.width, 0, width);
        const scaledY = map(y, 0, window.img.height, 0, height);
        window.particles.push({
          x: scaledX,
          y: scaledY,
          vx: random(-1, 1),
          vy: random(-1, 1),
          size: random(2, 5),
          color: [r, g, b],
          alpha: 255,
          quantumPhase: random(TWO_PI)
        });
      }
    }
  }
};

// Обновление частиц с влиянием курсора
function updateParticles() {
  if (window.isPaused) return;

  window.particles.forEach(p => {
    // Влияние курсора
    const dx = window.cursorX - p.x;
    const dy = window.cursorY - p.y;
    const distance = sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      const force = 50 / (distance + 1);
      p.vx += (dx / distance) * force * 0.01;
      p.vy += (dy / distance) * force * 0.01;
      p.alpha = constrain(p.alpha - 5, 0, 255);
    }

    // Квантовая фаза
    p.quantumPhase += 0.05;
    p.vx += sin(p.quantumPhase) * 0.1 * window.weirdnessFactor;
    p.vy += cos(p.quantumPhase) * 0.1 * window.weirdnessFactor;

    // Обновление позиции
    p.x += p.vx;
    p.y += p.vy;

    // Границы холста
    p.x = constrain(p.x, 0, width);
    p.y = constrain(p.y, 0, height);

    // Сопротивление
    p.vx *= 0.98;
    p.vy *= 0.98;
  });
}

// Переинициализация частиц при загрузке нового изображения
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('imageInput').addEventListener('change', () => {
    if (window.uploadedImageUrl) {
      setTimeout(() => {
        if (window.img) initializeParticles();
      }, 1000); // Даём время на загрузку изображения
    }
  });
});

// Пауза/возобновление анимации при клике
document.addEventListener('click', () => {
  if (window.currentStep === 4 || window.currentStep === 5) {
    window.isPaused = !window.isPaused;
    if (window.isPaused) {
      noLoop();
      document.getElementById('saveButton').style.display = 'block';
    } else {
      loop();
      document.getElementById('saveButton').style.display = 'none';
    }
  }
});
```
