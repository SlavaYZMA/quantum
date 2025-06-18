// main.js

// Общие переменные
window.currentStep = 0;
window.language = 'ru';
window.timeOnPage = 0;
window.weirdnessFactor = 0;
window.simplifyAnimations = false;
window.uploadedImageUrl = '';
window.portraitUrls = [
  'https://via.placeholder.com/100',
  'https://via.placeholder.com/100',
  'https://via.placeholder.com/100'
];
window.img = null;

let startTime = performance.now();
setInterval(() => {
  window.timeOnPage = (performance.now() - startTime) / 1000;
  window.weirdnessFactor = Math.min(window.timeOnPage / 300, 1);
}, 1000);

window.debounce = function(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

window.debouncedNextStep = window.debounce(nextStep, 300);
window.debouncedGoBack = window.debounce(goBack, 300);

function selectLanguage(lang) {
  window.language = lang;
  updateContinueButtonText();
  window.debouncedNextStep();
}

function showCanvas(containerId) {
  if (!window.canvas) {
    console.error(`Канва не создана для ${containerId}!`);
    return;
  }
  const canvasElement = window.canvas.elt;
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
  if (window.canvas) {
    window.canvas.elt.style.display = 'none';
  }
}

function showPreviewImage(step) {
  const previewImage = document.getElementById(`previewImage${step}`);
  if (previewImage && window.uploadedImageUrl) {
    previewImage.src = window.uploadedImageUrl;
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
  if (window.currentStep >= 7) return;

  if (window.currentStep >= 2 && !window.img) {
    alert(window.language === 'ru' ? 'Пожалуйста, загрузите фото или выберите из архива.' : 'Please upload a photo or select from the archive.');
    return;
  }

  const currentStepElement = document.querySelector(`#step${window.currentStep}`);
  if (currentStepElement) currentStepElement.classList.remove('active');

  window.currentStep++;
  const nextStepElement = document.querySelector(`#step${window.currentStep}`);
  if (!nextStepElement) {
    console.error(`Шаг ${window.currentStep} не найден!`);
    window.currentStep--;
    return;
  }

  nextStepElement.classList.add('active');
  document.getElementById('backButton').style.display = window.currentStep > 0 ? 'block' : 'none';
  document.getElementById('continueButton').style.display = window.currentStep > 0 && window.currentStep < 7 ? 'block' : 'none';
  updateContinueButtonState();

  if (window.currentStep === 1) {
    triggerFlash();
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  } else if (window.currentStep === 2) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  } else if (window.currentStep === 3) {
    if (!window.img) {
      window.debouncedGoBack();
      return;
    }
    triggerFlash();
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  } else if (window.currentStep === 4) {
    if (window.isCanvasReady) {
      showCanvas('canvasContainer4');
      showPreviewImage(4);
      loop();
    } else {
      setTimeout(() => {
        if (window.isCanvasReady) {
          showCanvas('canvasContainer4');
          showPreviewImage(4);
          loop();
        }
      }, 500);
    }
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  } else if (window.currentStep === 5) {
    if (window.isCanvasReady) {
      showCanvas('canvasContainer5');
      showPreviewImage(5);
      if (!window.isPaused) loop();
    } else {
      setTimeout(() => {
        if (window.isCanvasReady) {
          showCanvas('canvasContainer5');
          showPreviewImage(5);
          if (!window.isPaused) loop();
        }
      }, 500);
    }
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  } else if (window.currentStep === 6) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    noLoop();
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  } else if (window.currentStep === 7) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  }
}

function goBack() {
  if (window.currentStep <= 0) return;

  const currentStepElement = document.querySelector(`#step${window.currentStep}`);
  if (currentStepElement) currentStepElement.classList.remove('active');

  window.currentStep--;
  const previousStepElement = document.querySelector(`#step${window.currentStep}`);
  if (!previousStepElement) {
    console.error(`Шаг ${window.currentStep} не найден!`);
    window.currentStep++;
    return;
  }

  previousStepElement.classList.add('active');
  document.getElementById('backButton').style.display = window.currentStep > 0 ? 'block' : 'none';
  document.getElementById('continueButton').style.display = window.currentStep > 0 && window.currentStep < 7 ? 'block' : 'none';
  updateContinueButtonState();

  if (window.currentStep === 0) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    const step0Buttons = document.getElementById('step0Buttons');
    step0Buttons.innerHTML = `
      <button class="button" aria-label="Выбрать русский язык" onclick="selectLanguage('ru')">RU</button>
      <button class="button" aria-label="Выбрать английский язык" onclick="selectLanguage('en')">ENG</button>
    `;
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  } else if (window.currentStep === 1) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  } else if (window.currentStep === 2) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    document.getElementById('portraitGallery').style.display = 'none';
    noLoop();
    window.particles = [];
    window.quantumStates = [];
    window.frame = 0;
    window.isPaused = false;
    window.img = null;
    const step2Buttons = document.getElementById('step2Buttons');
    step2Buttons.innerHTML = `
      <input type="file" id="imageInput" accept="image/*" style="display: none;">
      <button class="button" aria-label="Загрузить фото" onclick="document.getElementById('imageInput').click()">${window.language === 'ru' ? 'Загрузить фото' : 'Upload Photo'}</button>
      <button class="button" aria-label="Выбрать из архива" onclick="openGallery()">${window.language === 'ru' ? 'Выбрать готовое' : 'Select from Archive'}</button>
    `;
    window.typeText('typewriter2', window.translations.step2[window.language]);
  } else if (window.currentStep === 3) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    noLoop();
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  } else if (window.currentStep === 4) {
    if (window.isCanvasReady) {
      showCanvas('canvasContainer4');
      showPreviewImage(4);
      if (!window.isPaused) loop();
    } else {
      setTimeout(() => {
        if (window.isCanvasReady) {
          showCanvas('canvasContainer4');
          showPreviewImage(4);
          if (!window.isPaused) loop();
        }
      }, 500);
    }
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  } else if (window.currentStep === 5) {
    if (window.isCanvasReady) {
      showCanvas('canvasContainer5');
      showPreviewImage(5);
      if (!window.isPaused) loop();
    } else {
      setTimeout(() => {
        if (window.isCanvasReady) {
          showCanvas('canvasContainer5');
          showPreviewImage(5);
          if (!window.isPaused) loop();
        }
      }, 500);
    }
    document.getElementById('saveButton').style.display = window.isPaused ? 'block' : 'none';
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  } else if (window.currentStep === 6) {
    hideCanvas();
    hidePreviewImage(4);
    hidePreviewImage(5);
    noLoop();
    window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
  }
}

function restart() {
  window.currentStep = 0;
  window.language = 'ru';
  window.img = null;
  window.frame = 0;
  window.isPaused = false;
  window.particles = [];
  window.quantumStates = [];
  window.isCanvasReady = false;
  window.timeOnPage = 0;
  window.weirdnessFactor = 0;
  window.simplifyAnimations = false;
  window.uploadedImageUrl = '';
  startTime = performance.now();

  if (window.canvas) {
    window.canvas.remove();
    window.canvas = null;
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

  window.typeText('typewriter0', window.translations.step0[window.language]);

  window.setup();
}

window.onload = () => {
  document.getElementById('step0').classList.add('active');
  window.typeText('typewriter0', window.translations.step0[window.language]);
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
    window.uploadedImageUrl = url;
    loadImageFromUrl(url);
  }
});

function openGallery() {
  const gallery = document.getElementById('portraitGallery');
  gallery.innerHTML = '';
  gallery.style.display = 'flex';
  window.portraitUrls.forEach((url, index) => {
    const div = document.createElement('div');
    div.className = 'portrait';
    div.style.backgroundImage = `url('${url}')`;
    div.setAttribute('aria-label', `Портрет ${index + 1}`);
    div.onclick = () => {
      window.uploadedImageUrl = url;
      loadImageFromUrl(url);
      gallery.style.display = 'none';
    };
    gallery.appendChild(div);
  });
}

function loadImageFromUrl(url) {
  document.getElementById('loader').style.display = 'block';
  loadImage(url, (loadedImg) => {
    window.img = loadedImg;
    document.getElementById('portraitGallery').style.display = 'none';
    const typewriter2 = document.getElementById('typewriter2');
    typewriter2.innerHTML = '';
    const step2Buttons = document.getElementById('step2Buttons');
    step2Buttons.innerHTML = '';
    window.typeText('typewriter2', window.translations.step2_after[window.language]);
    document.getElementById('loader').style.display = 'none';
    updateContinueButtonState();
  }, () => {
    document.getElementById('loader').style.display = 'none';
    alert(window.language === 'ru' ? 'Ошибка загрузки изображения. Попробуйте другое.' : 'Image loading error. Please try another.');
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
    alert(window.language === 'ru' ? 'Ссылка открыта в новой вкладке.' : 'Link opened in a new tab.');
  } catch (e) {
    console.error('Ошибка при открытии ссылки:', e);
    alert(window.language === 'ru' ? 'Не удалось открыть ссылку. Проверьте настройки браузера.' : 'Failed to open link. Check browser settings.');
  }
}

function goToArchive() {
  try {
    window.open('https://t.me/quantportrat', '_blank');
    alert(window.language === 'ru' ? 'Ссылка открыта в новой вкладке.' : 'Link opened in a new tab.');
  } catch (e) {
    console.error('Ошибка при открытии ссылки:', e);
    alert(window.language === 'ru' ? 'Не удалось открыть ссылку. Проверьте настройки браузера.' : 'Failed to open link. Check browser settings.');
  }
}

function saveCurrentState() {
  try {
    if (!window.canvas) {
      alert(window.language === 'ru' ? 'Canvas не найден. Убедитесь, что изображение отображается.' : 'Canvas not found. Ensure the image is displayed.');
      return;
    }
    const dataURL = window.canvas.elt.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'quantum-portrait.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(window.language === 'ru' ? 'Изображение сохранено как quantum-portrait.png' : 'Image saved as quantum-portrait.png');
  } catch (e) {
    console.error('Ошибка сохранения изображения:', e);
    alert(window.language === 'ru' ? 'Не удалось сохранить изображение. Попробуйте загрузить сайт на хостинг.' : 'Failed to save image. Try hosting the site.');
  }
}

function updateContinueButtonText() {
  document.getElementById('continueButton').textContent = window.language === 'ru' ? 'Продолжить / Continue' : 'Continue';
}

function updateContinueButtonState() {
  document.getElementById('continueButton').disabled = window.currentStep === 2 && !window.img;
}

function triggerFlash() {
  document.getElementById('noiseOverlay').style.opacity = '0.1';
  setTimeout(() => document.getElementById('noiseOverlay').style.opacity = '0', 1000);
  document.getElementById('flashEffect').classList.add('active');
}