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

window.applyRandomGlitch = function(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
  setTimeout(() => {
    element.style.transform = '';
  }, 100);
};
