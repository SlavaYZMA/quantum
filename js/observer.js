window.observeParticle = function(particle, state, index) {
  if (!particle.superposition || state.collapsed) return;

  const d = window.p5Instance.dist(window.cursorX, window.cursorY, particle.x + particle.offsetX, particle.y + particle.offsetY);
  const mouseSpeed = window.p5Instance.dist(window.cursorX, window.cursorY, window.lastMouseX, window.lastMouseY);
  const influence = d < window.mouseInfluenceRadius ? window.p5Instance.map(d, 0, window.mouseInfluenceRadius, 1, 0) : 0;

  if (influence > 0.5 && !window.isPaused) {
    const collapseProb = mouseSpeed > 20 ? 0.15 : 0.1;
    if (window.p5Instance.random() < collapseProb) {
      state.collapsed = true;
      particle.superposition = false;
      particle.shapeType = window.p5Instance.random() < 0.5 ? window.p5Instance.floor(window.p5Instance.random(5)) : particle.shapeType;
      particle.uncertainty = 0;
      particle.probAmplitude = 1;
      if (window.trailBuffer) {
        window.trailBuffer.noFill();
        for (let i = 0; i < 3; i++) {
          window.trailBuffer.stroke(state.r, state.g, state.b, 255 - i * 80);
          window.trailBuffer.strokeWeight(1);
          window.trailBuffer.ellipse(particle.x + particle.offsetX, particle.y + particle.offsetY, 20 + i * 10);
        }
        if (window.p5Instance.random() < 0.1) {
          window.trailBuffer.stroke(255, 255, 255, 100);
          window.trailBuffer.line(particle.x + particle.offsetX, particle.y + particle.offsetY, window.cursorX, window.cursorY);
        }
      }
      window.addQuantumMessage("Коллапс: измерение вызвало выбор одного состояния.", "collapse");
      document.querySelector('.terminal').innerHTML += "<br>Collapse: Measurement triggered state collapse.";
      playSound('collapse');
    }
  }
};
