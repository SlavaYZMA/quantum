window.recordObservation = () => {
    if (window.canvas && !window.isPaused && window.quantumSketch) {
        window.isPaused = true;
        window.quantumSketch.noLoop();
        let dataURL = window.canvas.elt.toDataURL();
        const savedPortrait = document.getElementById('saved-portrait');
        if (savedPortrait) {
            savedPortrait.src = dataURL;
            savedPortrait.style.display = 'block';
            window.fixationCount = 1;
            console.log('Observation recorded, fixationCount set to 1');
        } else {
            console.error('Saved portrait element not found');
        }
    } else {
        console.error('Canvas or quantumSketch not available for recording observation');
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
