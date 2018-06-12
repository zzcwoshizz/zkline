'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (data, flag) {
    var overCtx = this.overCtx;
    overCtx.textAlign = 'left';
    overCtx.textBaseline = 'top';
    transformKey = transformKey.bind(this);
    if (flag === 0) {
        var x = 5;
        var y = 5;
        for (var i = 0; i < Object.keys(data).length; i++) {
            var key = Object.keys(data)[i];
            var text = void 0;
            if (key === 'time') {
                text = this.text.time + ':' + this.option.overTimeFilter(data[key]);
            } else {
                text = transformKey(key) + '：' + this.string(data[key]);
            }
            if (overCtx.measureText(text).width + x + 40 > this.mainView.x + this.mainView.w) {
                x = 5;
                y += 40;
            }
            setStyle.call(this, key, overCtx);
            overCtx.fillText(text, x, y);
            x += overCtx.measureText(text).width + 40;
        }
    } else if (flag === 1) {
        var _x = 5;
        var _y = this.aidView.y;
        for (var _i = 0; _i < Object.keys(data).length; _i++) {
            var _key = Object.keys(data)[_i];
            var _text = transformKey(_key) + '：' + this.string(data[_key]);
            if (overCtx.measureText(_text).width + _x + 40 > this.mainView.x + this.mainView.w) {
                _x = 5;
                _y += 40;
            }
            setStyle.call(this, _key, overCtx);
            overCtx.fillText(_text, _x, _y);
            _x += overCtx.measureText(_text).width + 40;
        }
    }
};

function transformKey(key) {
    if (key === 'time') {
        return this.text.time;
    } else if (key === 'start') {
        return this.text.start;
    } else if (key === 'hi') {
        return this.text.hi;
    } else if (key === 'lo') {
        return this.text.lo;
    } else if (key === 'close') {
        return this.text.close;
    } else if (key === 'volume') {
        return this.text.volume;
    } else if (key === 'dmaDif') {
        return 'DIF';
    } else if (key === 'dmaDifma') {
        return 'DIFMA';
    } else {
        return String(key).toUpperCase();
    }
}

function setStyle(key, ctx) {
    if (key === 'ema7' || key === 'ma7' || key === 'dif' || key === 'mb' || key === 'k') {
        ctx.fillStyle = this.colors.ma7Color;
    } else if (key === 'ema30' || key === 'ma30' || key === 'dea' || key === 'up' || key === 'd') {
        ctx.fillStyle = this.colors.ma30Color;
    } else if (key === 'macd' || key === 'dn' || key === 'j') {
        ctx.fillStyle = this.colors.macdColor;
    } else {
        ctx.fillStyle = this.colors[key + 'Color'] || this.colors.textColor;
    }
}