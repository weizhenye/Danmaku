import allocate from '../internal/allocate.js';
import createCommentCanvas from '../util/commentCanvas.js';

/* eslint no-invalid-this: 0 */
export default function() {
  this._.stage.context.clearRect(0, 0, this._.width, this._.height);
  var dn = Date.now() / 1000;
  var ct = this.media ? this.media.currentTime : dn;
  var pbr = this.media ? this.media.playbackRate : 1;
  var cmt = null;
  var cmtt = 0;
  var i = 0;
  for (i = this._.runningList.length - 1; i >= 0; i--) {
    cmt = this._.runningList[i];
    cmtt = this.media ? cmt.time : cmt._utc;
    if (ct - cmtt > this._.duration) {
      // avoid caching canvas to reduce memory usage
      cmt.canvas = null;
      this._.runningList.splice(i, 1);
    }
  }
  while (this._.position < this.comments.length) {
    cmt = this.comments[this._.position];
    cmtt = this.media ? cmt.time : cmt._utc;
    if (cmtt >= ct) {
      break;
    }
    if (ct - cmtt > this._.duration) {
      ++this._.position;
      continue;
    }
    if (this.media) {
      cmt._utc = dn - (this.media.currentTime - cmt.time);
    }
    cmt.canvas = createCommentCanvas(cmt, this._.fontSize);
    cmt.y = allocate.call(this, cmt);
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      cmt.x = (this._.width - cmt.width) >> 1;
    }
    this._.runningList.push(cmt);
    ++this._.position;
  }
  for (i = 0; i < this._.runningList.length; i++) {
    cmt = this._.runningList[i];
    var totalWidth = this._.width + cmt.width;
    var elapsed = totalWidth * (dn - cmt._utc) * pbr / this._.duration;
    if (cmt.mode === 'ltr') cmt.x = (elapsed - cmt.width + .5) | 0;
    if (cmt.mode === 'rtl') cmt.x = (this._.width - elapsed + .5) | 0;
    this._.stage.context.drawImage(cmt.canvas, cmt.x, cmt.y);
  }
}
