export default class BaseTool {
    constructor(ctx, colors, context) {
        this.ctx = ctx;
        this.colors = colors;
        this.step = 0;
        this.max_step = 3;
        this.context = context;
        this.index = [];
        this.price = [];
        this.moving = false;
    }

    draw() {
        if (this.index.length === 0) {
            return;
        }
        const ctx = this.ctx;

        this.drawLine();
        const select = this.isInPath(this.context.mousePos);

        if (select && this.step <= this.max_step) {
            ctx.strokeStyle = this.colors.lineHilightColor;
            ctx.fillStyle = this.colors.lineHilightColor;
        } else {
            ctx.strokeStyle = this.colors.lineColor;
            ctx.fillStyle = this.colors.lineColor;
        }
        ctx.lineWidth = this.context.dpr;
        ctx.stroke();

        if (this.drawOther) {
            this.drawOther();
        }

        if (select || this.step < this.max_step) {
            this.drawPoint();
        }
    }

    drawPoint() {
        const ctx = this.ctx;

        ctx.lineWidth = this.context.dpr;
        ctx.fillStyle = this.colors.background;

        this.getPos().map(pos => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 5 * this.context.dpr, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });
    }

    next() {
        if (this.step < this.max_step) {
            this.step++;
        }
        if (this.step === this.max_step) {
            return true;
        }
    }

    isInPath(pos) {
        const ctx = this.ctx;
        ctx.lineWidth = this.context.dpr * 20;
        if (ctx.isPointInStroke(pos.x, pos.y)) {
            this.select = true;
        } else {
            this.select = false;
        }
        return this.select;
    }

    setPosition(index, price) {
        let newIndex = [];
        let newPrice = [];
        for (let i = 0; i < this.step; i++) {
            newIndex.push(this.index[i]);
            newPrice.push(this.price[i]);
        }
        for (let i = this.step; i < this.max_step; i++) {
            newIndex.push(index);
            newPrice.push(price);
        }
        this.index = newIndex;
        this.price = newPrice;
    }

    move(index, price) {
        this.index = this.index.map(i => {
            return i + index;
        });
        this.price = this.price.map(p => {
            return p + price;
        })
    }

    getPos() {
        const { mainView } = this.context;
        const [startIndex, endIndex] = this.context.state.range;
        const verticalRectNumber = endIndex - startIndex;
        const { max, min } = this.context.computAxis();

        return this.index.map((el, i) => {
            const x = (el - startIndex) * mainView.w / verticalRectNumber + mainView.x;
            const y = mainView.y + (max - this.price[i]) / (max - min) * mainView.h;
            return {x, y};
        });
    }
}
