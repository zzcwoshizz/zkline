import BaseTool from './BaseTool';

export default class Line extends BaseTool {
    constructor(ctx, colors, context, max_step) {
        super(ctx, colors, context);
        this.max_step = max_step;
    }

    drawLine() {
        const ctx = this.ctx;
        const [point1, point2] = this.getPos();

        const f = (point2.x - point1.x) / (point2.y - point1.y);

        const y1 = 0;
        const x1 = f * (y1 - point1.y) + point1.x;
        const y2 = this.context.mainView.y + this.context.mainView.h + 10;
        const x2 = f * (y2 - point1.y) + point1.x;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    }
}
