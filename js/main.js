var canvas, ctx, c_width, c_height;
var audio, context, analyser, bassAnalyser, source;
var sc;
var c;



function random(min, max) {
    return min + (Math.random() * (max - min));
}





function varsInit() {
    canvas = document.getElementById("audio-visualizer");
    ctx = canvas.getContext("2d");

    sc = new SliderConfig();
    sc.initConfig();
    sc.initSliders();

    var ap = new AudioPlayer(".audio-player", {
        path: "audio/" + config.trackName,
        width: sc.data.playerWidth,
        autoplay: false
    });

    context = new AudioContext();

    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = config.analyser.smoothingTimeConstant;
    analyser.maxDecibels = sc.data.maxDecibels;
    analyser.minDecibels = sc.data.minDecibels;

    bassAnalyser = context.createAnalyser();
    bassAnalyser.maxDecibels = 0;
    bassAnalyser.minDecibels = -30;

    source = context.createMediaElementSource(ap.audio);
    source.connect(analyser);
    source.connect(bassAnalyser);

    analyser.connect(context.destination);
    bassAnalyser.connect(context.destination);




    sc.getSlider("barsCount").addOnChange(function(e) {
        c.barsCount = e;
        c.createBars();
    });

    sc.getSlider("maxDecibels").addOnChange(function(e) {
        analyser.maxDecibels = e;
    });


    sc.getSlider("minDecibels").addOnChange(function(e) {
        analyser.minDecibels = e;
    });

    sc.getSlider("playerWidth").addOnChange(function(e) {
        ap.setWidth(e);
    });

    sc.getSlider("rectPadding").addOnChange(function(e) {
        c.rectPadding = e;
        c.createBars();
    });


    sc.getSlider("rectVelocity").addOnChange(function(e) {
        c.rectVelocity = e;
        c.createBars();
    });


    sc.getSlider("wheelRadius").addOnChange(function(e) {
        c.setRadius(e);
    });


    sc.getSlider("wheelLineWidth").addOnChange(function(e) {
        c.lineWidth = e;
        c.update();
    });
}





function canvasInit() {
    c_width = canvas.width = window.innerWidth;
    c_height = canvas.height = document.querySelector(".audio-box").offsetHeight;

    c = new Circle({
        x: c_width / 2,
        y: c_height / 2,
        lineWidth: sc.data.wheelLineWidth,
        radius: sc.data.wheelRadius,
        barsCount: sc.data.barsCount,
        rectPadding: sc.data.rectPadding,
        rectVelocity: sc.data.rectVelocity
    });

    c.createBars();

}


window.addEventListener("resize", function() {
    canvasInit();
}, false);







// circle
var Circle = (function() {

    var _options = {};

    function Circle(options) {

        _options = options || _options;

        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.color = config.colors.green;
        this.lineWidth = 0;
        this.barsCount = 0;
        this.bars;
        this.bassAmount = 0;

        this.rectPadding = 0;
        this.rectVelocity = 0.05;

        for(o in options) {
            if(Reflect.has(this, o)) {
                Reflect.set(this, o, options[o]);
            }
        }

    }

    Circle.prototype.update = function() {
        this.draw();
    }

    Circle.prototype.draw = function() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }

    Circle.prototype.createBars = function() {
        this.bars = [];
        for(var i = 0; i < this.barsCount; i++) {
            this.bars.push(
                new Rectangle({
                    c: c,
                    height: 3,
                    angle: i * (360 / this.barsCount),
                    color: blendColor(config.colors.red, config.colors.green, i / this.barsCount),
                    padding: this.rectPadding,
                    velocity: this.rectVelocity
                })
            );
        }
    }

    Circle.prototype.setRadius = function(radius) {
        _options.radius = radius;
        this.radius = radius;
        this.update();
    }

    Circle.prototype.setBassAmount = function(bassAmount) {
        this.bassAmount = bassAmount;
        this.radius = _options.radius + bassAmount;
    }

    return Circle;
}());







//rectangle

var Rectangle = (function() {

    var _options = {};

    function Rectangle(options) {

        _options = options || {};

        this.width = 0;
        this.height = 0;
        this.color = config.colors.green;
        this.angle = 0;
        this.padding = 0;
        this.velocity = 0.05;
        this.c = {};

        for(o in options) {
            if(Reflect.has(this, o)) {
                Reflect.set(this, o, options[o]);
            }
        }
    }

    Rectangle.prototype.update = function() {
        this.angle += this.velocity;
        this.draw();
    }

    Rectangle.prototype.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        
        ctx.save();
        ctx.translate(this.c.x, this.c.y);
        ctx.rotate(this.angle * (Math.PI / 180));
        ctx.rect(-(this.width + this.c.radius + this.padding), -this.height / 2, this.width, this.height);
        ctx.restore();
        ctx.fill();
        ctx.closePath();

    }

    return Rectangle;
}());







function animate() {

    ctx.fillStyle = "rgba(23, 32, 48, 0.3)";
    ctx.fillRect(0,0, c_width, c_height);

    window.requestAnimationFrame(animate);

    var mainArray = new Uint8Array(analyser.frequencyBinCount);
    var bassArray = new Uint8Array(bassAnalyser.frequencyBinCount);
    analyser.getByteFrequencyData(mainArray);
    bassAnalyser.getByteFrequencyData(bassArray);

    c.setBassAmount(bassArray[1] / 3);
    c.update();

    var bassPercentage = 0;

    if((bassArray[0] / 2.2) / 30 < 1) {
        bassPercentage = (bassArray[0] / 2.2) / 30;
    }
    else {
        bassPercentage = 1;
    }

    c.color = blendColor(config.colors.green, config.colors.red, bassPercentage);
    c.bars.forEach((b, i) => {
        b.width = mainArray[i];
        b.update();
    });
}




window.addEventListener("load", function() {

    varsInit();
    canvasInit();
    animate();

}, false);