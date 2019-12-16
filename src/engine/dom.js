import allocate from '../internal/allocate.js';
import createCommentNode from '../util/commentNode.js';
import {transform} from '../util/transform.js';

/* eslint no-invalid-this: 0 */
export default function() {
  var dn = Date.now() / 1000;
  var ct = this._hasMedia ? this.media.currentTime : dn;
  var pbr = this._hasMedia ? this.media.playbackRate : 1;
  var cmt = null;
  var cmtt = 0;
  var i = 0;
  for (i = this.runningList.length - 1; i >= 0; i--) {
    cmt = this.runningList[i];
    cmtt = this._hasMedia ? cmt.time : cmt._utc;
    if (ct - cmtt > this.duration) {
      this.stage.removeChild(cmt.node);
      /* istanbul ignore else */
      if (!this._hasMedia) {
        cmt.node = null;
      }
      this.runningList.splice(i, 1);
    }
  }
  var pendingList = [];
  var df = document.createDocumentFragment();
  while (this.position < this.comments.length) {
    cmt = this.comments[this.position];
    cmtt = this._hasMedia ? cmt.time : cmt._utc;
    if (cmtt >= ct) {
      break;
    }
    if (ct - cmtt > this.duration) {
      ++this.position;
      continue;
    }
    if (this._hasMedia) {
      cmt._utc = dn - (this.media.currentTime - cmt.time);
    }
    cmt.node = cmt.node || createCommentNode(cmt);
    this.runningList.push(cmt);
    pendingList.push(cmt);
    df.appendChild(cmt.node);
    ++this.position;
  }
  if (pendingList.length) {
    this.stage.appendChild(df);
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
      cmt.x = (this.width - cmt.width) >> 1;
      cmt.node.style[transform] = 'translate(' + cmt.x + 'px,' + cmt.y + 'px)';
    }
  }
  for (i = 0; i < this.runningList.length; i++) {
    cmt = this.runningList[i];
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      continue;
    }
    var totalWidth = this.width + cmt.width;
    var elapsed = totalWidth * (dn - cmt._utc) * pbr / this.duration;
    elapsed |= 0;
    if (cmt.mode === 'ltr') cmt.x = elapsed - cmt.width;
    if (cmt.mode === 'rtl') cmt.x = this.width - elapsed;
    cmt.node.style[transform] = 'translate(' + cmt.x + 'px,' + cmt.y + 'px)';
  }
}
