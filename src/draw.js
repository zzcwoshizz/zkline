export default function draw() {
    if (!this.lastState) {
        this.lastState = { range: [-1, -1] };
    }
    const canDraw = this.canDraw();
    if (canDraw[1]) {
        const overCtx = this.overCtx;
        overCtx.clearRect(0, 0, this.width, this.height);
        this.drawHairLine();
        if (this.lineCache) {
            this.drawLineCache();
        }
        this.drawLines();
    }
    if (canDraw[0]) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        drawBackground.call(this);
        if (this.option.timelineVisible) {
            drawTime.call(this);
        }

        const yaxis = this.computAxis();

        this.drawMain(yaxis);

        if (this.option.showDepth) {
            this.drawDepth(yaxis);
        }

        this.drawAid();
        drawSplitLine.call(this);
    }

    this.lastState = this.state;

    requestAnimationFrame(this.draw.bind(this));
}

function drawBackground() {
    const ctx = this.ctx;
    ctx.fillStyle = this.colors.background;
    //ctx.fillRect(0, 0, this.width, this.height);
}

function drawTime() {
    const ctx = this.ctx;
}

function drawSplitLine() {
    const ctx = this.ctx;
    ctx.strokeStyle = this.colors.splitLine;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.width, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, (this.mainView.h + this.mainView.y + this.aidView.y) * 0.5);
    ctx.lineTo(
        this.width,
        (this.mainView.h + this.mainView.y + this.aidView.y) * 0.5
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.mainYaxisView.x, 0);
    ctx.lineTo(this.aidYaxisView.x, this.aidYaxisView.y + this.aidYaxisView.h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, this.timeView.y);
    ctx.lineTo(this.width, this.timeView.y);
    ctx.stroke();
}
