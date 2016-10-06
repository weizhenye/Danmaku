import canvasHeight from './canvasHeight.js';

export default function(cmt) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var font = (cmt.canvasStyle && cmt.canvasStyle.font) || '10px sans-serif';
  ctx.font = font;
  cmt.width = cmt.width || Math.max((ctx.measureText(cmt.text).width | 0), 1);
  cmt.height = cmt.height || (canvasHeight(font) | 0);
  canvas.width = cmt.width;
  canvas.height = cmt.height;
  ctx.textBaseline = 'bottom';
  var baseline = cmt.height;
  if (cmt.canvasStyle) {
    for (var key in cmt.canvasStyle) {
      ctx[key] = cmt.canvasStyle[key];
    }
    switch (cmt.canvasStyle.textBaseline) {
      case 'top':
      case 'hanging':
        baseline = 0;
        break;
      case 'middle':
        baseline = cmt.height >> 1;
        break;
      default:
        baseline = cmt.height;
    }
    if (cmt.canvasStyle.strokeStyle) {
      ctx.strokeText(cmt.text, 0, baseline);
    }
  }
  ctx.fillText(cmt.text, 0, baseline);
  return canvas;
}
