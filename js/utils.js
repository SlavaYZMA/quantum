window.loadImage = (src, callback) => {
    if (typeof p5 !== 'undefined' && typeof p5.prototype.loadImage === 'function') {
        p5.prototype.loadImage(src, callback); // Use p5.js loadImage directly
    } else {
        console.error('p5.js loadImage function not available');
    }
};
