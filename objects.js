function entity(x, y, w, h){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.dy = 0
    this.dx = 0
}
entity.prototype.draw = function(ctx){

}
entity.prototype.update = function(dt){

}

function Paddle(x, y, w, h){
    
}
Paddle.prototype = new entity();
Paddle.prototype.constructor = Paddle;
Paddle.prototype.update = function(dt){

}
Paddle.prototype.draw = function (ctx){

    //ctx.fillRect

}
// BREAKER
function Breaker(x, y, w, h){

}
Breaker.prototype = new entity();
Breaker.prototype.constructor = Breaker;
Breaker.prototype.reset = function(x, y){
    this.x = x;
    this.y = y;
    this.dy = 0;
    this.dx = 0;
}
Breaker.prototype.serve = function(dx){
    this.dx = (dx < 0) ? -100
        : (dx > 0) ? 100
        : 100 //TODO: math.random

    this.dy = PLAYER_SPEED //TODO: assign this value
    this.w = _w //TODO: _ is default value

}
Breaker.prototype.update = function(dt){
    this.x = this.x + this.dx * dt
    this.y = this.y + this.dy * dt
}
Breaker.prototype.collides = function(object){
    //first check to see if left edte of either is further to right then 
    //right edge of other
    if(this.x > object.x + object.w || object.x > (this.x + this.w)){
        return false
    }
    //then check to see if bottom is higher than top of other
    if(this.y > object.y + object.height || object.y > (this.y + this.height)){
        return false
    }
    return true
}