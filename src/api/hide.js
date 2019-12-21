import pause from '../internal/pause.js';

/* eslint-disable no-invalid-this */
export default function() {
  if (!this.visible) {
    return this;
  }
  pause.call(this);
  this.clear();
  this.visible = false;
  return this;
}
