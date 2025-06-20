function getTypingSpeed(index, text) {
  const baseSpeed = 50;
  const variation = window.weirdnessFactor * 100;
  let speed = baseSpeed + Math.random() * variation;
  if (index % 10 === 0 && Math.random() < 0.1 * window.weirdnessFactor) {
    speed += 500;
  }
  return Math.max(20, Math.min(speed, 200));
}

window.typeText = function(elementId, text, callback) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Элемент ${elementId} не найден!`);
    return;
  }
  element.innerHTML = '';
  let i = 0;

  function type() {
    if (i < text.length) {
      const char = text.charAt(i);
      if (char.trim() !== '') {
        const span = document.createElement('span');
        span.className = 'glitch-char';
        span.setAttribute('data-text', char);
        span.textContent = char;
        element.appendChild(span);
        if (Math.random() < 0.1 + 0.2 * window.weirdnessFactor) {
          window.applyRandomGlitch(elementId, span);
        }
      } else {
        element.innerHTML += char;
      }
      i++;
      setTimeout(type, getTypingSpeed(i, text));
    } else {
      window.applyRandomGlitch(elementId);
      if (callback) callback();
    }
  }
  type();
  window.continuousGlitch(elementId);
};

window.applyRandomGlitch = function(elementId, singleChar = null) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const glitchChars = singleChar ? [singleChar] : element.querySelectorAll('.glitch-char');
  const baseGlitchProbability = (window.currentStep === 4 || window.currentStep === 5) ? 0.1 : 0.05;
  const glitchProbability = Math.min(baseGlitchProbability + window.weirdnessFactor * 0.3, 0.4);
  const maxOffset = singleChar ? 8 : 4 + window.weirdnessFactor * 10;
  const brightColors = [[255, 0, 0], [255, 105, 180], [0, 0, 255], [0, 255, 0], [255, 255, 0]];

  glitchChars.forEach((char, index) => {
    if (char.classList.contains('animating')) return;
    char.classList.add('animating');

    const rect = char.getBoundingClientRect();
    const charX = rect.left + rect.width / 2;
    const charY = rect.top + rect.height / 2;
    const distance = Math.sqrt((charX - window.cursorX) ** 2 + (charY - window.cursorY) ** 2);
    const influenceRadius = 150 + window.weirdnessFactor * 50;
    const influence = distance < influenceRadius ? (1 - distance / influenceRadius) : 0;

    if (Math.random() < glitchProbability + influence * 0.2) {
      const delay = Math.random() * (3000 - window.weirdnessFactor * 2000);
      const offsetX = (Math.random() * 2 - 1) * (maxOffset + influence * (singleChar ? 4 : 8));
      const offsetY = (Math.random() * 2 - 1) * (maxOffset + influence * (singleChar ? 4 : 8));
      const waveDelay = distance * 0.05;

      setTimeout(() => {
        char.classList.add('random-glitch-char');
        char.style.setProperty('--random-delay', `${(delay + waveDelay) / 1000}s`);
        char.style.setProperty('--random-offset-x', offsetX);
        char.style.setProperty('--random-offset-y', offsetY);

        if (Math.random() < 0.2 * window.weirdnessFactor + influence * 0.1) {
          char.classList.add('noise');
          char.setAttribute('data-text', String.fromCharCode(9600 + Math.random() * 100));
        }

        if (Math.random() < 0.1 * window.weirdnessFactor + influence * 0.1) {
          char.classList.add('rotate');
          char.style.setProperty('--random-rotation', Math.random() * 2 - 1);
        }

        if (Math.random() < 0.1 * influence) {
          const color = brightColors[Math.floor(Math.random() * brightColors.length)];
          char.style.color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        }

        if (window.simplifyAnimations) {
          setTimeout(() => {
            char.classList.add('stabilized');
            char.classList.remove('random-glitch-char', 'noise', 'rotate');
            char.setAttribute('data-text', char.textContent);
            char.style.color = '#fff';
            char.classList.remove('animating');
          }, 1000 + delay + waveDelay);
        } else {
          setTimeout(() => {
            char.classList.remove('random-glitch-char', 'noise', 'rotate');
            char.setAttribute('data-text', char.textContent);
            char.style.color = '#fff';
            char.classList.remove('animating');
          }, 800 + delay + waveDelay);
        }
      }, delay + waveDelay);
    } else {
      char.classList.remove('animating');
    }
  });
};

window.continuousGlitch = function(elementId) {
  if (window.simplifyAnimations) return;
  function loop() {
    window.applyRandomGlitch(elementId);
    const nextDelay = 1000 + Math.random() * (2000 - window.weirdnessFactor * 1500);
    setTimeout(() => requestAnimationFrame(loop), nextDelay);
  }
  requestAnimationFrame(loop);
};

window.simplifyAnimation = function() {
  window.simplifyAnimations = true;
  const typewriter = document.querySelector(`#typewriter${window.currentStep}`);
  if (typewriter) {
    typewriter.querySelectorAll('.glitch-char').forEach(char => {
      char.classList.add('stabilized');
      char.classList.remove('random-glitch-char', 'noise', 'rotate');
      char.setAttribute('data-text', char.textContent);
      char.style.color = '#fff';
    });
  }
};
