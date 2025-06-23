window.language = 'ru';
window.currentStep = 0;
window.img = null;
window.frame = 0;
window.isPaused = false;
window.particles = [];
window.quantumStates = [];
window.p5Canvas = null;
window.isCanvasReady = false;
window.timeOnPage = 0;
window.weirdnessFactor = 0;
window.simplifyAnimations = false;
window.uploadedImageUrl = '';
window.cursorX = 0;
window.cursorY = 0;

window.portraitUrls = [
  'https://via.placeholder.com/100',
  'https://via.placeholder.com/100',
  'https://via.placeholder.com/100'
];

window.translations = {
  ru: {
    title: 'Квантовый портрет',
    step0: 'Пожалуйста, выберите язык\nRU / ENG',
    step1_part1: 'СТАТУС: НАБЛЮДАТЕЛЬ ПОДКЛЮЧЁН',
    step1_part2: '> Чему Шредингер может научить нас в области цифровой идентификации?\n> Добро пожаловать в экспериментальную зону.\n> Здесь наблюдение = вмешательство.',
    step2: 'Шаг 1: Сканируйте лицо суперпозиции.\nВы можете загрузить изображение, включить камеру или выбрать вариант из архива.',
    step2Images: '> Изображение принято.\n> Запускается волновая функция.\n> Система готова к инициализации.',
    step3: 'Шаг 2: Инициализация\n> Изображение преобразовано в пиксельную сетку.\n> Каждому пикселю назначены параметры (x, y, brightness, color).\n> На их основе построена волновая функция: ψ(x, y, t).\nУравнение эволюции:\niℏ ∂ψ/∂t = Ĥψ, где Ĥ = -½∇² + V(x, y)\n> Потенциал V(x, y) формируется из визуальных характеристик изображения.\n> Система переходит в режим временной симуляции.\n> Портрет существует как совокупность возможных состояний.',
    step4: 'Шаг 3: НАЧНИТЕ НАБЛЮДЕНИЕ\n> Двигайте курсором по изображению.\n> Каждый ваш жест запускает коллапс.\n> Система реагирует. Наблюдаемый образ формируется здесь и сейчас.',
    step5: 'Шаг 4: ФИКСАЦИЯ\n> Портрет — это процесс.\n> Но ты можешь зафиксировать один миг.\n> Это будет один из возможных тебя.',
    step6: 'Шаг 5: РЕАКЦИЯ СИСТЕМЫ\n> Это не портрет.\n> Это — реакция системы на тебя.\n> Ты повлиял на исход.',
    step7: 'Ты — не единственный наблюдатель.\nКаждое наблюдение — это акт, формирующий образ.\nЗдесь ты — одновременно субъект и объект.'
  },
  en: {
    title: 'Quantum Portrait',
    step0: 'Please select a language\nRU / ENG',
    step1_part1: 'STATUS: OBSERVER CONNECTED',
    step1_part2: '> What can Schrödinger teach us about digital identity?\n> Welcome to the experimental zone.\n> Here, observation = interference.',
    step2: 'Step 1: Scan the face of superposition.\nYou can upload an image, activate the camera, or select from the archive.',
    step2Images: '> Image accepted.\n> Wave function launched.\n> System ready for initialization.',
    step3: 'Step 2: Initialization\n> Image converted to pixel grid.\n> Each pixel assigned parameters (x, y, brightness, color).\n> Wave function built on this basis: ψ(x, y, t).\nEvolution equation:\niℏ ∂ψ/∂t = Ĥψ, where Ĥ = -½∇² + V(x, y)\n> Potential V(x, y) formed from image visual characteristics.\n> System enters temporal simulation mode.\n> Portrait exists as a set of possible states.',
    step4: 'Step 3: BEGIN OBSERVATION\n> Move your cursor over the image.\n> Each gesture triggers a collapse.\n> The system responds. The observed image forms here and now.',
    step5: 'Step 4: FIXATION\n> The portrait is a process.\n> But you can capture one moment.\n> This will be one possible version of you.',
    step6: 'Step 5: SYSTEM RESPONSE\n> This is not a portrait.\n> This is the system’s reaction to you.\n> You influenced the outcome.',
    step7: 'You are not the only observer.\nEach observation is an act that shapes the image.\nHere, you are both subject and object.'
  }
};
