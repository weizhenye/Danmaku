import clear from '../internal/clear.js';
import binsearch from '../util/binsearch.js';
import {resetSpace} from '../util/space.js';

/* eslint no-invalid-this: 0 */
export default function() {
  if (!this._hasMedia) {
    return this;
  }
  clear.call(this);
  resetSpace();
  var position = binsearch(this.comments, 'time', this.media.currentTime);
  this.position = Math.max(0, position - 1);
  return this;
}
