// Функция паузы анимации
window.pauseAnimation = () => {
    console.log('Animation paused');
    // Логика паузы (заглушка, реализуется позже)
};

// Функция записи наблюдения
window.recordObservation = () => {
    pauseAnimation();
    const canvas = document.getElementById('portrait-canvas');
    if (canvas) {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'quantum_portrait.png';
        link.click();
        console.log('Portrait saved:', dataURL);
    }
};
