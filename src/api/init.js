import {bindEvents} from '../internal/events.js';
import play from '../internal/play.js';
import seek from '../internal/seek.js';
import {computeFontSize} from '../util/fontSize.js';
import formatMode from '../util/formatMode.js';
import {resetSpace} from '../util/space.js';

export default function(Danmaku) {
  Danmaku.prototype.init = function(opt) {
    if (this._isInited) {
      return this;
    }

    if (
      !opt || (
        !opt.container &&
        (!opt.video || (opt.video && !opt.video.parentNode))
      )
    ) {
      throw new Error('Danmaku requires container when initializing.');
    }
    this._hasInitContainer = !!opt.container;
    this.container = opt.container;
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
    this.media = opt.video || opt.audio;
    this._hasMedia = !!this.media;
    this._hasVideo = !!opt.video;
    if (this._hasVideo && !this._hasInitContainer) {
      var isPlay = !this.media.paused;
      this.container = document.createElement('div');
      this.container.style.position = this.media.style.position;
      this.media.style.position = 'absolute';
      this.media.parentNode.insertBefore(this.container, this.media);
      this.container.appendChild(this.media);
      // In Webkit/Blink, making a change to video element will pause the video.
      if (isPlay && this.media.paused) {
        this.media.play();
      }
    }
    if (this._hasMedia) {
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

    if (!this._hasMedia || !this.media.paused) {
      seek.call(this);
      play.call(this);
    }
    this._isInited = true;
    return this;
  };
}
