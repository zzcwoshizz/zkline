'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = computAxis;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// 计算最大价格，最小价格，y轴显示的价格差
function computAxis() {
    var start = this.state.start;
    var hi = this.state.hi;
    var lo = this.state.lo;
    var close = this.state.close;
    var ma30 = this.state.ma30;
    var ma7 = this.state.ma7;
    var ema30 = this.state.ema30;
    var ema7 = this.state.ema7;
    var up = this.state.up;
    var mb = this.state.mb;
    var dn = this.state.dn;
    var startIndex = Math.floor(this.state.range[0]) - 1 < 0 ? 0 : Math.floor(this.state.range[0]) - 1;
    var endIndex = Math.ceil(this.state.range[1]) + 1;
    var maxY = hi[startIndex];
    var minY = lo[startIndex];
    var maxPrice = hi[startIndex];
    var minPrice = lo[startIndex];
    var maxPriceIndex = startIndex;
    var minPriceIndex = startIndex;
    var mainCsi = this.option.mainCsi;
    for (var i = startIndex; i < endIndex; i++) {
        if (i >= this.state.times.length) {
            break;
        }
        var csi = [];
        if (mainCsi === 'ma') {
            csi = [ma30[i], ma7[i]];
        } else if (mainCsi === 'ema') {
            csi = [ema30[i], ema7[i]];
        } else if (mainCsi === 'boll') {
            csi = [up[i], mb[i], dn[i]];
        }
        var maxVal = Math.max.apply(Math, [start[i], hi[i], lo[i], close[i]].concat(_toConsumableArray(csi)));
        var minVal = Math.min.apply(Math, [start[i], hi[i], lo[i], close[i]].concat(_toConsumableArray(csi)));
        maxY = maxVal > maxY ? maxVal : maxY;
        minY = minVal < minY ? minVal : minY;
        var maxPriceVal = hi[i];
        var minPriceVal = lo[i];
        if (maxPriceVal > maxPrice) {
            maxPriceIndex = i;
            maxPrice = maxPriceVal;
        }
        if (minPriceVal < minPrice) {
            minPriceIndex = i;
            minPrice = minPriceVal;
        }
    }
    if (maxY === minY) {
        maxY = maxY * 1.1;
        minY = minY / 1.1;
    }
    var cha = maxY - minY;
    var n = 0;
    if (cha >= 1) {
        n = cha.toFixed(0).length;
    } else {
        if (cha < 0.000001) {
            var str = (cha * 100000).toString().split('.')[1] || '';
            for (var _i = 0; _i < str.length; _i++) {
                if (str.charAt(_i) == 0) {
                    n--;
                }
            }
            n -= 5;
        } else {
            var _str = cha.toString().split('.')[1] || '';
            for (var _i2 = 0; _i2 < _str.length; _i2++) {
                if (_str.charAt(_i2) == 0) {
                    n--;
                }
            }
        }
    }
    var intervalY = Math.ceil((maxY - minY) * 0.2 / Math.pow(10, n - 2)) * Math.pow(10, n - 2);
    return {
        maxY: maxY,
        minY: minY,
        maxPrice: maxPrice,
        maxPriceIndex: maxPriceIndex,
        minPrice: minPrice,
        minPriceIndex: minPriceIndex,
        max: maxY + intervalY - maxY % intervalY,
        min: minY - minY % intervalY,
        intervalY: intervalY
    };
}