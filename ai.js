class AI {
    constructor() {
        console.log('hi from AI!')
        
        this.weights = {
            LEFT: 0,
            RIGHT: 0,
        }
        this.isWatching = true
        this.reset();
        
    }
   // watch(){this.isWatching = true; }
    reset(){
        this.weights.LEFT = 0;
        this.weights.RIGHT = 0;
    }
    calculateDecision(state) {

        if (this.isWatching) {
            this.reset();
            
            if (state._NAME === 'title') {
                
            }
            if (state._NAME === 'serve') {
               
            }
            else if (state._NAME === 'play') {
                this.calculatePlay();
            }
            if (this.weights.LEFT < this.weights.RIGHT) {
                console.log('holding ArrowLeft')
                gDOWN_KEYS['ArrowLeft'] = true
            } else {
                console.log('holding ArrowRight')
                gDOWN_KEYS['ArrowArrowRightLeft'] = true
            }
        }

    }

    calculatePlay() {
        console.log('calculating play')
        if (gBREAKER.x > gPLAYER.x) { this.weights.LEFT++ } else { this.weights.RIGHT++ }//if breaker is to left of paddle
        //if(gBREAKER.dx < )
    }
    pressKey(key) {
        this.ctx.dispatchEvent(new KeyboardEvent('keydown', { 'key': key }));
        this.cleanup = function(){
            this.ctx.dispatchEvent(new KeyboardEvent('keyup', { 'key': key }));
        }
    }
    holdKey(key) {
        this.ctx.dispatchEvent(new KeyboardEvent('keydown', { 'key': key }));
    }
    releaseKey(key) {
        this.ctx.dispatchEvent(new KeyboardEvent('keyup', { 'key': key }))
    }
    
}

//var CPU_GUY = new AI();
// //KEY PRESSES
// AI.prototype.pressEnter = function () {
//     this.game.ctx.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
//     this.game.ctx.dispatchEvent(new KeyboardEvent('keyup', {'key': 'Enter'}))
// };

// AI.prototype.pressUP = function () {
//     this.game.ctx.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowUp'}));
//     this.game.ctx.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowUp'}));
// };
// AI.prototype.pressDOWN = function () {
//     this.game.ctx.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowDown'}));
//     this.game.ctx.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowDown'}));
// };
// AI.prototype.pressLEFT = function () {
//     this.game.ctx.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowLeft'}));
//     this.game.ctx.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowLeft'}));
// };
// AI.prototype.pressRIGHT = function () {
//     this.game.ctx.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowRight'}));
//     this.game.ctx.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowRight'}));
// };
// //KEY HOLDS
// AI.prototype.holdEnter = function () {
//     this.game.ctx.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
// };
// //TODO: the rest
