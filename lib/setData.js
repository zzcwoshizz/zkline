"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = setData;
function ma(close, param) {
    return close.map(function (el, i) {
        if (i < param - 1) {
            return el;
        } else {
            var sum = 0;
            for (var index = i; index > i - param; index--) {
                sum += close[index];
            }
            return sum / param;
        }
    });
}

function ema(close, param) {
    var ema = [];
    close.forEach(function (el, i) {
        if (i < param - 1) {
            ema[i] = el;
        } else {
            var val = 2 / param * (close[i] - ema[i - 1]) + ema[i - 1];
            ema[i] = val;
        }
    });
    return ema;
}

function setData() {
    var _this = this;

    var maxLength = -1;
    var data = this.option.data;
    var times = [];
    var start = [];
    var hi = [];
    var lo = [];
    var close = [];
    var volume = [];
    data.forEach(function (d) {
        if (String(d[0]).length === 10) {
            times.push(d[0]);
        } else if (String(d[0].length === 13)) {
            times.push(parseInt(d[0] / 1000));
        }
        start.push(d[1]);
        hi.push(d[2]);
        lo.push(d[3]);
        close.push(d[4]);
        volume.push(d[5]);
        maxLength = Math.max(maxLength, _this.string(d[1]).length, _this.string(d[2]).length, _this.string(d[3]).length, _this.string(d[4]).length, _this.string(d[5]).length);
    });
    this.state = {
        times: times,
        start: start,
        hi: hi,
        lo: lo,
        close: close,
        volume: volume,
        ma7: ma(close, 7),
        ma10: ma(close, 10),
        ma12: ma(close, 12),
        ma20: ma(close, 20),
        ma30: ma(close, 30),
        ma50: ma(close, 50),
        volumeMa7: ma(volume, 7),
        volumeMa30: ma(volume, 30),
        isDown: false,
        range: data.length > 74 ? [data.length + 10 - 84, data.length + 10] : [-10, 74]
    };
    this.state.ema30 = ema(close, 30);
    this.state.ema7 = ema(close, 7);
    this.state.ema15 = ema(close, 15);
    this.state.ema26 = ema(close, 26);
    this.state.ema12 = ema(close, 12);
    this.state.dif = this.state.ema12.map(function (el, i) {
        var val = el - _this.state.ema26[i];
        return val;
    });
    this.state.dea = [];
    this.state.dif.forEach(function (el, i) {
        if (i === 0) {
            _this.state.dea[i] = el;
        } else {
            var val = _this.state.dea[i - 1] * 0.8 + el * 0.2;
            _this.state.dea[i] = val;
        }
    });
    this.state.macd = this.state.dif.map(function (el, i) {
        var val = (el - _this.state.dea[i]) * 2;
        var macd = val;
        maxLength = Math.max(maxLength, _this.string(macd).length);
        return macd;
    });

    // 计算BOLL
    this.state.up = [];
    this.state.mb = [];
    this.state.dn = [];
    this.state.ma20.forEach(function (el, i) {
        if (i === 0) {
            _this.state.mb.push(_this.state.ma20[i]);
            _this.state.up.push(_this.state.ma20[i]);
            _this.state.dn.push(_this.state.ma20[i]);
            return;
        }
        var sum = 0;
        for (var index = i < 20 ? 0 : i - 20; index < i; index++) {
            sum += Math.pow(_this.state.close[index] - _this.state.ma20[index], 2);
        }
        var md = Math.sqrt(sum / (i < 20 ? i : 20));
        _this.state.mb.push(_this.state.ma20[i - 1]);
        _this.state.up.push(_this.state.ma20[i - 1] + 2 * md);
        _this.state.dn.push(_this.state.ma20[i - 1] - 2 * md);
    });

    // 计算kdj
    this.state.k = [];
    this.state.d = [];
    this.state.j = [];
    this.state.close.forEach(function (el, i) {
        var h = _this.state.hi[i - 8 < 0 ? 0 : i - 8];
        var l = _this.state.lo[i - 8 < 0 ? 0 : i - 8];
        var defaultIndex = i - 8 < 0 ? 0 : i - 8;
        for (var index = defaultIndex; index <= i; index++) {
            l = Math.min(_this.state.lo[index], l);
            h = Math.max(_this.state.hi[index], h);
        }
        var rsv = void 0;
        if (h === l) {
            rsv = 100;
        } else {
            rsv = (el - l) / (h - l) * 100;
        }
        if (i === 0) {
            _this.state.k.push(100 / 3 + rsv / 3);
            _this.state.d.push(100 / 3 + _this.state.k[i] / 3);
            _this.state.j.push(3 * _this.state.k[i] - 2 * _this.state.d[i]);
            return;
        }
        _this.state.k.push(2 / 3 * _this.state.k[i - 1] + rsv / 3);
        _this.state.d.push(2 / 3 * _this.state.d[i - 1] + _this.state.k[i] / 3);
        _this.state.j.push(3 * _this.state.k[i] - 2 * _this.state.d[i]);
    });

    // 计算sar
    this.state.sar = [];
    var af = 0.02;
    for (var i = 0; i < times.length; i++) {
        if (i === 0) {
            this.state.sar.push(this.state.lo[i]);
            continue;
        }
        if (i === 1) {
            this.state.sar.push(this.state.hi[i]);
            continue;
        }
        var ep = void 0;
        if (this.state.close[i] > this.state.close[i - 1]) {
            ep = Math.max(this.state.hi[i - 1], this.state.hi[i - 2]);
        } else {
            ep = Math.min(this.state.lo[i - 1], this.state.lo[i - 2]);
        }
        if (this.state.close[i] > this.state.close[i - 1] && this.state.close[i - 1] > this.state.close[i - 2]) {
            if (Math.max(this.state.hi[i], this.state.hi[i - 1]) > Math.max(this.state.hi[i - 1], this.state.hi[i - 2])) {
                af = af + 0.02 > 0.2 ? 0.2 : af + 0.02;
            }
        } else if (this.state.close[i] <= this.state.close[i - 1] && this.state.close[i - 1] <= this.state.close[i - 2]) {
            if (Math.min(this.state.lo[i], this.state.lo[i - 1]) < Math.min(this.state.lo[i - 1], this.state.lo[i - 2])) {
                af = af + 0.02 > 0.2 ? 0.2 : af + 0.02;
            }
        } else {
            af = 0.02;
        }
        var preSar = this.state.sar[i - 1];
        var sar = preSar + af * (ep - preSar);
        if (this.state.close[i] > this.state.close[i - 1]) {
            if (sar > this.state.lo[i] || sar > this.state.lo[i - 1] || sar > this.state.lo[i - 2]) {
                sar = Math.min(this.state.lo[i], this.state.lo[i - 1], this.state.lo[i - 2]);
            }
        } else {
            if (sar < this.state.hi[i] || sar < this.state.hi[i - 1] || sar < this.state.hi[i - 2]) {
                sar = Math.max(this.state.hi[i], this.state.hi[i - 1], this.state.hi[i - 2]);
            }
        }
        this.state.sar.push(sar);
    }

    // 计算dmi
    var pdm = [];
    var mdm = [];
    var tr = [];
    var dx = [];
    this.state.pdi = [];
    this.state.mdi = [];
    this.state.adx = [];
    this.state.adxr = [];
    this.state.close.forEach(function (el, i) {
        if (i === 0) {
            pdm[i] = 0;
            mdm[i] = 0;
            tr[i] = _this.state.hi[i] - _this.state.lo[i];
        } else {
            pdm[i] = _this.state.hi[i] - _this.state.hi[i - 1];
            if (pdm[i] < 0) {
                pdm[i] = 0;
            }
            mdm[i] = _this.state.lo[i - 1] - _this.state.lo[i];
            if (mdm[i] < 0) {
                mdm[i] = 0;
            }
            tr[i] = Math.max(Math.abs(_this.state.hi[i] - _this.state.lo[i]), Math.abs(_this.state.hi[i] - _this.state.close[i - 1]), Math.abs(_this.state.lo[i] - _this.state.close[i - 1]));
        }
        var start = i - 14 < 0 ? 0 : i - 14;
        var pdmSum = 0.000001;
        var mdmSum = 0.000001;
        var trSum = 0.000001;
        var adxSum = 0.000001;
        for (var index = start; index < i; index++) {
            pdmSum += pdm[index];
            mdmSum += mdm[index];
            trSum += tr[index];
            if (index !== i - 1) {
                adxSum += dx[index];
            }
        }
        var n = i - start <= 0 ? 1 : i - start;
        _this.state.pdi[i] = pdmSum / n / (trSum / n) * 100;
        _this.state.mdi[i] = mdmSum / n / (trSum / n) * 100;
        dx[i] = Math.abs(_this.state.pdi[i] - _this.state.mdi[i]) / (_this.state.pdi[i] + _this.state.mdi[i]) * 100;
        adxSum += dx[i];
        _this.state.adx[i] = adxSum / n;
        if (i === 0) {
            _this.state.adxr[i] = _this.state.adx[i];
        } else {
            _this.state.adxr[i] = (_this.state.adx[i] + _this.state.adx[i - 14 < 0 ? 0 : i - 14]) / 2;
        }
    });

    // dma
    this.state.dmaDif = this.state.ma10.map(function (el, index) {
        return el - _this.state.ma50[index];
    });
    this.state.dmaDifma = ma(this.state.dmaDif, 10);

    // trix
    var trTem = ema(ema(ema(close, 12), 12), 12);
    this.state.trix = trTem.map(function (el, i) {
        if (i === 0) return 0;
        return (el - trTem[i - 1]) / trTem[i - 1] * 100;
    });
    this.state.matrix = ma(this.state.trix, 9);

    // brar
    this.state.ar = [];
    this.state.br = [];
    this.state.close.forEach(function (el, index) {
        var n = index;
        var sum = 0;
        var sum1 = 0;
        var sum2 = 0;
        var sum3 = 0;
        if (index === 0) {
            _this.state.ar.push(0);
            _this.state.br.push(0);
            return;
        }
        for (var _i = n - 25 < 0 ? 0 : n - 25; _i <= n; _i++) {
            var a = _this.state.hi[_i] - _this.state.start[_i];
            var b = _this.state.start[_i] - _this.state.lo[_i];
            sum += a < 0 ? 0 : a;
            sum1 += b < 0 ? 0 : b;
            var a1 = _this.state.hi[_i] - _this.state.close[_i - 1 < 0 ? 0 : _i - 1];
            var b1 = _this.state.close[_i - 1 < 0 ? 0 : _i - 1] - _this.state.lo[_i];
            sum2 += a1 < 0 ? 0 : a1;
            sum3 += b1 < 0 ? 0 : b1;
        }
        _this.state.ar.push(sum / sum1 * 100);
        _this.state.br.push(sum2 / sum3 * 100);
    });

    // vr
    this.state.vr = [];
    this.state.close.forEach(function (el, index) {
        var n = index;
        var uvs = 0;
        var dvs = 0;
        var pvs = 0;
        if (n === 0) {
            _this.state.vr.push(0);
            return;
        }
        for (var _i2 = n - 25 < 0 ? 0 : n - 25; _i2 <= n; _i2++) {
            if (_this.state.close[_i2] > _this.state.start[_i2]) {
                uvs += _this.state.volume[_i2];
            } else if (_this.state.close[_i2] < _this.state.start[_i2]) {
                dvs += _this.state.volume[_i2];
            } else {
                pvs += _this.state.volume[_i2];
            }
        }
        _this.state.vr.push(80 * (uvs + 0.5 * pvs) / (dvs + 0.5 * pvs));
    });
    this.state.mavr = ma(this.state.vr, 6);

    // obv
    this.state.obv = [];
    this.state.close.forEach(function (el, index) {
        if (index === 0) {
            _this.state.obv.push(_this.state.volume[0]);
            return;
        }
        var sgn = void 0;
        if (_this.state.close[index] >= _this.state.close[index - 1]) {
            sgn = 1;
        } else {
            sgn = -1;
        }
        _this.state.obv.push(_this.state.obv[index - 1] + sgn * _this.state.volume[index]);
    });
    this.state.maobv = ma(this.state.obv, 30);

    // rsi
    this.state.rsi6 = [];
    this.state.rsi12 = [];
    this.state.rsi24 = [];
    this.state.close.forEach(function (el, index) {
        if (index < 6) {
            _this.state.rsi6[index] = 0;
        } else {
            var a = 0;
            var b = 0;
            for (var _i3 = index - 6; _i3 < index; _i3++) {
                if (_this.state.close[_i3] - _this.state.start[_i3] < 0) {
                    b += _this.state.start[_i3] - _this.state.close[_i3];
                } else {
                    a += _this.state.close[_i3] - _this.state.start[_i3];
                }
            }
            if (a + b === 0) {
                _this.state.rsi6[index] = _this.state.rsi6[index - 1];
            } else {
                _this.state.rsi6[index] = a / (a + b) * 100;
            }
        }
        if (index < 12) {
            _this.state.rsi12[index] = 0;
        } else {
            var _a = 0;
            var _b = 0;
            for (var _i4 = index - 12; _i4 < index; _i4++) {
                if (_this.state.close[_i4] - _this.state.start[_i4] < 0) {
                    _b += _this.state.start[_i4] - _this.state.close[_i4];
                } else {
                    _a += _this.state.close[_i4] - _this.state.start[_i4];
                }
            }
            if (_a + _b === 0) {
                _this.state.rsi12[index] = _this.state.rsi12[index - 1];
            } else {
                _this.state.rsi12[index] = _a / (_a + _b) * 100;
            }
        }
        if (index < 24) {
            _this.state.rsi24[index] = 0;
        } else {
            var _a2 = 0;
            var _b2 = 0;
            for (var _i5 = index - 24; _i5 < index; _i5++) {
                if (_this.state.close[_i5] - _this.state.start[_i5] < 0) {
                    _b2 += _this.state.start[_i5] - _this.state.close[_i5];
                } else {
                    _a2 += _this.state.close[_i5] - _this.state.start[_i5];
                }
            }
            if (_a2 + _b2 === 0) {
                _this.state.rsi24[index] = _this.state.rsi24[index - 1];
            } else {
                _this.state.rsi24[index] = _a2 / (_a2 + _b2) * 100;
            }
        }
    });

    maxLength = maxLength > 15 ? 15 : maxLength;

    return Math.ceil(this.ctx.measureText(Math.pow(10, maxLength)).width + 10 * this.dpr);
}