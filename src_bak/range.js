export function moveRange(distance) {
    const [startIndex, endIndex] = this.state.range;
    const verticalRectNumber = endIndex - startIndex;
    let newStartIndex = startIndex - distance;
    let newEndIndex = endIndex - distance;
    if (newStartIndex > this.state.times.length - 10) {
        newStartIndex = this.state.times.length - 10;
        newEndIndex = newStartIndex + verticalRectNumber;
    }
    if (newStartIndex < -verticalRectNumber + 10) {
        newStartIndex = -verticalRectNumber + 10;
        newEndIndex = 10;
    }
    this.state = { ...this.state, range: [newStartIndex, newEndIndex] };
}

export function scaleRange(n, currentIndex) {
    const [startIndex, endIndex] = this.state.range;
    currentIndex += startIndex;
    const verticalRectNumber = endIndex - startIndex;
    let newRange;
    if (n > 0) {
        if (n > 10) {
            n = 10 * (1 + (n - 10) / (n * 0.5));
        }
        let distance = n * (currentIndex - startIndex) / verticalRectNumber
        newRange = [
            startIndex - distance,
            endIndex + (endIndex - currentIndex) / (currentIndex - startIndex) * distance,
        ];
    } else {
        if (n < -10) {
            n = -10 * (1 + (n + 10) / (n * 0.5));
        }
        let distance = n * (currentIndex - startIndex) / verticalRectNumber;
        newRange = [
            startIndex - distance,
            endIndex + (endIndex - currentIndex) / (currentIndex - startIndex) * distance,
        ];
    }
    if (newRange[1] - newRange[0] > this.maxVerticalRectNumber) {
        newRange = [
            newRange[0] + (newRange[1] - newRange[0] - this.maxVerticalRectNumber) * (currentIndex - startIndex) / verticalRectNumber,
            newRange[1] - (newRange[1] - newRange[0] - this.maxVerticalRectNumber) * (endIndex - currentIndex) / verticalRectNumber,
        ];
    }
    if(newRange[1] - newRange[0] < this.minVerticalRectNumber) {
        newRange = [
            newRange[0] - (this.minVerticalRectNumber - newRange[1] + newRange[0]) * (currentIndex - startIndex) / verticalRectNumber,
            newRange[0] - (this.minVerticalRectNumber - newRange[1] + newRange[0]) * (currentIndex - startIndex) / verticalRectNumber + this.minVerticalRectNumber,
        ];
    }
    if (newRange[0] > this.state.times.length - 10) {
        newRange = [this.state.times.length - 10, this.state.times.length - 10 + (newRange[1] - newRange[0])];
    }
    if (newRange[0] < -(newRange[1] - newRange[0]) + 10) {
        newRange = [-(newRange[1] - newRange[0]) + 10, 10];
    }
    this.state = { ...this.state, range: newRange };
}
