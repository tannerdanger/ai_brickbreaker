function InputManager(){
    this.ctx = null;
};
InputManager.prototype.registerEventListeners = function(ctx){
    this.ctx = ctx;
    this.ctx.canvas.addEventListener('keydown', e =>{
        console.log(e.code, " :pressed");
        gDOWN_KEYS[e.code] = true
    }, false)

    this.ctx.canvas.addEventListener('keyup', e =>{
        console.log(e.code, " :released");
        gDOWN_KEYS[e.code] = false
    }, false)
};


function AI(game) {

    this.game = game

};
AI.prototype.calculateDecision = function(state){

    if(state._NAME === 'title'){
        this.pressEnter();
    }

};
//KEY PRESSES
AI.prototype.pressEnter = function () {
    this.game.ctx.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
    this.game.ctx.dispatchEvent(new KeyboardEvent('keyup', {'key': 'Enter'}))
};

AI.prototype.pressUP = function () {
    this.game.ctx.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowUp'}));
    this.game.ctx.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowUp'}));
};
AI.prototype.pressDOWN = function () {
    this.game.ctx.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowDown'}));
    this.game.ctx.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowDown'}));
};
AI.prototype.pressLEFT = function () {
    this.game.ctx.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowLeft'}));
    this.game.ctx.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowLeft'}));
};
AI.prototype.pressRIGHT = function () {
    this.game.ctx.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowRight'}));
    this.game.ctx.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowRight'}));
};
//KEY HOLDS
AI.prototype.holdEnter = function () {
    this.game.ctx.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
};
//TODO: the rest