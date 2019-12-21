/* eslint-disable no-invalid-this */
export default function() {
  if (this._.useCanvas) {
    this._.stage.context.clearRect(0, 0, this._.width, this._.height);
    // avoid caching canvas to reduce memory usage
    for (var i = 0; i < this._.runningList.length; i++) {
      this._.runningList[i].canvas = null;
    }
  } else {
    var lc = this._.stage.lastChild;
    while (lc) {
      this._.stage.removeChild(lc);
      lc = this._.stage.lastChild;
    }
  }
  this._.runningList = [];
  return this;
}
