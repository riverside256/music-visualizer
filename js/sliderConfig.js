
var _self = {};

/**
 * Represents the Slider configuration object
 */
function SliderConfig() {

    _self = this;

    this.data = {
        barsCount: config.bars.count,
        maxDecibels: config.analyser.maxDecibels,
        minDecibels: config.analyser.minDecibels,
        playerWidth: config.player.width,
        rectPadding: config.rect.padding,
        rectVelocity: config.rect.velocity,
        wheelLineWidth: config.wheel.lineWidth,
        wheelRadius: config.wheel.radius
    };
    this.sliders = {};
}



/**
 * save sliders data config
 */
SliderConfig.prototype.saveConfig = function() {
    localStorage.setItem("config", JSON.stringify(this.data));
}


/*
 * initializing slider config
 */
SliderConfig.prototype.initConfig = function() {
    if(localStorage.getItem("config") == null) {
        _self.saveConfig();
    }
    else {
        _self.data = JSON.parse(localStorage.getItem("config"));
    }
}



/**
 * initializing sliders value
 */
SliderConfig.prototype.initSliders = function() {

    this.sliders.barsCount = new Slider("#barsCount", {
        label: "Bars count",
        min: 100,
        max: 300,
        value: _self.data.barsCount
    });
    this.getSlider("barsCount").addOnChange(function(e) {
        _self.data.barsCount = Math.floor(e);
        _self.saveConfig();
    });




    this.sliders.maxDecibels = new Slider("#maxDecibels", {
        label: "Max Decibels",
        min: -30,
        max: 0,
        value: _self.data.maxDecibels
    });
    this.getSlider("maxDecibels").addOnChange(function(e) {
        _self.data.maxDecibels = e;
        if(e >= _self.getSlider("minDecibels").value) {
            _self.getSlider("minDecibels").max = e;
            _self.getSlider("minDecibels").update();
        }
        _self.saveConfig();
    });



    this.sliders.minDecibels = new Slider("#minDecibels", {
        label: "Min decibels",
        min: -100,
        max: 0,
        value: _self.data.minDecibels
    });
    this.getSlider("minDecibels").addOnChange(function(e) {
        _self.data.minDecibels = e;
        if(e <= _self.getSlider("maxDecibels").value) {
            _self.getSlider("maxDecibels").min = e;
            _self.getSlider("maxDecibels").update();
        }
        _self.saveConfig();
    });



    this.sliders.playerWidth = new Slider("#playerWidth", {
        label: "Player width",
        min: 500,
        max: 950,
        value: _self.data.playerWidth
    });
    this.getSlider("playerWidth").addOnChange(function(e) {
        _self.data.playerWidth = e;
        _self.saveConfig();
    });



    this.sliders.rectPadding = new Slider("#rectPadding", {
        label: "Space between circle and rectangles",
        min: 1,
        max: 20,
        value: _self.data.rectPadding
    });
    this.getSlider("rectPadding").addOnChange(function(e) {
        _self.data.rectPadding = e;
        if(e >= _self.getSlider("wheelLineWidth").value) {
            _self.getSlider("wheelLineWidth").max = e;
            _self.getSlider("wheelLineWidth").update();
        }
        _self.saveConfig();
    });





    this.sliders.rectVelocity = new Slider("#rectVelocity", {
        label: "Rectangle's rotation speed",
        min: 0,
        max: 1,
        value: _self.data.rectVelocity,
        rounded: false
    });
    this.getSlider("rectVelocity").addOnChange(function(e) {
        _self.data.rectVelocity = e;
        _self.saveConfig();
    });






    this.sliders.wheelLineWidth = new Slider("#wheelLineWidth", {
        label: "Wheel line width",
        min: 1,
        max: 10,
        value: _self.data.wheelLineWidth
    });
    this.getSlider("wheelLineWidth").addOnChange(function(e) {
        _self.data.wheelLineWidth = e;
        if(e <= _self.getSlider("rectPadding").value) {
            _self.getSlider("rectPadding").min = e;
            _self.getSlider("rectPadding").update();
        }
        console.log(_self.getSlider("rectPadding").min, _self.getSlider("rectPadding").value);
        _self.saveConfig();
    });





    this.sliders.wheelRadius = new Slider("#wheelRadius", {
        label: "Wheel radius",
        min: 20,
        max: 70,
        value: _self.data.wheelRadius
    });
    this.getSlider("wheelRadius").addOnChange(function(e) {
        _self.data.wheelRadius = e;
        _self.saveConfig();
    });
}




/**
 * @param {string} slider - The slider name from 'data' object
 * return the Slider object from specified
 */
SliderConfig.prototype.getSlider = function(slider) {
    if(typeof _self.sliders[slider] == "undefined") {
        throw new Error(`Slider called '${slider}' not exists`);
    }

    return _self.sliders[slider];
}