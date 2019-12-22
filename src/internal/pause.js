import { caf } from '../utils.js';

/* eslint no-invalid-this: 0 */
export default function() {
  if (!this._.visible || this._.paused) {
    return this;
  }
  this._.paused = true;
  caf(this._.requestID);
  this._.requestID = 0;
  return this;
}
