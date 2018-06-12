'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Depth;
function Depth(canvas, data) {
    var _this = this;

    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    this.device = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) ? 'mb' : 'pc';
    this.dpr = canvas.width / canvas.getBoundingClientRect().width;
    this.canvas = canvas;
    this.setOption(option);
    this.data = data;

    canvas.addEventListener('mousemove', function (e) {
        _this.pos = _this.getMousePos(e);
        _this.forceUpdate();
    });
    this.forceUpdate();
    this.draw();
}

Depth.prototype.setOption = function (option) {
    if (this.option) {
        this.option = {
            theme: option.theme || this.option.theme,
            fontSize: option.fontSize || this.option.fontSize,
            priceDecimal: option.priceDecimal === undefined ? this.option.priceDecimal : option.priceDecimal
        };
    } else {
        this.option = {
            theme: option.theme || 'dark',
            fontSize: option.fontSize || 14,
            priceDecimal: option.priceDecimal === undefined ? 0 : option.priceDecimal
        };
    }
    this.ctx = this.canvas.getContext('2d');
    this.ctx.font = this.dpr * this.option.fontSize + 'px Consolas, Monaco, monospace, sans-serif';
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.colors = {
        background: this.option.theme === 'dark' ? '#0e2029' : '#ebf5fa',
        fontColor: this.option.theme === 'dark' ? '#878f94' : '#666',
        splitColor: this.option.theme === 'dark' ? '#878f94' : '#666',
        greenColor: this.option.theme === 'dark' ? 'rgb(138,224,63)' : 'rgb(138,224,63)',
        greenBackgroundColor: this.option.theme === 'dark' ? 'rgba(138,224,63,.24)' : 'rgba(138,224,63,.24)',
        redColor: this.option.theme === 'dark' ? 'rgb(209,29,32)' : 'rgb(209,29,32)',
        redBackgroundColor: this.option.theme === 'dark' ? 'rgba(209,29,32,.24)' : 'rgba(209,29,32,.24)',
        lineColor: this.option.theme === 'dark' ? '#33434b' : '#c2cacf'
    };
    this.forceUpdate();
};

Depth.prototype.forceUpdate = function () {
    this.force = true;
};

Depth.prototype.draw = function () {
    if (!this.force) {
        requestAnimationFrame(this.draw.bind(this));
        return;
    }
    var bottom = 20 * this.dpr;
    var width = this.width;
    var height = this.height;
    var contentWidth = width;
    var contentHeight = height - bottom;
    var data = this.data;
    var ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);

    var bidsPrice = [];
    var asksPrice = [];
    var bidsVolume = [];
    var asksVolume = [];
    data.bids.forEach(function (el) {
        bidsPrice.push(parseFloat(el[0]));
        bidsVolume.push(parseFloat(el[1]));
    });
    data.asks.forEach(function (el) {
        asksPrice.push(parseFloat(el[0]));
        asksVolume.push(parseFloat(el[1]));
    });

    var bidsDepth = [];
    for (var i = 0; i < bidsVolume.length; i++) {
        if (i === 0) {
            bidsDepth[i] = parseFloat(bidsVolume[i]);
            continue;
        }
        bidsDepth[i] = bidsDepth[i - 1] + parseFloat(bidsVolume[i]);
    }

    var asksDepth = [];
    for (var _i = 0; _i < asksVolume.length; _i++) {
        if (_i === 0) {
            asksDepth[_i] = parseFloat(asksVolume[_i]);
            continue;
        }
        asksDepth[_i] = asksDepth[_i - 1] + parseFloat(asksVolume[_i]);
    }

    var maxVolume = Math.max(bidsDepth[bidsDepth.length - 1], asksDepth[asksDepth.length - 1]) * 1.2;
    var n = (maxVolume * 0.2).toFixed(0).length;
    var interval = Math.ceil(maxVolume * 0.2 / Math.pow(10, n - 1)) * Math.pow(10, n - 1);
    var yAxis = [];
    for (var _i2 = interval; _i2 < maxVolume; _i2 += interval) {
        yAxis.unshift(_i2);
    }

    ctx.lineWidth = this.dpr;
    ctx.fillStyle = this.colors.background;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = this.colors.lineColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.stroke();

    // 买单
    var p1 = (bidsPrice[0] - bidsPrice[bidsPrice.length - 1]) / (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]);
    ctx.lineWidth = this.dpr * 2;
    ctx.beginPath();
    var lastX = void 0,
        lastY = void 0;
    for (var _i3 = 0; _i3 < bidsDepth.length; _i3++) {
        var p = (bidsPrice[_i3] - bidsPrice[bidsPrice.length - 1]) / (bidsPrice[0] - bidsPrice[bidsPrice.length - 1]);
        var x = contentWidth * p1 * p;
        var y = contentHeight - bidsDepth[_i3] / maxVolume * contentHeight;
        if (_i3 === 0) {
            ctx.moveTo(x, contentHeight);
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, lastY);
            ctx.lineTo(x, y);
        }
        lastX = contentWidth * p1 * p;
        lastY = contentHeight - bidsDepth[_i3] / maxVolume * contentHeight;
    }
    ctx.strokeStyle = this.colors.greenColor;
    ctx.stroke();
    ctx.lineTo(0, contentHeight);
    ctx.closePath();
    ctx.fillStyle = this.colors.greenBackgroundColor;
    ctx.fill();

    ctx.lineWidth = this.dpr;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var _i4 = 0; _i4 < bidsDepth.length; _i4++) {
        var _p = (bidsPrice[_i4] - bidsPrice[bidsPrice.length - 1]) / (bidsPrice[0] - bidsPrice[bidsPrice.length - 1]);
        var _x2 = contentWidth * p1 * _p;
        var _y = contentHeight - bidsDepth[_i4] / maxVolume * contentHeight;
        if (this.pos && this.pos.x <= lastX && this.pos.x > _x2) {
            ctx.beginPath();
            ctx.arc(this.pos.x, lastY, 4 * this.dpr, 0, Math.PI * 2, true);
            ctx.fillStyle = this.colors.greenColor;
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = this.colors.fontColor;
            if (lastY > contentHeight * 0.5) {
                ctx.strokeStyle = this.colors.splitColor;
                ctx.beginPath();
                ctx.moveTo(this.pos.x, 0);
                ctx.lineTo(this.pos.x, (lastY - 10 * this.dpr) * 0.5 - 10 * this.dpr);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.pos.x, (lastY - 10 * this.dpr) * 0.5 + 10 * this.dpr);
                ctx.lineTo(this.pos.x, lastY - 10 * this.dpr);
                ctx.stroke();
                ctx.fillText(this.string(bidsPrice[_i4]), this.pos.x, (lastY - 10 * this.dpr) * 0.5);

                ctx.beginPath();
                ctx.moveTo(this.pos.x, contentHeight);
                ctx.lineTo(this.pos.x, lastY + 10 * this.dpr > contentHeight ? contentHeight : lastY + 10 * this.dpr);
                ctx.strokeStyle = this.colors.greenColor;
                ctx.stroke();
            } else {
                ctx.strokeStyle = this.colors.splitColor;
                ctx.beginPath();
                ctx.moveTo(this.pos.x, 0);
                ctx.lineTo(this.pos.x, lastY - 10 * this.dpr);
                ctx.stroke();

                var lineY = lastY + 10 * this.dpr > contentHeight ? contentHeight : lastY + 10 * this.dpr;
                var textY = (contentHeight + lineY) * 0.5;
                ctx.beginPath();
                ctx.strokeStyle = this.colors.greenColor;
                ctx.moveTo(this.pos.x, contentHeight);
                ctx.lineTo(this.pos.x, textY + 10 * this.dpr);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.pos.x, textY - 10 * this.dpr);
                ctx.lineTo(this.pos.x, lineY);
                ctx.stroke();
                ctx.fillText(this.string(bidsPrice[_i4]), this.pos.x, textY);
            }
        }
        lastX = contentWidth * p1 * _p;
        lastY = contentHeight - bidsDepth[_i4] / maxVolume * contentHeight;
    }

    // 卖单
    var p2 = (asksPrice[asksPrice.length - 1] - asksPrice[0]) / (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]);
    ctx.beginPath();
    ctx.lineWidth = this.dpr * 2;
    for (var _i5 = 0; _i5 < asksPrice.length; _i5++) {
        var _p2 = (asksPrice[_i5] - asksPrice[0]) / (asksPrice[asksPrice.length - 1] - asksPrice[0]);
        var _x3 = contentWidth * (1 - p2) + contentWidth * p2 * _p2;
        var _y2 = contentHeight - asksDepth[_i5] / maxVolume * contentHeight;
        if (_i5 === 0) {
            ctx.moveTo(_x3, contentHeight);
            ctx.lineTo(_x3, _y2);
        } else {
            ctx.lineTo(_x3, lastY);
            ctx.lineTo(_x3, _y2);
        }
        lastX = contentWidth * (1 - p2) + contentWidth * p2 * _p2;
        lastY = contentHeight - asksDepth[_i5] / maxVolume * contentHeight;
    }
    ctx.strokeStyle = this.colors.redColor;
    ctx.stroke();
    ctx.lineTo(contentWidth, contentHeight);
    ctx.closePath();
    ctx.fillStyle = this.colors.redBackgroundColor;
    ctx.fill();

    ctx.lineWidth = this.dpr;
    for (var _i6 = 0; _i6 < asksPrice.length; _i6++) {
        var _p3 = (asksPrice[_i6] - asksPrice[0]) / (asksPrice[asksPrice.length - 1] - asksPrice[0]);
        var _x4 = contentWidth * (1 - p2) + contentWidth * p2 * _p3;
        var _y3 = contentHeight - asksDepth[_i6] / maxVolume * contentHeight;
        if (this.pos && this.pos.x >= lastX && this.pos.x < _x4) {
            ctx.beginPath();
            ctx.arc(this.pos.x, lastY, 4 * this.dpr, 0, Math.PI * 2, true);
            ctx.fillStyle = this.colors.redColor;
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = this.colors.fontColor;
            if (lastY > contentHeight * 0.5) {
                ctx.strokeStyle = this.colors.splitColor;
                ctx.beginPath();
                ctx.moveTo(this.pos.x, 0);
                ctx.lineTo(this.pos.x, (lastY - 10 * this.dpr) * 0.5 - 10 * this.dpr);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.pos.x, (lastY - 10 * this.dpr) * 0.5 + 10 * this.dpr);
                ctx.lineTo(this.pos.x, lastY - 10 * this.dpr);
                ctx.stroke();
                ctx.fillText(this.string(asksPrice[_i6]), this.pos.x, (lastY - 10 * this.dpr) * 0.5);

                ctx.beginPath();
                ctx.moveTo(this.pos.x, contentHeight);
                ctx.lineTo(this.pos.x, lastY + 10 * this.dpr > contentHeight ? contentHeight : lastY + 10 * this.dpr);
                ctx.strokeStyle = this.colors.redColor;
                ctx.stroke();
            } else {
                ctx.strokeStyle = this.colors.splitColor;
                ctx.beginPath();
                ctx.moveTo(this.pos.x, 0);
                ctx.lineTo(this.pos.x, lastY - 10 * this.dpr);
                ctx.stroke();

                var _lineY = lastY + 10 * this.dpr > contentHeight ? contentHeight : lastY + 10 * this.dpr;
                var _textY = (contentHeight + _lineY) * 0.5;
                ctx.beginPath();
                ctx.strokeStyle = this.colors.redColor;
                ctx.moveTo(this.pos.x, contentHeight);
                ctx.lineTo(this.pos.x, _textY + 10 * this.dpr);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.pos.x, _textY - 10 * this.dpr);
                ctx.lineTo(this.pos.x, _lineY);
                ctx.stroke();
                ctx.fillText(this.string(asksPrice[_i6]), this.pos.x, _textY);
            }
        }
        lastX = contentWidth * (1 - p2) + contentWidth * p2 * _p3;
        lastY = contentHeight - asksDepth[_i6] / maxVolume * contentHeight;
    }

    // y轴刻度
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.colors.fontColor;
    ctx.strokeStyle = this.colors.splitColor;
    for (var _i7 = interval; _i7 < maxVolume; _i7 += interval) {
        var _y4 = contentHeight - contentHeight * _i7 / maxVolume;
        ctx.fillText(this.string(_i7), 12 * this.dpr, _y4);
        ctx.beginPath();
        ctx.moveTo(0, _y4);
        ctx.lineTo(8 * this.dpr, _y4);
        ctx.stroke();
    }
    ctx.textAlign = 'right';
    for (var _i8 = interval; _i8 < maxVolume; _i8 += interval) {
        var _y5 = contentHeight - contentHeight * _i8 / maxVolume;
        ctx.fillText(this.string(_i8), width - 12 * this.dpr, _y5);
        ctx.beginPath();
        ctx.moveTo(width, _y5);
        ctx.lineTo(width - 8 * this.dpr, _y5);
        ctx.stroke();
    }

    n = 0;
    if (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1] >= 1) {
        n = (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]).toFixed(0).length;
    } else {
        if (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1] < 0.000001) {
            var str = ((asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]) * 100000).toString().split('.')[1] || '';
            for (var _i9 = 0; _i9 < str.length; _i9++) {
                if (str.charAt(_i9) == 0) {
                    n--;
                }
            }
            n -= 5;
        } else {
            var _str = (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]).toString().split('.')[1];
            for (var _i10 = 0; _i10 < _str.length; _i10++) {
                if (_str.charAt(_i10) == 0) {
                    n--;
                }
            }
        }
    }
    var number = 0.15;
    var intervalX = Math.ceil((asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]) * number / Math.pow(10, n - 2)) * Math.pow(10, n - 2);
    ctx.fillStyle = this.colors.fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (var _i11 = bidsPrice[bidsPrice.length - 1] + intervalX; _i11 < asksPrice[asksPrice.length - 1]; _i11 += intervalX) {
        ctx.fillText(this.string(_i11), (_i11 - bidsPrice[bidsPrice.length - 1]) / (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]) * contentWidth, contentHeight);
    }

    if (this.force) {
        this.force = false;
    }
    requestAnimationFrame(this.draw.bind(this));
};