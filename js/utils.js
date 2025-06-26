// Функция загрузки изображения
window.loadImage = () => {
    console.log('loadImage function called');
    if (typeof loadImage !== 'function') {
        console.error('p5.js loadImage function not available');
        return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        console.log('File input changed, processing file...');
        const file = e.target.files[0];
        if (file) {
            loadImage(URL.createObjectURL(file), (img) => {
                console.log('Image loaded successfully:', img.width, 'x', img.height);
                window.img = img;
                if (typeof showStep === 'function' && window.currentStep === 2) {
                    showStep(3);
                }
            }, (err) => {
                console.error('Error loading image:', err);
            });
        } else {
            console.log('No file selected');
        }
    };
    try {
        input.click();
        console.log('File input triggered');
    } catch (error) {
        console.error('Failed to trigger file input:', error);
    }
};
