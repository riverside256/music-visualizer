# music-visualizer
Simple music visualization cerated in HTML5 Canvas

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
