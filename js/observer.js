// Глобальная функция для записи наблюдения
window.recordObservation = () => {
    if (window.canvas && !window.isPaused) {
        window.isPaused = true;
        noLoop();
        let dataURL = window.canvas.elt.toDataURL();
        document.getElementById('saved-portrait').src = dataURL;
        document.getElementById('saved-portrait').style.display = 'block';
        window.fixationCount = 1; // Устанавливаем фиксацию
        console.log('Observation recorded, fixationCount set to 1');
    }
};

// Глобальная функция для сохранения в архив
window.shareToArchive = () => {
    let portraitName = document.getElementById('portrait-name').value;
    if (portraitName && document.getElementById('saved-portrait').src) {
        let dataURL = document.getElementById('saved-portrait').src;
        console.log('Portrait', portraitName, 'shared to archive:', dataURL);
        alert('Изображение сохранено в архиве под названием: ' + portraitName);
        showStep(0);
    } else {
        alert('Введите название портрета!');
    }
};
