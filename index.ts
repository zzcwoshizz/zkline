import { KLine } from './src';

const app: HTMLElement = document.getElementById('app');

const kline: KLine = new KLine(app, {
  background: '#345678',
});

console.log(kline);
