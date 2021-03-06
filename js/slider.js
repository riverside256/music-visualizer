
const HORIZONTAL = "horizontal";
const VERTICAL = "vertical";


/**
 * This function represents the Sldier object
 * @param {string} selector - the container selector
 * @param {object} options  - options for slider
 */
function Slider(selector, options) {

    let _self = this;

    var _elem = {},
        _options = {};

    var _s = {
        wrapper: {},
        label: {},
        stripe: {},
        filling: {},
        thumb: {}
    }

    var _percentage = 0;



    _elem = document.querySelector(selector);
    _options = options || _options;

    selector = selector.substring(1);



    this.label = _options.label || "default";
    this.min = _options.min || 0;
    this.max = _options.max || 1;
    this.value = _options.value || this.min;
    this.direction = _options.direction || VERTICAL;
    this.unit = _options.unit || "number";
    this.rounded = (typeof _options.rounded == "undefined") ? true : _options.rounded;
    this.disabled = (typeof(_options.disabled) == "undefined") ? false : _options.disabled;
    this.callBacks = [];




    this.setLabel = function(val) {
        _s.label.innerHTML = `<span>${val}</span>`;
    }

    this.setThumbValue = function(val) {
        if(_self.direction == VERTICAL) {
            _s.thumb.style.top = val + "px";
            _s.filling.style.height = (_s.stripe.offsetHeight - val - (_s.thumb.offsetHeight / 2)) + "px";
        }
        else {
            _s.thumb.style.left = val + "px";
            _s.filling.style.width = (val + (_s.thumb.offsetWidth / 2)) + "px";
        }
    }

    this.getElement = function(elemName) {
        return document.querySelector(`#${selector}__${elemName}`);
    }

    this.addOnChange = function(callback) {
        this.callBacks.push(callback);
    }

    this.update = function() {
        switch(_self.unit) {
            case "number":
                _s.thumb.setAttribute("title", (_self.rounded == true) ? Math.floor(_self.value) : _self.value.toFixed(2));
                break;
            case "time":
                _s.thumb.setAttribute("title", readableDuration(_self.value));
                break;
            default:
                throw new Error("Unrecognized time unit '"+ _self.unit +"'");
        }
        initSlider();
    }


    this.disable = function() {
        this.disabled = true;
        this.getElement("wrapper").classList.add("slider--disabled");
        manageSlider();
        this.update();
    }

    this.enable = function() {
        this.disabled = false;
        this.getElement("wrapper").classList.remove("slider--disabled");
        manageSlider();
        this.update();
    }


    /*
     * creating slider markup
     */
    var createSlider = function() {

        if(_self.value > _self.max || _self.value < _self.min) {
            throw new Error(`The 'value' of the slider must be between ${_self.min} and ${_self.max}. Currect value is: ${_self.value}`);
        }
        if(_self.max < _self.min) {
            throw new Error("The 'max' number must have larger value than the 'min' number");
        }

        _s.wrapper = document.createElement("div");
        _s.label = document.createElement("div");
        _s.stripe = document.createElement("div");
        _s.filling = document.createElement("div");
        _s.thumb = document.createElement("div");

        _s.wrapper.classList.add("slider", `slider--${_self.direction}`);
        _s.label.classList.add("slider__label");
        _s.stripe.classList.add("slider__stripe");
        _s.filling.classList.add("slider__filling");
        _s.thumb.classList.add("slider__thumb");

        switch(_self.unit) {
            case "number":
                _s.thumb.setAttribute("title", (_self.rounded == true) ? Math.floor(_self.value) : _self.value.toFixed(2));
                break;
            case "time":
                _s.thumb.setAttribute("title", readableDuration(_self.value));
                break;
            default:
                throw new Error("Unrecognized time unit '"+ _self.unit +"'");
        }

        if(_self.disabled) {
            _s.wrapper.classList.add("slider--disabled");
        }

        _s.wrapper.id = selector + "__wrapper";
        _s.label.id = selector + "__label";
        _s.stripe.id = selector + "__stripe";
        _s.filling.id = selector + "__filling";
        _s.thumb.id = selector + "__thumb";


        _s.stripe.appendChild(_s.filling);
        _s.stripe.appendChild(_s.thumb);

        _s.wrapper.appendChild(_s.stripe);
        _s.wrapper.appendChild(_s.label);

        _elem.appendChild(_s.wrapper);
    }




    /*
     *  initializing slider
     */
    var initSlider = function() {
        _self.setLabel(_self.label);

        if(_self.direction == VERTICAL) {
            _percentage = 1 - ((_self.value - _self.min) / (_self.max - _self.min));
            _self.setThumbValue(_percentage * _s.stripe.offsetHeight - (_s.thumb.offsetHeight / 2));
        }
        else {
            _percentage = (_self.value - _self.min) / (_self.max - _self.min);
            _self.setThumbValue(_percentage * _s.stripe.offsetWidth - (_s.thumb.offsetWidth / 2));
        }
    }





    /*
     * adding events to the slider
     */
    var manageSlider = function() {
        if(!_self.disabled) {
            var drag = false;


            document.body.addEventListener("mousedown", function(e) {
                if(e.target.id == _s.thumb.id) {
                    drag = true;
                }
                if(e.target.id == _s.stripe.id || e.target.id == _s.filling.id) {
                    drag = true;
                    manage(e);
                }
            }, false);



            function manage(e) {
                var dragPos;

                if(drag) {
                    if(_self.direction == VERTICAL) {
                        dragPos = e.clientY - _s.stripe.getBoundingClientRect().y;

                        if(dragPos > 0 && dragPos < _s.stripe.offsetHeight) {
                            _self.setThumbValue(dragPos - (_self.getElement("thumb").offsetHeight / 2));

                            _percentage = 1 - ((_self.getElement("thumb").offsetTop + _self.getElement("thumb").offsetHeight / 2) / _self.getElement("stripe").offsetHeight);
                        }

                    }
                    else {
                        dragPos = e.clientX - _s.stripe.getBoundingClientRect().x;

                        if(dragPos > 0 && dragPos < _s.stripe.offsetWidth) {
                            _self.setThumbValue(dragPos - (_self.getElement("thumb").offsetWidth / 2));

                            _percentage = (_self.getElement("thumb").offsetLeft + _self.getElement("thumb").offsetWidth / 2) / _self.getElement("stripe").offsetWidth;
                        }
                    }


                    _self.value = (_percentage * (_self.max - _self.min)) + _self.min;
                    _self.setLabel((_self.rounded == true) ? Math.floor(_self.value) : _self.value.toFixed(2));
                    switch(_self.unit) {
                        case "number":
                            _s.thumb.setAttribute("title", (_self.rounded == true) ? Math.floor(_self.value) : _self.value.toFixed(2));
                            break;
                        case "time":
                            _s.thumb.setAttribute("title", readableDuration(_self.value));
                            break;
                        default:
                            throw new Error("Unrecognized time unit '"+ _self.unit +"'");
                    }
                    isLabelChanging(true);

                    _self.callBacks.forEach(c => c(_self.value));
                }

            }


            document.body.addEventListener("mousemove", e => manage(e), false);

            document.body.addEventListener("mouseup", function() {
                drag = false;
                _self.setLabel(_self.label);
                isLabelChanging(false);
            }, false);
        }
    }



    /*
     * adding class to label when the value is changing
     */
    var isLabelChanging = function(ch) {
        if(ch) {
            _s.label.classList.add("slider__label--changing");
        }
        else {
            _s.label.classList.remove("slider__label--changing");
        }
    }

    createSlider();
    initSlider();
    manageSlider();
}