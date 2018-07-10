import setStyle from './utils/setStyle';
import Chart from './Chart';

interface IKLineOptions {
  background: string;
  dpr?: number;
}

const defaultOptions = {
  dpr: 1,
};

export class KLine {
  public ele: HTMLElement;
  public options: IKLineOptions;
  public width: number;
  public height: number;
  public charts: Chart[] = [];

  constructor(ele: HTMLElement, options: IKLineOptions) {
    // 初始化根元素
    this._initElement(ele);

    // 设置options
    this._setOptions(options);

    // 设置style
    this._setStyle();

    // 添加图表
    const chart1 = new Chart(this.width, this.height, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: this.width * this.options.dpr,
      height: this.height * this.options.dpr,
    });
    this._appendChart(chart1);
    const chart2 = new Chart(this.width, this.height, {
      position: 'absolute',
      top: 0,
      left: 0,
    });
    this._appendChart(chart2);
  }

  private _initElement(ele: HTMLElement) {
    this.ele = ele;

    this.width = ele.clientWidth;
    this.height = ele.clientHeight;
  }

  private _setOptions(options: IKLineOptions) {
    if (!options.hasOwnProperty('background')) {
      throw new Error('Must has property background');
    }
    this.options = { ...defaultOptions, ...options };
  }

  private _setStyle() {
    setStyle(this.ele, {
      background: this.options.background,
      position: 'relative',
    });
  }

  private _appendChart(chart: Chart) {
    chart.appendTo(this.ele);
    this.charts.push(chart);
  }
}
