document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        const originalText = button.textContent;
        let isShuffling = false;

        // Функция для перестановки букв
        function shuffleText() {
            if (isShuffling) return;
            isShuffling = true;

            const chars = originalText.split('');
            const shuffled = [...chars].sort(() => Math.random() - 0.5);
            button.textContent = shuffled.join('');

            // Возвращаем оригинальный текст через 0.5 секунды
            setTimeout(() => {
                button.textContent = originalText;
                isShuffling = false;
            }, 500);
        }

        // Запускаем перестановку каждые 2-3 секунды
        setInterval(() => {
            if (Math.random() > 0.3) shuffleText(); // 70% шанс перестановки
        }, 2000 + Math.random() * 1000);

        // Перестановка при наведении
        button.addEventListener('mouseenter', () => {
            shuffleText();
        });
    });
});
