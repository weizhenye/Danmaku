import allocate from '../internal/allocate.js';
import { now } from '../utils.js';

/* eslint no-invalid-this: 0 */
export default function(framing, setup, render, remove) {
  return function(_timestamp) {
    framing(this._.stage);
    var timestamp = _timestamp;
    if (typeof timestamp === 'undefined') {
      timestamp = now();
    }
    var dn = timestamp / 1000;
    var ct = this.media ? this.media.currentTime : dn;
    var pbr = this.media ? this.media.playbackRate : 1;
    var cmt = null;
    var cmtt = 0;
    var i = 0;
    for (i = this._.runningList.length - 1; i >= 0; i--) {
      cmt = this._.runningList[i];
      cmtt = this.media ? cmt.time : cmt._utc;
      if (ct - cmtt > this._.duration) {
        remove(this._.stage, cmt);
        this._.runningList.splice(i, 1);
      }
    }
    var pendingList = [];
    while (this._.position < this.comments.length) {
      cmt = this.comments[this._.position];
      cmtt = this.media ? cmt.time : cmt._utc;
      if (cmtt >= ct) {
        break;
      }
      // when clicking controls to seek, media.currentTime may changed before
      // `pause` event is fired, so here skips comments out of duration,
      // see https://github.com/weizhenye/Danmaku/pull/30 for details.
      if (ct - cmtt > this._.duration) {
        ++this._.position;
        continue;
      }
      if (this.media) {
        cmt._utc = dn - (this.media.currentTime - cmt.time);
      }
      pendingList.push(cmt);
      ++this._.position;
    }
    setup(this._.stage, pendingList);
    for (i = 0; i < pendingList.length; i++) {
      cmt = pendingList[i];
      cmt.y = allocate.call(this, cmt);
      this._.runningList.push(cmt);
    }
    for (i = 0; i < this._.runningList.length; i++) {
      cmt = this._.runningList[i];
      var totalWidth = this._.width + cmt.width;
      var elapsed = totalWidth * (dn - cmt._utc) * pbr / this._.duration;
      if (cmt.mode === 'ltr') cmt.x = elapsed - cmt.width;
      if (cmt.mode === 'rtl') cmt.x = this._.width - elapsed;
      if (cmt.mode === 'top' || cmt.mode === 'bottom') {
        cmt.x = (this._.width - cmt.width) >> 1;
      }
      render(this._.stage, cmt);
    }
  };
}
