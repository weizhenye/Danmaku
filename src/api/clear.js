export default function(Danmaku) {
  Danmaku.prototype.clear = function() {
    if (this._useCanvas) {
      this.stage.context.clearRect(0, 0, this.width, this.height);
      // avoid caching canvas to reduce memory usage
      for (var i = 0; i < this.runningList.length; i++) {
        this.runningList[i].canvas = null;
      }
    } else {
      var lc = this.stage.lastChild;
      while (lc) {
        this.stage.removeChild(lc);
        lc = this.stage.lastChild;
      }
    }
    this.runningList = [];
    return this;
  };
}
