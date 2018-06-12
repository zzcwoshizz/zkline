import setOption from './setOption';
import setData from './setData';
import draw from './draw';
import drawMain from './drawMain';
import drawDepth from './drawDepth';
import drawAid from './drawAid';
import drawTimeline from './drawTimeline';
import operation, { drawHairLine } from './operation';
import select from './select';
import { moveRange, scaleRange } from './range';
import computAxis from './computAxis';
import canDraw from './canDraw';
import Depth from './Depth';
import drawLines from './tools/drawLines';
import drawLineCache from './tools/drawLineCache';
import ParallelSegment from './tools/ParallelSegment';
import HorizontalLine from './tools/HorizontalLine';
import HorizontalBeam from './tools/HorizontalBeam';
import VerticalLine from './tools/VerticalLine';
import PriceLine from './tools/PriceLine';
import Segment from './tools/Segment';
import Line from './tools/Line';
import Beam from './tools/Beam';
import Arrow from './tools/Arrow';
import Fibonacci from './tools/Fibonacci';
import ParallelLine from './tools/ParallelLine';

export function KLine(canvas, overCanvas, option) {
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
    setOption,
    setData,
    draw,
    drawMain,
    drawDepth,
    drawAid,
    drawHairLine,
    drawTimeline,
    drawLines,
    drawLineCache,
    operation,
    select,
    getMousePos,
    isInLineView,
    moveRange,
    scaleRange,
    canDraw,
    computAxis,
    forceUpdate: function(canvasCanDraw, overCanvasCanDraw) {
        this.force = [canvasCanDraw || this.force[0], overCanvasCanDraw || this.force[1]];
    },
    string,
    beginDrawLine: function(type) {
        if (type === 'parallelsegment') {
            this.lineCache = new ParallelSegment(this.overCtx, this.colors, this, 2);
        } else if (type === 'horizontalline') {
            this.lineCache = new HorizontalLine(this.overCtx, this.colors, this, 1);
        } else if (type === 'horizontalbeam') {
            this.lineCache = new HorizontalBeam(this.overCtx, this.colors, this, 2);
        } else if (type === 'verticalline') {
            this.lineCache = new VerticalLine(this.overCtx, this.colors, this, 1);
        } else if (type === 'priceline') {
            this.lineCache = new PriceLine(this.overCtx, this.colors, this, 1);
        } else if (type === 'segment') {
            this.lineCache = new Segment(this.overCtx, this.colors, this, 2);
        } else if (type === 'line') {
            this.lineCache = new Line(this.overCtx, this.colors, this, 2);
        } else if (type === 'beam') {
            this.lineCache = new Beam(this.overCtx, this.colors, this, 2);
        } else if (type === 'arrow') {
            this.lineCache = new Arrow(this.overCtx, this.colors, this, 2);
        } else if (type === 'fibonacci') {
            this.lineCache = new Fibonacci(this.overCtx, this.colors, this, 2);
        } else if (type === 'parallelline') {
            this.lineCache = new ParallelLine(this.overCtx, this.colors, this, 3);
        }
    },
    clearLine: function(index) {
        this.lines.splice(index, 1);
    },
    clearAllLine: function() {
        this.lines = [];
        this.forceUpdate(false, true);
    }
};

// 获取鼠标在canvas上的坐标点
function getMousePos(e) {
    let rect = e.target.getBoundingClientRect();
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
    const num1 = Math.abs(num);
    let n;
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
    let numStr = num.toFixed(n);
    let n1 = 0;
    for (let i = numStr.length - 1; i >= 0; i--) {
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
    const { x, y } = pos;
    const view1 = this.mainView;
    const view2 = this.aidView;
    if (x >= view1.x && x < view1.x + view1.w && y >= view1.y && y < view1.y + view1.h) {
        return view1;
    } else if (x >= view2.x && x < view2.x + view2.w && y >= view2.y && y < view2.y + view2.h) {
        return view2;
    } else {
        return false;
    }
}

Depth.prototype.getMousePos = getMousePos;
Depth.prototype.string = string;

export {
    Depth,
};
