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
    window.textMessages = { active: null, queue: [] };
    window.noiseCache = new Map();
    window.frame = 0;
    window.particles = [];
    window.quantumStates = [];
    window.entangledPairs = [];
    window.weirdnessFactor = 0.5; // Для глитч-эффектов
    window.simplifyAnimations = false;
    window.cursorX = p.width / 2;
    window.cursorY = p.height / 2;
    console.log('p5.js canvas initialized for', containerId);
    if (window.currentStep >= 4 && window.img) {
      p.loop();
    }
  };

  p.draw = function() {
    p.background(0);
    window.frame++;
    
    // Логика шагов сценария
    if (window.currentStep === 0) {
      // Шаг 0: Выбор языка
      window.typeText('stepDisplay', window.translations[localStorage.getItem('language') || 'en'].welcomeMessage, () => {
        console.log('Welcome message completed');
      });
    } else if (window.currentStep === 1) {
      // Шаг 1: Приветствие
      window.typeText('stepDisplay', window.translations[localStorage.getItem('language') || 'en'].step1Messages.join('\n'), () => {
        console.log('Step 1 completed');
      });
    } else if (window.currentStep === 2) {
      // Шаг 2: Загрузка изображения
      window.typeText('stepDisplay', window.translations[localStorage.getItem('language') || 'en'].step2Messages.join('\n'), () => {
        console.log('Step 2 completed');
      });
    } else if (window.currentStep === 3) {
      // Шаг 3: Анализ
      window.typeText('stepDisplay', window.translations[localStorage.getItem('language') || 'en'].step3Messages.join('\n'), () => {
        console.log('Step 3 completed');
      });
    } else if (window.currentStep === 4) {
      // Шаг 4: Квантовая трансформация
      if (window.img) {
        let blocks = renderTransformingPortrait();
        if (!window.particles.length) {
          initializeParticles(blocks);
        }
        for (let i = 0; i < window.particles.length; i++) {
          updateParticle(window.particles[i], window.quantumStates[i]);
          renderParticle(window.particles[i], window.quantumStates[i]);
        }
        renderInterference();
        renderQuantumMessages();
      }
      window.typeText('stepDisplay', window.translations[localStorage.getItem('language') || 'en'].step4Messages.join('\n'), () => {
        console.log('Step 4 completed');
      });
    } else if (window.currentStep === 5) {
      // Шаг 5: Взаимодействие и сохранение
      if (window.img) {
        for (let i = 0; i < window.particles.length; i++) {
          updateParticle(window.particles[i], window.quantumStates[i]);
          renderParticle(window.particles[i], window.quantumStates[i]);
        }
        renderInterference();
        renderQuantumMessages();
      }
      window.typeText('stepDisplay', window.translations[localStorage.getItem('language') || 'en'].step5Messages.join('\n'), () => {
        console.log('Step 5 completed');
      });
    }
  };

  p.mouseMoved = function() {
    window.cursorX = p.mouseX;
    window.cursorY = p.mouseY;
    if (window.currentStep >= 4) {
      window.addQuantumMessage('Коллапс: измерение вызвало выбор одного состояния.', 'collapse');
    }
  };
};

const translations = {
  en: {
    welcomeMessage: 'Please select a language RU/ENG',
    step1Messages: [
      'STATUS: OBSERVER CONNECTED',
      'What can Schrödinger teach us about digital identification?',
      'Welcome to the experimental zone.',
      'Here, observation = interference.'
    ],
    step2Messages: [
      'Step 1: Scan the face of superposition.',
      'You can upload an image, activate the camera, or select from the archive.',
      'Image accepted.',
      'Wave function initiated.',
      'System ready for initialization.'
    ],
    step3Messages: [
      'Step 2: Initialization',
      'Image converted to pixel grid.',
      'Each pixel assigned parameters (x, y, brightness, color).',
      'Wave function constructed: ψ(x, y, t).',
      'Evolution equation: iℏ ∂ψ/∂t = Ĥψ, where Ĥ = -½∇² + V(x, y)',
      'Potential V(x, y) formed from image visual characteristics.',
      'System enters temporal simulation mode.',
      'Portrait exists as a superposition of possible states.'
    ],
    step4Messages: [
      'Step 3: BEGIN OBSERVATION',
      'Move your cursor over the image.',
      'Each gesture triggers a collapse.',
      'System responds. The observed image forms here and now.'
    ],
    step5Messages: [
      'Step 4: FIXATION',
      'Portrait is a process.',
      'But you can capture one moment.',
      'This will be one of the possible you.',
      'Step 5: SYSTEM RESPONSE',
      'This is not a portrait.',
      'This is the system’s reaction to you.',
      'You influenced the outcome.'
    ],
    quantumMessages: {
      superposition: 'Superposition: particle in multiple states simultaneously.',
      entanglement: 'Entanglement: two particles linked, states synchronized.',
      decoherence: 'Decoherence: particle lost quantum coherence.',
      tunneling: 'Tunneling: particle passed through a barrier.',
      collapse: 'Collapse: measurement caused state selection.',
      interference: 'Interference: wave patterns amplify or suppress each other.'
    }
  },
  ru: {
    welcomeMessage: 'Пожалуйста, выберите язык RU/ENG',
    step1Messages: [
      'СТАТУС: НАБЛЮДАТЕЛЬ ПОДКЛЮЧЁН',
      'Чему Шредингер может научить нас в области цифровой идентификации?',
      'Добро пожаловать в экспериментальную зону.',
      'Здесь наблюдение = вмешательство.'
    ],
    step2Messages: [
      'Шаг 1: Сканируйте лицо суперпозиции.',
      'Вы можете загрузить изображение, включить камеру или выбрать вариант из архива.',
      'Изображение принято.',
      'Запускается волновая функция.',
      'Система готова к инициализации.'
    ],
    step3Messages: [
      'Шаг 2: Инициализация',
      'Изображение преобразовано в пиксельную сетку.',
      'Каждому пикселю назначены параметры (x, y, яркость, цвет).',
      'Построена волновая функция: ψ(x, y, t).',
      'Уравнение эволюции: iℏ ∂ψ/∂t = Ĥψ, где Ĥ = -½∇² + V(x, y)',
      'Потенциал V(x, y) формируется из визуальных характеристик изображения.',
      'Система переходит в режим временной симуляции.',
      'Портрет существует как совокупность возможных состояний.'
    ],
    step4Messages: [
      'Шаг 3: НАЧНИТЕ НАБЛЮДЕНИЕ',
      'Двигайте курсором по изображению.',
      'Каждый ваш жест запускает коллапс.',
      'Система реагирует. Наблюдаемый образ формируется здесь и сейчас.'
    ],
    step5Messages: [
      'Шаг 4: ФИКСАЦИЯ',
      'Портрет — это процесс.',
      'Но ты можешь зафиксировать один миг.',
      'Это будет один из возможных тебя.',
      'Шаг 5: РЕАКЦИЯ СИСТЕМЫ',
      'Это не портрет.',
      'Это — реакция системы на тебя.',
      'Ты повлиял на исход.'
    ],
    quantumMessages: {
      superposition: 'Суперпозиция: частица в нескольких состояниях одновременно.',
      entanglement: 'Запутанность: две частицы связаны, их состояния синхронизированы.',
      decoherence: 'Декогеренция: частица потеряла квантовую когерентность.',
      tunneling: 'Туннелирование: частица преодолела барьер.',
      collapse: 'Коллапс: измерение вызвало выбор одного состояния.',
      interference: 'Интерференция: волновые узоры усиливают или подавляют друг друга.'
    }
  }
};

window.selectLanguage = function(lang) {
  if (!translations[lang]) {
    console.warn(`Language ${lang} not supported, defaulting to 'en'`);
    lang = 'en';
  }
  localStorage.setItem('language', lang);
  console.log('Language set to:', lang);

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });

  document.title = translations[lang].title;
};

document.addEventListener('DOMContentLoaded', () => {
  window.currentStep = 0; // Начинаем с шага 0
  const savedLang = localStorage.getItem('language') || 'en';
  window.selectLanguage(savedLang);

  // Создаём элемент для отображения текста шагов
  const stepDisplay = document.createElement('div');
  stepDisplay.id = 'stepDisplay';
  stepDisplay.style.position = 'absolute';
  stepDisplay.style.top = '150px';
  stepDisplay.style.left = '50px';
  stepDisplay.style.color = '#fff';
  stepDisplay.style.fontSize = '20px';
  stepDisplay.style.zIndex = '2';
  document.querySelector('.container').appendChild(stepDisplay);

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

  document.getElementById('saveButton').addEventListener('click', () => {
    if (window.p5Canvas && window.currentStep === 5 && window.isPaused) {
      window.p5Instance.saveCanvas('quantum_portrait', 'png');
    }
    window.typeText('stepDisplay', window.translations[localStorage.getItem('language') || 'en'].step5Messages.slice(4).join('\n'), () => {
      console.log('Step 5 response completed');
      // Добавляем кнопки для шага 6–7
      const shareButton = document.createElement('button');
      shareButton.textContent = window.translations[localStorage.getItem('language') || 'en'].shareButton || 'Share Observation';
      shareButton.style.position = 'absolute';
      shareButton.style.top = '300px';
      shareButton.style.left = '50px';
      shareButton.addEventListener('click', () => {
        window.location.href = 'https://t.me/quantum_portraits_archive'; // Ссылка на Telegram-архив
      });
      document.querySelector('.container').appendChild(shareButton);

      const restartButton = document.createElement('button');
      restartButton.textContent = window.translations[localStorage.getItem('language') || 'en'].restartButton || 'Start Over';
      restartButton.style.position = 'absolute';
      restartButton.style.top = '340px';
      restartButton.style.left = '50px';
      restartButton.addEventListener('click', () => {
        window.currentStep = 0;
        window.p5Instance.noLoop();
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        stepDisplay.innerHTML = '';
        shareButton.remove();
        restartButton.remove();
      });
      document.querySelector('.container').appendChild(restartButton);
    });
  });
});
