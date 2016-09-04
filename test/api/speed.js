import {assert} from 'chai';
import Danmaku from '../../src/index.js';

/* istanbul ignore next */
describe('speed API', function() {
  it('should set and get speed correctly', function() {
    var danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });

    assert.equal(144, danmaku.speed);
    danmaku.speed = 42;
    assert.equal(42, danmaku.speed);
    danmaku.speed = 0;
    assert.equal(42, danmaku.speed);
    danmaku.speed = -1;
    assert.equal(42, danmaku.speed);
    danmaku.speed = NaN;
    assert.equal(42, danmaku.speed);
    danmaku.speed = Infinity;
    assert.equal(42, danmaku.speed);
    danmaku.speed = 'string';
    assert.equal(42, danmaku.speed);
  });
});
