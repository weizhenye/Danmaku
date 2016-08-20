import formatMode from '../util/formatMode.js';
import binsearch from '../util/binsearch.js';

export default function(Danmaku) {
  Danmaku.prototype.emit = function(cmt) {
    cmt.mode = formatMode(cmt.mode);
    if (this._isMedia) {
      var ct = this.media.currentTime;
      cmt.time = cmt.time || ct;
      this.comments.splice(binsearch(this.comments, 'time', ct) + 1, 0, cmt);
    } else {
      cmt.time = Date.now() / 1000;
      this.comments.push(cmt);
    }
    return this;
  };
}
