import BaseTool from './BaseTool';

export default class Segment extends BaseTool {
    constructor(ctx, colors, context, max_step) {
        super(ctx, colors, context);
        this.max_step = max_step;
    }

    drawLine() {
        const ctx = this.ctx;
        const [point1, point2] = this.getPos();

        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
    }
}
