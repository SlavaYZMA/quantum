window.initializeParticles = function() {
  if (!window.img || !window.p5Canvas || !window.isCanvasReady || !window.p5Instance) {
    console.warn('Cannot initialize particles: image, canvas, or p5 instance not ready');
    return;
  }

  console.log('Initializing particles with image');
  window.particles = [];
  window.img.loadPixels();
  const d = window.p5Instance.pixelDensity();
  const stepSize = window.simplifyAnimations ? 10 : 5;

  try {
    for (let y = 0; y < window.img.height; y += stepSize) {
      for (let x = 0; x < window.img.width; x += stepSize) {
        const index = (x * d + y * d * window.img.width) * 4;
        const r = window.img.pixels[index];
        const g = window.img.pixels[index + 1];
        const b = window.img.pixels[index + 2];
        const a = window.img.pixels[index + 3];

        if (a > 128) {
          const scaledX = window.p5Instance.map(x, 0, window.img.width, 0, window.p5Instance.width);
          const scaledY = window.p5Instance.map(y, 0, window.img.height, 0, window.p5Instance.height);
          window.particles.push({
            x: scaledX,
            y: scaledY,
            vx: window.p5Instance.random(-1, 1),
            vy: window.p5Instance.random(-1, 1),
            size: window.p5Instance.random(2, 5),
            color: [r, g, b],
            alpha: 255,
            quantumPhase: window.p5Instance.random(window.p5Instance.TWO_PI)
          });
        }
      }
    }
    console.log(`Created ${window.particles.length} particles`);
  } catch (e) {
    console.error('Error initializing particles:', e);
  }
};

function updateParticles() {
  if (window.isPaused) return;

  console.log('Updating particles');
  window.particles.forEach(p => {
    const dx = window.cursorX - p.x;
    const dy = window.cursorY - p.y;
    const distance = window.p5Instance.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      const force = 50 / (distance + 1);
      p.vx += (dx / distance) * force * 0.01;
      p.vy += (dy / distance) * force * 0.01;
      p.alpha = window.p5Instance.constrain(p.alpha - 5, 0, 255);
    }

    p.quantumPhase += 0.05;
    p.vx += window.p5Instance.sin(p.quantumPhase) * 0.1 * (window.weirdnessFactor || 1);
    p.vy += window.p5Instance.cos(p.quantumPhase) * 0.1 * (window.weirdnessFactor || 1);

    p.x += p.vx;
    p.y += p.vy;

    p.x = window.p5Instance.constrain(p.x, 0, window.p5Instance.width);
    p.y = window.p5Instance.constrain(p.y, 0, window.p5Instance.height);

    p.vx *= 0.98;
    p.vy *= 0.98;
  });
}

window.draw = function() {
  if (!window.p5Instance) {
    console.warn('p5 instance not ready, skipping draw');
    return;
  }

  window.p5Instance.background(0);

  if (!window.simplifyAnimations) {
    updateParticles();
  }

  window.particles.forEach(p => {
    window.p5Instance.fill(p.color[0], p.color[1], p.color[2], p.alpha);
    window.p5Instance.noStroke();
    window.p5Instance.ellipse(p.x, p.y, p.size, p.size);
  });

  if (window.isPaused) {
    document.getElementById('saveButton').style.display = 'block';
  } else {
    document.getElementById('saveButton').style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Обработчик движения мыши для cursorX и cursorY
  document.addEventListener('mousemove', (e) => {
    window.cursorX = e.clientX;
    window.cursorY = e.clientY;
  });

  // Обработчик клика для паузы
  document.addEventListener('click', () => {
    if (window.currentStep === 4 || window.currentStep === 5) {
      window.isPaused = !window.isPaused;
      if (window.isPaused) {
        window.p5Instance.noLoop();
        document.getElementById('saveButton').style.display = 'block';
        console.log('Animation paused');
      } else {
        window.p5Instance.loop();
        document.getElementById('saveButton').style.display = 'none';
        console.log('Animation resumed');
      }
    }
  });
});
