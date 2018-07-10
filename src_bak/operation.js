export default function operation(canvas, overCanvas) {
    const overCtx = this.overCtx;

    let isMove = false;
    let isDown = false;
    let lastIndex = -1;
    let lastPrice = -1;
    let lastPos = {};
    let lastTouchDistance = 0;
    let moveLine = null;
    let distance = null;

    const move = e => {
        const mainView = this.mainView;
        const aidView = this.aidView;
        const pos = this.getMousePos(e);
        this.mousePos = pos;
        let [startIndex, endIndex] = this.state.range;
        const verticalRectNumber = endIndex - startIndex;
        //const currentIndex = Math.floor((pos.x - aidView.x) / aidView.w * verticalRectNumber);
        const currentIndex = (pos.x - aidView.x) / aidView.w * verticalRectNumber;
        const { max, min } = this.computAxis();
        const price = max - (max - min) * (pos.y - mainView.y) / mainView.h;
        if (this.isInLineView(pos)) {
            if (isDown) {
                if (moveLine && moveLine.moving) {
                    if (pos.x > mainView.x && pos.x < (mainView.x + mainView.w) && pos.y > mainView.y && pos.y < (mainView.y + mainView.h)) {
                        moveLine.move(currentIndex - lastIndex, price - lastPrice);
                    }
                } else {
                    this.moveRange(currentIndex - lastIndex);
                }
            }
            if (isMove) {
                let offset = pos.y - lastPos.y;
                this.mainView.h += offset;
                this.mainYaxisView.h += offset;
                this.aidView.y += offset;
                this.aidView.h -= offset;
                this.aidYaxisView.y += offset;
                this.aidYaxisView.h -= offset;
                this.forceUpdate(true, true);
            }
            this.pos = pos;
            if (this.lineCache && pos.x > mainView.x && pos.x < (mainView.x + mainView.w) && pos.y > mainView.y && pos.y < (mainView.y + mainView.h)) {
                this.lineCache.setPosition(currentIndex + startIndex, price);
            }
        } else {
            this.pos = null;
        }
        if (pos.y > (aidView.y - 5) && pos.y < (aidView.y + 5)) {
            this.overCanvas.style.cursor = 'ns-resize';
        } else {
            this.overCanvas.style.cursor = 'default';
        }
        this.forceUpdate(false, true);
        lastIndex = currentIndex;
        lastPrice = price;
        lastPos = pos;
    };

    const scale = e => {
        const mainView = this.mainView;
        const aidView = this.aidView;
        const pos = this.getMousePos(e);
        let [startIndex, endIndex] = this.state.range;
        const verticalRectNumber = endIndex - startIndex;
        const currentIndex = (pos.x - aidView.x) / aidView.w * verticalRectNumber;
        let n = Number(e.deltaY.toFixed(0));
        this.scaleRange(n, currentIndex);
    };

    if (this.device === 'pc') {
        const mousedown = e => {
            const aidView = this.aidView;
            const pos = this.getMousePos(e);
            if (e.button === 0) {
                isDown = true;
                if (pos.y > (aidView.y - 5) && pos.y < (aidView.y + 5)) {
                    isMove = true;
                }
                this.lines.forEach(line => {
                    if (line.select) {
                        moveLine = line;
                        moveLine.moving = true;
                        return;
                    }
                });
                const verticalRectNumber = this.state.range[1] - this.state.range[0];
                const currentIndex = (pos.x - aidView.x) / aidView.w * verticalRectNumber;
                lastIndex = currentIndex;
            } else if (e.button === 2) {
                overCanvas.oncontextmenu = () => false;
                let index = null;
                // 查询鼠标所在处线
                this.lines.forEach((line, i) => {
                    if (line.select) {
                        index = i;
                        return;
                    }
                });
                if (this.lineCache) {
                    // 删除当前进行中的线
                    this.lineCache = null;
                } else if (index !== null) {
                    // 删除线
                    this.clearLine(index);
                }
            }
            this.forceUpdate(false, true);
        };
        const mouseup = () => {
            isDown = false;
            isMove = false;
            if (moveLine) {
                moveLine.moving = false;
                moveLine = null;
            }
            this.forceUpdate(false, true);
        };
        const mouseout = () => {
            isDown = false;
            this.pos = null;
            if (moveLine) {
                moveLine.moving = false;
                moveLine = null;
            }
            this.forceUpdate(false, true);
        };
        overCanvas.addEventListener('mousedown', mousedown);
        overCanvas.addEventListener('mouseup', mouseup);
        overCanvas.addEventListener('mouseout', mouseout);
        overCanvas.addEventListener('mousemove', move);
        overCanvas.addEventListener('wheel', function(e) {
            e.preventDefault();
            scale(e);
        });
        overCanvas.addEventListener('click', e => {
            e.preventDefault();
            if (!this.lineCache) {
                return;
            }
            const pos = this.getMousePos(e);
            const complete = this.lineCache.next();
            if (complete) {
                this.lines.unshift(this.lineCache);
                this.lineCache = null;
            }
            this.forceUpdate(false, true);
        });
    } else {
        const touchstart = e => {
            e.preventDefault();
            isDown = true;
            const pos = this.getMousePos(e);
            this.pos = pos;
            const aidView = this.aidView;
            const verticalRectNumber = this.state.range[1] - this.state.range[0];
            const currentIndex = (pos.x - aidView.x) / aidView.w * verticalRectNumber;
            lastIndex = currentIndex;
            if (e.touches.length === 2) {
                let rect = e.target.getBoundingClientRect();
                let x1 = (e.touches[0].clientX - rect.left) * this.dpr;
                let y1 = (e.touches[0].clientY - rect.top) * this.dpr;
                let x2 = (e.touches[1].clientX - rect.left) * this.dpr;
                let y2 = (e.touches[1].clientY - rect.top) * this.dpr;
                distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
            }
            this.forceUpdate(false, true);
        };
        const touchend = () => {
            isDown = false;
            this.forceUpdate(false, true);
        };
        const touchcancel = () => {
            isDown = false;
            this.forceUpdate(false, true);
        };
        const touchmove = e => {
            e.preventDefault();
            const mainView = this.mainView;
            const aidView = this.aidView;
            const pos = this.getMousePos(e);
            let [startIndex, endIndex] = this.state.range;
            const verticalRectNumber = endIndex - startIndex;
            const currentIndex = (pos.x - aidView.x) / aidView.w * verticalRectNumber;
            if (this.isInLineView(pos)) {
                if (isDown) {
                    this.moveRange(currentIndex - lastIndex);
                }
                this.pos = pos;
            } else {
                this.pos = null;
            }
            this.forceUpdate(false, true);
            lastIndex = currentIndex;
        };
        overCanvas.addEventListener('touchstart', touchstart);
        overCanvas.addEventListener('touchend', touchend);
        overCanvas.addEventListener('touchcancel', touchcancel);
        overCanvas.addEventListener('touchmove', touchmove);
    }
}

export function drawHairLine() {
    const pos = this.pos;
    if (!pos) {
        return;
    }
    const overCtx = this.overCtx;
    const { mainView, mainYaxisView, aidView, aidYaxisView, timeView } = this;
    let [startIndex, endIndex] = this.state.range;
    const startIndex1 = Math.floor(startIndex) - 1 < 0 ? 0 : Math.floor(startIndex) - 1;
    const endIndex1 = Math.ceil(endIndex) + 1;

    const verticalRectNumber = endIndex - startIndex;

    const currentIndex = Math.floor((pos.x - aidView.x) / aidView.w * verticalRectNumber + startIndex);
    //const x = currentIndex * aidView.w / verticalRectNumber + aidView.w / verticalRectNumber * 0.5 + mainView.x;
    const x = pos.x;
    const y = pos.y;

    // overCtx.clearRect(0, 0, this.width, this.height);
    if (currentIndex >= this.state.times.length || currentIndex < 0) {
        return;
    }

    overCtx.lineWidth = this.dpr;
    overCtx.strokeStyle = this.colors.hairLine;

    overCtx.beginPath();
    overCtx.moveTo(x, this.height);
    overCtx.lineTo(x, 0);
    overCtx.stroke();

    overCtx.beginPath();
    overCtx.moveTo(0, y);
    overCtx.lineTo(this.width, y);
    overCtx.stroke();

    // x轴坐标
    const currentTime = this.option.overTimeFilter(this.state.times[currentIndex]);
    overCtx.textAlign = 'center';
    overCtx.textBaseline = 'middle';
    overCtx.fillStyle = this.colors.background;
    overCtx.fillRect(x - overCtx.measureText(currentTime).width * 0.5 - 10, timeView.y + this.dpr, overCtx.measureText(currentTime).width + 20, timeView.h - this.dpr * 2);
    overCtx.strokeStyle = this.colors.splitLine;
    overCtx.strokeRect(x - overCtx.measureText(currentTime).width * 0.5 - 10, timeView.y + this.dpr, overCtx.measureText(currentTime).width + 20, timeView.h - this.dpr * 2);
    overCtx.fillStyle = this.colors.currentTextColor;
    overCtx.fillText(currentTime, x, timeView.h * 0.5 + timeView.y);

    // 画y轴坐标
    const { max, min } = this.computAxis();
    let view = mainYaxisView;
    let w = this.width - view.x;
    overCtx.textAlign = 'right';
    overCtx.textBaseline = 'middle';
    overCtx.fillStyle = this.colors.background;
    overCtx.fillRect(view.x + this.dpr, y - 10 * this.dpr, w - 2 * this.dpr, 20 * this.dpr);
    overCtx.strokeStyle = this.colors.splitLine;
    overCtx.strokeRect(view.x + this.dpr, y - 10 * this.dpr, w - 2 * this.dpr, 20 * this.dpr);
    overCtx.fillStyle = this.colors.textColor;

    overCtx.textAlign = 'center';
    overCtx.fillStyle = this.colors.currentTextColor;
    if (this.isInLineView(pos) === mainView) {
        const yText = max - (max - min) * (y - view.y) / view.h;
        overCtx.fillText(this.string(yText), mainYaxisView.x + mainYaxisView.w * 0.5, y);
    } else {
        view = aidYaxisView;
        if (this.option.aidCsi === 'volume') {
            const yText = (1 - (y - view.y) / view.h) * (this.csiYaxisSector[0] - this.csiYaxisSector[1]);
            overCtx.fillText(this.string(yText), mainYaxisView.x + mainYaxisView.w * 0.5, y);
        } else {
            const yText = this.csiYaxisSector[1] * (y - view.y) / view.h + this.csiYaxisSector[0] * (1 - (y - view.y) / view.h);
            overCtx.fillText(this.string(yText), mainYaxisView.x + mainYaxisView.w * 0.5, y);
        }
    }

    const basicSelectOption = {
        time: this.state.times[currentIndex],
        start: this.state.start[currentIndex],
        hi: this.state.hi[currentIndex],
        lo: this.state.lo[currentIndex],
        close: this.state.close[currentIndex],
        volume: this.state.volume[currentIndex],
    };
    let selectOption = { ...basicSelectOption };
    if (this.option.mainCsi === 'ma') {
        selectOption = {
            ...selectOption,
            ma7: this.state.ma7[currentIndex],
            ma30: this.state.ma30[currentIndex],
        };
    } else if (this.option.mainCsi === 'ema') {
        selectOption = {
            ...selectOption,
            ema7: this.state.ema7[currentIndex],
            ema30: this.state.ema30[currentIndex],
        };
    } else if (this.option.mainCsi === 'boll') {
        selectOption = {
            ...selectOption,
            up: this.state.up[currentIndex],
            mb: this.state.mb[currentIndex],
            dn: this.state.dn[currentIndex],
        };
    }

    this.select(selectOption, 0);

    if (this.option.aidCsi === 'volume') {
        this.select({
            volume: this.state.volume[currentIndex],
            ma7: this.state.volumeMa7[currentIndex],
            ma30: this.state.volumeMa30[currentIndex],
        }, 1);
    }
    if (this.option.aidCsi === 'macd') {
        this.select({
            dif: this.state.dif[currentIndex],
            dea: this.state.dea[currentIndex],
            macd: this.state.macd[currentIndex],
        }, 1);
    }
    if (this.option.aidCsi === 'kdj') {
        this.select({
            k: this.state.k[currentIndex],
            d: this.state.d[currentIndex],
            j: this.state.j[currentIndex],
        }, 1);
    }
    if (this.option.aidCsi === 'dmi') {
        this.select({
            pdi: this.state.pdi[currentIndex],
            mdi: this.state.mdi[currentIndex],
            adx: this.state.adx[currentIndex],
            adxr: this.state.adxr[currentIndex],
        }, 1);
    }
    if (this.option.aidCsi === 'dma') {
        this.select({
            dmaDif: this.state.dmaDif[currentIndex],
            dmaDifma: this.state.dmaDifma[currentIndex],
        }, 1);
    }
    if (this.option.aidCsi === 'trix') {
        this.select({
            trix: this.state.trix[currentIndex],
            matrix: this.state.matrix[currentIndex],
        }, 1);
    }
    if (this.option.aidCsi === 'brar') {
        this.select({
            br: this.state.br[currentIndex],
            ar: this.state.ar[currentIndex],
        }, 1);
    }
    if (this.option.aidCsi === 'vr') {
        this.select({
            vr: this.state.vr[currentIndex],
            mavr: this.state.mavr[currentIndex],
        }, 1);
    }
    if (this.option.aidCsi === 'obv') {
        this.select({
            obv: this.state.obv[currentIndex],
            maobv: this.state.maobv[currentIndex],
        }, 1);
    }
    if (this.option.aidCsi === 'rsi') {
        this.select({
            rsi6: this.state.rsi6[currentIndex],
            rsi12: this.state.rsi12[currentIndex],
            rsi24: this.state.rsi24[currentIndex],
        }, 1);
    }
}
