////// ======= CONSTANT VARIABLES =======//////
/** Window sizes on the page. */
WINDOW_WIDTH = 1280;
WINDOW_HEIGHT = 720;
/** Virtual sizes to simulate resolution. */
VIRTUAL_WIDTH = 432;
VIRTUAL_HEIGHT = 243;
PLAYER_SPEED = 200;
gPLAYER = {};
gBREAKER = {};
gSTATE_MACHINE = {};



pushdefaults = {
    autoStart : false, //automatically starts the rendering after the construction.
    width : 1280, //the width of the renderers view
    height : 720, //the height of the renderers view
    view : document.getElementById('canvas'), //the canvas to use as a view, optional
    transparent : false, //If the render view is transparent, default false
    antialias : true, //sets antialias (only applicable in chrome at the moment)
    preserveDrawingBuffer : false, //enables drawing buffer preservation, enable this if you need to call toDataUrl on the webgl context
    resolution : 1, //The resolution / device pixel ratio of the renderer, retina would be 2
    forceCanvas : true, //prevents selection of WebGL renderer, even if such is present
    backgroundColor : '0x000000', //The background color of the rendered area (shown if not transparent).
    clearBeforeRender : true, //This sets if the renderer will clear the canvas or not before the new render pass.
    roundPixels : false, //If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
    forceFXAA : false, //forces FXAA antialiasing to be used over native. FXAA is faster, but may not always look as great webgl only
    legacy : false, //for comparability with old devices.
    //powerPreference: '', //Parameter passed to webgl context, set to "high-performance" for devices with dual graphics card webgl only
    sharedTicker : false, //true to use PIXI.ticker.shared, false to create new ticker.
    sharedLoader : false, //true to use PIXI.loaders.shared, false to create new Loader.
};
gSounds = {
    aud_HIT_WALL : 'assets/wall_hit.wav',
    aud_HIT_PADDLE : 'assets/paddle_hit.wav',
    aud_SCORE : 'assets/score.wav',
    aud_HIT_BRICK : 'assets/wall_hit.wav',
    aud_EXPLOSION : 'assets/explosion.wav',
    aud_UPGRADE : 'assets/powerup.wav',
    aud_MUSIC : 'assets/music.mp3',
};




function Push(){
    //this.canvas = document.getElementById('gameWorld');
   // this.ctx = this.canvas.getContext('2d');
    this.APP = new PIXI.Application(pushdefaults);
}

//TODO: Test this
Push.prototype.applySettings = function(settings){
    for(let prop in settings){
        if(settings.hasOwnProperty(prop)){
            this.APP._options[prop] = settings[prop]
        }
    }
};
/**
 * Resets the game to default display settings.
 */
Push.prototype.resetSettings = function () {
    return this.applySettings(pushdefaults)
};

// Push.prototype.setupScreen = function(w, h){
//
//     settings = settings || {};
//
//    // this._WINDOW_W = this.WINDOW_W = WWIDTH || this._WINDOW_W || pushdefaults.width;
//    // this._WINDOW_H = this.WINDOW_H = WHEIGHT || this._WINDOW_H || pushdefaults;
//
//     //this.WWIDTH = WWIDTH; this.WHEIGHT = WHEIGHT; //set window width and window height to parameter settings.
//     //this.applySettings(pushdefaults); //apply default settings
//     //this.applySettings(settings); //then apply custom settings
//     this.APP.renderer.resize(w, h)
//     //set pixi sizes above
//
//     //this.initValues();
//
//
// };
Push.prototype.start = function () {
    console.log('starting pixi');
    //this.APP.start();
    this.APP.render();
};

Push.prototype.addStageChild = function (child) {
    this.APP.stage.addChild(child);
}

var PUSH = new Push();