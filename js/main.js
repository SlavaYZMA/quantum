document.addEventListener('DOMContentLoaded', () => {
  if (typeof createCanvas === 'undefined') {
    console.error('p5.js is not loaded or createCanvas is undefined');
    return;
  }

  // Инициализация холста p5.js
  window.setup = function() {
    window.p5Canvas = createCanvas(windowWidth, windowHeight - 100);
    window.p5Canvas.elt.style.display = 'none';
    window.isCanvasReady = true;
    if (window.img) initializeParticles();
  };

  // Обработчик загрузки изображения
  document.getElementById('imageInput').addEventListener('change', (event) => {
    if (event.target.files[0]) {
      window.uploadedImageUrl = URL.createObjectURL(event.target.files[0]);
      handleFile({ type: 'image', data: window.uploadedImageUrl });
    }
  });

  // Функция обработки загруженного изображения
  window.handleFile = function(file) {
    if (file.type === 'image') {
      loadImage(file.data, (loadedImg) => {
        window.img = loadedImg;
        window.currentStep = 3;
        updateStep();
        initializeParticles();
      });
    }
  };

  // Обновление шага приложения
  window.updateStep = function() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === window.currentStep);
    });

    const backButton = document.getElementById('backButton');
    const continueButton = document.getElementById('continueButton');
    backButton.style.display = window.currentStep > 0 ? 'block' : 'none';
    continueButton.style.display = window.currentStep < 7 ? 'block' : 'none';

    // Отображаем холст на шагах 4 и 5
    if (window.currentStep === 4 || window.currentStep === 5) {
      window.p5Canvas.elt.style.display = 'block';
      const container = document.getElementById(`canvasContainer${window.currentStep}`);
      if (container && !container.contains(window.p5Canvas.elt)) {
        container.appendChild(window.p5Canvas.elt);
      }
    } else {
      window.p5Canvas.elt.style.display = 'none';
    }

    // Запускаем текст для текущего шага
    if (window.translations[`step${window.currentStep}`]) {
      window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language]);
    }
  };

  // Переход к следующему шагу
  window.debouncedNextStep = window.debounce(() => {
    if (window.currentStep < 7) {
      window.currentStep++;
      updateStep();
    }
  }, 300);

  // Переход к предыдущему шагу
  window.debouncedGoBack = window.debounce(() => {
    if (window.currentStep > 0) {
      window.currentStep--;
      updateStep();
    }
  }, 300);

  // Выбор языка
  window.selectLanguage = function(lang) {
    window.language = lang;
    window.currentStep = 1;
    updateStep();
  };

  // Открытие галереи
  window.openGallery = function() {
    const gallery = document.getElementById('portraitGallery');
    gallery.innerHTML = window.portraitUrls.map((url, index) => `
      <img src="${url}" alt="Portrait ${index + 1}" onclick="handleFile({ type: 'image', data: '${url}' })">
    `).join('');
    gallery.style.display = 'block';
  };

  // Сохранение текущего состояния
  window.saveCurrentState = function() {
    saveCanvas(window.p5Canvas, 'quantum_portrait', 'png');
  };

  // Перезапуск приложения
  window.restart = function() {
    window.currentStep = 0;
    window.img = null;
    window.uploadedImageUrl = '';
    window.particles = [];
    updateStep();
  };

  // Открытие страницы авторов
  window.openAuthors = function() {
    document.getElementById('authorsPage').style.display = 'block';
  };

  // Закрытие страницы авторов
  window.closeAuthors = function() {
    document.getElementById('authorsPage').style.display = 'none';
  };

  // Упрощение анимации
  window.simplifyAnimation = function() {
    window.simplifyAnimations = true;
    initializeParticles();
  };

  // Поделиться наблюдением
  window.shareObservation = function() {
    alert('Функция поделиться пока не реализована!');
  };

  // Переход в архив
  window.goToArchive = function() {
    alert('Архив пока недоступен!');
  };

  // Инициализация первого шага
  updateStep();
});
