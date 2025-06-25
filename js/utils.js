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
                // Сохраняем изображение в глобальную переменную (пока не отображаем)
                window.selectedImage = img;
                console.log('Image loaded:', img.src);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
};
