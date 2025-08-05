window.recordObservation = () => {
    console.log('currentStep:', window.currentStep, 'isPaused:', window.isPaused);
    if (!window.quantumSketch || !window.quantumSketch.canvas) {
        console.error('quantumSketch is not initialized');
        return;
    }
    if (window.currentStep !== 4) {
        console.error('Wrong step:', window.currentStep);
        return;
    }
    if (window.isPaused) {
        console.error('Animation is already paused');
        return;
    }
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
            if (window.quantumSketch) window.quantumSketch.loop();
            console.log('Animation resumed on image click');
        };
        console.log('Animation paused, preview displayed');
        window.moveToNextStep(5); // Переход на шаг 5 после фиксации
    } else {
        console.error('Saved portrait element not found');
    }
};

window.shareToArchive = () => {
    const portraitName = document.getElementById('portraitName');
    const savedPortrait = document.getElementById('saved-portrait');
    if (portraitName && portraitName.value && savedPortrait && savedPortrait.src && savedPortrait.style.display === 'block') {
        const link = document.createElement('a');
        link.href = savedPortrait.src;
        link.download = portraitName.value + '.png';
        link.click();
        alert('Изображение сохранено в архиве под названием: ' + portraitName.value);
        savedPortrait.style.display = 'none';
        window.moveToNextStep(6);
    } else {
        alert('Введите название портрета и зафиксируйте изображение!');
    }
};
