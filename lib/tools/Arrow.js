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

var Arrow = function (_BaseTool) {
    _inherits(Arrow, _BaseTool);

    function Arrow(ctx, colors, context, max_step) {
        _classCallCheck(this, Arrow);

        var _this = _possibleConstructorReturn(this, (Arrow.__proto__ || Object.getPrototypeOf(Arrow)).call(this, ctx, colors, context));

        _this.max_step = max_step;
        return _this;
    }

    _createClass(Arrow, [{
        key: 'drawLine',
        value: function drawLine() {
            var ctx = this.ctx;

            var _getPos = this.getPos(),
                _getPos2 = _slicedToArray(_getPos, 2),
                point1 = _getPos2[0],
                point2 = _getPos2[1];

            var angle = Math.atan2(point1.y - point2.y, point1.x - point2.x);
            var angle1 = angle + Math.PI / 6;
            var angle2 = angle - Math.PI / 6;
            var x1 = point2.x + 12 * Math.cos(angle1);
            var y1 = point2.y + 12 * Math.sin(angle1);
            var x2 = point2.x + 12 * Math.cos(angle2);
            var y2 = point2.y + 12 * Math.sin(angle2);

            ctx.beginPath();
            ctx.moveTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point2.y);

            ctx.moveTo(x1, y1);
            ctx.lineTo(point2.x, point2.y);
            ctx.lineTo(x2, y2);
        }
    }]);

    return Arrow;
}(_BaseTool3.default);

exports.default = Arrow;