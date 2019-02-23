//TODO: check the downkeys and find out what is wrong with the behavior.
// AI keys are sticking/not resetting properly
function InputManager() {
    this.ctx = null;
    this.isAbout = false;
};
InputManager.prototype.registerEventListeners = function (ctx) {
    this.ctx = ctx;
    this.ctx.canvas.addEventListener('keydown', e => {
        //console.log(e.code, " :pressed");
        gDOWN_KEYS[e.code] = true;
    }, false)

    this.ctx.canvas.addEventListener('keyup', e => {
        // console.log(e.code, " :released");
        gDOWN_KEYS[e.code] = false
    }, false)
};

function agitator(cpu){
    this.CPU_GUY = cpu;
    this.w = 200;
    this.x = 10;
    this.y = BRICK_LINE;
    this.h = this.y + 60;
    this.play = false;
}
agitator.prototype.update = function(dt){

};
agitator.prototype.draw = function (ctx) {
    if(this.play) {
        let textbuffer = 0;
        let alpha = ctx.globalAlpha;
        ctx.globalAlpha = 0.09;
        let base = this.y + 30;
        let checksBlockBase = this.y + 85;
        let controlBlockBase = this.y + 270;
        ctx.lineWidth = 1;

        ctx.fillStyle = 'grey';
        roundRect(ctx, this.x, this.y, this.w, this.h, 5, true, true)
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.font = '28px arcade';
        ctx.fillText('SCORE '+ gSCORE, this.x + this.w/2, base, this.w - 5);
        ctx.font = '18px arcade';
        ctx.fillText('CPU STRESS : '+this.CPU_GUY.stressLevel, this.x + this.w/2, base + 25, this.w - 5);
        ctx.font = '14px arcade';



        ctx.fillText('CPU CHECKS', this.x + this.w/2, checksBlockBase, this.w - 5);
        let wordW = ctx.measureText('CPU CHECKS').width + 10;
        ctx.strokeStyle = 'red';

        ctx.beginPath();
        ctx.moveTo(this.x + this.w/2 - wordW /2 , checksBlockBase + 5);
        ctx.lineTo(this.x + this.w/2 + wordW /2, checksBlockBase + 5);
        ctx.stroke();

        ctx.textAlign = 'start';

        ctx.fillStyle = (this.CPU_GUY.BREAKER_CHECKS.MOVING_UP) ? 'green' : 'red';
        ctx.fillText('BREAKER MOVING UP', this.x + 5 , checksBlockBase + 25, this.w - 5 );

        ctx.fillStyle = (this.CPU_GUY.BREAKER_CHECKS.BELOW_BL) ? 'green' : 'red';
        ctx.fillText('BREAKER BELOW BRICKS', this.x + 5 , checksBlockBase + 40, this.w - 5);

        ctx.fillStyle = (this.CPU_GUY.BREAKER_CHECKS.ABOVEME) ? 'green' : 'red';
        ctx.fillText('BREAKER ABOVE ME', this.x + 5 , checksBlockBase + 55, this.w - 5);

        ctx.fillStyle = (this.CPU_GUY.BREAKER_CHECKS.RIGHTCENTER) ? 'green' : 'red';
        ctx.fillText('BREAKER RIGHT OF MY CENTER', this.x + 5 , checksBlockBase + 70, this.w - 5);

        ctx.fillStyle = (this.CPU_GUY.BREAKER_CHECKS.LEFTCENTER) ? 'green' : 'red';
        ctx.fillText('BREAKER LEFT OF MY CENTER', this.x + 5 , checksBlockBase + 85, this.w - 5);

        ctx.fillStyle = (this.CPU_GUY.BREAKER_CHECKS.ISCENTER) ? 'green' : 'red';
        ctx.fillText('BREAKER IS AT MY CENTER', this.x + 5 , checksBlockBase + 100, this.w - 5);

        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.fillText('CPU DECISION', this.x + this.w/2, checksBlockBase + 125);
        ctx.fillText(this.CPU_GUY.decision, this.x + this.w/2, checksBlockBase + 150);

        wordW = ctx.measureText('CPU DECISION').width + 10;
        ctx.strokeStyle = 'red';

        ctx.beginPath();
        ctx.moveTo(this.x + this.w/2 - wordW /2 , checksBlockBase + 130);
        ctx.lineTo(this.x + this.w/2 + wordW /2, checksBlockBase + 130);
        ctx.stroke();

        // ctx.fillText('CONTROLS', this.x + this.w/2, controlBlockBase, this.w - 5);
        ctx.font = '18px arcade';
        ctx.fillText('press \'Q\' for ABOUT', this.x + this.w/2, controlBlockBase + 55, this.w);
        // wordW = ctx.measureText('CONTROLS').width + 10;
        // ctx.strokeStyle = 'red';

        // ctx.beginPath();
        // ctx.moveTo(this.x + this.w/2 - wordW /2 , controlBlockBase + 5);
        // ctx.lineTo(this.x + this.w/2 + wordW /2, controlBlockBase + 5);
        // ctx.stroke();

        // ctx.font = '14px arcade';
        // ctx.textAlign = 'start';

        // ctx.fillText('CPU STRESS + :  UP KEY'+String.fromCharCode(), this.x + 10, controlBlockBase + 25, this.w);
        // ctx.fillText('CPU STRESS -- :  DOWN KEY', this.x + 10, controlBlockBase + 40, this.w);
        // ctx.fillText('READ ABOUT THIS GAME : Q ', this.x + 10, controlBlockBase + 55, this.w);

        ctx.globalAlpha = alpha
    }
};
agitator.prototype.increaseStress = function(num){
    this.CPU_GUY.increaseStress(num)
};

function Game(sounds){


    this.engine = new GameEngine();
    this.inputManager = new InputManager();
    this.entities = [];
    this.ctx = null;
    this.CPU_GUY = null;

}
Game.prototype.draw = function(){
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    gSTATE_MACHINE.draw(this.ctx);
    gAGITATOR.draw(this.ctx);
    this.ctx.restore();
};
Game.prototype.update = function(dt){
    this.CPU_GUY.cleanup(); //cleanup last turn BEFORE new turn
    this.CPU_GUY.calculateDecision(gSTATE_MACHINE.current, dt);
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
    this.CPU_GUY = new AI();
    gAGITATOR = new agitator(this.CPU_GUY);
    gPLAYER = new Paddle(this.surfaceWidth / 2, this.surfaceHeight - 50, 150, 25);

    gBREAKER = new Breaker((gPLAYER.x + gPLAYER.w/2), gPLAYER.y - gPLAYER.h/2, 8 );



    buildBricks(5, 14, this.surfaceWidth, this.surfaceHeight);

    this.entities = gBRICKS;


    gSTATE_MACHINE.change(gStates.serve);
    this.engine.start();
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
    console.log('build area minus brick spacing: ', brickwidth);
    brickwidth = brickwidth / cols;
    brickctr = 0;
    console.log('final brickwidth :',brickwidth);
    var level = 0;
    for(var j = 0; j < rows; j++) {

        for (var i = 0; i < cols; i++) {

            //determine fill color
            // let fillstyle = (j % 2 === 0 && i % 2 === 0) ? 'red'
            //     : (j % 2 !== 0 && i % 2 !== 0) ? 'red'
            //         : 'blue';

            let b = new Brick(nextX, nextY, brickwidth, margins, level);
            gBRICKS[brickctr++] = b;
            nextX += brickwidth + margins;
            if(level + 1 > 2){
                level = 0
            }else{
                level++;
            }
        }
        cols = (i % 2 === 0) ? cols - 1 : cols + 1;
        nextY += (2 * margins);
        nextX = (cols === 14) ? 20 : (20 + brickwidth / 2)
    }
    //   let b = new Brick(canvasW / 2, canvasH - margins * 2, brickwidth, margins, 'yellow');
//    gBRICKS[brickctr++] = b;
}

