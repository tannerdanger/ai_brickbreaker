




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

    gPLAYER = new Paddle(this.surfaceWidth / 2, this.surfaceHeight - 50, 150, 25);

    gBREAKER = new Breaker((gPLAYER.x + gPLAYER.w/2), gPLAYER.y - gPLAYER.h/2, 8 );

    gSTATE_MACHINE.change(gStates.title);
    
    buildBricks(5, 14, this.surfaceWidth, this.surfaceHeight);

    this.entities = gBRICKS;

    this.engine.start();
};
Game.prototype.addEntity = function (entity) {
    this.entities.push(entity)
};
Game.prototype.killEntity = function (entity) {
    //TODO: remove from entities
};

//START STUFF
var GAME = new Game();
AM.downloadBulk(Object.values(gSounds), function(){
    GAME.init();
});
function buildBricks(rows, cols, canvasW, canvasH){

    console.log(canvasW);

    var nextX = 20;
    var nextY = 40;
    var margins = 20;
    console.log('margins: ', margins);
    var brickwidth = (canvasW - (margins * 2)); //canvas - margins = working space
    console.log('build area minus the ends: ', brickwidth);
    brickwidth = brickwidth - ((cols-1) *margins); // workingspace - (cols * margins)
    console.log('build area minus brick spacing: ', brickwidth)
    brickwidth = brickwidth / cols;
    brickctr = 0;
    console.log('final brickwidth :',brickwidth);

    for(var j = 0; j < rows; j++) {

        for (var i = 0; i < cols; i++) {

            //determine fill color
            let fillstyle = (j % 2 === 0 && i % 2 === 0) ? 'red'
                : (j % 2 !== 0 && i % 2 !== 0) ? 'red'
                    : 'blue';

            let b = new Brick(nextX, nextY, brickwidth, margins, fillstyle);
            gBRICKS[brickctr++] = b;
            nextX += brickwidth + margins;
        }
        cols = (i % 2 === 0) ? cols - 1 : cols + 1;
        nextY += (2 * margins);
        nextX = (cols === 14) ? 20 : (20 + brickwidth / 2)


    }
 //   let b = new Brick(canvasW / 2, canvasH - margins * 2, brickwidth, margins, 'yellow');
//    gBRICKS[brickctr++] = b;

}