
////// ======= CONSTANT VARIABLES =======//////
/** Window sizes on the page. */
WINDOW_WIDTH = 1280;
WINDOW_HEIGHT = 720;
/** Virtual sizes to simulate resolution. */
VIRTUAL_WIDTH = 432;
VIRTUAL_HEIGHT = 243;
PLAYER_SPEED = 200;


/** The object the player controls. Represented as the paddle that hits the breaker. */
gPLAYER = {};
/** The ball the player reflects to break bricks. */
gBREAKER = {};
gSTATE_MACHINE = {};
gDOWN_KEYS = {};
gSounds = {
    aud_HIT_WALL : 'assets/wall_hit.wav',
    aud_HIT_PADDLE : 'assets/paddle_hit.wav',
    aud_SCORE : 'assets/score.wav',
    aud_HIT_BRICK : 'assets/wall_hit.wav',
    aud_EXPLOSION : 'assets/explosion.wav',
    aud_UPGRADE : 'assets/powerup.wav',
    aud_MUSIC : 'assets/music.mp3',
};
gBRICKS = [{}];
KEYS = {
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight',
    Escape: 'Escape',
    Minus: 'Minus',
    Equal: 'Equal',
    Backspace: 'Backspace',
    Tab: 'Tab',
    KeyQ: 'KeyQ',
    KeyW: 'KeyW',
    KeyE: 'KeyE',
    KeyR: 'KeyR',
    KeyT: 'KeyT',
    KeyY: 'KeyY',
    KeyU: 'KeyU',
    KeyI: 'KeyI',
    KeyO: 'KeyO',
    KeyP: 'KeyP',
    BracketLeft: 'BracketLeft',
    BracketRight: 'BracketRight',
    Enter: 'Enter',
    ControlLeft: 'ControlLeft',
    KeyA: 'KeyA',
    KeyS: 'KeyS',
    KeyD: 'KeyD',
    KeyF: 'KeyF',
    KeyG: 'KeyG',
    KeyH: 'KeyH',
    KeyJ: 'KeyJ',
    KeyK: 'KeyK',
    KeyL: 'KeyL',
    Semicolon: 'Semicolon',
    Quote: 'Quote',
    KeyZ: 'KeyZ',
    KeyX: 'KeyX',
    KeyC: 'KeyC',
    KeyV: 'KeyV',
    KeyB: 'KeyB',
    KeyN: 'KeyN',
    KeyM: 'KeyM',
    Comma: 'Comma',
    Period: 'Period',
    Slash: 'Slash',
    ShiftRight: 'ShiftRight',
    NumpadMultiply: 'NumpadMultiply',
    AltLeft: 'AltLeft',
    Space: 'Space',
    CapsLock: 'CapsLock',
};
brickctr = 0;

class entity{
    constructor(x, y, w, h){
        this.x = this._x = x;
        this.y = this._y = y;
        this.w = this._w = w;
        this.h = this._h = h;
        this.dy = 0;
        this.dx = 0;
    }
    draw(ctx){
        ctx.fillStyle = this.fillStyle || 'white';
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    update(dt){

    }
    reset(){
        this.x = this._x;
        this.y = this._y;
        this.w = this._w;
        this.h = this._h;
        this.dy = 0;
        this.dx = 0;
    }
}

//ENTITIES
class Paddle extends entity{
    constructor(x, y, w, h){
        super(x, y, w, h);
        this.fillStyle = 'white';
    }
}

class Breaker extends entity {
    constructor(x,y,w,h){
        super(x, y, w, h);
    }

}

// Breaker.prototype.serve = function(dx){
//     this.dx = (dx < 0) ? -100
//         : (dx > 0) ? 100
//             : 100//TODO: math.random
//
//     this.dy = PLAYER_SPEED;//TODO: assign this value
//     this.w = _w //TODO: _ is default value
//
// };
// Breaker.prototype.update = function(dt){
//     this.x = this.x + this.dx * dt;
//     this.y = this.y + this.dy * dt;
// };
// Breaker.prototype.collides = function(object){
//     //first check to see if left edte of either is further to right then
//     //right edge of other
//     if(this.x > object.x + object.w || object.x > (this.x + this.w)){
//         return false
//     }
//     //then check to see if bottom is higher than top of other
//     if(this.y > object.y + object.height || object.y > (this.y + this.height)){
//         return false
//     }
//     return true
//};
class Brick extends entity{
    constructor(x, y, w, h, fillstyle){
        super(x, y, w, h);
        this.fillStyle = fillstyle;
    }
}
//
// Brick.prototype = new entity(x, y, w, h);
// Brick.prototype.constructor = Brick;
// Brick.prototype.draw = entity.draw(ctx);