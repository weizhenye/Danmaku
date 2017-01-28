import initMixin from './api/init.js';
import emitMixin from './api/emit.js';
import clearMixin from './api/clear.js';
import destroyMixin from './api/destroy.js';
import showMixin from './api/show.js';
import hideMixin from './api/hide.js';
import resizeMixin from './api/resize.js';
import speedMixin from './api/speed.js';

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

export default Danmaku;
