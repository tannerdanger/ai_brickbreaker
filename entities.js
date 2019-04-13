

/**
    Base entity of the game.
    Sets default values and functions used by most or all other entities.
*/
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
    //Base draw function draws defined color or white.
    draw(ctx){
        ctx.fillStyle = this.fillStyle || 'white';
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    //base update function
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
    //gets a vector from the entity's location
    getVector(){
        return new Vector(this.x, this.y)
    }
    //gets a direction from the entity's vector
    getDirection(){
        let v = this.getVector();
        let dir = v.direction();
        return dir
    }
    //resets the entity to its original location
    reset(){
        this.x = this._x;
        this.y = this._y;
        this.w = this._w;
        this.h = this._h;
        this.dy = 0;
        this.dx = 0;
    }
}

////ENTITIES/////

/**
    Paddle that the player moves left and right to deflect the breaker.
*/
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
/**
    Breaker that breaks the bricks. Or, the 'ball' the player deflects.
*/
class Breaker extends entity {
    constructor(x,y,w){
        super(x,y,w, w);
    }
    //overwrite, no call to parent
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.fillStyle || 'white';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    //does this collide with something else?
    collides(entity){
        if( this.x > entity.x + entity.w || entity.x > this.x + this.w){
            return false;
        }
        if( this.y > entity.y + entity.h || entity.y > this.y + this.h){
            return false;
        }
        return true;
    }
    //serve the breaker
    serve(){
        if(this.dx === 0){
            this.dx = 120
        }
        this.dy = -PLAYER_SPEED;
        this.w = this._w;
    }

    isMovingTopLeft(){
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

/**
    Brick entity the breaker attempts to 'break' by colliding with it.
    Spawns in one of several colors, each color requiring a different number of hits to break.
*/
class Brick extends entity{
    constructor(x, y, w, h, level){
        super(x, y, w, h);
        this.level = level;
        this.r = 3;
        this.fillStyle = gBRICKFILLS[this.level];
        this.remove = false;
    }
    //Logic applied when brick his hit.
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
    //override parent
    draw(ctx){
        ctx.fillStyle = gBRICKFILLS[this.level];
        roundRect(ctx, this.x, this.y, this.w, this.h, this.r, true, true)
    }
}