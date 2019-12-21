import Danmaku from '../../src/index.js';

describe('destroy API', function() {
  it('should release memory', function(done) {
    var danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });

    danmaku.emit({ text: 'Flip Flapper' });
    setTimeout(function() {
      danmaku.destroy();
      assert.equal(null, danmaku.comments);
      assert.equal(null, danmaku.container);
      assert.equal(null, danmaku.stage);
      danmaku.destroy();
      done();
    }, 100);
  });
});
