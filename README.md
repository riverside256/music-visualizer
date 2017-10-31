# music-visualizer
Simple music visualization cerated in HTML5 Canvas


## Table of contents
[1. Setup](#setup)  
[2. What's new?](#whats-new)   
[3. TODOS](#todos)  

## Setup
1. Download this project by clicking **Clone or download** button or by using this commands

```
mkdir music-visualizer
cd music-visualizer
git clone https://github.com/riverside256/music-visualizer.git
```

2. Create `audio` folder inside your project and drop your audio file to this folder
3. Open `config.js` file inside `js` folder. Put into `trackList` property your track names inside `audio` folder

> **IMPORTANT!** You need to put the track names with an extension!  
> If don't, the application won't work!

```javascript
let config = {
    trackName: [] // <-- put tracks right here
    // other stuff...
}
```


## What's new?

**Version 0.3.2**
- added playlist track progress
- added duration track info
- modified playlist table structure
- modified settings pane structure

**Version 0.3.1**
- repaired bars mistake

**Version 0.3**
- added playlist support
- added a few shortcuts
- added disabled state to slider
- added more bars around circle
- modified slider value changing
- modified slider changing in settings

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


## TODOS
- ~~playlist support~~
- more configuration options
- color changing support
