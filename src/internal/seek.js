import clear from '../internal/clear.js';
import binsearch from '../util/binsearch.js';
import {resetSpace} from '../util/space.js';

/* eslint no-invalid-this: 0 */
export default function() {
  var ct = this._hasMedia ? this.media.currentTime : Date.now() / 1000;
  clear.call(this);
  resetSpace();
  this.position = binsearch(this.comments, 'time', ct);
  return this;
}
