"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = canDraw;
function canDraw() {
    if (this.state.range[0] != this.lastState.range[0] || this.state.range[1] != this.lastState.range[1]) {
        return [true, true];
    }
    if (this.force[0] || this.force[1]) {
        var temp = this.force;
        this.force = [false, false];
        return temp;
    }
    return [false, false];
}