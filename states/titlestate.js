function TitleState(bb){
    this.BB = bb
}
TitleState.prototype.draw = function(ctx){
   // ctx.setFont
   //set style
   // print WELCOME TO BB

   //set size -10
   //Start
   //About This Game
}
TitleState.prototype.update = function(dt){
    if(this.BB.keyboard.isDown['return']){
        //if start selected...
        this.BB.stateMachine.change('serve')
        //else
        //this.BB.stateMachine.change('about')
    }
}


function ServeState(bb){
    this.score = 0
    this.lives = 3
    this.playerspeed =PLAYERSPEED
}