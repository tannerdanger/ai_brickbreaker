function StateMachine(){
    this.empty = {
        draw : function () {},
        update : function () {},
        enter : function () {},
        exit : function () {},
    };
    this.current = this.empty;
    this.game = null;
    this.previous = this.empty;
}

StateMachine.prototype.change = function (state, enterParams = {}) {
        this.current.exit();
        this.previous = this.current;
        this.current = state;
        this.current.enter(enterParams);
};
StateMachine.prototype.init = function(game) {
    this.game = game
};

StateMachine.prototype.update = function (dt) {
    this.current.update(dt)
};

StateMachine.prototype.draw = function (ctx) {
    this.current.draw(ctx);
};


gSTATE_MACHINE = new StateMachine();