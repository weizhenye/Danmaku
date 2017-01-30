import allocate from '../internal/allocate.js';
import createCommentCanvas from '../util/commentCanvas.js';

/* eslint no-invalid-this: 0 */
export default function() {
  this.stage.context.clearRect(0, 0, this.width, this.height);
  var dn = Date.now() / 1000;
  var ct = this._hasMedia ? this.media.currentTime : dn;
  var pbr = this._hasMedia ? this.media.playbackRate : 1;
  var cmt = null;
  var cmtt = 0;
  var i = 0;
  for (i = 0; i < this.runningList.length; i++) {
    cmt = this.runningList[i];
    cmtt = this._hasMedia ? cmt.time : cmt._utc;
    if (ct - cmtt > this.duration) {
      // avoid caching canvas to reduce memory usage
      cmt.canvas = null;
      this.runningList.splice(i, 1);
    }
  }
  while (this.position < this.comments.length) {
    cmt = this.comments[this.position];
    cmtt = this._hasMedia ? cmt.time : cmt._utc;
    if (cmtt >= ct) {
      break;
    }
    cmt._utc = Date.now() / 1000;
    cmt.canvas = createCommentCanvas(cmt);
    cmt.y = allocate.call(this, cmt);
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      cmt.x = (this.width - cmt.width) >> 1;
    }
    this.runningList.push(cmt);
    ++this.position;
  }
  for (i = 0; i < this.runningList.length; i++) {
    cmt = this.runningList[i];
    var totalWidth = this.width + cmt.width;
    var elapsed = totalWidth * (dn - cmt._utc) * pbr / this.duration;
    if (cmt.mode === 'ltr') cmt.x = (elapsed - cmt.width + .5) | 0;
    if (cmt.mode === 'rtl') cmt.x = (this.width - elapsed + .5) | 0;
    this.stage.context.drawImage(cmt.canvas, cmt.x, cmt.y);
  }
}
