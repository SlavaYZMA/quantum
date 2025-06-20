document.addEventListener('DOMContentLoaded', () => {
  let initInterval;
  let initAttempts = 0;
  const maxAttempts = 20;

  function initializeP5() {
    if (typeof p5 === 'undefined') {
      console.warn('p5.js is not yet loaded, retrying...');
      initAttempts++;
      if (initAttempts >= maxAttempts) {
        clearInterval(initInterval);
        console.error('Failed to load p5.js after multiple attempts');
        document.getElementById('loader').textContent = 'Ошибка загрузки: p5.js не доступен. Пожалуйста, проверьте интернет-соединение.';
        return;
      }
      return;
    }

    clearInterval(initInterval);
    console.log('p5.js loaded successfully');

    // Используем instance mode для p5.js
    new p5((sketch) => {
      window.p5Instance = sketch;

      sketch.setup = function() {
        try {
          window.p5Canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight - 100);
          if (window.p5Canvas) {
            window.p5Canvas.elt.style.display = 'none';
            window.isCanvasReady = true;
            console.log('p5.js canvas initialized');
            updateStep();
            if (window.img) {
              console.log('Image exists, initializing particles');
              setTimeout(() => initializeParticles(), 100);
            }
          } else {
            console.error('Failed to create p5.js canvas');
            document.getElementById('loader').textContent = 'Ошибка: не удалось создать холст p5.js';
          }
        } catch (e) {
          console.error('Error in p5.js setup:', e);
          document.getElementById('loader').textContent = 'Ошибка инициализации p5.js';
        }
      };

      // Переносим draw в particles.js, но оставляем заглушку
      sketch.draw = function() {
        if (window.draw) {
          window.draw();
        }
      };
    });
  }

  // Обработчик загрузки изображения
  document.getElementById('imageInput').addEventListener('change', (event) => {
    if (event.target.files[0]) {
      window.uploadedImageUrl = URL.createObjectURL(event.target.files[0]);
      console.log('Image uploaded:', window.uploadedImageUrl);
      handleFile({ type: 'image', data: window.uploadedImageUrl });
    }
  });

  // Функция обработки загруженного изображения
  window.handleFile = function(file) {
    if (file.type === 'image') {
      // Устанавливаем изображение для предпросмотра
      const previewImage4 = document.getElementById('previewImage4');
      const previewImage5 = document.getElementById('previewImage5');
      if (previewImage4) {
        previewImage4.src = file.data;
        previewImage4.style.display = 'block';
      }
      if (previewImage5) {
        previewImage5.src = file.data;
        previewImage5.style.display = 'block';
      }

      window.p5Instance.loadImage(file.data, (loadedImg) => {
        console.log('Image loaded into p5.js:', file.data);
        window.img = loadedImg;
        window.currentStep = 4; // Переходим сразу на шаг 4
        updateStep();
        if (window.isCanvasReady) {
          console.log('Canvas ready, initializing particles');
          initializeParticles();
        } else {
          console.warn('Canvas not ready, deferring particle initialization');
          setTimeout(() => {
            if (window.isCanvasReady) {
              console.log('Retrying particle initialization');
              initializeParticles();
            }
          }, 500);
        }
      }, (error) => {
        console.error('Failed to load image in p5.js:', error);
      });
    }
  };

  // Обновление шага приложения
  function updateStep() {
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
      if (window.p5Canvas && window.p5Canvas.elt) {
        window.p5Canvas.elt.style.display = 'block';
        const container = document.getElementById(`canvasContainer${window.currentStep}`);
        if (container && !container.contains(window.p5Canvas.elt)) {
          container.appendChild(window.p5Canvas.elt);
          console.log(`Canvas attached to canvasContainer${window.currentStep}`);
        }
      } else {
        console.error('p5Canvas is not initialized, skipping canvas display');
      }
    } else if (window.p5Canvas && window.p5Canvas.elt) {
      window.p5Canvas.elt.style.display = 'none';
    }

    // Запускаем текст для текущего шага
    if (window.translations[`step${window.currentStep}`]) {
      window.typeText(`typewriter${window.currentStep}`, window.translations[`step${window.currentStep}`][window.language], () => {
        document.getElementById('continueButton').disabled = false;
      });
    }
  }

  // Переход к следующему шагу
  window.debouncedNextStep = window.debounce(() => {
    if (window.currentStep < 7) {
      window.currentStep++;
      updateStep();
    }
  }, 500);

  // Переход к предыдущему шагу
  window.debouncedGoBack = window.debounce(() => {
    if (window.currentStep > 0) {
      window.currentStep--;
      updateStep();
    }
  }, 500);

  // Выбор языка
  window.selectLanguage = function(lang) {
    window.language = lang;
    window.currentStep = 2;
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
    if (window.p5Canvas) {
      window.p5Instance.saveCanvas(window.p5Canvas, 'quantum_portrait', 'png');
    } else {
      console.error('Cannot save canvas: p5Canvas is not initialized');
    }
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

  // Поделиться наблюдением
  window.shareObservation = function() {
    alert('Функция поделиться пока не реализована!');
  };

  // Переход в архив
  window.goToArchive = function() {
    alert('Архив пока недоступен!');
  };

  // Инициализация первого шага
  if (window.currentStep === 0) {
    updateStep();
  }

  // Пытаемся инициализировать сразу
  if (!initializeP5()) {
    // Если p5.js не загружен, повторяем попытки каждые 500 мс
    initInterval = setInterval(() => {
      if (initializeP5()) {
        clearInterval(initInterval);
      }
    }, 500);
  }
});
