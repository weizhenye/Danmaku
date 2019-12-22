var canvasHeightCache = Object.create(null);

export function canvasHeight(font, fontSize) {
  if (canvasHeightCache[font]) {
    return canvasHeightCache[font];
  }
  var height = 12;
  var regex = /(\d+(?:\.\d+)?)(px|%|em|rem)(?:\s*\/\s*(\d+(?:\.\d+)?)(px|%|em|rem)?)?/;
  var p = font.match(regex);
  if (p) {
    var fs = p[1] * 1 || 10;
    var fsu = p[2];
    var lh = p[3] * 1 || 1.2;
    var lhu = p[4];
    if (fsu === '%') fs *= fontSize.container / 100;
    if (fsu === 'em') fs *= fontSize.container;
    if (fsu === 'rem') fs *= fontSize.root;
    if (lhu === 'px') height = lh;
    if (lhu === '%') height = fs * lh / 100;
    if (lhu === 'em') height = fs * lh;
    if (lhu === 'rem') height = fontSize.root * lh;
    if (lhu === undefined) height = fs * lh;
  }
  canvasHeightCache[font] = height;
  return height;
}

export function createCommentCanvas(cmt, fontSize) {
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
  var style = cmt.style || {};
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

export function computeFontSize(el) {
  return window
    .getComputedStyle(el, null)
    .getPropertyValue('font-size')
    .match(/(.+)px/)[1] * 1;
}

export function init(container) {
  var stage = document.createElement('canvas');
  stage.context = stage.getContext('2d');
  stage._fontSize = {
    root: computeFontSize(document.getElementsByTagName('html')[0]),
    container: computeFontSize(container)
  };
  return stage;
}

export function clear(stage, comments) {
  stage.context.clearRect(0, 0, stage.width, stage.height);
  // avoid caching canvas to reduce memory usage
  for (var i = 0; i < comments.length; i++) {
    comments[i].canvas = null;
  }
}

export function resize() {
  //
}

export function framing(stage) {
  stage.context.clearRect(0, 0, stage.width, stage.height);
}

export function setup(stage, comments) {
  for (var i = 0; i < comments.length; i++) {
    var cmt = comments[i];
    cmt.canvas = createCommentCanvas(cmt, stage._fontSize);
  }
}

export function render(stage, cmt) {
  stage.context.drawImage(cmt.canvas, cmt.x, cmt.y);
}

export function remove(stage, cmt) {
  // avoid caching canvas to reduce memory usage
  cmt.canvas = null;
}

export default {
  name: 'canvas',
  init: init,
  clear: clear,
  resize: resize,
  framing: framing,
  setup: setup,
  render: render,
  remove: remove,
};
