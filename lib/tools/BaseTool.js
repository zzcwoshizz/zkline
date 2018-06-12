"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseTool = function () {
    function BaseTool(ctx, colors, context) {
        _classCallCheck(this, BaseTool);

        this.ctx = ctx;
        this.colors = colors;
        this.step = 0;
        this.max_step = 3;
        this.context = context;
        this.index = [];
        this.price = [];
        this.moving = false;
    }

    _createClass(BaseTool, [{
        key: "draw",
        value: function draw() {
            if (this.index.length === 0) {
                return;
            }
            var ctx = this.ctx;

            this.drawLine();
            var select = this.isInPath(this.context.mousePos);

            if (select && this.step <= this.max_step) {
                ctx.strokeStyle = this.colors.lineHilightColor;
                ctx.fillStyle = this.colors.lineHilightColor;
            } else {
                ctx.strokeStyle = this.colors.lineColor;
                ctx.fillStyle = this.colors.lineColor;
            }
            ctx.lineWidth = this.context.dpr;
            ctx.stroke();

            if (this.drawOther) {
                this.drawOther();
            }

            if (select || this.step < this.max_step) {
                this.drawPoint();
            }
        }
    }, {
        key: "drawPoint",
        value: function drawPoint() {
            var _this = this;

            var ctx = this.ctx;

            ctx.lineWidth = this.context.dpr;
            ctx.fillStyle = this.colors.background;

            this.getPos().map(function (pos) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 5 * _this.context.dpr, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            });
        }
    }, {
        key: "next",
        value: function next() {
            if (this.step < this.max_step) {
                this.step++;
            }
            if (this.step === this.max_step) {
                return true;
            }
        }
    }, {
        key: "isInPath",
        value: function isInPath(pos) {
            var ctx = this.ctx;
            ctx.lineWidth = this.context.dpr * 20;
            if (ctx.isPointInStroke(pos.x, pos.y)) {
                this.select = true;
            } else {
                this.select = false;
            }
            return this.select;
        }
    }, {
        key: "setPosition",
        value: function setPosition(index, price) {
            var newIndex = [];
            var newPrice = [];
            for (var i = 0; i < this.step; i++) {
                newIndex.push(this.index[i]);
                newPrice.push(this.price[i]);
            }
            for (var _i = this.step; _i < this.max_step; _i++) {
                newIndex.push(index);
                newPrice.push(price);
            }
            this.index = newIndex;
            this.price = newPrice;
        }
    }, {
        key: "move",
        value: function move(index, price) {
            this.index = this.index.map(function (i) {
                return i + index;
            });
            this.price = this.price.map(function (p) {
                return p + price;
            });
        }
    }, {
        key: "getPos",
        value: function getPos() {
            var _this2 = this;

            var mainView = this.context.mainView;

            var _context$state$range = _slicedToArray(this.context.state.range, 2),
                startIndex = _context$state$range[0],
                endIndex = _context$state$range[1];

            var verticalRectNumber = endIndex - startIndex;

            var _context$computAxis = this.context.computAxis(),
                max = _context$computAxis.max,
                min = _context$computAxis.min;

            return this.index.map(function (el, i) {
                var x = (el - startIndex) * mainView.w / verticalRectNumber + mainView.x;
                var y = mainView.y + (max - _this2.price[i]) / (max - min) * mainView.h;
                return { x: x, y: y };
            });
        }
    }]);

    return BaseTool;
}();

exports.default = BaseTool;