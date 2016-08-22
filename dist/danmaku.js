(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Danmaku = factory());
}(this, (function () { 'use strict';

/* eslint no-invalid-this: 0 */
function allocate(cmt) {
  var that = this;
  var ct = this._hasMedia ? this.media.currentTime : Date.now() / 1000;
  var abbr = '_' + cmt.mode;
  var crLen = this[abbr].length;
  var last = 0;
  var curr = 0;
  function willCollide(cr, cmt) {
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      return ct - cr.time < that.duration;
    }
    var elapsed = (that.width + cr.width) * (ct - cr.time) / that.duration;
    var crTime = that.duration + cr.time - ct;
    var cmtTime = that.duration * that.width / (that.width + cmt.width);
    return (crTime > cmtTime) || (cr.width > elapsed);
  }
  for (var i = 1; i < crLen; i++) {
    var cr = this[abbr][i];
    var requiredRange = cmt.height;
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      requiredRange += cr.height;
    }
    if (cr.range - this[abbr][last].range > requiredRange) {
      curr = i;
      break;
    }
    if (willCollide(cr, cmt)) {
      last = i;
    }
  }
  var channel = this[abbr][last].range;
  var crObj = {
    range: channel + cmt.height,
    time: cmt.time,
    width: cmt.width,
    height: cmt.height
  };
  this[abbr].splice(last + 1, curr - last - 1, crObj);

  if (cmt.mode === 'bottom') {
    return this.height - cmt.height - channel % this.height;
  }
  return channel % (this.height - cmt.height);
}

function createCommentNode(cmt) {
  var node = document.createElement('div');
  node.textContent = cmt.text;
  node.style.cssText = 'position:absolute;white-space:nowrap;';
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
  for (var i = properties.length - 1; i >= 0; i--) {
    if (properties[i] in style) {
      return properties[i];
    }
  }
  return 'transform';
}());

/* eslint no-invalid-this: 0 */
function domEngine() {
  var ct = this._hasMedia ? this.media.currentTime : Date.now() / 1000;
  var cmt = null;
  var i = 0;
  for (i = this.runningList.length - 1; i >= 0; i--) {
    cmt = this.runningList[i];
    if (ct - cmt.time > this.duration) {
      this.stage.removeChild(cmt.node);
      if (!this._hasMedia) {
        cmt.node = null;
      }
      this.runningList.splice(i, 1);
    }
  }
  var pendingList = [];
  var df = document.createDocumentFragment();
  while (this.position < this.comments.length &&
         this.comments[this.position].time < ct) {
    cmt = this.comments[this.position];
    cmt.node = cmt.node || createCommentNode(cmt);
    this.runningList.push(cmt);
    pendingList.push(cmt);
    df.appendChild(cmt.node);
    ++this.position;
  }
  if (pendingList.length) {
    this.stage.appendChild(df);
  }
  for (i = pendingList.length - 1; i >= 0; i--) {
    cmt = pendingList[i];
    cmt.width = cmt.width || cmt.node.offsetWidth;
    cmt.height = cmt.height || cmt.node.offsetHeight;
  }
  for (i = pendingList.length - 1; i >= 0; i--) {
    cmt = pendingList[i];
    cmt.y = allocate.call(this, cmt);
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      cmt.x = (this.width - cmt.width) >> 1;
      cmt.node.style[transform] = 'translate(' + cmt.x + 'px,' + cmt.y + 'px)';
    }
  }
  for (i = this.runningList.length - 1; i >= 0; i--) {
    cmt = this.runningList[i];
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      continue;
    }
    var elapsed = (this.width + cmt.width) * (ct - cmt.time) / this.duration;
    elapsed |= 0;
    if (cmt.mode === 'ltr') {
      cmt.x = elapsed - cmt.width;
    }
    if (cmt.mode === 'rtl') {
      cmt.x = this.width - elapsed;
    }
    cmt.node.style[transform] = 'translate(' + cmt.x + 'px,' + cmt.y + 'px)';
  }
}

function createCommentCanvas(cmt) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var font = (cmt.canvasStyle && cmt.canvasStyle.font) || '10px sans-serif';
  ctx.font = font;
  canvas.width = cmt.width || ((ctx.measureText(cmt.text).width + .5) | 0);
  canvas.height = cmt.height || ((font.match(/(\d+)px/)[1] * 1.2 + .5) | 0);
  cmt.width = canvas.width;
  cmt.height = canvas.height;
  if (cmt.canvasStyle) {
    for (var key in cmt.canvasStyle) {
      ctx[key] = cmt.canvasStyle[key];
    }
  }
  ctx.textBaseline = 'top';
  ctx.strokeText(cmt.text, 0, 0);
  ctx.fillText(cmt.text, 0, 0);
  return canvas;
}

/* eslint no-invalid-this: 0 */
function canvasEngine() {
  this.stage.context.clearRect(0, 0, this.width, this.height);
  var ct = this._hasMedia ? this.media.currentTime : Date.now() / 1000;
  var cmt = null;
  var i = 0;
  for (i = this.runningList.length - 1; i >= 0; i--) {
    cmt = this.runningList[i];
    if (ct - cmt.time > this.duration) {
      cmt.canvas = null;
      this.runningList.splice(i, 1);
    }
  }
  while (this.position < this.comments.length &&
         this.comments[this.position].time < ct) {
    cmt = this.comments[this.position];
    cmt.canvas = createCommentCanvas(cmt);
    cmt.y = allocate.call(this, cmt);
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      cmt.x = (this.width - cmt.width) >> 1;
    }
    this.runningList.push(cmt);
    ++this.position;
  }
  var len = this.runningList.length;
  for (i = 0; i < len; i++) {
    cmt = this.runningList[i];
    var elapsed = (this.width + cmt.width) * (ct - cmt.time) / this.duration;
    if (cmt.mode === 'ltr') {
      cmt.x = (elapsed - cmt.width + .5) | 0;
    }
    if (cmt.mode === 'rtl') {
      cmt.x = (this.width - elapsed + .5) | 0;
    }
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

/* eslint no-invalid-this: 0 */
function clear() {
  if (this._useCanvas) {
    this.stage.context.clearRect(0, 0, this.width, this.height);
    for (var i = this.runningList.length - 1; i >= 0; i--) {
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

/* eslint no-invalid-this: 0 */
function resetRange() {
  this._ltr = collidableRange();
  this._rtl = collidableRange();
  this._top = collidableRange();
  this._bottom = collidableRange();
}

function binsearch(a, k, t) {
  var m = 0;
  var l = 0;
  var r = a.length;
  while (l < r) {
    m = (l + r) >> 1;
    if (t <= a[m][k]) {
      r = m - 1;
    } else {
      l = m + 1;
    }
  }
  return Math.max(0, r);
}

/* eslint no-invalid-this: 0 */
function seek() {
  var ct = this._hasMedia ? this.media.currentTime : Date.now() / 1000;
  clear.call(this);
  resetRange.call(this);
  this.position = binsearch(this.comments, 'time', ct);
  return this;
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
    this.runningList = [];
    this.position = 0;

    this.paused = true;
    this.media = opt.video || opt.audio;
    this._hasMedia = !!this.media;
    this._hasVideo = !!opt.video;
    if (this._hasVideo && !this.container) {
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
    if (this._hasMedia) {
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
    if (!this._hasMedia || !this.media.paused) {
      seek.call(this);
      play.call(this);
    }
    resetRange.call(this);
    this._isInited = true;
    return this;
  };
}

function emitMixin(Danmaku) {
  Danmaku.prototype.emit = function(cmt) {
    cmt.mode = formatMode(cmt.mode);
    if (this._hasMedia) {
      var ct = this.media.currentTime;
      cmt.time = cmt.time || ct;
      this.comments.splice(binsearch(this.comments, 'time', ct) + 1, 0, cmt);
    } else {
      cmt.time = Date.now() / 1000;
      this.comments.push(cmt);
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
    clear.call(this);
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
      if (s <= 0) {
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
showMixin(Danmaku);
hideMixin(Danmaku);
resizeMixin(Danmaku);
speedMixin(Danmaku);

return Danmaku;

})));