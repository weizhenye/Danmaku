import allocate from '../internal/allocate.js';
import createCommentNode from '../util/commentNode.js';
import createTransform from '../util/transform.js';

/* eslint no-invalid-this: 0 */
export default function domEngine() {
  var ct = this._isMedia ? this.media.currentTime : Date.now() / 1000;
  var cmt = null;
  var i = 0;
  for (i = this.runline.length - 1; i >= 0; i--) {
    cmt = this.runline[i];
    if (ct - cmt.time > this.duration) {
      this.stage.removeChild(cmt.node);
      this.runline.splice(i, 1);
    }
  }
  var tempNodes = [];
  var df = document.createDocumentFragment();
  while (this.position < this.comments.length &&
         this.comments[this.position].time < ct) {
    cmt = this.comments[this.position];
    cmt.node = cmt.node || createCommentNode(cmt);
    this.runline.push(cmt);
    tempNodes.push(cmt);
    df.appendChild(cmt.node);
    ++this.position;
  }
  if (tempNodes.length) {
    this.stage.appendChild(df);
  }
  for (i = tempNodes.length - 1; i >= 0; i--) {
    cmt = tempNodes[i];
    cmt.width = cmt.width || cmt.node.offsetWidth;
    cmt.height = cmt.height || cmt.node.offsetHeight;
  }
  for (i = tempNodes.length - 1; i >= 0; i--) {
    cmt = tempNodes[i];
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      cmt.x = (this.width - cmt.width) >> 1;
    }
    cmt.y = allocate.call(this, cmt);
    cmt.node.style.cssText += createTransform(cmt.x, cmt.y);
  }
  for (i = this.runline.length - 1; i >= 0; i--) {
    cmt = this.runline[i];
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
    cmt.node.style.cssText += createTransform(cmt.x, cmt.y);
  }
}
