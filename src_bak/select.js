function transformKey(key) {
    if (key === 'time') {
        return this.text.time;
    } else if (key === 'start') {
        return this.text.start;
    } else if (key === 'hi') {
        return this.text.hi;
    } else if (key === 'lo') {
        return this.text.lo;
    } else if (key === 'close') {
        return this.text.close;
    } else if (key === 'volume') {
        return this.text.volume;
    } else if (key === 'dmaDif') {
        return 'DIF';
    } else if (key === 'dmaDifma') {
        return 'DIFMA';
    } else {
        return String(key).toUpperCase();
    }
}

function setStyle(key, ctx) {
    if (key === 'ema7' || key === 'ma7' || key === 'dif' || key === 'mb' || key === 'k') {
        ctx.fillStyle = this.colors.ma7Color;
    } else if (key === 'ema30' || key === 'ma30' || key === 'dea' || key === 'up' || key === 'd') {
        ctx.fillStyle = this.colors.ma30Color;
    } else if (key === 'macd' || key === 'dn' || key === 'j') {
        ctx.fillStyle = this.colors.macdColor;
    } else {
        ctx.fillStyle = this.colors[key + 'Color'] || this.colors.textColor;
    }
}

export default function(data, flag) {
    let overCtx = this.overCtx;
    overCtx.textAlign = 'left';
    overCtx.textBaseline = 'top';
    transformKey = transformKey.bind(this);
    if (flag === 0) {
        let x = 5;
        let y = 5;
        for (let i = 0; i < Object.keys(data).length; i++) {
            let key = Object.keys(data)[i];
            let text;
            if (key === 'time') {
                text = this.text.time + ':' + this.option.overTimeFilter(data[key]);
            } else {
                text = transformKey(key) + '：' + this.string(data[key]);
            }
            if (overCtx.measureText(text).width + x + 40 > this.mainView.x + this.mainView.w) {
                x = 5;
                y += 40;
            }
            setStyle.call(this, key, overCtx);
            overCtx.fillText(text, x, y);
            x += overCtx.measureText(text).width + 40;
        }
    } else if (flag === 1) {
        let x = 5;
        let y = this.aidView.y;
        for (let i = 0; i < Object.keys(data).length; i++) {
            let key = Object.keys(data)[i];
            let text = transformKey(key) + '：' + this.string(data[key]);
            if (overCtx.measureText(text).width + x + 40 > this.mainView.x + this.mainView.w) {
                x = 5;
                y += 40;
            }
            setStyle.call(this, key, overCtx);
            overCtx.fillText(text, x, y);
            x += overCtx.measureText(text).width + 40;
        }
    }
}
