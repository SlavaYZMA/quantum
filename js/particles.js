<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quantum Portrait</title>
    <link rel="stylesheet" href="./css/style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.2/p5.min.js"></script>
    <script src="./js/globals.js"></script>
    <script src="./js/particles.js"></script>
    <script src="./js/observer.js"></script>
    <script src="./js/main.js"></script>
    <script src="./js/audio.js"></script>
    <script src="./js/textSteps.js"></script>
    <script src="./js/utils.js"></script>
</head>
<body>
    <section id="step-0" class="step">
        <div class="text-block typewriter" data-i18n="step0_text">Пожалуйста, выберите язык RU / ENG</div>
        <div class="button-block">
            <button onclick="window.setLanguageAndNext('ru')">RU</button>
            <button onclick="window.setLanguageAndNext('en')">ENG</button>
        </div>
    </section>
    <section id="step-1" class="step step-centered">
        <div class="text-block typewriter">
            <div data-i18n="step1_title"></div>
            <div data-i18n="step1_text1"></div>
            <div data-i18n="step1_text2"></div>
            <div data-i18n="step1_text3"></div>
        </div>
        <div class="button-block">
            <button class="continue" data-i18n="continue">Продолжить</button>
            <button class="back" data-i18n="back">Назад</button>
        </div>
    </section>
    <section id="step-2" class="step step-centered">
        <div class="text-block typewriter">
            <div data-i18n="step2_title"></div>
            <div data-i18n="step2_text1"></div>
        </div>
        <div class="button-block">
            <button id="uploadImage" data-i18n="upload_image">Загрузить изображение</button>
            <button id="useCamera" data-i18n="use_camera">Включить камеру</button>
            <button id="useArchive" data-i18n="use_archive">Выбрать из архива</button>
            <button class="back" data-i18n="back">Назад</button>
        </div>
    </section>
    <section id="step-2.1" class="step step-centered">
        <div class="text-block typewriter">
            <div data-i18n="step2_text2"></div>
            <div data-i18n="step2_text3"></div>
            <div data-i18n="step2_text4"></div>
        </div>
        <div class="button-block">
            <button class="continue" data-i18n="continue">Продолжить</button>
            <button class="back" data-i18n="back">Назад</button>
        </div>
    </section>
    <section id="step-3" class="step step-centered">
        <div class="text-block typewriter">
            <div data-i18n="step3_title"></div>
            <div data-i18n="step3_text1"></div>
            <div data-i18n="step3_text2"></div>
            <div data-i18n="step3_text3"></div>
            <div data-i18n="step3_text4"></div>
            <div data-i18n="step3_text5"></div>
            <div data-i18n="step3_text6"></div>
            <div data-i18n="step3_text7"></div>
            <div data-i18n="step3_text8"></div>
        </div>
        <div class="button-block">
            <button class="continue" data-i18n="continue">Продолжить</button>
            <button class="back" data-i18n="back">Назад</button>
        </div>
    </section>
    <section id="step-4" class="step step-centered">
        <div class="text-block typewriter">
            <canvas class="text-canvas" style="display: block; width: 600px; height: 100px;"></canvas>
            <div data-i18n="step4_title" style="display: none;">Шаг 3: НАЧНИТЕ НАБЛЮДЕНИЕ</div>
            <div data-i18n="step4_text1" style="display: none;">> Двигайте курсором по изображению.</div>
            <div data-i18n="step4_text2" style="display: none;">> Каждый ваш жест запускает коллапс.</div>
            <div data-i18n="step4_text3" style="display: none;">> Система реагирует. Наблюдаемый образ формируется здесь и сейчас.</div>
        </div>
        <div style="display: flex; justify-content: space-between; width: 100%;">
            <img id="thumbnail-portrait" style="display: none; width: 100px; height: 100px;" />
            <div id="portrait-animation-container-step-4" style="border: 2px dashed #0f0;"></div>
        </div>
        <div class="button-block">
            <button class="continue" data-i18n="continue">Продолжить</button>
            <button class="back" data-i18n="back">Назад</button>
        </div>
    </section>
    <section id="step-5" class="step step-centered">
        <div class="text-block typewriter">
            <canvas class="text-canvas" style="display: block; width: 600px; height: 100px;"></canvas>
            <div data-i18n="step5_title" style="display: none;"></div>
            <div data-i18n="step5_text1" style="display: none;"></div>
            <div data-i18n="step5_text2" style="display: none;"></div>
            <div data-i18n="step5_text3" style="display: none;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; width: 100%;">
            <img id="thumbnail-portrait" style="display: none; width: 100px; height: 100px;" />
            <div id="portrait-animation-container-step-5" style="border: 2px dashed #0f0;"></div>
        </div>
        <div class="button-block">
            <input id="portraitName" type="text" placeholder="Название портрета" data-i18n-placeholder="portrait_name_placeholder">
            <button id="saveImage" data-i18n="save_observation">[ЗАПИСАТЬ НАБЛЮДЕНИЕ]</button>
            <button class="continue" data-i18n="continue">Продолжить</button>
            <button class="back" data-i18n="back">Назад</button>
        </div>
    </section>
    <section id="step-6" class="step step-centered">
        <div class="text-block typewriter">
            <div data-i18n="step6_title"></div>
            <div data-i18n="step6_text1"></div>
            <div data-i18n="step6_text2"></div>
            <div data-i18n="step6_text3"></div>
        </div>
        <div class="button-block">
            <button id="shareObservation" data-i18n="share_observation">[ПОДЕЛИТЬСЯ НАБЛЮДЕНИЕМ]</button>
            <button class="continue" data-i18n="continue">Продолжить</button>
            <button class="back" data-i18n="back">Назад</button>
        </div>
    </section>
    <section id="step-7" class="step step-centered">
        <div class="text-block typewriter">
            <div data-i18n="step7_text1"></div>
            <div data-i18n="step7_text2"></div>
            <div data-i18n="step7_text3"></div>
        </div>
        <div class="button-block">
            <button id="restart" data-i18n="restart">[↻ НАЧАТЬ СНАЧАЛА]</button>
            <button id="archive" data-i18n="archive">[⧉ ПЕРЕЙТИ В АРХИВ НАБЛЮДЕНИЙ]</button>
            <button id="aboutAuthors" data-i18n="about_authors">[ОБ АВТОРАХ]</button>
            <button class="back" data-i18n="back">Назад</button>
        </div>
    </section>

    <script>
        window.quantumSketch = new p5(function(sketch) {
            console.log('p5 настройка вызвана');
            let portraitCanvas, textCanvasStep4, textCanvasStep5;
            sketch.setup = function() {
                portraitCanvas = sketch.createCanvas(400, 400);
                portraitCanvas.class('quantum-canvas');
                portraitCanvas.parent('portrait-animation-container-step-4');
                console.log('Холст портрета создан, ширина: ' + portraitCanvas.width + ', высота: ' + portraitCanvas.height);
                textCanvasStep4 = sketch.createCanvas(600, 100);
                textCanvasStep4.class('text-canvas');
                textCanvasStep4.parent(document.querySelector('#step-4 .text-block'));
                console.log('Холст текста для шага 4 создан, ширина: ' + textCanvasStep4.width + ', высота: ' + textCanvasStep4.height);
                textCanvasStep5 = sketch.createCanvas(600, 100);
                textCanvasStep5.class('text-canvas');
                textCanvasStep5.parent(document.querySelector('#step-5 .text-block'));
                console.log('Холст текста для шага 5 создан, ширина: ' + textCanvasStep5.width + ', высота: ' + textCanvasStep5.height);
                sketch.noLoop();
            };

            sketch.draw = function() {
                const quantumCanvas = document.querySelector('.quantum-canvas');
                if (!quantumCanvas) {
                    console.error('Quantum canvas не найден');
                    return;
                }
                console.log('draw вызван, currentStep: ' + window.currentStep + ', canvasVisible: ' + (quantumCanvas.style.display !== 'none'));
                sketch.background(0);
                if (window.currentStep === 4 || window.currentStep === 5) {
                    if (window.particles && window.particles.length > 0) {
                        window.updateParticles(sketch);
                    } else {
                        console.error('Нет частиц для рендеринга: ', { particles: window.particles ? window.particles.length : 0 });
                    }
                    if (window.textParticles && window.textParticles.length > 0) {
                        window.updateTextParticles(sketch);
                    } else {
                        console.log('Нет текстовых частиц для рендеринга, инициализация...');
                        window.initializeTextParticles(sketch);
                    }
                    sketch.fill(255);
                    sketch.textSize(16);
                    sketch.text('Кадр: ' + (window.frame || 0), 10, 20);
                }
            };

            sketch.mouseMoved = function() {
                if (window.currentStep === 4 || window.currentStep === 5) {
                    window.observeParticles(sketch, sketch.mouseX, sketch.mouseY);
                    window.observeTextParticles(sketch, sketch.mouseX, sketch.mouseY);
                }
            };

            sketch.mouseClicked = function() {
                if (window.currentStep === 4 || window.currentStep === 5) {
                    window.clickParticles(sketch, sketch.mouseX, sketch.mouseY);
                    window.clickTextParticles(sketch, sketch.mouseX, sketch.mouseY);
                    sketch.loop();
                }
            };

            sketch.startAnimation = function() {
                sketch.loop();
                console.log('Анимация запущена');
                if (window.currentStep === 4 || window.currentStep === 5) {
                    if (!window.textParticles || window.textParticles.length === 0) {
                        window.initializeTextParticles(sketch);
                    }
                }
            };

            sketch.moveCanvas = function(step) {
                if (step === 4 || step === 5) {
                    const containerId = `portrait-animation-container-step-${step}`;
                    const container = document.getElementById(containerId);
                    if (container && portraitCanvas) {
                        portraitCanvas.parent(containerId);
                        console.log(`Холст портрета перемещён в ${containerId}`);
                    } else {
                        console.error('Не удалось переместить холст портрета', { container: !!container, portraitCanvas: !!portraitCanvas });
                    }
                }
            };
        });

        document.getElementById('uploadImage').addEventListener('click', function() {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                console.log('Image input changed, files: ' + e.target.files.length);
                if (!e.target || !e.target.files || e.target.files.length === 0 || !window.quantumSketch) {
                    console.error('Error: Invalid file input or quantumSketch not initialized', {
                        hasTarget: !!e.target,
                        hasFiles: e.target.files ? e.target.files.length : 0,
                        quantumSketch: !!window.quantumSketch
                    });
                    return;
                }
                var file = e.target.files[0];
                window.quantumSketch.loadImage(URL.createObjectURL(file), function(img) {
                    console.log('Image loaded successfully, dimensions: ' + img.width + ', ' + img.height);
                    window.img = img;
                    window.initializeParticles(img);
                    var thumbnails = document.querySelectorAll('#thumbnail-portrait');
                    console.log('Found thumbnails: ' + thumbnails.length);
                    thumbnails.forEach(function(thumbnail) {
                        thumbnail.src = URL.createObjectURL(file);
                        thumbnail.style.display = (window.currentStep === 4 || window.currentStep === 5) ? 'block' : 'none';
                        console.log('Updated thumbnail src: ' + thumbnail.src + ', display: ' + thumbnail.style.display);
                    });
                    window.moveToNextStep(2.1);
                    input.remove();
                }, function() {
                    console.error('Error loading image');
                    input.remove();
                });
            };
            input.click();
        });

        document.getElementById('saveImage').addEventListener('click', function() {
            const portraitName = document.getElementById('portraitName').value || 'quantum_portrait';
            window.quantumSketch.saveCanvas(portraitName, 'png');
            console.log('Image saved with name: ' + portraitName);
        });

        document.getElementById('shareObservation').addEventListener('click', function() {
            window.open('https://t.me/quantum_portrait_channel', '_blank');
            console.log('Share observation: opened Telegram channel');
        });

        document.getElementById('restart').addEventListener('click', function() {
            window.location.reload();
            console.log('Restart: page reloaded');
        });

        document.getElementById('archive').addEventListener('click', function() {
            window.open('https://t.me/quantum_portrait_channel', '_blank');
            console.log('Archive: opened Telegram channel');
        });

        document.getElementById('aboutAuthors').addEventListener('click', function() {
            window.location.href = './about.html';
            console.log('About authors: navigated to about.html');
        });

        document.getElementById('useCamera').addEventListener('click', function() {
            console.log('Camera button clicked - functionality not implemented');
            alert('Камера пока не поддерживается.');
        });

        document.getElementById('useArchive').addEventListener('click', function() {
            console.log('Archive button clicked - functionality not implemented');
            alert('Архив пока не поддерживается.');
        });

        var originalMoveToNextStep = window.moveToNextStep;
        window.moveToNextStep = function(stepIndex) {
            console.log('moveToNextStep вызван с stepIndex: ' + stepIndex);
            originalMoveToNextStep(stepIndex);
            var thumbnails = document.querySelectorAll('#thumbnail-portrait');
            thumbnails.forEach(function(thumbnail) {
                thumbnail.style.display = (stepIndex === 4 || stepIndex === 5) ? 'block' : 'none';
                console.log('Отображение миниатюры установлено: ' + thumbnail.style.display + ' для шага: ' + stepIndex);
            });
            var textCanvases = document.querySelectorAll('.text-canvas');
            textCanvases.forEach(function(canvas) {
                canvas.style.display = (stepIndex === 4 || stepIndex === 5) ? 'block' : 'none';
                if (stepIndex === 4 || stepIndex === 5) {
                    canvas.parentElement.querySelectorAll('div[data-i18n]').forEach(div => div.style.display = 'none');
                } else {
                    canvas.parentElement.querySelectorAll('div[data-i18n]').forEach(div => div.style.display = 'block');
                }
            });
            if (stepIndex === 4 || stepIndex === 5) {
                window.quantumSketch.moveCanvas(stepIndex);
                window.quantumSketch.startAnimation();
            } else {
                window.quantumSketch.noLoop();
            }
        };
    </script>
</body>
</html>
