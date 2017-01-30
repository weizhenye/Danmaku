import Danmaku from '../../src/index.js';

/* istanbul ignore next */
describe('clear API', function() {
  var danmaku = null;

  afterEach(function() {
    danmaku.destroy();
  });

  it('should clear current stage (DOM engine)', function(done) {
    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });

    danmaku.emit({text: '勝ったな！ガハハ！'});
    setTimeout(function() {
      assert.equal(1, danmaku.runningList.length);
      assert.equal(true, danmaku.stage.hasChildNodes());
      danmaku.clear();
      assert.equal(0, danmaku.runningList.length);
      assert.equal(false, danmaku.stage.hasChildNodes());
      done();
    }, 100);
  });

  it('should clear current stage (canvas engine)', function(done) {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      engine: 'canvas'
    });

    danmaku.emit({text: '勝ったな！ガハハ！'});
    setTimeout(function() {
      assert.equal(1, danmaku.runningList.length);
      assert.equal('CANVAS', danmaku.runningList[0].canvas.tagName);
      danmaku.clear();
      assert.equal(0, danmaku.runningList.length);
      done();
    }, 100);
  });
});
