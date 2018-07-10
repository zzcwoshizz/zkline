function toInt(num) {
    return ~~(0.5 + num);
}
export default function drawMain(yaxis) {
    const ctx = this.ctx;

    const times = this.state.times;
    const timeStr = this.state.timeStr;
    const start = this.state.start;
    const hi = this.state.hi;
    const lo = this.state.lo;
    const close = this.state.close;


    const { max, min, maxPrice, maxPriceIndex, minPrice, minPriceIndex, intervalY } = yaxis;

    const mainView = this.mainView;
    const mainYaxisView = this.mainYaxisView;
    const timeView = this.timeView;

    const startIndex1 = Math.floor(this.state.range[0]) - 1 < 0 ? 0 : Math.floor(this.state.range[0]) - 1;
    const endIndex1 = Math.ceil(this.state.range[1]) + 1;
    const [startIndex, endIndex] = this.state.range;
    const verticalRectNumber = endIndex - startIndex;

    if (this.option.timelineVisible) {
        this.drawTimeline();
    }

    // 蜡烛线
    if (this.option.type === 'candle') {
        ctx.lineWidth = this.dpr;
        ctx.strokeStyle = this.colors.redColor;
        ctx.fillStyle = this.colors.redColor;
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= times.length) {
                break;
            }
            if (close[i] > start[i] || i < 0) {
                continue;
            }
            let x = (j + 0.1 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            let y = (max - Math.max(start[i], close[i])) / (max - min) * mainView.h + mainView.y;
            let w = mainView.w / verticalRectNumber * 0.8;
            let h = (Math.max(start[i], close[i]) - Math.min(start[i], close[i])) / (max - min) * mainView.h;
            x = toInt(x);
            y = toInt(y);
            w = toInt(w);
            h = toInt(h);
            ctx.fillRect(x, y, w, h < this.dpr ? this.dpr : h);
            let x1 = (j + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            let y1 = (max - hi[i]) / (max - min) * mainView.h + mainView.y;
            let x2 = x1;
            let y2 = (max - lo[i]) / (max - min) * mainView.h + mainView.y;
            x1 = toInt(x1);
            y1 = toInt(y1);
            x2 = toInt(x2);
            y2 = toInt(y2);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        ctx.strokeStyle = this.colors.greenColor;
        ctx.fillStyle = this.colors.greenColor;
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= times.length) {
                break;
            }
            if (close[i] <= start[i] || i < 0) {
                continue;
            }
            let x = (j + 0.1 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            let y = (max - Math.max(start[i], close[i])) / (max - min) * mainView.h + mainView.y;
            let w = mainView.w / verticalRectNumber * 0.8;
            let h = (Math.max(start[i], close[i]) - Math.min(start[i], close[i])) / (max - min) * mainView.h;
            x = toInt(x);
            y = toInt(y);
            w = toInt(w);
            h = toInt(h);
            if (w <= this.dpr * 2) {
                ctx.fillRect(x, y, w, h < this.dpr ? this.dpr : h);
            } else {
                if (this.option.theme === 'dark') {
                    // ctx.strokeRect(x + this.dpr, y + this.dpr, w - this.dpr, h < this.dpr ? this.dpr : (h - this.dpr));
                    ctx.fillRect(x + this.dpr, y + this.dpr, w - this.dpr, h < this.dpr ? this.dpr : (h - this.dpr));
                } else {
                    ctx.fillRect(x, y, w, h < this.dpr ? this.dpr : h);
                }
            }
            let x1 = (j + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            let y1 = (max - hi[i]) / (max - min) * mainView.h + mainView.y;
            let x2 = x1;
            let y2 = (max - lo[i]) / (max - min) * mainView.h + mainView.y;
            x1 = toInt(x1);
            y1 = toInt(y1);
            x2 = toInt(x2);
            y2 = toInt(y2);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2, y + h);
            ctx.stroke();
        }

        // 画最高点，最低点
        ctx.fillStyle = this.colors.textColor;
        ctx.textBaseline = 'middle';
        let index = (maxPriceIndex - startIndex);
        let index1 = (minPriceIndex - startIndex);
        let maxX = mainView.w / verticalRectNumber * 0.5 + (index + 0.1) * mainView.w / verticalRectNumber + mainView.x;
        let maxY = (max - maxPrice) / (max - min) * mainView.h + mainView.y;
        let minX = mainView.w / verticalRectNumber * 0.5 + (index1 + 0.1) * mainView.w / verticalRectNumber + mainView.x;
        let minY = (max - minPrice) / (max - min) * mainView.h + mainView.y;
        maxX = toInt(maxX);
        maxY = toInt(maxY);
        minX = toInt(minX);
        minY = toInt(minY);
        if (index < verticalRectNumber * 0.5) {
            ctx.textAlign = 'left';
            ctx.fillText(' ← ' + this.string(maxPrice), maxX, maxY);
        } else {
            ctx.textAlign = 'right';
            ctx.fillText(this.string(maxPrice) + ' → ', maxX, maxY);
        }
        if (index1 < verticalRectNumber * 0.5) {
            ctx.textAlign = 'left';
            ctx.fillText(' ← ' + this.string(minPrice), minX, minY);
        } else {
            ctx.textAlign = 'right';
            ctx.fillText(this.string(minPrice) + ' → ', minX, minY);
        }
    } else if (this.option.type === 'line') {
        ctx.beginPath();
        ctx.strokeStyle = this.colors.lightColor;
        ctx.lineWidth = 2 * this.dpr;
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= times.length) {
                break;
            }
            let x = (j + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            let y = (max - this.state.close[i]) / (max - min) * mainView.h + mainView.y;
            x = toInt(x);
            y = toInt(y);
            if (j == 0) {
                ctx.moveTo(x, y);
            }
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    ctx.lineWidth = this.dpr;

    if (this.option.mainCsi === 'ma') {
        // ma30
        ctx.beginPath();
        ctx.strokeStyle = this.colors.ma30Color;
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= times.length) {
                break;
            }
            let x = (j + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            let y = (max - this.state.ma30[i]) / (max - min) * mainView.h + mainView.y;
            x = toInt(x);
            y = toInt(y);
            if (j == 0) {
                ctx.moveTo(x, y);
            }
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // ma7
        ctx.beginPath();
        ctx.strokeStyle = this.colors.ma7Color;
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= this.state.times.length) {
                break;
            }
            let x = (j + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            let y = (max - this.state.ma7[i]) / (max - min) * mainView.h + mainView.y;
            x = toInt(x);
            y = toInt(y);
            if (j == 0) {
                ctx.moveTo(x, y);
            }
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    } else if (this.option.mainCsi === 'ema') {
        // ema30
        ctx.beginPath();
        ctx.strokeStyle = this.colors.ma30Color;
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= times.length) {
                break;
            }
            let x = (j + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            let y = (max - this.state.ema30[i]) / (max - min) * mainView.h + mainView.y;
            x = toInt(x);
            y = toInt(y);
            if (j == 0) {
                ctx.moveTo(x, y);
            }
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // ema7
        ctx.beginPath();
        ctx.strokeStyle = this.colors.ma7Color;
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= times.length) {
                break;
            }
            let x = (j + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            let y = (max - this.state.ema7[i]) / (max - min) * mainView.h + mainView.y;
            x = toInt(x);
            y = toInt(y);
            if (j == 0) {
                ctx.moveTo(x, y);
            }
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    } else if (this.option.mainCsi === 'boll') {
        // UP
        ctx.beginPath();
        ctx.strokeStyle = this.colors.ma30Color;
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= times.length) {
                break;
            }
            let x = (j + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            let y = (max - this.state.up[i]) / (max - min) * mainView.h + mainView.y;
            x = toInt(x);
            y = toInt(y);
            if (j == 0) {
                ctx.moveTo(x, y);
            }
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // MB
        ctx.beginPath();
        ctx.strokeStyle = this.colors.ma7Color;
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= times.length) {
                break;
            }
            let x = (j + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            let y = (max - this.state.mb[i]) / (max - min) * mainView.h + mainView.y;
            x = toInt(x);
            y = toInt(y);
            if (j == 0) {
                ctx.moveTo(x, y);
            }
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // DN
        ctx.beginPath();
        ctx.strokeStyle = this.colors.macdColor;
        for (let i = startIndex1, j = 0; i < endIndex1; i++, j++) {
            if (i >= times.length) {
                break;
            }
            let x = (j + 0.5 + startIndex1 - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            let y = (max - this.state.dn[i]) / (max - min) * mainView.h + mainView.y;
            x = toInt(x);
            y = toInt(y);
            if (j == 0) {
                ctx.moveTo(x, y);
            }
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    } else if (this.option.mainCsi === 'sar') {
        ctx.strokeStyle = this.colors.macdColor;
        for (let i = startIndex, j = 0; j < verticalRectNumber; i++, j++) {
            if (i >= times.length) {
                break;
            }
            let x = j * mainView.w / verticalRectNumber + 0.5 * mainView.w / verticalRectNumber + mainView.x;
            let y = (max - this.state.sar[i]) / (max - min) * mainView.h + mainView.y;
            x = toInt(x);
            y = toInt(y);
            ctx.beginPath();
            ctx.arc(x, y, mainView.w / verticalRectNumber / 6, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // y轴刻度数值 y轴刻度线
    ctx.fillStyle = this.colors.background;
    ctx.fillRect(mainYaxisView.x, 0, mainYaxisView.w, mainYaxisView.h + mainYaxisView.y);
    ctx.fillStyle = this.colors.textColor;
    ctx.strokeStyle = this.colors.splitLine;
    ctx.lineWidth = this.dpr * 0.5;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let lengthY = (max - min) / intervalY;
    for (let i = 0; i < lengthY; i++) {

        let x = mainYaxisView.x + mainYaxisView.w * 0.5;
        let y = i * intervalY / (max - min) * mainYaxisView.h + mainYaxisView.y;
        x = toInt(x);
        y = toInt(y);
        if (y > mainYaxisView.y + mainYaxisView.h - 10) {
            break;
        }
        ctx.fillText(this.string(max - (i * intervalY)), x, y);
    }
    ctx.lineWidth = this.dpr;
    ctx.strokeStyle = this.colors.textColor;
    for (let i = 0; i < lengthY; i++) {
        let x = mainYaxisView.x;
        let y = i * intervalY / (max - min) * mainYaxisView.h + mainYaxisView.y;
        if (y > mainYaxisView.y + mainYaxisView.h - 10) {
            break;
        }
        x = toInt(x);
        y = toInt(y);
        ctx.beginPath();
        ctx.moveTo(x + 5 * this.dpr, y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.width, y);
        ctx.lineTo(this.width - 5 * this.dpr, y);
        ctx.stroke();
    }


    // 当前价格
    ctx.fillStyle = this.colors.currentPriceColor;
    ctx.beginPath();
    var yTemp = (max - close[close.length - 1]) / (max - min) * mainView.h + mainView.y;
    // ctx.moveTo(mainYaxisView.x, yTemp);
    // ctx.lineTo(mainYaxisView.x + mainYaxisView.w * 0.15, yTemp - 12 * this.dpr);
    // ctx.lineTo(mainYaxisView.x + mainYaxisView.w, yTemp - 12 * this.dpr);
    // ctx.lineTo(mainYaxisView.x + mainYaxisView.w, yTemp + 12 * this.dpr);
    // ctx.lineTo(mainYaxisView.x + mainYaxisView.w * 0.15, yTemp + 12 * this.dpr);
    // ctx.closePath();
    // ctx.fill();
    // ctx.strokeStyle = this.colors.textFrameColor;
    // ctx.strokeRect(mainYaxisView.x + this.dpr, (max - close[close.length - 1]) / (max - min) * mainView.h + mainView.y - 10 * this.dpr, mainYaxisView.w - 2 * this.dpr, 20 * this.dpr);
    // ctx.textAlign = 'center';
    // ctx.fillStyle = this.colors.currentTextColor;
    // ctx.fillText(this.string(close[close.length - 1]), mainYaxisView.x + mainYaxisView.w * 0.5, yTemp);
    ctx.fillStyle = this.colors.currentTextColor;
    ctx.textAlign = 'left';
    ctx.fillText('← ' + this.string(close[close.length - 1]), mainYaxisView.x, yTemp);
}
