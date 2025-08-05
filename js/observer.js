window.recordObservation = () => {
    if (window.quantumSketch && !window.isPaused && window.currentStep === 4) {
        window.isPaused = true;
        window.quantumSketch.noLoop();
        let canvas = window.quantumSketch.canvas;
        let dataURL = canvas.toDataURL();
        const savedPortrait = document.getElementById('saved-portrait');
        if (savedPortrait) {
            savedPortrait.src = dataURL;
            savedPortrait.style.display = 'block';
            savedPortrait.onclick = () => {
                savedPortrait.style.display = 'none';
                window.isPaused = false;
                window.quantumSketch.loop();
            };
            window.fixationCount = (window.fixationCount || 0) + 1;
            console.log('Preview saved, fixation count:', window.fixationCount);
        } else {
            console.error('Saved portrait element not found');
        }
    } else {
        console.error('quantumSketch not available, animation is paused, or wrong step');
    }
};

window.shareToArchive = () => {
    const portraitName = document.getElementById('portraitName');
    const savedPortrait = document.getElementById('saved-portrait');
    if (portraitName && portraitName.value && savedPortrait && savedPortrait.src) {
        const link = document.createElement('a');
        link.href = savedPortrait.src;
        link.download = portraitName.value + '.png';
        link.click();
        alert('Изображение сохранено в архиве под названием: ' + portraitName.value);
        window.moveToNextStep(7);
    } else {
        alert('Введите название портрета или убедитесь, что изображение сохранено!');
    }
};
