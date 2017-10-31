

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



    this.tracks = _options.tracks || [];
    this.activeTrack = {};
    this.shown = false;


    this.onTrackChange = function(x) {}



    
    AudioPlayList.prototype.createAudioPlayList = function() {

        _playList.wrapper = document.createElement("div");

        _playList.header.wrapper = document.createElement("div");
        _playList.header.title = document.createElement("h2");
        _playList.header.closeBtn = document.createElement("button");

        _playList.content.wrapper = document.createElement("div");
        _playList.content.table = document.createElement("table");



        _playList.wrapper.classList.add("audio-playlist");

        _playList.header.wrapper.classList.add("audio-playlist__header");
        _playList.header.title.classList.add("audio-playlist__header__title");
        _playList.header.closeBtn.classList.add("button");

        _playList.content.wrapper.classList.add("audio-playlist__content");




        _playList.header.title.innerText = "Playlist";
        _playList.header.closeBtn.innerHTML = `<i class="fa fa-times"></i>`;
        
        _playList.content.table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Track name</th>
                    <th>Extension</th>
                    <th>Folder</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        this.tracks.forEach(t => {
            var x = t.trackNode;
            x.addEventListener("click", function() {
                _self.setPlayingTrack(t);
            }, false);
            _trackElements.push(x);
            _playList.content.table.querySelector("tbody").appendChild(x);
        });



        _playList.header.closeBtn.addEventListener("click", _self.closePlayList.bind(this), false);


        _playList.header.wrapper.appendChild(_playList.header.title);
        _playList.header.wrapper.appendChild(_playList.header.closeBtn);

        _playList.content.wrapper.appendChild(_playList.content.table);



        _playList.wrapper.appendChild(_playList.header.wrapper);
        _playList.wrapper.appendChild(_playList.content.wrapper);



        return _playList.wrapper;
    }







    AudioPlayList.prototype.setPlayingTrack = function(track) {
        this.activeTrack = track;
        this.tracks.forEach(t => t.setPlaying(false));
        this.tracks[this.tracks.indexOf(track)].setPlaying(true);
        this.onTrackChange(track);
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
        this.setPlayingTrack(this.tracks[this.tracks.indexOf(this.activeTrack) + 1]);
    }



    AudioPlayList.prototype.prev = function() {
        this.setPlayingTrack(this.tracks[this.tracks.indexOf(this.activeTrack) - 1]);
    }








    var initAudioPlayList = function() {
        if(_self.tracks.length > 0) {
            for(var i = 0; i < _self.tracks.length; i++) {
                _self.tracks[i] = new AudioTrackNode({
                    id: i + 1,
                    fullPath: "audio/" + _self.tracks[i],
                    playing: i == 0,
                    isFirst: i == 0,
                    isLast: i == (_self.tracks.length - 1)
                });
            }
            _self.setPlayingTrack(_self.tracks[0]);
        }
    }

    initAudioPlayList();
}