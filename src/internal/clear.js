/* eslint no-invalid-this: 0 */
export default function() {
  if (this._useCanvas) {
    this.stage.context.clearRect(0, 0, this.width, this.height);
    for (var i = this.runline.length - 1; i >= 0; i--) {
      this.runline[i].canvas = null;
    }
  } else {
    var lc = this.stage.lastChild;
    while (lc) {
      this.stage.removeChild(lc);
      lc = this.stage.lastChild;
    }
  }
  this.runline = [];
  return this;
}
