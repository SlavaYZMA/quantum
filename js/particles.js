console.log('particles.js loaded');

window.particles = [];
window.quantumStates = [];
window.branchParticles = [];
window.globalPhase = 'chaos';
window.decompositionTimer = 0;
window.phaseTimer = 0;
window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
window.globalMessageCooldown = 0;
window.grid = [];
window.vortexCenters = [];
window.webIntensity = 0;
window.webConnections = 0;

window.initializeParticles = function(img) {
    console.log('initializeParticles called, img defined: ' + !!img + ', dimensions: ' + (img ? img.width + 'x' + img.height : 'undefined'));
    window.terminalMessages.push(getRandomMessage('initialize'));
    window.updateTerminalLog();
    if (typeof window.playInitialization === 'function') {
        window.playInitialization();
    }
    if (!img || !img.pixels) {
        console.error('Error: window.img is not defined or pixels not loaded');
        window.terminalMessages.push(getRandomMessage('initializeError'));
        window.updateTerminalLog();
        return;
    }
    window.particles = [];
    window.quantumStates = [];
    window.decompositionTimer = 0;
    window.phaseTimer = 0;
    window.globalPhase = 'chaos';
    window.mouseWave = { x: 0, y: 0, radius: 0, trail: [] };
    window.globalMessageCooldown = 0;
    window.grid = [];
    window.vortexCenters = [];
    window.branchParticles = [];
    window.webIntensity = 0;
    window.webConnections = 0;

    let totalR = 0, totalG = 0, totalB = 0, pixelCount = 0;
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        totalR += img.pixels[i];
        totalG += img.pixels[i + 1];
        totalB += img.pixels[i + 2];
        pixelCount++;
    }
    window.baseWebColor = {
        r: Math.floor(totalR / pixelCount),
        g: Math.floor(totalG / pixelCount),
        b: Math.floor(totalB / pixelCount)
    };

    try {
        if (!img.pixels || img.pixels.length === 0) {
            console.error('Error: img.pixels is empty or not loaded');
            window.terminalMessages.push(getRandomMessage('initializeError'));
            window.updateTerminalLog();
            return;
        }

        const pixelSize = 7;
        const blockSize = 20;
        const numParticles = Math.floor((img.width * img.height) / (pixelSize * pixelSize));
        let validParticles = 0;

        const faceFeatures = [
            { x: img.width * 0.35, y: img.height * 0.3, weight: 0.25 },
            { x: img.width * 0.65, y: img.height * 0.3, weight: 0.25 },
            { x: img.width * 0.5, y: img.height * 0.5, weight: 0.15 },
            { x: img.width * 0.5, y: img.height * 0.7, weight: 0.15 }
        ];
        const zones = [
            { x: 50, y: 50 }, { x: 350, y: 50 },
            { x: 50, y: 350 }, { x: 350, y: 350 },
            { x: 200, y: 200 }
        ];

        for (let y = 0; y < img.height; y += pixelSize) {
            for (let x = 0; x < img.width; x += pixelSize) {
                const index = (Math.floor(x) + Math.floor(y) * img.width) * 4;
                const r = img.pixels[index] || 0;
                const g = img.pixels[index + 1] || 0;
                const b = img.pixels[index + 2] || 0;
                const a = img.pixels[index + 3] || 255;
                const brightness = (r + g + b) / 3;

                if (brightness > 60 || Math.random() < 0.2) {
                    const useFeature = Math.random() < 0.5;
                    let featureWeight = 0.1;
                    if (useFeature) {
                        const feature = faceFeatures.find(f => Math.abs(f.x - x) < img.width * 0.1 && Math.abs(f.y - y) < img.height * 0.1);
                        featureWeight = feature ? feature.weight : 0.1;
                    }

                    let zone = zones[Math.floor(Math.random() * zones.length)];
                    let newX = zone.x + (Math.random() - 0.5) * 50;
                    let newY = zone.y + (Math.random() - 0.5) * 50;
                    // Проверка на перекрытие
                    let overlap = false;
                    for (let p of window.particles) {
                        if (Math.sqrt((newX - p.x) ** 2 + (newY - p.y) ** 2) < 10) {
                            overlap = true;
                            break;
                        }
                    }
                    if (overlap) continue;

                    window.particles.push({
                        x: newX,
                        y: newY,
                        baseX: x * 400 / img.width,
                        baseY: y * 400 / img.height,
                        velocityX: 0,
                        velocityY: 0,
                        size: pixelSize * 1.2,
                        phase: Math.random() * 2 * Math.PI,
                        frequency: 0.007,
                        spin: Math.random() < 0.5 ? 0.5 : -0.5,
                        spinPhase: Math.random() * 2 * Math.PI,
                        entangledPartner: Math.random() < 0.1 ? Math.floor(Math.random() * numParticles) : null,
                        collapsed: false,
                        decompositionProgress: 0,
                        shape: 'pixel',
                        featureWeight: featureWeight,
                        blockId: Math.floor(x / blockSize) + Math.floor(y / blockSize) * Math.floor(img.width / blockSize),
                        clusterId: null,
                        vortexId: null,
                        pulsePhase: Math.random() * 2 * Math.PI,
                        uncertaintyRadius: 6,
                        originalColor: { r: r, g: g, b: b }
                    });

                    window.quantumStates.push({
                        r: r,
                        g: g,
                        b: b,
                        a: 0,
                        probability: 1.0,
                        decoherenceTimer: 0,
                        tunnelFlash: 0,
                        interferencePhase: Math.random() * 2 * Math.PI,
                        entanglementFlash: 0,
                        wavePacketAlpha: 0
                    });
                    validParticles++;
                }
            }
        }

        console.log('Initialized ' + window.particles.length + ' particles, valid: ' + validParticles);
        window.terminalMessages.push(getRandomMessage('initializeSuccess', { validParticles }));
        window.updateTerminalLog();
        if (typeof window.playInitialization === 'function') {
            window.playInitialization();
        }
        if (validParticles === 0) {
            console.error('No valid particles created.');
            window.terminalMessages.push(getRandomMessage('initializeError'));
            window.updateTerminalLog();
        }
    } catch (error) {
        console.error('Error in initializeParticles: ' + error);
        window.terminalMessages.push(getRandomMessage('initializeError'));
        window.updateTerminalLog();
    }
};

window.updateParticles = function(sketch) {
    if (!window.particles || window.particles.length === 0 || !window.quantumStates) {
        console.error('updateParticles: No particles or quantum states available');
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 200;
        }
        return;
    }
    window.frame = window.frame || 0;
    window.frame++;
    let messageAddedThisFrame = false;
    let potentialMessages = [];

    window.decompositionTimer += 0.016;
    window.phaseTimer += 0.016;

    if (window.decompositionTimer > 4 && window.globalPhase === 'chaos') {
        window.globalPhase = 'clustering';
    }
    if (window.decompositionTimer > 8 && window.globalPhase === 'clustering') {
        window.globalPhase = 'synchronization';
    }

    sketch.background(0, Math.min(255, window.decompositionTimer * 20));

    window.particles.forEach(function(p, i) {
        try {
            var state = window.quantumStates[i];
            var pulse = 1 + 0.3 * Math.sin(p.pulsePhase + p.spin);
            p.pulsePhase += 0.05;
            var noise = sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale, window.frame * window.noiseScale);
            var dx = p.baseX - p.x;
            var dy = p.baseY - p.y;
            var distanceToBase = Math.sqrt(dx * dx + dy * dy);

            if (window.decompositionTimer < 4 && p.decompositionProgress < 1) {
                p.decompositionProgress += 0.01;
                state.a = Math.min(180, state.a + 5);
                state.wavePacketAlpha = Math.min(50, state.wavePacketAlpha + 2);
            } else if (window.decompositionTimer >= 4 && window.decompositionTimer < 8) {
                state.a = Math.max(0, state.a - 1);
                state.wavePacketAlpha = Math.max(0, state.wavePacketAlpha - 0.5);
            }

            if (!p.collapsed) {
                p.velocityX += (noise - 0.5) * window.chaosFactor * 0.1;
                p.velocityY += (noise - 0.5) * window.chaosFactor * 0.1;
                p.x += p.velocityX;
                p.y += p.velocityY;

                if (window.globalPhase === 'clustering' && Math.random() < 0.01) {
                    let closest = null;
                    let minDist = Infinity;
                    for (let other of window.particles) {
                        if (other !== p) {
                            let d = Math.sqrt((p.x - other.x) ** 2 + (p.y - other.y) ** 2);
                            if (d < minDist && d > 0) {
                                minDist = d;
                                closest = other;
                            }
                        }
                    }
                    if (closest && minDist < 80) {
                        p.velocityX += (closest.x - p.x) * 0.01;
                        p.velocityY += (closest.y - p.y) * 0.01;
                        if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame && Math.random() < 0.01) {
                            potentialMessages.push({ type: 'clustering', params: { distance: minDist.toFixed(1) } });
                        }
                    }
                }

                if (window.globalPhase === 'synchronization' && p.entangledPartner !== null) {
                    let partner = window.particles[p.entangledPartner];
                    if (partner) {
                        p.velocityX = partner.velocityX;
                        p.velocityY = partner.velocityY;
                    }
                }

                p.x = (p.x + sketch.width) % sketch.width;
                p.y = (p.y + sketch.height) % sketch.height;

                if (Math.random() < 0.0015) {
                    p.x = Math.random() * sketch.width;
                    p.y = Math.random() * sketch.height;
                    state.tunnelFlash = 15;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'tunneling', params: { x: p.x.toFixed(1), y: p.y.toFixed(1) } });
                    }
                    if (typeof window.playTunneling === 'function') {
                        window.playTunneling(190 + Math.random() * 380);
                    }
                }

                if (state.decoherenceTimer > 100 && Math.random() < 0.02) {
                    p.collapsed = true;
                    state.decoherenceTimer = 0;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'decoherence', params: { spin: p.spin.toFixed(1) } });
                    }
                } else if (!p.collapsed) {
                    state.decoherenceTimer += 0.1;
                }
            } else {
                p.velocityX *= 0.95;
                p.velocityY *= 0.95;
                p.x += p.velocityX;
                p.y += p.velocityY;
                state.decoherenceTimer = 0;
            }

            if (state.tunnelFlash > 0) {
                sketch.fill(255, 0, 0, state.tunnelFlash * 10);
                sketch.ellipse(p.x, p.y, 10, 10);
                state.tunnelFlash--;
            }

            sketch.fill(state.r, state.g, state.b, state.a);
            sketch.noStroke();
            let shapeSize = p.size * pulse;
            if (p.shape === 'ellipse') {
                sketch.ellipse(p.x, p.y, shapeSize, shapeSize * 0.8);
            } else if (p.shape === 'soft-ribbon') {
                sketch.beginShape();
                for (let t = 0; t < 1; t += 0.1) {
                    let x = p.x + Math.cos(t * Math.PI * 2 + p.phase) * p.uncertaintyRadius * pulse;
                    let y = p.y + Math.sin(t * Math.PI * 2 + p.phase) * p.uncertaintyRadius * pulse;
                    sketch.vertex(x, y);
                }
                sketch.endShape();
            } else if (p.shape === 'bio-cluster') {
                sketch.ellipse(p.x, p.y, shapeSize * 1.2, shapeSize);
                for (let i = 0; i < 3; i++) {
                    sketch.ellipse(p.x + Math.cos(i * Math.PI * 2 / 3) * 5, p.y + Math.sin(i * Math.PI * 2 / 3) * 5, 3, 3);
                }
            } else {
                sketch.rect(p.x, p.y, shapeSize, shapeSize);
            }

            if (state.wavePacketAlpha > 0) {
                sketch.noFill();
                sketch.stroke(state.r, state.g, state.b, state.wavePacketAlpha);
                sketch.ellipse(p.x, p.y, p.uncertaintyRadius * 2, p.uncertaintyRadius * 2);
            }

            // Запутанность
            if (p.entangledPartner !== null && window.particles[p.entangledPartner] && ((window.currentStep === 4 || window.currentStep === 5) && window.decompositionTimer >= 8)) {
                var partner = window.particles[p.entangledPartner];
                var partnerState = window.quantumStates[p.entangledPartner];
                // Анимация слияния цветов
                let t = Math.sin(window.frame * 0.05);
                state.r = partnerState.r = (1 - t) * p.originalColor.r + t * partner.originalColor.r;
                state.g = partnerState.g = (1 - t) * p.originalColor.g + t * partner.originalColor.g;
                state.b = partnerState.b = (1 - t) * p.originalColor.b + t * partner.originalColor.b;
                // Синхронизация фазы
                p.phase = partner.phase = (p.phase + partner.phase) / 2;
                p.velocityX = partner.velocityX = (p.velocityX + partner.velocityX) / 2;
                p.velocityY = partner.velocityY = (p.velocityY + partner.velocityY) / 2;

                if (!p.collapsed && !partner.collapsed && Math.random() < 0.007) {
                    state.entanglementFlash = 15;
                    partnerState.entanglementFlash = 15;
                    if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                        potentialMessages.push({ type: 'entanglement', params: { spin: p.spin.toFixed(1) } });
                    }
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        window.playNote(window.noteFrequencies['E4'], 'sine', 0.3, 0.25);
                    }
                }
                if (state.entanglementFlash > 0) {
                    sketch.stroke(63, 22, 127, state.entanglementFlash * 6);
                    sketch.strokeWeight(1.5 + 0.5 * Math.sin(window.frame * 0.1));
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    let gradient = sketch.drawingContext.createLinearGradient(p.x, p.y, partner.x, partner.y);
                    gradient.addColorStop(0, `rgba(${state.r}, ${state.g}, ${state.b}, ${state.entanglementFlash * 0.4})`);
                    gradient.addColorStop(1, `rgba(${partnerState.r}, ${partnerState.g}, ${partnerState.b}, ${partnerState.entanglementFlash * 0.4})`);
                    sketch.drawingContext.strokeStyle = gradient;
                    sketch.line(p.x, p.y, partner.x, partner.y);
                    state.entanglementFlash--;
                    partnerState.entanglementFlash--;
                }
            }

            // Интерференция
            for (let j = 0; j < window.particles.length; j++) {
                if (i !== j) {
                    let other = window.particles[j];
                    let d = Math.sqrt((p.x - other.x) ** 2 + (p.y - other.y) ** 2);
                    if (d < 80) {
                        let interference = Math.sin(state.interferencePhase + other.quantumStates[j].interferencePhase) * 0.5 + 0.5;
                        sketch.stroke(window.baseWebColor.r, window.baseWebColor.g, window.baseWebColor.b, 50 * interference * window.webIntensity);
                        sketch.strokeWeight(0.5 + interference * 0.5);
                        sketch.line(p.x, p.y, other.x, other.y);
                        if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame && Math.random() < 0.01) {
                            potentialMessages.push({ type: 'interference', params: { distance: d.toFixed(1) } });
                        }
                        if (typeof window.playInterference === 'function') {
                            window.playInterference(380, 385, 0.7, 0.25);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error updating particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                potentialMessages.push({ type: 'error', params: { index: i } });
            }
        }
    });

    window.branchParticles.forEach(function(bp, i) {
        bp.update(sketch);
        if (bp.life <= 0) {
            window.branchParticles.splice(i, 1);
        }
    });

    if (potentialMessages.length > 0 && window.globalMessageCooldown <= 0) {
        let message = potentialMessages[Math.floor(Math.random() * potentialMessages.length)];
        window.terminalMessages.push(getRandomMessage(message.type, message.params));
        window.updateTerminalLog();
        window.globalMessageCooldown = 200;
        messageAddedThisFrame = true;
    } else if (window.globalMessageCooldown > 0) {
        window.globalMessageCooldown -= 1;
    }
};

window.observeParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || window.particles.length === 0) {
        console.error('observeParticles: No particles available');
        return;
    }
    window.mouseWave.x = mouseX;
    window.mouseWave.y = mouseY;
    window.mouseWave.radius += 2;
    if (window.mouseWave.radius > window.mouseInfluenceRadius) {
        window.mouseWave.radius = window.mouseInfluenceRadius;
    }
    window.mouseWave.trail.push({ x: mouseX, y: mouseY });
    if (window.mouseWave.trail.length > 10) {
        window.mouseWave.trail.shift();
    }

    window.particles.forEach(function(p, i) {
        var dx = mouseX - p.x;
        var dy = mouseY - p.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < window.mouseInfluenceRadius) {
            p.velocityX += dx * 0.01;
            p.velocityY += dy * 0.01;
            if (Math.random() < 0.02) {
                p.spin *= -1;
            }
        }
    });
};

window.clickParticles = function(sketch, mouseX, mouseY) {
    if (!window.particles || !window.quantumStates || window.particles.length === 0) {
        console.error('clickParticles: No particles or quantum states available');
        if (window.globalMessageCooldown <= 0) {
            window.terminalMessages.push(getRandomMessage('error', { index: 0 }));
            window.updateTerminalLog();
            window.globalMessageCooldown = 200;
        }
        return;
    }
    if (window.currentStep !== 4 && window.currentStep !== 5) {
        console.log('clickParticles skipped: not on step 4 or 5, currentStep: ' + window.currentStep);
        return;
    }
    console.log('clickParticles called, mouseX: ' + mouseX + ', mouseY: ' + mouseY);
    let messageAddedThisFrame = false;
    window.particles.forEach(function(p, i) {
        try {
            var dx = mouseX - p.x;
            var dy = mouseY - p.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var state = window.quantumStates[i];
            var pulse = 1 + 0.3 * Math.sin(p.pulsePhase + p.spin);

            if (distance < window.mouseInfluenceRadius && distance > 0 && window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                if (!p.collapsed) {
                    p.collapsed = true;
                    state.a = 180;
                    p.size = 2.5 * pulse;
                    p.uncertaintyRadius = 2;
                    state.wavePacketAlpha = 0;
                    p.shape = ['ellipse', 'soft-ribbon', 'bio-cluster'][Math.floor(Math.random() * 3)];
                    p.spin = Math.random() < 0.5 ? 0.5 : -0.5;
                    // Усиленный всплеск
                    let gradient = sketch.drawingContext.createRadialGradient(p.x, p.y, 0, p.x, p.y, 30);
                    gradient.addColorStop(0, 'rgba(204, 51, 51, 0.8)');
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    sketch.drawingContext.fillStyle = gradient;
                    sketch.ellipse(p.x, p.y, 30, 30);
                    // Анимация сжатия
                    for (let t = 0; t < 5; t++) {
                        setTimeout(() => {
                            p.size = Math.max(2, p.size - 0.5);
                            sketch.redraw();
                        }, t * 50);
                    }
                    if (p.shape === 'bio-cluster') {
                        sketch.fill(204, 51, 51, 100);
                        for (let i = 0; i < 5; i++) {
                            sketch.ellipse(p.x + Math.cos(i * Math.PI / 2.5) * 10, p.y + Math.sin(i * Math.PI / 2.5) * 10, 5, 5);
                        }
                    }
                    console.log('Particle ' + i + ' collapsed, shape: ' + p.shape + ', spin: ' + p.spin.toFixed(1) + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('collapse', { shape: p.shape, spin: p.spin.toFixed(1) }));
                    window.updateTerminalLog();
                    if (typeof window.playArpeggio === 'function') {
                        window.playArpeggio(p.shape);
                    }
                    for (let j = 0; j < 3 + Math.random() * 3; j++) {
                        window.branchParticles.push(new BranchParticle(p.x, p.y, { r: state.r, g: state.g, b: state.b }));
                    }
                    window.globalMessageCooldown = 200;
                    messageAddedThisFrame = true;
                } else {
                    p.collapsed = false;
                    p.phase = Math.random() * 2 * Math.PI;
                    p.pulsePhase = Math.random() * 2 * Math.PI;
                    p.spin = Math.random() < 0.5 ? 0.5 : -0.5;
                    state.a = 180;
                    state.wavePacketAlpha = 50;
                    p.uncertaintyRadius = 5;
                    p.size = 1.8 + (sketch.noise(p.x * window.noiseScale, p.y * window.noiseScale) * 1.5) * pulse;
                    console.log('Particle ' + i + ' restored to superposition, shape: ' + p.shape + ', spin: ' + p.spin.toFixed(1) + ', alpha: ' + state.a);
                    window.terminalMessages.push(getRandomMessage('superpositionRestore', { spin: p.spin.toFixed(1) }));
                    window.updateTerminalLog();
                    if (typeof window.playNote === 'function' && window.noteFrequencies) {
                        const freq = window.noteFrequencies['E4'] || 329.63;
                        window.playNote(freq, 'sine', 0.2, 0.15);
                    }
                    window.globalMessageCooldown = 200;
                    messageAddedThisFrame = true;
                }
            }
        } catch (error) {
            console.error('Error clicking particle ' + i + ': ' + error);
            if (window.globalMessageCooldown <= 0 && !messageAddedThisFrame) {
                window.terminalMessages.push(getRandomMessage('error', { index: i }));
                window.updateTerminalLog();
                window.globalMessageCooldown = 200;
                messageAddedThisFrame = true;
            }
        }
    });
};

class BranchParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 100;
        this.size = 2 + Math.random() * 2;
        this.color = color;
    }

    update(sketch) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 2;
        sketch.fill(this.color.r, this.color.g, this.color.b, this.life);
        sketch.ellipse(this.x, this.y, this.size, this.size);
    }
}
