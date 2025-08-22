window.loadImage = (src, callback) => {
    console.log('loadImage called with:', src);
    try {
        // Use p5.js loadImage explicitly
        p5.prototype.loadImage(src, 
            img => {
                console.log('p5.js image loaded:', src);
                callback(img);
            }, 
            () => {
                console.error('p5.js image load failed:', src);
            }
        );
    } catch (err) {
        console.error('Error in window.loadImage:', err);
    }
};
window.resizeToSquare = function(img, size) {
    const p = new p5(); // Временный p5 для графики
    const g = p.createGraphics(size, size);
    const aspect = img.width / img.height;
    let sx, sy, sw, sh;
    if (aspect > 1) { // Горизонтальное — обрезаем стороны
        sw = img.height;
        sh = img.height;
        sx = (img.width - sw) / 2;
        sy = 0;
    } else { // Вертикальное — обрезаем верх/низ
        sw = img.width;
        sh = img.width;
        sx = 0;
        sy = (img.height - sh) / 2;
    }
    g.image(img, 0, 0, size, size, sx, sy, sw, sh);
    return g.get(); // Возвращаем p5.Image 255x255
};
