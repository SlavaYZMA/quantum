window.particles = {
    init: function(sketch) {
        this.particles = [];
        this.img = window.img;
        if (!this.img) {
            console.error('No image available for particle initialization');
            return;
        }

        // Создаём частицы на основе пикселей изображения
        sketch.loadPixels();
        for (let i = 0; i < this.img.width; i += 10) {
            for (let j = 0; j < this.img.height; j += 10) {
                let index = (i + j * this.img.width) * 4;
                let r = sketch.pixels[index];
                let g = sketch.pixels[index + 1];
                let b = sketch.pixels[index + 2];
                if (r + g + b > 100) { // Порог яркости
                    this.particles.push({
                        x: i,
                        y: j,
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
        sketch.background(0);
        this.particles.forEach(p => {
            sketch.stroke(p.color);
            sketch.point(p.x, p.y);
        });
    }
};

if (window.quantumSketch) {
    window.quantumSketch.draw = () => {
        if (window.particles && window.particles.img) {
            if (!window.particles.particles || window.particles.particles.length === 0) {
                window.particles.init(window.quantumSketch);
            }
            window.particles.update(window.quantumSketch);
            window.particles.draw(window.quantumSketch);
        } else {
            console.warn('Particles or image not initialized');
            window.quantumSketch.background(0); // Очистка экрана
        }
    };
}
