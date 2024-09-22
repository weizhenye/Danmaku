import createEngine from '../engine/index.js';
import { raf, now } from '../utils.js';

/* eslint no-invalid-this: 0 */
export default function() {
  if (!this._.visible || !this._.paused) {
    return this;
  }
  this._.paused = false;
  if (this.media) {
    for (var i = 0; i < this._.runningList.length; i++) {
      var cmt = this._.runningList[i];
      cmt._utc = now() / 1000 - (this.media.currentTime - cmt.time);
    }
  }
  var that = this;
  var engine = createEngine(
    this._.engine.framing.bind(this),
    this._.engine.setup.bind(this),
    this._.engine.render.bind(this),
    this._.engine.remove.bind(this)
  );
  function frame(timestamp) {
    engine.call(that, timestamp);
    that._.requestID = raf(frame);
  }
  this._.requestID = raf(frame);
  return this;
}
