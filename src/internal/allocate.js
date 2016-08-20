/* eslint no-invalid-this: 0 */
export default function(cmt) {
  var that = this;
  var ct = this._isMedia ? this.media.currentTime : Date.now() / 1000;
  var abbr = '_' + cmt.mode;
  var crLen = this[abbr].length;
  var last = 0;
  var curr = 0;
  function willCollide(cr, cmt) {
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      return ct - cr.time < that.duration;
    }
    var elapsed = (that.width + cr.width) * (ct - cr.time) / that.duration;
    var crTime = that.duration + cr.time - ct;
    var cmtTime = that.duration * that.width / (that.width + cmt.width);
    return (crTime > cmtTime) || (cr.width > elapsed);
  }
  for (var i = 1; i < crLen; i++) {
    var cr = this[abbr][i];
    var requiredRange = cmt.height;
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      requiredRange += cr.height;
    }
    if (cr.range - this[abbr][last].range > requiredRange) {
      curr = i;
      break;
    }
    if (willCollide(cr, cmt)) {
      last = i;
    }
  }
  var channel = this[abbr][last].range;
  var crObj = {
    range: channel + cmt.height,
    time: cmt.time,
    width: cmt.width,
    height: cmt.height
  };
  this[abbr].splice(last + 1, curr - last - 1, crObj);

  if (cmt.mode === 'bottom') {
    return this.height - cmt.height - channel % this.height;
  }
  return channel % (this.height - cmt.height);
}
