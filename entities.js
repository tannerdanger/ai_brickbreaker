
////// ======= CONSTANT VARIABLES =======//////
/** Window sizes on the page. */
WINDOW_WIDTH = 1280;
WINDOW_HEIGHT = 720;
/** Virtual sizes to simulate resolution. */
VIRTUAL_WIDTH = 432;
VIRTUAL_HEIGHT = 243;
PLAYER_SPEED = 300;
BRICK_LINE = 280;

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
        this.fillStyle = null;
    }
    draw(ctx){
        ctx.fillStyle = this.fillStyle || 'white';
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    update(dt){
        //this.x = (this.dx < 0) ? Math.max(0, this.x + (this.dx * dt))//if dx is less than zero, move left
          //  : Math.min(WINDOW_WIDTH - this.w, this.x + (this.dx * dt));

        //DY < 0 = breaker moving up
        // this.y = (this.dy < 0) ? Math.max(0, 1 + this.y - (this.dx * dt))
        //     : this.y + (this.dy * dt);
        this.x = this.x + this.dx * dt;
        this.y = this. y + this.dy * dt;

        if(this.x <= 0){
            //play sound
            gBREAKER.x = 0 + this.w;
            gBREAKER.dx = -gBREAKER.dx
        }
        if(this.x >= WINDOW_WIDTH){
            AM.getAsset(gSounds.aud_HIT_WALL).play();
            gBREAKER.x = WINDOW_WIDTH - this.w;
            gBREAKER.dx = -gBREAKER.dx
        }
        if(this.y <= 0){
            AM.getAsset(gSounds.aud_HIT_WALL).play();
            gBREAKER.y = gBREAKER.h + 1;
            gBREAKER.dy = -gBREAKER.dy;
        }
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
    update(dt){
        this.x = (this.dx < 0) ? Math.max(0, this.x + (this.dx * dt))//if dx is less than zero, move left
            : Math.min(WINDOW_WIDTH - this.w, this.x + (this.dx * dt))
    }
}

class Breaker extends entity {
    constructor(x,y,w){
        super(x,y,w, w);
    }
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.fillStyle || 'white';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    collides(entity){
        if( this.x > entity.x + entity.w || entity.x > this.x + this.w){
            return false;
        }
        if( this.y > entity.y + entity.h || entity.y > this.y + this.h){
            return false;
        }
        return true;
    }
    serve(){
        if(this.dx === 0){
            this.dx = 120
        }
        this.dy = -PLAYER_SPEED;
        this.w = this._w;
    }


}


class Brick extends entity{
    constructor(x, y, w, h, fillstyle){
        super(x, y, w, h);
        this.fillStyle = fillstyle;
        this.remove = false;
    }
    hit(){
        //todo: colors
        this.remove = true;
    }

}
//
// Brick.prototype = new entity(x, y, w, h);
// Brick.prototype.constructor = Brick;
// Brick.prototype.draw = entity.draw(ctx);