// main.js
let currentStep = 0;
let language = 'ru';
let img = null;
let frame = 0;
let isPaused = false;
let particles = [];
let quantumStates = [];
let canvas = null;
let isCanvasReady = false;
let timeOnPage = 0;
let weirdnessFactor = 0;
let simplifyAnimations = false;
let uploadedImageUrl = '';
let cursorX = 0;
let cursorY = 0;

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

const debouncedNextStep = debounce(nextStep, 300);
const debouncedGoBack = debounce(goBack, 300);

let startTime = performance.now();
setInterval(() => {
  timeOnPage = (performance.now() - startTime) / 1000;
  weirdnessFactor = Math.min(timeOnPage / 300, 1);
}, 1000);

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
  const continueButton = document.getElementById('continueButton');
  if (continueButton) {
    continueButton.textContent = language === 'ru' ? 'Продолжить / Continue' : 'Continue';
  }
}

function updateContinueButtonState() {
  const continueButton = document.getElementById('continueButton');
  if (!continueButton) return;

  if (currentStep === 2 && !img) {
    continueButton.disabled = true;
  } else if (currentStep >= 1 && currentStep <= 6) {
    continueButton.disabled = false;
  } else {
    continueButton.disabled = true;
  }
}