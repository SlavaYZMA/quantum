window.loadImage = (src, callback) => {
    try {
        if (typeof p5 !== 'undefined' && typeof p5.prototype.loadImage === 'function') {
            p5.prototype.loadImage(src, 
                img => callback(img), 
                err => {
                    console.error('p5.js loadImage failed:', err);
                    // Fallback to raw Image load
                    const rawImg = new Image();
                    rawImg.onload = () => callback(rawImg);
                    rawImg.onerror = () => console.error('Raw image load failed:', src);
                    rawImg.src = src;
                }
            );
        } else {
            console.warn('p5.js loadImage not available, using raw Image');
            const rawImg = new Image();
            rawImg.onload = () => callback(rawImg);
            rawImg.onerror = () => console.error('Raw image load failed:', src);
            rawImg.src = src;
        }
    } catch (err) {
        console.error('Error in window.loadImage:', err);
        // Fallback to raw Image load
        const rawImg = new Image();
        rawImg.onload = () => callback(rawImg);
        rawImg.onerror = () => console.error('Raw image load failed:', src);
        rawImg.src = src;
    }
};
