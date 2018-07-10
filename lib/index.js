import * as tslib_1 from "tslib";
import setStyle from './utils/setStyle';
import Chart from './Chart';
var defaultOptions = {
    dpr: 1,
};
var KLine = /** @class */ (function () {
    function KLine(ele, options) {
        // 初始化根元素
        this._initElement(ele);
        // 设置options
        this._setOptions(options);
        // 设置style
        this._setStyle();
        // 添加图表
        var chart1 = new Chart(this.width, this.height, {
            position: 'absolute',
            top: 0,
            left: 0,
        });
        this._appendChart(chart1);
        var chart2 = new Chart(this.width, this.height, {
            position: 'absolute',
            top: 0,
            left: 0,
        });
        this._appendChart(chart2);
    }
    KLine.prototype._initElement = function (ele) {
        this.ele = ele;
        this.width = ele.clientWidth;
        this.height = ele.clientHeight;
    };
    KLine.prototype._setOptions = function (options) {
        if (!options.hasOwnProperty('background')) {
            throw new Error('Must has property background');
        }
        this.options = tslib_1.__assign({}, defaultOptions, options);
    };
    KLine.prototype._setStyle = function () {
        setStyle(this.ele, {
            background: this.options.background,
            position: 'relative',
        });
    };
    KLine.prototype._appendChart = function (chart) {
        this.charts.push(chart);
    };
    return KLine;
}());
export { KLine };
//# sourceMappingURL=index.js.map