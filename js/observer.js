window.recordObservation = () => {
    if (window.quantumSketch && !window.isPaused) {
        console.log('Recording observation');
        window.isPaused = true;
        window.quantumSketch.noLoop();
        let canvas = window.quantumSketch.canvas;
        let dataURL = canvas.toDataURL();
        const savedPortrait = document.getElementById('saved-portrait');
        if (savedPortrait) {
            savedPortrait.src = dataURL;
            savedPortrait.style.display = 'block';
            window.fixationCount = (window.fixationCount || 0) + 1;
            console.log('Observation recorded, fixationCount set to', window.fixationCount);
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
        let dataURL = savedPortrait.src;
        console.log('Portrait', portraitName.value, 'shared to archive:', dataURL);
        alert('Изображение сохранено в архиве под названием: ' + portraitName.value);
        showStep(7);
    } else {
        alert('Введите название портрета или убедитесь, что изображение сохранено!');
    }
};
