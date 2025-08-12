// Language translations
const translations = {
  ru: {
    lang_ru: 'RU',
    lang_eng: 'ENG',
    menu_language_selection: 'Выбор языка',
    menu_introduction: 'Введение',
    menu_image_source: 'Источник изображения',
    menu_image_instructions: 'Инструкции по изображению',
    menu_quantum_explanation: 'Квантовое объяснение',
    menu_portrait_generation: 'Генерация портрета',
    menu_observation_recording: 'Запись наблюдения',
    menu_sharing: 'Поделиться',
    menu_conclusion: 'Заключение',
    step0_text: 'Пожалуйста, выберите язык RU / ENG',
    step1_title: 'СТАТУС: НАБЛЮДАТЕЛЬ ПОДКЛЮЧЁН',
    step1_text1: '> Чему Шредингер может научить нас в области цифровой идентификации?',
    step1_text2: '> Добро пожаловать в экспериментальную зону.',
    step1_text3: '> Здесь наблюдение = вмешательство',
    continue: 'Продолжить',
    back: 'Назад',
    step2_title: 'Шаг 1: Сканируйте лицо суперпозиции.',
    step2_text1: 'Вы можете загрузить изображение или выбрать вариант из архива.',
    upload_image: 'Загрузить изображение',
    use_camera: 'Включить камеру',
    use_archive: 'Выбрать из архива',
    capture_photo: 'Сделать фото',
    step2_text2: '> Изображение принято.',
    step2_text3: '> Запускается волновая функция.',
    step2_text4: '> Система готова к инициализации.',
    step3_title: 'Шаг 2: Инициализация',
    step3_text1: '> Изображение преобразовано в пиксельную сетку.',
    step3_text2: '> Каждому пикселю назначены параметры (x, y, brightness, color)',
    step3_text3: '> На их основе построена волновая функция: ψ(x, y, t)',
    step3_text4: 'Уравнение эволюции:',
    step3_text5: 'iℏ ∂ψ/∂t = Ĥψ, где Ĥ = -½∇² + V(x, y)',
    step3_text6: '> Потенциал V(x, y) формируется из визуальных характеристик изображения.',
    step3_text7: '> Система переходит в режим временной симуляции.',
    step3_text8: '> Портрет существует как совокупность возможных состояний.',
    step4_title: 'Шаг 3: НАЧНИТЕ НАБЛЮДЕНИЕ',
    step4_text1: '> Двигайте курсором по изображению.',
    step4_text2: '> Каждый ваш жест запускает коллапс.',
    step4_text3: '> Система реагирует. Наблюдаемый образ формируется здесь и сейчас.',
    step5_title: 'Шаг 4: ФИКСАЦИЯ',
    step5_text1: '> Портрет — это процесс.',
    step5_text2: '> Но ты можешь зафиксировать один миг.',
    step5_text3: '> Это будет один из возможных тебя.',
    save_observation: 'ЗАПИСАТЬ НАБЛЮДЕНИЕ',
    step6_title: 'Шаг 5: РЕАКЦИЯ СИСТЕМЫ',
    step6_text1: '> Это не портрет.',
    step6_text2: '> Это — реакция системы на тебя.',
    step6_text3: '> Ты повлиял на исход.',
    share_observation: 'ПОДЕЛИТЬСЯ НАБЛЮДЕНИЕМ',
    step7_text1: 'Ты — не единственный наблюдатель.',
    step7_text2: 'Каждое наблюдение — это акт, формирующий образ.',
    step7_text3: 'Здесь ты — одновременно субъект и объект.',
    restart: '↻ НАЧАТЬ СНАЧАЛА',
    archive: '⧉ ПЕРЕЙТИ В АРХИВ НАБЛЮДЕНИЙ',
    about_authors: 'ОБ АВТОРАХ',
    portrait_name_placeholder: 'Название портрета'
  },
  eng: {
    lang_ru: 'RU',
    lang_eng: 'ENG',
    menu_language_selection: 'Language Selection',
    menu_introduction: 'Introduction',
    menu_image_source: 'Image Source',
    menu_image_instructions: 'Image Instructions',
    menu_quantum_explanation: 'Quantum Explanation',
    menu_portrait_generation: 'Portrait Generation',
    menu_observation_recording: 'Observation Recording',
    menu_sharing: 'Sharing',
    menu_conclusion: 'Conclusion',
    step0_text: 'Please select language RU / ENG',
    step1_title: 'STATUS: OBSERVER CONNECTED',
    step1_text1: '> What can Schrödinger teach us about digital identification?',
    step1_text2: '> Welcome to the experimental zone.',
    step1_text3: '> Here observation = interference',
    continue: 'Continue',
    back: 'Back',
    step2_title: 'Step 1: Scan the face of superposition.',
    step2_text1: 'You can upload an image or select an option from the archive.',
    upload_image: 'Upload Image',
    use_camera: 'Use Camera',
    use_archive: 'Select from Archive',
    capture_photo: 'Capture Photo',
    step2_text2: '> Image received.',
    step2_text3: '> Wave function is being initiated.',
    step2_text4: '> System is ready for initialization.',
    step3_title: 'Step 2: Initialization',
    step3_text1: '> Image converted into a pixel grid.',
    step3_text2: '> Each pixel is assigned parameters (x, y, brightness, color)',
    step3_text3: '> Based on them, a wave function is constructed: ψ(x, y, t)',
    step3_text4: 'Evolution equation:',
    step3_text5: 'iℏ ∂ψ/∂t = Ĥψ, where Ĥ = -½∇² + V(x, y)',
    step3_text6: '> Potential V(x, y) is formed from the visual characteristics of the image.',
    step3_text7: '> System switches to temporal simulation mode.',
    step3_text8: '> The portrait exists as a superposition of possible states.',
    step4_title: 'Step 3: BEGIN OBSERVATION',
    step4_text1: '> Move the cursor over the image.',
    step4_text2: '> Each gesture triggers a collapse.',
    step4_text3: '> The system responds. The observed image is formed here and now.',
    step5_title: 'Step 4: FIXATION',
    step5_text1: '> The portrait is a process.',
    step5_text2: '> But you can fixate a single moment.',
    step5_text3: '> This will be one of the possible yous.',
    save_observation: 'SAVE OBSERVATION',
    step6_title: 'Step 5: SYSTEM REACTION',
    step6_text1: '> This is not a portrait.',
    step6_text2: '> This is the system’s reaction to you.',
    step6_text3: '> You influenced the outcome.',
    share_observation: 'SHARE OBSERVATION',
    step7_text1: 'You are not the only observer.',
    step7_text2: 'Each observation is an act that shapes the image.',
    step7_text3: 'Here you are both subject and object.',
    restart: '↻ RESTART',
    archive: '⧉ GO TO OBSERVATION ARCHIVE',
    about_authors: 'ABOUT AUTHORS',
    portrait_name_placeholder: 'Portrait Name'
  }
};

// Store current language
let currentLanguage = 'eng';

// Cache for elements to avoid repeated queries
const languageElementsCache = new Map();

// Function to set language
function setLanguage(lang) {
  console.log(`setLanguage called with: ${lang}`);
  if (!translations[lang]) {
    console.error(`Language ${lang} not supported`);
    return;
  }

  // Avoid redundant updates if language hasn't changed
  if (currentLanguage === lang) {
    console.log(`Language already set to ${lang}, skipping update`);
    return;
  }

  currentLanguage = lang;

  // Query elements only if cache is empty
  if (languageElementsCache.size === 0) {
    const elements = document.querySelectorAll('[data-i18n]');
    console.log(`Language elements found: ${elements.length}`);
    elements.forEach((element, index) => {
      const key = element.getAttribute('data-i18n');
      languageElementsCache.set(index, { element, key });
    });
  }

  // Update elements from cache
  languageElementsCache.forEach(({ element, key }, index) => {
    if (translations[lang][key]) {
      // Remove square brackets from button text
      const text = translations[lang][key].replace(/\[|\]/g, '');
      element.textContent = text;
      console.log(`Updated element ${index} (${key}): ${text} on ${element.outerHTML}`);

      // Ensure buttons remain visible and text persists
      if (element.tagName === 'BUTTON') {
        element.style.display = 'inline-block';
        element.style.visibility = 'visible';
        console.log(`Button ${key} set to: ${text}`);
      }
    }
  });

  // Update placeholder
  const portraitNameInput = document.getElementById('portrait-name');
  if (portraitNameInput) {
    const placeholderKey = 'portrait_name_placeholder';
    portraitNameInput.placeholder = translations[lang][placeholderKey] || '';
    console.log(`Updated placeholder (${placeholderKey}): ${translations[lang][placeholderKey]}`);
  }

  // Update menu items
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach((item, index) => {
    const key = item.getAttribute('data-i18n');
    if (translations[lang][key]) {
      item.textContent = translations[lang][key];
      console.log(`Updated menu item ${index} (${key}): ${translations[lang][key]}`);
    }
  });

  // Update language buttons
  const langButtons = document.querySelectorAll('.lang-button');
  langButtons.forEach(button => {
    const langKey = button.getAttribute('data-i18n');
    if (translations[lang][langKey]) {
      button.textContent = translations[lang][langKey];
      button.classList.toggle('active', button.getAttribute('onclick').includes(`'${lang}'`));
      // Ensure language buttons remain visible
      button.style.display = 'inline-block';
      button.style.visibility = 'visible';
    }
  });

  console.log(`Language buttons updated: ru active=${lang === 'ru'}, eng active=${lang === 'eng'}`);
}

// Function to set language and stay on the current step
window.setLanguageAndStay = function(lang) {
  setLanguage(lang);
};

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLanguage);
});
