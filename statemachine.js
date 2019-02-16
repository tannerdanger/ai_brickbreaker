function StateMachine(){
    this.empty = {
        draw : function () {},
        update : function () {},
        enter : function () {},
        exit : function () {},
    };
    this.current = this.empty;
    this.game = null;
}

StateMachine.prototype.change = function (state, enterParams) {
        this.current.exit();
        this.current = state;
        this.current.enter(this.game);
};
StateMachine.prototype.init = function(game) {
    this.game = game
}

StateMachine.prototype.update = function (dt) {
    this.current.update(dt)
};

StateMachine.prototype.draw = function (ctx) {
    this.current.draw(ctx);
};

gSTATE_MACHINE = new StateMachine();