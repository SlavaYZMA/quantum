// Глобальная функция для записи наблюдения
window.recordObservation = () => {
    if (window.canvas && !window.isPaused) {
        window.isPaused = true;
        noLoop();
        let dataURL = window.canvas.elt.toDataURL();
        document.getElementById('saved-portrait').src = dataURL;
        document.getElementById('saved-portrait').style.display = 'block';
        showStep(6); // Переход к шагу 6 после фиксации
        console.log('Observation recorded and saved to step 6');
    }
};

// Глобальная функция для сохранения в архив
window.shareToArchive = () => {
    let portraitName = document.getElementById('portrait-name').value;
    if (portraitName && document.getElementById('saved-portrait').src) {
        let dataURL = document.getElementById('saved-portrait').src;
        // Здесь можно добавить логику отправки на сервер или в Telegram
        console.log('Portrait', portraitName, 'shared to archive:', dataURL);
        alert('Изображение сохранено в архиве под названием: ' + portraitName);
        showStep(0); // Вернуться к началу
    } else {
        alert('Введите название портрета!');
    }
};
