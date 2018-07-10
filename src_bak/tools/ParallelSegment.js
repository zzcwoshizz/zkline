import BaseTool from './BaseTool';

export default class ParallelSegment extends BaseTool {
    constructor(ctx, colors, context, max_step) {
        super(ctx, colors, context);
        this.max_step = max_step;
    }

    drawLine() {
        const ctx = this.ctx;
        const [point1, point2] = this.getPos();

        ctx.beginPath();
        ctx.moveTo(point1.x, point2.y);
        ctx.lineTo(point2.x, point2.y);
    }

    drawPoint() {
        const ctx = this.ctx;
        const [point1, point2] = this.getPos();

        ctx.lineWidth = this.context.dpr;
        ctx.fillStyle = this.colors.background;

        ctx.beginPath();
        ctx.arc(point1.x, point2.y, 5 * this.context.dpr, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(point2.x, point2.y, 5 * this.context.dpr, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
