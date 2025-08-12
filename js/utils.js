window.loadImage = (src, callback) => {
    console.log('loadImage called with:', src);
    try {
        const rawImg = new Image();
        rawImg.onload = () => {
            console.log('Raw image loaded:', src);
            callback(rawImg);
        };
        rawImg.onerror = () => console.error('Raw image load failed:', src);
        rawImg.src = src;
    } catch (err) {
        console.error('Error in window.loadImage:', err);
    }
};
