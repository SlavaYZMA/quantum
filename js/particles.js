window.frame = 0;
window.isPaused = false;
window.particles = [];
window.isCanvasReady = false;
window.maxParticles = 300; // Ещё больше уменьшено

function renderTransformingPortrait() {
  if (!window.img || !window.img.width) {
    console.warn('No image or invalid image width');
    return [];
  }
  if (!window.img.pixels.length) window.img.loadPixels(); // Один раз
  let blockList = [];
  let blockSize = 16;
  let pixels = window.img.pixels; // Используем массив пикселей
  for (let y = 0; y < window.img.height; y += blockSize) {
    for (let x = 0; x < window.img.width; x += blockSize) {
      let i = (y * window.img.width + x) * 4;
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = 0; dy < blockSize && y + dy < window.img.height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < window.img.width; dx++) {
          let idx = ((y + dy) * window.img.width + (x + dx)) * 4;
          r += pixels[idx];
          g += pixels[idx + 1];
          b += pixels[idx + 2];
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
      blockList.push({ x, y, color: [r, g, b] });
    }
  }
  console.log('Rendered portrait with', blockList.length, 'blocks');
  return blockList;
}

window.initializeParticles = function(blockList) {
  if (!window.img || !window.p5Canvas || !window.isCanvasReady) {
    console.warn('Cannot initialize particles');
    return;
  }
  window.particles = [];
  let particleCount = 0;
  for (let i = 0; i < blockList.length && particleCount < window.maxParticles; i++) {
    let block = blockList[i];
    let x = block.x + (window.p5Instance.width - window.img.width) / 2 + 8;
    let y = block.y + (window.p5Instance.height - window.img.height) / 2 + 8;
    window.particles.push({
      x, y, baseX: x, baseY: y, size: 8, alpha: 255, color: block.color
    });
    particleCount++;
  }
  console.log('Initialized', particleCount, 'particles');
};

function updateParticle(particle) {
  if (window.isPaused) return;
  particle.x += window.p5Instance.random(-0.3, 0.3); // Ещё меньше смещение
  particle.y += window.p5Instance.random(-0.3, 0.3);
}

function renderParticle(particle) {
  if (window.isPaused) return;
  window.p5Instance.fill(particle.color[0], particle.color[1], particle.color[2], 255);
  window.p5Instance.noStroke();
  window.p5Instance.ellipse(particle.x, particle.y, particle.size, particle.size);
}

window.draw = function() {
  if (!window.isCanvasReady || !window.p5Instance) return;
  window.frame++;
  if (window.currentStep === 3 && window.img) {
    let blockList = renderTransformingPortrait();
    if (window.particles.length === 0) {
      window.initializeParticles(blockList);
    }
    for (let i = 0; i < window.particles.length; i++) {
      updateParticle(window.particles[i]);
      renderParticle(window.particles[i]);
    }
  } else if (window.currentStep >= 4 && window.particles.length > 0) {
    window.p5Instance.background(255);
    for (let i = 0; i < window.particles.length; i++) {
      updateParticle(window.particles[i]);
      renderParticle(window.particles[i]);
    }
  } else {
    window.p5Instance.background(255); // Белый фон по умолчанию
  }
};
