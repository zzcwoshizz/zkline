'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Depth = undefined;
exports.KLine = KLine;

var _setOption = require('./setOption');

var _setOption2 = _interopRequireDefault(_setOption);

var _setData = require('./setData');

var _setData2 = _interopRequireDefault(_setData);

var _draw = require('./draw');

var _draw2 = _interopRequireDefault(_draw);

var _drawMain = require('./drawMain');

var _drawMain2 = _interopRequireDefault(_drawMain);

var _drawDepth = require('./drawDepth');

var _drawDepth2 = _interopRequireDefault(_drawDepth);

var _drawAid = require('./drawAid');

var _drawAid2 = _interopRequireDefault(_drawAid);

var _drawTimeline = require('./drawTimeline');

var _drawTimeline2 = _interopRequireDefault(_drawTimeline);

var _operation = require('./operation');

var _operation2 = _interopRequireDefault(_operation);

var _select = require('./select');

var _select2 = _interopRequireDefault(_select);

var _range = require('./range');

var _computAxis = require('./computAxis');

var _computAxis2 = _interopRequireDefault(_computAxis);

var _canDraw = require('./canDraw');

var _canDraw2 = _interopRequireDefault(_canDraw);

var _Depth = require('./Depth');

var _Depth2 = _interopRequireDefault(_Depth);

var _drawLines = require('./tools/drawLines');

var _drawLines2 = _interopRequireDefault(_drawLines);

var _drawLineCache = require('./tools/drawLineCache');

var _drawLineCache2 = _interopRequireDefault(_drawLineCache);

var _ParallelSegment = require('./tools/ParallelSegment');

var _ParallelSegment2 = _interopRequireDefault(_ParallelSegment);

var _HorizontalLine = require('./tools/HorizontalLine');

var _HorizontalLine2 = _interopRequireDefault(_HorizontalLine);

var _HorizontalBeam = require('./tools/HorizontalBeam');

var _HorizontalBeam2 = _interopRequireDefault(_HorizontalBeam);

var _VerticalLine = require('./tools/VerticalLine');

var _VerticalLine2 = _interopRequireDefault(_VerticalLine);

var _PriceLine = require('./tools/PriceLine');

var _PriceLine2 = _interopRequireDefault(_PriceLine);

var _Segment = require('./tools/Segment');

var _Segment2 = _interopRequireDefault(_Segment);

var _Line = require('./tools/Line');

var _Line2 = _interopRequireDefault(_Line);

var _Beam = require('./tools/Beam');

var _Beam2 = _interopRequireDefault(_Beam);

var _Arrow = require('./tools/Arrow');

var _Arrow2 = _interopRequireDefault(_Arrow);

var _Fibonacci = require('./tools/Fibonacci');

var _Fibonacci2 = _interopRequireDefault(_Fibonacci);

var _ParallelLine = require('./tools/ParallelLine');

var _ParallelLine2 = _interopRequireDefault(_ParallelLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function KLine(canvas, overCanvas, option) {
    this.canvas = canvas;
    this.overCanvas = overCanvas;
    if (canvas.width !== overCanvas.width || canvas.height !== overCanvas.height) {
        console.log('Two canvas\'s width and height must equal');
        return;
    }
    this.dpr = canvas.width / canvas.getBoundingClientRect().width;
    this.setOption(option);
    this.draw();
    this.operation(canvas, overCanvas);
}

KLine.prototype = {
    setOption: _setOption2.default,
    setData: _setData2.default,
    draw: _draw2.default,
    drawMain: _drawMain2.default,
    drawDepth: _drawDepth2.default,
    drawAid: _drawAid2.default,
    drawHairLine: _operation.drawHairLine,
    drawTimeline: _drawTimeline2.default,
    drawLines: _drawLines2.default,
    drawLineCache: _drawLineCache2.default,
    operation: _operation2.default,
    select: _select2.default,
    getMousePos: getMousePos,
    isInLineView: isInLineView,
    moveRange: _range.moveRange,
    scaleRange: _range.scaleRange,
    canDraw: _canDraw2.default,
    computAxis: _computAxis2.default,
    forceUpdate: function forceUpdate(canvasCanDraw, overCanvasCanDraw) {
        this.force = [canvasCanDraw || this.force[0], overCanvasCanDraw || this.force[1]];
    },
    string: string,
    beginDrawLine: function beginDrawLine(type) {
        if (type === 'parallelsegment') {
            this.lineCache = new _ParallelSegment2.default(this.overCtx, this.colors, this, 2);
        } else if (type === 'horizontalline') {
            this.lineCache = new _HorizontalLine2.default(this.overCtx, this.colors, this, 1);
        } else if (type === 'horizontalbeam') {
            this.lineCache = new _HorizontalBeam2.default(this.overCtx, this.colors, this, 2);
        } else if (type === 'verticalline') {
            this.lineCache = new _VerticalLine2.default(this.overCtx, this.colors, this, 1);
        } else if (type === 'priceline') {
            this.lineCache = new _PriceLine2.default(this.overCtx, this.colors, this, 1);
        } else if (type === 'segment') {
            this.lineCache = new _Segment2.default(this.overCtx, this.colors, this, 2);
        } else if (type === 'line') {
            this.lineCache = new _Line2.default(this.overCtx, this.colors, this, 2);
        } else if (type === 'beam') {
            this.lineCache = new _Beam2.default(this.overCtx, this.colors, this, 2);
        } else if (type === 'arrow') {
            this.lineCache = new _Arrow2.default(this.overCtx, this.colors, this, 2);
        } else if (type === 'fibonacci') {
            this.lineCache = new _Fibonacci2.default(this.overCtx, this.colors, this, 2);
        } else if (type === 'parallelline') {
            this.lineCache = new _ParallelLine2.default(this.overCtx, this.colors, this, 3);
        }
    },
    clearLine: function clearLine(index) {
        this.lines.splice(index, 1);
    },
    clearAllLine: function clearAllLine() {
        this.lines = [];
        this.forceUpdate(false, true);
    }
};

// 获取鼠标在canvas上的坐标点
function getMousePos(e) {
    var rect = e.target.getBoundingClientRect();
    if (this.device === 'pc') {
        return {
            x: (e.clientX - rect.left) * this.dpr,
            y: (e.clientY - rect.top) * this.dpr
        };
    } else {
        return {
            x: (e.touches[0].clientX - rect.left) * this.dpr,
            y: (e.touches[0].clientY - rect.top) * this.dpr
        };
    }
}

// 转换为字符串，控制小数位数
function string(num) {
    num = Number(num || 0);
    var num1 = Math.abs(num);
    var n = void 0;
    if (num1 >= 100) {
        return String(Number(num.toFixed(2)));
    } else if (num1 >= 10) {
        return String(Number(num.toFixed(3)));
    } else if (num1 >= 1) {
        return String(Number(num.toFixed(4)));
    } else if (num1 >= 0.1) {
        return String(Number(num.toFixed(5)));
    } else if (num >= 0.01) {
        return String(Number(num.toFixed(6)));
    } else if (num >= 0.001) {
        return String(Number(num.toFixed(7)));
    } else if (num >= 0.0001) {
        return String(Number(num.toFixed(8)));
    } else if (num >= 0.00001) {
        return String(Number(num.toFixed(9)));
    } else if (num1 >= 0.000001) {
        n = 10;
    } else if (num1 >= 0.0000001) {
        n = 11;
    } else if (num1 >= 0.00000001) {
        n = 12;
    } else if (num1 >= 0.000000001) {
        n = 13;
    } else if (num1 >= 0.0000000001) {
        n = 14;
    } else if (num1 >= 0.00000000001) {
        n = 15;
    } else if (num1 >= 0.000000000001) {
        n = 16;
    } else {
        return '0';
    }
    var numStr = num.toFixed(n);
    var n1 = 0;
    for (var i = numStr.length - 1; i >= 0; i--) {
        if (numStr.charAt(i) !== '0') {
            break;
        }
        n1++;
    }
    numStr = num.toFixed(n - n1);
    return numStr;
}

// 判断鼠标是否在${this.views}中
function isInLineView(pos) {
    var x = pos.x,
        y = pos.y;

    var view1 = this.mainView;
    var view2 = this.aidView;
    if (x >= view1.x && x < view1.x + view1.w && y >= view1.y && y < view1.y + view1.h) {
        return view1;
    } else if (x >= view2.x && x < view2.x + view2.w && y >= view2.y && y < view2.y + view2.h) {
        return view2;
    } else {
        return false;
    }
}

_Depth2.default.prototype.getMousePos = getMousePos;
_Depth2.default.prototype.string = string;

exports.Depth = _Depth2.default;