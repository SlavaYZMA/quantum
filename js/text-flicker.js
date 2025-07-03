document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        const originalText = button.textContent;
        const chars = originalText.split('');
        
        setInterval(() => {
            // Случайное перемешивание букв
            let shuffled = [...chars];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            
            // Применяем перемешанный текст на короткое время
            button.textContent = shuffled.join('');
            setTimeout(() => {
                button.textContent = originalText;
            }, 150); // Восстанавливаем через 150 мс
        }, 1500); // Перемешивание каждые 1.5 секунды
    });
});
