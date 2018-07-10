export default (ele: HTMLElement, styles: object) => {
  Object.keys(styles).forEach(key => {
    ele.style[key] = styles[key];
  });
};
