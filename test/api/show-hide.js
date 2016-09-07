import {assert} from 'chai';
import Danmaku from '../../src/index.js';

/* istanbul ignore next */
describe('show and hide API', function() {
  var danmaku = null;

  beforeEach(function() {
    var $video = document.createElement('video');
    $video.id = 'test-video';
    document.body.appendChild($video);

    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      video: $video
    });
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('test-video'));
  });

  it('should be able to show or hide comments', function() {
    assert.equal(true, danmaku.visible);
    danmaku.hide();
    assert.equal(false, danmaku.visible);
    danmaku.show();
    assert.equal(true, danmaku.visible);
  });

  it('should pause when hided and restore when showed', function() {
    var $video = document.getElementById('test-video');
    try {
      $video.canPlayType('video/mp4');
    } catch (err) {
      return;
    }
    $video.play();
    danmaku.hide();
    assert.equal(true, danmaku.paused);
    danmaku.show();
    assert.equal($video.paused, danmaku.paused);
    $video.pause();
    danmaku.hide();
    assert.equal(true, danmaku.paused);
    danmaku.show();
    assert.equal($video.paused, danmaku.paused);
  });

  it('should just return when called many times', function() {
    var $video = document.getElementById('test-video');
    danmaku.hide();
    assert.equal(true, danmaku.paused);
    assert.equal(false, danmaku.visible);
    danmaku.hide();
    assert.equal(true, danmaku.paused);
    assert.equal(false, danmaku.visible);
    danmaku.show();
    assert.equal($video.paused, danmaku.paused);
    assert.equal(true, danmaku.visible);
    danmaku.show();
    assert.equal($video.paused, danmaku.paused);
    assert.equal(true, danmaku.visible);
  });
});
