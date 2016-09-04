import './index.js';
import './api/init.js';
import './api/show-hide.js';
import './api/speed.js';
import './util/canvasHeight.js';
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
