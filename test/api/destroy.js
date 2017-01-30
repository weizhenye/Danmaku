import Danmaku from '../../src/index.js';

/* istanbul ignore next */
describe('destroy API', function() {
  it('should release memory', function(done) {
    var danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });

    danmaku.emit({text: 'Flip Flapper'});
    setTimeout(function() {
      danmaku.destroy();
      assert.equal(null, danmaku.comments);
      assert.equal(null, danmaku.container);
      assert.equal(null, danmaku.stage);
      assert.equal(null, danmaku._isInited);
      danmaku.destroy();
      done();
    }, 100);
  });

  it('should revert DOM structure', function(done) {
    var $video = document.createElement('video');
    document.body.appendChild($video);
    try {
      $video.canPlayType('video/mp4');
    } catch (err) {
      done();
      return;
    }
    $video.play();

    var danmaku = new Danmaku({
      video: $video
    });

    setTimeout(function() {
      danmaku.destroy();
      assert.equal(document.body, $video.parentNode);
      document.body.removeChild($video);
      done();
    }, 100);
  });
});
