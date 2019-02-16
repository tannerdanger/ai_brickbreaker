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
class baseState {
    constructor(){}

    draw(ctx){
        for(let i = 0; i < gBRICKS.length; i++) {
            gBRICKS[i].draw(ctx);
        }
        gPLAYER.draw(ctx);
        gBREAKER.draw(ctx);
    }
    update(dt){
        gPLAYER.update(dt);
        gBREAKER.update(dt);
    }
    enter(params){

    }
    exit(){

    }
}
class TitleState extends baseState{
    constructor(){
        super()
        this.shadowOffset = 4;
        this.shadowColor = 'green';
        this.shadowBlur = 4;
        this.fillStyle = 'red';
        this._NAME = 'title'
    }
    draw(ctx){
        //ctx.font = this.fontStyle;
        ctx.font = style.fontWeight + ' ' + style.fontSize+'px' + ' ' + style.fontFamily;

        ctx.shadowOffsetX = this.shadowOffset;
        ctx.shadowOffsetY = this.shadowOffset;
        ctx.shadowColor = this.shadowColor;
        ctx.shadowBlur = this.shadowBlur;
        ctx.fillStyle = this.fillStyle;
        ctx.textAlign = 'center';
        ctx.fillText('WELCOME TO BRICKBREAKER', ctx.canvas.width / 2, ctx.canvas.height / 2)
    }
    update(dt){
        if(gDOWN_KEYS['Enter']){
            gSTATE_MACHINE.change(gStates.serve)
        }
    }
}
class ServeState extends baseState{
    constructor(){
        super();
        this.score = 0;
        this.lives = 3;
        this.playerspeed = PLAYER_SPEED
        this._NAME = 'serve'
    }
    enter(params){
        AM.getAsset(gSounds.aud_MUSIC).play();
    }
    update(dt){
        if(gDOWN_KEYS['ArrowLeft'] || gDOWN_KEYS['KeyA']){
            gPLAYER.dx = -PLAYER_SPEED;
            gBREAKER.dx = gPLAYER.dx;
        }
        else if(gDOWN_KEYS['ArrowRight'] || gDOWN_KEYS['KeyD']){
            gPLAYER.dx = +PLAYER_SPEED;
            gBREAKER.dx = gPLAYER.dx;
        }
        else if(gDOWN_KEYS['ArrowUp']) {

        }
        else {
            gPLAYER.dx = 0;
            gBREAKER.dx = 0;
        }
        if(gDOWN_KEYS['Space']){
            gSTATE_MACHINE.change(gStates.play)
        }
        super.update(dt);
    }
}

class PlayState extends baseState{
    constructor(){
        super();
        this._NAME = 'play'
        //this.wallHit = AM.getAsset(gSounds.aud_HIT_WALL)
    }
    enter(params){
        
    }
    update(dt){

        

        if( gBREAKER.collides(gPLAYER)){
            AM.getAsset(gSounds.aud_HIT_PADDLE).play();
            gBREAKER.dy = -gBREAKER.dy;
            gBREAKER.y = gPLAYER.y - 5;
        }
        //TODO: check vertical so don't check brick collision unless coplanar with lowest brick
        if(gBREAKER.y < BRICK_LINE) {
            for (let i = 0; i < gBRICKS.length; i++) {

                let brick = gBRICKS[i];
                if(gBREAKER.collides(brick)){
                    AM.getAsset(gSounds.aud_HIT_BRICK).play();
                    gBREAKER.dy = -gBREAKER.dy;
                    gBREAKER.y = (brick.y + brick.h + 5)
                    gBRICKS.splice(gBRICKS.indexOf(brick), 1);
                }
            }
        }

        if(gBREAKER.y > WINDOW_HEIGHT){
            AM.getAsset(gSounds.aud_EXPLOSION).play();
            gBREAKER.reset();
            gPLAYER.reset();
            gSTATE_MACHINE.change(gStates.serve)
        }

        if(gDOWN_KEYS['ArrowLeft'] || gDOWN_KEYS['KeyA']){
            gPLAYER.dx = -PLAYER_SPEED;
        }
        else if(gDOWN_KEYS['ArrowRight'] || gDOWN_KEYS['KeyD']){
            gPLAYER.dx = +PLAYER_SPEED;
        }
        else {
            gPLAYER.dx = 0;
        }
        super.update(dt);

    }
    enter(params) {
        gBREAKER.serve();
        //TODO: params -> arrow angle
    }

    draw(ctx){
        super.draw(ctx)
    }


}

var gStates = {
    title: new TitleState(),
    serve: new ServeState(),
    play: new PlayState(),
};