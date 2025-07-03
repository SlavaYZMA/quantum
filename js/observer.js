window.recordObservation = () => {
    if (window.quantumSketch && !window.isPaused) {
        window.isPaused = true;
        window.quantumSketch.noLoop();
        let canvas = window.quantumSketch.canvas;
        let dataURL = canvas.toDataURL();
        const savedPortrait = document.getElementById('saved-portrait');
        if (savedPortrait) {
            savedPortrait.src = dataURL;
            savedPortrait.style.display = 'block';
            window.fixationCount = 1;
        } else {
            console.error('Saved portrait element not found');
        }
    } else {
        console.error('quantumSketch not available or animation is paused');
    }
};

window.shareToArchive = () => {
    const portraitName = document.getElementById('portraitName');
    const savedPortrait = document.getElementById('saved-portrait');
    if (portraitName && portraitName.value && savedPortrait && savedPortrait.src) {
        alert('Изображение сохранено в архиве под названием: ' + portraitName.value);
        showStep(7);
    } else {
        alert('Введите название портрета или убедитесь, что изображение сохранено!');
    }
};
