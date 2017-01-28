import play from './play.js';
import pause from './pause.js';
import seek from './seek.js';

var playHandler = null;
var pauseHandler = null;
var seekingHandler = null;

/* eslint no-invalid-this: 0 */
export function bindEvents() {
  playHandler = play.bind(this);
  pauseHandler = pause.bind(this);
  seekingHandler = seek.bind(this);
  this.media.addEventListener('play', playHandler);
  this.media.addEventListener('pause', pauseHandler);
  this.media.addEventListener('seeking', seekingHandler);
}

/* eslint no-invalid-this: 0 */
export function unbindEvents() {
  this.media.removeEventListener('play', playHandler);
  this.media.removeEventListener('pause', pauseHandler);
  this.media.removeEventListener('seeking', seekingHandler);
  playHandler = null;
  pauseHandler = null;
  seekingHandler = null;
}
