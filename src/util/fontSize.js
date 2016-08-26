export var containerFontSize = 16;

export var rootFontSize = 16;

export function computeFontSize(el) {
  var fs = window
    .getComputedStyle(el, null)
    .getPropertyValue('font-size')
    .match(/(.+)px/)[1] * 1;
  if (el.tagName === 'HTML') {
    rootFontSize = fs;
  } else {
    containerFontSize = fs;
  }
}
