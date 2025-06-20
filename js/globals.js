```javascript
let currentStep = 0;
let language = 'ru';
let img = null;
let frame = 0;
let isPaused = false;
let particles = [];
let quantumStates = [];
let p5Canvas = null; // Переименовано с canvas на p5Canvas
let isCanvasReady = false;
let timeOnPage = 0;
let weirdnessFactor = 0;
let simplifyAnimations = false;
let uploadedImageUrl = '';
let cursorX = 0;
let cursorY = 0;

const portraitUrls = [
  'https://via.placeholder.com/100',
  'https://via.placeholder.com/100',
  'https://via.placeholder.com/100'
];

const translations = {
  step0: { ru: 'Пожалуйста, выберите язык\nPlease select a language', en: 'Please select a language' },
  step1: { ru: 'СТАТУС: НАБЛЮДАТЕЛЬ ПОДКЛЮЧЁН\n> Чему Шредингер может научить нас в области\nцифровой идентификации?\n> Добро пожаловать в экспериментальную зону.\n> Здесь наблюдение = вмешательство.', en: 'STATUS: OBSERVER CONNECTED\n> What can Schrödinger teach us about\ndigital identification?\n> Welcome to the experimental zone.\n> Here, observation = interference.' },
  step2: { ru: 'Шаг 1: Сканируйте лицо суперпозиции.\nВы можете загрузить изображение или выбрать вариант из архива.', en: 'Step 1: Scan the face of superposition.\nYou can upload an image or select from the archive.' },
  step2Images: { ru: '> Изображение принято.\n> Запускается волновая функция.\n> Система готова к инициализации.', en: '> Image accepted.\n> Wave function launching.\n> System ready for initialization.' },
  step3: { ru: 'Шаг 2: Инициализация\n> Изображение преобразовано в пиксельную\nсетку.\n> Каждому пикселю назначены параметры (x, y,\nbrightness, color).\n> На их основе построена волновая функция: ψ(x,\ny, t).\nУравнение эволюции:\niℏ ∂ψ/∂t = Ĥψ, где Ĥ = -½∇² + V(x, y)\n> Потенциал V(x, y) формируется из визуальных\nхарактеристик изображения.\n> Система переходит в режим временной\nсимуляции.\n> Портрет существует как совокупность\nвозможных состояний.', en: 'Step 2: Initialization\n> Image converted into a pixel grid.\n> Each pixel assigned parameters (x, y,\nbrightness, color).\n> Based on them, a wave function is built: ψ(x,\ny, t).\nEvolution equation:\niℏ ∂ψ/∂t = Ĥψ, where Ĥ = -½∇² + V(x, y)\n> Potential V(x, y) is formed from the visual\ncharacteristics of the image.\n> System enters temporal simulation mode.\n> The portrait exists as a set of possible\nstates.' },
  step4: { ru: 'Шаг 3: НАЧНИТЕ НАБЛЮДЕНИЕ\n> Двигайте курсором по изображению.\n> Каждый ваш жест запускает хаотический распад.\n> Система формирует абсурдный образ.', en: 'Step 3: BEGIN OBSERVATION\n> Move the cursor over the image.\n> Each gesture triggers chaotic decay.\n> The system forms an absurd image.' },
  step5: { ru: 'Шаг 4: ФИКСАЦИЯ\n> Портрет — это хаос.\n> Зафиксируйте один миг этого безумия.\n> Это будет твой абсурдный образ.', en: 'Step 4: FIXATION\n> A portrait is chaos.\n> Freeze a moment of this madness.\n> This will be your absurd self.' },
  step6: { ru: 'Шаг 5: РЕАКЦИЯ СИСТЕМЫ\n> Это не портрет.\n> Это — хаотичная реакция системы на тебя.\n> Ты породил абсурд.', en: 'Step 5: SYSTEM REACTION\n> This is not a portrait.\n> This is the system\'s chaotic reaction to you.\n> You spawned absurdity.' },
  step7: { ru: 'Ты — не единственный наблюдатель.\nКаждое наблюдение — это акт, порождающий\nхаос. Здесь ты — одновременно субъект и\nобъект абсурда.', en: 'You are not the only observer.\nEach observation is an act that spawns\nchaos. Here, you are both subject and object\nof absurdity.' }
};
```
