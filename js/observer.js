import { addCursorPosition } from './audio.js';

export const debouncedUpdateCursor = debounce((x, y) => {
  addCursorPosition(x, y);
}, 50);

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}