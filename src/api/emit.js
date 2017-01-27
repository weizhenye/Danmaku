import formatMode from '../util/formatMode.js';
import binsearch from '../util/binsearch.js';

export default function(Danmaku) {
  Danmaku.prototype.emit = function(obj) {
    if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
      return this;
    }
    var cmt = JSON.parse(JSON.stringify(obj));
    cmt.text = (cmt.text || '').toString();
    cmt.mode = formatMode(cmt.mode);
    cmt._utc = Date.now() / 1000;
    if (this._hasMedia) {
      var position = 0;
      if (cmt.time === undefined) {
        cmt.time = this.media.currentTime;
        position = this.position;
      } else {
        position = binsearch(this.comments, 'time', cmt.time);
      }
      this.comments.splice(position, 0, cmt);
    } else {
      this.comments.push(cmt);
    }
    return this;
  };
}
