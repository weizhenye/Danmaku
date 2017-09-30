export function computeFontSize(el, fontSize) {
  var fs = window
    .getComputedStyle(el, null)
    .getPropertyValue('font-size')
    .match(/(.+)px/)[1] * 1;
  if (el.tagName === 'HTML') {
    fontSize.root = fs;
  } else {
    fontSize.container = fs;
  }
}
