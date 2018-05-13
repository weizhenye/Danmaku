import Danmaku from '../src/index.js';
import domEngine from '../src/engine/dom.js';
import {VIDEO_SRC} from './helper.js';

function skipAfter(time, done) {
  /* eslint-disable no-invalid-this */
  this.timeout(time + 1000);
  setTimeout(function() {
    console.log('Take too long time, skip.');
    done();
  }, time);
}

function syncTimeline(danmaku, $video, done) {
  try {
    $video.canPlayType('video/mp4');
  } catch (err) {
    console.log('This browser does not support <video>');
    done();
    return;
  }
  $video.muted = true;
  $video.src = VIDEO_SRC;

  var flag = true;
  $video.addEventListener('timeupdate', function() {
    var ct = $video.currentTime;
    if (ct > 0.1 && ct < 0.5) {
      assert.equal(1, danmaku.runningList.length);
      if (flag) {
        flag = false;
        $video.pause();
        setTimeout(function() {
          assert.equal(1, danmaku.runningList.length);
          $video.play();
        }, 100);
      }
    }
    if (ct > 0.6 && ct < 1) {
      assert.equal(2, danmaku.runningList.length);
    }
    if (ct > 1) {
      done();
    }
  });
  ($video.play() || Promise.resolve())
    .then(function() {
      if ($video.paused) {
        console.log('This browser can\'t play video by script');
        done();
      }
    }, function(err) {
      console.log(err);
      done();
    });
}

describe('Danmaku behavior', function() {
  var danmaku = {};

  afterEach(function() {
    danmaku.destroy && danmaku.destroy();
  });

  it('should deal with modes of comments', function(done) {
    skipAfter.apply(this, [6e4, done]);

    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });

    danmaku.emit({text: 'rtl', mode: 'rtl'});
    danmaku.emit({text: 'ltr', mode: 'ltr'});
    danmaku.emit({text: 'top', mode: 'top'});
    danmaku.emit({text: 'bottom', mode: 'bottom'});

    var rtlPrev = null;
    var ltrPrev = null;
    var topPrev = null;
    var bottomPrev = null;
    var rl = danmaku.runningList;
    var iv = setInterval(function() {
      if (rtlPrev !== null) {
        clearInterval(iv);
        assert.isBelow(rl[0].x, rtlPrev);
        assert.equal(0, rl[0].y);
        assert.isAbove(rl[1].x, ltrPrev);
        assert.equal(0, rl[1].y);
        assert.equal(rl[2].x, topPrev);
        assert.equal(0, rl[2].y);
        assert.equal(rl[3].x, bottomPrev);
        assert.equal(danmaku.height - rl[3].height, rl[3].y);
        done();
      }
      if (rtlPrev === null && rl.length === 4) {
        rtlPrev = rl[0].x;
        ltrPrev = rl[1].x;
        topPrev = rl[2].x;
        bottomPrev = rl[3].x;
        domEngine.call(danmaku);
      }
    }, 100);
  });

  it('should not collide with same comment mode', function(done) {
    skipAfter.apply(this, [6e4, done]);

    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      engine: 'canvas'
    });

    danmaku.emit({text: 'ltr 1', mode: 'ltr'});
    danmaku.emit({text: 'ltr 2 loooooooooooooooooooooooong', mode: 'ltr'});
    danmaku.emit({text: 'top 1', mode: 'top'});

    var rl = danmaku.runningList;
    var iv = setInterval(function() {
      if (rl.length === 7) {
        clearInterval(iv);
        assert.equal(rl[0].height, rl[1].y);
        assert.equal(rl[2].height, rl[3].y);
        assert.equal(danmaku.height - rl[4].height - rl[5].height, rl[5].y);
        assert.equal(true, rl[6].y > rl[0].y);
        done();
      }
      if (rl.length === 4) {
        danmaku.emit({text: 'bottom 1', mode: 'bottom'});
        danmaku.emit({text: 'bottom 2', mode: 'bottom'});
        danmaku.emit({text: 'this is a long text', mode: 'ltr'});
      }
      if (rl.length === 3) {
        danmaku.emit({text: 'top 2', mode: 'top'});
      }
    }, 100);
  });

  it('should remove comments which is out of stage (DOM)', function(done) {
    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });

    danmaku.speed = 12800;
    danmaku.emit({text: 'rtl', mode: 'rtl'});
    setTimeout(function() {
      assert.equal(0, danmaku.runningList.length);
      assert.isFalse(danmaku.stage.hasChildNodes());
      done();
    }, 500);
  });

  it('should remove comments which is out of stage (canvas)', function(done) {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      engine: 'canvas'
    });

    danmaku.speed = 12800;
    danmaku.emit({text: 'rtl', mode: 'rtl'});
    setTimeout(function() {
      assert.equal(0, danmaku.runningList.length);
      done();
    }, 500);
  });

  it('should sync timeline with media (DOM engine)', function(done) {
    skipAfter.apply(this, [6e4, done]);

    var $video = document.createElement('video');
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      video: $video,
      comments: [
        {text: '0', time: 0},
        {text: '0.5', time: 0.5}
      ]
    });
    syncTimeline(danmaku, $video, done);
  });

  it('should sync timeline with media (canvas engine)', function(done) {
    skipAfter.apply(this, [6e4, done]);

    var $video = document.createElement('video');
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      video: $video,
      engine: 'canvas',
      comments: [
        {text: '0', time: 0},
        {text: '0.5', time: 0.5}
      ]
    });
    syncTimeline(danmaku, $video, done);
  });
});
