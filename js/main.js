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
  document.getElementById('continueButton').textContent = language === 'ru' ? 'Продолжить / Continue' : 'Continue';
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