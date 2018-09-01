function AudioTrackNode(options) {
    var _self = this;
    var _options = options || {};

    this.id = _options.id || 0;
    this.trackNode = {};
    this.playing = (typeof _options.playing != "undefined") ? _options.playing : false;
    this.isFirst = (typeof _options.isFirst != "undefined") ? _options.isFirst : false;
    this.isLast =  (typeof _options.isLast != "undefined") ? _options.isLast : false;
    this.fullPath = _options.fullPath || "";
    this.trackName = this.fullPath.split("/")[this.fullPath.split("/").length - 1].split(".")[0];
    this.extension = this.fullPath.split("/")[this.fullPath.split("/").length - 1].split(".")[1];
    this.folder = this.fullPath.replace(this.fullPath.split("/")[this.fullPath.split("/").length - 1], "");
    this.audio = {};
    this.duration = 0;







    AudioTrackNode.prototype.setPlaying = function(playing) {
        this.playing = playing;
        if(this.playing) {
            this.trackNode.classList.add("track-node--active");
        }
        else {
            this.trackNode.classList.remove("track-node--active");
            this.trackNode.style.background = "none";
        }
    }



    AudioTrackNode.prototype.update = function(time) {
        this.trackNode.style.background = `linear-gradient(to right, rgba(118, 255, 3, 0.2) ${(time/this.audio.duration) * 100}%, 
                                                                     transparent ${(time/this.audio.duration) * 100}%)`;
    }





    var init = function() {
        _self.audio = new Audio(_self.fullPath);

        _self.trackNode = document.createElement("div");
        _self.trackNode.classList.add("audio-playlist__table__row", "track-node");
        _self.trackNode.setAttribute("title", _self.trackName);


        _self.audio.addEventListener("loadeddata", function() {

            _self.trackNode.innerHTML = `
            
                <div class="audio-playlist__table__cell">${_self.id}</div>
                <div class="audio-playlist__table__cell">${_self.trackName}</div>
                <div class="audio-playlist__table__cell">${_self.extension}</div>
                <div class="audio-playlist__table__cell">${_self.folder}</div>
                <div class="audio-playlist__table__cell">${readableDuration(_self.audio.duration)}</div>

            `;
        }, false);
    }

    init();
}