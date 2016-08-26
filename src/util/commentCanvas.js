import canvasHeight from './canvasHeight.js';

export default function(cmt) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var font = (cmt.canvasStyle && cmt.canvasStyle.font) || '10px sans-serif';
  ctx.font = font;
  canvas.width = cmt.width || ((ctx.measureText(cmt.text).width + .5) | 0);
  canvas.height = cmt.height || ((canvasHeight(font) + .5) | 0);
  cmt.width = canvas.width;
  cmt.height = canvas.height;
  if (cmt.canvasStyle) {
    for (var key in cmt.canvasStyle) {
      ctx[key] = cmt.canvasStyle[key];
    }
  }
  ctx.textBaseline = 'hanging';
  if (cmt.canvasStyle && cmt.canvasStyle.strokeStyle) {
    ctx.strokeText(cmt.text, 0, 0);
  }
  ctx.fillText(cmt.text, 0, 0);
  return canvas;
}
