export default function Depth(canvas, data, option = {}) {
    this.device = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
        ? 'mb'
        : 'pc';
    this.dpr = canvas.width / canvas.getBoundingClientRect().width;
    this.canvas = canvas;
    this.setOption(option);
    this.data = data;

    canvas.addEventListener('mousemove', e => {
        this.pos = this.getMousePos(e);
        this.forceUpdate();
    });
    this.forceUpdate();
    this.draw();
}

Depth.prototype.setOption = function(option) {
    if (this.option) {
        this.option = {
            theme: option.theme || this.option.theme,
            fontSize: option.fontSize || this.option.fontSize,
            priceDecimal: option.priceDecimal === undefined ? this.option.priceDecimal : option.priceDecimal,
        }
    } else {
        this.option = {
            theme: option.theme || 'dark',
            fontSize: option.fontSize || 14,
            priceDecimal: option.priceDecimal === undefined ? 0 : option.priceDecimal,
        }
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
        lineColor: this.option.theme === 'dark' ? '#33434b' : '#c2cacf',
    };
    this.forceUpdate();
}

Depth.prototype.forceUpdate = function() {
    this.force = true;
}

Depth.prototype.draw = function() {
    if (!this.force) {
        requestAnimationFrame(this.draw.bind(this));
        return;
    }
    const bottom = 20 * this.dpr;
    const width = this.width;
    const height = this.height;
    const contentWidth = width;
    const contentHeight = height - bottom;
    const data = this.data;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);

    const bidsPrice = [];
    const asksPrice = [];
    const bidsVolume = [];
    const asksVolume = [];
    data.bids.forEach(el => {
        bidsPrice.push(parseFloat(el[0]));
        bidsVolume.push(parseFloat(el[1]));
    });
    data.asks.forEach(el => {
        asksPrice.push(parseFloat(el[0]));
        asksVolume.push(parseFloat(el[1]));
    });

    const bidsDepth = [];
    for (let i = 0; i < bidsVolume.length; i++) {
        if (i === 0) {
            bidsDepth[i] = parseFloat(bidsVolume[i]);
            continue;
        }
        bidsDepth[i] = bidsDepth[i - 1] + parseFloat(bidsVolume[i]);
    }

    const asksDepth = [];
    for (let i = 0; i < asksVolume.length; i++) {
        if (i === 0) {
            asksDepth[i] = parseFloat(asksVolume[i]);
            continue;
        }
        asksDepth[i] = asksDepth[i - 1] + parseFloat(asksVolume[i]);
    }

    const maxVolume = Math.max(bidsDepth[bidsDepth.length - 1], asksDepth[asksDepth.length - 1]) * 1.2;
    let n = (maxVolume * 0.2).toFixed(0).length;
    const interval = Math.ceil(maxVolume * 0.2 / Math.pow(10, n - 1)) * Math.pow(10, n - 1);
    const yAxis = [];
    for (let i = interval; i < maxVolume; i += interval) {
        yAxis.unshift(i);
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
    const p1 = (bidsPrice[0] - bidsPrice[bidsPrice.length - 1]) / (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]);
    ctx.lineWidth = this.dpr * 2;
    ctx.beginPath();
    let lastX, lastY;
    for (let i = 0; i < bidsDepth.length; i++) {
        const p = (bidsPrice[i] - bidsPrice[bidsPrice.length - 1]) / (bidsPrice[0] - bidsPrice[bidsPrice.length - 1]);
        const x = contentWidth * p1 * p
        const y = contentHeight - bidsDepth[i] / maxVolume * contentHeight;
        if (i === 0) {
            ctx.moveTo(x, contentHeight);
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, lastY);
            ctx.lineTo(x, y);
        }
        lastX = contentWidth * p1 * p;
        lastY = contentHeight - bidsDepth[i] / maxVolume * contentHeight;
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
    for (let i = 0; i < bidsDepth.length; i++) {
        const p = (bidsPrice[i] - bidsPrice[bidsPrice.length - 1]) / (bidsPrice[0] - bidsPrice[bidsPrice.length - 1]);
        const x = contentWidth * p1 * p
        const y = contentHeight - bidsDepth[i] / maxVolume * contentHeight;
        if (this.pos && this.pos.x <= lastX && this.pos.x > x) {
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
                ctx.fillText(this.string(bidsPrice[i]), this.pos.x, (lastY - 10 * this.dpr) * 0.5);

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

                let lineY = lastY + 10 * this.dpr > contentHeight ? contentHeight : lastY + 10 * this.dpr
                let textY = (contentHeight + lineY) * 0.5;
                ctx.beginPath();
                ctx.strokeStyle = this.colors.greenColor;
                ctx.moveTo(this.pos.x, contentHeight);
                ctx.lineTo(this.pos.x, textY + 10 * this.dpr);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.pos.x, textY - 10 * this.dpr)
                ctx.lineTo(this.pos.x, lineY);
                ctx.stroke();
                ctx.fillText(this.string(bidsPrice[i]), this.pos.x, textY);
            }
        }
        lastX = contentWidth * p1 * p;
        lastY = contentHeight - bidsDepth[i] / maxVolume * contentHeight;
    }


    // 卖单
    const p2 = (asksPrice[asksPrice.length - 1] - asksPrice[0]) / (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]);
    ctx.beginPath();
    ctx.lineWidth = this.dpr * 2;
    for (let i = 0; i < asksPrice.length; i++) {
        const p = (asksPrice[i] - asksPrice[0]) / (asksPrice[asksPrice.length - 1] - asksPrice[0]);
        const x = contentWidth * (1 - p2) + contentWidth * p2 * p;
        const y = contentHeight - asksDepth[i] / maxVolume * contentHeight;
        if (i === 0) {
            ctx.moveTo(x, contentHeight);
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, lastY);
            ctx.lineTo(x, y);
        }
        lastX = contentWidth * (1 - p2) + contentWidth * p2 * p;
        lastY = contentHeight - asksDepth[i] / maxVolume * contentHeight;
    }
    ctx.strokeStyle = this.colors.redColor;
    ctx.stroke();
    ctx.lineTo(contentWidth, contentHeight);
    ctx.closePath();
    ctx.fillStyle = this.colors.redBackgroundColor;
    ctx.fill();

    ctx.lineWidth = this.dpr;
    for (let i = 0; i < asksPrice.length; i++) {
        const p = (asksPrice[i] - asksPrice[0]) / (asksPrice[asksPrice.length - 1] - asksPrice[0]);
        const x = contentWidth * (1 - p2) + contentWidth * p2 * p;
        const y = contentHeight - asksDepth[i] / maxVolume * contentHeight;
        if (this.pos && this.pos.x >= lastX && this.pos.x < x) {
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
                ctx.fillText(this.string(asksPrice[i]), this.pos.x, (lastY - 10 * this.dpr) * 0.5);

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

                let lineY = lastY + 10 * this.dpr > contentHeight ? contentHeight : lastY + 10 * this.dpr
                let textY = (contentHeight + lineY) * 0.5;
                ctx.beginPath();
                ctx.strokeStyle = this.colors.redColor;
                ctx.moveTo(this.pos.x, contentHeight);
                ctx.lineTo(this.pos.x, textY + 10 * this.dpr);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.pos.x, textY - 10 * this.dpr)
                ctx.lineTo(this.pos.x, lineY);
                ctx.stroke();
                ctx.fillText(this.string(asksPrice[i]), this.pos.x, textY);
            }
        }
        lastX = contentWidth * (1 - p2) + contentWidth * p2 * p;
        lastY = contentHeight - asksDepth[i] / maxVolume * contentHeight;
    }


    // y轴刻度
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.colors.fontColor;
    ctx.strokeStyle = this.colors.splitColor;
    for (let i = interval; i < maxVolume; i += interval) {
        let y = contentHeight - contentHeight * i / maxVolume;
        ctx.fillText(this.string(i), 12 * this.dpr, y);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(8 * this.dpr, y);
        ctx.stroke();
    }
    ctx.textAlign = 'right';
    for (let i = interval; i < maxVolume; i += interval) {
        let y = contentHeight - contentHeight * i / maxVolume;
        ctx.fillText(this.string(i), width - 12 * this.dpr, y);
        ctx.beginPath();
        ctx.moveTo(width, y);
        ctx.lineTo(width - 8 * this.dpr, y);
        ctx.stroke();
    }

    n = 0;
    if ((asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]) >= 1) {
        n = (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]).toFixed(0).length;
    } else {
        if ((asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]) < 0.000001) {
            let str = ((asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]) * 100000).toString().split('.')[1] || '';
            for (let i = 0; i < str.length; i++) {
                if (str.charAt(i) == 0) {
                    n--;
                }
            }
            n -= 5;
        } else {
            let str = (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]).toString().split('.')[1];
            for (let i = 0; i < str.length; i++) {
                if (str.charAt(i) == 0) {
                    n--;
                }
            }
        }
    }
    let number = 0.15;
    const intervalX = Math.ceil((asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]) * number / Math.pow(10, n - 2)) * Math.pow(10, n - 2);
    ctx.fillStyle = this.colors.fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = bidsPrice[bidsPrice.length - 1] + intervalX; i < asksPrice[asksPrice.length - 1]; i += intervalX) {
        ctx.fillText(this.string(i), (i - bidsPrice[bidsPrice.length - 1]) / (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]) * contentWidth, contentHeight);
    }

    if (this.force) {
        this.force = false;
    }
    requestAnimationFrame(this.draw.bind(this));
};
