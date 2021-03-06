

function AudioPlayList(options) {

    var _self = this;
    var _options = options || {};
    
    var _playList = {
        wrapper: {},
        header: {
            wrapper: {},
            title: {},
            closeBtn: {}
        },
        content: {
            wrapper: {},
            table: {}
        }
    };

    var _trackElements = [];



    this.tracks = [];
    this.activeTrack = {};
    this.shown = false;
    this.callbacks = {
        onPlayListReady: [],
        onTrackChange: []
    };


    AudioPlayList.prototype.onTrackChange = function(callback) {
        this.callbacks.onTrackChange.push(callback);
    }

    AudioPlayList.prototype.onPlayListReady = function(callback) {
        this.callbacks.onPlayListReady.push(callback);
    }


    
    AudioPlayList.prototype.createAudioPlayList = function() {

        initAudioPlayList();

        _playList.wrapper = document.createElement("div");

        _playList.header.wrapper = document.createElement("div");
        _playList.header.title = document.createElement("h2");
        _playList.header.closeBtn = document.createElement("button");

        _playList.content.wrapper = document.createElement("div");
        _playList.content.table = document.createElement("div");



        _playList.wrapper.classList.add("audio-playlist");

        _playList.header.wrapper.classList.add("audio-playlist__header");
        _playList.header.title.classList.add("audio-playlist__header__title");
        _playList.header.closeBtn.classList.add("button");

        _playList.content.wrapper.classList.add("audio-playlist__content");
        _playList.content.table.classList.add("audio-playlist__table");



        _playList.header.closeBtn.setAttribute("title", "Close playlist");



        _playList.header.title.innerText = "Playlist";
        _playList.header.closeBtn.innerHTML = `<i class="fa fa-times"></i>`;
        
        _playList.content.table.innerHTML = `
            <div class="audio-playlist__table__row audio-playlist__table__row--header">
                <div class="audio-playlist__table__cell">ID</div>
                <div class="audio-playlist__table__cell">Track name</div>
                <div class="audio-playlist__table__cell">Extension</div>
                <div class="audio-playlist__table__cell">Folder</div>
                <div class="audio-playlist__table__cell">Duration</div>
            </div>
        `;

        this.onPlayListReady(function() {



            if(this.tracks.length == 0) {
                for(var k in sc.sliders) {
                    if(k != "addMultiEventListener") {
                        sc.sliders[k].disable();
                    }
                }
                return false;
            }




            this.tracks.forEach(t => {
                var x = t.trackNode;
                x.addEventListener("click", function() {
                    _self.setPlayingTrack(t);
                }, false);
                _trackElements.push(x);
                _playList.content.table.appendChild(x);
            });



            _playList.header.closeBtn.addEventListener("click", _self.closePlayList.bind(this), false);


            _playList.header.wrapper.appendChild(_playList.header.title);
            _playList.header.wrapper.appendChild(_playList.header.closeBtn);

            _playList.content.wrapper.appendChild(_playList.content.table);



            _playList.wrapper.appendChild(_playList.header.wrapper);
            _playList.wrapper.appendChild(_playList.content.wrapper);
        });

        return _playList.wrapper;
    }







    AudioPlayList.prototype.setPlayingTrack = function(track) {
        this.activeTrack = track;
        this.tracks.forEach(t => t.setPlaying(false));
        this.tracks[this.tracks.indexOf(track)].setPlaying(true);
        this.callbacks.onTrackChange.forEach(c => c.apply(_self, null));
    }







    AudioPlayList.prototype.togglePlayList = function() {
        this.shown = !this.shown;
        if(this.shown) {
            _playList.wrapper.classList.add("audio-playlist--shown");
        }
        else {
            _playList.wrapper.classList.remove("audio-playlist--shown");
        }
    }







    AudioPlayList.prototype.closePlayList = function() {
        this.shown = false;
        _playList.wrapper.classList.remove("audio-playlist--shown");
    }







    AudioPlayList.prototype.next = function() {
        _self.setPlayingTrack(_self.tracks[_self.tracks.indexOf(_self.activeTrack) + 1]);
    }



    AudioPlayList.prototype.prev = function() {
        _self.setPlayingTrack(_self.tracks[_self.tracks.indexOf(_self.activeTrack) - 1]);
    }








    var initAudioPlayList = function() {
        var xhr = new XMLHttpRequest();

        xhr.open("GET", "http://localhost:5500/tracks", true);
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                var tracks = JSON.parse(xhr.response);
                for(var i = 0; i < tracks.length; i++) {
                    _self.tracks[i] = new AudioTrackNode({
                        id: i + 1,
                        fullPath: "audio/" + tracks[i],
                        playing: i == 0,
                        isFirst: i == 0,
                        isLast: i == (tracks.length - 1)
                    });
                }
                if(_self.tracks.length > 0) {
                    _self.setPlayingTrack(_self.tracks[0]);
                }
                _self.callbacks.onPlayListReady.forEach(c => c.apply(_self, null));
            }
        }
        xhr.send();
    }
}