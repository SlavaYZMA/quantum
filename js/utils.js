window.loadImage = (src, callback) => {
    try {
        if (typeof p5 !== 'undefined' && typeof p5.prototype.loadImage === 'function') {
            // Call loadImage without preload context to avoid s._decrementPreload error
            p5.prototype.loadImage(src, img => {
                if (img) {
                    callback(img);
                } else {
                    console.error('Failed to load image:', src);
                }
            }, err => console.error('p5.js loadImage error:', err));
        } else {
            console.error('p5.js or loadImage function not available');
        }
    } catch (err) {
        console.error('Error in window.loadImage:', err);
    }
};
