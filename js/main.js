let sketch = function(p) {
  p.setup = function() {
    window.p5Instance = p;
    let containerId = window.currentStep === 5 ? 'canvasContainer5' : window.currentStep === 4 ? 'canvasContainer4' : 'canvasContainer3';
    window.p5Canvas = p.createCanvas(320, 320, p.P2D, { willReadFrequently: true });
    window.p5Canvas.parent(containerId);
    p.pixelDensity(1);
    p.frameRate(navigator.hardwareConcurrency < 4 ? 20 : 25);
    window.p5Canvas.elt.style.display = 'block';
    window.trailBuffer = p.createGraphics(p.width, p.height);
    window.trailBuffer.pixelDensity(1);
    window.isCanvasReady = true;
    console.log('p5.js canvas initialized for', containerId);
    if (window.currentStep >= 3 && window.img) {
      p.loop(); // Убедимся, что анимация запускается
    }
  };

  p.draw = function() {
    if (typeof window.draw === 'function') {
      window.draw();
    }
  };
};

window.selectLanguage = function(lang) {
  if (!window.translations || !window.translations[lang]) {
    console.warn(`Language ${lang} not supported or translations not loaded, defaulting to 'ru'`);
    lang = 'ru';
    if (!window.translations) {
      console.error('Translations object is undefined. Ensure globals.js is loaded correctly.');
      return;
    }
  }
  window.language = lang;
  localStorage.setItem('language', lang);
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (window.translations[lang][key]) {
      element.textContent = window.translations[lang][key];
    }
  });
  document.title = window.translations[lang].title || 'Quantum Portrait';
  goToStep(1);
};

window.goToStep = function(step) {
  window.currentStep = step;
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step${step}`).classList.add('active');
  if (step === 0) {
    window.typeText('typewriter0', window.translations[window.language].step0);
  } else if (step === 1) {
    setTimeout(() => {
      window.typeText('typewriter1', [
        { text: window.translations[window.language].step1_part1, speed: () => 70 },
        { text: window.translations[window.language].step1_part2, speed: () => 35 + Math.random() * 5, delay: 700 }
      ], () => {
        document.querySelector('#step1 .continue-button').style.display = 'block';
      });
      triggerFlashEffect();
    }, 600);
  } else if (step === 2) {
    window.typeText('typewriter2', window.translations[window.language].step2);
  } else if (step === 3) {
    window.typeText('typewriter3', window.translations[window.language].step3);
    if (window.img && window.isCanvasReady) {
      window.p5Instance.loop();
    }
  } else if (step === 4) {
    window.typeText('typewriter4', window.translations[window.language].step4);
    if (window.img && window.isCanvasReady) {
      window.p5Instance.loop();
    }
  } else if (step === 5) {
    window.typeText('typewriter5', window.translations[window.language].step5);
    if (window.img && window.isCanvasReady) {
      window.p5Instance.loop();
    }
  } else if (step === 6) {
    window.typeText('typewriter6', window.translations[window.language].step6);
  } else if (step === 7) {
    window.typeText('typewriter7', window.translations[window.language].step7);
  }
  // Показываем кнопку "Продолжить" на всех шагах
  document.querySelectorAll('.continue-button').forEach(btn => {
    btn.style.display = 'block'; // Убедимся, что кнопка видима
  });
};

window.showPreview = function(img) {
  const preview = document.getElementById('previewImage');
  preview.src = img.src;
  preview.classList.add('active');
  setTimeout(() => {
    window.typeText('typewriter2_response', window.translations[window.language].step2Images, () => {
      document.querySelector('#step2 .continue-button').style.display = 'block';
    });
  }, 500);
};

window.triggerFlashEffect = function() {
  const flash = document.getElementById('flashEffect');
  flash.style.opacity = '0.3';
  setTimeout(() => flash.style.opacity = '0', 100);
};

window.saveObservation = function() {
  window.isPaused = true;
  window.p5Instance.noLoop();
  window.p5Instance.saveCanvas('quantum_portrait', 'png');
};

window.shareObservation = function() {
  const url = 'https://t.me/share/url?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent('My quantum portrait!');
  window.open(url, '_blank');
};

window.restart = function() {
  window.currentStep = 0;
  window.img = null;
  window.particles = [];
  window.quantumStates = [];
  window.p5Instance.noLoop();
  goToStep(0);
};

window.goToArchive = function() {
  alert('Archive of observations is not available yet.');
};

window.showAuthors = function() {
  document.getElementById('authorsPage').style.display = 'flex';
};

window.hideAuthors = function() {
  document.getElementById('authorsPage').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
  window.cursorX = 0;
  window.cursorY = 0;
  window.currentStep = 0;
  window.isPaused = false;
  window.weirdnessFactor = 0.5;
  console.log('Translations:', window.translations); // Для отладки
  const checkTranslations = () => {
    if (window.translations) {
      const savedLang = localStorage.getItem('language') || 'ru';
      window.selectLanguage(savedLang);
    } else {
      console.warn('Translations not loaded, retrying...');
      setTimeout(checkTranslations, 100);
    }
  };
  checkTranslations();
  new p5(sketch);

  const imageInput = document.getElementById('imageInput');
  imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          window.img = window.p5Instance.createImage(img.width, img.height);
          window.img.drawingContext.drawImage(img, 0, 0);
          window.img.loadPixels();
          showPreview(img);
        };
      };
      reader.readAsDataURL(file);
    }
  });

  const cameraButton = document.getElementById('cameraButton');
  cameraButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.play();
        video.style.display = 'block';
        const takePhotoButton = document.createElement('button');
        takePhotoButton.textContent = 'Take Photo';
        takePhotoButton.className = 'button';
        document.querySelector('#step2 .button-container').appendChild(takePhotoButton);
        takePhotoButton.onclick = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);
          const img = new Image();
          img.src = canvas.toDataURL('image/png');
          img.onload = () => {
            window.img = window.p5Instance.createImage(img.width, img.height);
            window.img.drawingContext.drawImage(img, 0, 0);
            window.img.loadPixels();
            showPreview(img);
            video.srcObject.getTracks().forEach(track => track.stop());
            video.style.display = 'none';
            takePhotoButton.remove();
          };
        };
      })
      .catch(err => console.error('Camera access error:', err));
  });

  const archiveButton = document.getElementById('archiveButton');
  archiveButton.addEventListener('click', () => {
    const gallery = document.createElement('div');
    gallery.id = 'portraitGallery';
    window.portraitUrls.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.onclick = () => {
        const selectedImg = new Image();
        selectedImg.src = url;
        selectedImg.onload = () => {
          window.img = window.p5Instance.createImage(selectedImg.width, selectedImg.height);
          window.img.drawingContext.drawImage(img, 0, 0);
          window.img.loadPixels();
          showPreview(selectedImg);
          gallery.remove();
        };
      };
      gallery.appendChild(img);
    });
    document.body.appendChild(gallery);
  });
});
