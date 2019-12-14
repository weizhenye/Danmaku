var canvasHeightCache = Object.create(null);

export default function(font, fontSize) {
  if (canvasHeightCache[font]) {
    return canvasHeightCache[font];
  }
  var height = 12;
  // eslint-disable-next-line max-len
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
