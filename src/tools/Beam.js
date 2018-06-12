import BaseTool from './BaseTool';

export default class Beam extends BaseTool {
    constructor(ctx, colors, context, max_step) {
        super(ctx, colors, context);
        this.max_step = max_step;
    }

    drawLine() {
        const ctx = this.ctx;
        const [point1, point2] = this.getPos();

        const f = (point2.x - point1.x) / (point2.y - point1.y);

        let y;
        if (point2.y > point1.y) {
            y = this.context.mainView.y + this.context.mainView.h + 10;
        } else {
            y = 0;
        }
        const x = f * (y - point1.y) + point1.x;

        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(x, y);
    }
}
