import domEngine from '../engine/dom.js';
import canvasEngine from '../engine/canvas.js';
import { bindEvents } from '../internal/events.js';
import play from '../internal/play.js';
import seek from '../internal/seek.js';
import { formatMode, resetSpace } from '../utils.js';

/* eslint-disable no-invalid-this */
export default function(opt) {
  this._ = {};
  this.container = opt.container || document.createElement('div');
  this.media = opt.media;
  this._.visible = true;

  /* eslint-disable no-undef */
  /* istanbul ignore next */
  if (process.env.ENGINE === 'dom') {
    this.engine = 'dom';
    this._.engine = domEngine;
  }
  /* istanbul ignore next */
  if (process.env.ENGINE === 'canvas') {
    this.engine = 'canvas';
    this._.engine = canvasEngine;
  }
  /* istanbul ignore else */
  if (!process.env.ENGINE) {
    this.engine = (opt.engine || 'DOM').toLowerCase();
    this._.engine = this.engine === 'canvas' ? canvasEngine : domEngine;
  }
  /* eslint-enable no-undef */
  this._.requestID = 0;

  this._.speed = Math.max(0, opt.speed) || 144;
  this._.duration = 4;

  this.comments = opt.comments || [];
  this.comments.sort(function(a, b) {
    return a.time - b.time;
  });
  for (var i = 0; i < this.comments.length; i++) {
    this.comments[i].mode = formatMode(this.comments[i].mode);
  }
  this._.runningList = [];
  this._.position = 0;

  this._.paused = true;
  if (this.media) {
    this._.listener = {};
    bindEvents.call(this, this._.listener);
  }

  this._.stage = this._.engine.init(this.container);
  this._.stage.style.cssText += 'position:relative;pointer-events:none;';

  this.resize();
  this.container.appendChild(this._.stage);

  this._.space = {};
  resetSpace(this._.space);

  if (!this.media || !this.media.paused) {
    seek.call(this);
    play.call(this);
  }
  return this;
}
