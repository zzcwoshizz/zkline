import BaseTool from './BaseTool';

export default class Fibonacci extends BaseTool {
    constructor(ctx, colors, context, max_step) {
        super(ctx, colors, context);
        this.max_step = max_step;
    }

    drawLine() {
        const ctx = this.ctx;
        const [point1, point2] = this.getPos();

        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point1.y);
        ctx.moveTo(point1.x, (point1.y - point2.y) * 0.786 + point2.y);
        ctx.lineTo(point2.x, (point1.y - point2.y) * 0.786 + point2.y);
        ctx.moveTo(point1.x, (point1.y - point2.y) * 0.618 + point2.y);
        ctx.lineTo(point2.x, (point1.y - point2.y) * 0.618 + point2.y);
        ctx.moveTo(point1.x, (point1.y - point2.y) * 0.5 + point2.y);
        ctx.lineTo(point2.x, (point1.y - point2.y) * 0.5 + point2.y);
        ctx.moveTo(point1.x, (point1.y - point2.y) * 0.382 + point2.y);
        ctx.lineTo(point2.x, (point1.y - point2.y) * 0.382 + point2.y);
        ctx.moveTo(point1.x, (point1.y - point2.y) * 0.236 + point2.y);
        ctx.lineTo(point2.x, (point1.y - point2.y) * 0.236 + point2.y);
        ctx.moveTo(point1.x, point2.y);
        ctx.lineTo(point2.x, point2.y);
    }

    drawOther() {
        const ctx = this.ctx;
        const [point1, point2] = this.getPos();

        ctx.beginPath();
        ctx.setLineDash([10, 10]);
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.stroke();
        ctx.setLineDash([]);

        let n;
        if (point1.x < point2.x) {
            ctx.textAlign = 'right';
            n = -10;
        } else {
            ctx.textAlign = 'left';
            n = 10;
        }
        ctx.textBaseline = 'middle';
        ctx.fillText('1 ' + this.context.string(this.price[0]), point1.x + n, point1.y);
        ctx.fillText('0.786 ' + this.context.string(this.price[1] + (this.price[0] - this.price[1]) * 0.786, ), point1.x + n, (point1.y - point2.y) * 0.786 + point2.y);
        ctx.fillText('0.618 ' + this.context.string(this.price[1] + (this.price[0] - this.price[1]) * 0.618, ), point1.x + n, (point1.y - point2.y) * 0.618 + point2.y);
        ctx.fillText('0.5 ' + this.context.string(this.price[1] + (this.price[0] - this.price[1]) * 0.5, ), point1.x + n, (point1.y - point2.y) * 0.5 + point2.y);
        ctx.fillText('0.382 ' + this.context.string(this.price[1] + (this.price[0] - this.price[1]) * 0.382, ), point1.x + n, (point1.y - point2.y) * 0.382 + point2.y);
        ctx.fillText('0.236 ' + this.context.string(this.price[1] + (this.price[0] - this.price[1]) * 0.236, ), point1.x + n, (point1.y - point2.y) * 0.236 + point2.y);
        ctx.fillText('0 ' + this.context.string(this.price[1]), point1.x + n, point2.y);
    }

}
