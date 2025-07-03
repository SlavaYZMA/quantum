console.log('observer.js loaded');

window.recordObservation = function() {
    if (window.quantumSketch && !window.isPaused) {
        window.isPaused = true;
        window.quantumSketch.noLoop();
        let canvas = window.quantumSketch.canvas;
        let dataURL = canvas.toDataURL('image/png');
        const portraitName = document.getElementById('portraitName').value || 'quantum_portrait';
        window.terminalMessages.push(`[OBSERVATION] Portrait recorded as ${portraitName}`);
        window.updateTerminalLog();
        // Сохраняем изображение
        window.quantumSketch.saveCanvas(portraitName, 'png');
        console.log('Observation recorded with name: ' + portraitName);
    } else {
        console.error('quantumSketch not available or animation is paused');
        window.terminalMessages.push('[ERROR] Failed to record observation: system not ready');
        window.updateTerminalLog();
    }
};

window.shareToArchive = function() {
    const portraitName = document.getElementById('portraitName');
    if (portraitName && portraitName.value) {
        window.terminalMessages.push(`[SHARE] Observation ${portraitName.value} shared to archive`);
        window.updateTerminalLog();
        window.open('https://t.me/quantum_portrait_channel', '_blank');
        console.log('Share to archive: opened Telegram channel');
        window.moveToNextStep(7);
    } else {
        console.error('Portrait name not provided');
        window.terminalMessages.push('[ERROR] Please enter a portrait name to share');
        window.updateTerminalLog();
        alert('Введите название портрета!');
    }
};
