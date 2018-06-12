"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = drawDepth;
function drawDepth(yaxis) {
    var ctx = this.ctx;
    var mainYaxisView = this.mainYaxisView;

    var max = yaxis.max,
        min = yaxis.min;


    var depth = this.option.depth;
    var bidsPrice = [];
    var asksPrice = [];
    var bidsVolume = [];
    var asksVolume = [];
    depth.bids.forEach(function (el) {
        if (el[0] < min) {
            return;
        }
        bidsPrice.push(parseFloat(el[0]));
        bidsVolume.push(parseFloat(el[1]));
    });
    depth.asks.forEach(function (el) {
        if (el[0] > max) {
            return;
        }
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

    var maxVolume = Math.max(bidsDepth.length > 0 && bidsDepth[bidsDepth.length - 1], asksDepth.length > 0 && asksDepth[asksDepth.length - 1]);
    var n = (maxVolume * 0.2).toFixed(0).length;
    var interval = Math.ceil(maxVolume * 0.2 / Math.pow(10, n - 1)) * Math.pow(10, n - 1);
    var yAxis = [];
    for (var _i2 = interval; _i2 < maxVolume; _i2 += interval) {
        yAxis.unshift(_i2);
    }

    ctx.lineWidth = this.dpr;

    var lastX = void 0,
        lastY = void 0;
    var lineargradient = void 0;
    if (asksPrice.length > 0) {
        var p1 = (asksPrice[asksPrice.length - 1] - asksPrice[0]) / (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]);
        ctx.beginPath();
        for (var _i3 = 0; _i3 < asksDepth.length; _i3++) {
            var x = asksDepth[_i3] / maxVolume * mainYaxisView.w + mainYaxisView.x;
            var y = (max - asksPrice[_i3]) / (max - min) * mainYaxisView.h + mainYaxisView.y;
            if (_i3 === 0) {
                ctx.moveTo(mainYaxisView.x, y);
                ctx.lineTo(x, y);
            } else {
                ctx.lineTo(x, lastY);
                ctx.lineTo(x, y);
            }
            lastX = x;
            lastY = y;
        }
        ctx.lineTo(this.width, lastY);
        ctx.lineTo(this.width, 0);
        ctx.strokeStyle = this.colors.greenColor;
        ctx.stroke();
        ctx.lineTo(mainYaxisView.x, 0);
        ctx.closePath();
        lineargradient = ctx.createLinearGradient(this.width, 0, this.mainYaxisView.x, 0);
        lineargradient.addColorStop(0, this.colors.greenColorBackground);
        lineargradient.addColorStop(1, this.colors.greenColorBackground1);
        ctx.fillStyle = lineargradient;
        ctx.fill();
    }

    if (bidsPrice.length > 0) {
        var p2 = (bidsPrice[0] - bidsPrice[bidsPrice.length - 1]) / (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]);
        ctx.beginPath();
        for (var _i4 = 0; _i4 < bidsDepth.length; _i4++) {
            var _x = bidsDepth[_i4] / maxVolume * mainYaxisView.w + mainYaxisView.x;
            var _y = (max - bidsPrice[_i4]) / (max - min) * mainYaxisView.h + mainYaxisView.y;
            if (_i4 === 0) {
                ctx.moveTo(mainYaxisView.x, _y);
                ctx.lineTo(_x, _y);
            } else {
                ctx.lineTo(_x, lastY);
                ctx.lineTo(_x, _y);
            }
            lastX = _x;
            lastY = _y;
        }
        ctx.lineTo(this.width, lastY);
        ctx.lineTo(this.width, mainYaxisView.y + mainYaxisView.h);
        ctx.strokeStyle = this.colors.redColor;
        ctx.stroke();
        ctx.lineTo(mainYaxisView.x, mainYaxisView.y + mainYaxisView.h);
        ctx.closePath();
        lineargradient = ctx.createLinearGradient(this.width, this.height, this.mainYaxisView.x, this.height);
        lineargradient.addColorStop(0, this.colors.redColorBackground);
        lineargradient.addColorStop(1, this.colors.redColorBackground1);
        ctx.fillStyle = lineargradient;
        ctx.fill();
    }
}