




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
// Game.prototype.initBricks = function (level) {
//     //TODO: scale by level

//     var cols = 15;
//     var rows = 5;
//     var brickw = (this.surfaceWidth / (cols + 2)) - 10
//     var brickGap = (this.surfaceWidth / (cols + 1));
//     brickGap = brickGap - brickw;

    
//     var yStart = this.surfaceHeight - (this.surfaceHeight /10);

//     var lastBrick = brickw / 2 + 10;

//     for(var j = 0; j < brickRows; j++) {
//         for (var i = 0; i < bricksInRow; i++) {
//             let fillstyle = (i % 2 === 0) ? 'red' : 'blue';

//             let b = new Brick(lastBrick, yStart, brickw, brickw / 3, fillstyle)
//             gBRICKS[i] = b;
//             lastBrick += brickw + brickGap;
//         }
//         yStart += brickGap;
//     }
// };

//START STUFF
var AM = new AssetManager();
var GAME = new Game();
AM.downloadBulk(Object.values(gSounds), function(){
    GAME.init();
});
function buildBricks(rows, cols, canvasW, canvasH){

    console.log(canvasW)
    var nextX = 0;
    var nextY = 20;
    var margins = 20;
    console.log('margins: ', margins);
    var brickwidth = (canvasW - (margins * 2)); //canvas - margins = working space
    console.log('build area minus the ends: ', brickwidth);
    brickwidth = brickwidth - ((cols-1) *margins); // workingspace - (cols * margins)
    console.log('build area minus brick spacing: ', brickwidth)
    brickwidth = brickwidth / cols;
    brickctr = 0;
    console.log('final brickwidth :',brickwidth)

    for (var i = 0; i < cols; i++) {
             let fillstyle = (i % 2 === 0) ? 'red' : 'blue';

             let b = new Brick(nextX, nextY, brickwidth, margins, fillstyle)
             gBRICKS[i] = b;
             nextX += brickwidth + margins;
    }
    // for(var i = 0; i < rows; i++){

    //     for(var j = 0; j < cols; j++){
            
    //         let fillstyle = (i % 2 === 0) ? 'red' : 'blue';
            
    //         let b = new Brick(x + margins, y, brickwidth, brickwidth / 3, fillstyle)
    //        // x = x +( brickwidth + margins )
    //        x += brickwidth
    //         gBRICKS[brickctr] = b
    //         brickctr++;
    //         console.log('added brick at (x,y) : ',b.x, b.y)
    //     }
    //     y += margins * 2
    //     x = 0;

    // }


}