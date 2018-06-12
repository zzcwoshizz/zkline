'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = drawAid;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function toInt(num) {
    return ~~(0.5 + num);
}
function drawAid() {
    this.ctx.lineJoin = 'round';
    if (this.option.aidCsi === 'volume') {
        drawVolume.call(this);
    } else if (this.option.aidCsi === 'macd') {
        drawMacd.call(this);
    } else if (this.option.aidCsi === 'kdj') {
        drawLine.call(this, ['k', 'd', 'j']);
    } else if (this.option.aidCsi === 'dmi') {
        drawLine.call(this, ['pdi', 'mdi', 'adx', 'adxr']);
    } else if (this.option.aidCsi === 'dma') {
        drawLine.call(this, ['dmaDif', 'dmaDifma']);
    } else if (this.option.aidCsi === 'trix') {
        drawLine.call(this, ['trix', 'matrix']);
    } else if (this.option.aidCsi === 'brar') {
        drawLine.call(this, ['br', 'ar']);
    } else if (this.option.aidCsi === 'vr') {
        drawLine.call(this, ['vr', 'mavr']);
    } else if (this.option.aidCsi === 'obv') {
        drawLine.call(this, ['obv', 'maobv']);
    } else if (this.option.aidCsi === 'rsi') {
        drawLine.call(this, ['rsi6', 'rsi12', 'rsi24']);
    }
}

function drawVolume() {
    var _this = this;

    var ctx = this.ctx;
    var aidView = this.aidView;
    var aidYaxisView = this.aidYaxisView;

    var _state$range = _slicedToArray(this.state.range, 2),
        startIndex = _state$range[0],
        endIndex = _state$range[1];

    var startIndex1 = Math.floor(startIndex) - 1 < 0 ? 0 : Math.floor(startIndex) - 1;
    var endIndex1 = Math.ceil(endIndex) + 1;
    var verticalRectNumber = endIndex - startIndex;

    var realVolume = [];
    var realVolumeMa7 = [];
    var realVolumeMa30 = [];
    this.state.volume.forEach(function (el, i) {
        if (i >= startIndex1 && i < endIndex1) {
            realVolume.push(el);
            realVolumeMa7.push(_this.state.volumeMa7[i]);
            realVolumeMa30.push(_this.state.volumeMa30[i]);
        }
    });
    var maxVolume = Math.max.apply(Math, realVolume.concat(realVolumeMa7, realVolumeMa30)) * 1.25;
    this.csiYaxisSector = [maxVolume, 0];

    var n = 0;
    if (maxVolume >= 1) {
        n = maxVolume.toFixed(0).length;
    } else {
        if (maxVolume < 0.000001) {
            var str = (maxVolume * 100000).toString().split('.')[1] || '';
            for (var i = 0; i < str.length; i++) {
                if (str.charAt(i) == 0) {
                    n--;
                }
            }
            n -= 5;
        } else {
            var _str = maxVolume.toString().split('.')[1] || '';
            for (var _i = 0; _i < _str.length; _i++) {
                if (_str.charAt(_i) == 0) {
                    n--;
                }
            }
        }
    }
    var interval = Math.ceil(maxVolume * 0.25 / Math.pow(10, n - 2)) * Math.pow(10, n - 2);
    var yAxis = [];
    for (var _i2 = interval; _i2 < maxVolume; _i2 += interval) {
        yAxis.unshift(_i2);
    }

    ctx.fillStyle = this.colors.greenColor;
    ctx.strokeStyle = this.colors.greenColor;
    for (var _i3 = startIndex1, j = 0; _i3 < endIndex1; _i3++, j++) {
        if (_i3 >= this.state.times.length) {
            break;
        }
        if (_i3 < 0) {
            continue;
        }
        if (this.state.start[_i3] < this.state.close[_i3]) {
            var x = (j + 0.1 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
            var w = aidView.w / verticalRectNumber * 0.8;
            var h = -this.state.volume[_i3] / maxVolume * aidView.h;
            var y = aidView.y + aidView.h;
            if (w <= this.dpr * 2) {
                ctx.fillRect(x, y, w, h);
            } else {
                if (this.option.theme === 'dark') {
                    ctx.strokeRect(x + this.dpr, y - this.dpr, w - this.dpr, h - this.dpr);
                } else {
                    ctx.fillRect(x, y, w, h);
                }
            }
        }
    }

    ctx.fillStyle = this.colors.redColor;
    for (var _i4 = startIndex1, _j = 0; _i4 < endIndex1; _i4++, _j++) {
        if (_i4 >= this.state.times.length) {
            break;
        }
        if (_i4 < 0) {
            continue;
        }
        if (this.state.close[_i4] <= this.state.start[_i4]) {
            var _x = (_j + 0.1 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
            var _w = aidView.w / verticalRectNumber * 0.8;
            var _h = -this.state.volume[_i4] / maxVolume * aidView.h;
            var _y = aidView.y + aidView.h;
            ctx.fillRect(_x, _y, _w, _h);
        }
    }

    //if (this.option.mainCsi === 'ma') {
    if (false) {
        ctx.beginPath();
        for (var _i5 = startIndex1, _j2 = 0; _i5 < endIndex1; _i5++, _j2++) {
            if (_i5 >= this.state.times.length) {
                break;
            }
            if (_i5 < 0) {
                continue;
            }
            ctx.strokeStyle = this.colors.ma30Color;
            var _x2 = (_j2 + 0.5 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
            var _y2 = (maxVolume - this.state.volumeMa30[_i5]) / maxVolume * aidView.h + aidView.y;
            if (_j2 == 0) {
                ctx.moveTo(_x2, _y2);
            }
            ctx.lineTo(_x2, _y2);
        }
        ctx.stroke();

        ctx.beginPath();
        for (var _i6 = startIndex1, _j3 = 0; _i6 < endIndex1; _i6++, _j3++) {
            if (_i6 >= this.state.times.length) {
                break;
            }
            if (_i6 < 0) {
                continue;
            }
            ctx.strokeStyle = this.colors.ma7Color;
            var _x3 = (_j3 + 0.5 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
            var _y3 = (maxVolume - this.state.volumeMa7[_i6]) / maxVolume * aidView.h + aidView.y;
            if (_j3 == 0) {
                ctx.moveTo(_x3, _y3);
            }
            ctx.lineTo(_x3, _y3);
        }
        ctx.stroke();
    }

    ctx.fillStyle = this.colors.background;
    ctx.fillRect(aidYaxisView.x, aidYaxisView.y, aidYaxisView.w, this.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.colors.textColor;
    ctx.strokeStyle = this.colors.splitLine;
    ctx.lineWidth = this.dpr * 0.5;
    for (var _i7 = 0; _i7 < yAxis.length; _i7++) {
        ctx.fillText(this.string(yAxis[_i7]), aidYaxisView.x + aidYaxisView.w * 0.5, aidYaxisView.y + aidYaxisView.h - yAxis[_i7] / maxVolume * aidYaxisView.h);
    }

    ctx.lineWidth = this.dpr;
    ctx.strokeStyle = this.colors.textColor;
    for (var _i8 = 0; _i8 < yAxis.length; _i8++) {
        var _x4 = aidYaxisView.x;
        var _y4 = aidYaxisView.y + aidYaxisView.h - yAxis[_i8] / maxVolume * aidYaxisView.h;
        ctx.beginPath();
        ctx.moveTo(_x4, _y4);
        ctx.lineTo(_x4 + 10, _y4);
        ctx.stroke();
    }

    // 当前价格
    ctx.fillStyle = this.colors.currentPriceColor;
    ctx.beginPath();
    var yTemp = (maxVolume - this.state.volume[this.state.volume.length - 1]) / maxVolume * aidView.h + aidView.y;
    // ctx.moveTo(aidYaxisView.x, yTemp);
    // ctx.lineTo(aidYaxisView.x + aidYaxisView.w * 0.15, yTemp - 12 * this.dpr);
    // ctx.lineTo(aidYaxisView.x + aidYaxisView.w, yTemp - 12 * this.dpr);
    // ctx.lineTo(aidYaxisView.x + aidYaxisView.w, yTemp + 12 * this.dpr);
    // ctx.lineTo(aidYaxisView.x + aidYaxisView.w * 0.15, yTemp + 12 * this.dpr);
    // ctx.closePath();
    // ctx.fill();
    // ctx.strokeStyle = this.colors.textFrameColor;
    // ctx.strokeRect(mainYaxisView.x + this.dpr, (max - close[close.length - 1]) / (max - min) * mainView.h + mainView.y - 10 * this.dpr, mainYaxisView.w - 2 * this.dpr, 20 * this.dpr);
    // ctx.textAlign = 'center';
    ctx.fillStyle = this.colors.currentTextColor;
    // ctx.fillText(realVolume[realVolume.length - 1], aidYaxisView.x + aidYaxisView.w * 0.5, yTemp);
    ctx.textAlign = 'left';
    ctx.fillText('← ' + this.state.volume[this.state.volume.length - 1], aidYaxisView.x, yTemp);
}

function drawMacd() {
    var _this2 = this;

    var ctx = this.ctx;

    var _state$range2 = _slicedToArray(this.state.range, 2),
        startIndex = _state$range2[0],
        endIndex = _state$range2[1];

    var startIndex1 = Math.floor(startIndex) - 1 < 0 ? 0 : Math.floor(startIndex) - 1;
    var endIndex1 = Math.ceil(endIndex) + 1;
    var verticalRectNumber = endIndex - startIndex;
    var aidView = this.aidView;
    var aidYaxisView = this.aidYaxisView;

    var max = 0;
    var min = 0;
    this.state.macd.forEach(function (el, i) {
        if (i < startIndex1 || i >= endIndex1) {
            return;
        }
        var val = Math.max(el, _this2.state.dif[i], _this2.state.dea[i]);
        max = max > val ? max : val;
        val = Math.min(el, _this2.state.dif[i], _this2.state.dea[i]);
        min = min < val ? min : val;
    });
    max = (max > Math.abs(min) ? max : Math.abs(min)) * 1.25;
    this.csiYaxisSector = [max, -max];
    var yAxis = [max, max * 2 / 3, max / 3, -max / 3, -max * 2 / 3, -max];

    ctx.lineWidth = this.dpr;
    ctx.fillStyle = this.colors.greenColor;
    ctx.strokeStyle = this.colors.greenColor;
    for (var i = startIndex1, j = 0; i < endIndex1; i++, j++) {
        if (i >= this.state.times.length) {
            break;
        }
        if (i < 0) {
            continue;
        }
        if (this.state.macd[i] > 0) {
            var y = aidView.y + aidView.h * 0.5;
            var w = aidView.w / verticalRectNumber * 0.8;
            var x = (j + 0.1 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
            var h = -this.state.macd[i] / max * aidView.h * 0.5;
            if (Math.abs(this.state.macd[i]) > Math.abs(this.state.macd[i - 1])) {
                ctx.fillRect(x, y, w, h);
            } else {
                if (w <= this.dpr * 2) {
                    ctx.fillRect(x, y, w, h);
                } else {
                    ctx.strokeRect(x + this.dpr, y - this.dpr, w - this.dpr, h - this.dpr);
                }
            }
        }
    }
    ctx.fillStyle = this.colors.redColor;
    ctx.strokeStyle = this.colors.redColor;
    for (var _i9 = startIndex1, _j4 = 0; _i9 < endIndex1; _i9++, _j4++) {
        if (_i9 >= this.state.times.length) {
            break;
        }
        if (_i9 < 0) {
            continue;
        }
        if (this.state.macd[_i9] <= 0) {
            var _y5 = aidView.y + aidView.h * 0.5;
            var _w2 = aidView.w / verticalRectNumber * 0.8;
            var _x5 = (_j4 + 0.1 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x + _w2 * 0.1;
            var _h2 = -this.state.macd[_i9] / max * aidView.h * 0.5;
            if (Math.abs(this.state.macd[_i9]) > Math.abs(this.state.macd[_i9 - 1])) {
                ctx.fillRect(_x5, _y5, _w2, _h2);
            } else {
                if (_w2 <= this.dpr * 2) {
                    ctx.fillRect(_x5, _y5, _w2, _h2);
                } else {
                    ctx.strokeRect(_x5 + this.dpr, _y5 + this.dpr, _w2 - this.dpr, _h2 - this.dpr);
                }
            }
        }
    }

    // dif
    ctx.strokeStyle = this.colors.ma7Color;
    ctx.beginPath();
    for (var _i10 = startIndex1, _j5 = 0; _i10 < endIndex1; _i10++, _j5++) {
        if (_i10 >= this.state.times.length) {
            break;
        }
        if (_i10 < 0) {
            continue;
        }
        var _x6 = (_j5 + 0.5 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
        var _y6 = (max - this.state.dif[_i10]) / (2 * max) * aidView.h + aidView.y;
        if (_j5 === 0) {
            ctx.moveTo(_x6, _y6);
            continue;
        }
        ctx.lineTo(_x6, _y6);
    }
    ctx.stroke();

    // dea
    ctx.strokeStyle = this.colors.ma30Color;
    ctx.beginPath();
    for (var _i11 = startIndex1, _j6 = 0; _i11 < endIndex1; _i11++, _j6++) {
        if (_i11 >= this.state.times.length) {
            break;
        }
        if (_i11 < 0) {
            continue;
        }
        var _x7 = (_j6 + 0.5 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
        var _y7 = (max - this.state.dea[_i11]) / (2 * max) * aidView.h + aidView.y;
        if (_j6 === 0) {
            ctx.moveTo(_x7, _y7);
            continue;
        }
        ctx.lineTo(_x7, _y7);
    }
    ctx.stroke();

    ctx.fillStyle = this.colors.background;
    ctx.fillRect(aidYaxisView.x, aidYaxisView.y, aidYaxisView.w, this.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.colors.textColor;
    ctx.strokeStyle = this.colors.splitLine;
    ctx.lineWidth = this.dpr * 0.5;
    for (var _i12 = 1; _i12 < yAxis.length - 1; _i12++) {
        ctx.fillText(this.string(yAxis[_i12]), aidYaxisView.x + aidYaxisView.w * 0.5, aidYaxisView.y + _i12 / (yAxis.length - 1) * aidYaxisView.h);
    }
}

function drawLine(keys) {
    var _this3 = this;

    var ctx = this.ctx;

    var _state$range3 = _slicedToArray(this.state.range, 2),
        startIndex = _state$range3[0],
        endIndex = _state$range3[1];

    var startIndex1 = Math.floor(startIndex) - 1 < 0 ? 0 : Math.floor(startIndex) - 1;
    var endIndex1 = Math.ceil(endIndex) + 1;
    var verticalRectNumber = endIndex - startIndex;
    var aidView = this.aidView;
    var aidYaxisView = this.aidYaxisView;

    var max = 0;
    var min = 0;
    this.state[keys[0]].forEach(function (el, i) {
        if (i < startIndex1 || i >= endIndex1) {
            return;
        }
        var params = keys.map(function (key) {
            return _this3.state[key][i];
        });
        var val = Math.max.apply(Math, _toConsumableArray(params));
        max = max > val ? max : val;
        val = Math.min.apply(Math, _toConsumableArray(params));
        min = min < val ? min : val;
    });
    max *= 1.1;
    this.csiYaxisSector = [max, min];

    var cha = max - min;

    var n = 0;
    if (cha >= 1) {
        n = cha.toFixed(0).length;
    } else {
        if (cha < 0.000001) {
            var str = (cha * 100000).toString().split('.')[1] || '';
            for (var i = 0; i < str.length; i++) {
                if (str.charAt(i) == 0) {
                    n--;
                }
            }
            n -= 5;
        } else {
            var _str2 = cha.toString().split('.')[1] || '';
            for (var _i13 = 0; _i13 < _str2.length; _i13++) {
                if (_str2.charAt(_i13) == 0) {
                    n--;
                }
            }
        }
    }
    var interval = Math.ceil(cha * 0.25 / Math.pow(10, n - 2)) * Math.pow(10, n - 2);
    var yAxis = [];
    for (var _i14 = 0; _i14 < max; _i14 += interval) {
        yAxis.unshift(_i14);
    }

    ctx.lineWidth = this.dpr;
    ctx.strokeStyle = this.colors.textColor;
    for (var _i15 = 0; _i15 < yAxis.length; _i15++) {
        var x = aidYaxisView.x;
        var y = aidYaxisView.y + (max - yAxis[_i15]) / cha * aidYaxisView.h;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 10, y);
        ctx.stroke();
    }

    keys.forEach(function (key) {
        ctx.strokeStyle = _this3.colors[key + 'Color'];
        ctx.beginPath();
        for (var _i16 = startIndex1, j = 0; _i16 < endIndex1; _i16++, j++) {
            if (_i16 >= _this3.state.times.length) {
                break;
            }
            if (_i16 < 0) {
                continue;
            }
            var _x8 = (j + 0.5 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
            var _y8 = (max - _this3.state[key][_i16]) / cha * aidView.h + aidView.y;
            if (j == 0) {
                ctx.moveTo(_x8, _y8);
            }
            ctx.lineTo(_x8, _y8);
        }
        ctx.stroke();
    });

    ctx.fillStyle = this.colors.background;
    ctx.fillRect(aidYaxisView.x, aidYaxisView.y, aidYaxisView.w, this.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.colors.textColor;
    ctx.strokeStyle = this.colors.splitLine;
    ctx.lineWidth = this.dpr * 0.5;
    for (var _i17 = 0; _i17 < yAxis.length; _i17++) {
        ctx.fillText(this.string(yAxis[_i17]), aidYaxisView.x + aidYaxisView.w * 0.5, aidYaxisView.y + (max - yAxis[_i17]) / cha * aidYaxisView.h);
    }
}