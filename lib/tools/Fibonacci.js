'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseTool2 = require('./BaseTool');

var _BaseTool3 = _interopRequireDefault(_BaseTool2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Fibonacci = function (_BaseTool) {
    _inherits(Fibonacci, _BaseTool);

    function Fibonacci(ctx, colors, context, max_step) {
        _classCallCheck(this, Fibonacci);

        var _this = _possibleConstructorReturn(this, (Fibonacci.__proto__ || Object.getPrototypeOf(Fibonacci)).call(this, ctx, colors, context));

        _this.max_step = max_step;
        return _this;
    }

    _createClass(Fibonacci, [{
        key: 'drawLine',
        value: function drawLine() {
            var ctx = this.ctx;

            var _getPos = this.getPos(),
                _getPos2 = _slicedToArray(_getPos, 2),
                point1 = _getPos2[0],
                point2 = _getPos2[1];

            ctx.beginPath();
            ctx.moveTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point1.y);
            ctx.moveTo(point1.x, (point1.y - point2.y) * 0.786 + point2.y);
            ctx.lineTo(point2.x, (point1.y - point2.y) * 0.786 + point2.y);
            ctx.moveTo(point1.x, (point1.y - point2.y) * 0.618 + point2.y);
            ctx.lineTo(point2.x, (point1.y - point2.y) * 0.618 + point2.y);
            ctx.moveTo(point1.x, (point1.y - point2.y) * 0.5 + point2.y);
            ctx.lineTo(point2.x, (point1.y - point2.y) * 0.5 + point2.y);
            ctx.moveTo(point1.x, (point1.y - point2.y) * 0.382 + point2.y);
            ctx.lineTo(point2.x, (point1.y - point2.y) * 0.382 + point2.y);
            ctx.moveTo(point1.x, (point1.y - point2.y) * 0.236 + point2.y);
            ctx.lineTo(point2.x, (point1.y - point2.y) * 0.236 + point2.y);
            ctx.moveTo(point1.x, point2.y);
            ctx.lineTo(point2.x, point2.y);
        }
    }, {
        key: 'drawOther',
        value: function drawOther() {
            var ctx = this.ctx;

            var _getPos3 = this.getPos(),
                _getPos4 = _slicedToArray(_getPos3, 2),
                point1 = _getPos4[0],
                point2 = _getPos4[1];

            ctx.beginPath();
            ctx.setLineDash([10, 10]);
            ctx.moveTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point2.y);
            ctx.stroke();
            ctx.setLineDash([]);

            var n = void 0;
            if (point1.x < point2.x) {
                ctx.textAlign = 'right';
                n = -10;
            } else {
                ctx.textAlign = 'left';
                n = 10;
            }
            ctx.textBaseline = 'middle';
            ctx.fillText('1 ' + this.context.string(this.price[0]), point1.x + n, point1.y);
            ctx.fillText('0.786 ' + this.context.string(this.price[1] + (this.price[0] - this.price[1]) * 0.786), point1.x + n, (point1.y - point2.y) * 0.786 + point2.y);
            ctx.fillText('0.618 ' + this.context.string(this.price[1] + (this.price[0] - this.price[1]) * 0.618), point1.x + n, (point1.y - point2.y) * 0.618 + point2.y);
            ctx.fillText('0.5 ' + this.context.string(this.price[1] + (this.price[0] - this.price[1]) * 0.5), point1.x + n, (point1.y - point2.y) * 0.5 + point2.y);
            ctx.fillText('0.382 ' + this.context.string(this.price[1] + (this.price[0] - this.price[1]) * 0.382), point1.x + n, (point1.y - point2.y) * 0.382 + point2.y);
            ctx.fillText('0.236 ' + this.context.string(this.price[1] + (this.price[0] - this.price[1]) * 0.236), point1.x + n, (point1.y - point2.y) * 0.236 + point2.y);
            ctx.fillText('0 ' + this.context.string(this.price[1]), point1.x + n, point2.y);
        }
    }]);

    return Fibonacci;
}(_BaseTool3.default);

exports.default = Fibonacci;