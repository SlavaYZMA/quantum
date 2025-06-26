// Функция загрузки изображения
window.loadImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            window.img = loadImage(URL.createObjectURL(file), () => {
                console.log('Image loaded successfully:', window.img.width, 'x', window.img.height);
                if (window.currentStep === 2) {
                    showStep(3); // Автоматический переход к шагу 3 после загрузки
                }
            }, (err) => {
                console.error('Error loading image:', err);
            });
        }
    };
    input.click();
};

// Удаляем устаревшую функцию loadPixels, так как она не нужна с p5.loadImage
