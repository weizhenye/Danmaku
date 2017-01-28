export default function(cmt) {
  var node = document.createElement('div');
  if (cmt.html === true) {
    node.innerHTML = cmt.text;
  } else {
    node.textContent = cmt.text;
  }
  node.style.cssText = 'position:absolute;';
  if (cmt.style) {
    for (var key in cmt.style) {
      node.style[key] = cmt.style[key];
    }
  }
  return node;
}
