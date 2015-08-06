(function(window) {
'use strict';

function Danmaku() {
  this.paused = true;
  this.isHide = false;
  this.ttl = 4;
  this.requestID = 0;
  this.position = 0;
  this.runline = [];
  this.comments = [];
  this._resetRange();
  this.initContainer = true;
  this.stage = document.createElement('div');
  this.stage.className = 'Danmaku-stage';
  this.stage.style.cssText = 'position:relative;overflow:hidden;' +
                             'pointer-events:none;transform:translateZ(0);';
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
  this.stage.style.width = this.width + 'px';
  this.stage.style.height = this.height + 'px';
  this.ttl = this.width / 160;
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
Danmaku.prototype._play = function() {
  if (this.isHide || !this.paused) return;
  this.paused = false;
  var that = this;
  function check() {
    var ct = that.isMedia ?
             that.media.currentTime :
             new Date().getTime() / 1000;
    for (var i = that.runline.length - 1; i >= 0; i--) {
      var cmt = that.runline[i];
      if (ct - cmt.time > that.ttl) {
        that.stage.removeChild(cmt.node);
        that.runline.splice(i, 1);
      }
    }
    var tempNodes = [],
        df = document.createDocumentFragment();
    while (that.position < that.comments.length &&
           that.comments[that.position].time < ct) {
      var cmt = that.comments[that.position];
      cmt.node = createCommentNode(cmt);
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
      cmt.width = cmt.node.offsetWidth;
      cmt.height = cmt.node.offsetHeight;
    }
    for (var i = tempNodes.length - 1; i >= 0; i--) {
      var cmt = tempNodes[i];
      if (cmt.mode === 'lefttoright') cmt.x = -cmt.width;
      if (cmt.mode === 'righttoleft') cmt.x = that.width;
      if (cmt.mode === 'top' || cmt.mode === 'bottom') {
        cmt.x = (that.width - cmt.width) >> 1;
      }
      cmt.y = that._getChannel(cmt);
      cmt.node.style.cssText += createTransformString(cmt.x, cmt.y);
    }
    for (var i = that.runline.length - 1; i >= 0; i--) {
      var cmt = that.runline[i];
      if (cmt.mode === 'top' || cmt.mode === 'bottom') continue;
      var elapsed = (that.width + cmt.width) * (ct - cmt.time) / that.ttl;
      if (cmt.mode === 'lefttoright') cmt.x = elapsed - cmt.width;
      if (cmt.mode === 'righttoleft') cmt.x = that.width - elapsed;
      cmt.node.style.cssText += createTransformString(cmt.x, cmt.y);
    }
    that.requestID = RAF(check);
  }
  this.requestID = RAF(check);
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
  var lc = this.stage.lastChild;
  while (lc) {
    this.stage.removeChild(lc);
    lc = this.stage.lastChild;
  }
  this.runline = [];
};
Danmaku.prototype._getChannel = function(cmt) {
  var that = this,
      abbr = '_rtl',
      ct = this.isMedia ?
           this.media.currentTime :
           new Date().getTime() / 1000;
  if (cmt.mode === 'lefttoright') abbr = '_ltr';
  if (cmt.mode === 'righttoleft') abbr = '_rtl';
  if (cmt.mode === 'top') abbr = '_top';
  if (cmt.mode === 'bottom') abbr = '_btm';
  var crLen = this[abbr].length,
      last = 0,
      curr = 0;
  var willCollide = function(cr, cmt) {
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      return ct - cr.time < that.ttl;
    } else {
      var elapsed = (that.width + cr.width) * (ct - cr.time) / that.ttl,
          crTime = that.ttl + cr.time - ct,
          cmtTime = that.ttl * that.width / (that.width + cmt.width);
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
  this._btm = new CollidableRange();
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
  cmt.mode = (cmt.mode || 'rightToLeft').toLowerCase();
  if (!/lefttoright|top|bottom/.test(cmt.mode)) cmt.mode = 'righttoleft';
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
