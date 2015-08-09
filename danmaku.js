(function(window) {
'use strict';

function Danmaku() {
  this.paused = true;
  this.isHide = false;
  this.initContainer = true;
  this.duration = 4;
  this._speed = 144;
  this.requestID = 0;
  this.position = 0;
  this.runline = [];
  this.comments = [];
  this._resetRange();
}

Danmaku.prototype.init = function(opt) {
  var that = this;
  if (!opt.video && !opt.container) {
    console.error('Container required.');
    return;
  }
  this.comments = JSON.parse(JSON.stringify(opt.comments || []));
  this.comments.sort(function(a, b) {
    return a.time - b.time;
  });
  for (var i = this.comments.length - 1; i >= 0; i--) {
    formatMode(this.comments[i]);
  }
  this.container = opt.container;
  this.media = opt.video || opt.audio;
  this.engine = (opt.engine || 'DOM').toLowerCase();
  this.useCanvas = (this.engine === 'canvas');
  this.isMedia = this.media ? true : false;
  this.isVideo = opt.video ? true : false;
  if (this.isMedia) {
    this.media.addEventListener('play', function() { that._play(); });
    this.media.addEventListener('pause', function() { that._pause(); });
    this.media.addEventListener('seeking', function() { that._seek(); });
  }
  if (this.isVideo && !this.container) {
    var isPlay = !this.media.paused;
    this.container = document.createElement('div');
    this.initContainer = false;
    this.container.style.position = this.media.style.position;
    this.media.style.position = 'absolute';
    this.media.parentNode.insertBefore(this.container, this.media);
    this.container.appendChild(this.media);
    if (isPlay && this.media.paused) this.media.play();
  }
  if (this.useCanvas) {
    this.stage = document.createElement('canvas');
    this.stage.context = this.stage.getContext('2d');
    this.stage.style.cssText = 'pointer-events:none;position:absolute;';
  } else {
    this.stage = document.createElement('div');
    this.stage.style.cssText = 'position:relative;overflow:hidden;' +
                               'pointer-events:none;transform:translateZ(0);';
  }
  this.stage.className = 'Danmaku-stage';
  this.resize();
  this.container.appendChild(this.stage);
  if (!this.isMedia || !this.media.paused) {
    this._seek();
    this._play();
  }
  return this;
};
Danmaku.prototype.show = function() {
  if (!this.isHide) return this;
  this.isHide = false;
  this._seek();
  this._play();
  return this;
};
Danmaku.prototype.hide = function() {
  if (this.isHide) return this;
  this._pause();
  this._clear();
  this.isHide = true;
  return this;
};
Danmaku.prototype.resize = function() {
  if (this.initContainer) {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
  }
  if (this.isVideo && (!this.initContainer || !this.width || !this.height)) {
    this.width = this.media.clientWidth;
    this.height = this.media.clientHeight;
  }
  if (this.useCanvas) {
    this.stage.width = this.width;
    this.stage.height = this.height;
  } else {
    this.stage.style.width = this.width + 'px';
    this.stage.style.height = this.height + 'px';
  }
  this.duration = this.width / this._speed;
  return this;
};
Danmaku.prototype.emit = function(cmt) {
  formatMode(cmt);
  if (this.isMedia) {
    var ct = this.media.currentTime;
    cmt.time = cmt.time || ct;
    this.comments.splice(binsearch(this.comments, ct) + 1, 0, cmt);
  } else {
    cmt.time = new Date().getTime() / 1000;
    this.comments.push(cmt);
  }
  return this;
};
Object.defineProperty(Danmaku.prototype, 'speed', {
  get: function() {
    return this._speed;
  },
  set: function(s) {
    if (this.width) this.duration = this.width / s;
    this._speed = s;
  }
});
Danmaku.prototype._play = function() {
  if (this.isHide || !this.paused) return;
  this.paused = false;
  var that = this;
  function domEngine() {
    var ct = that.isMedia ?
             that.media.currentTime :
             new Date().getTime() / 1000;
    for (var i = that.runline.length - 1; i >= 0; i--) {
      var cmt = that.runline[i];
      if (ct - cmt.time > that.duration) {
        that.stage.removeChild(cmt.node);
        that.runline.splice(i, 1);
      }
    }
    var tempNodes = [],
        df = document.createDocumentFragment();
    while (that.position < that.comments.length &&
           that.comments[that.position].time < ct) {
      var cmt = that.comments[that.position];
      cmt.node = cmt.node || createCommentNode(cmt);
      that.runline.push(cmt);
      tempNodes.push(cmt);
      df.appendChild(cmt.node);
      ++that.position;
    }
    if (tempNodes.length) {
      that.stage.appendChild(df);
    }
    for (var i = tempNodes.length - 1; i >= 0; i--) {
      var cmt = tempNodes[i];
      cmt.width = cmt.width || cmt.node.offsetWidth;
      cmt.height = cmt.height || cmt.node.offsetHeight;
    }
    for (var i = tempNodes.length - 1; i >= 0; i--) {
      var cmt = tempNodes[i];
      if (cmt.mode === 'top' || cmt.mode === 'bottom') {
        cmt.x = (that.width - cmt.width) >> 1;
      }
      cmt.y = that._getY(cmt);
      cmt.node.style.cssText += createTransformString(cmt.x, cmt.y);
    }
    for (var i = that.runline.length - 1; i >= 0; i--) {
      var cmt = that.runline[i];
      if (cmt.mode === 'top' || cmt.mode === 'bottom') continue;
      var elapsed = (that.width + cmt.width) * (ct - cmt.time) / that.duration;
      if (cmt.mode === 'ltr') cmt.x = elapsed - cmt.width;
      if (cmt.mode === 'rtl') cmt.x = that.width - elapsed;
      cmt.node.style.cssText += createTransformString(cmt.x, cmt.y);
    }
    that.requestID = RAF(domEngine);
  }
  function canvasEngine() {
    var ct = that.isMedia ?
             that.media.currentTime :
             new Date().getTime() / 1000;
    that.stage.context.clearRect(0, 0, that.width, that.height);
    for (var i = that.runline.length - 1; i >= 0; i--) {
      var cmt = that.runline[i];
      if (ct - cmt.time > that.duration) {
        cmt.canvas = null;
        that.runline.splice(i, 1);
      }
    }
    while (that.position < that.comments.length &&
           that.comments[that.position].time < ct) {
      var cmt = that.comments[that.position];
      cmt.canvas = createCommentCanvas(cmt);
      if (cmt.mode === 'top' || cmt.mode === 'bottom') {
        cmt.x = (that.width - cmt.width) >> 1;
      }
      cmt.y = that._getY(cmt);
      that.runline.push(cmt);
      ++that.position;
    }
    for (var i = that.runline.length - 1; i >= 0; i--) {
      var cmt = that.runline[i];
      var elapsed = (that.width + cmt.width) * (ct - cmt.time) / that.duration;
      if (cmt.mode === 'ltr') cmt.x = (elapsed - cmt.width + .5) | 0;
      if (cmt.mode === 'rtl') cmt.x = (that.width - elapsed + .5) | 0;
      that.stage.context.drawImage(cmt.canvas, cmt.x, cmt.y);
    }
    that.requestID = RAF(canvasEngine);
  }
  this.requestID = this.useCanvas ? RAF(canvasEngine) : RAF(domEngine);
};
Danmaku.prototype._pause = function() {
  if (this.isHide || this.paused) return;
  this.paused = true;
  CAF(this.requestID);
  this.requestID = 0;
};
Danmaku.prototype._seek = function() {
  var ct = this.isMedia ?
           this.media.currentTime :
           new Date().getTime() / 1000;
  this._clear();
  this._resetRange();
  this.position = binsearch(this.comments, ct);
};
Danmaku.prototype._clear = function() {
  if (this.useCanvas) {
    this.stage.context.clearRect(0, 0, this.width, this.height);
    for (var i = this.runline.length - 1; i >= 0; i--) {
      this.runline[i].canvas = null;
    }
  } else {
    var lc = this.stage.lastChild;
    while (lc) {
      this.stage.removeChild(lc);
      lc = this.stage.lastChild;
    }
  }
  this.runline = [];
};
Danmaku.prototype._getY = function(cmt) {
  var that = this,
      ct = this.isMedia ?
           this.media.currentTime :
           new Date().getTime() / 1000,
      abbr = '_' + cmt.mode,
      crLen = this[abbr].length,
      last = 0,
      curr = 0;
  var willCollide = function(cr, cmt) {
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      return ct - cr.time < that.duration;
    } else {
      var elapsed = (that.width + cr.width) * (ct - cr.time) / that.duration,
          crTime = that.duration + cr.time - ct,
          cmtTime = that.duration * that.width / (that.width + cmt.width);
      return (crTime > cmtTime) || (cr.width > elapsed);
    }
  };
  for (var i = 1; i < crLen; i++) {
    var cr = this[abbr][i],
        requiredRange;
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      requiredRange = cmt.height + cr.height;
    } else requiredRange = cmt.height;
    if (cr.range - this[abbr][last].range > requiredRange) {
      curr = i;
      break;
    }
    if (willCollide(cr, cmt)) last = i;
  }
  var channel = this[abbr][last].range,
      crObj = {
        range: channel + cmt.height,
        time: cmt.time,
        width: cmt.width,
        height: cmt.height
      };
  this[abbr].splice(last + 1, curr - last - 1, crObj);

  if (cmt.mode === 'bottom') {
    return this.height - cmt.height - channel % this.height;
  } else {
    return channel % (this.height - cmt.height);
  }
};
Danmaku.prototype._resetRange = function() {
  this._ltr = new CollidableRange();
  this._rtl = new CollidableRange();
  this._top = new CollidableRange();
  this._bottom = new CollidableRange();
};
function CollidableRange() {
  return [{
    range: 0,
    time: -9007199254740991,
    width: 9007199254740991,
    height: 0
  }, {
    range: 9007199254740991,
    time: 9007199254740991,
    width: 0,
    height: 0
  }];
}
var RAF = window.requestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          function(cb) { return setTimeout(cb, 50 / 3); };
var CAF = window.cancelAnimationFrame ||
          window.mozCancelAnimationFrame ||
          window.webkitCancelAnimationFrame ||
          function(id) { clearTimeout(id); };
var binsearch = function(a, t) {
  var m,
      l = 0,
      r = a.length;
  while (l <= r) {
    m = (l + r) >> 1;
    if (t <= a[m].time) r = m - 1;
    else l = m + 1;
  }
  if (r < 0) r = 0;
  return r;
};
var formatMode = function(cmt) {
  cmt.mode = (cmt.mode || 'rtl').toLowerCase();
  if (!/ltr|top|bottom/.test(cmt.mode)) cmt.mode = 'rtl';
};
var createCommentNode = function(cmt) {
  var node = document.createElement('div');
  node.appendChild(document.createTextNode(cmt.text));
  node.style.cssText = 'position:absolute;white-space:nowrap;';
  if (cmt.style) {
    for (var key in cmt.style) {
      node.style[key] = cmt.style[key];
    }
  }
  return node;
};
var createCommentCanvas = function(cmt) {
  var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');
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
};
var createTransformString = function(x, y) {
  var vendors = ['', '-o-', '-ms-', '-moz-', '-webkit-'],
      translateStr = 'transform:translate(' + x + 'px,' + y + 'px);',
      transformStr = '';
  for (var i = vendors.length - 1; i >= 0; i--) {
    transformStr += vendors[i] + translateStr;
  }
  return transformStr;
};
window.Danmaku = Danmaku;

})(window);
