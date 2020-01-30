import Danmaku from '../../src/index.js';

describe('destroy API', function() {
  it('should release memory', function(done) {
    var container = document.getElementById('test-container');
    var danmaku = new Danmaku({
      container: container
    });

    danmaku.emit({ text: 'Flip Flapper' });
    setTimeout(function() {
      danmaku.destroy();
      assert.equal(0, container.childNodes.length);
      assert.equal(null, danmaku.comments);
      assert.equal(null, danmaku.container);
      danmaku.destroy();
      done();
    }, 100);
  });
});
