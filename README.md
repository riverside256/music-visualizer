# music-visualizer
Simple music visualization cerated in HTML5 Canvas


## Table of contents
[1. What's new?](#whats-new)  
[2. Setup](#setup)  
[3. TODOS](#todos)  


## What's new?

**Version 0.2**
- added assets.js file
- added volume player support
- added some documentation for javascript files
- added audio player error handling support

**Version 0.1**
- added changing slider value on stripe clicking
- added some animations
- added new option to config
- optimized slider.js file

## Setup
1. Download this project by clicking **Clone or download** button or by using this commands

```
mkdir music-visualizer
cd music-visualizer
git clone https://github.com/riverside256/music-visualizer.git
```

2. Create `audio` folder inside your project and drop your audio file to this folder
3. Open `config.js` file inside `js` folder. Put into `trackName` property the name of your track inside `audio` folder

> **IMPORTANT!** You need to put the track name with an extension!  
> If don't, the application won't work!

```javascript
let config = {
    trackName: "<-- your trackNane -->"
    // other stuff...
}
```


## TODOS
- adding playlist support
- adding more configuration options
