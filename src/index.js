import init from './api/init.js';
import destroy from './api/destroy.js';
import emit from './api/emit.js';
import show from './api/show.js';
import hide from './api/hide.js';
import clear from './api/clear.js';
import resize from './api/resize.js';
import speed from './api/speed.js';

function Danmaku(opt) {
  opt && init.call(this, opt);
}
Danmaku.prototype.destroy = function() {
  return destroy.call(this);
};
Danmaku.prototype.emit = function(cmt) {
  return emit.call(this, cmt);
};
Danmaku.prototype.show = function() {
  return show.call(this);
};
Danmaku.prototype.hide = function() {
  return hide.call(this);
};
Danmaku.prototype.clear = function() {
  return clear.call(this);
};
Danmaku.prototype.resize = function() {
  return resize.call(this);
};
Object.defineProperty(Danmaku.prototype, 'speed', speed);

export default Danmaku;
