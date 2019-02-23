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

        if(gDOWN_KEYS['KeyQ']){
            gSTATE_MACHINE.change(gStates.about)
        }
    }
    enter(){
        
    }
    exit(){

    }
}
class TitleState extends baseState{
    constructor(){
        super();
        this.shadowOffset = 4;
        this.shadowColor = 'green';
        this.shadowBlur = 4;
        this.fillStyle = 'red';
        this._NAME = 'title';
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
        this.playerspeed = PLAYER_SPEED;
        this._NAME = 'serve'
    }
    enter(params){
       // let music = AM.getAsset(gSounds.aud_MUSIC);
        //music.oncanplaythrough(music.play());
        gDOWN_KEYS['ArrowLeft'] = false;
        gDOWN_KEYS['ArrowRight'] = false;
        gAGITATOR.play = true;
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
                    gBREAKER.y = (brick.y + brick.h );
                    //gBRICKS.splice(gBRICKS.indexOf(brick), 1);
                    brick.hit();
                }
            }
        }

        if(gBREAKER.y > WINDOW_HEIGHT){
            AM.getAsset(gSounds.aud_EXPLOSION).play();
            gAGITATOR.increaseStress( (3 + (gMAX_LIVES - gLIVES)) * 5);
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

class AboutState extends baseState{
    constructor(){
        super();
        this._NAME = 'about'
    }
    update(dt){

        if(gDOWN_KEYS['Space']){
            gSTATE_MACHINE.change(gSTATE_MACHINE.previous)
        }
        console.log('about update')
    }
    draw(ctx){
       // super.draw(ctx);

        let textbuffer = 0;
        let alpha = ctx.globalAlpha;
        ctx.globalAlpha = 0.6;
        let baseY = 100;
        let baseX = 220;
        let h = (WINDOW_HEIGHT - baseY * 2) + 50 ;
        let w = WINDOW_WIDTH - baseX * 2;
        let lineH = baseY + 50;
        let lineDiff = 25

        ctx.lineWidth = 1;

        ctx.fillStyle = 'blue';
        roundRect(ctx, baseX, baseY, w, h, 20, true, true)

        ctx.textAlign = 'center';
        ctx.font = '28px arcade';
        ctx.fillStyle = 'white';

        ctx.fillText('WELCOME TO "AI" BICKBREAKER! ', WINDOW_WIDTH/2 , lineH);
        lineH += lineDiff
        ctx.font = '20px arcade';

        ctx.fillText('A retro recreation by TANNER BROWN', WINDOW_WIDTH/2 , lineH);
        lineH += lineDiff * 2

        ctx.fillText('This game lets you watch an Artifical Intelligence play the game!', WINDOW_WIDTH/2 , lineH);
        lineH += lineDiff

        ctx.fillText('The "AI" makes calculated decisions to move LEFT, RIGHT or to WAIT based on', WINDOW_WIDTH/2 , lineH);
        lineH += lineDiff

        ctx.fillText('various calculations. You can see the results of several of these tests on the left', WINDOW_WIDTH/2 , lineH);
        
        var text = 'side of the screen under CPU CHECKS.'
        lineH += lineDiff
        ctx.fillText(text, WINDOW_WIDTH/2 , lineH);
        
        text = 'A TRUE check will display GREEN and a FALSE check will display RED. '
        lineH += lineDiff *2
        ctx.fillText(text, WINDOW_WIDTH/2 , lineH);

        text = 'The STRESS indicator displays the CPUs current stress level.'
        lineH += lineDiff * 2
        ctx.fillText(text, WINDOW_WIDTH/2 , lineH);

        text = 'This level increases or decreases as situations ocour that might cause them'
        lineH += lineDiff
        ctx.fillText(text, WINDOW_WIDTH/2 , lineH);

       
        text = 'Example: The breaker is moving down and on the other side of the field adds stress'
        lineH += lineDiff *2
        ctx.fillText(text, WINDOW_WIDTH/2 , lineH);


        text = 'Or the ball being directly above the player and moving up would reduce stress'
        lineH += lineDiff 
        ctx.fillText(text, WINDOW_WIDTH/2 , lineH);

        text = 'Higher stress levels will limit the number of calculations that can be made,'
        lineH += lineDiff *2
        ctx.fillText(text, WINDOW_WIDTH/2 , lineH);

        text = 'which will in turn reduce the precision of the player. Calculations will also'
        lineH += lineDiff
        ctx.fillText(text, WINDOW_WIDTH/2 , lineH);

        text = 'begin to return inaccurate results as stress levels rise, causing mistakes.'
        lineH += lineDiff
        ctx.fillText(text, WINDOW_WIDTH/2 , lineH);

        text = 'press \'SPACE\' to return'
        lineH += lineDiff *2
        ctx.fillText(text, WINDOW_WIDTH/2 , lineH);

        ctx.globalAlpha = alpha;
    }
    drawFrame(ctx){
       // roundRect(ctx, WINDOW_WIDTH / 3, WINDOW_HEIGHT / 2, 10, 'red', true)
    }
    enter(params){
        gDOWN_KEYS['KeyQ'] = false
        gAGITATOR.isWatching = false
    }
    exit(){
        gAGITATOR.isWatching = true
    }
    
}

var gStates = {
    title: new TitleState(),
    serve: new ServeState(),
    play: new PlayState(),
    about: new AboutState(),
};