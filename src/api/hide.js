import pause from '../internal/pause.js';

export default function(Danmaku) {
  Danmaku.prototype.hide = function() {
    if (!this.visible) {
      return this;
    }
    pause.call(this);
    this.clear();
    this.visible = false;
    return this;
  };
}
