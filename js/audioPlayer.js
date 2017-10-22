function AudioPlayer(selector, options) {
    
    var _elem = document.querySelector(selector);

    var _self = this,
        _options = options || _options;

    var _p = {
        title: {},
        playerBox: {},
        playBtn: {},
        playerSlider: {},
        playerSliderWrapper: {}
    };
    var _sliderInterval;



    this.audio = {};
    this.width = _options.width || config.player.width;
    this.path = _options.path || "";
    this.trackName = "";
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


    AudioPlayer.prototype.setWidth = function(val) {
        _self.width = val;
        _elem.style.width = _self.width + "px";
    }



    var initAudioPlayer = function() {
        _self.trackName = _self.path.split("/")[_self.path.split("/").length - 1];
        _self.trackName = _self.trackName.substring(0, _self.trackName.length - 4);
        
        _self.audio = new Audio(_self.path);
        _self.audio.autoplay = _self.autoplay;
    }



    var createAudioPlayer = function() {
        _p.title = document.createElement("div"),
        _p.playerBox = document.createElement("div"),
        _p.playerBtn = document.createElement("button"),
        _p.playerSliderWrapper = document.createElement("div");

        _p.title.classList.add("audio-player__title");
        _p.title.innerText = _self.trackName;

        _p.playerBox.classList.add("audio-player__box");

        _p.playerBtn.classList.add("audio-player__btn");
        _p.playerBtn.innerHTML = `<i class="fa fa-play"></i>`;
        _p.playerSliderWrapper.classList.add("audio-player__slider");
        
        _p.playerBox.appendChild(_p.playerBtn);
        _p.playerBox.appendChild(_p.playerSliderWrapper);

        _elem.appendChild(_p.title);
        _elem.appendChild(_p.playerBox);

        _self.setWidth(_self.width);


        _self.audio.addEventListener("loadeddata", function() {

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


            _p.playerBtn.addEventListener("click", function() {
                if(_self.audio.paused) {
                    _self.play();
                }
                else {
                    _self.pause();
                }
            }, false);
        });
    }


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