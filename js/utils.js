window.loadImage = () => {
    if (window.quantumSketch && typeof window.quantumSketch.loadImage === 'function') {
        window.loadImageOnce(); // Используем существующую функцию
    } else {
        console.error('p5.js instance or loadImage not available');
    }
};
window.assembleText = function(button) {
    button.style.color = '#00ffcc';
    button.style.fontSize = '16px';
    button.textContent = button.getAttribute('data-i18n') || button.id || button.textContent;
};

window.disassembleText = function(button) {
    button.style.color = 'transparent';
    button.style.fontSize = '0';
    button.textContent = '';
};
