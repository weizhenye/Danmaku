import clear from '../internal/clear.js';
import resetRange from '../internal/resetRange.js';
import binsearch from '../util/binsearch.js';

/* eslint no-invalid-this: 0 */
export default function() {
  var ct = this._hasMedia ? this.media.currentTime : Date.now() / 1000;
  clear.call(this);
  resetRange.call(this);
  this.position = binsearch(this.comments, 'time', ct);
  return this;
}
