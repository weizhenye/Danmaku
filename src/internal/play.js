import domEngine from '../engine/dom.js';
import canvasEngine from '../engine/canvas.js';
import { raf } from '../util/animationFrame.js';

/* eslint no-invalid-this: 0 */
export default function() {
  if (!this._.visible || !this._.paused) {
    return this;
  }
  this._.paused = false;
  if (this.media) {
    for (var i = 0; i < this._.runningList.length; i++) {
      var cmt = this._.runningList[i];
      cmt._utc = Date.now() / 1000 - (this.media.currentTime - cmt.time);
    }
  }
  var that = this;
  var engine = this._.useCanvas ? canvasEngine : domEngine;
  function frame() {
    engine.call(that);
    that._.requestID = raf(frame);
  }
  this._.requestID = raf(frame);
  return this;
}
