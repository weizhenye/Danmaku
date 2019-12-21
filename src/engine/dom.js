import allocate from '../internal/allocate.js';
import createCommentNode from '../util/commentNode.js';
import { transform } from '../util/transform.js';

/* eslint no-invalid-this: 0 */
export default function() {
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
      this._.stage.removeChild(cmt.node);
      /* istanbul ignore else */
      if (!this.media) {
        cmt.node = null;
      }
      this._.runningList.splice(i, 1);
    }
  }
  var pendingList = [];
  var df = document.createDocumentFragment();
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
    cmt.node = cmt.node || createCommentNode(cmt);
    this._.runningList.push(cmt);
    pendingList.push(cmt);
    df.appendChild(cmt.node);
    ++this._.position;
  }
  if (pendingList.length) {
    this._.stage.appendChild(df);
  }
  for (i = 0; i < pendingList.length; i++) {
    cmt = pendingList[i];
    cmt.width = cmt.width || cmt.node.offsetWidth;
    cmt.height = cmt.height || cmt.node.offsetHeight;
  }
  for (i = 0; i < pendingList.length; i++) {
    cmt = pendingList[i];
    cmt.y = allocate.call(this, cmt);
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      cmt.x = (this._.width - cmt.width) >> 1;
      cmt.node.style[transform] = 'translate(' + cmt.x + 'px,' + cmt.y + 'px)';
    }
  }
  for (i = 0; i < this._.runningList.length; i++) {
    cmt = this._.runningList[i];
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      continue;
    }
    var totalWidth = this._.width + cmt.width;
    var elapsed = totalWidth * (dn - cmt._utc) * pbr / this._.duration;
    elapsed |= 0;
    if (cmt.mode === 'ltr') cmt.x = elapsed - cmt.width;
    if (cmt.mode === 'rtl') cmt.x = this._.width - elapsed;
    cmt.node.style[transform] = 'translate(' + cmt.x + 'px,' + cmt.y + 'px)';
  }
}
