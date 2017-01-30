/*
 * For video and audio can't autoplay on some mobile browsers,
 * tests which need to interact with media will be skiped.
 *
 * As I tested manually, all tests pass in IE9.
 * But IE9 in Sauce Labs don't support media methods.
 * https://github.com/videojs/video.js/issues/290
 */

import './index.js';
import './api/emit.js';
import './api/init.js';
import './api/clear.js';
import './api/destroy.js';
import './api/resize.js';
import './api/show-hide.js';
import './api/speed.js';
import './util/binsearch.js';
import './util/canvasHeight.js';
import './util/commentCanvas.js';
import './util/commentNode.js';
import './util/fontSize.js';
import './util/formatMode.js';

/* istanbul ignore next */
beforeEach(function() {
  var $container = document.createElement('div');
  $container.id = 'test-container';
  $container.style.cssText = 'width:640px;height:360px;';
  document.body.appendChild($container);
});

/* istanbul ignore next */
afterEach(function() {
  document.body.removeChild(document.getElementById('test-container'));
});
