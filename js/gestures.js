console.log('gestures.js loaded');

window.initializeGestures = function() {
    const canvas = document.querySelector('.quantum-canvas');
    if (!canvas) {
        console.error('Canvas not found for gesture initialization');
        return;
    }
    const hammer = new Hammer(canvas);
    
    // Пинч для зума
    hammer.get('pinch').set({ enable: true });
    hammer.on('pinch', function(e) {
        if (window.currentStep !== 4 && window.currentStep !== 5) return;
        window.mouseWave.zoom = Math.max(0.5, Math.min(2.0, window.mouseWave.zoom * e.scale));
        console.log('Pinch gesture: zoom = ' + window.mouseWave.zoom);
        window.terminalMessages.push(`[ZOOM] Масштаб волнового пакета: ${window.mouseWave.zoom.toFixed(2)}x`);
        window.updateTerminalLog();
        window.playNote(392.00, 'sine', 0.3, 0.2);
    });

    // Перетаскивание
    hammer.on('pan', function(e) {
        if (window.currentStep !== 4 && window.currentStep !== 5) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.center.x - rect.left;
        const mouseY = e.center.y - rect.top;
        window.observeParticles(window.quantumSketch, mouseX, mouseY);
        console.log('Pan gesture: x = ' + mouseX + ', y = ' + mouseY);
    });

    // Двойной тап для коллапса
    hammer.on('doubletap', function(e) {
        if (window.currentStep !== 4 && window.currentStep !== 5) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.center.x - rect.left;
        const mouseY = e.center.y - rect.top;
        window.clickParticles(window.quantumSketch, mouseX, mouseY);
        console.log('Doubletap gesture: x = ' + mouseX + ', y = ' + mouseY);
    });
};
