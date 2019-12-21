import play from '../internal/play.js';
import seek from '../internal/seek.js';

/* eslint-disable no-invalid-this */
export default function() {
  if (this._.visible) {
    return this;
  }
  this._.visible = true;
  if (this.media && this.media.paused) {
    return this;
  }
  seek.call(this);
  play.call(this);
  return this;
}
