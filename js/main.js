import { translations, getTextForStep } from './textSteps.js';
import { setupParticles, drawParticles, setImage, getCanvas } from './particles.js';
import { generateSoundFromCursor } from './audio.js';
import { initWebSocket, updateCursors, debouncedUpdateCursor } from './observer.js';

let currentStep = 0;
let language = 'ru';
let img = null;
let canvas = null;
let timeOnPage = 0;
let weirdnessFactor = 0;
let simplifyAnimations = false;
let uploadedImageUrl = '';
let startTime = performance.now();
let cursorX = 0;
let cursorY = 0;
const portraitUrls = [
  'https://via.placeholder.com/100',
  'https://via.placeholder.com/100',
  'https://via.placeholder.com/100'
];

function setup() {
  setupParticles();
  canvas = getCanvas();
  setInterval(() => {
    timeOnPage = (performance.now() - startTime) / 1000;
    weirdnessFactor = Math.min(timeOnPage / 300, 1);
  }, 1000);
  initWebSocket();
}

function draw() {
  drawParticles();
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedNextStep = debounce(nextStep, 300);
const debouncedGoBack = debounce(goBack, 300);

function selectLanguage(lang) {
  language = lang;
  updateContinueButtonText();
  debouncedNextStep();
}

function showCanvas(containerId) {
  if (!canvas) return;
  const canvasElement = canvas.elt;
  const currentParent = canvasElement.parentElement;
  if (currentParent) currentParent.removeChild(canvasElement);
  const container = document.getElementById(containerId);
  if (container) {
    container.appendChild(canvasElement);
    canvasElement.style.display = 'block';
  }
}

function hideCanvas() {
  if (canvas) canvas.elt.style.display = 'none';
}

function showPreviewImage(step) {
  const previewImage = document.getElementById(`previewImage${step}`);
  if (previewImage && uploadedImageUrl) {
    previewImage.src = uploadedImageUrl;
    previewImage.style.display = 'block';
  }
}

function hidePreviewImage(step) {
  const previewImage = document.getElementById(`previewImage${step}`);
  if (previewImage) previewImage.style.display = 'none';
}

function nextStep() {
  if (currentStep >= 7) return;
  if (currentStep >= 2 && !img) {
    alert(language === 'ru' ? 'Пожалуйста, загрузите фото или выберите из архива.' : 'Please upload a photo or select from the archive.');
    return;
  }

  document.querySelector(`#step${currentStep}`)?.classList.remove('active');
  currentStep++;
  const nextStepElement = document.querySelector(`#step${currentStep}`);
  if (!nextStepElement) {
    currentStep--;
    return;
  }

  nextStepElement.classList.add('active');
  document.getElementById('backButton').style.display = currentStep > 0 ? 'block' : 'none';
  document.getElementById('continueButton').style.display = currentStep > 0 && currentStep < 7 ? 'block' : 'none';
  updateContinueButtonState();

  if ([1, 2, 3, 4, 5, 6, 7].includes(currentStep)) {
    if (currentStep === 1 || currentStep === 3) triggerFlash();
    if (currentStep === 4 || currentStep === 5) {
      showCanvas(`canvasContainer${currentStep}`);
      showPreviewImage(currentStep);
      loop();
    } else {
      hideCanvas();
      hidePreviewImage(4);
      hidePreviewImage(5);
      noLoop();
    }
    typeText(`typewriter${currentStep}`, getTextForStep(currentStep, language));
  }
}

function goBack() {
  if (currentStep <= 0) return;

  document.querySelector(`#step${currentStep}`)?.classList.remove('active');
  currentStep--;
  document.querySelector(`#step${currentStep}`)?.classList.add('active');
  document.getElementById('backButton').style.display = currentStep > 0 ? 'block' : 'none';
  document.getElementById('continueButton').style.display = currentStep > 0 && currentStep < 7 ? 'block' : 'none';
  updateContinueButtonState();

  if (currentStep === 0) {
    const step0Buttons = document.getElementById('step0Buttons');
    step0Buttons.innerHTML = `
      <button class="button" aria-label="Выбрать русский язык" onclick="selectLanguage('ru')">RU</button>
      <button class="button" aria-label="Выбрать английский язык" onclick="selectLanguage('en')">ENG</button>
    `;
  } else if (currentStep === 2) {
    const step2Buttons = document.getElementById('step2Buttons');
    step2Buttons.innerHTML = `
      <input type="file" id="imageInput" accept="image/*" style="display: none;">
      <button class="button" aria-label="Загрузить фото" onclick="document.getElementById('imageInput').click()">${language === 'ru' ? 'Загрузить фото' : 'Upload Photo'}</button>
      <button class="button" aria-label="Выбрать из архива" onclick="openGallery()">${language === 'ru' ? 'Выбрать готовое' : 'Select from Archive'}</button>
    `;
    img = null;
    document.getElementById('portraitGallery').style.display = 'none';
  } else if (currentStep === 4 || currentStep === 5) {
    showCanvas(`canvasContainer${currentStep}`);
    showPreviewImage(currentStep);
    loop();
  } else {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    noLoop();
  }
  typeText(`typewriter${currentStep}`, getTextForStep(currentStep, language));
}

function getTypingSpeed(index) {
  const baseSpeed = 50;
  const variation = weirdnessFactor * 100;
  let speed = baseSpeed + Math.random() * variation;
  if (index % 10 === 0 && Math.random() < 0.1 * weirdnessFactor) speed += 500;
  return Math.max(20, Math.min(speed, 200));
}

function typeText(elementId, text, callback) {
  const element = document.getElementById(elementId);
  if (!element) return;
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
        if (Math.random() < 0.1 + 0.2 * weirdnessFactor) applyRandomGlitch(elementId, span);
      } else {
        element.innerHTML += char;
      }
      i++;
      setTimeout(type, getTypingSpeed(i));
    } else {
      applyRandomGlitch(elementId);
      if (callback) callback();
    }
  }
  type();
  continuousGlitch(elementId);
}

function applyRandomGlitch(elementId, singleChar = null) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const glitchChars = singleChar ? [singleChar] : element.querySelectorAll('.glitch-char');
  const baseGlitchProbability = (currentStep === 4 || currentStep === 5) ? 0.1 : 0.05;
  const glitchProbability = Math.min(baseGlitchProbability + weirdnessFactor * 0.3, 0.4);
  const maxOffset = singleChar ? 8 : 4 + weirdnessFactor * 10;
  const brightColors = [[255, 0, 0], [255, 105, 180], [0, 0, 255], [0, 255, 0], [255, 255, 0]];

  glitchChars.forEach((char, index) => {
    if (char.classList.contains('animating')) return;
    char.classList.add('animating');

    const rect = char.getBoundingClientRect();
    const charX = rect.left + rect.width / 2;
    const charY = rect.top + rect.height / 2;
    const distance = Math.sqrt((charX - cursorX) ** 2 + (charY - cursorY) ** 2);
    const influenceRadius = 150 + weirdnessFactor * 50;
    const influence = distance < influenceRadius ? (1 - distance / influenceRadius) : 0;

    if (Math.random() < glitchProbability + influence * 0.2) {
      const delay = Math.random() * (3000 - weirdnessFactor * 2000);
      const offsetX = (Math.random() * 2 - 1) * (maxOffset + influence * (singleChar ? 4 : 8));
      const offsetY = (Math.random() * 2 - 1) * (maxOffset + influence * (singleChar ? 4 : 8));
      const waveDelay = distance * 0.05;

      setTimeout(() => {
        char.classList.add('random-glitch-char');
        char.style.setProperty('--random-delay', `${(delay + waveDelay) / 1000}s`);
        char.style.setProperty('--random-offset-x', offsetX);
        char.style.setProperty('--random-offset-y', offsetY);

        if (Math.random() < 0.2 * weirdnessFactor + influence * 0.1) {
          char.classList.add('noise');
          char.setAttribute('data-text', String.fromCharCode(9600 + Math.random() * 100));
        }

        if (Math.random() < 0.1 * weirdnessFactor + influence * 0.1) {
          char.classList.add('rotate');
          char.style.setProperty('--random-rotation', Math.random() * 2 - 1);
        }

        if (Math.random() < 0.1 * influence) {
          const color = brightColors[Math.floor(Math.random() * brightColors.length)];
          char.style.color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        }

        if (simplifyAnimations) {
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
}

function continuousGlitch(elementId) {
  if (simplifyAnimations) return;
  function loop() {
    applyRandomGlitch(elementId);
    const nextDelay = 1000 + Math.random() * (2000 - weirdnessFactor * 1500);
    setTimeout(() => requestAnimationFrame(loop), nextDelay);
  }
  requestAnimationFrame(loop);
}

function simplifyAnimation() {
  simplifyAnimations = true;
  const typewriter = document.querySelector(`#typewriter${currentStep}`);
  if (typewriter) {
    typewriter.querySelectorAll('.glitch-char').forEach(char => {
      char.classList.add('stabilized');
      char.classList.remove('random-glitch-char', 'noise', 'rotate');
      char.setAttribute('data-text', char.textContent);
      char.style.color = '#fff';
    });
  }
}

function triggerFlash() {
  document.getElementById('noiseOverlay').style.opacity = '0.1';
  setTimeout(() => document.getElementById('noiseOverlay').style.opacity = '0', 1000);
  document.getElementById('flashEffect').classList.add('active');
}

function restart() {
  currentStep = 0;
  language = 'ru';
  img = null;
  timeOnPage = 0;
  weirdnessFactor = 0;
  simplifyAnimations = false;
  uploadedImageUrl = '';
  startTime = performance.now();
  document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
  document.getElementById('step0').classList.add('active');
  document.getElementById('step0Buttons').innerHTML = `
    <button class="button" aria-label="Выбрать русский язык" onclick="selectLanguage('ru')">RU</button>
    <button class="button" aria-label="Выбрать английский язык" onclick="selectLanguage('en')">ENG</button>
  `;
  document.getElementById('backButton').style.display = 'none';
  document.getElementById('continueButton').style.display = 'none';
  document.getElementById('portraitGallery').style.display = 'none';
  document.getElementById('authorsPage').style.display = 'none';
  hidePreviewImage(4);
  hidePreviewImage(5);
  typeText('typewriter0', getTextForStep(0, language));
  setup();
}

function loadImageFromUrl(url) {
  document.getElementById('loader').style.display = 'block';
  loadImage(url, (loadedImg) => {
    img = loadedImg;
    setImage(img);
    document.getElementById('portraitGallery').style.display = 'none';
    document.getElementById('typewriter2').innerHTML = '';
    document.getElementById('step2Buttons').innerHTML = '';
    typeText('typewriter2', translations.step2_after[language]);
    document.getElementById('loader').style.display = 'none';
    updateContinueButtonState();
  }, () => {
    document.getElementById('loader').style.display = 'none';
    alert(language === 'ru' ? 'Ошибка загрузки изображения. Попробуйте другое.' : 'Image loading error. Please try another.');
    updateContinueButtonState();
  });
}

function openGallery() {
  const gallery = document.getElementById('portraitGallery');
  gallery.innerHTML = '';
  gallery.style.display = 'flex';
  portraitUrls.forEach((url, index) => {
    const div = document.createElement('div');
    div.className = 'portrait';
    div.style.backgroundImage = `url('${url}')`;
    div.setAttribute('aria-label', `Портрет ${index + 1}`);
    div.onclick = () => {
      uploadedImageUrl = url;
      loadImageFromUrl(url);
    };
    gallery.appendChild(div);
  });
}

function openAuthors() {
  document.getElementById('authorsPage').style.display = 'block';
}

function closeAuthors() {
  document.getElementById('authorsPage').style.display = 'none';
}

function shareObservation() {
  try {
    window.open('https://t.me/quantportrat', '_blank');
    alert(language === 'ru' ? 'Ссылка открыта в новой вкладке.' : 'Link opened in a new tab.');
  } catch (e) {
    alert(language === 'ru' ? 'Не удалось открыть ссылку. Проверьте настройки браузера.' : 'Failed to open link. Check browser settings.');
  }
}

function goToArchive() {
  try {
    window.open('https://t.me/quantportrat', '_blank');
    alert(language === 'ru' ? 'Ссылка открыта в новой вкладке.' : 'Link opened in a new tab.');
  } catch (e) {
    alert(language === 'ru' ? 'Не удалось открыть ссылку. Проверьте настройки браузера.' : 'Failed to open link. Check browser settings.');
  }
}

function saveCurrentState() {
  if (!canvas) {
    alert(language === 'ru' ? 'Canvas не найден. Убедитесь, что изображение отображается.' : 'Canvas not found. Ensure the image is displayed.');
    return;
  }
  generateSoundFromCursor();
  const dataURL = canvas.elt.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'quantum-portrait.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  alert(language === 'ru' ? 'Изображение и звук сохранены.' : 'Image and sound saved.');
}

function updateContinueButtonText() {
  document.getElementById('continueButton').textContent = language === 'ru' ? 'Продолжить / Continue' : 'Continue';
}

function updateContinueButtonState() {
  document.getElementById('continueButton').disabled = currentStep === 2 && !img;
}

window.onload = () => {
  document.getElementById('step0').classList.add('active');
  typeText('typewriter0', getTextForStep(0, language));
  document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      uploadedImageUrl = URL.createObjectURL(file);
      loadImageFromUrl(uploadedImageUrl);
    }
  });
  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY + window.scrollY;
    debouncedUpdateCursor(cursorX, cursorY);
  });
  document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    cursorX = touch.clientX;
    cursorY = touch.clientY + window.scrollY;
    debouncedUpdateCursor(cursorX, cursorY);
  }, { passive: false });
  document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    cursorX = touch.clientX;
    cursorY = touch.clientY + window.scrollY;
    debouncedUpdateCursor(cursorX, cursorY);
    const typewriter = document.querySelector(`#typewriter${currentStep}`);
    if (typewriter) applyRandomGlitch(`typewriter${currentStep}`);
  });
  setInterval(updateCursors, 100);
  window.onerror = function(message, source, lineno, colno, error) {
    console.error(`Ошибка: ${message} в ${source}:${lineno}:${colno}`);
    document.body.innerHTML = `<div style="color: white; text-align: center; padding-top: 50px;">
      Произошла ошибка: ${message}. Пожалуйста, обновите страницу или проверьте консоль для деталей.
    </div>`;
  };
};