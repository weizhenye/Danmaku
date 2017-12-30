import canvasHeight from './canvasHeight.js';

export default function(cmt, fontSize) {
  if (typeof cmt.render === 'function') {
    var cvs = cmt.render();
    if (cvs instanceof HTMLCanvasElement) {
      cmt.width = cvs.width;
      cmt.height = cvs.height;
      return cvs;
    }
  }
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var style = cmt.canvasStyle || {};
  style.font = style.font || '10px sans-serif';
  style.textBaseline = style.textBaseline || 'bottom';
  var strokeWidth = style.lineWidth * 1;
  strokeWidth = (strokeWidth > 0 && strokeWidth !== Infinity)
    ? Math.ceil(strokeWidth)
    : !!style.strokeStyle * 1;
  ctx.font = style.font;
  cmt.width = cmt.width ||
    Math.max(1, Math.ceil(ctx.measureText(cmt.text).width) + strokeWidth * 2);
  cmt.height = cmt.height ||
    Math.ceil(canvasHeight(style.font, fontSize)) + strokeWidth * 2;
  canvas.width = cmt.width;
  canvas.height = cmt.height;
  for (var key in style) {
    ctx[key] = style[key];
  }
  var baseline = 0;
  switch (style.textBaseline) {
    case 'top':
    case 'hanging':
      baseline = strokeWidth;
      break;
    case 'middle':
      baseline = cmt.height >> 1;
      break;
    default:
      baseline = cmt.height - strokeWidth;
  }
  if (style.strokeStyle) {
    ctx.strokeText(cmt.text, strokeWidth, baseline);
  }
  ctx.fillText(cmt.text, strokeWidth, baseline);
  return canvas;
}
