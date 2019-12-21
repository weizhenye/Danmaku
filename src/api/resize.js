/* eslint-disable no-invalid-this */
export default function() {
  this._.width = this.container.offsetWidth;
  this._.height = this.container.offsetHeight;
  if (this._.useCanvas) {
    this._.stage.width = this._.width;
    this._.stage.height = this._.height;
  } else {
    this._.stage.style.width = this._.width + 'px';
    this._.stage.style.height = this._.height + 'px';
  }
  this._.duration = this._.width / this._.speed;
  return this;
}
