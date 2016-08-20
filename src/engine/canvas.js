import allocate from '../internal/allocate.js';
import createCommentCanvas from '../util/commentCanvas.js';

/* eslint no-invalid-this: 0 */
export default function canvasEngine() {
  this.stage.context.clearRect(0, 0, this.width, this.height);
  var ct = this._isMedia ? this.media.currentTime : Date.now() / 1000;
  var cmt = null;
  var i = 0;
  for (i = this.runline.length - 1; i >= 0; i--) {
    cmt = this.runline[i];
    if (ct - cmt.time > this.duration) {
      cmt.canvas = null;
      this.runline.splice(i, 1);
    }
  }
  while (this.position < this.comments.length &&
         this.comments[this.position].time < ct) {
    cmt = this.comments[this.position];
    cmt.canvas = createCommentCanvas(cmt);
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      cmt.x = (this.width - cmt.width) >> 1;
    }
    cmt.y = allocate.call(this, cmt);
    this.runline.push(cmt);
    ++this.position;
  }
  for (i = this.runline.length - 1; i >= 0; i--) {
    cmt = this.runline[i];
    var elapsed = (this.width + cmt.width) * (ct - cmt.time) / this.duration;
    if (cmt.mode === 'ltr') {
      cmt.x = (elapsed - cmt.width + .5) | 0;
    }
    if (cmt.mode === 'rtl') {
      cmt.x = (this.width - elapsed + .5) | 0;
    }
    this.stage.context.drawImage(cmt.canvas, cmt.x, cmt.y);
  }
}
