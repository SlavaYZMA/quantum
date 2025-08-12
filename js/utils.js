// utils.js
window.loadImage = (src, callback) => {
    // Directly use p5.js global loadImage function
    if (typeof loadImage === 'function') {
        loadImage(src, callback);
    } else {
        console.error('p5.js loadImage function not available');
    }
};
