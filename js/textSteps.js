window.simplifyAnimations = window.innerWidth < 768;

function applyGlitchEffect(element, intensity = 1) {
  const chars = element.querySelectorAll('.glitch-char:not(.stabilized)');
  chars.forEach(char => {
    if (Math.random() < 0.05 * intensity) {
      char.classList.add('random-glitch');
      if (Math.random() < 0.3) char.classList.add('noise');
      if (Math.random() < 0.2) char.classList.add('rotate');
      char.style.setProperty('--random-delay', `${Math.random() * 0.2}s`);
      char.style.setProperty('--random-offset-x', Math.random() * 2 - 1);
      char.style.setProperty('--random-offset-y', Math.random() * 2 - 1);
      char.style.setProperty('--random-rotation', Math.random() * 2 - 1);
      setTimeout(() => {
        char.classList.remove('random-glitch', 'noise', 'rotate');
      }, 500);
    }
  });
}

window.applyRandomGlitch = function(elementId) {
  const element = document.getElementById(elementId);
  if (element && !window.simplifyAnimations) {
    applyGlitchEffect(element, window.currentStep >= 4 ? 2 : 1);
  }
};

function continuousGlitch(elementId) {
  if (window.simplifyAnimations) return;
  const element = document.getElementById(elementId);
  if (!element) return;
  applyGlitchEffect(element, window.currentStep >= 4 ? 2 : 1);
  setTimeout(() => continuousGlitch(elementId), Math.random() * 1000 + 500);
}

window.typeText = function(elementId, content, onComplete = () => {}) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID ${elementId} not found`);
    return;
  }
  element.innerHTML = '';
  let texts = Array.isArray(content) ? content : [{ text: content, speed: () => 50 }];
  let currentTextIndex = 0;
  let charIndex = 0;
  let currentText = texts[currentTextIndex].text;
  let delay = texts[currentTextIndex].delay || 0;

  function typeNextChar() {
    if (currentTextIndex >= texts.length) {
      onComplete();
      continuousGlitch(elementId);
      return;
    }
    if (charIndex < currentText.length) {
      let char = currentText[charIndex];
      let span = document.createElement('span');
      span.className = 'glitch-char';
      span.setAttribute('data-text', char);
      span.textContent = char;
      element.appendChild(span);
      charIndex++;
      let speed = texts[currentTextIndex].speed();
      setTimeout(typeNextChar, speed);
      if (!window.simplifyAnimations && Math.random() < 0.05) {
        applyGlitchEffect(element);
      }
    } else {
      currentTextIndex++;
      if (currentTextIndex < texts.length) {
        charIndex = 0;
        currentText = texts[currentTextIndex].text;
        delay = texts[currentTextIndex].delay || 0;
        setTimeout(typeNextChar, delay);
      } else {
        onComplete();
        continuousGlitch(elementId);
      }
    }
  }

  setTimeout(typeNextChar, delay);
};
