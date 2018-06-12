// 计算最大价格，最小价格，y轴显示的价格差
export default function computAxis() {
    const start = this.state.start;
    const hi = this.state.hi;
    const lo = this.state.lo;
    const close = this.state.close;
    const ma30 = this.state.ma30;
    const ma7 = this.state.ma7;
    const ema30 = this.state.ema30;
    const ema7 = this.state.ema7;
    const up = this.state.up;
    const mb = this.state.mb;
    const dn = this.state.dn;
    const startIndex = Math.floor(this.state.range[0]) - 1 < 0 ? 0 : Math.floor(this.state.range[0]) - 1;
    const endIndex = Math.ceil(this.state.range[1]) + 1;
    let maxY = hi[startIndex];
    let minY = lo[startIndex];
    let maxPrice = hi[startIndex];
    let minPrice = lo[startIndex];
    let maxPriceIndex = startIndex;
    let minPriceIndex = startIndex;
    let mainCsi = this.option.mainCsi;
    for (let i = startIndex; i < endIndex; i++) {
        if (i >= this.state.times.length) {
            break;
        }
        let csi = [];
        if (mainCsi === 'ma') {
            csi = [ma30[i], ma7[i]];
        } else if (mainCsi === 'ema') {
            csi = [ema30[i], ema7[i]];
        } else if (mainCsi === 'boll') {
            csi = [up[i], mb[i], dn[i]];
        }
        let maxVal = Math.max(start[i], hi[i], lo[i], close[i], ...csi);
        let minVal = Math.min(start[i], hi[i], lo[i], close[i], ...csi);
        maxY = maxVal > maxY ? maxVal : maxY;
        minY = minVal < minY ? minVal : minY;
        let maxPriceVal = hi[i];
        let minPriceVal = lo[i];
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
    let cha = maxY - minY;
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
    const intervalY = Math.ceil((maxY - minY) * 0.2 / Math.pow(10, n - 2)) * Math.pow(10, n - 2);
    return {
        maxY,
        minY,
        maxPrice,
        maxPriceIndex,
        minPrice,
        minPriceIndex,
        max: maxY + intervalY - maxY % intervalY,
        min: minY - minY % intervalY,
        intervalY,
    };
}
