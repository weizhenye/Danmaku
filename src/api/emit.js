import formatMode from '../util/formatMode.js';
import binsearch from '../util/binsearch.js';

export default function(Danmaku) {
  Danmaku.prototype.emit = function(cmt) {
    if (!cmt || Object.prototype.toString.call(cmt) !== '[object Object]') {
      return this;
    }
    cmt.text = (cmt.text || '').toString();
    cmt.mode = formatMode(cmt.mode);
    cmt._utc = Date.now() / 1000;
    if (this._hasMedia) {
      if (cmt.time === undefined) {
        cmt.time = this.media.currentTime;
      }
      var position = binsearch(this.comments, 'time', cmt.time) + 1;
      this.comments.splice(position, 0, cmt);
    } else {
      this.comments.push(cmt);
    }
    return this;
  };
}
