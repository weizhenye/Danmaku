import Danmaku from '../../src/index.js';

describe('clear API', function() {
  var danmaku = null;

  afterEach(function() {
    danmaku.destroy();
  });

  it('should clear current stage (DOM engine)', function(done) {
    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });

    danmaku.emit({ text: '勝ったな！ガハハ！' });
    setTimeout(function() {
      assert.equal(1, danmaku._.runningList.length);
      assert.equal(true, danmaku._.stage.hasChildNodes());
      danmaku.clear();
      assert.equal(0, danmaku._.runningList.length);
      assert.equal(false, danmaku._.stage.hasChildNodes());
      done();
    }, 100);
  });

  it('should clear current stage (canvas engine)', function(done) {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      engine: 'canvas'
    });

    danmaku.emit({ text: '勝ったな！ガハハ！' });
    setTimeout(function() {
      assert.equal(1, danmaku._.runningList.length);
      assert.equal('CANVAS', danmaku._.runningList[0].canvas.tagName);
      danmaku.clear();
      assert.equal(0, danmaku._.runningList.length);
      done();
    }, 100);
  });
});
