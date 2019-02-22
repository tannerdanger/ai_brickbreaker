
////// ======= CONSTANT VARIABLES =======//////

/** Window sizes on the page. */
WINDOW_WIDTH = 1280;
WINDOW_HEIGHT = 720;
/** Virtual sizes to simulate resolution. */
VIRTUAL_WIDTH = 432;
VIRTUAL_HEIGHT = 243;
PLAYER_SPEED = 300;
BRICK_LINE = 280;
gSCORE = 0;

/** The object the player controls. Represented as the paddle that hits the breaker. */
gPLAYER = {};
/** The ball the player reflects to break bricks. */
gBREAKER = {};
gSTATE_MACHINE = {};
gDOWN_KEYS = {};
gAGITATOR = {};
gBRICKFILLS = {
    0 : 'blue',
    1 : 'yellow',
    2 : 'red',
};
gLIVES = 3;
gMAX_LIVES = 3;
gSounds = {
    aud_HIT_WALL : 'assets/wall_hit.wav',
    aud_HIT_PADDLE : 'assets/paddle_hit.wav',
    aud_SCORE : 'assets/score.wav',
    aud_HIT_BRICK : 'assets/wall_hit.wav',
    aud_EXPLOSION : 'assets/explosion.wav',
    aud_UPGRADE : 'assets/powerup.wav',
    aud_MUSIC : 'assets/music.mp3',
};
gDIRECTIONS = {
    LEFT : 'left',
    RIGHT : 'right',
    TOPRIGHT : 'top right',
    TOPLEFT : 'top left',
    BOTLEFT : 'bot left'
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


class entity{
    constructor(x, y, w, h){
        this.x = this._x = x;
        this.y = this._y = y;
        this.w = this._w = w;
        this.h = this._h = h;
        this.dy = 0;
        this.dx = 0;
        this.fillStyle = null;
        this.VECTOR = this.getVector;

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
            AM.getAsset(gSounds.aud_HIT_WALL).play();
            gBREAKER.x = 0 + this.w;
            gBREAKER.dx = -gBREAKER.dx
        }
        if(this.x >= WINDOW_WIDTH){
            AM.getAsset(gSounds.aud_HIT_WALL).play();
            gBREAKER.x = WINDOW_WIDTH - (this.w+1);
            gBREAKER.dx = -gBREAKER.dx
        }
        if(this.y <= 0){
            AM.getAsset(gSounds.aud_HIT_WALL).play();
            gBREAKER.y = gBREAKER.h + 1;
            gBREAKER.dy = -gBREAKER.dy;
        }
    }
    getVector(){
        return new Vector(this.x, this.y)
    }
    getDirection(){
        let v = this.getVector();
        let dir = v.direction();
        return dir
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
        this.r = 10;
        //this.stroke = true;
    }
    update(dt){
        this.x = (this.dx < 0) ? Math.max(0, this.x + (this.dx * dt))//if dx is less than zero, move left
            : Math.min(WINDOW_WIDTH - this.w, this.x + (this.dx * dt))
    }
    draw(ctx){
        ctx.fillStyle = this.fillStyle;
        roundRect(ctx, this.x, this.y, this.w, this.h, this.r, true, true)
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
    isMovingBottomRight(){
        return
    }
    isMovingBottomLeft(){
        return this.dx / this.dy < 0 && this.dx / this.dy > -1;
    }
    isMovingTopRight(){
        return this.dx / this.dy >= 1;
    }
    isMovingBottomRight(){
        return this.dx / this.dy <= -1;
    }


}


class Brick extends entity{
    constructor(x, y, w, h, level){
        super(x, y, w, h);
        this.level = level;
        this.r = 3;
        this.fillStyle = gBRICKFILLS[this.level];
        this.remove = false;
    }
    hit(){
        this.level--;
        if(this.level <= 0){
            gBRICKS.splice(gBRICKS.indexOf(this), 1);
            gSCORE = gSCORE+50;
        }else{
            gSCORE = gSCORE+30;
            this.fillStyle = gBRICKFILLS[this.level]
        }
    }
    draw(ctx){
        ctx.fillStyle = gBRICKFILLS[this.level];
        roundRect(ctx, this.x, this.y, this.w, this.h, this.r, true, true)
    }
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke){
    if (typeof stroke == "undefined" ) {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}