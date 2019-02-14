




function Game(sounds){


    this.engine = new GameEngine();
    this.inputManager = new InputManager();
    this.entities = [];



}
Game.prototype.draw = function(){
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    gSTATE_MACHINE.draw(this.ctx);
    this.ctx.restore();
};
Game.prototype.update = function(dt){
    gSTATE_MACHINE.update(dt);
};
Game.prototype.init = function(){
    //init
    window.document.title = "BRICK BREAKER!";

    let canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');


    this.engine.init(this.ctx, this);

    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.inputManager.registerEventListeners(this.ctx);

    gPLAYER = new Paddle(VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2 - 10, 40, 5);
    gBREAKER = new Breaker((gPLAYER.x + gPLAYER.w)/2 - 2 , gPLAYER.y - gPLAYER.h, 3, 4 );

    gSTATE_MACHINE.change(gStates.title);
    this.initBricks(1);

    this.entities = gBRICKS;

    this.engine.start();
};
Game.prototype.addEntity = function (entity) {
    this.entities.push(entity)
};
Game.prototype.killEntity = function (entity) {
    //TODO: remove from entities
};
Game.prototype.initBricks = function (level) {
    //TODO: scale by level

    var bricksInRow = 15;
                    //all across the surface with 20px buffer
    var brickw = (this.surfaceWidth / (bricksInRow + 2)) - 10;
    var brickGap = (this.surfaceWidth / (bricksInRow + 1));
    brickGap = brickGap - brickw;
    var brickRows = 5;
    var yStart = this.surfaceHeight - (this.surfaceHeight /10);

    var lastBrick = brickw / 2 + 10;

    for(var j = 0; j < brickRows; j++) {
        for (var i = 0; i < bricksInRow; i++) {
            let fillstyle = (i % 2 === 0) ? 'red' : 'blue';

            let b = new Brick(lastBrick, this.surfaceHeight / 2, yStart, brickw / 3, fillstyle)
            gBRICKS[i] = b;
            lastBrick += brickw + brickGap;
        }
        yStart += brickGap;
    }
};

//START STUFF
var AM = new AssetManager();
var GAME = new Game();
AM.downloadBulk(Object.values(gSounds), function(){
    GAME.init();
});
