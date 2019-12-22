/* eslint-disable no-invalid-this */
export default function() {
  this._.engine.clear(this._.stage, this._.runningList);
  this._.runningList = [];
  return this;
}
