window.frame = 0;
window.isPaused = false;
window.particles = [];
window.isCanvasReady = false;
window.maxParticles = 500; // Ещё больше уменьшено

function renderTransformingPortrait() {
  if (!window.img || !window.img.width) return [];
  if (!window.img.pixels.length) window.img.loadPixels(); // Загружаем пиксели один раз
  let blockList = [];
  let blockSize = 16;
  for (let y = 0; y < window.img.height; y += blockSize) {
    for (let x = 0; x < window.img.width; x += blockSize) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = 0; dy < blockSize && y + dy < window.img.height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < window.img.width; dx++) {
          let col = window.img.get(x + dx, y + dy);
          r += window.p5Instance.red(col);
          g += window.p5Instance.green(col);
          b += window.p5Instance.blue(col);
          count++;
        }
      }
      if (count > 0) {
        r = r / count * 2;
        g = g / count * 2;
        b = b / count * 2;
        r = window.p5Instance.constrain(r, 0, 255);
        g = window.p5Instance.constrain(g, 0, 255);
        b = window.p5Instance.constrain(b, 0, 255);
      }
      let canvasX = x + (window.p5Instance.width - window.img.width) / 2;
      let canvasY = y + (window.p5Instance.height - window.img.height) / 2;
      window.p5Instance.fill(r, g, b, 255);
      window.p5Instance.noStroke();
      window.p5Instance.rect(canvasX, canvasY, blockSize, blockSize);
      blockList.push({ x, y });
    }
  }
  return blockList;
}

window.initializeParticles = function(blockList) {
  if (!window.img || !window.p5Canvas || !window.isCanvasReady) return;
  window.particles = [];
  let particleCount = 0;
  for (let i = 0; i < blockList.length && particleCount < window.maxParticles; i++) {
    let block = blockList[i];
    let x = block.x + (window.p5Instance.width - window.img.width) / 2 + 8;
    let y = block.y + (window.p5Instance.height - window.img.height) / 2 + 8;
    window.particles.push({
      x, y, baseX: x, baseY: y, size: 8, alpha: 255,
      color: window.img.get(block.x, block.y)
    });
    particleCount++;
  }
};

function updateParticle(particle) {
  if (window.isPaused) return;
  particle.x += window.p5Instance.random(-0.5, 0.5); // Меньшее смещение
  particle.y += window.p5Instance.random(-0.5, 0.5);
}

function renderParticle(particle) {
  if (window.isPaused) return;
  let col = particle.color;
  window.p5Instance.fill(window.p5Instance.red(col), window.p5Instance.green(col), window.p5Instance.blue(col), 255);
  window.p5Instance.noStroke();
  window.p5Instance.ellipse(particle.x, particle.y, particle.size, particle.size);
}

window.draw = function() {
  if (!window.isCanvasReady || !window.p5Instance) return;
  window.frame++;
  window.p5Instance.background(255); // Белый фон
  if (window.currentStep === 3 && window.img) {
    let blockList = renderTransformingPortrait();
    if (window.particles.length === 0) {
      window.initializeParticles(blockList); // Инициализация сразу
    }
  } else if (window.currentStep >= 4 && window.particles.length > 0) {
    window.p5Instance.background(255);
    for (let i = 0; i < window.particles.length; i++) {
      updateParticle(window.particles[i]);
      renderParticle(window.particles[i]);
    }
  }
};
