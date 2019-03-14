

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
        this.serveWait = 4;
        this.isWatching = true;
        this.skip = false;
        this.reset();

        this.REACTION_TIMER = {
            FASTEST : 1.6,
            FAST : 1.9,
            AVERAGE : 2.1,
            SLOW : 2.3,
            PANICKED : 2.6,
            current : 1.6,
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
                    this.checks = Math.max(this.checks-1, 0);
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
        let err = this.getErrMargin()
        this.BREAKER_CHECKS = {
            MOVING_UP : isBreakerMovingUp(err),
            BELOW_BL : this.isBreakerBelowBrickLine(err),
            //first functions make decision, below functions fine-tune position
            ABOVEME : this.isBreakerAboveMe(err),
            RIGHTCENTER : this.isBreakerRightOfCenter(err),
            LEFTCENTER : this.isBreakerLeftOfCenter(err),
            ISCENTER : this.isBreakerCentered(err),
            IS_MOVING_UPRIGHT : isMovingUpRight(err),
            IS_MOVING_UPLEFT : isMovingUpLeft(err),
            IS_MOVING_DOWNRIGHT : isMovingDownRight(err),
            IS_MOVING_DOWNLEFT : isMovingDownLeft(err),
        };
        if(resetTime){
            this.decision = this.decisions.IDLE;
            this.REACTION_TIMER.reset();

        }
        if(this.BREAKER_CHECKS.IS_MOVING_UPRIGHT){
            console.log('moving upright')
        }
        if(this.BREAKER_CHECKS.IS_MOVING_UPLEFT){
            console.log('moving upleft')
        }
        if(this.BREAKER_CHECKS.IS_MOVING_DOWNLEFT){
            console.log('moving downleft')
        }
        if(this.BREAKER_CHECKS.IS_MOVING_DOWNRIGHT){
            console.log('moving downright')
        }



    }
    calculateDecision(state, dt) {

        this.REACTION_TIMER.tick += dt;
        this.serveWait = this.serveWait - dt;

        if (this.isWatching && this.REACTION_TIMER.canReact()) {
            this.reset(true);
            this.decision = this.decisions.THINKING;

            if (state._NAME === 'title' || state._NAME === 'about' || state._NAME === 'load') {
                this.skip = true;
            }

            else if (state._NAME === 'serve') {
               // console.log(this.serveWait);
                if(this.serveWait <= 0){
                    this.skip = false;
                    SPACE_BAR();
                    this.serveWait = 4;
                }
                //TODO: align shot
            }
            else if (state._NAME === 'play') {
                this.serveWait = 4;
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
        this.checkUpdateStress();

        if(maxChecks > 6){this.fineTune1()}
        this.checkUpdateStress();

        if(maxChecks > 7){this.fineTune2()}
        this.checkUpdateStress();

        if(maxChecks > 8){this.fineTune3()}
        this.checkUpdateStress();


    }

    checkUpdateStress(){
        if(this.stressLevel % 50 === 0){
            this.REACTION_TIMER.next();
            this.stressLevel = 10 * this.REACTION_TIMER.current;
        }
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

            this.increaseMove(1, 10 + stressbonus)

        }else if(this.BREAKER_CHECKS.LEFTCENTER){ //left of me

            this.increaseMove(10 + stressbonus, 1)

        }
        if(this.BREAKER_CHECKS.ABOVEME){
            this.increaseMove(2 + stressbonus, 2 + stressbonus);
            if(gBREAKER.dx < 0){
                this.increaseMove(15 + stressbonus, 1 + stressbonus)
            }
            if(gBREAKER.dx > 0){
                this.increaseMove(1 + stressbonus, 15 + stressbonus)
            }
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

        }
        if(this.BREAKER_CHECKS.ABOVEME){

            if(this.BREAKER_CHECKS.ABOVEME){
                this.increaseMove(2 + stressbonus, 2 + stressbonus);
                if(gBREAKER.dx < 0){
                    this.increaseMove(15 + stressbonus, 1 + stressbonus)
                }
                if(gBREAKER.dx > 0){
                    this.increaseMove(1 + stressbonus, 15 + stressbonus)
                }
            }
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
                this.increaseMove(2,2);
            }else{//above bl
                this.increaseStress();
                this.increaseMove(1,1);
            }
            if(gBREAKER.dx < 0){
                this.increaseMove(5 , 1 )
            }
            if(gBREAKER.dx > 0){
                this.increaseMove(1 , 5 )
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


    isBreakerBelowBrickLine(errMargin) {
        errMargin = errMargin || 0
        return gBREAKER.y + errMargin > (BRICK_LINE)
    }

    isBreakerAboveMe(errMargin) {
        errMargin = errMargin || 0
        if (gBREAKER.x + errMargin < gPLAYER.x - (gPLAYER.w/2)) { //breaker is to left of player's mid - 1/2 its with - 1/2 breaker w
            return false
        }
        if (gBREAKER.x + errMargin > gPLAYER.x + (1.5* gPLAYER.w ) ) { //breaker is to left of player's mid - 1/2 its with - 1/2 breaker w
            return false
        }
        return true
    }

    isBreakerCentered(errMargin){
        errMargin = errMargin || 0
        if(gBREAKER.x + errMargin < 5 - gPLAYER.x - + gPLAYER.w/2){
            return false
        }
        if(gBREAKER.x + errMargin > 5 + gPLAYER.x + gPLAYER.w/2 ){
            return false
        }
        return true
    }

    isBreakerLeftOfCenter(errMargin){
        errMargin = errMargin || 0
        return gBREAKER.x < gPLAYER.x + errMargin
    }
    isBreakerRightOfCenter(errMargin = 0){
        return gBREAKER.x > gPLAYER.x + errMargin
    }

    getErrMargin(){
        return Math.min(100, this.errMargin * this.stressLevel * randomOperator()) //random operator makes the result +/-
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

function getBreakerSpeed(errMargin = 0){
    return (Math.abs(gBREAKER.dy) + Math.abs(gBREAKER.dx) + errMargin)
}
function isPlayerLeftHalf(errMargin = 0){
    return gPLAYER.x + errMargin < WINDOW_WIDTH / 2
}
function isPlayerRightHalf(errMargin = 0){
    return gPLAYER.x + errMargin> WINDOW_WIDTH / 2
}
function isBreakerMovingUp(errMargin = 0) {
    return gBREAKER.dy + errMargin/2 < 0
}
function getBreakerDistToPlayer(errMargin = 0){
    let x = (gPLAYER.x - gBREAKER.x) * (gPLAYER.x - gBREAKER.x)+ errMargin/2;
    let y = (gPLAYER.y - gBREAKER.y) * (gPLAYER.y - gBREAKER.y) + errMargin/2;
    return Math.sqrt(x + y)
}

function getBreakerDirection(angle){
    return gBREAKER.VECTOR().direction();
}
function isMovingDownLeft(){
    let angle = new Vector(gBREAKER.dx, gBREAKER.dy).direction();
    return 1.6 < angle
}
function isMovingDownRight(){
    let angle = new Vector(gBREAKER.dx, gBREAKER.dy).direction();
    return 0 < angle && angle < 1.5
}
function isMovingUpRight(){
    let angle = new Vector(gBREAKER.dx, gBREAKER.dy).direction();
    return angle < 0 && angle > -1.5
    //return -1 < angle && angle < -1.5
}

function isMovingUpLeft(){
    let angle = new Vector(gBREAKER.dx, gBREAKER.dy).direction();
    //console.log('angle: ',angle)
    return angle < -1.5
}

