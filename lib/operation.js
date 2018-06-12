'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = operation;
exports.drawHairLine = drawHairLine;
function operation(canvas, overCanvas) {
    var _this = this;

    var overCtx = this.overCtx;

    var isMove = false;
    var isDown = false;
    var lastIndex = -1;
    var lastPrice = -1;
    var lastPos = {};
    var lastTouchDistance = 0;
    var moveLine = null;
    var distance = null;

    var move = function move(e) {
        var mainView = _this.mainView;
        var aidView = _this.aidView;
        var pos = _this.getMousePos(e);
        _this.mousePos = pos;

        var _state$range = _slicedToArray(_this.state.range, 2),
            startIndex = _state$range[0],
            endIndex = _state$range[1];

        var verticalRectNumber = endIndex - startIndex;
        //const currentIndex = Math.floor((pos.x - aidView.x) / aidView.w * verticalRectNumber);
        var currentIndex = (pos.x - aidView.x) / aidView.w * verticalRectNumber;

        var _computAxis = _this.computAxis(),
            max = _computAxis.max,
            min = _computAxis.min;

        var price = max - (max - min) * (pos.y - mainView.y) / mainView.h;
        if (_this.isInLineView(pos)) {
            if (isDown) {
                if (moveLine && moveLine.moving) {
                    if (pos.x > mainView.x && pos.x < mainView.x + mainView.w && pos.y > mainView.y && pos.y < mainView.y + mainView.h) {
                        moveLine.move(currentIndex - lastIndex, price - lastPrice);
                    }
                } else {
                    _this.moveRange(currentIndex - lastIndex);
                }
            }
            if (isMove) {
                var offset = pos.y - lastPos.y;
                _this.mainView.h += offset;
                _this.mainYaxisView.h += offset;
                _this.aidView.y += offset;
                _this.aidView.h -= offset;
                _this.aidYaxisView.y += offset;
                _this.aidYaxisView.h -= offset;
                _this.forceUpdate(true, true);
            }
            _this.pos = pos;
            if (_this.lineCache && pos.x > mainView.x && pos.x < mainView.x + mainView.w && pos.y > mainView.y && pos.y < mainView.y + mainView.h) {
                _this.lineCache.setPosition(currentIndex + startIndex, price);
            }
        } else {
            _this.pos = null;
        }
        if (pos.y > aidView.y - 5 && pos.y < aidView.y + 5) {
            _this.overCanvas.style.cursor = 'ns-resize';
        } else {
            _this.overCanvas.style.cursor = 'default';
        }
        _this.forceUpdate(false, true);
        lastIndex = currentIndex;
        lastPrice = price;
        lastPos = pos;
    };

    var scale = function scale(e) {
        var mainView = _this.mainView;
        var aidView = _this.aidView;
        var pos = _this.getMousePos(e);

        var _state$range2 = _slicedToArray(_this.state.range, 2),
            startIndex = _state$range2[0],
            endIndex = _state$range2[1];

        var verticalRectNumber = endIndex - startIndex;
        var currentIndex = (pos.x - aidView.x) / aidView.w * verticalRectNumber;
        var n = Number(e.deltaY.toFixed(0));
        _this.scaleRange(n, currentIndex);
    };

    if (this.device === 'pc') {
        var mousedown = function mousedown(e) {
            var aidView = _this.aidView;
            var pos = _this.getMousePos(e);
            if (e.button === 0) {
                isDown = true;
                if (pos.y > aidView.y - 5 && pos.y < aidView.y + 5) {
                    isMove = true;
                }
                _this.lines.forEach(function (line) {
                    if (line.select) {
                        moveLine = line;
                        moveLine.moving = true;
                        return;
                    }
                });
                var verticalRectNumber = _this.state.range[1] - _this.state.range[0];
                var currentIndex = (pos.x - aidView.x) / aidView.w * verticalRectNumber;
                lastIndex = currentIndex;
            } else if (e.button === 2) {
                overCanvas.oncontextmenu = function () {
                    return false;
                };
                var index = null;
                // 查询鼠标所在处线
                _this.lines.forEach(function (line, i) {
                    if (line.select) {
                        index = i;
                        return;
                    }
                });
                if (_this.lineCache) {
                    // 删除当前进行中的线
                    _this.lineCache = null;
                } else if (index !== null) {
                    // 删除线
                    _this.clearLine(index);
                }
            }
            _this.forceUpdate(false, true);
        };
        var mouseup = function mouseup() {
            isDown = false;
            isMove = false;
            if (moveLine) {
                moveLine.moving = false;
                moveLine = null;
            }
            _this.forceUpdate(false, true);
        };
        var mouseout = function mouseout() {
            isDown = false;
            _this.pos = null;
            if (moveLine) {
                moveLine.moving = false;
                moveLine = null;
            }
            _this.forceUpdate(false, true);
        };
        overCanvas.addEventListener('mousedown', mousedown);
        overCanvas.addEventListener('mouseup', mouseup);
        overCanvas.addEventListener('mouseout', mouseout);
        overCanvas.addEventListener('mousemove', move);
        overCanvas.addEventListener('wheel', function (e) {
            e.preventDefault();
            scale(e);
        });
        overCanvas.addEventListener('click', function (e) {
            e.preventDefault();
            if (!_this.lineCache) {
                return;
            }
            var pos = _this.getMousePos(e);
            var complete = _this.lineCache.next();
            if (complete) {
                _this.lines.unshift(_this.lineCache);
                _this.lineCache = null;
            }
            _this.forceUpdate(false, true);
        });
    } else {
        var touchstart = function touchstart(e) {
            e.preventDefault();
            isDown = true;
            var pos = _this.getMousePos(e);
            _this.pos = pos;
            var aidView = _this.aidView;
            var verticalRectNumber = _this.state.range[1] - _this.state.range[0];
            var currentIndex = (pos.x - aidView.x) / aidView.w * verticalRectNumber;
            lastIndex = currentIndex;
            if (e.touches.length === 2) {
                var rect = e.target.getBoundingClientRect();
                var x1 = (e.touches[0].clientX - rect.left) * _this.dpr;
                var y1 = (e.touches[0].clientY - rect.top) * _this.dpr;
                var x2 = (e.touches[1].clientX - rect.left) * _this.dpr;
                var y2 = (e.touches[1].clientY - rect.top) * _this.dpr;
                distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
            }
            _this.forceUpdate(false, true);
        };
        var touchend = function touchend() {
            isDown = false;
            _this.forceUpdate(false, true);
        };
        var touchcancel = function touchcancel() {
            isDown = false;
            _this.forceUpdate(false, true);
        };
        var touchmove = function touchmove(e) {
            e.preventDefault();
            var mainView = _this.mainView;
            var aidView = _this.aidView;
            var pos = _this.getMousePos(e);

            var _state$range3 = _slicedToArray(_this.state.range, 2),
                startIndex = _state$range3[0],
                endIndex = _state$range3[1];

            var verticalRectNumber = endIndex - startIndex;
            var currentIndex = (pos.x - aidView.x) / aidView.w * verticalRectNumber;
            if (_this.isInLineView(pos)) {
                if (isDown) {
                    _this.moveRange(currentIndex - lastIndex);
                }
                _this.pos = pos;
            } else {
                _this.pos = null;
            }
            _this.forceUpdate(false, true);
            lastIndex = currentIndex;
        };
        overCanvas.addEventListener('touchstart', touchstart);
        overCanvas.addEventListener('touchend', touchend);
        overCanvas.addEventListener('touchcancel', touchcancel);
        overCanvas.addEventListener('touchmove', touchmove);
    }
}

function drawHairLine() {
    var pos = this.pos;
    if (!pos) {
        return;
    }
    var overCtx = this.overCtx;
    var mainView = this.mainView,
        mainYaxisView = this.mainYaxisView,
        aidView = this.aidView,
        aidYaxisView = this.aidYaxisView,
        timeView = this.timeView;

    var _state$range4 = _slicedToArray(this.state.range, 2),
        startIndex = _state$range4[0],
        endIndex = _state$range4[1];

    var startIndex1 = Math.floor(startIndex) - 1 < 0 ? 0 : Math.floor(startIndex) - 1;
    var endIndex1 = Math.ceil(endIndex) + 1;

    var verticalRectNumber = endIndex - startIndex;

    var currentIndex = Math.floor((pos.x - aidView.x) / aidView.w * verticalRectNumber + startIndex);
    //const x = currentIndex * aidView.w / verticalRectNumber + aidView.w / verticalRectNumber * 0.5 + mainView.x;
    var x = pos.x;
    var y = pos.y;

    // overCtx.clearRect(0, 0, this.width, this.height);
    if (currentIndex >= this.state.times.length || currentIndex < 0) {
        return;
    }

    overCtx.lineWidth = this.dpr;
    overCtx.strokeStyle = this.colors.hairLine;

    overCtx.beginPath();
    overCtx.moveTo(x, this.height);
    overCtx.lineTo(x, 0);
    overCtx.stroke();

    overCtx.beginPath();
    overCtx.moveTo(0, y);
    overCtx.lineTo(this.width, y);
    overCtx.stroke();

    // x轴坐标
    var currentTime = this.option.overTimeFilter(this.state.times[currentIndex]);
    overCtx.textAlign = 'center';
    overCtx.textBaseline = 'middle';
    overCtx.fillStyle = this.colors.background;
    overCtx.fillRect(x - overCtx.measureText(currentTime).width * 0.5 - 10, timeView.y + this.dpr, overCtx.measureText(currentTime).width + 20, timeView.h - this.dpr * 2);
    overCtx.strokeStyle = this.colors.splitLine;
    overCtx.strokeRect(x - overCtx.measureText(currentTime).width * 0.5 - 10, timeView.y + this.dpr, overCtx.measureText(currentTime).width + 20, timeView.h - this.dpr * 2);
    overCtx.fillStyle = this.colors.currentTextColor;
    overCtx.fillText(currentTime, x, timeView.h * 0.5 + timeView.y);

    // 画y轴坐标

    var _computAxis2 = this.computAxis(),
        max = _computAxis2.max,
        min = _computAxis2.min;

    var view = mainYaxisView;
    var w = this.width - view.x;
    overCtx.textAlign = 'right';
    overCtx.textBaseline = 'middle';
    overCtx.fillStyle = this.colors.background;
    overCtx.fillRect(view.x + this.dpr, y - 10 * this.dpr, w - 2 * this.dpr, 20 * this.dpr);
    overCtx.strokeStyle = this.colors.splitLine;
    overCtx.strokeRect(view.x + this.dpr, y - 10 * this.dpr, w - 2 * this.dpr, 20 * this.dpr);
    overCtx.fillStyle = this.colors.textColor;

    overCtx.textAlign = 'center';
    overCtx.fillStyle = this.colors.currentTextColor;
    if (this.isInLineView(pos) === mainView) {
        var yText = max - (max - min) * (y - view.y) / view.h;
        overCtx.fillText(this.string(yText), mainYaxisView.x + mainYaxisView.w * 0.5, y);
    } else {
        view = aidYaxisView;
        if (this.option.aidCsi === 'volume') {
            var _yText = (1 - (y - view.y) / view.h) * (this.csiYaxisSector[0] - this.csiYaxisSector[1]);
            overCtx.fillText(this.string(_yText), mainYaxisView.x + mainYaxisView.w * 0.5, y);
        } else {
            var _yText2 = this.csiYaxisSector[1] * (y - view.y) / view.h + this.csiYaxisSector[0] * (1 - (y - view.y) / view.h);
            overCtx.fillText(this.string(_yText2), mainYaxisView.x + mainYaxisView.w * 0.5, y);
        }
    }

    var basicSelectOption = {
        time: this.state.times[currentIndex],
        start: this.state.start[currentIndex],
        hi: this.state.hi[currentIndex],
        lo: this.state.lo[currentIndex],
        close: this.state.close[currentIndex],
        volume: this.state.volume[currentIndex]
    };
    var selectOption = _extends({}, basicSelectOption);
    if (this.option.mainCsi === 'ma') {
        selectOption = _extends({}, selectOption, {
            ma7: this.state.ma7[currentIndex],
            ma30: this.state.ma30[currentIndex]
        });
    } else if (this.option.mainCsi === 'ema') {
        selectOption = _extends({}, selectOption, {
            ema7: this.state.ema7[currentIndex],
            ema30: this.state.ema30[currentIndex]
        });
    } else if (this.option.mainCsi === 'boll') {
        selectOption = _extends({}, selectOption, {
            up: this.state.up[currentIndex],
            mb: this.state.mb[currentIndex],
            dn: this.state.dn[currentIndex]
        });
    }

    this.select(selectOption, 0);

    if (this.option.aidCsi === 'volume') {
        this.select({
            volume: this.state.volume[currentIndex],
            ma7: this.state.volumeMa7[currentIndex],
            ma30: this.state.volumeMa30[currentIndex]
        }, 1);
    }
    if (this.option.aidCsi === 'macd') {
        this.select({
            dif: this.state.dif[currentIndex],
            dea: this.state.dea[currentIndex],
            macd: this.state.macd[currentIndex]
        }, 1);
    }
    if (this.option.aidCsi === 'kdj') {
        this.select({
            k: this.state.k[currentIndex],
            d: this.state.d[currentIndex],
            j: this.state.j[currentIndex]
        }, 1);
    }
    if (this.option.aidCsi === 'dmi') {
        this.select({
            pdi: this.state.pdi[currentIndex],
            mdi: this.state.mdi[currentIndex],
            adx: this.state.adx[currentIndex],
            adxr: this.state.adxr[currentIndex]
        }, 1);
    }
    if (this.option.aidCsi === 'dma') {
        this.select({
            dmaDif: this.state.dmaDif[currentIndex],
            dmaDifma: this.state.dmaDifma[currentIndex]
        }, 1);
    }
    if (this.option.aidCsi === 'trix') {
        this.select({
            trix: this.state.trix[currentIndex],
            matrix: this.state.matrix[currentIndex]
        }, 1);
    }
    if (this.option.aidCsi === 'brar') {
        this.select({
            br: this.state.br[currentIndex],
            ar: this.state.ar[currentIndex]
        }, 1);
    }
    if (this.option.aidCsi === 'vr') {
        this.select({
            vr: this.state.vr[currentIndex],
            mavr: this.state.mavr[currentIndex]
        }, 1);
    }
    if (this.option.aidCsi === 'obv') {
        this.select({
            obv: this.state.obv[currentIndex],
            maobv: this.state.maobv[currentIndex]
        }, 1);
    }
    if (this.option.aidCsi === 'rsi') {
        this.select({
            rsi6: this.state.rsi6[currentIndex],
            rsi12: this.state.rsi12[currentIndex],
            rsi24: this.state.rsi24[currentIndex]
        }, 1);
    }
}