MAX_STRESS = 50;

class AI {
    constructor() {
        console.log('hi from AI!');

        this.weights = {
            LEFT: 0,
            RIGHT: 0,
            AIM : 0,
        };
        this.decisions = {
            IDLE : 'IDLE',
            AIMING : 'AIMING',
            LEFT : 'MOVING LEFT',
            RIGHT : 'MOVING RIGHT',
            THINKING: 'THINKING'
        };
        this.decision = this.decisions.IDLE;

        this.isWatching = true;
        this.skip = false;
        this.reset();

        this.REACTION_TIMER = {
            FASTEST : 0.6,
            FAST : 0.9,
            AVERAGE : 1.1,
            SLOW : 1.3,
            PANICKED : 1.6,
            current : 0.6,
            tick : 0,
            checks : 8,
            currentText : function(){
                switch (this.current) {
                    case this.current > this.PANICKED:
                        return 'PANICKED';
                    case this.current > this.SLOW:
                        return 'SLOW';
                    case this.current > this.AVERAGE:
                        return 'AVERAGE';
                    case this.current > this.FAST:
                        return 'FAST';
                    default :
                        return 'FASTEST';
                }
            },
            next : function (time) {
                switch (time) {
                    case time > this.PANICKED:
                        this.current = this.PANICKED;
                    case time > this.SLOW:
                        this.current = this.SLOW;
                    case time > this.AVERAGE:
                        this.current = this.AVERAGE;
                    case time > this.FAST:
                        this.current = this.FAST;
                    default :
                        this.current = this.FASTEST;
                }
            },
            canReact(){
                return this.tick > this.current
            },
            reset(){
                this.tick = 0;
            },
            getMaxChecks(){
                if((this.current * 10) % this.checks !== (this.current*10)){
                    this.checks = this.checks-1;
                    return this.checks;
                }else{
                    this.checks = this.checks;
                    return this.checks;
                }
            }
        };

        this.errMargin = 3;
        this.errSize = 1;
        this.stressLevel = 1;


        this.BREAKER_CHECKS = {};

        this.TOTAL_OPTIONS = 6;
    }
    // watch(){this.isWatching = true; }
    reset(resetTime = false) {
        this.weights.LEFT = 0;
        this.weights.RIGHT = 0;
        this.weights.AIM = 0;
        this.BREAKER_CHECKS = {
            MOVING_UP : isBreakerMovingUp(),
            BELOW_BL : this.isBreakerBelowBrickLine(),
            //first functions make decision, below functions fine-tune position
            ABOVEME : this.isBreakerAboveMe(),
            RIGHTCENTER : this.isBreakerRightOfCenter(),
            LEFTCENTER : this.isBreakerLeftOfCenter(),
            ISCENTER : this.isBreakerCentered(),
            IS_MOVING_UPRIGHT : isMovingUpRight(),
            IS_MOVING_UPLEFT : isMovingUpLeft(),
            IS_MOVING_DOWNRIGHT : isMovingDownRight(),
            IS_MOVING_DOWNLEFT : isMovingDownLeft(),
        };
        if(resetTime){
            this.decision = this.decisions.IDLE;
            this.REACTION_TIMER.reset();
        }


    }
    calculateDecision(state, dt) {
        this.REACTION_TIMER.tick += dt;
        if (this.isWatching && this.REACTION_TIMER.canReact()) {
            this.reset(true);
            this.decision = this.decisions.THINKING;

            if (state._NAME === 'title') {
                this.skip = true;
            }
            else if (state._NAME === 'serve') {
                this.skip = false;
                SPACE_BAR();
                //TODO: align shot
            }
            else if (state._NAME === 'play') {
                // console.log('margin w/ operator', (randomOperator()*this.errMargin));
                this.calculatePlay();
            }

            if (!this.skip) {

                if(this.weights.AIM > (this.weights.LEFT + this.weights.RIGHT)/2){//if aim is greater than the average of left + right (if left is 4, right is 3 and aim is 5, go left)
                    console.log('aiming');
                    this.decision = this.decisions.AIMING;
                }

                else if(this.weights.LEFT > this.weights.RIGHT){
                    console.log('moving left');
                    this.decision = this.decisions.LEFT;
                    LEFT_ARROW();
                }
                else if(this.weights.LEFT < this.weights.RIGHT){
                    console.log('moving right');
                    this.decision = this.decisions.RIGHT;
                    RIGHT_ARROW();
                }
            }
        } else {
            
        }
    }

    cleanup() {
        this.reset();
        this.skip = false;
    }

    calculatePlay() {
        var maxChecks = this.REACTION_TIMER.getMaxChecks();

        this.calculateBasic();
        if(maxChecks > 4)this.calcBreakerSpeed();

        if(maxChecks > 5)this.calculateRelativeDirection();
        if(this.stressLevel % 50 === 0){
            this.REACTION_TIMER.next();
            this.stressLevel = 10 * this.REACTION_TIMER.current;
        }
        if(maxChecks > 6){this.fineTune1()}
        if(maxChecks > 7){this.fineTune2()}
        if(maxChecks > 8){this.fineTune3()}
        //this.stressLevel = this.stressLevel /
        // for(var i = 0; i < (maxDecisions && this.CALCS.length); i++){
        //     //this.BREAKER_CHECKS.
        //     this.CALCS[i]();
        // }

    }


    increaseMoveCalcDir(less = 1, more = 2){
        if(this.BREAKER_CHECKS.ISCENTER){
            this.increaseMove((more + less)/2, (more + less)/2)
        }else if(this.BREAKER_CHECKS.LEFTCENTER){
            this.increaseMove(more, less)
        }else{
            this.increaseMove(less, more)
        }
    }
    increaseAim(inc = 1){
        this.weights.AIM = this.weights.AIM + inc * this.stressLevel
    }
    increaseLeft(inc = 1){
        this.weights.LEFT = this.weights.LEFT + inc * this.stressLevel
    }
    increaseRight(inc = 1){
        this.weights.RIGHT = this.weights.RIGHT + inc * this.stressLevel
    }
    increaseMove(l,r){
        this.increaseLeft(l);
        this.increaseRight(r);
    }
    decreaseStress(dec = 1){
        this.stressLevel = Math.max(1, this.stressLevel - dec);
    }
    increaseStress(inc = 1){
        this.stressLevel = Math.min(this.stressLevel + inc, MAX_STRESS); //cap stress at 50
    }

    /**
     * Allocates <=8 move points
     * TODO: dist < 200
     */
    calculateRelativeDirection(){ //todo: vector class for maths
        let dist = getBreakerDistToPlayer();

        let stressbonus = 1;
        if(dist > 200) {
            this.increaseStress(2);
            stressbonus++;
        }

        if( this.BREAKER_CHECKS.IS_MOVING_DOWNRIGHT ){ //botright

            if(this.BREAKER_CHECKS.RIGHTCENTER){  //breaker to right of me,
                this.increaseMove(2,5 + stressbonus);
                this.increaseStress(stressbonus)
            } else if (this.BREAKER_CHECKS.LEFTCENTER){
                this.increaseMove(stressbonus + 6,1);
                this.increaseStress(1 + stressbonus);
            }else if(this.BREAKER_CHECKS.ABOVEME){
                this.increaseMove(3,4 + stressbonus);
                this.decreaseStress();
            }

        } else if ( this.BREAKER_CHECKS.IS_MOVING_DOWNLEFT ){ //true when going top right

            if(this.BREAKER_CHECKS.RIGHTCENTER){
                this.increaseMove(stressbonus + 5,2);
                this.increaseStress(stressbonus);
            }
            else if(this.BREAKER_CHECKS.LEFTCENTER){
                this.increaseMove(7 + stressbonus,1);
                this.increaseStress(1 + stressbonus);
            }else if(this.BREAKER_CHECKS.ABOVEME){
                this.increaseMove(2,3 + stressbonus);
                this.decreaseStress();
            }

        } else if ( this.BREAKER_CHECKS.IS_MOVING_UPRIGHT ){
            this.decreaseStress(stressbonus);


            if(this.BREAKER_CHECKS.RIGHTCENTER){ //ball moving to top right corner and to right of me
                this.increaseStress(stressbonus);
                this.increaseMove(1,6 + stressbonus)
            }else if(this.BREAKER_CHECKS.LEFTCENTER){ //ball moving top right corner and to left of me
                this.increaseMove(2,3 +stressbonus)
            }else if(this.BREAKER_CHECKS.ABOVEME){
                this.increaseMove(1,3+stressbonus)
                this.increaseAim(1);
            }


        } else { //top left

            this.decreaseStress(stressbonus);

            if(this.BREAKER_CHECKS.RIGHTCENTER){
                this.increaseMove(4 + stressbonus, 1)

            }else if(this.BREAKER_CHECKS.LEFTCENTER){
                this.increaseMove(3 + stressbonus, 1)

            }else if(this.BREAKER_CHECKS.ABOVEME){
                this.increaseMove(4 + stressbonus, 1);
                this.increaseAim(1);
            }
        }
    }

    fineTune1(){
        this.decreaseStress();
        let dist = getBreakerDistToPlayer();

        let stressbonus = 1;
        if(dist > 200) {
            this.increaseStress(2);
            stressbonus++;
        }
        if(this.BREAKER_CHECKS.RIGHTCENTER){ //right of me

            this.increaseMove(1, 4 + stressbonus)

        }else if(this.BREAKER_CHECKS.LEFTCENTER){ //left of me

            this.increaseMove(4 + stressbonus, 1)

        }else if(this.BREAKER_CHECKS.ABOVEME){
            this.increaseMove(1 + stressbonus, 1 + stressbonus);
            this.increaseAim(1);
        }

    }

    fineTune2(){
        this.decreaseStress();
        let dist = getBreakerDistToPlayer();

        let stressbonus = 1;
        if(dist > 200) {
            this.increaseStress(2);
            stressbonus++;
        }
        if(this.BREAKER_CHECKS.RIGHTCENTER){ //right of me

            this.increaseMove(1, 6 + stressbonus)

        }else if(this.BREAKER_CHECKS.LEFTCENTER){ //left of me

            this.increaseMove(6 + stressbonus, 1)

        }else if(this.BREAKER_CHECKS.ABOVEME){
            this.increaseMove(2 + stressbonus, 2 + stressbonus);
            this.increaseAim(1);
        }

    }
    fineTune3(){
        this.decreaseStress();
        let dist = getBreakerDistToPlayer();

        let stressbonus = 1;
        if(dist > 200) {
            this.increaseStress(2);
            stressbonus++;
        }
        if(this.BREAKER_CHECKS.RIGHTCENTER){ //right of me

            this.increaseMove(1, 12 + stressbonus)

        }else if(this.BREAKER_CHECKS.LEFTCENTER){ //left of me

            this.increaseMove(12 + stressbonus, 1)

        }else if(this.BREAKER_CHECKS.ABOVEME){
            this.increaseMove(1 + stressbonus, 1 + stressbonus);
            this.increaseAim(1);
        }

    }
    /**
     * Calculates basic 'should I aim or move' decisions based on
     * vertical location and direction of the breaker.
     */
    calculateBasic(){
        if(this.BREAKER_CHECKS.MOVING_UP){ //if moving up
            this.increaseAim();
            if(this.BREAKER_CHECKS.BELOW_BL){ //and above bl
                this.increaseMove();
            }else{
                this.increaseAim();
                this.decreaseStress();
            }
        }else{  //moving down
            if(this.BREAKER_CHECKS.BELOW_BL){
                this.increaseStress(2);
                this.increaseMove(2);
            }else{//above bl
                this.increaseStress();
                this.increaseMove();
            }
            if(gBREAKER.dx < 0){ //breaker moving left
                this.increaseMove(3,1)
            }else{              //breaker moving right
                this.increaseMove(1,3)
            }
        }
    }

    /**
     * If breaker is going faster than the player can go,
     *      if distance between player and breaker is more than 2* player's width
     *      if
     *
     */
    calcBreakerSpeed(){
        //if breaker speed is > 100
        const spd = getBreakerSpeed();
        const dir = getBreakerDirection();
        const dst = getBreakerDistToPlayer();
        if(spd > PLAYER_SPEED){                     //  1. If breaker is going faster than the player can go,
            this.increaseStress();
            if(dst > 2* gPLAYER.w){                 //  1.1. if distance between player and breaker is more than 2* player's width
                if(this.BREAKER_CHECKS.BELOW_BL){   //  1.1.2. if breaker is below brick line
                    this.increaseStress(2);
                    this.increaseMoveCalcDir(1,3);
                }else {                             //  1.1.3. else if breaker is above brick line
                    this.increaseMove();
                }
            } else {                                //  1.2. else if dist between player and breaker is < 2*player's w
                this.increaseMove();
            }
        } else {                                    //  2. If breaker is moving slower than max player speed
            if (dst > 2 * gPLAYER.w) {                 //  2.1. if distance between player and breaker is more than 2* player's width
                if (this.BREAKER_CHECKS.BELOW_BL) {   //  2.1.2. if breaker is below brick line
                    this.increaseMoveCalcDir();
                }else{                              //      2.1.3 if breaker above bl...
                    this.increaseMove();
                }
            } else {                                    // else if distance isn't bigger than 2* player
                if (this.BREAKER_CHECKS.BELOW_BL) {   //  if breaker is below brick line
                    this.increaseMoveCalcDir();
                }else{                                  //breaker above bl
                    this.increaseAim(2);
                    this.decreaseStress()
                }
            }
        }

    }



    isBreakerBelowBrickLine() {
        return gBREAKER.y > (BRICK_LINE)
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
        if(gBREAKER.x < 5 - gPLAYER.x - + gPLAYER.w/2){
            return false
        }
        if(gBREAKER.x > 5 + gPLAYER.x + gPLAYER.w/2 ){
            return false
        }
        return true
    }

    isBreakerLeftOfCenter(){
        return gBREAKER.x < gPLAYER.x + this.getErrMargin();
    }
    isBreakerRightOfCenter(){
        return gBREAKER.x > gPLAYER.x + this.getErrMargin();
    }

    getErrMargin(){
        return this.errMargin * this.errSize * randomOperator(); //random operator makes the result +/-
    }
}
function LEFT_ARROW() {
    gDOWN_KEYS['ArrowLeft'] = true;
    gDOWN_KEYS['ArrowRight'] = false;
}
function RIGHT_ARROW() {
    gDOWN_KEYS['ArrowRight'] = true;
    gDOWN_KEYS['ArrowLeft'] = false;
}
function SPACE_BAR(){
    gDOWN_KEYS['Space']= true;
}

function randomInt(max){
    return Math.floor(Math.random() * Math.floor(max))
}
function randomOperator(){
    var a = randomInt(2);
    return (a === 0) ? -1 : (a===1) ? 1 : 0
}

function getBreakerSpeed(){
    return (Math.abs(gBREAKER.dy) + Math.abs(gBREAKER.dx))
}
function isPlayerLeftHalf(){
    return gPLAYER.x < WINDOW_WIDTH / 2
}
function isPlayerRightHalf(){
    return gPLAYER.x > WINDOW_WIDTH / 2
}
function isBreakerMovingUp() {
    return gBREAKER.dy < 0
}
function getBreakerDistToPlayer(){
    let x = (gPLAYER.x - gBREAKER.x) * (gPLAYER.x - gBREAKER.x);
    let y = (gPLAYER.y - gBREAKER.y) * (gPLAYER.y - gBREAKER.y);
    return Math.sqrt(x + y)
}

function getBreakerDirection(angle){
    return gBREAKER.VECTOR().direction();
}
function isMovingDownLeft(){
    let angle = new Vector(gBREAKER.x, gBREAKER.y).direction();
    return angle > -3 && angle < -1.5
}
function isMovingDownRight(){
    let angle = new Vector(gBREAKER.x, gBREAKER.y).direction();
    return angle > -1.5 && angle < 0
}
function isMovingUpRight(){
    let angle = new Vector(gBREAKER.x, gBREAKER.y).direction();
    return angle > 0 && angle < 1.5
}

function isMovingUpLeft(){
    let angle = new Vector(gBREAKER.x, gBREAKER.y).direction();
    return angle > 1.5 && angle < 3
}




// function getBrkSpdToPlayer(){
//     if(gBREAKER.dx < 0) { //moving left
//
//     } else {    //moving right
//
//     }
// }

//function playerLeftOf


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
// pressKey(key) {
//     this.ctx.dispatchEvent(new KeyboardEvent('keydown', { 'key': key }));
//     this.cleanup = function () {
//         this.ctx.dispatchEvent(new KeyboardEvent('keyup', { 'key': key }));
//     }
// }
// holdKey(key) {
//     this.ctx.dispatchEvent(new KeyboardEvent('keydown', { 'key': key }));
// }
// releaseKey(key) {
//     this.ctx.dispatchEvent(new KeyboardEvent('keyup', { 'key': key }))
// }
// //TODO: the rest
