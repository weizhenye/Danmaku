import allocate from '../internal/allocate.js';
import createCommentNode from '../util/commentNode.js';
import {transform} from '../util/transform.js';

/* eslint no-invalid-this: 0 */
export default function() {
  var ct = this._hasMedia ? this.media.currentTime : Date.now() / 1000;
  var cmt = null;
  var i = 0;
  for (i = this.runningList.length - 1; i >= 0; i--) {
    cmt = this.runningList[i];
    if (ct - cmt.time > this.duration) {
      this.stage.removeChild(cmt.node);
      if (!this._hasMedia) {
        cmt.node = null;
      }
      this.runningList.splice(i, 1);
    }
  }
  var pendingList = [];
  var df = document.createDocumentFragment();
  while (this.position < this.comments.length &&
         this.comments[this.position].time < ct) {
    cmt = this.comments[this.position];
    cmt.node = cmt.node || createCommentNode(cmt);
    this.runningList.push(cmt);
    pendingList.push(cmt);
    df.appendChild(cmt.node);
    ++this.position;
  }
  if (pendingList.length) {
    this.stage.appendChild(df);
  }
  for (i = pendingList.length - 1; i >= 0; i--) {
    cmt = pendingList[i];
    cmt.width = cmt.width || cmt.node.offsetWidth;
    cmt.height = cmt.height || cmt.node.offsetHeight;
  }
  for (i = pendingList.length - 1; i >= 0; i--) {
    cmt = pendingList[i];
    cmt.y = allocate.call(this, cmt);
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      cmt.x = (this.width - cmt.width) >> 1;
      cmt.node.style[transform] = 'translate(' + cmt.x + 'px,' + cmt.y + 'px)';
    }
  }
  for (i = this.runningList.length - 1; i >= 0; i--) {
    cmt = this.runningList[i];
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      continue;
    }
    var elapsed = (this.width + cmt.width) * (ct - cmt.time) / this.duration;
    elapsed |= 0;
    if (cmt.mode === 'ltr') {
      cmt.x = elapsed - cmt.width;
    }
    if (cmt.mode === 'rtl') {
      cmt.x = this.width - elapsed;
    }
    cmt.node.style[transform] = 'translate(' + cmt.x + 'px,' + cmt.y + 'px)';
  }
}
