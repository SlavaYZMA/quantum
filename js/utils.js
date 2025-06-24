window.debounce = function(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

window.easeOutQuad = function(t) {
  return t * (2 - t);
};

window.cachedNoise = function(x, y, z) {
  let key = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`;
  if (window.noiseCache.has(key)) {
    return window.noiseCache.get(key);
  }
  let value = window.p5Instance.noise(x, y, z);
  window.noiseCache.set(key, value);
  if (window.noiseCache.size > 10000) {
    window.noiseCache.clear();
  }
  return value;
};

window.constrainImage = function(img, maxWidth, maxHeight) {
  if (!img || !img.width || !img.height) return img;
  let ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
  if (ratio < 1) {
    let newWidth = Math.floor(img.width * ratio);
    let newHeight = Math.floor(img.height * ratio);
    let resized = window.p5Instance.createImage(newWidth, newHeight);
    resized.drawingContext.drawImage(img.elt, 0, 0, newWidth, newHeight);
    resized.loadPixels();
    return resized;
  }
  return img;
};
