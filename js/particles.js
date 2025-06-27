window.particles = {
    particles: [],
    mouseX: null,
    mouseY: null,
    init: function(sketch) {
        this.particles = [];
        this.img = window.img;
        if (!this.img) {
            console.error('No image available for particle initialization');
            return;
        }

        sketch.image(this.img, 0, 0, sketch.width, sketch.height);
        sketch.loadPixels();

        // Уменьшаем шаг для оптимизации
        for (let i = 0; i < this.img.width; i += 20) {
            for (let j = 0; j < this.img.height; j += 20) {
                let index = (i + j * this.img.width) * 4;
                let r = sketch.pixels[index];
                let g = sketch.pixels[index + 1];
                let b = sketch.pixels[index + 2];
                let brightness = (r + g + b) / 3;
                if (brightness > 50) {
                    this.particles.push({
                        x: i * (sketch.width / this.img.width),
                        y: j * (sketch.height / this.img.height),
                        ox: i * (sketch.width / this.img.width),
                        oy: j * (sketch.height / this.img.height),
                        vx: sketch.random(-0.5, 0.5),
                        vy: sketch.random(-0.5, 0.5),
                        color: [r, g, b],
                        targetX: i * (sketch.width / this.img.width),
                        targetY: j * (sketch.height / this.img.height),
                        speed: sketch.random(0.1, 0.5)
                    });
                }
            }
        }
        console.log(`Initialized ${this.particles.length} particles`);
    },
    update: function(sketch) {
        this.particles.forEach(p => {
            if (this.mouseX !== null && this.mouseY !== null) {
                let dx = this.mouseX - p.x;
                let dy = this.mouseY - p.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    p.targetX = this.mouseX + sketch.random(-20, 20);
                    p.targetY = this.mouseY + sketch.random(-20, 20);
                } else {
                    p.targetX = p.ox;
                    p.targetY = p.oy;
                }

                let tx = p.targetX - p.x;
                let ty = p.targetY - p.y;
                p.vx += tx * 0.01 * p.speed;
                p.vy += ty * 0.01 * p.speed;
                p.vx *= 0.95;
                p.vy *= 0.95;
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = 0;
                if (p.x > sketch.width) p.x = sketch.width;
                if (p.y < 0) p.y = 0;
                if (p.y > sketch.height) p.y = sketch.height;
            }
        });
    },
    draw: function(sketch) {
        sketch.background(0);
        if (window.img) {
            sketch.image(window.img, 0, 0, sketch.width, sketch.height);
        }
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
            window.quantumSketch.background(0);
        }
    };
}
