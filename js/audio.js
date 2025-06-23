const collapseSound = new Audio('https://example.com/collapse.wav'); // Замените на реальный путь к файлу

window.playCollapseSound = function() {
  collapseSound.currentTime = 0;
  collapseSound.play().catch(e => console.log('Ошибка воспроизведения звука:', e));
};
