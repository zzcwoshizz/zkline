"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.moveRange = moveRange;
exports.scaleRange = scaleRange;
function moveRange(distance) {
    var _state$range = _slicedToArray(this.state.range, 2),
        startIndex = _state$range[0],
        endIndex = _state$range[1];

    var verticalRectNumber = endIndex - startIndex;
    var newStartIndex = startIndex - distance;
    var newEndIndex = endIndex - distance;
    if (newStartIndex > this.state.times.length - 10) {
        newStartIndex = this.state.times.length - 10;
        newEndIndex = newStartIndex + verticalRectNumber;
    }
    if (newStartIndex < -verticalRectNumber + 10) {
        newStartIndex = -verticalRectNumber + 10;
        newEndIndex = 10;
    }
    this.state = _extends({}, this.state, { range: [newStartIndex, newEndIndex] });
}

function scaleRange(n, currentIndex) {
    var _state$range2 = _slicedToArray(this.state.range, 2),
        startIndex = _state$range2[0],
        endIndex = _state$range2[1];

    currentIndex += startIndex;
    var verticalRectNumber = endIndex - startIndex;
    var newRange = void 0;
    if (n > 0) {
        if (n > 10) {
            n = 10 * (1 + (n - 10) / (n * 0.5));
        }
        var distance = n * (currentIndex - startIndex) / verticalRectNumber;
        newRange = [startIndex - distance, endIndex + (endIndex - currentIndex) / (currentIndex - startIndex) * distance];
    } else {
        if (n < -10) {
            n = -10 * (1 + (n + 10) / (n * 0.5));
        }
        var _distance = n * (currentIndex - startIndex) / verticalRectNumber;
        newRange = [startIndex - _distance, endIndex + (endIndex - currentIndex) / (currentIndex - startIndex) * _distance];
    }
    if (newRange[1] - newRange[0] > this.maxVerticalRectNumber) {
        newRange = [newRange[0] + (newRange[1] - newRange[0] - this.maxVerticalRectNumber) * (currentIndex - startIndex) / verticalRectNumber, newRange[1] - (newRange[1] - newRange[0] - this.maxVerticalRectNumber) * (endIndex - currentIndex) / verticalRectNumber];
    }
    if (newRange[1] - newRange[0] < this.minVerticalRectNumber) {
        newRange = [newRange[0] - (this.minVerticalRectNumber - newRange[1] + newRange[0]) * (currentIndex - startIndex) / verticalRectNumber, newRange[0] - (this.minVerticalRectNumber - newRange[1] + newRange[0]) * (currentIndex - startIndex) / verticalRectNumber + this.minVerticalRectNumber];
    }
    if (newRange[0] > this.state.times.length - 10) {
        newRange = [this.state.times.length - 10, this.state.times.length - 10 + (newRange[1] - newRange[0])];
    }
    if (newRange[0] < -(newRange[1] - newRange[0]) + 10) {
        newRange = [-(newRange[1] - newRange[0]) + 10, 10];
    }
    this.state = _extends({}, this.state, { range: newRange });
}