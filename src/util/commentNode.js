export default function(cmt) {
  var node = document.createElement('div');
  node.textContent = cmt.text;
  node.style.cssText = 'position:absolute;white-space:nowrap;';
  if (cmt.style) {
    for (var key in cmt.style) {
      node.style[key] = cmt.style[key];
    }
  }
  return node;
}
