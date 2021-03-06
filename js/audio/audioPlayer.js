

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
        playerPlaylist: {}
    };
    var _sliderInterval;



    this.audio = {};
    this.width = _options.width || config.player.width;
    this.autoplay = (typeof _options.autoplay == "undefined") ? false : _options.autoplay;
    this.playList = new AudioPlayList();

    this.audioOnLoad = function() {};



    window.addEventListener("keypress", function(e) {
        var k = e.keyCode || e.which;

        if(e.key == " " && !isTarget(e, "playBtn")) {
            if(_self.audio.paused) {
                _self.play();
            }
            else {
                _self.pause();
            }
        }

    }, false);





    /**
     * Function for pausing audio track.
     */
    AudioPlayer.prototype.pause = function() {
        clearInterval(_sliderInterval);
        _p.controls.playBtn.innerHTML = "<i class='fa fa-play'></i>";
        _self.audio.pause();
    }






    AudioPlayer.prototype.play = function() {
        _p.controls.playBtn.innerHTML = "<i class='fa fa-pause'></i>";
        _self.audio.play();
        _sliderInterval = setInterval(function() {
            _p.controls.sliderWrapper.slider.label = `${readableDuration(_self.audio.currentTime)}/${readableDuration(_self.audio.duration)}`;
            _p.controls.sliderWrapper.slider.value = _self.audio.currentTime;
            _p.controls.sliderWrapper.slider.update();
            _self.playList.activeTrack.update(_self.audio.currentTime);

            if(_self.audio.currentTime == _self.audio.duration) {
                _self.pause();
                _self.playList.next();
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
     * initialize audio data
     */
    var initAudioPlayer = function() {

        _p.playerPlaylist = _self.playList.createAudioPlayList();

        _self.playList.onPlayListReady(function() {

            if(!this.activeTrack.audio) {
                createAudioPlayer();
                return false;
            }

            _self.audio = this.activeTrack.audio;
            _self.audio.autoplay = _self.autoplay;

            createAudioPlayer();

            this.onTrackChange(function() {
                _self.audio.pause();
                _self.audio = new Audio(this.activeTrack.fullPath);
                _self.audio.autoplay = true;
                manageAudioPlayer();
            });
        });
    }







    /**
     * creating audio player
     */
    var createAudioPlayer = function() {
        
        _p.nav = {
            wrapper: {},
            prevBtn: {},
            nextBtn: {},
            title: {},
        };
        _p.controls = {
            wrapper: {},
            playListBtn: {},
            playBtn: {},
            sliderWrapper: {
                elem: {},
                slider: {}
            },
            volume: {
                wrapper: {},
                button: {},
                slider: {},
                sliderWrapper: {}
            }
        };

        _elem.innerHTML = "";


        //creating elements
        _p.nav.wrapper = document.createElement("div");
        _p.nav.title = document.createElement("div");
        _p.nav.prevBtn = document.createElement("button");
        _p.nav.nextBtn = document.createElement("button");

        _p.controls.wrapper = document.createElement("div");
        _p.controls.playBtn = document.createElement("button");
        _p.controls.playListBtn = document.createElement("button");
        _p.controls.sliderWrapper.elem = document.createElement("div");

        _p.controls.volume.wrapper = document.createElement("div");
        _p.controls.volume.button = document.createElement("button");
        _p.controls.volume.sliderWrapper = document.createElement("div");





        // adding classes
        _p.nav.wrapper.classList.add("audio-player__box");
        _p.nav.title.classList.add("audio-player__title");
        _p.nav.prevBtn.classList.add("button", "prevBtn", "button--disabled");
        _p.nav.nextBtn.classList.add("button", "nextBtn", "button--disabled");

        _p.controls.wrapper.classList.add("audio-player__box");

        _p.controls.playBtn.classList.add("button", "playBtn", "button--disabled");
        _p.controls.playListBtn.classList.add("button", "playListBtn", "button--disabled");
        
        _p.controls.sliderWrapper.elem.classList.add("audio-player__slider");

        _p.controls.volume.wrapper.classList.add("audio-player__volume");
        _p.controls.volume.button.classList.add("button", "volumeBtn", "button--disabled");
        _p.controls.volume.sliderWrapper.classList.add("audio-player__volume__slider");







        _p.nav.title.innerText = `Loading...`;
        _p.nav.prevBtn.innerHTML = `<i class="fa fa-caret-left"></i>`;
        _p.nav.nextBtn.innerHTML = `<i class="fa fa-caret-right"></i>`;

        _p.controls.volume.button.innerHTML = `<i class="fa fa-volume-up" aria-hidden="true"></i>`;
        _p.controls.playBtn.innerHTML = `<i class="fa fa-play"></i>`;
        _p.controls.playListBtn.innerHTML = `<i class="fa fa-list"></i>`;





        _p.nav.wrapper.appendChild(_p.nav.prevBtn);
        _p.nav.wrapper.appendChild(_p.nav.title);
        _p.nav.wrapper.appendChild(_p.nav.nextBtn);


        _p.controls.volume.wrapper.appendChild(_p.controls.volume.button);
        _p.controls.volume.wrapper.appendChild(_p.controls.volume.sliderWrapper);
        

        _p.controls.wrapper.appendChild(_p.controls.playBtn);
        _p.controls.wrapper.appendChild(_p.controls.playListBtn);
        _p.controls.wrapper.appendChild(_p.controls.sliderWrapper.elem);
        _p.controls.wrapper.appendChild(_p.controls.volume.wrapper);


        _elem.appendChild(_p.playerPlaylist);
        _elem.appendChild(_p.nav.wrapper);
        _elem.appendChild(_p.controls.wrapper);


        _self.setWidth(_self.width);

        _p.controls.sliderWrapper.slider = new Slider(".audio-player__slider", {
            label: `00:00/00:00`,
            direction: HORIZONTAL,
            disabled: true,
            unit: "time"
        });

        _p.controls.volume.slider = new Slider(".audio-player__volume__slider", {
            label: _self.audio.volume,
            min: 0,
            max: 1,
            value: 1,
            rounded: false
        });

        manageAudioPlayer();
    }




    var manageAudioPlayer = function() {
        
        if(_self.playList.tracks.length == 0) {
            _p.nav.title.innerText = "You need to add tracks to your playlist";
            return false;
        }

        _self.audio.addEventListener("error", function() {
            _p.nav.title.innerHTML = `Track called '${_self.playList.activeTrack.trackName}' not exists`;
        }, false);

        _self.audio.addEventListener("loadeddata", function() {

            _p.controls.playBtn.classList.remove("button--disabled");
            _p.controls.playListBtn.classList.remove("button--disabled");
            _p.controls.volume.button.classList.remove("button--disabled");


            _p.controls.playBtn.setAttribute("title", "Play");
            _p.controls.playListBtn.setAttribute("title", "Playlist");
            _p.controls.volume.button.setAttribute("title", "Volume " + _self.audio.volume);


            _p.nav.title.classList.add("audio-player__title");
            _p.nav.title.innerText = _self.playList.activeTrack.trackName;


            if(!_self.playList.activeTrack.isFirst) {
                _p.nav.prevBtn.classList.remove("button--disabled");
                _p.nav.prevBtn.addEventListener("click", _self.playList.prev, false);
                _p.nav.prevBtn.setAttribute("title", "Previous track");
            }

            if(!_self.playList.activeTrack.isLast) {
                _p.nav.nextBtn.classList.remove("button--disabled");
                _p.nav.nextBtn.addEventListener("click", _self.playList.next, false);
                _p.nav.nextBtn.setAttribute("title", "Next track");
            }


            _p.controls.playBtn.onclick = function() {
                _self.audio.paused ? _self.play() : _self.pause();
                this.setAttribute("title", _self.audio.paused ? "Play": "Pause");
            };

            _p.controls.playListBtn.onclick = function() {
                _self.playList.togglePlayList();
            };



            _p.controls.volume.button.onclick = function() {
                _p.controls.volume.sliderWrapper.classList.toggle("audio-player__volume__slider--shown");
            };


            document.body.addMultiEventListener("click keyup", function(e) {
                var k = e.keyCode || e.which;

                if(k == 27 || (!isTarget(e, "audio-player__volume__slider") && !isTarget(e, "volumeBtn"))) {
                    _p.controls.volume.sliderWrapper.classList.remove("audio-player__volume__slider--shown");
                }

                if(k == 27 || (!isTarget(e, "audio-playlist") && !isTarget(e, "playListBtn"))) {
                    _self.playList.closePlayList();
                }

            });

            _p.controls.sliderWrapper.slider.label = `${readableDuration(_self.audio.currentTime)}/${readableDuration(_self.audio.duration != null ? _self.audio.duration : 0)}`;
            _p.controls.sliderWrapper.slider.max = _self.audio.duration;
            _p.controls.sliderWrapper.slider.value = _self.audio.currentTime;
            _p.controls.sliderWrapper.slider.enable();

            _p.controls.sliderWrapper.slider.addOnChange(function(e) {
                _p.controls.sliderWrapper.slider.setLabel(`${readableDuration(e)}/${readableDuration(_self.audio.duration)}`);
                _p.controls.sliderWrapper.slider.label = `${readableDuration(e)}/${readableDuration(_self.audio.duration)}`;
                _self.audio.currentTime = e;
                _p.controls.sliderWrapper.slider.update();
            });

            _self.audio.volume = _p.controls.volume.slider.value;
            _p.controls.volume.slider.addOnChange(function(e) {
                _self.audio.volume = e;
                _p.controls.volume.slider.label = _self.audio.volume.toFixed(2);
                _p.controls.volume.button.setAttribute("title", "Volume " + _self.audio.volume);
            });

            if(this.autoplay) _self.play();

            _self.audioOnLoad(_self.audio);
        });
    }





    initAudioPlayer();
}