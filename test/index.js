import Danmaku from '../src/index.js';
import { createVideo } from './helper.js';

function skipAfter(time, done) {
  /* eslint-disable no-invalid-this */
  this.timeout(time + 1000);
  setTimeout(function() {
    console.log('Take too long time, skip.');
    done();
  }, time);
}

function ensureFraming(comment) {
  var danmaku = new Danmaku({
    container: document.getElementById('test-container')
  });
  danmaku.emit(comment);
  var x = null;
  var rl = danmaku._.runningList;
  return new Promise(function(resolve) {
    var iv = setInterval(function() {
      if (x !== null) {
        clearInterval(iv);
        resolve({
          danmaku: danmaku,
          comment: rl[0],
          x: x
        });
      }
      if (x === null && rl.length) {
        x = rl[0].x;
      }
    }, 100);
  });
}

function syncTimeline(engine, done) {
  return createVideo().then(function($video) {
    if (!$video) {
      done();
      return Promise.resolve();
    }
    var danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      media: $video,
      comments: [
        { text: '0', time: 0 },
        { text: '0.5', time: 0.5 }
      ],
      engine: engine
    });
    var flag = true;
    $video.addEventListener('timeupdate', function() {
      var ct = $video.currentTime;
      if (ct > 0.1 && ct < 0.5) {
        assert.equal(1, danmaku._.runningList.length);
        if (flag) {
          flag = false;
          $video.pause();
          setTimeout(function() {
            assert.equal(1, danmaku._.runningList.length);
            $video.play();
          }, 100);
        }
      }
      if (ct > 0.6 && ct < 1) {
        assert.equal(2, danmaku._.runningList.length);
      }
      if (ct > 1) {
        done();
      }
    });
    $video.play();
    return danmaku;
  });
}

describe('Danmaku behavior', function() {
  var danmaku = {};

  afterEach(function() {
    danmaku.destroy && danmaku.destroy();
  });

  it('should support ltr mode', function() {
    return ensureFraming({ text: 'ltr', mode: 'ltr' }).then(function(result) {
      danmaku = result.danmaku;
      assert.isAbove(result.comment.x, result.x);
      assert.equal(0, result.comment.y);
    });
  });

  it('should support rtl mode', function() {
    return ensureFraming({ text: 'rtl', mode: 'rtl' }).then(function(result) {
      danmaku = result.danmaku;
      assert.isBelow(result.comment.x, result.x);
      assert.equal(0, result.comment.y);
    });
  });

  it('should support top mode', function() {
    return ensureFraming({ text: 'top', mode: 'top' }).then(function(result) {
      danmaku = result.danmaku;
      assert.equal(result.comment.x, result.x);
      assert.equal(0, result.comment.y);
    });
  });

  it('should support bottom mode', function() {
    return ensureFraming({ text: 'bottom', mode: 'bottom' }).then(function(result) {
      danmaku = result.danmaku;
      assert.equal(result.comment.x, result.x);
      assert.equal(danmaku._.height - result.comment.height, result.comment.y);
    });
  });

  it('should not collide with same comment mode', function(done) {
    skipAfter.apply(this, [6e4, done]);

    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      engine: 'canvas'
    });

    danmaku.emit({ text: 'ltr 1', mode: 'ltr' });
    danmaku.emit({ text: 'ltr 2 loooooooooooooooooooooooong', mode: 'ltr' });
    danmaku.emit({ text: 'top 1', mode: 'top' });

    var rl = danmaku._.runningList;
    var iv = setInterval(function() {
      if (rl.length === 7) {
        clearInterval(iv);
        assert.equal(rl[0].height, rl[1].y);
        assert.equal(rl[2].height, rl[3].y);
        assert.equal(danmaku._.height - rl[4].height - rl[5].height, rl[5].y);
        assert.equal(true, rl[6].y > rl[0].y);
        done();
      }
      if (rl.length === 4) {
        danmaku.emit({ text: 'bottom 1', mode: 'bottom' });
        danmaku.emit({ text: 'bottom 2', mode: 'bottom' });
        danmaku.emit({ text: 'this is a long text', mode: 'ltr' });
      }
      if (rl.length === 3) {
        danmaku.emit({ text: 'top 2', mode: 'top' });
      }
    }, 100);
  });

  it('should remove comments which is out of stage (DOM)', function(done) {
    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });

    danmaku.speed = 12800;
    danmaku.emit({ text: 'rtl', mode: 'rtl' });
    setTimeout(function() {
      assert.equal(0, danmaku._.runningList.length);
      assert.isFalse(danmaku._.stage.hasChildNodes());
      done();
    }, 500);
  });

  it('should remove comments which is out of stage (canvas)', function(done) {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      engine: 'canvas'
    });

    danmaku.speed = 12800;
    danmaku.emit({ text: 'rtl', mode: 'rtl' });
    setTimeout(function() {
      assert.equal(0, danmaku._.runningList.length);
      done();
    }, 500);
  });

  it('should sync timeline with media (DOM engine)', function(done) {
    skipAfter.apply(this, [6e4, done]);

    syncTimeline('dom', done).then(function(d) {
      if (d) {
        danmaku = d;
      }
    });
  });

  it('should sync timeline with media (canvas engine)', function(done) {
    skipAfter.apply(this, [6e4, done]);

    syncTimeline('canvas', done).then(function(d) {
      if (d) {
        danmaku = d;
      }
    });
  });
});
