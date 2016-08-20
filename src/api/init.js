import play from '../internal/play.js';
import pause from '../internal/pause.js';
import seek from '../internal/seek.js';
import resetRange from '../internal/resetRange.js';
import formatMode from '../util/formatMode.js';

export default function(Danmaku) {
  Danmaku.prototype.init = function(opt) {
    if (this._isInited) {
      return this;
    }

    if (!opt.video && !opt.container) {
      throw new Error('Danmaku requires container when initializing.');
    }
    this.container = opt.container;
    this.visible = true;

    this.engine = (opt.engine || 'DOM').toLowerCase();
    this._useCanvas = (this.engine === 'canvas');
    this._requestID = 0;

    this._speed = Math.max(0, opt.speed) || 144;
    this.duration = 4;

    this.comments = JSON.parse(JSON.stringify(opt.comments || []));
    this.comments.sort(function(a, b) {
      return a.time - b.time;
    });
    for (var i = this.comments.length - 1; i >= 0; i--) {
      this.comments[i].mode = formatMode(this.comments[i].mode);
    }
    this.runline = [];
    this.position = 0;

    this.paused = true;
    this.media = opt.video || opt.audio;
    this._isMedia = !!this.media;
    this._isVideo = !!opt.video;
    if (this._isVideo && !this.container) {
      this._hasInitContainer = false;
      var isPlay = !this.media.paused;
      this.container = document.createElement('div');
      this.container.style.position = this.media.style.position;
      this.media.style.position = 'absolute';
      this.media.parentNode.insertBefore(this.container, this.media);
      this.container.appendChild(this.media);
      if (isPlay && this.media.paused) {
        this.media.play();
      }
    }
    if (this._isMedia) {
      this.media.addEventListener('play', play.bind(this));
      this.media.addEventListener('pause', pause.bind(this));
      this.media.addEventListener('seeking', seek.bind(this));
    }

    if (this._useCanvas) {
      this.stage = document.createElement('canvas');
      this.stage.context = this.stage.getContext('2d');
      this.stage.style.cssText = 'pointer-events:none;position:absolute;';
    } else {
      this.stage = document.createElement('div');
      this.stage.style.cssText = 'position:relative;overflow:hidden;' +
        'pointer-events:none;transform:translateZ(0);';
    }

    this.resize();
    this.container.appendChild(this.stage);
    if (!this._isMedia || !this.media.paused) {
      seek.call(this);
      play.call(this);
    }
    resetRange.call(this);
    this._isInited = true;
    return this;
  };
}
