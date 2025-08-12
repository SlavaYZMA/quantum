window.loadImage = (src, callback) => {
    if (typeof loadImage === 'function') {
        loadImage(src, callback); // Use p5.js global loadImage
    } else {
        console.error('p5.js loadImage function not available');
    }
};
