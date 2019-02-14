var style = {
    fontFamily: 'arcade',
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440
};
//STATE
function basestate() {

}
basestate.prototype.draw = function (ctx) {

    for(let i = 0; i < gBRICKS.length; i++) {
        let brick = gBRICKS[i];
        gBRICKS[i].draw(ctx);
    }
};
basestate.prototype.update = function (dt) {

};
basestate.prototype.enter = function (params) {

};
basestate.prototype.exit = function () {

};

function TitleState(){
    //this.fontStyle = style.fontWeight + ' ' + style.fontSize+'px' + ' ' + style.fontFamily;
    //this.fontStyle = 'italic 26px arcade';
    this.shadowOffset = 4;
    this.shadowColor = 'green';
    this.shadowBlur = 4;
    this.fillStyle = 'red';
    this._NAME = 'title'


}
TitleState.prototype = new basestate();
TitleState.constructor = TitleState;
TitleState.prototype.draw = function(ctx){

    //ctx.font = this.fontStyle;
    ctx.font = style.fontWeight + ' ' + style.fontSize+'px' + ' ' + style.fontFamily;

    ctx.shadowOffsetX = this.shadowOffset;
    ctx.shadowOffsetY = this.shadowOffset;
    ctx.shadowColor = this.shadowColor;
    ctx.shadowBlur = this.shadowBlur;
    ctx.fillStyle = this.fillStyle;
    ctx.textAlign = 'center';
    ctx.fillText('WELCOME TO BRICKBREAKER', ctx.canvas.width / 2, ctx.canvas.height / 2)


};
TitleState.prototype.update = function(dt){
    if(gDOWN_KEYS['Enter']){
        gSTATE_MACHINE.change(gStates.serve)
    }
};


function ServeState(){
    this.score = 0;
    this.lives = 3;
    this.playerspeed = PLAYER_SPEED
}
ServeState.prototype = new basestate();
ServeState.constructor = ServeState();
ServeState.prototype.update = function(){

    if(gDOWN_KEYS['ArrowLeft'] || gDOWN_KEYS['KeyA']){
        gPLAYER.dx = -PLAYER_SPEED;
        gBREAKER.dx = gPLAYER.dx;
    }

};
var gStates = {
    title: new TitleState(),
    serve: new ServeState(),
};