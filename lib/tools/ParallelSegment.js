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

var ParallelSegment = function (_BaseTool) {
    _inherits(ParallelSegment, _BaseTool);

    function ParallelSegment(ctx, colors, context, max_step) {
        _classCallCheck(this, ParallelSegment);

        var _this = _possibleConstructorReturn(this, (ParallelSegment.__proto__ || Object.getPrototypeOf(ParallelSegment)).call(this, ctx, colors, context));

        _this.max_step = max_step;
        return _this;
    }

    _createClass(ParallelSegment, [{
        key: 'drawLine',
        value: function drawLine() {
            var ctx = this.ctx;

            var _getPos = this.getPos(),
                _getPos2 = _slicedToArray(_getPos, 2),
                point1 = _getPos2[0],
                point2 = _getPos2[1];

            ctx.beginPath();
            ctx.moveTo(point1.x, point2.y);
            ctx.lineTo(point2.x, point2.y);
        }
    }, {
        key: 'drawPoint',
        value: function drawPoint() {
            var ctx = this.ctx;

            var _getPos3 = this.getPos(),
                _getPos4 = _slicedToArray(_getPos3, 2),
                point1 = _getPos4[0],
                point2 = _getPos4[1];

            ctx.lineWidth = this.context.dpr;
            ctx.fillStyle = this.colors.background;

            ctx.beginPath();
            ctx.arc(point1.x, point2.y, 5 * this.context.dpr, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(point2.x, point2.y, 5 * this.context.dpr, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }]);

    return ParallelSegment;
}(_BaseTool3.default);

exports.default = ParallelSegment;