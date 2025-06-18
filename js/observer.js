// observer.js

window.cursorX = 0;
window.cursorY = 0;

window.debouncedUpdateCursor = window.debounce((x, y) => {
  window.cursorX = x;
  window.cursorY = y;
}, 50);

document.addEventListener('mousemove', (e) => {
  window.debouncedUpdateCursor(e.clientX, e.clientY + window.scrollY);
});

document.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  window.debouncedUpdateCursor(touch.clientX, touch.clientY + window.scrollY);
}, { passive: false });

document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  window.debouncedUpdateCursor(touch.clientX, touch.clientY + window.scrollY);
  const typewriter = document.querySelector(`#typewriter${window.currentStep}`);
  if (typewriter) window.applyRandomGlitch(`typewriter${window.currentStep}`);
});