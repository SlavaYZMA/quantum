// Функция загрузки изображения (резерв, если экземпляр p5 не работает)
window.loadImage = () => {
    if (window.quantumSketch && typeof window.quantumSketch.loadImage === 'function') {
        window.quantumSketch.loadImage();
    } else {
        console.error('p5.js instance or loadImage not available');
    }
};
