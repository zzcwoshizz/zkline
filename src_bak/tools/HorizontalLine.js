import BaseTool from './BaseTool';

export default class HorizontalLine extends BaseTool {
    constructor(ctx, colors, context, max_step) {
        super(ctx, colors, context);
        this.max_step = max_step;
    }

    drawLine() {
        const ctx = this.ctx;
        const [point] = this.getPos();

        ctx.beginPath();
        ctx.moveTo(0, point.y);
        ctx.lineTo(this.context.mainYaxisView.x, point.y);
    }
}
