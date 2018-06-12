import BaseTool from './BaseTool';

export default class PriceLine extends BaseTool {
    constructor(ctx, colors, context, max_step) {
        super(ctx, colors, context);
        this.max_step = max_step;
    }

    drawLine() {
        const ctx = this.ctx;
        const [point] = this.getPos();

        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(this.context.mainYaxisView.x, point.y);
    }

    drawOther() {
        const ctx = this.ctx;
        const [point] = this.getPos();

        ctx.fillText(this.price[0].toFixed(this.context.option.priceDecimal), point.x, point.y);
    }
}
