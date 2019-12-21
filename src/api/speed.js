export default {
  get: function() {
    return this._.speed;
  },
  set: function(s) {
    if (typeof s !== 'number' ||
      isNaN(s) ||
      !isFinite(s) ||
      s <= 0) {
      return this._.speed;
    }
    this._.speed = s;
    if (this._.width) {
      this._.duration = this._.width / s;
    }
    return s;
  }
};
