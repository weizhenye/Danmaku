import play from '../internal/play.js';
import seek from '../internal/seek.js';

/* eslint-disable no-invalid-this */
export default function() {
  if (this.visible) {
    return this;
  }
  this.visible = true;
  if (this._hasMedia && this.media.paused) {
    return this;
  }
  seek.call(this);
  play.call(this);
  return this;
}
