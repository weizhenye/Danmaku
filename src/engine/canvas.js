import allocate from '../internal/allocate.js';
import createCommentCanvas from '../util/commentCanvas.js';

/* eslint no-invalid-this: 0 */
export default function() {
  this.stage.context.clearRect(0, 0, this.width, this.height);
  var ct = this._hasMedia ? this.media.currentTime : Date.now() / 1000;
  var cmt = null;
  var i = 0;
  for (i = this.runningList.length - 1; i >= 0; i--) {
    cmt = this.runningList[i];
    if (ct - cmt.time > this.duration) {
      cmt.canvas = null;
      this.runningList.splice(i, 1);
    }
  }
  while (this.position < this.comments.length &&
         this.comments[this.position].time < ct) {
    cmt = this.comments[this.position];
    cmt.canvas = createCommentCanvas(cmt);
    cmt.y = allocate.call(this, cmt);
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      cmt.x = (this.width - cmt.width) >> 1;
    }
    this.runningList.push(cmt);
    ++this.position;
  }
  var len = this.runningList.length;
  for (i = 0; i < len; i++) {
    cmt = this.runningList[i];
    var elapsed = (this.width + cmt.width) * (ct - cmt.time) / this.duration;
    if (cmt.mode === 'ltr') cmt.x = (elapsed - cmt.width + .5) | 0;
    if (cmt.mode === 'rtl') cmt.x = (this.width - elapsed + .5) | 0;
    this.stage.context.drawImage(cmt.canvas, cmt.x, cmt.y);
  }
}
