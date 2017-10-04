import {unbindEvents} from '../internal/events.js';
import pause from '../internal/pause.js';

export default function(Danmaku) {
  Danmaku.prototype.destroy = function() {
    if (!this._isInited) {
      return this;
    }

    pause.call(this);
    this.clear();
    if (this._hasMedia) {
      unbindEvents.call(this, this._listener);
    }
    if (this._hasVideo && !this._hasInitContainer) {
      var isPlay = !this.media.paused;
      this.media.style.position = this.container.style.position;
      this.container.parentNode.insertBefore(this.media, this.container);
      this.container.parentNode.removeChild(this.container);
      /* istanbul ignore next  */
      if (isPlay && this.media.paused) {
        this.media.play();
      }
    }
    for (var key in this) {
      /* istanbul ignore else  */
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = null;
      }
    }
    return this;
  };
}
