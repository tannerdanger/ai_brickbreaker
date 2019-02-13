var WINDOW_WIDTH = 1280;
var WINDOW_HEIGHT = 720;
var VIRTUAL_WIDTH = 432;
var VIRTUAL_HEIGHT = 243;
var PLAYER_SPEED = 200;

function load(){

    let gSounds = {};
    gSounds['paddle_hit'] = new Audio('assets/paddle_hit.wav');
    gSounds['score'] = new Audio('assets/score.wav');
    gSounds['brick_hit'] = new Audio();
    gSounds['explosion'] = new Audio();
    gSounds['upgrade'] = new Audio();
    gSounds['music'] = new Audio();

    let gStateMachine = new StateMachine()


}

