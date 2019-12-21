import { bindEvents } from '../internal/events.js';
import play from '../internal/play.js';
import seek from '../internal/seek.js';
import { computeFontSize } from '../util/fontSize.js';
import formatMode from '../util/formatMode.js';
import { resetSpace } from '../util/space.js';

/* eslint-disable no-invalid-this */
export default function(opt) {
  this.container = opt.container || document.createElement('div');
  this.media = opt.media;
  this.visible = true;

  this.engine = (opt.engine || 'DOM').toLowerCase();
  this._useCanvas = (this.engine === 'canvas');
  this._requestID = 0;

  this._speed = Math.max(0, opt.speed) || 144;
  this.duration = 4;

  this.comments = opt.comments || [];
  this.comments.sort(function(a, b) {
    return a.time - b.time;
  });
  for (var i = 0; i < this.comments.length; i++) {
    this.comments[i].mode = formatMode(this.comments[i].mode);
  }
  this.runningList = [];
  this.position = 0;

  this.paused = true;
  if (this.media) {
    this._listener = {};
    bindEvents.call(this, this._listener);
  }

  if (this._useCanvas) {
    this.stage = document.createElement('canvas');
    this.stage.context = this.stage.getContext('2d');
  } else {
    this.stage = document.createElement('div');
    this.stage.style.cssText =
      'overflow:hidden;white-space:nowrap;transform:translateZ(0);';
  }
  this.stage.style.cssText += 'position:relative;pointer-events:none;';

  this.resize();
  this.container.appendChild(this.stage);

  this._space = {};
  resetSpace(this._space);
  this._fontSize = {
    root: 16,
    container: 16
  };
  computeFontSize(document.getElementsByTagName('html')[0], this._fontSize);
  computeFontSize(this.container, this._fontSize);

  if (!this.media || !this.media.paused) {
    seek.call(this);
    play.call(this);
  }
  return this;
}
