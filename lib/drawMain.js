'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = drawMain;
function toInt(num) {
    return ~~(0.5 + num);
}
function drawMain(yaxis) {
    var ctx = this.ctx;

    var times = this.state.times;
    var timeStr = this.state.timeStr;
    var start = this.state.start;
    var hi = this.state.hi;
    var lo = this.state.lo;
    var close = this.state.close;

    var max = yaxis.max,
        min = yaxis.min,
        maxPrice = yaxis.maxPrice,
        maxPriceIndex = yaxis.maxPriceIndex,
        minPrice = yaxis.minPrice,
        minPriceIndex = yaxis.minPriceIndex,
        intervalY = yaxis.intervalY;


    var mainView = this.mainView;
    var mainYaxisView = this.mainYaxisView;
    var timeView = this.timeView;

    var startIndex1 = Math.floor(this.state.range[0]) - 1 < 0 ? 0 : Math.floor(this.state.range[0]) - 1;
    var endIndex1 = Math.ceil(this.state.range[1]) + 1;

    var _state$range = _slicedToArray(this.state.range, 2),
        startIndex = _state$range[0],
        endIndex = _state$range[1];

    var verticalRectNumber = endIndex - startIndex;

    if (this.option.timelineVisible) {
        this.drawTimeline();
    }

    // 蜡烛线
    if (this.option.type === 'candle') {
        ctx.lineWidth = this.dpr;
        ctx.strokeStyle = this.colors.redColor;
        ctx.fillStyle = this.colors.redColor;
        for (var i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= times.length) {
                break;
            }
            if (close[i] > start[i] || i < 0) {
                continue;
            }
            var x = (j + 0.1 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            var y = (max - Math.max(start[i], close[i])) / (max - min) * mainView.h + mainView.y;
            var w = mainView.w / verticalRectNumber * 0.8;
            var h = (Math.max(start[i], close[i]) - Math.min(start[i], close[i])) / (max - min) * mainView.h;
            x = toInt(x);
            y = toInt(y);
            w = toInt(w);
            h = toInt(h);
            ctx.fillRect(x, y, w, h < this.dpr ? this.dpr : h);
            var x1 = (j + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            var y1 = (max - hi[i]) / (max - min) * mainView.h + mainView.y;
            var x2 = x1;
            var y2 = (max - lo[i]) / (max - min) * mainView.h + mainView.y;
            x1 = toInt(x1);
            y1 = toInt(y1);
            x2 = toInt(x2);
            y2 = toInt(y2);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        ctx.strokeStyle = this.colors.greenColor;
        ctx.fillStyle = this.colors.greenColor;
        for (var _i = startIndex1, _j = 0; _i < endIndex1; _i++, _j++) {
            if (_i >= times.length) {
                break;
            }
            if (close[_i] <= start[_i] || _i < 0) {
                continue;
            }
            var _x = (_j + 0.1 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            var _y = (max - Math.max(start[_i], close[_i])) / (max - min) * mainView.h + mainView.y;
            var _w = mainView.w / verticalRectNumber * 0.8;
            var _h = (Math.max(start[_i], close[_i]) - Math.min(start[_i], close[_i])) / (max - min) * mainView.h;
            _x = toInt(_x);
            _y = toInt(_y);
            _w = toInt(_w);
            _h = toInt(_h);
            if (_w <= this.dpr * 2) {
                ctx.fillRect(_x, _y, _w, _h < this.dpr ? this.dpr : _h);
            } else {
                if (this.option.theme === 'dark') {
                    // ctx.strokeRect(x + this.dpr, y + this.dpr, w - this.dpr, h < this.dpr ? this.dpr : (h - this.dpr));
                    ctx.fillRect(_x + this.dpr, _y + this.dpr, _w - this.dpr, _h < this.dpr ? this.dpr : _h - this.dpr);
                } else {
                    ctx.fillRect(_x, _y, _w, _h < this.dpr ? this.dpr : _h);
                }
            }
            var _x2 = (_j + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            var _y2 = (max - hi[_i]) / (max - min) * mainView.h + mainView.y;
            var _x3 = _x2;
            var _y3 = (max - lo[_i]) / (max - min) * mainView.h + mainView.y;
            _x2 = toInt(_x2);
            _y2 = toInt(_y2);
            _x3 = toInt(_x3);
            _y3 = toInt(_y3);
            ctx.beginPath();
            ctx.moveTo(_x2, _y2);
            ctx.lineTo(_x2, _y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(_x3, _y3);
            ctx.lineTo(_x3, _y + _h);
            ctx.stroke();
        }

        // 画最高点，最低点
        ctx.fillStyle = this.colors.textColor;
        ctx.textBaseline = 'middle';
        var index = maxPriceIndex - startIndex;
        var index1 = minPriceIndex - startIndex;
        var maxX = mainView.w / verticalRectNumber * 0.5 + (index + 0.1) * mainView.w / verticalRectNumber + mainView.x;
        var maxY = (max - maxPrice) / (max - min) * mainView.h + mainView.y;
        var minX = mainView.w / verticalRectNumber * 0.5 + (index1 + 0.1) * mainView.w / verticalRectNumber + mainView.x;
        var minY = (max - minPrice) / (max - min) * mainView.h + mainView.y;
        maxX = toInt(maxX);
        maxY = toInt(maxY);
        minX = toInt(minX);
        minY = toInt(minY);
        if (index < verticalRectNumber * 0.5) {
            ctx.textAlign = 'left';
            ctx.fillText(' ← ' + this.string(maxPrice), maxX, maxY);
        } else {
            ctx.textAlign = 'right';
            ctx.fillText(this.string(maxPrice) + ' → ', maxX, maxY);
        }
        if (index1 < verticalRectNumber * 0.5) {
            ctx.textAlign = 'left';
            ctx.fillText(' ← ' + this.string(minPrice), minX, minY);
        } else {
            ctx.textAlign = 'right';
            ctx.fillText(this.string(minPrice) + ' → ', minX, minY);
        }
    } else if (this.option.type === 'line') {
        ctx.beginPath();
        ctx.strokeStyle = this.colors.lightColor;
        ctx.lineWidth = 2 * this.dpr;
        for (var _i2 = startIndex1, _j2 = 0; _i2 < endIndex1; _i2++, _j2++) {
            if (_i2 >= times.length) {
                break;
            }
            var _x4 = (_j2 + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            var _y4 = (max - this.state.close[_i2]) / (max - min) * mainView.h + mainView.y;
            _x4 = toInt(_x4);
            _y4 = toInt(_y4);
            if (_j2 == 0) {
                ctx.moveTo(_x4, _y4);
            }
            ctx.lineTo(_x4, _y4);
        }
        ctx.stroke();
    }
    ctx.lineWidth = this.dpr;

    if (this.option.mainCsi === 'ma') {
        // ma30
        ctx.beginPath();
        ctx.strokeStyle = this.colors.ma30Color;
        for (var _i3 = startIndex1, _j3 = 0; _i3 < endIndex1; _i3++, _j3++) {
            if (_i3 >= times.length) {
                break;
            }
            var _x5 = (_j3 + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            var _y5 = (max - this.state.ma30[_i3]) / (max - min) * mainView.h + mainView.y;
            _x5 = toInt(_x5);
            _y5 = toInt(_y5);
            if (_j3 == 0) {
                ctx.moveTo(_x5, _y5);
            }
            ctx.lineTo(_x5, _y5);
        }
        ctx.stroke();

        // ma7
        ctx.beginPath();
        ctx.strokeStyle = this.colors.ma7Color;
        for (var _i4 = startIndex1, _j4 = 0; _i4 < endIndex1; _i4++, _j4++) {
            if (_i4 >= this.state.times.length) {
                break;
            }
            var _x6 = (_j4 + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            var _y6 = (max - this.state.ma7[_i4]) / (max - min) * mainView.h + mainView.y;
            _x6 = toInt(_x6);
            _y6 = toInt(_y6);
            if (_j4 == 0) {
                ctx.moveTo(_x6, _y6);
            }
            ctx.lineTo(_x6, _y6);
        }
        ctx.stroke();
    } else if (this.option.mainCsi === 'ema') {
        // ema30
        ctx.beginPath();
        ctx.strokeStyle = this.colors.ma30Color;
        for (var _i5 = startIndex1, _j5 = 0; _i5 < endIndex1; _i5++, _j5++) {
            if (_i5 >= times.length) {
                break;
            }
            var _x7 = (_j5 + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            var _y7 = (max - this.state.ema30[_i5]) / (max - min) * mainView.h + mainView.y;
            _x7 = toInt(_x7);
            _y7 = toInt(_y7);
            if (_j5 == 0) {
                ctx.moveTo(_x7, _y7);
            }
            ctx.lineTo(_x7, _y7);
        }
        ctx.stroke();

        // ema7
        ctx.beginPath();
        ctx.strokeStyle = this.colors.ma7Color;
        for (var _i6 = startIndex1, _j6 = 0; _i6 < endIndex1; _i6++, _j6++) {
            if (_i6 >= times.length) {
                break;
            }
            var _x8 = (_j6 + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            var _y8 = (max - this.state.ema7[_i6]) / (max - min) * mainView.h + mainView.y;
            _x8 = toInt(_x8);
            _y8 = toInt(_y8);
            if (_j6 == 0) {
                ctx.moveTo(_x8, _y8);
            }
            ctx.lineTo(_x8, _y8);
        }
        ctx.stroke();
    } else if (this.option.mainCsi === 'boll') {
        // UP
        ctx.beginPath();
        ctx.strokeStyle = this.colors.ma30Color;
        for (var _i7 = startIndex1, _j7 = 0; _i7 < endIndex1; _i7++, _j7++) {
            if (_i7 >= times.length) {
                break;
            }
            var _x9 = (_j7 + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            var _y9 = (max - this.state.up[_i7]) / (max - min) * mainView.h + mainView.y;
            _x9 = toInt(_x9);
            _y9 = toInt(_y9);
            if (_j7 == 0) {
                ctx.moveTo(_x9, _y9);
            }
            ctx.lineTo(_x9, _y9);
        }
        ctx.stroke();

        // MB
        ctx.beginPath();
        ctx.strokeStyle = this.colors.ma7Color;
        for (var _i8 = startIndex1, _j8 = 0; _i8 < endIndex1; _i8++, _j8++) {
            if (_i8 >= times.length) {
                break;
            }
            var _x10 = (_j8 + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            var _y10 = (max - this.state.mb[_i8]) / (max - min) * mainView.h + mainView.y;
            _x10 = toInt(_x10);
            _y10 = toInt(_y10);
            if (_j8 == 0) {
                ctx.moveTo(_x10, _y10);
            }
            ctx.lineTo(_x10, _y10);
        }
        ctx.stroke();

        // DN
        ctx.beginPath();
        ctx.strokeStyle = this.colors.macdColor;
        for (var _i9 = startIndex1, _j9 = 0; _i9 < endIndex1; _i9++, _j9++) {
            if (_i9 >= times.length) {
                break;
            }
            var _x11 = (_j9 + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            var _y11 = (max - this.state.dn[_i9]) / (max - min) * mainView.h + mainView.y;
            _x11 = toInt(_x11);
            _y11 = toInt(_y11);
            if (_j9 == 0) {
                ctx.moveTo(_x11, _y11);
            }
            ctx.lineTo(_x11, _y11);
        }
        ctx.stroke();
    } else if (this.option.mainCsi === 'sar') {
        ctx.strokeStyle = this.colors.macdColor;
        for (var _i10 = startIndex, _j10 = 0; _j10 < verticalRectNumber; _i10++, _j10++) {
            if (_i10 >= times.length) {
                break;
            }
            var _x12 = _j10 * mainView.w / verticalRectNumber + 0.5 * mainView.w / verticalRectNumber + mainView.x;
            var _y12 = (max - this.state.sar[_i10]) / (max - min) * mainView.h + mainView.y;
            _x12 = toInt(_x12);
            _y12 = toInt(_y12);
            ctx.beginPath();
            ctx.arc(_x12, _y12, mainView.w / verticalRectNumber / 6, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // y轴刻度数值 y轴刻度线
    ctx.fillStyle = this.colors.background;
    ctx.fillRect(mainYaxisView.x, 0, mainYaxisView.w, mainYaxisView.h + mainYaxisView.y);
    ctx.fillStyle = this.colors.textColor;
    ctx.strokeStyle = this.colors.splitLine;
    ctx.lineWidth = this.dpr * 0.5;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var lengthY = (max - min) / intervalY;
    for (var _i11 = 0; _i11 < lengthY; _i11++) {

        var _x13 = mainYaxisView.x + mainYaxisView.w * 0.5;
        var _y13 = _i11 * intervalY / (max - min) * mainYaxisView.h + mainYaxisView.y;
        _x13 = toInt(_x13);
        _y13 = toInt(_y13);
        if (_y13 > mainYaxisView.y + mainYaxisView.h - 10) {
            break;
        }
        ctx.fillText(this.string(max - _i11 * intervalY), _x13, _y13);
    }
    ctx.lineWidth = this.dpr;
    ctx.strokeStyle = this.colors.textColor;
    for (var _i12 = 0; _i12 < lengthY; _i12++) {
        var _x14 = mainYaxisView.x;
        var _y14 = _i12 * intervalY / (max - min) * mainYaxisView.h + mainYaxisView.y;
        if (_y14 > mainYaxisView.y + mainYaxisView.h - 10) {
            break;
        }
        _x14 = toInt(_x14);
        _y14 = toInt(_y14);
        ctx.beginPath();
        ctx.moveTo(_x14 + 5 * this.dpr, _y14);
        ctx.lineTo(_x14, _y14);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.width, _y14);
        ctx.lineTo(this.width - 5 * this.dpr, _y14);
        ctx.stroke();
    }

    // 当前价格
    ctx.fillStyle = this.colors.currentPriceColor;
    ctx.beginPath();
    var yTemp = (max - close[close.length - 1]) / (max - min) * mainView.h + mainView.y;
    // ctx.moveTo(mainYaxisView.x, yTemp);
    // ctx.lineTo(mainYaxisView.x + mainYaxisView.w * 0.15, yTemp - 12 * this.dpr);
    // ctx.lineTo(mainYaxisView.x + mainYaxisView.w, yTemp - 12 * this.dpr);
    // ctx.lineTo(mainYaxisView.x + mainYaxisView.w, yTemp + 12 * this.dpr);
    // ctx.lineTo(mainYaxisView.x + mainYaxisView.w * 0.15, yTemp + 12 * this.dpr);
    // ctx.closePath();
    // ctx.fill();
    // ctx.strokeStyle = this.colors.textFrameColor;
    // ctx.strokeRect(mainYaxisView.x + this.dpr, (max - close[close.length - 1]) / (max - min) * mainView.h + mainView.y - 10 * this.dpr, mainYaxisView.w - 2 * this.dpr, 20 * this.dpr);
    // ctx.textAlign = 'center';
    // ctx.fillStyle = this.colors.currentTextColor;
    // ctx.fillText(this.string(close[close.length - 1]), mainYaxisView.x + mainYaxisView.w * 0.5, yTemp);
    ctx.fillStyle = this.colors.currentTextColor;
    ctx.textAlign = 'left';
    ctx.fillText('← ' + this.string(close[close.length - 1]), mainYaxisView.x, yTemp);
}