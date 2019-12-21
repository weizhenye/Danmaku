import pause from '../internal/pause.js';

/* eslint-disable no-invalid-this */
export default function() {
  if (!this._.visible) {
    return this;
  }
  pause.call(this);
  this.clear();
  this._.visible = false;
  return this;
}
