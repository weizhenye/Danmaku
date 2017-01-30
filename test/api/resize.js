import Danmaku from '../../src/index.js';

/* istanbul ignore next */
describe('resize API', function() {
  var danmaku = null;

  afterEach(function() {
    danmaku.destroy();
  });

  it('should resize to container size (DOM engine)', function() {
    var $container = document.getElementById('test-container');
    danmaku = new Danmaku({
      container: $container,
      engine: 'DOM'
    });
    $container.style.width = '1280px';
    $container.style.height = '720px';
    danmaku.resize();
    assert.equal(1280, danmaku.width);
    assert.equal(720, danmaku.height);
    assert.equal('1280px', danmaku.stage.style.width);
    assert.equal('720px', danmaku.stage.style.height);
  });

  it('should resize to container size (canvas engine)', function() {
    var $container = document.getElementById('test-container');
    danmaku = new Danmaku({
      container: $container,
      engine: 'canvas'
    });
    $container.style.width = '1280px';
    $container.style.height = '720px';
    danmaku.resize();
    assert.equal(1280, danmaku.width);
    assert.equal(720, danmaku.height);
    assert.equal(1280, danmaku.stage.width);
    assert.equal(720, danmaku.stage.height);
  });

  it('should resize to vide size without container', function() {
    var $video = document.createElement('video');
    document.body.appendChild($video);

    $video.style.width = '1280px';
    $video.style.height = '720px';
    danmaku = new Danmaku({
      video: $video
    });
    danmaku.resize();
    assert.equal(1280, danmaku.width);
    assert.equal(720, danmaku.height);
    assert.equal('1280px', danmaku.stage.style.width);
    assert.equal('720px', danmaku.stage.style.height);
  });
});
