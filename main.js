var gSounds = {
    aud_HIT_WALL : 'assets/wall_hit.wav',
    aud_HIT_PADDLE : 'assets/paddle_hit.wav',
    aud_SCORE : 'assets/score.wav',
    aud_HIT_BRICK : 'assets/score.wav',
    aud_EXPLOSION : 'assets/score.wav',
    aud_UPGRADE : 'assets/score.wav',
    aud_MUSIC : 'assets/score.wav',
};
// g = global var
// CAPS = constant
// _value = default value
var WINDOW_WIDTH = 1280;
var WINDOW_HEIGHT = 720;
var VIRTUAL_WIDTH = 432;
var VIRTUAL_HEIGHT = 243;
var PLAYER_SPEED = 200;

var PLAYER = {}
var BREAKER = {}




function load(){




    let gStateMachine = new StateMachine()
    
    
}


function Game(sounds){

    this.inputManager = {}
    this.ctx = null
    this.gSounds = {}
    this.entities = []
    this.StateMachine = {}
    this.player = {}
    this.breaker = {}
    this.upgrade = {}



}
Game.prototype.init = function(){
    //init
    document.body.appendChild(APP.view);
    APP.renderer.autoResize = true;

    console.log('game init')

    console.log(gSounds.aud_EXPLOSION);
    //this.pixi = APP;
    
    PLAYER = new Paddle(VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2 - 10, 40, 5)
    BREAKER = new Breaker((PLAYER.x + PLAYER.w)/2 - 2 , PLAYER.y - PLAYER.h, 3, 4 )
    
}

Gamepad.prototype.draw = function(){
    this.StateMachine.draw(this.ctx)
}
Gamepad.prototype.update = function(dt){
    this.StateMachine.update(dt)
};

//START STUFF
var AM = new AssetManager();
var GAME = new Game();
var APP = new PIXI.Application({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    antialias: true,
    transparent: false,
    resolution: 1,
    backgroundColor : 0x1099bb
});
AM.downloadBulk(Object.values(gSounds), function(){
    GAME.init();
});