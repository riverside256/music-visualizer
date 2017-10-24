

/**
 * this function represents AudioPlayer object
 * @param {string} selector - the container selector
 * @param {object} options  - options for audio player
 */
function AudioPlayer(selector, options) {
    
    var _elem = document.querySelector(selector);

    var _self = this,
        _options = options || _options;

    var _p = {
        title: {},
        playerBox: {},
        playBtn: {},
        playerSlider: {},
        playerSliderWrapper: {},
        playerVolume: {
            wrapper: {},
            button: {},
            slider: {},
            sliderWrapper: {}
        }
    };
    var _sliderInterval;



    this.audio = {};
    this.width = _options.width || config.player.width;
    this.trackName = _options.trackName || "";
    this.autoplay = (typeof _options.autoplay == "undefined") ? config.player.autoplay : _options.autoplay;




    window.addEventListener("keypress", function(e) {
        var k = e.keyCode || e.which;

        if(e.key == " ") {
            if(_self.audio.paused) {
                _self.play();
            }
            else {
                _self.pause();
            }
        }

    }, false);




    AudioPlayer.prototype.pause = function() {
        clearInterval(_sliderInterval);
        _p.playerBtn.innerHTML = "<i class='fa fa-play'></i>";
        _self.audio.pause();
    }

    AudioPlayer.prototype.play = function() {
        _p.playerBtn.innerHTML = "<i class='fa fa-pause'></i>";
        _self.audio.play();
        _sliderInterval = setInterval(function() {
            _p.playerSlider.label = `${readableDuration(_self.audio.currentTime)}/${readableDuration(_self.audio.duration)}`;
            _p.playerSlider.value = _self.audio.currentTime;
            _p.playerSlider.update();

            if(_self.audio.currentTime == _self.audio.duration) {
                _self.pause();
            }

        }, 10);
    }

    /**
     * This function sets width for audio player
     * @param {number} val - the value of width
     */
    AudioPlayer.prototype.setWidth = function(val) {
        _self.width = val;
        _elem.style.width = _self.width + "px";
    }


    /**
     * This function changes the title while audio player throws error
     * @param {string} msg - error message
     */
    AudioPlayer.prototype.setError = function(msg) {
        _p.title.innerText = msg;
    }


    /**
     * initialize audio data
     */
    var initAudioPlayer = function() {
        _self.audio = new Audio("audio/" + _self.trackName);
        _self.audio.autoplay = _self.autoplay;
    }


    /**
     * creating audio player
     */
    var createAudioPlayer = function() {

        _p.title = document.createElement("div"),
        _p.playerBox = document.createElement("div"),
        _p.playerBtn = document.createElement("button"),
        _p.playerSliderWrapper = document.createElement("div");

        _p.playerVolume.wrapper = document.createElement("div");
        _p.playerVolume.button = document.createElement("button");
        _p.playerVolume.sliderWrapper = document.createElement("div");


        _p.playerVolume.wrapper.classList.add("audio-player__volume");
        _p.playerVolume.button.classList.add("audio-player__btn", "audio-player__btn--disabled");
        _p.playerVolume.sliderWrapper.classList.add("audio-player__volume__slider");



        _p.playerVolume.button.innerHTML = `<i class="fa fa-volume-up" aria-hidden="true"></i>`;

        _p.playerVolume.button.addEventListener("click", function() {
            _p.playerVolume.sliderWrapper.classList.toggle("audio-player__volume__slider--shown");
        }, false);


        document.body.addMultiEventListener("click keyup", function(e) {
            var k = e.keyCode || e.which;

            if(_p.playerVolume.sliderWrapper.classList.contains("audio-player__volume__slider--shown")) {
                if(k == 27 || (!/slider/.test(e.target.className) && e.target.className != "audio-player__btn")) {
                    _p.playerVolume.sliderWrapper.classList.remove("audio-player__volume__slider--shown");
                }
            }

        });


        _p.playerVolume.wrapper.appendChild(_p.playerVolume.button);
        _p.playerVolume.wrapper.appendChild(_p.playerVolume.sliderWrapper);




        _p.title.classList.add("audio-player__title");
        _self.setError(`Track called '${_self.trackName}' not exists`);

        _p.playerBox.classList.add("audio-player__box");

        _p.playerBtn.classList.add("audio-player__btn", "audio-player__btn--disabled");
        _p.playerBtn.innerHTML = `<i class="fa fa-play"></i>`;
        _p.playerSliderWrapper.classList.add("audio-player__slider");
        
        _p.playerBox.appendChild(_p.playerBtn);
        _p.playerBox.appendChild(_p.playerSliderWrapper);
        _p.playerBox.appendChild(_p.playerVolume.wrapper);

        _elem.appendChild(_p.title);
        _elem.appendChild(_p.playerBox);

        _self.setWidth(_self.width);





        _self.audio.addEventListener("loadeddata", function() {

            _p.playerBtn.classList.remove("audio-player__btn--disabled");
            _p.playerVolume.button.classList.remove("audio-player__btn--disabled");

            _p.title.classList.add("audio-player__title");
            _p.title.innerText = _self.trackName.substring(0, _self.trackName.length - 4);


            _p.playerBtn.addEventListener("click", function() {
                if(_self.audio.paused) {
                    _self.play();
                }
                else {
                    _self.pause();
                }
            }, false);


            _p.playerSlider = new Slider(".audio-player__slider", {
                label: `${readableDuration(_self.audio.currentTime)}/${readableDuration(_self.audio.duration)}`,
                min: 0,
                max: _self.audio.duration,
                value: _self.audio.currentTime,
                direction: HORIZONTAL
            });

            _p.playerSlider.addOnChange(function(e) {
                _p.playerSlider.setLabel(`${readableDuration(e)}/${readableDuration(_self.audio.duration)}`);
                _p.playerSlider.label = `${readableDuration(e)}/${readableDuration(_self.audio.duration)}`;
                _self.audio.currentTime = e;
                _p.playerSlider.update();
            });


            _p.playerVolume.slider = new Slider(".audio-player__volume__slider", {
                label: _self.audio.volume,
                min: 0,
                max: 1,
                value: _self.audio.volume,
                rounded: false
            });

            _p.playerVolume.slider.addOnChange(function(e) {
                _self.audio.volume = e;
                _p.playerVolume.slider.label = _self.audio.volume.toFixed(2);
            }, false);
        });
    }


    /**
     * changing time in seconds to readable sonds
     * @param {number} seconds - seconds
     * @returns {string} formatted time, for example 09:12
     */
    var readableDuration = function(seconds) {
        sec = Math.floor( seconds );    
        min = Math.floor( sec / 60 );
        min = min >= 10 ? min : '0' + min;    
        sec = Math.floor( sec % 60 );
        sec = sec >= 10 ? sec : '0' + sec;    
        return min + ':' + sec;
    }


    initAudioPlayer();
    createAudioPlayer();
}