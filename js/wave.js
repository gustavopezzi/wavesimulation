$(document).ready(function() {
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
        
    window.requestAnimationFrame = requestAnimationFrame;

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = window.innerWidth;
    var height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    var tension = .025;
    var dampening = 0.025;
    var spread = 0.25;

    var wavesNum = 200;
    var waves = [];
    var lastWave = new Date().getTime();
    var waveDelay = 500;

    for (var i = 0; i < wavesNum; i++) {
        var x = Math.ceil(width / wavesNum) * i;
        var y = height - (height / 3) * 2;

        waves.push({
            pos: {
                x: x,
                y: y
            },
            targetHeight: height - y,
            height: height - y,
            speed: 0
        });
    }

    function update() {
        if (new Date().getTime() > lastWave + waveDelay) {
            lastWave = new Date().getTime();
            waveDelay = Math.floor(Math.random() * 1000);
            waves[Math.floor(Math.random() * wavesNum)].speed -= 20 + Math.random() * 80;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < wavesNum; i++) {
            var diff = waves[i].targetHeight - waves[i].height;

            waves[i].speed += tension * diff - waves[i].speed * dampening;
            waves[i].height += waves[i].speed;
        }

        var lDeltas = [];
        var rDeltas = [];

        for (var i = 0; i < wavesNum; i++) {
            if (i > 0) {
                lDeltas[i] = spread * (waves[i].height - waves[i - 1].height);
                waves[i - 1].speed += lDeltas[i];
            }

            if (i < wavesNum - 1) {
                rDeltas[i] = spread * (waves[i].height - waves[i + 1].height);
                waves[i + 1].speed += rDeltas[i];
            }
        }

        for (var i = 0; i < wavesNum; i++) {
            if (i > 0) {
                waves[i - 1].height += lDeltas[i];
            }

            if (i < waves.length - 1) {
                waves[i + 1].height += rDeltas[i];
            }

            waves[i].pos.y = height - waves[i].height;

            if (i < wavesNum - 1) {
                var grad = ctx.createLinearGradient(waves[i].pos.x, waves[i].pos.y, waves[i + 1].pos.x, height);
                
                grad.addColorStop(0, 'rgb(0,100,200)');
                grad.addColorStop(1, 'rgb(0,0,100)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.lineTo(waves[i].pos.x, waves[i].pos.y);
                ctx.lineTo(waves[i + 1].pos.x, waves[i].pos.y);
                ctx.lineTo(waves[i + 1].pos.x, height);
                ctx.lineTo(waves[i].pos.x, height);
                ctx.fill();
            }
        }

        requestAnimationFrame(update);
    }

    waves[Math.floor(Math.random() * wavesNum)].speed = 20;
    
    update();

    canvas.addEventListener('click', function(e) {
        var wave = Math.floor(e.clientX / (width / wavesNum));
        waves[wave].speed -= Math.random() * 160;
    });
});