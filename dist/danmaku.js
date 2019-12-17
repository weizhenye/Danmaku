(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Danmaku = factory());
}(this, function () { 'use strict';

  /* eslint no-invalid-this: 0 */
  function allocate(cmt) {
    var that = this;
    var ct = this._hasMedia ? this.media.currentTime : Date.now() / 1000;
    var pbr = this._hasMedia ? this.media.playbackRate : 1;
    function willCollide(cr, cmt) {
      if (cmt.mode === 'top' || cmt.mode === 'bottom') {
        return ct - cr.time < that.duration;
      }
      var crTotalWidth = that.width + cr.width;
      var crElapsed = crTotalWidth * (ct - cr.time) * pbr / that.duration;
      if (cr.width > crElapsed) {
        return true;
      }
      // (rtl mode) the right end of `cr` move out of left side of stage
      var crLeftTime = that.duration + cr.time - ct;
      var cmtTotalWidth = that.width + cmt.width;
      var cmtTime = that._hasMedia ? cmt.time : cmt._utc;
      var cmtElapsed = cmtTotalWidth * (ct - cmtTime) * pbr / that.duration;
      var cmtArrival = that.width - cmtElapsed;
      // (rtl mode) the left end of `cmt` reach the left side of stage
      var cmtArrivalTime = that.duration * cmtArrival / (that.width + cmt.width);
      return crLeftTime > cmtArrivalTime;
    }
    var crs = this._space[cmt.mode];
    var last = 0;
    var curr = 0;
    for (var i = 1; i < crs.length; i++) {
      var cr = crs[i];
      var requiredRange = cmt.height;
      if (cmt.mode === 'top' || cmt.mode === 'bottom') {
        requiredRange += cr.height;
      }
      if (cr.range - cr.height - crs[last].range >= requiredRange) {
        curr = i;
        break;
      }
      if (willCollide(cr, cmt)) {
        last = i;
      }
    }
    var channel = crs[last].range;
    var crObj = {
      range: channel + cmt.height,
      time: this._hasMedia ? cmt.time : cmt._utc,
      width: cmt.width,
      height: cmt.height
    };
    crs.splice(last + 1, curr - last - 1, crObj);

    if (cmt.mode === 'bottom') {
      return this.height - cmt.height - channel % this.height;
    }
    return channel % (this.height - cmt.height);
  }

  function createCommentNode(cmt) {
    var node = document.createElement('div');
    node.style.cssText = 'position:absolute;';
    if (typeof cmt.render === 'function') {
      var $el = cmt.render();
      if ($el instanceof HTMLElement) {
        node.appendChild($el);
        return node;
      }
    }
    if (cmt.html === true) {
      node.innerHTML = cmt.text;
    } else {
      node.textContent = cmt.text;
    }
    if (cmt.style) {
      for (var key in cmt.style) {
        node.style[key] = cmt.style[key];
      }
    }
    return node;
  }

  var transform = (function() {
    var properties = [
      'oTransform', // Opera 11.5
      'msTransform', // IE 9
      'mozTransform',
      'webkitTransform',
      'transform'
    ];
    var style = document.createElement('div').style;
    for (var i = 0; i < properties.length; i++) {
      /* istanbul ignore else */
      if (properties[i] in style) {
        return properties[i];
      }
    }
    /* istanbul ignore next */
    return 'transform';
  }());

  /* eslint no-invalid-this: 0 */
  function domEngine() {
    var dn = Date.now() / 1000;
    var ct = this._hasMedia ? this.media.currentTime : dn;
    var pbr = this._hasMedia ? this.media.playbackRate : 1;
    var cmt = null;
    var cmtt = 0;
    var i = 0;
    for (i = this.runningList.length - 1; i >= 0; i--) {
      cmt = this.runningList[i];
      cmtt = this._hasMedia ? cmt.time : cmt._utc;
      if (ct - cmtt > this.duration) {
        this.stage.removeChild(cmt.node);
        /* istanbul ignore else */
        if (!this._hasMedia) {
          cmt.node = null;
        }
        this.runningList.splice(i, 1);
      }
    }
    var pendingList = [];
    var df = document.createDocumentFragment();
    while (this.position < this.comments.length) {
      cmt = this.comments[this.position];
      cmtt = this._hasMedia ? cmt.time : cmt._utc;
      if (cmtt >= ct) {
        break;
      }
      if (ct - cmtt > this.duration) {
        ++this.position;
        continue;
      }
      if (this._hasMedia) {
        cmt._utc = dn - (this.media.currentTime - cmt.time);
      }
      cmt.node = cmt.node || createCommentNode(cmt);
      this.runningList.push(cmt);
      pendingList.push(cmt);
      df.appendChild(cmt.node);
      ++this.position;
    }
    if (pendingList.length) {
      this.stage.appendChild(df);
    }
    for (i = 0; i < pendingList.length; i++) {
      cmt = pendingList[i];
      cmt.width = cmt.width || cmt.node.offsetWidth;
      cmt.height = cmt.height || cmt.node.offsetHeight;
    }
    for (i = 0; i < pendingList.length; i++) {
      cmt = pendingList[i];
      cmt.y = allocate.call(this, cmt);
      if (cmt.mode === 'top' || cmt.mode === 'bottom') {
        cmt.x = (this.width - cmt.width) >> 1;
        cmt.node.style[transform] = 'translate(' + cmt.x + 'px,' + cmt.y + 'px)';
      }
    }
    for (i = 0; i < this.runningList.length; i++) {
      cmt = this.runningList[i];
      if (cmt.mode === 'top' || cmt.mode === 'bottom') {
        continue;
      }
      var totalWidth = this.width + cmt.width;
      var elapsed = totalWidth * (dn - cmt._utc) * pbr / this.duration;
      elapsed |= 0;
      if (cmt.mode === 'ltr') cmt.x = elapsed - cmt.width;
      if (cmt.mode === 'rtl') cmt.x = this.width - elapsed;
      cmt.node.style[transform] = 'translate(' + cmt.x + 'px,' + cmt.y + 'px)';
    }
  }

  var canvasHeightCache = Object.create(null);

  function canvasHeight(font, fontSize) {
    if (canvasHeightCache[font]) {
      return canvasHeightCache[font];
    }
    var height = 12;
    // eslint-disable-next-line max-len
    var regex = /(\d+(?:\.\d+)?)(px|%|em|rem)(?:\s*\/\s*(\d+(?:\.\d+)?)(px|%|em|rem)?)?/;
    var p = font.match(regex);
    if (p) {
      var fs = p[1] * 1 || 10;
      var fsu = p[2];
      var lh = p[3] * 1 || 1.2;
      var lhu = p[4];
      if (fsu === '%') fs *= fontSize.container / 100;
      if (fsu === 'em') fs *= fontSize.container;
      if (fsu === 'rem') fs *= fontSize.root;
      if (lhu === 'px') height = lh;
      if (lhu === '%') height = fs * lh / 100;
      if (lhu === 'em') height = fs * lh;
      if (lhu === 'rem') height = fontSize.root * lh;
      if (lhu === undefined) height = fs * lh;
    }
    canvasHeightCache[font] = height;
    return height;
  }

  function createCommentCanvas(cmt, fontSize) {
    if (typeof cmt.render === 'function') {
      var cvs = cmt.render();
      if (cvs instanceof HTMLCanvasElement) {
        cmt.width = cvs.width;
        cmt.height = cvs.height;
        return cvs;
      }
    }
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var style = cmt.canvasStyle || {};
    style.font = style.font || '10px sans-serif';
    style.textBaseline = style.textBaseline || 'bottom';
    var strokeWidth = style.lineWidth * 1;
    strokeWidth = (strokeWidth > 0 && strokeWidth !== Infinity)
      ? Math.ceil(strokeWidth)
      : !!style.strokeStyle * 1;
    ctx.font = style.font;
    cmt.width = cmt.width ||
      Math.max(1, Math.ceil(ctx.measureText(cmt.text).width) + strokeWidth * 2);
    cmt.height = cmt.height ||
      Math.ceil(canvasHeight(style.font, fontSize)) + strokeWidth * 2;
    canvas.width = cmt.width;
    canvas.height = cmt.height;
    for (var key in style) {
      ctx[key] = style[key];
    }
    var baseline = 0;
    switch (style.textBaseline) {
      case 'top':
      case 'hanging':
        baseline = strokeWidth;
        break;
      case 'middle':
        baseline = cmt.height >> 1;
        break;
      default:
        baseline = cmt.height - strokeWidth;
    }
    if (style.strokeStyle) {
      ctx.strokeText(cmt.text, strokeWidth, baseline);
    }
    ctx.fillText(cmt.text, strokeWidth, baseline);
    return canvas;
  }

  /* eslint no-invalid-this: 0 */
  function canvasEngine() {
    this.stage.context.clearRect(0, 0, this.width, this.height);
    var dn = Date.now() / 1000;
    var ct = this._hasMedia ? this.media.currentTime : dn;
    var pbr = this._hasMedia ? this.media.playbackRate : 1;
    var cmt = null;
    var cmtt = 0;
    var i = 0;
    for (i = this.runningList.length - 1; i >= 0; i--) {
      cmt = this.runningList[i];
      cmtt = this._hasMedia ? cmt.time : cmt._utc;
      if (ct - cmtt > this.duration) {
        // avoid caching canvas to reduce memory usage
        cmt.canvas = null;
        this.runningList.splice(i, 1);
      }
    }
    while (this.position < this.comments.length) {
      cmt = this.comments[this.position];
      cmtt = this._hasMedia ? cmt.time : cmt._utc;
      if (cmtt >= ct) {
        break;
      }
      if (ct - cmtt > this.duration) {
        ++this.position;
        continue;
      }
      if (this._hasMedia) {
        cmt._utc = dn - (this.media.currentTime - cmt.time);
      }
      cmt.canvas = createCommentCanvas(cmt, this._fontSize);
      cmt.y = allocate.call(this, cmt);
      if (cmt.mode === 'top' || cmt.mode === 'bottom') {
        cmt.x = (this.width - cmt.width) >> 1;
      }
      this.runningList.push(cmt);
      ++this.position;
    }
    for (i = 0; i < this.runningList.length; i++) {
      cmt = this.runningList[i];
      var totalWidth = this.width + cmt.width;
      var elapsed = totalWidth * (dn - cmt._utc) * pbr / this.duration;
      if (cmt.mode === 'ltr') cmt.x = (elapsed - cmt.width + .5) | 0;
      if (cmt.mode === 'rtl') cmt.x = (this.width - elapsed + .5) | 0;
      this.stage.context.drawImage(cmt.canvas, cmt.x, cmt.y);
    }
  }

  var raf =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function(cb) {
      return setTimeout(cb, 50 / 3);
    };

  var caf =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    clearTimeout;

  /* eslint no-invalid-this: 0 */
  function play() {
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

  /* eslint no-invalid-this: 0 */
  function pause() {
    if (!this.visible || this.paused) {
      return this;
    }
    this.paused = true;
    caf(this._requestID);
    this._requestID = 0;
    return this;
  }

  function binsearch(arr, prop, key) {
    var mid = 0;
    var left = 0;
    var right = arr.length;
    while (left < right - 1) {
      mid = (left + right) >> 1;
      if (key >= arr[mid][prop]) {
        left = mid;
      } else {
        right = mid;
      }
    }
    if (arr[left] && key < arr[left][prop]) {
      return left;
    }
    return right;
  }

  function collidableRange() {
    var max = 9007199254740991;
    return [{
      range: 0,
      time: -max,
      width: max,
      height: 0
    }, {
      range: max,
      time: max,
      width: 0,
      height: 0
    }];
  }

  function resetSpace(space) {
    space.ltr = collidableRange();
    space.rtl = collidableRange();
    space.top = collidableRange();
    space.bottom = collidableRange();
  }

  /* eslint no-invalid-this: 0 */
  function seek() {
    if (!this._hasMedia) {
      return this;
    }
    this.clear();
    resetSpace(this._space);
    var position = binsearch(this.comments, 'time', this.media.currentTime);
    this.position = Math.max(0, position - 1);
    return this;
  }

  /* eslint no-invalid-this: 0 */
  function bindEvents(_) {
    _.play = play.bind(this);
    _.pause = pause.bind(this);
    _.seeking = seek.bind(this);
    this.media.addEventListener('play', _.play);
    this.media.addEventListener('pause', _.pause);
    this.media.addEventListener('seeking', _.seeking);
  }

  /* eslint no-invalid-this: 0 */
  function unbindEvents(_) {
    this.media.removeEventListener('play', _.play);
    this.media.removeEventListener('pause', _.pause);
    this.media.removeEventListener('seeking', _.seeking);
    _.play = null;
    _.pause = null;
    _.seeking = null;
  }

  function computeFontSize(el, fontSize) {
    var fs = window
      .getComputedStyle(el, null)
      .getPropertyValue('font-size')
      .match(/(.+)px/)[1] * 1;
    if (el.tagName === 'HTML') {
      fontSize.root = fs;
    } else {
      fontSize.container = fs;
    }
  }

  function formatMode(mode) {
    if (!/^(ltr|top|bottom)$/i.test(mode)) {
      return 'rtl';
    }
    return mode.toLowerCase();
  }

  function initMixin(Danmaku) {
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

  var properties = [
    // meta
    'mode', 'time',
    // both engine
    'text', 'render',
    // DOM engine
    'html', 'style',
    // canvas engine
    'canvasStyle'
  ];

  function emitMixin(Danmaku) {
    Danmaku.prototype.emit = function(obj) {
      if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
        return this;
      }
      var cmt = {};
      for (var i = 0; i < properties.length; i++) {
        if (obj[properties[i]] !== undefined) {
          cmt[properties[i]] = obj[properties[i]];
        }
      }
      cmt.text = (cmt.text || '').toString();
      cmt.mode = formatMode(cmt.mode);
      cmt._utc = Date.now() / 1000;
      if (this._hasMedia) {
        var position = 0;
        if (cmt.time === undefined) {
          cmt.time = this.media.currentTime;
          position = this.position;
        } else {
          position = binsearch(this.comments, 'time', cmt.time);
          if (position < this.position) {
            this.position += 1;
          }
        }
        this.comments.splice(position, 0, cmt);
      } else {
        this.comments.push(cmt);
      }
      return this;
    };
  }

  function clearMixin(Danmaku) {
    Danmaku.prototype.clear = function() {
      if (this._useCanvas) {
        this.stage.context.clearRect(0, 0, this.width, this.height);
        // avoid caching canvas to reduce memory usage
        for (var i = 0; i < this.runningList.length; i++) {
          this.runningList[i].canvas = null;
        }
      } else {
        var lc = this.stage.lastChild;
        while (lc) {
          this.stage.removeChild(lc);
          lc = this.stage.lastChild;
        }
      }
      this.runningList = [];
      return this;
    };
  }

  function destroyMixin(Danmaku) {
    Danmaku.prototype.destroy = function() {
      if (!this._isInited) {
        return this;
      }

      pause.call(this);
      this.clear();
      if (this._hasMedia) {
        unbindEvents.call(this, this._listener);
      }
      if (this._hasVideo && !this._hasInitContainer) {
        var isPlay = !this.media.paused;
        this.media.style.position = this.container.style.position;
        this.container.parentNode.insertBefore(this.media, this.container);
        this.container.parentNode.removeChild(this.container);
        /* istanbul ignore next  */
        if (isPlay && this.media.paused) {
          this.media.play();
        }
      }
      for (var key in this) {
        /* istanbul ignore else  */
        if (Object.prototype.hasOwnProperty.call(this, key)) {
          this[key] = null;
        }
      }
      return this;
    };
  }

  function showMixin(Danmaku) {
    Danmaku.prototype.show = function() {
      if (this.visible) {
        return this;
      }
      this.visible = true;
      if (this._hasMedia && this.media.paused) {
        return this;
      }
      seek.call(this);
      play.call(this);
      return this;
    };
  }

  function hideMixin(Danmaku) {
    Danmaku.prototype.hide = function() {
      if (!this.visible) {
        return this;
      }
      pause.call(this);
      this.clear();
      this.visible = false;
      return this;
    };
  }

  function resizeMixin(Danmaku) {
    Danmaku.prototype.resize = function() {
      if (this._hasInitContainer) {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
      }
      if (this._hasVideo &&
          (!this._hasInitContainer || !this.width || !this.height)) {
        this.width = this.media.clientWidth;
        this.height = this.media.clientHeight;
      }
      if (this._useCanvas) {
        this.stage.width = this.width;
        this.stage.height = this.height;
      } else {
        this.stage.style.width = this.width + 'px';
        this.stage.style.height = this.height + 'px';
      }
      this.duration = this.width / this._speed;
      return this;
    };
  }

  function speedMixin(Danmaku) {
    Object.defineProperty(Danmaku.prototype, 'speed', {
      get: function() {
        return this._speed;
      },
      set: function(s) {
        if (typeof s !== 'number' ||
            isNaN(s) ||
            !isFinite(s) ||
            s <= 0) {
          return this._speed;
        }
        this._speed = s;
        if (this.width) {
          this.duration = this.width / s;
        }
        return s;
      }
    });
  }

  function Danmaku(opt) {
    this._isInited = false;
    opt && this.init(opt);
  }

  initMixin(Danmaku);
  emitMixin(Danmaku);
  clearMixin(Danmaku);
  destroyMixin(Danmaku);
  showMixin(Danmaku);
  hideMixin(Danmaku);
  resizeMixin(Danmaku);
  speedMixin(Danmaku);

  return Danmaku;

}));
