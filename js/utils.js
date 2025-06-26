// Функция загрузки изображения
window.loadImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    window.img = createImage(img.width, img.height); // Создаём p5.Image
                    window.img.loadPixels();
                    loadPixels(img, window.img);
                    console.log('Image loaded and converted to p5.Image:', img.src);
                };
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
};

// Вспомогательная функция для загрузки пикселей
function loadPixels(imgElement, p5Image) {
    p5Image.drawingContext.drawImage(imgElement, 0, 0);
    p5Image.updatePixels();
}
