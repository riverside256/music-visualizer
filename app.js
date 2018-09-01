var express = require("express");
var path    = require("path");
var fs      = require("fs");

var app     = express();

var port    = 5500;


app.use("/css", express.static("css"));
app.use("/js", express.static("js"));
app.use("/audio", express.static("audio"));


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/tracks", function(req, res) {
    fs.readdir("./audio/", function(err, files) {
        if(err) throw err;
        res.send(files);
    });
});

app.listen(port, function() {
    console.log("Server started on port " + port + "...");
});