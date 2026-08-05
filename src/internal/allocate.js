import { now } from '../utils.js';

/* eslint no-invalid-this: 0 */
export default function(cmt) {
  var that = this;
  var ct = this.media ? this.media.currentTime : now() / 1000;
  function willCollide(cr, cmt) {
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      return ct - cr.time < that._.duration;
    }
    // `ct`, `cr.time` and `that._.duration` all live on the same timeline
    // (media time when bound to a media element, wall-clock time otherwise),
    // so `ct - cr.time` is already the elapsed travelling time on it.
    // Scaling it by `playbackRate` would count the rate twice.
    var crTotalWidth = that._.width + cr.width;
    var crElapsed = crTotalWidth * (ct - cr.time) / that._.duration;
    if (cr.width > crElapsed) {
      return true;
    }
    // (rtl mode) the right end of `cr` move out of left side of stage
    var crLeftTime = that._.duration + cr.time - ct;
    var cmtTotalWidth = that._.width + cmt.width;
    var cmtTime = that.media ? cmt.time : cmt._utc;
    var cmtElapsed = cmtTotalWidth * (ct - cmtTime) / that._.duration;
    var cmtArrival = that._.width - cmtElapsed;
    // (rtl mode) the left end of `cmt` reach the left side of stage
    var cmtArrivalTime = that._.duration * cmtArrival / (that._.width + cmt.width);
    return crLeftTime > cmtArrivalTime;
  }
  var crs = this._.space[cmt.mode];
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
    time: this.media ? cmt.time : cmt._utc,
    width: cmt.width,
    height: cmt.height
  };
  crs.splice(last + 1, curr - last - 1, crObj);

  if (cmt.mode === 'bottom') {
    return this._.height - cmt.height - channel % this._.height;
  }
  return channel % (this._.height - cmt.height);
}
