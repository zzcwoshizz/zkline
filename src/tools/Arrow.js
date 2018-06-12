import BaseTool from './BaseTool';

export default class Arrow extends BaseTool {
    constructor(ctx, colors, context, max_step) {
        super(ctx, colors, context);
        this.max_step = max_step;
    }

    drawLine() {
        const ctx = this.ctx;
        const [point1, point2] = this.getPos();

        const angle = Math.atan2(point1.y - point2.y, point1.x - point2.x);
        const angle1 = angle + Math.PI / 6;
        const angle2 = angle - Math.PI / 6;
        const x1 = point2.x + 12 * Math.cos(angle1);
        const y1 = point2.y + 12 * Math.sin(angle1);
        const x2 = point2.x + 12 * Math.cos(angle2);
        const y2 = point2.y + 12 * Math.sin(angle2);

        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);

        ctx.moveTo(x1, y1);
        ctx.lineTo(point2.x, point2.y);
        ctx.lineTo(x2, y2);
    }
}
