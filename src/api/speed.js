export default function(Danmaku) {
  Object.defineProperty(Danmaku.prototype, 'speed', {
    get: function() {
      return this._speed;
    },
    set: function(s) {
      if (s <= 0) {
        return this._speed;
      }
      this._speed = s;
      if (this.width) {
        this.duration = this.width / s;
      }
      return s;
    }
  });
}
