function GameEngine(){
    this.timer = null
    this.game = null
    this.dt = 0;
}
GameEngine.prototype.init = function(game){
    this.timer = new Timer();
    this.game = game
}
GameEngine.prototype.start = function(){
    var that = this;
    (function gameLoop(){
        that.loop();
       // requestAnimationFrame(gameLoop, that.ct) TODO:
    })();
}
GameEngine.prototype.loop = function(){
    this.dt = this.timer.tick();
    this.update();
    this.draw();
}
GameEngine.prototype.draw = function(){
    this.game.draw()
}
GameEngine.prototype.update = function(){
    this.game.update(this.dt) 
}





function Timer(){
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}
Timer.prototype.tick = function(){
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;
    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += this.gameDelta;
    return gameDelta
}