export default function(cmt) {
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
