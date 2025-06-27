window.particles = {
    particles: [],
    init: function(sketch) {
        this.particles = [];
        this.img = window.img;
        if (!this.img) {
            console.error('No image available for particle initialization');
            return;
        }

        // Инициализация холста с изображением
        sketch.image(this.img, 0, 0, sketch.width, sketch.height);
        sketch.loadPixels();

        // Создание частиц на основе пикселей
        for (let i = 0; i < this.img.width; i += 10) {
            for (let j = 0; j < this.img.height; j += 10) {
                let index = (i + j * this.img.width) * 4;
                let r = sketch.pixels[index];
                let g = sketch.pixels[index + 1];
                let b = sketch.pixels[index + 2];
                if (r + g + b > 100) { // Порог яркости
                    this.particles.push({
                        x: i * (sketch.width / this.img.width),
                        y: j * (sketch.height / this.img.height),
                        vx: sketch.random(-1, 1),
                        vy: sketch.random(-1, 1),
                        color: [r, g, b]
                    });
                }
            }
        }
        console.log(`Initialized ${this.particles.length} particles`);
    },
    update: function(sketch) {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > sketch.width) p.vx *= -1;
            if (p.y < 0 || p.y > sketch.height) p.vy *= -1;
        });
    },
    draw: function(sketch) {
        sketch.background(0); // Очистка фона
        sketch.image(window.img, 0, 0, sketch.width, sketch.height); // Базовое изображение
        this.particles.forEach(p => {
            sketch.stroke(p.color);
            sketch.point(p.x, p.y);
        });
    }
};

if (window.quantumSketch) {
    window.quantumSketch.draw = () => {
        if (!window.particles.particles || window.particles.particles.length === 0) {
            window.particles.init(window.quantumSketch);
        }
        if (window.img) {
            window.particles.update(window.quantumSketch);
            window.particles.draw(window.quantumSketch);
        } else {
            console.warn('Image not available for animation');
            window.quantumSketch.background(0); // Очистка при отсутствии изображения
        }
    };
}
