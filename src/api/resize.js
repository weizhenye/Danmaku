export default function(Danmaku) {
  Danmaku.prototype.resize = function() {
    if (this._hasInitContainer) {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
    }
    if (this._hasVideo &&
        (!this._hasInitContainer || !this.width || !this.height)) {
      this.width = this.media.clientWidth;
      this.height = this.media.clientHeight;
    }
    if (this._useCanvas) {
      this.stage.width = this.width;
      this.stage.height = this.height;
    } else {
      this.stage.style.width = this.width + 'px';
      this.stage.style.height = this.height + 'px';
    }
    this.duration = this.width / this._speed;
    return this;
  };
}
