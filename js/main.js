window.currentStep = 0;
window.language = 'ru';
window.timeOnPage = 0;
window.weirdnessFactor = 0;
window.simplifyAnimations = false;
window.uploadedImageUrl = '';
window.portraitUrls = [
  'https://via.placeholder.com/300',
  'https://via.placeholder.com/300',
  'https://via.placeholder.com/300'
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
  updateContinueButton();
  window.debancedNextStep();
}

function updateContinueButton() {
  const continueButton = document.getElementById('continueButton');
  continueButton.textContent = window.language === 'ru' ? 'Продолжить' : 'Continue';
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
  updateContinueButton();

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
  updateContinueButton();

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
  window.typeText('typewriter0', window.translations.step0[window.language]);
}

function openGallery() {
  const gallery = document.getElementById('portraitGallery');
  gallery.style.display = 'flex';
  gallery.innerHTML = '';
  window.portraitUrls.forEach((url, index) => {
    const portrait = document.createElement('div');
    portrait.className = 'portrait';
    portrait.style.backgroundImage = `url(${url})`;
    portrait.style.backgroundSize = 'cover';
    portrait.addEventListener('click', () => {
      window.uploadedImageUrl = url;
      handleFile({ type: 'image', data: url });
      gallery.style.display = 'none';
      window.debouncedNextStep();
    });
    gallery.appendChild(portrait);
  });
}

function saveCurrentState() {
  if (window.canvas) {
    const link = document.createElement('a');
    link.download = 'quantum_portrait.png';
    link.href = window.canvas.elt.toDataURL('image/png');
    link.click();
  }
}

function shareObservation() {
  alert(window.language === 'ru' ? 'Функция поделиться в разработке!' : 'Share function is under development!');
}

function goToArchive() {
  alert(window.language === 'ru' ? 'Архив в разработке!' : 'Archive is under development!');
}

function openAuthors() {
  document.getElementById('authorsPage').style.display = 'block';
}

function closeAuthors() {
  document.getElementById('authorsPage').style.display = 'none';
}

function simplifyAnimation() {
  window.simplifyAnimations = true;
  window.maxParticles = Math.floor(window.maxParticles / 2);
  window.particles = window.particles.slice(0, window.maxParticles);
  window.quantumStates = window.quantumStates.slice(0, window.maxParticles);
}

function triggerFlash() {
  const flash = document.getElementById('flashEffect');
  flash.classList.add('active');
  setTimeout(() => flash.classList.remove('active'), 300);
}

document.addEventListener('DOMContentLoaded', () => {
  window.canvas = createCanvas(windowWidth, windowHeight - 100);
  window.canvas.elt.style.display = 'none';
  document.getElementById('imageInput').addEventListener('change', (event) => {
    if (event.target.files[0]) {
      window.uploadedImageUrl = URL.createObjectURL(event.target.files[0]);
      handleFile({ type: 'image', data: window.uploadedImageUrl });
    }
  });
});
