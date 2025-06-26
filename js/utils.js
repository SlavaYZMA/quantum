// Функция загрузки изображения
window.loadImage = () => {
    console.log('loadImage function called');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        console.log('File input changed, processing file...');
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
        } else {
            console.log('No file selected');
        }
    };
    input.click();
    console.log('File input triggered');
};
