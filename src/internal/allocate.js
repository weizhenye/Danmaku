/* eslint no-invalid-this: 0 */
export default function(cmt) {
  var that = this;
  var ct = this._hasMedia ? this.media.currentTime : Date.now() / 1000;
  var pbr = this._hasMedia ? this.media.playbackRate : 1;
  function willCollide(cr, cmt) {
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      return ct - cr.time < that.duration;
    }
    var crTotalWidth = that.width + cr.width;
    var crElapsed = crTotalWidth * (ct - cr.time) * pbr / that.duration;
    if (cr.width > crElapsed) {
      return true;
    }
    // (rtl mode) the right end of `cr` move out of left side of stage
    var crLeftTime = that.duration + cr.time - ct;
    var cmtTotalWidth = that.width + cmt.width;
    var cmtTime = that._hasMedia ? cmt.time : cmt._utc;
    var cmtElapsed = cmtTotalWidth * (ct - cmtTime) * pbr / that.duration;
    var cmtArrival = that.width - cmtElapsed;
    // (rtl mode) the left end of `cmt` reach the left side of stage
    var cmtArrivalTime = that.duration * cmtArrival / (that.width + cmt.width);
    return crLeftTime > cmtArrivalTime;
  }
  var crs = this._space[cmt.mode];
  var last = 0;
  var curr = 0;
  for (var i = 1; i < crs.length; i++) {
    var cr = crs[i];
    var requiredRange = cmt.height;
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      requiredRange += cr.height;
    }
    if (cr.range - cr.height - crs[last].range >= requiredRange) {
      curr = i;
      break;
    }
    if (willCollide(cr, cmt)) {
      last = i;
    }
  }
  var channel = crs[last].range;
  var crObj = {
    range: channel + cmt.height,
    time: this._hasMedia ? cmt.time : cmt._utc,
    width: cmt.width,
    height: cmt.height
  };
  crs.splice(last + 1, curr - last - 1, crObj);

  if (cmt.mode === 'bottom') {
    return this.height - cmt.height - channel % this.height;
  }
  return channel % (this.height - cmt.height);
}
