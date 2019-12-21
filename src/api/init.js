import { bindEvents } from '../internal/events.js';
import play from '../internal/play.js';
import seek from '../internal/seek.js';
import { computeFontSize } from '../util/fontSize.js';
import formatMode from '../util/formatMode.js';
import { resetSpace } from '../util/space.js';

/* eslint-disable no-invalid-this */
export default function(opt) {
  this._ = {};
  this.container = opt.container || document.createElement('div');
  this.media = opt.media;
  this._.visible = true;

  this.engine = (opt.engine || 'DOM').toLowerCase();
  this._.useCanvas = (this.engine === 'canvas');
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

  if (this._.useCanvas) {
    this._.stage = document.createElement('canvas');
    this._.stage.context = this._.stage.getContext('2d');
  } else {
    this._.stage = document.createElement('div');
    this._.stage.style.cssText =
      'overflow:hidden;white-space:nowrap;transform:translateZ(0);';
  }
  this._.stage.style.cssText += 'position:relative;pointer-events:none;';

  this.resize();
  this.container.appendChild(this._.stage);

  this._.space = {};
  resetSpace(this._.space);
  this._.fontSize = {
    root: 16,
    container: 16
  };
  computeFontSize(document.getElementsByTagName('html')[0], this._.fontSize);
  computeFontSize(this.container, this._.fontSize);

  if (!this.media || !this.media.paused) {
    seek.call(this);
    play.call(this);
  }
  return this;
}
