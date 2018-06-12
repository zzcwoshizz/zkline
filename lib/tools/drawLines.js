"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = drawLines;
function drawLines() {
    this.lines.forEach(function (line) {
        line.draw();
    });
}