var AM = new AssetManager();
var gGAME = new Game()
var gSounds = {
    aud_HIT_WALL : 'assets/wall_hit.wav',
    aud_HIT_PADDLE : 'assets/paddle_hit.wav',
    aud_SCORE : 'assets/score.wav',
    aud_HIT_BRICK : 'assets/score.wav',
    aud_EXPLOSION : 'assets/score.wav',
    aud_UPGRADE : 'assets/score.wav',
    aud_MUSIC : 'assets/score.wav',
}
// g = global var
// CAPS = constant
// _value = default value
var gWINDOW_WIDTH = 1280;
var gWINDOW_HEIGHT = 720;
var gVIRTUAL_WIDTH = 432;
var gVIRTUAL_HEIGHT = 243;
var gPLAYER_SPEED = 200;

AM.downloadBulk(Object.values(gSounds), function(){
    gGAME.init();
});



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
    
    console.log('game init')

    let gSounds = {
        brick_hit : paths.aud_HIT_WALL,
        paddle_hit : paths.aud_HIT_PADDLE,
        score : paths.aud_SCORE,
        explosion : paths.aud_EXPLOSION,
        upgrade : paths.aud_UPGRADE,
        music : paths.aud_MUSIC,
    };

    this.player = new Paddle(VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2 - 10, 40, 5)
    this.breaker = new Breaker((player.x + player.w)/2 - 2 , player.y - player.h, 3, 4 )
    
}

Gamepad.prototype.draw = function(){
    this.StateMachine.draw(this.ctx)
}
Gamepad.prototype.update = function(dt){
    this.StateMachine.update(dt)
}