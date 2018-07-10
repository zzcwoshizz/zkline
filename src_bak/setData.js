function ma(close, param) {
    return close.map((el, i) => {
        if (i < param - 1) {
            return el;
        } else {
            let sum = 0;
            for (let index = i; index > i - param; index--) {
                sum += close[index];
            }
            return sum / param;
        }
    })
}

function ema(close, param) {
    const ema = [];
    close.forEach((el, i) => {
        if (i < param - 1) {
            ema[i] = el;
        } else {
            let val = 2 / param * (close[i] - ema[i - 1]) + ema[i - 1];
            ema[i] = val;
        }
    });
    return ema;
}

export default function setData() {
    let maxLength = -1;
    const data = this.option.data;
    let times = [];
    let start = [];
    let hi = [];
    let lo = [];
    let close = [];
    let volume = [];
    data.forEach(d => {
        if (String(d[0]).length === 10) {
            times.push(d[0]);
        } else if(String(d[0].length === 13)) {
            times.push(parseInt(d[0] / 1000));
        }
        start.push(d[1]);
        hi.push(d[2]);
        lo.push(d[3]);
        close.push(d[4]);
        volume.push(d[5]);
        maxLength = Math.max(
            maxLength,
            this.string(d[1]).length,
            this.string(d[2]).length,
            this.string(d[3]).length,
            this.string(d[4]).length,
            this.string(d[5]).length,
        );
    });
    this.state = {
        times,
        start,
        hi,
        lo,
        close,
        volume,
        ma7: ma(close, 7),
        ma10: ma(close, 10),
        ma12: ma(close, 12),
        ma20: ma(close, 20),
        ma30: ma(close, 30),
        ma50: ma(close, 50),
        volumeMa7: ma(volume, 7),
        volumeMa30: ma(volume, 30),
        isDown: false,
        range: data.length > 74 ? [data.length + 10 - 84, data.length + 10] : [-10, 74],
    };
    this.state.ema30 = ema(close, 30);
    this.state.ema7 = ema(close, 7);
    this.state.ema15 = ema(close, 15);
    this.state.ema26 = ema(close, 26);
    this.state.ema12 = ema(close, 12);
    this.state.dif = this.state.ema12.map((el, i) => {
        let val = el - this.state.ema26[i];
        return val;
    });
    this.state.dea = [];
    this.state.dif.forEach((el, i) => {
        if (i === 0) {
            this.state.dea[i] = el;
        } else {
            let val = this.state.dea[i - 1] * 0.8 + el * 0.2;
            this.state.dea[i] = val;
        }
    });
    this.state.macd = this.state.dif.map((el, i) => {
        let val = (el - this.state.dea[i]) * 2;
        const macd = val;
        maxLength = Math.max(maxLength, this.string(macd).length);
        return macd;
    });

    // 计算BOLL
    this.state.up = [];
    this.state.mb = [];
    this.state.dn = [];
    this.state.ma20.forEach((el, i) => {
        if (i === 0) {
            this.state.mb.push(this.state.ma20[i]);
            this.state.up.push(this.state.ma20[i]);
            this.state.dn.push(this.state.ma20[i]);
            return;
        }
        let sum = 0;
        for (let index = i < 20 ? 0 : i - 20; index < i; index++) {
            sum += (this.state.close[index] - this.state.ma20[index]) ** 2;
        }
        let md = Math.sqrt(sum / (i < 20 ? i : 20));
        this.state.mb.push(this.state.ma20[i - 1]);
        this.state.up.push(this.state.ma20[i - 1] + 2 * md);
        this.state.dn.push(this.state.ma20[i - 1] - 2 * md);
    });

    // 计算kdj
    this.state.k = [];
    this.state.d = [];
    this.state.j = [];
    this.state.close.forEach((el, i) => {
        let h = this.state.hi[i - 8 < 0 ? 0 : i - 8];
        let l = this.state.lo[i - 8 < 0 ? 0 : i - 8];
        let defaultIndex = i - 8 < 0 ? 0 : i - 8;
        for (let index = defaultIndex; index <= i; index++) {
            l = Math.min(this.state.lo[index], l);
            h = Math.max(this.state.hi[index], h);
        }
        let rsv;
        if (h === l) {
            rsv = 100;
        } else {
            rsv = (el - l) / (h - l) * 100;
        }
        if (i === 0) {
            this.state.k.push(100 / 3 + rsv / 3);
            this.state.d.push(100 / 3 + this.state.k[i] / 3);
            this.state.j.push(3 * this.state.k[i] - 2 * this.state.d[i]);
            return;
        }
        this.state.k.push(2 / 3 * this.state.k[i - 1] + rsv / 3);
        this.state.d.push(2 / 3 * this.state.d[i - 1] + this.state.k[i] / 3);
        this.state.j.push(3 * this.state.k[i] - 2 * this.state.d[i]);
    });

    // 计算sar
    this.state.sar = [];
    let af = 0.02;
    for (let i = 0; i < times.length; i++) {
        if (i === 0) {
            this.state.sar.push(this.state.lo[i]);
            continue;
        }
        if (i === 1) {
            this.state.sar.push(this.state.hi[i]);
            continue;
        }
        let ep;
        if (this.state.close[i] > this.state.close[i - 1]) {
            ep = Math.max(this.state.hi[i - 1], this.state.hi[i - 2]);
        } else {
            ep = Math.min(this.state.lo[i - 1], this.state.lo[i - 2]);
        }
        if (this.state.close[i] > this.state.close[i - 1] && this.state.close[i - 1] > this.state.close[i - 2]) {
            if (Math.max(this.state.hi[i], this.state.hi[i - 1]) > Math.max(this.state.hi[i - 1], this.state.hi[i - 2])) {
                af = af + 0.02 > 0.2 ? 0.2 : af + 0.02;
            }
        } else if (this.state.close[i] <= this.state.close[i - 1] && this.state.close[i - 1] <= this.state.close[i - 2]) {
            if (Math.min(this.state.lo[i], this.state.lo[i - 1]) < Math.min(this.state.lo[i - 1], this.state.lo[i - 2])) {
                af = af + 0.02 > 0.2 ? 0.2 : af + 0.02;
            }
        } else {
            af = 0.02;
        }
        let preSar = this.state.sar[i - 1];
        let sar = preSar + af * (ep - preSar);
        if (this.state.close[i] > this.state.close[i - 1]) {
            if (sar > this.state.lo[i] || sar > this.state.lo[i - 1] || sar > this.state.lo[i - 2]) {
                sar = Math.min(this.state.lo[i], this.state.lo[i - 1], this.state.lo[i - 2]);
            }
        } else {
            if (sar < this.state.hi[i] || sar < this.state.hi[i - 1] || sar < this.state.hi[i - 2]) {
                sar = Math.max(this.state.hi[i], this.state.hi[i - 1], this.state.hi[i - 2]);
            }
        }
        this.state.sar.push(sar);
    }

    // 计算dmi
    let pdm = [];
    let mdm = [];
    let tr = [];
    let dx = [];
    this.state.pdi = [];
    this.state.mdi = [];
    this.state.adx = [];
    this.state.adxr = [];
    this.state.close.forEach((el, i) => {
        if (i === 0) {
            pdm[i] = 0;
            mdm[i] = 0;
            tr[i] = this.state.hi[i] - this.state.lo[i];
        } else {
            pdm[i] = this.state.hi[i] - this.state.hi[i - 1];
            if (pdm[i] < 0) {
                pdm[i] = 0;
            }
            mdm[i] = this.state.lo[i - 1] - this.state.lo[i];
            if (mdm[i] < 0) {
                mdm[i] = 0;
            }
            tr[i] = Math.max(Math.abs(this.state.hi[i] - this.state.lo[i]), Math.abs(this.state.hi[i] - this.state.close[i - 1]), Math.abs(this.state.lo[i] - this.state.close[i - 1]));
        }
        const start = (i - 14) < 0 ? 0 : (i - 14);
        let pdmSum = 0.000001;
        let mdmSum = 0.000001;
        let trSum = 0.000001;
        let adxSum = 0.000001;
        for (let index = start; index < i; index++) {
            pdmSum += pdm[index];
            mdmSum += mdm[index];
            trSum += tr[index];
            if (index !== i - 1) {
                adxSum += dx[index];
            }
        }
        let n = i - start <= 0 ? 1 : i - start;
        this.state.pdi[i] = (pdmSum / n) / (trSum / n) * 100;
        this.state.mdi[i] = (mdmSum / n) / (trSum / n) * 100;
        dx[i] = Math.abs(this.state.pdi[i] - this.state.mdi[i]) / (this.state.pdi[i] + this.state.mdi[i]) * 100;
        adxSum += dx[i];
        this.state.adx[i] = adxSum / n;
        if (i === 0) {
            this.state.adxr[i] = this.state.adx[i];
        } else {
            this.state.adxr[i] = (this.state.adx[i] + this.state.adx[i - 14 < 0 ? 0 : i - 14]) / 2;
        }
    });

    // dma
    this.state.dmaDif = this.state.ma10.map((el, index) => {
        return el - this.state.ma50[index];
    })
    this.state.dmaDifma = ma(this.state.dmaDif, 10);

    // trix
    const trTem = ema(ema(ema(close, 12), 12), 12);
    this.state.trix = trTem.map((el, i) => {
        if (i === 0) return 0;
        return (el - trTem[i - 1]) / trTem[i - 1] * 100;
    });
    this.state.matrix = ma(this.state.trix, 9);

    // brar
    this.state.ar = [];
    this.state.br = [];
    this.state.close.forEach((el, index) => {
        let n = index;
        let sum = 0;
        let sum1 = 0;
        let sum2 = 0;
        let sum3 = 0;
        if (index === 0) {
            this.state.ar.push(0);
            this.state.br.push(0);
            return;
        }
        for (let i = (n - 25 < 0) ? 0 : (n - 25); i <= n; i++) {
            let a = this.state.hi[i] - this.state.start[i];
            let b = this.state.start[i] - this.state.lo[i];
            sum += (a < 0 ? 0 : a);
            sum1 += (b < 0 ? 0 : b);
            let a1 = this.state.hi[i] - this.state.close[(i - 1 < 0) ? 0 : (i - 1)];
            let b1 = this.state.close[(i - 1 < 0) ? 0 : (i - 1)] - this.state.lo[i];
            sum2 += (a1 < 0 ? 0 : a1);
            sum3 += (b1 < 0 ? 0 : b1);
        }
        this.state.ar.push(sum / sum1 * 100);
        this.state.br.push(sum2 / sum3 * 100);
    });

    // vr
    this.state.vr = [];
    this.state.close.forEach((el, index) => {
        let n = index;
        let uvs = 0;
        let dvs = 0;
        let pvs = 0;
        if (n === 0) {
            this.state.vr.push(0);
            return;
        }
        for (let i = (n - 25 < 0) ? 0 : (n - 25); i <= n; i++) {
            if (this.state.close[i] > this.state.start[i]) {
                uvs += this.state.volume[i];
            } else if (this.state.close[i] < this.state.start[i]) {
                dvs += this.state.volume[i];
            } else {
                pvs += this.state.volume[i];
            }
        }
        this.state.vr.push(80 * (uvs + 0.5 * pvs) / (dvs + 0.5 * pvs));
    });
    this.state.mavr = ma(this.state.vr, 6);

    // obv
    this.state.obv = [];
    this.state.close.forEach((el, index) => {
        if (index === 0) {
            this.state.obv.push(this.state.volume[0]);
            return;
        }
        let sgn;
        if (this.state.close[index] >= this.state.close[index - 1]) {
            sgn = 1;
        } else {
            sgn = -1;
        }
        this.state.obv.push(this.state.obv[index - 1] + sgn * this.state.volume[index]);
    });
    this.state.maobv = ma(this.state.obv, 30);

    // rsi
    this.state.rsi6 = [];
    this.state.rsi12 = [];
    this.state.rsi24 = [];
    this.state.close.forEach((el, index) => {
        if (index < 6) {
            this.state.rsi6[index] = 0;
        } else {
            let a = 0;
            let b = 0;
            for (let i = index - 6; i < index; i++) {
                if (this.state.close[i] - this.state.start[i] < 0) {
                    b += (this.state.start[i] - this.state.close[i]);
                } else {
                    a += (this.state.close[i] - this.state.start[i]);
                }
            }
            if (a + b === 0) {
                this.state.rsi6[index] = this.state.rsi6[index - 1];
            } else {
                this.state.rsi6[index] = a / (a + b) * 100;
            }
        }
        if (index < 12) {
            this.state.rsi12[index] = 0;
        } else {
            let a = 0;
            let b = 0;
            for (let i = index - 12; i < index; i++) {
                if (this.state.close[i] - this.state.start[i] < 0) {
                    b += (this.state.start[i] - this.state.close[i]);
                } else {
                    a += (this.state.close[i] - this.state.start[i]);
                }
            }
            if (a + b === 0) {
                this.state.rsi12[index] = this.state.rsi12[index - 1];
            } else {
                this.state.rsi12[index] = a / (a + b) * 100;
            }
        }
        if (index < 24) {
            this.state.rsi24[index] = 0;
        } else {
            let a = 0;
            let b = 0;
            for (let i = index - 24; i < index; i++) {
                if (this.state.close[i] - this.state.start[i] < 0) {
                    b += (this.state.start[i] - this.state.close[i]);
                } else {
                    a += (this.state.close[i] - this.state.start[i]);
                }
            }
            if (a + b === 0) {
                this.state.rsi24[index] = this.state.rsi24[index - 1];
            } else {
                this.state.rsi24[index] = a / (a + b) * 100;
            }
        }
    });

    maxLength = maxLength > 15 ? 15 : maxLength;

    return Math.ceil(this.ctx.measureText(10 ** maxLength).width + 10 * this.dpr);
}
