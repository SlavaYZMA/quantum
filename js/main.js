let currentStep = 0;
let language = 'ru';
let img;
let frame = 0;
let isPaused = false;
let particles = [];
let quantumStates = [];
let canvas;
let isCanvasReady = false;
let timeOnPage = 0;
let weirdnessFactor = 0;
let simplifyAnimations = false;
let showInitialImage = true;
let uploadedImageUrl = '';

const portraitUrls = [
  'https://via.placeholder.com/100',
  'https://via.placeholder.com/100',
  'https://via.placeholder.com/100'
];

const translations = {
  step0: { ru: 'Пожалуйста, выберите язык\nPlease select a language', en: 'Please select a language' },
  step1: { ru: 'СТАТУС: НАБЛЮДАТЕЛЬ ПОДКЛЮЧЁН\n> Чему Шредингер может научить нас в области\nцифровой идентификации?\n> Добро пожаловать в экспериментальную зону.\n> Здесь наблюдение = вмешательство.', en: 'STATUS: OBSERVER CONNECTED\n> What can Schrödinger teach us about\ndigital identification?\n> Welcome to the experimental zone.\n> Here, observation = interference.' },
  step2: { ru: 'Шаг 1: Сканируйте лицо суперпозиции.\nВы можете загрузить изображение или выбрать вариант из архива.', en: 'Step 1: Scan the face of superposition.\nYou can upload an image or select from the archive.' },
  step2_after: { ru: '> Изображение принято.\n> Запускается волновая функция.\n> Система готова к инициализации.', en: '> Image accepted.\n> Wave function launching.\n> System ready for initialization.' },
  step3: { ru: 'Шаг 2: Инициализация\n> Изображение преобразовано в пиксельную\nсетку.\n> Каждому пикселю назначены параметры (x, y,\nbrightness, color).\n> На их основе построена волновая функция: ψ(x,\ny, t).\nУравнение эволюции:\niℏ ∂ψ/∂t = Ĥψ, где Ĥ = -½∇² + V(x, y)\n> Потенциал V(x, y) формируется из визуальных\nхарактеристик изображения.\n> Система переходит в режим временной\nсимуляции.\n> Портрет существует как совокупность\nвозможных состояний.', en: 'Step 2: Initialization\n> Image converted into a pixel grid.\n> Each pixel assigned parameters (x, y,\nbrightness, color).\n> Based on them, a wave function is built: ψ(x,\ny, t).\nEvolution equation:\niℏ ∂ψ/∂t = Ĥψ, where Ĥ = -½∇² + V(x, y)\n> Potential V(x, y) is formed from the visual\ncharacteristics of the image.\n> System enters temporal simulation mode.\n> The portrait exists as a set of possible\nstates.' },
  step4: { ru: 'Шаг 3: НАЧНИТЕ НАБЛЮДЕНИЕ\n> Двигайте курсором по изображению.\n> Каждый ваш жест запускает хаотический распад.\n> Система формирует абсурдный образ.', en: 'Step 3: BEGIN OBSERVATION\n> Move the cursor over the image.\n> Each gesture triggers chaotic decay.\n> The system forms an absurd image.' },
  step5: { ru: 'Шаг 4: ФИКСАЦИЯ\n> Портрет — это хаос.\n> Зафиксируйте один миг этого безумия.\n> Это будет твой абсурдный образ.', en: 'Step 4: FIXATION\n> A portrait is chaos.\n> Freeze a moment of this madness.\n> This will be your absurd self.' },
  step6: { ru: 'Шаг 5: РЕАКЦИЯ СИСТЕМЫ\n> Это не портрет.\n> Это — хаотичная реакция системы на тебя.\n> Ты породил абсурд.', en: 'Step 5: SYSTEM REACTION\n> This is not a portrait.\n> This is the system\'s chaotic reaction to you.\n> You spawned absurdity.' },
  step7: { ru: 'Ты — не единственный наблюдатель.\nКаждое наблюдение — это акт, порождающий\nхаос. Здесь ты — одновременно субъект и\nобъект абсурда.', en: 'You are not the only observer.\nEach observation is an act that spawns\nchaos. Here, you are both subject and object\nof absurdity.' }
};

let startTime = performance.now();
setInterval(() => {
  timeOnPage = (performance.now() - startTime) / 1000;
  weirdnessFactor = Math.min(timeOnPage / 300, 1);
}, 1000);

let cursorX = 0;
let cursorY = 0;

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
const debouncedUpdateCursor = debounce((x, y) => {
  cursorX = x;
  cursorY = y;
}, 50);

document.addEventListener('mousemove', (e) => {
  debouncedUpdateCursor(e.clientX, e.clientY + window.scrollY);
});

document.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  debouncedUpdateCursor(touch.clientX, touch.clientY + window.scrollY);
}, { passive: false });

document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  debouncedUpdateCursor(touch.clientX, touch.clientY + window.scrollY);
  const typewriter = document.querySelector(`#typewriter${currentStep}`);
  if (typewriter) applyRandomGlitch(`typewriter${currentStep}`);
});

function selectLanguage(lang) {
  language = lang;
  updateContinueButtonText();
  debouncedNextStep();
}

function showCanvas(containerId) {
  if (!canvas) {
    console.error(`Канва не создана для ${containerId}!`);
    return;
  }
  const canvasElement = canvas.elt;
  const currentParent = canvasElement.parentElement;
  if (currentParent) {
    currentParent.removeChild(canvasElement);
  }
  const container = document.getElementById(containerId);
  if (container) {
    container.appendChild(canvasElement);
    canvasElement.style.display = 'block';
  } else {
    console.error(`Контейнер ${containerId} не найден!`);
  }
}

function hideCanvas() {
  if (canvas) {
    canvas.elt.style.display = 'none';
  }
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
  if (previewImage) {
    previewImage.style.display = 'none';
  }
}

function nextStep() {
  if (currentStep >= 7) return;

  if (currentStep >= 2 && !img) {
    alert(language === 'ru' ? 'Пожалуйста, загрузите фото или выберите из архива.' : 'Please upload a photo or select from the archive.');
    return;
  }

  const currentStepElement = document.querySelector(`#step${currentStep}`);
  if (currentStepElement) currentStepElement.classList.remove('active');

  currentStep++;
  const nextStepElement = document.querySelector(`#step${currentStep}`);
  if (!nextStepElement) {
    console.error(`Шаг ${currentStep} не найден!`);
    currentStep--;
    return;
  }

  nextStepElement.classList.add('active');
  document.getElementById('backButton').style.display = currentStep > 0 ? 'block' : 'none';
  document.getElementById('continueButton').style.display = currentStep > 0 && currentStep < 7 ? 'block' : 'none';
  updateContinueButtonState();

  if (currentStep === 1) {
    triggerFlash();
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  } else if (currentStep === 2) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  } else if (currentStep === 3) {
    if (!img) {
      debouncedGoBack();
      return;
    }
    triggerFlash();
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  } else if (currentStep === 4) {
    showInitialImage = true;
    if (isCanvasReady) {
      showCanvas('canvasContainer4');
      showPreviewImage(4);
      loop();
    } else {
      setTimeout(() => {
        if (isCanvasReady) {
          showCanvas('canvasContainer4');
          showPreviewImage(4);
          loop();
        }
      }, 500);
    }
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  } else if (currentStep === 5) {
    if (isCanvasReady) {
      showCanvas('canvasContainer5');
      showPreviewImage(5);
      if (!isPaused) loop();
    } else {
      setTimeout(() => {
        if (isCanvasReady) {
          showCanvas('canvasContainer5');
          showPreviewImage(5);
          if (!isPaused) loop();
        }
      }, 500);
    }
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  } else if (currentStep === 6) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    noLoop();
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  } else if (currentStep === 7) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  }
}

function goBack() {
  if (currentStep <= 0) return;

  const currentStepElement = document.querySelector(`#step${currentStep}`);
  if (currentStepElement) currentStepElement.classList.remove('active');

  currentStep--;
  const previousStepElement = document.querySelector(`#step${currentStep}`);
  if (!previousStepElement) {
    console.error(`Шаг ${currentStep} не найден!`);
    currentStep++;
    return;
  }

  previousStepElement.classList.add('active');
  document.getElementById('backButton').style.display = currentStep > 0 ? 'block' : 'none';
  document.getElementById('continueButton').style.display = currentStep > 0 && currentStep < 7 ? 'block' : 'none';
  updateContinueButtonState();

  if (currentStep === 0) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    const step0Buttons = document.getElementById('step0Buttons');
    step0Buttons.innerHTML = `
      <button class="button" aria-label="Выбрать русский язык" onclick="selectLanguage('ru')">RU</button>
      <button class="button" aria-label="Выбрать английский язык" onclick="selectLanguage('en')">ENG</button>
    `;
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  } else if (currentStep === 1) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  } else if (currentStep === 2) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    document.getElementById('portraitGallery').style.display = 'none';
    noLoop();
    particles = [];
    quantumStates = [];
    frame = 0;
    isPaused = false;
    img = null;
    showInitialImage = true;
    const step2Buttons = document.getElementById('step2Buttons');
    step2Buttons.innerHTML = `
      <input type="file" id="imageInput" accept="image/*" style="display: none;">
      <button class="button" aria-label="Загрузить фото" onclick="document.getElementById('imageInput').click()">${language === 'ru' ? 'Загрузить фото' : 'Upload Photo'}</button>
      <button class="button" aria-label="Выбрать из архива" onclick="openGallery()">${language === 'ru' ? 'Выбрать готовое' : 'Select from Archive'}</button>
    `;
    typeText('typewriter2', translations.step2[language]);
  } else if (currentStep === 3) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    noLoop();
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  } else if (currentStep === 4) {
    showInitialImage = true;
    if (isCanvasReady) {
      showCanvas('canvasContainer4');
      showPreviewImage(4);
      if (!isPaused) loop();
    } else {
      setTimeout(() => {
        if (isCanvasReady) {
          showCanvas('canvasContainer4');
          showPreviewImage(4);
          if (!isPaused) loop();
        }
      }, 500);
    }
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  } else if (currentStep === 5) {
    if (isCanvasReady) {
      showCanvas('canvasContainer5');
      showPreviewImage(5);
      if (!isPaused) loop();
    } else {
      setTimeout(() => {
        if (isCanvasReady) {
          showCanvas('canvasContainer5');
          showPreviewImage(5);
          if (!isPaused) loop();
        }
      }, 500);
    }
    document.getElementById('saveButton').style.display = isPaused ? 'block' : 'none';
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  } else if (currentStep === 6) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    noLoop();
    typeText(`typewriter${currentStep}`, translations[`step${currentStep}`][language]);
  }
}

function getTypingSpeed(index, text) {
  const baseSpeed = 50;
  const variation = weirdnessFactor * 100;
  let speed = baseSpeed + Math.random() * variation;
  if (index % 10 === 0 && Math.random() < 0.1 * weirdnessFactor) {
    speed += 500;
  }
  return Math.max(20, Math.min(speed, 200));
}

function typeText(elementId, text, callback) {
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
        if (Math.random() < 0.1 + 0.2 * weirdnessFactor) {
          applyRandomGlitch(elementId, span);
        }
      } else {
        element.innerHTML += char;
      }
      i++;
      setTimeout(type, getTypingSpeed(i, text));
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
  frame = 0;
  isPaused = false;
  particles = [];
  quantumStates = [];
  isCanvasReady = false;
  timeOnPage = 0;
  weirdnessFactor = 0;
  simplifyAnimations = false;
  showInitialImage = true;
  uploadedImageUrl = '';
  startTime = performance.now();

  if (canvas) {
    canvas.remove();
    canvas = null;
  }
  noLoop();

  document.getElementById('portraitGallery').style.display = 'none';
  document.getElementById('authorsPage').style.display = 'none';
  hidePreviewImage(4);
  hidePreviewImage(5);

  document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));

  const step0Element = document.getElementById('step0');
  step0Element.classList.add('active');
  const step0Buttons = document.getElementById('step0Buttons');
  step0Buttons.innerHTML = `
    <button class="button" aria-label="Выбрать русский язык" onclick="selectLanguage('ru')">RU</button>
    <button class="button" aria-label="Выбрать английский язык" onclick="selectLanguage('en')">ENG</button>
  `;

  document.getElementById('backButton').style.display = 'none';
  document.getElementById('continueButton').style.display = 'none';
  updateContinueButtonState();

  typeText('typewriter0', translations.step0[language]);

  setup();
}

window.onload = () => {
  document.getElementById('step0').classList.add('active');
  typeText('typewriter0', translations.step0[language]);
  window.onerror = function(message, source, lineno, colno, error) {
    console.error(`Ошибка: ${message} в ${source}:${lineno}:${colno}`);
    document.body.innerHTML = `<div style="color: white; text-align: center; padding-top: 50px;">
      Произошла ошибка: ${message}. Пожалуйста, обновите страницу или проверьте консоль для деталей.
    </div>`;
  };
};

document.getElementById('imageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    uploadedImageUrl = url;
    loadImageFromUrl(url);
  }
});

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
      gallery.style.display = 'none';
    };
    gallery.appendChild(div);
  });
}

function loadImageFromUrl(url) {
  document.getElementById('loader').style.display = 'block';
  loadImage(url, (loadedImg) => {
    img = loadedImg;
    document.getElementById('portraitGallery').style.display = 'none';
    const typewriter2 = document.getElementById('typewriter2');
    typewriter2.innerHTML = '';
    const step2Buttons = document.getElementById('step2Buttons');
    step2Buttons.innerHTML = '';
    typeText('typewriter2', translations.step2_after[language]);
    document.getElementById('loader').style.display = 'none';
    updateContinueButtonState();
  }, () => {
    document.getElementById('loader').style.display = 'none';
    alert(language === 'ru' ? 'Ошибка загрузки изображения. Попробуйте другое.' : 'Image loading error. Please try another.');
    updateContinueButtonState();
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
    console.error('Ошибка при открытии ссылки:', e);
    alert(language === 'ru' ? 'Не удалось открыть ссылку. Проверьте настройки браузера.' : 'Failed to open link. Check browser settings.');
  }
}

function goToArchive() {
  try {
    window.open('https://t.me/quantportrat', '_blank');
    alert(language === 'ru' ? 'Ссылка открыта в новой вкладке.' : 'Link opened in a new tab.');
  } catch (e) {
    console.error('Ошибка при открытии ссылки:', e);
    alert(language === 'ru' ? 'Не удалось открыть ссылку. Проверьте настройки браузера.' : 'Failed to open link. Check browser settings.');
  }
}

function saveCurrentState() {
  try {
    if (!canvas) {
      alert(language === 'ru' ? 'Canvas не найден. Убедитесь, что изображение отображается.' : 'Canvas not found. Ensure the image is displayed.');
      return;
    }
    const dataURL = canvas.elt.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'quantum-portrait.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(language === 'ru' ? 'Изображение сохранено как quantum-portrait.png' : 'Image saved as quantum-portrait.png');
  } catch (e) {
    console.error('Ошибка сохранения изображения:', e);
    alert(language === 'ru' ? 'Не удалось сохранить изображение. Попробуйте загрузить сайт на хостинг.' : 'Failed to save image. Try hosting the site.');
  }
}

function updateContinueButtonText() {
  document.getElementById('continueButton').textContent = language === 'ru' ? 'Продолжить / Continue' : 'Continue';
}

function updateContinueButtonState() {
  document.getElementById('continueButton').disabled = currentStep === 2 && !img;
}

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

function setup() {
  canvas = createCanvas(windowWidth * 0.7, windowHeight * 0.6);
  canvas.parent('canvasContainer4');
  pixelDensity(1);
  frameRate(25);
  noLoop();
  canvas.elt.style.display = 'none';

  canvas.elt.addEventListener('click', function() {
    if (currentStep === 5) {
      if (!isPaused) {
        isPaused = true;
        noLoop();
        document.getElementById('saveButton').style.display = 'block';
      } else {
        isPaused = false;
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

function draw() {
  if (!img || !img.width) return;

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

  if (showInitialImage && frame <= 75) {
    let imgAlpha = frame < 25 ? 255 : map(frame, 25, 75, 255, 0);
    tint(255, imgAlpha);
    image(img, (width - img.width) / 2, (height - img.height) / 2);
    noTint();
    if (frame === 25) {
      initializeParticles();
    }
    if (frame === 75) {
      showInitialImage = false;
    }
  }

  if (quantumStates.length === 0 && frame > 25) return;

  if (frame > 25) {
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
}

function initializeParticles() {
  particles = [];
  quantumStates = [];
  let gridSize = 4;
  let maxParticles = windowWidth < 768 ? 1500 : 3000;
  let particleCount = 0;

  img.loadPixels();
  for (let y = 0; y < img.height; y += gridSize) {
    for (let x = 0; x < img.width; x += gridSize) {
      let pixelX = constrain(x, 0, img.width - 1);
      let pixelY = constrain(y, 0, img.height - 1);
      let col = img.get(pixelX, pixelY);
      let brightnessVal = brightness(col);
      if (brightnessVal > 10 && particleCount < maxParticles) {
        let size = 0;
        let shapeType = floor(random(5));
        let canvasX = x + (width - img.width) / 2;
        let canvasY = y + (height - img.height) / 2;
        let distFromCenter = dist(canvasX, canvasY, width / 2, height / 2);
        let angle = atan2(canvasY - height / 2, canvasX - width / 2);
        let explodeDist = distFromCenter * (1 + noise(x * 0.01, y * 0.01) * 2);
        let targetX = width / 2 + cos(angle) * explodeDist;
        let targetY = height / 2 + sin(angle) * explodeDist;
        let layer = random() < 0.2 ? 'background' : random() < 0.15 ? 'foreground' : 'main';
        let chaosSeed = random(1000);
        particles.push({
          x: canvasX,
          y: canvasY,
          baseX: canvasX,
          baseY: canvasY,
          targetX: targetX,
          targetY: targetY,
          origX: canvasX,
          origY: canvasY,
          offsetX: 0,
          offsetY: 0,
          size: size,
          targetSize: random(2, 4),
          phase: random(TWO_PI),
          entangledWith: null,
          gridX: x,
          gridY: y,
          shapeType: shapeType,
          targetShapeType: shapeType,
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
          rotation: random(TWO_PI),
          motionMode: floor(random(3)),
          colorNoise: random(1000),
          alpha: 0,
          targetAlpha: 255
        });
        particleCount++;
      }
    }
  }

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
      a: 0,
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

  if (frame <= 75) {
    let breakupT = frame < 25 ? 0 : map(frame, 25, 75, 0, 1);
    let t = breakupT * breakupT;
    particle.x = lerp(particle.origX, particle.targetX, t);
    particle.y = lerp(particle.origY, particle.targetY, t);
    particle.size = lerp(0, particle.targetSize, t);
    particle.alpha = lerp(0, particle.targetAlpha, t);
    state.a = particle.alpha;
    particle.offsetX = noiseX * 10 * (1 - t);
    particle.offsetY = noiseY * 10 * (1 - t);
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
      particle.size = constrain(particle.size / 2, 2, 10);
    }, random(500, 1000));
  }

  if (random() < 0.05 + influence * 0.1 && !isPaused) {
    particle.targetShapeType = floor(random(5));
    particle.shapeMorphT = 0;
  }
  particle.shapeMorphT = min(particle.shapeMorphT + 0.05, 1);

  let colorNoiseVal = cachedNoise(state.colorNoise + frame * 0.05, 0, 0);
  if (random() < 0.1 + influence * 0.2 && !isPaused) {
    if (random() < 0.6 && !state.collapsed) {
      let newState = random(state.superpositionStates);
      state.r = newState.r;
      state.g = newState.g;
      state.b = newState.b;
    } else if (random() < 0.05) {
      state.brightColor = random(neonColors);
    }
  } else if (random() < 0.03 && state.brightColor && !isPaused) {
    state.brightColor = null;
  }

  if (d < 50 && !state.collapsed && !isPaused) {
    state.collapsed = true;
    let chosenState = random(state.superpositionStates);
    state.r = chosenState.r;
    state.g = chosenState.g;
    state.b = chosenState.b;

    if (state.entangledWith !== null) {
      let entangledState = quantumStates[state.entangledWith];
      if (!entangledState.collapsed) {
        entangledState.collapsed = true;
        entangledState.r = chosenState.r;
        entangledState.g = chosenState.g;
        entangledState.b = chosenState.b;
      }
    }
  }

  if (!state.collapsed) {
    let colorT = colorNoiseVal;
    state.r = lerp(state.superpositionStates[0].r, state.superpositionStates[1].r, colorT);
    state.g = lerp(state.superpositionStates[0].g, state.superpositionStates[1].g, colorT);
    state.b = lerp(state.superpositionStates[0].b, state.superpositionStates[1].b, colorT);
  }

  particle.rotation += 0.02 * chaosFactor;
  particle.phase += 0.03;
}

function renderParticle(particle, state) {
  push();
  translate(particle.x + particle.offsetX, particle.y + particle.offsetY);
  rotate(particle.rotation);
  noStroke();
  let alpha = state.a * (0.7 + 0.3 * cachedNoise(particle.chaosSeed + frame * 0.05, 0, 0));
  if (state.brightColor) {
    fill(state.brightColor[0], state.brightColor[1], state.brightColor[2], alpha);
  } else {
    fill(state.r, state.g, state.b, alpha);
  }

  if (particle.layer === 'foreground' || (frame <= 75 && frame > 25)) {
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = `rgba(${state.brightColor ? state.brightColor[0] : state.r}, ${state.brightColor ? state.brightColor[1] : state.g}, ${state.brightColor ? state.brightColor[2] : state.b}, 0.7)`;
  }

  let size = particle.size * (1 + 0.2 * sin(frame * 0.05 + particle.phase));
  let morphT = particle.shapeMorphT;
  let shapeType = particle.shapeType;
  let targetShapeType = particle.targetShapeType;

  if (morphT < 1 && shapeType !== targetShapeType) {
    drawMixedShape(shapeType, targetShapeType, size, morphT);
  } else {
    drawShape(targetShapeType, size);
  }

  drawingContext.shadowBlur = 0;
  pop();

  if (particle.shapeMorphT >= 1) {
    particle.shapeType = targetShapeType;
  }
}

function drawShape(shapeType, size) {
  switch (shapeType) {
    case 0:
      rect(-size / 2, -size / 2, size, size);
      break;
    case 1:
      ellipse(0, 0, size, size);
      break;
    case 2:
      triangle(0, -size / 2, size / 2, size / 2, -size / 2, size / 2);
      break;
    case 3:
      beginShape();
      for (let a = 0; a < TWO_PI; a += PI / 5) {
        vertex(cos(a) * size / 2, sin(a) * size / 2);
        vertex(cos(a + PI / 5) * size / 4, sin(a + PI / 5) * size / 4);
      }
      endShape(CLOSE);
      break;
    case 4:
      beginShape();
      let sides = floor(random(5, 8));
      for (let a = 0; a < TWO_PI; a += TWO_PI / sides) {
        let r = size / 2 * (0.8 + 0.2 * noise(a * 0.5));
        vertex(cos(a) * r, sin(a) * r);
      }
      endShape(CLOSE);
      break;
  }
}

function drawMixedShape(shapeType, targetShapeType, size, t) {
  let mixedSize = lerp(size, size * 0.8, t);
  if (shapeType === 0 && targetShapeType === 1) {
    let r = lerp(mixedSize / 2, mixedSize / 2, t);
    ellipse(0, 0, r * 2, r * 2);
  } else if (shapeType === 0 && targetShapeType === 2) {
    let s = mixedSize;
    triangle(0, -s / 2 * (1 - t), s / 2 * (1 - t), s / 2, -s / 2 * (1 - t), s / 2);
  } else if (shapeType === 0 && targetShapeType === 3) {
    beginShape();
    let points = lerp(4, 10, t);
    for (let a = 0; a < TWO_PI; a += TWO_PI / points) {
      let r = mixedSize / 2 * (0.8 + 0.2 * sin(a * 5 * t));
      vertex(cos(a) * r, sin(a) * r);
    }
    endShape(CLOSE);
  } else if (shapeType === 0 && targetShapeType === 4) {
    beginShape();
    let sides = floor(lerp(4, random(5, 8), t));
    for (let a = 0; a < TWO_PI; a += TWO_PI / sides) {
      let r = mixedSize / 2 * (0.8 + 0.2 * noise(a * 0.5));
      vertex(cos(a) * r, sin(a) * r);
    }
    endShape(CLOSE);
  } else {
    drawShape(targetShapeType, mixedSize);
  }
}