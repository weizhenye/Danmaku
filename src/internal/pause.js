import {caf} from '../util/animationFrame.js';

/* eslint no-invalid-this: 0 */
export default function() {
  if (!this.visible || this.paused) {
    return this;
  }
  this.paused = true;
  caf(this._requestID);
  this._requestID = 0;
  return this;
}
