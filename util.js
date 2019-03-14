////// ======= CONSTANT VARIABLES =======//////

/** Window sizes on the page. */
WINDOW_WIDTH = 1280;
WINDOW_HEIGHT = 720;
MAX_STRESS = 50;
/** Virtual sizes to simulate resolution. */
VIRTUAL_WIDTH = 432;
VIRTUAL_HEIGHT = 243;
PLAYER_SPEED = 300;
BRICK_LINE = 280;
gSCORE = 0;

/** Global objects */
var gLASTSTATE = null;
var gSOCKET = null;
/** The object the player controls. Represented as the paddle that hits the breaker. */
gPLAYER = {};
/** The ball the player reflects to break bricks. */
gBREAKER = {};
/** An array of brick objects */
gBRICKS = [{}];
gSTATE_MACHINE = {};
gDOWN_KEYS = {};
gAGITATOR = {};
gBRICKFILLS = {
    0 : 'blue',
    1 : 'yellow',
    2 : 'red',
};
gLIVES = 3;
gMAX_LIVES = 3;
gSounds = {
    aud_HIT_WALL : 'assets/wall_hit.wav',
    aud_HIT_PADDLE : 'assets/paddle_hit.wav',
    aud_SCORE : 'assets/score.wav',
    aud_HIT_BRICK : 'assets/wall_hit.wav',
    aud_EXPLOSION : 'assets/explosion.wav',
    aud_UPGRADE : 'assets/powerup.wav',
    aud_MUSIC : 'assets/music.mp3',
};

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke){
    if (typeof stroke == "undefined" ) {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}

function makeData() {
    var name = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < 3; i++)
        name += possible.charAt(Math.floor(Math.random() * possible.length));

    return name ;
}