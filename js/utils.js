window.loadImage = () => {
    if (window.quantumSketch && typeof window.quantumSketch.loadImage === 'function') {
        window.loadImageOnce(); // Используем существующую функцию
    } else {
        console.error('p5.js instance or loadImage not available');
    }
};
