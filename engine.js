/**
    Request animation frame from window
*/
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
    Creates a new game engine object with null values
*/
function GameEngine(){
    this.timer = null;
    this.game = null;
    this.dt = 0;
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;

}
/**
    Inits default Game Engine values, accepts Canvas CTX as parameter
*/
GameEngine.prototype.init = function(ctx ,game){
    this.game = game;
    this.ctx = ctx;
    this.timer = new Timer();

};

/**
    Starts the game engine
*/
GameEngine.prototype.start = function(){
    var that = this;
    (function gameLoop(){
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
};

/**
    Game engine loop
*/
GameEngine.prototype.loop = function(){
    this.dt = this.timer.tick();
    this.game.update(this.dt);
    this.game.draw();    
};

/**
    A game timer object.
*/
function Timer(){
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}
/**
    Increment timer, update track ticks/time elapsed, return delta time
*/
Timer.prototype.tick = function(){
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;
    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += this.gameDelta;
    return gameDelta
}