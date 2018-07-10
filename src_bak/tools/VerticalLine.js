import BaseTool from './BaseTool';

export default class VerticalLine extends BaseTool {
    constructor(ctx, colors, context, max_step) {
        super(ctx, colors, context);
        this.max_step = max_step;
    }

    drawLine() {
        const ctx = this.ctx;
        const [point] = this.getPos();

        ctx.beginPath();
        ctx.moveTo(point.x, 0);
        ctx.lineTo(point.x, this.context.mainView.y + this.context.mainView.h);
    }
}
