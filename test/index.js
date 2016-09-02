import {assert} from 'chai';
import Danmaku from '../src/index.js';

describe('Initialization', function() {
  before(function() {
    var $container = document.createElement('div');
    $container.id = 'test-container';
    $container.style.cssText = 'width:640px;height:360px;';
    document.body.appendChild($container);
  });

  before(function() {
    document.body.removeChild(document.getElementById('test-container'));
  });

  it.skip('should initialize', function() {
    var $container = document.getElementById('test-container');
    var danmaku = new Danmaku();
    danmaku.init({
      container: $container
    });
    assert($container, danmaku.container);
  });
});
