console.log('globals.js loaded');

window.noiseScale = 0.01;
window.chaosFactor = 1.0;
window.mouseInfluenceRadius = 60;
window.frame = 0;
window.isPaused = false;
window.terminalMessages = [];

window.setLanguage = function(lang) {
    console.log('setLanguage called with: ' + lang);
    const elements = document.querySelectorAll('[data-i18n]');
    console.log('Language elements found: ' + elements.length);
    elements.forEach((element, index) => {
        const key = element.getAttribute('data-i18n');
        const translation = window.translations[lang][key];
        if (translation) {
            element.textContent = translation;
            console.log(`Updated text at index ${index} (${key}): ${translation}`);
        } else {
            console.warn(`Translation missing for key: ${key} in language: ${lang}`);
        }
    });
};

window.setLanguageAndNext = function(lang) {
    console.log('setLanguageAndNext called with: ' + lang);
    window.setLanguage(lang);
    window.moveToNextStep(1);
};
