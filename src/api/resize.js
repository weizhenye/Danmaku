/* eslint-disable no-invalid-this */
export default function() {
  this.width = this.container.offsetWidth;
  this.height = this.container.offsetHeight;
  if (this._useCanvas) {
    this.stage.width = this.width;
    this.stage.height = this.height;
  } else {
    this.stage.style.width = this.width + 'px';
    this.stage.style.height = this.height + 'px';
  }
  this.duration = this.width / this._speed;
  return this;
}
