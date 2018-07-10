import BaseTool from './BaseTool';

export default class ParallelLine extends BaseTool {
    constructor(ctx, colors, context, max_step) {
        super(ctx, colors, context);
        this.max_step = max_step;
    }

    drawLine() {
        const ctx = this.ctx;
        const [point1, point2, point3] = this.getPos();

        const f = (point2.x - point1.x) / (point2.y - point1.y);

        const y1 = 0;
        const x1 = f * (y1 - point1.y) + point1.x;
        const y2 = this.context.mainView.y + this.context.mainView.h;
        const x2 = f * (y2 - point1.y) + point1.x;
        const y3 = 0;
        const x3 = f * (y3 - point3.y) + point3.x;
        const y4 = this.context.mainView.y + this.context.mainView.h;
        const x4 = f * (y2 - point3.y) + point3.x;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.moveTo(x3, y3);
        ctx.lineTo(x4, y4);
    }
}
