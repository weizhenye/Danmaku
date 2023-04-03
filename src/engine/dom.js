var transform = (function() {
  /* istanbul ignore next */
  if (typeof document === 'undefined') return 'transform';
  var properties = [
    'oTransform', // Opera 11.5
    'msTransform', // IE 9
    'mozTransform',
    'webkitTransform',
    'transform'
  ];
  var style = document.createElement('div').style;
  for (var i = 0; i < properties.length; i++) {
    /* istanbul ignore else */
    if (properties[i] in style) {
      return properties[i];
    }
  }
  /* istanbul ignore next */
  return 'transform';
}());

export function createCommentNode(cmt) {
  var node = document.createElement('div');
  node.style.cssText = 'position:absolute;';
  if (typeof cmt.render === 'function') {
    var $el = cmt.render();
    if ($el instanceof HTMLElement) {
      node.appendChild($el);
      return node;
    }
  }
  node.textContent = cmt.text;
  if (cmt.style) {
    for (var key in cmt.style) {
      node.style[key] = cmt.style[key];
    }
  }
  return node;
}

export function init() {
  var stage = document.createElement('div');
  stage.style.cssText = 'overflow:hidden;white-space:nowrap;transform:translateZ(0);';
  return stage;
}

export function clear(stage) {
  var lc = stage.lastChild;
  while (lc) {
    stage.removeChild(lc);
    lc = stage.lastChild;
  }
}

export function resize(stage, width, height) {
  stage.style.width = width + 'px';
  stage.style.height = height + 'px';
}

export function framing() {
  //
}

export function setup(stage, comments) {
  var df = document.createDocumentFragment();
  var i = 0;
  var cmt = null;
  for (i = 0; i < comments.length; i++) {
    cmt = comments[i];
    cmt.node = cmt.node || createCommentNode(cmt);
    df.appendChild(cmt.node);
  }
  if (comments.length) {
    stage.appendChild(df);
  }
  for (i = 0; i < comments.length; i++) {
    cmt = comments[i];
    cmt.width = cmt.width || cmt.node.offsetWidth;
    cmt.height = cmt.height || cmt.node.offsetHeight;
  }
}

export function render(stage, cmt) {
  cmt.node.style[transform] = 'translate(' + cmt.x + 'px,' + cmt.y + 'px)';
}

/* eslint no-invalid-this: 0 */
export function remove(stage, cmt) {
  stage.removeChild(cmt.node);
  /* istanbul ignore else */
  if (!this.media) {
    cmt.node = null;
  }
}

export default {
  name: 'dom',
  init: init,
  clear: clear,
  resize: resize,
  framing: framing,
  setup: setup,
  render: render,
  remove: remove,
};
