export default function drawDepth(yaxis) {
    const ctx = this.ctx;
    const mainYaxisView = this.mainYaxisView;

    const { max, min } = yaxis;

    const depth = this.option.depth;
    const bidsPrice = [];
    const asksPrice = [];
    const bidsVolume = [];
    const asksVolume = [];
    depth.bids.forEach(el => {
        if (el[0] < min) {
            return;
        }
        bidsPrice.push(parseFloat(el[0]));
        bidsVolume.push(parseFloat(el[1]));
    });
    depth.asks.forEach(el => {
        if (el[0] > max) {
            return;
        }
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

    const maxVolume = Math.max(bidsDepth.length > 0 && bidsDepth[bidsDepth.length - 1], asksDepth.length > 0 && asksDepth[asksDepth.length - 1]);
    let n = (maxVolume * 0.2).toFixed(0).length;
    const interval = Math.ceil(maxVolume * 0.2 / Math.pow(10, n - 1)) * Math.pow(10, n - 1);
    const yAxis = [];
    for (let i = interval; i < maxVolume; i += interval) {
        yAxis.unshift(i);
    }

    ctx.lineWidth = this.dpr;

    let lastX, lastY;
    let lineargradient;
    if (asksPrice.length > 0) {
        const p1 = (asksPrice[asksPrice.length - 1] - asksPrice[0]) / (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]);
        ctx.beginPath();
        for (let i = 0; i < asksDepth.length; i++) {
            const x = asksDepth[i] / maxVolume * mainYaxisView.w + mainYaxisView.x;
            const y = (max - asksPrice[i]) / (max - min) * mainYaxisView.h + mainYaxisView.y;
            if (i === 0) {
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
        ctx.lineTo(mainYaxisView.x, 0)
        ctx.closePath();
        lineargradient = ctx.createLinearGradient(this.width, 0, this.mainYaxisView.x, 0);
        lineargradient.addColorStop(0, this.colors.greenColorBackground);
        lineargradient.addColorStop(1, this.colors.greenColorBackground1);
        ctx.fillStyle = lineargradient;
        ctx.fill();
    }

    if (bidsPrice.length > 0) {
        const p2 = (bidsPrice[0] - bidsPrice[bidsPrice.length - 1]) / (asksPrice[asksPrice.length - 1] - bidsPrice[bidsPrice.length - 1]);
        ctx.beginPath();
        for (let i = 0; i < bidsDepth.length; i++) {
            const x = bidsDepth[i] / maxVolume * mainYaxisView.w + mainYaxisView.x;
            const y = (max - bidsPrice[i]) / (max - min) * mainYaxisView.h + mainYaxisView.y;
            if (i === 0) {
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
