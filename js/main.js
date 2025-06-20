document.addEventListener('DOMContentLoaded', () => {
  let initInterval;
  let initAttempts = 0;
  const maxAttempts = 20;

  function initializeP5() {
    if (typeof createCanvas === 'undefined') {
      console.warn('p5.js is not yet loaded, retrying...');
      initAttempts++;
      if (initAttempts >= maxAttempts) {
        clearInterval(initInterval);
        console.error('Failed to load p5.js after multiple attempts');
        document.getElementById('loader').textContent = 'Ошибка загрузки: p5.js не доступен. Пожалуйста, проверьте интернет-соединение.';
        return false;
      }
      return false;
    }

    clearInterval(initInterval);
    console.log('p5.js loaded successfully');

    // Инициализация холста p5.js
    window.setup = function() {
      try {
        window.p5Canvas = createCanvas(windowWidth, windowHeight - 100);
        if (window.p5Canvas) {
          window.p5Canvas.elt.style.display = 'none';
          window.isCanvasReady = true;
          console.log('p5.js canvas initialized');
          updateStep(); // Вызываем updateStep после создания холста
          if (window.img) initializeParticles();
        } else {
          console.error('Failed to create p5.js canvas');
          document.getElementById('loader').textContent = 'Ошибка: не удалось создать холст p5.js';
        }
      } catch (e) {
        console.error('Error in p5.js setup:', e);
        document.getElementById('loader').textContent = 'Ошибка инициализации p5.js';
      }
    };

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

        loadImage(file.data, (loadedImg) => {
          console.log('Image loaded into p5.js:', file.data);
          window.img = loadedImg;
          window.currentStep = 3;
          updateStep();
          if (window.isCanvasReady) {
            initializeParticles();
          } else {
            console.warn('Canvas not ready, deferring particle initialization');
          }
        }, (error) => {
          console.error('Failed to load image in p5.js:', error);
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
        if (window.p5Canvas && window.p5Canvas.elt) {
          window.p5Canvas.elt.style.display = 'block';
          const container = document.getElementById(`canvasContainer${window.currentStep}`);
          if (container && !container.contains(window.p5Canvas.elt)) {
            container.appendChild(window.p5Canvas.elt);
          }
        } else {
          console.warn('p5Canvas is not initialized, skipping canvas display');
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
      if (window.p5Canvas) {
        saveCanvas(window.p5Canvas, 'quantum_portrait', 'png');
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

    // Инициализация первого шага только если холст не нужен
    if (window.currentStep === 0) {
      updateStep();
    }
  }

  // Пытаемся инициализировать сразу
  if (!initializeP5()) {
    // Если p5.js не загружен, повторяем попытки каждые 1000 мс
    initInterval = setInterval(() => {
      if (initializeP5()) {
        clearInterval(initInterval);
      }
    }, 1000);
  }
});
