window.loadImage = (src, callback) => {
    console.log('loadImage called with:', src);
    try {
        // Use p5.js loadImage to ensure compatibility with particles.js
        const img = loadImage(src, () => {
            console.log('p5.js image loaded:', src);
            callback(img);
        }, () => {
            console.error('p5.js image load failed:', src);
        });
    } catch (err) {
        console.error('Error in window.loadImage:', err);
    }
};
