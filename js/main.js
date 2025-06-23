let sketch = function(p) {
  p.setup = function() {
    window.p5Instance = p;
    let containerId = window.currentStep === 5 ? 'canvasContainer5' : 'canvasContainer4';
    window.p5Canvas = p.createCanvas(p.windowWidth, p.windowHeight - 100);
    window.p5Canvas.parent(containerId);
    p.pixelDensity(1);
    p.frameRate(navigator.hardwareConcurrency < 4 ? 20 : 25);
    p.noLoop();
    window.p5Canvas.elt.style.display = 'block';
    window.p5Canvas.elt.style.position = 'absolute';
    window.p5Canvas.elt.style.top = '100px';
    window.p5Canvas.elt.style.left = '0';
    window.p5Canvas.elt.style.zIndex = '-1';
    let container = document.getElementById(containerId);
    container.style.zIndex = '1';
    container.style.position = 'relative';
    container.style.border = 'none';
    window.trailBuffer = p.createGraphics(p.width, p.height);
    window.trailBuffer.pixelDensity(1);
    window.isCanvasReady = true;
    console.log('p5.js canvas initialized for', containerId);
    if (window.currentStep >= 4 && window.img) {
      p.loop();
    }
  };

  p.draw = function() {
    if (typeof window.draw === 'function') {
      window.draw();
    }
  };
};

// Объект с переводами
const translations = {
  en: {
    title: "Quantum Portrait",
    step1: "Step 1: Upload an Image",
    step2: "Step 2: Process Image",
    step3: "Step 3: Analyze",
    step4: "Step 4: Quantum Transformation",
    step5: "Step 5: Interact and Save",
    uploadButton: "Upload Image",
    saveButton: "Save"
  },
  ru: {
    title: "Квантовый портрет",
    step1: "Шаг 1: Загрузите изображение",
    step2: "Шаг 2: Обработка изображения",
    step3: "Шаг 3: Анализ",
    step4: "Шаг 4: Квантовая трансформация",
    step5: "Шаг 5: Взаимодействие и сохранение",
    uploadButton: "Загрузить изображение",
    saveButton: "Сохранить"
  }
};

window.selectLanguage = function(lang) {
  if (!translations[lang]) {
    console.warn(`Language ${lang} not supported, defaulting to 'en'`);
    lang = 'en';
  }
  localStorage.setItem('language', lang);
  console.log('Language set to:', lang);

  // Обновление текста на странице
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });

  // Обновление заголовка страницы
  document.title = translations[lang].title;
};

document.addEventListener('DOMContentLoaded', () => {
  window.cursorX = 0;
  window.cursorY = 0;
  window.currentStep = 1;
  window.isPaused = false;
  window.simplifyAnimations = false;
  window.weirdnessFactor = 0.5;

  // Загрузка сохранённого языка или установка по умолчанию
  const savedLang = localStorage.getItem('language') || 'en';
  window.selectLanguage(savedLang);

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
          console.log('Image loaded into p5.js:', img.src);
          if (window.currentStep >= 4 && window.isCanvasReady) {
            window.p5Instance.loop();
          }
        };
      };
      reader.readAsDataURL(file);
    }
  });

  const steps = document.querySelectorAll('.step');
  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      window.currentStep = index + 1;
      console.log('Current step:', window.currentStep);
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
      if (window.currentStep >= 4 && window.img && window.isCanvasReady) {
        window.frame = 0;
        window.particles = [];
        window.quantumStates = [];
        window.entangledPairs = [];
        window.p5Instance.loop();
        console.log('Animation restarted for step', window.currentStep);
      } else {
        window.p5Instance.noLoop();
      }
      if (window.currentStep === 5) {
        document.getElementById('saveButton').style.display = window.isPaused ? 'block' : 'none';
      } else {
        document.getElementById('saveButton').style.display = 'none';
      }
    });
  });
});
