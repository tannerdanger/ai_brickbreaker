class AI {
    constructor() {
        console.log('hi from AI!')

        this.weights = {
            LEFT: 0,
            RIGHT: 0,
        }
        this.isWatching = true
        this.skip = false;
        this.reset();
        this.loop = 0;
        this.DECISIONS = {
            0 : this.isBreakerAboveMe,
            1 : this.isBreakerBelowBrickLine,
            2 : this.isBreakerMovingUp,
            3 : this.isBreakerRightOfCenter,
            4 : this.isBreakerLeftOfCenter,
            5 : this.isBreakerCentered,
        }
        
    }
    // watch(){this.isWatching = true; }
    reset() {
        this.weights.LEFT = 0;
        this.weights.RIGHT = 0;
    }
    calculateDecision(state) {

        if (this.isWatching) {
            this.reset();

            if (state._NAME === 'title') {
                this.skip = true;
            }
            else if (state._NAME === 'serve') {
                this.skip = true;
            }
            else if (state._NAME === 'play') {
                this.calculatePlay();
            }

            if (!this.skip) {

                if (this.weights.LEFT < this.weights.RIGHT) {
                    //console.log('holding ArrowLeft')
                    //gDOWN_KEYS['ArrowLeft'] = true
                } else {
                    console.log('holding ArrowRight')
                    //gDOWN_KEYS['ArrowRight'] = true
                }

            }
        }

    }

    cleanup() {
        this.reset();
        //gDOWN_KEYS['ArrowRight'] = false
        //gDOWN_KEYS['ArrowLeft'] = false
        //gDOWN_KEYS['ArrowUP'] = false
        //gDOWN_KEYS['ArrowDown'] = false
        this.skip = false;

    }

    calculatePlay() {
        //console.log('calculating play')
        this.loop++
        //  if (this.loop > 100) {

        console.log(this.loop)
        //console.log('BREAKER MOVING UP:', this.isBreakerMovingUp());
        //console.log('BREAKER BELOW BRICK LINE', this.isBreakerBelowBrickLine())
 
            console.log('BREAKER IS ABOVE OF ME:')

        console.log('--------------------')
        //  }

    }
    pressKey(key) {
        this.ctx.dispatchEvent(new KeyboardEvent('keydown', { 'key': key }));
        this.cleanup = function () {
            this.ctx.dispatchEvent(new KeyboardEvent('keyup', { 'key': key }));
        }
    }
    holdKey(key) {
        this.ctx.dispatchEvent(new KeyboardEvent('keydown', { 'key': key }));
    }
    releaseKey(key) {
        this.ctx.dispatchEvent(new KeyboardEvent('keyup', { 'key': key }))
    }


    //works
    isBreakerMovingUp() {
        return gBREAKER.dy < 0
    }

    isBreakerBelowBrickLine() {
        return gBREAKER.y > BRICK_LINE
    }

    isBreakerAboveMe() {
        if (gBREAKER.x < gPLAYER.x - (gPLAYER.w/2)) { //breaker is to left of player's mid - 1/2 its with - 1/2 breaker w
            return false
        }
        if (gBREAKER.x > gPLAYER.x + (1.5* gPLAYER.w ) ) { //breaker is to left of player's mid - 1/2 its with - 1/2 breaker w
            return false
        }
        return true
    }

    isBreakerCentered(){
        if(gBREAKER.x < gPLAYER.x - gBREAKER.w){
            return false
        }
        if(gBREAKER.x > gPLAYER.x + gBREAKER.w){
            return false
        }
        return true
    }

    isBreakerLeftOfCenter(){
        return gBREAKER.x < gPLAYER.x
    }
    isBreakerRightOfCenter(){
        return gBREAKER.x > gPLAYER.x
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
