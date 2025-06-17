const debouncedUpdateCursor = debounce((x, y) => {
  cursorX = x;
  cursorY = y;
}, 50);

document.addEventListener('mousemove', (e) => {
  debouncedUpdateCursor(e.clientX, e.clientY + window.scrollY);
});

document.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  debouncedUpdateCursor(touch.clientX, touch.clientY + window.scrollY);
}, { passive: false });

document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  debouncedUpdateCursor(touch.clientX, touch.clientY + window.scrollY);
  const typewriter = document.querySelector(`#typewriter${currentStep}`);
  if (typewriter) applyRandomGlitch(`typewriter${currentStep}`);
});