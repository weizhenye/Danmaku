import domEngine from '../engine/dom.js';
import canvasEngine from '../engine/canvas.js';
import {raf} from '../util/animationFrame.js';

/* eslint no-invalid-this: 0 */
export default function() {
  if (!this.visible || !this.paused) {
    return this;
  }
  var that = this;
  var engine = this._useCanvas ? canvasEngine : domEngine;
  function frame() {
    engine.call(that);
    that._requestID = raf(frame);
  }
  this.paused = false;
  this._requestID = raf(frame);
  return this;
}
