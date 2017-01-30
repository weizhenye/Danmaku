import domEngine from '../engine/dom.js';
import canvasEngine from '../engine/canvas.js';
import {raf} from '../util/animationFrame.js';

/* eslint no-invalid-this: 0 */
export default function() {
  if (!this.visible || !this.paused) {
    return this;
  }
  this.paused = false;
  if (this._hasMedia) {
    for (var i = 0; i < this.runningList.length; i++) {
      var cmt = this.runningList[i];
      cmt._utc = Date.now() / 1000 - (this.media.currentTime - cmt.time);
    }
  }
  var that = this;
  var engine = this._useCanvas ? canvasEngine : domEngine;
  function frame() {
    engine.call(that);
    that._requestID = raf(frame);
  }
  this._requestID = raf(frame);
  return this;
}
