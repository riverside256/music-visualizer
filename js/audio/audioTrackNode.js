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







    AudioTrackNode.prototype.setPlaying = function(playing) {
        this.playing = playing;
        if(this.playing) {
            this.trackNode.classList.add("track-node--active");
        }
        else {
            this.trackNode.classList.remove("track-node--active");
        }
    }







    var init = function() {
        _self.trackNode = document.createElement("tr");

        _self.trackNode.innerHTML = `
        
            <td>${_self.id}</td>
            <td>${_self.trackName}</td>
            <td>${_self.extension}</td>
            <td>${_self.folder}</td>

        `;
    }

    init();
}