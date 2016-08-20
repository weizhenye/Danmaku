import pause from '../internal/pause.js';
import clear from '../internal/clear.js';

export default function(Danmaku) {
  Danmaku.prototype.hide = function() {
    if (!this.visible) {
      return this;
    }
    pause.call(this);
    clear.call(this);
    this.visible = false;
    return this;
  };
}
