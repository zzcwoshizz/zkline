import setStyle from '../utils/setStyle';

interface IChart {
  width: number;
  height: number;
}

export default class Chart implements IChart {
  public width: number;
  public height: number;
  public style: object;

  constructor(width: number, height: number, style: object = {}) {
    if (width === undefined) {
      throw new Error('Must has property width');
    }
    if (height === undefined) {
      throw new Error('Must has property height');
    }
    this.width = width;
    this.height = height;
    this.style = style;
  }

  /**
   * appendTo
   */
  public appendTo(ele: HTMLElement) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    setStyle(canvas, this.style);
    ele.appendChild(canvas);
  }
}
