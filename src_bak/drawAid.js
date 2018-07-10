function toInt(num) {
    return ~~(0.5 + num);
}
export default function drawAid() {
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
    const ctx = this.ctx;
    const aidView = this.aidView;
    const aidYaxisView = this.aidYaxisView;
    const [startIndex, endIndex] = this.state.range;
    const startIndex1 = Math.floor(startIndex) - 1 < 0 ? 0 : Math.floor(startIndex) - 1;
    const endIndex1 = Math.ceil(endIndex) + 1;
    const verticalRectNumber = endIndex - startIndex;

    const realVolume = [];
    const realVolumeMa7 = [];
    const realVolumeMa30 = [];
    this.state.volume.forEach((el, i) => {
        if (i >= startIndex1 && i < endIndex1) {
            realVolume.push(el);
            realVolumeMa7.push(this.state.volumeMa7[i]);
            realVolumeMa30.push(this.state.volumeMa30[i]);
        }
    });
    const maxVolume = Math.max(...realVolume, ...realVolumeMa7, ...realVolumeMa30) * 1.25;
    this.csiYaxisSector = [maxVolume, 0];

    let n = 0;
    if (maxVolume >= 1) {
        n = maxVolume.toFixed(0).length;
    } else {
        if (maxVolume < 0.000001) {
            let str = (maxVolume * 100000).toString().split('.')[1] || '';
            for (let i = 0; i < str.length; i++) {
                if (str.charAt(i) == 0) {
                    n--;
                }
            }
            n -= 5;
        } else {
            let str = maxVolume.toString().split('.')[1] || '';
            for (let i = 0; i < str.length; i++) {
                if (str.charAt(i) == 0) {
                    n--;
                }
            }
        }
    }
    const interval = Math.ceil(maxVolume * 0.25 / Math.pow(10, n - 2)) * Math.pow(10, n - 2);
    const yAxis = [];
    for (let i = interval; i < maxVolume; i += interval) {
        yAxis.unshift(i);
    }

    ctx.fillStyle = this.colors.greenColor;
    ctx.strokeStyle = this.colors.greenColor;
    for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
        if (i >= this.state.times.length) {
            break;
        }
        if (i < 0) {
            continue;
        }
        if (this.state.start[i] < this.state.close[i]) {
            let x = (j + 0.1 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
            let w = aidView.w / verticalRectNumber * 0.8;
            let h = -this.state.volume[i] / maxVolume * aidView.h;
            let y = aidView.y + aidView.h;
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
    for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
        if (i >= this.state.times.length) {
            break;
        }
        if (i < 0) {
            continue;
        }
        if (this.state.close[i] <= this.state.start[i]) {
            let x = (j + 0.1 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
            let w = aidView.w / verticalRectNumber * 0.8;
            let h = -this.state.volume[i] / maxVolume * aidView.h;
            let y = aidView.y + aidView.h;
            ctx.fillRect(x, y, w, h);
        }
    }

    //if (this.option.mainCsi === 'ma') {
    if (false) {
        ctx.beginPath();
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= this.state.times.length) {
                break;
            }
            if (i < 0) {
                continue;
            }
            ctx.strokeStyle = this.colors.ma30Color;
            let x = (j + 0.5 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
            let y = (maxVolume - this.state.volumeMa30[i]) / maxVolume * aidView.h + aidView.y;
            if (j == 0) {
                ctx.moveTo(x, y);
            }
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.beginPath();
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= this.state.times.length) {
                break;
            }
            if (i < 0) {
                continue;
            }
            ctx.strokeStyle = this.colors.ma7Color;
            let x = (j + 0.5 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
            let y = (maxVolume - this.state.volumeMa7[i]) / maxVolume * aidView.h + aidView.y;
            if (j == 0) {
                ctx.moveTo(x, y);
            }
            ctx.lineTo(x, y);
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
    for (let i = 0; i < yAxis.length; i++) {
        ctx.fillText(this.string(yAxis[i]), aidYaxisView.x + aidYaxisView.w * 0.5, aidYaxisView.y + aidYaxisView.h - yAxis[i] / maxVolume * aidYaxisView.h);
    }

    ctx.lineWidth = this.dpr;
    ctx.strokeStyle = this.colors.textColor;
    for (let i = 0; i < yAxis.length; i++) {
        let x = aidYaxisView.x;
        let y = aidYaxisView.y + aidYaxisView.h - yAxis[i] / maxVolume * aidYaxisView.h;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 10, y);
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
    const ctx = this.ctx;
    const [startIndex, endIndex] = this.state.range;
    const startIndex1 = Math.floor(startIndex) - 1 < 0 ? 0 : Math.floor(startIndex) - 1;
    const endIndex1 = Math.ceil(endIndex) + 1;
    const verticalRectNumber = endIndex - startIndex;
    const aidView = this.aidView;
    const aidYaxisView = this.aidYaxisView;

    let max = 0;
    let min = 0;
    this.state.macd.forEach((el, i) => {
        if (i < startIndex1 || i >= endIndex1) {
            return;
        }
        let val = Math.max(el, this.state.dif[i], this.state.dea[i]);
        max = max > val ? max : val;
        val = Math.min(el, this.state.dif[i], this.state.dea[i]);
        min = min < val ? min : val;
    });
    max = (max > Math.abs(min) ? max : Math.abs(min)) * 1.25;
    this.csiYaxisSector = [max, -max];
    const yAxis = [max, max * 2 / 3, max / 3, -max / 3, -max * 2 / 3, -max];

    ctx.lineWidth = this.dpr;
    ctx.fillStyle = this.colors.greenColor;
    ctx.strokeStyle = this.colors.greenColor;
    for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
        if (i >= this.state.times.length) {
            break;
        }
        if (i < 0) {
            continue;
        }
        if (this.state.macd[i] > 0) {
            let y = aidView.y + aidView.h * 0.5;
            let w = aidView.w / verticalRectNumber * 0.8;
            let x = (j + 0.1 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
            let h = -this.state.macd[i] / max * aidView.h * 0.5;
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
    for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
        if (i >= this.state.times.length) {
            break;
        }
        if (i < 0) {
            continue;
        }
        if (this.state.macd[i] <= 0) {
            let y = aidView.y + aidView.h * 0.5;
            let w = aidView.w / verticalRectNumber * 0.8;
            let x = (j + 0.1 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x + w * 0.1;
            let h = -this.state.macd[i] / max * aidView.h * 0.5;
            if (Math.abs(this.state.macd[i]) > Math.abs(this.state.macd[i - 1])) {
                ctx.fillRect(x, y, w, h);
            } else {
                if (w <= this.dpr * 2) {
                    ctx.fillRect(x, y, w, h);
                } else {
                    ctx.strokeRect(x + this.dpr, y + this.dpr, w - this.dpr, h - this.dpr);
                }
            }
        }
    }

    // dif
    ctx.strokeStyle = this.colors.ma7Color;
    ctx.beginPath();
    for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
        if (i >= this.state.times.length) {
            break;
        }
        if (i < 0) {
            continue;
        }
        let x = (j + 0.5 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
        let y = (max - this.state.dif[i]) / (2 * max) * aidView.h + aidView.y;
        if (j === 0) {
            ctx.moveTo(x, y);
            continue;
        }
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    // dea
    ctx.strokeStyle = this.colors.ma30Color;
    ctx.beginPath();
    for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
        if (i >= this.state.times.length) {
            break;
        }
        if (i < 0) {
            continue;
        }
        let x = (j + 0.5 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
        let y = (max - this.state.dea[i]) / (2 * max) * aidView.h + aidView.y;
        if (j === 0) {
            ctx.moveTo(x, y);
            continue;
        }
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = this.colors.background;
    ctx.fillRect(aidYaxisView.x, aidYaxisView.y, aidYaxisView.w, this.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.colors.textColor;
    ctx.strokeStyle = this.colors.splitLine;
    ctx.lineWidth = this.dpr * 0.5;
    for (let i = 1; i < yAxis.length - 1; i++) {
        ctx.fillText(this.string(yAxis[i]), aidYaxisView.x + aidYaxisView.w * 0.5, aidYaxisView.y + i / (yAxis.length - 1) * aidYaxisView.h);
    }
}

function drawLine(keys) {
    const ctx = this.ctx;
    const [startIndex, endIndex] = this.state.range;
    const startIndex1 = Math.floor(startIndex) - 1 < 0 ? 0 : Math.floor(startIndex) - 1;
    const endIndex1 = Math.ceil(endIndex) + 1;
    const verticalRectNumber = endIndex - startIndex;
    const aidView = this.aidView;
    const aidYaxisView = this.aidYaxisView;

    let max = 0;
    let min = 0;
    this.state[keys[0]].forEach((el, i) => {
        if (i < startIndex1 || i >= endIndex1) {
            return;
        }
        let params = keys.map(key => this.state[key][i]);
        let val = Math.max(...params);
        max = max > val ? max : val;
        val = Math.min(...params);
        min = min < val ? min : val;
    });
    max *= 1.1;
    this.csiYaxisSector = [max, min];

    const cha = max - min;

    let n = 0;
    if (cha >= 1) {
        n = cha.toFixed(0).length;
    } else {
        if (cha < 0.000001) {
            let str = (cha * 100000).toString().split('.')[1] || '';
            for (let i = 0; i < str.length; i++) {
                if (str.charAt(i) == 0) {
                    n--;
                }
            }
            n -= 5;
        } else {
            let str = cha.toString().split('.')[1] || '';
            for (let i = 0; i < str.length; i++) {
                if (str.charAt(i) == 0) {
                    n--;
                }
            }
        }
    }
    const interval = Math.ceil(cha * 0.25 / Math.pow(10, n - 2)) * Math.pow(10, n - 2);
    const yAxis = [];
    for (let i = 0; i < max; i += interval) {
        yAxis.unshift(i);
    }

    ctx.lineWidth = this.dpr;
    ctx.strokeStyle = this.colors.textColor;
    for (let i = 0; i < yAxis.length; i++) {
        let x = aidYaxisView.x;
        let y = aidYaxisView.y + (max - yAxis[i]) / cha * aidYaxisView.h;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 10, y);
        ctx.stroke();
    }

    keys.forEach(key => {
        ctx.strokeStyle = this.colors[key + 'Color'];
        ctx.beginPath();
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= this.state.times.length) {
                break;
            }
            if (i < 0) {
                continue;
            }
            let x = (j + 0.5 + startIndex1 - startIndex) * aidView.w / verticalRectNumber + aidView.x;
            let y = (max - this.state[key][i]) / cha * aidView.h + aidView.y;
            if (j == 0) {
                ctx.moveTo(x, y);
            }
            ctx.lineTo(x, y);
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
    for (let i = 0; i < yAxis.length; i++) {
        ctx.fillText(this.string(yAxis[i]), aidYaxisView.x + aidYaxisView.w * 0.5, aidYaxisView.y + (max - yAxis[i]) / cha * aidYaxisView.h);
    }
}
