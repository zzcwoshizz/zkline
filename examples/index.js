import { KLine, Depth } from '../lib/index.js';

var bodyWidth = document.body.clientWidth;
var bodyHeight = document.body.clientHeight;

var app = document.getElementById('app');
app.style.width = bodyWidth + 'px';
app.style.height = bodyHeight + 'px';
app.style.position = 'relative';

var canvas = document.createElement('canvas');
canvas.style.width = bodyWidth + 'px';
canvas.style.height = bodyHeight + 'px';
canvas.style.position = 'absolute';
canvas.width = bodyWidth * 2;
canvas.height = bodyHeight * 2;
var overCanvas = document.createElement('canvas');
overCanvas.style.width = bodyWidth + 'px';
overCanvas.style.height = bodyHeight + 'px';
overCanvas.style.position = 'absolute';
overCanvas.style.top = 0;
overCanvas.style.left = 0;
overCanvas.width = bodyWidth * 2;
overCanvas.height = bodyHeight * 2;

app.appendChild(canvas);
app.appendChild(overCanvas);

let period = '1day';
app.style.background = '#0e2029';
let chart = new KLine(canvas, overCanvas, {
    data: [],
    theme: 'dark',
    type: 'candle',
    period: '',
    symbol: '',
    mainCsi: 'ma',
    aidCsi: 'kdj',
    fontSize: 12,
    colors: {
        background: '#0e2029'
    },
    overTimeFilter: function(d) {
        return new Date(d * 1000);
    }
});

fetch(
    'https://api.huobipro.com/market/history/kline?period=' +
        period +
        '&size=200&symbol=btcusdt'
)
    .then(res => res.json())
    .then(json => {
        chart.setOption({
            data: json.data.map(d => {
                return [d.id, d.open, d.high, d.low, d.close, d.vol];
            }),
            period: period,
            mainCsi: 'ma',
            aidCsi: 'kdj',
            symbol: 'btcusdt'
        });
    });
