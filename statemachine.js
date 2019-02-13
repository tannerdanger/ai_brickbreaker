function StateMachine(states){

    this.empty = {
        draw : function () {},
        update : function () {},
        enter : function () {},
        exit : function () {},
    };

    this.states = states || {};
    this.current = this.empty;

}

StateMachine.prototype.change = function (stateName, enterParams) {
    if(this.states[stateName]){
        this.current.exit();
        this.current = this.states[stateName];
        this.current.enter();
    }
};

StateMachine.prototype.update = function (dt) {
    this.current.update(dt)
};

StateMachine.prototype.draw = function (ctx) {
    this.current.draw(ctx);
};