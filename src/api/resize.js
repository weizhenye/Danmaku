/* eslint-disable no-invalid-this */
export default function() {
  this._.width = this.container.offsetWidth;
  this._.height = this.container.offsetHeight;
  this._.engine.resize(this._.stage, this._.width, this._.height);
  this._.duration = this._.width / this._.speed;
  return this;
}
