Date.prototype.format = function(fmt) {
    if (this == 'Invalid Date') {
        return '';
    }
    var o = {
        'M+': this.getMonth() + 1,
        'D+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    };
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : ('00' + o[k]).substr(('' + o[k]).length)
            );
        }
    }
    return fmt;
};
export default function setOption(option = {}) {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    let data = option.data;
    if (this.option) {
        const lastPeriod = this.option.period;
        const lastSymbol = this.option.symbol;
        let lastData = this.option.data;
        this.option = {
            theme: option.theme || this.option.theme,
            fontSize: option.fontSize || this.option.fontSize,
            type: option.type || this.option.type,
            mainCsi: option.mainCsi || this.option.mainCsi,
            aidCsi: option.aidCsi || this.option.aidCsi,
            timeFilter: option.timeFilter || this.option.timeFilter,
            overTimeFilter: option.overTimeFilter || this.option.overTimeFilter,
            priceDecimal: option.priceDecimal || this.option.priceDecimal,
            data: (data || this.option.data).map(d => d),
            period: option.period || this.option.period,
            symbol: option.symbol || this.option.symbol,
            colors: option.colors || this.option.colors,
            depth: option.depth || this.option.depth,
            timelineVisible:
                option.timelineVisible === undefined
                    ? this.option.timelineVisible
                    : option.timelineVisible,
            showDepth:
                option.showDepth === undefined
                    ? this.option.showDepth
                    : option.showDepth,
            intl: option.intl === undefined ? this.option.intl : option.intl
        };
        const lastRange = this.state.range;
        init.call(this, option);
        if (
            lastPeriod === this.option.period &&
            lastSymbol === this.option.symbol
        ) {
            if (lastRange[1] === lastData.length) {
                this.state.range = [
                    lastRange[0] + data.length - lastData.length,
                    data.length
                ];
            } else {
                this.state.range = lastRange;
            }
        }
    } else {
        this.option = {
            theme: option.theme || 'dark',
            fontSize: option.fontSize || 12,
            type: option.type || 'candle',
            mainCsi: option.mainCsi || 'ema',
            aidCsi: option.aidCsi,
            timeFilter:
                option.timeFilter ||
                (t => new Date(t * 1000).toString('M/d/yyyy')),
            overTimeFilter:
                option.overTimeFilter ||
                (t => new Date(t * 1000).toString('M/d/yyyy')),
            priceDecimal:
                option.priceDecimal === undefined ? 0 : option.priceDecimal,
            data: (data || []).map(d => d),
            period: option.period || 60 * 60,
            symbol: option.symbol,
            colors: option.colors || {},
            depth: option.depth || { asks: [], bids: [] },
            timelineVisible:
                option.timelineVisible === undefined ? true : false,
            showDepth: option.showDepth === undefined ? false : true,
            intl: option.intl === undefined ? 'en' : option.intl
        };

        init.call(this, option);
    }
}

function init() {
    this.device = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
        ? 'mb'
        : 'pc';
    // 设置全局色彩
    const isDarkTheme = this.option.theme === 'dark';
    const colors = this.option.colors;
    this.colors = {
        // background: colors.background || '#0e2029',
        background: colors.background || (isDarkTheme ? '#0e2029' : '#ebf5fa'),
        splitLine: colors.splitLine || (isDarkTheme ? '#33434b' : '#c2cacf'),
        lightColor: colors.lightColor || (isDarkTheme ? '#ddd' : '#666'),
        textColor: colors.textColor || (isDarkTheme ? '#878f94' : '#333'),
        currentTextColor:
            colors.currentTextColor || (isDarkTheme ? '#cad8e0' : '#000'),
        hairLine: colors.hairLine || (isDarkTheme ? '#33434b' : '#d3dbe0'),
        lineColor: colors.lineColor || (isDarkTheme ? '#ccc' : '#666'),
        lineHilightColor:
            colors.lineHilightColor || (isDarkTheme ? '#fff' : '#000'),
        currentPriceColor:
            colors.currentPriceColor || (isDarkTheme ? '#132733' : '#132733'),
        greenColor: colors.greenColor || (isDarkTheme ? '#d11e37' : '#d11d38'),
        redColor: colors.redColor || (isDarkTheme ? '#66d430' : '#68d12c'),
        greenColorBackground:
            colors.greenColorBackground ||
            (isDarkTheme ? 'rgba(102,212,48,0.3)' : 'rgba(104,209,44,0.3)'),
        greenColorBackground1:
            colors.greenColorBackground1 ||
            (isDarkTheme ? 'rgba(102,212,48,0.05)' : 'rgba(104,209,44,0.05)'),
        redColorBackground:
            colors.redColorBackground ||
            (isDarkTheme ? 'rgba(209,30,55,0.3)' : 'rgba(209,29,56,0.3)'),
        redColorBackground1:
            colors.redColorBackground1 ||
            (isDarkTheme ? 'rgba(209,30,55,0.05)' : 'rgba(209,29,56,0.05)'),
        ma30Color:
            colors.ma30Color ||
            (isDarkTheme ? 'rgb(234, 177, 103)' : 'rgb(234, 177, 103)'),
        ma7Color:
            colors.ma7Color ||
            (isDarkTheme ? 'rgb(166, 206, 227)' : 'rgb(59, 187, 59)'),
        macdColor:
            colors.macdColor ||
            (isDarkTheme ? 'rgb(208, 146, 209)' : 'rgb(208, 146, 209)'),
        kColor:
            colors.kColor ||
            (isDarkTheme ? 'rgb(234, 177, 103)' : 'rgb(234, 177, 103)'),
        dColor:
            colors.dColor ||
            (isDarkTheme ? 'rgb(166, 206, 227)' : 'rgb(59, 187, 59)'),
        jColor:
            colors.jColor ||
            (isDarkTheme ? 'rgb(208, 146, 209)' : 'rgb(208, 146, 209)'),
        dmaDifColor:
            colors.dmaDifColor || (isDarkTheme ? '#d1d1d1' : '#69d2b7'),
        dmaDifmaColor:
            colors.dmaDifmaColor || (isDarkTheme ? '#eae348' : '#f6bc33'),
        pdiColor: colors.pdiColor || (isDarkTheme ? '#d1d1d1' : '#69d2b7'),
        mdiColor: colors.mdiColor || (isDarkTheme ? '#eae348' : '#f6bc33'),
        adxColor: colors.adxColor || (isDarkTheme ? '#db18f1' : '#dc65bf'),
        adxrColor: colors.adxrColor || (isDarkTheme ? '#72aff0' : '#3d7dc9'),
        matrixColor:
            colors.matrixColor ||
            (isDarkTheme ? 'rgb(234, 177, 103)' : 'rgb(234, 177, 103)'),
        trixColor:
            colors.trixColor ||
            (isDarkTheme ? 'rgb(166, 206, 227)' : 'rgb(59, 187, 59)'),
        arColor:
            colors.arColor ||
            (isDarkTheme ? 'rgb(234, 177, 103)' : 'rgb(234, 177, 103)'),
        brColor:
            colors.brColor ||
            (isDarkTheme ? 'rgb(166, 206, 227)' : 'rgb(59, 187, 59)'),
        vrColor:
            colors.vrColor ||
            (isDarkTheme ? 'rgb(234, 177, 103)' : 'rgb(234, 177, 103)'),
        mavrColor:
            colors.mavrColor ||
            (isDarkTheme ? 'rgb(166, 206, 227)' : 'rgb(59, 187, 59)'),
        obvColor:
            colors.obvColor ||
            (isDarkTheme ? 'rgb(234, 177, 103)' : 'rgb(234, 177, 103)'),
        maobvColor:
            colors.maobvColor ||
            (isDarkTheme ? 'rgb(166, 206, 227)' : 'rgb(59, 187, 59)'),
        rsi6Color:
            colors.kColor ||
            (isDarkTheme ? 'rgb(234, 177, 103)' : 'rgb(234, 177, 103)'),
        rsi12Color:
            colors.dColor ||
            (isDarkTheme ? 'rgb(166, 206, 227)' : 'rgb(59, 187, 59)'),
        rsi24Color:
            colors.jColor ||
            (isDarkTheme ? 'rgb(208, 146, 209)' : 'rgb(208, 146, 209)')
    };

    this.ctx = this.canvas.getContext('2d');
    this.overCtx = this.overCanvas.getContext('2d');
    this.ctx.font =
        this.option.fontSize * this.dpr +
        'px Consolas, Monaco, monospace, sans-serif';
    this.overCtx.font =
        this.option.fontSize * this.dpr +
        'px Consolas, Monaco, monospace, sans-serif';

    const yAxisWidth = this.setData();

    const left = 0 * this.dpr;
    const right = 0 * this.dpr;
    const top = 20 * this.dpr;
    const bottom = 20 * this.dpr;
    const middle = 0 * this.dpr;

    const width = this.width;
    const height = this.height;

    if (!this.option.aidCsi) {
        this.proportion = 1;
    } else {
        this.proportion = 0.7;
    }

    let mainView = {
        x: left,
        y: top,
        w: width - yAxisWidth - left - right - middle,
        h: (height - top - bottom) * this.proportion
    };
    let mainYaxisView = {
        x: mainView.w + mainView.x + middle,
        y: mainView.y,
        w: yAxisWidth,
        h: mainView.h
    };
    let aidView = {
        x: mainView.x,
        y: mainView.y + mainView.h,
        w: mainView.w,
        h: (height - top - bottom) * (1 - this.proportion)
    };
    let aidYaxisView = {
        x: mainYaxisView.x,
        y: aidView.y,
        w: yAxisWidth,
        h: aidView.h
    };
    let timeView = {
        x: mainView.x,
        y: aidView.y + aidView.h,
        w: aidView.x + aidView.w + middle,
        h: bottom
    };
    this.mainView = mainView;
    this.mainYaxisView = mainYaxisView;
    this.aidView = aidView;
    this.aidYaxisView = aidYaxisView;
    this.timeView = timeView;

    this.maxVerticalRectNumber =
        parseInt(mainView.w / this.dpr / 2) % 2 === 0
            ? parseInt(mainView.w / this.dpr / 2)
            : parseInt(mainView.w / this.dpr / 2) + 1;
    this.minVerticalRectNumber = 30;
    this.force = [true, true];

    this.lines = [this.lines || []].length === 0 ? [] : this.lines || [];
    this.lineCache = this.lineCache || null;
    this.mousePos = {};

    if (this.option.intl === 'en') {
        this.text = {
            time: 'time',
            start: 'O',
            hi: 'H',
            lo: 'L',
            close: 'C',
            volume: 'VOLUME'
        };
    } else {
        this.text = {
            time: '时间',
            start: '开',
            hi: '高',
            lo: '低',
            close: '收',
            volume: '量'
        };
    }
}
