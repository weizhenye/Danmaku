import Danmaku from '../src/index.js';

// eslint-disable-next-line max-len
var VIDEO_SRC = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAELltZGF0AAACcgYF//9u3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0OCByMjYzOCA3NTk5MjEwIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTAgcmVmPTE2IGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDE6MHgxMzEgbWU9dW1oIHN1Ym1lPTEwIHBzeT0xIHBzeV9yZD0xLjAwOjAuMDAgbWl4ZWRfcmVmPTEgbWVfcmFuZ2U9MjQgY2hyb21hX21lPTEgdHJlbGxpcz0yIDh4OGRjdD0wIGNxbT0wIGRlYWR6b25lPTIxLDExIGZhc3RfcHNraXA9MSBjaHJvbWFfcXBfb2Zmc2V0PS0yIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTAgd2VpZ2h0cD0wIGtleWludD0yNTAga2V5aW50X21pbj0xIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NjAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAKs2WIggL+IxQABFEjgACsNHAAFYeTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrwAAAAAhBmhwF/ABwjAAAAAhBmioBfwAcIwAAAAhBmjsBfwAcIwAAAAlBmkkAX8AHCMAAAAAJQZpZQF/ABwjAAAAACUGaaYBfwAcIwAAAAAlBmnnAX8AHCMAAAAAJQZqIgBfwAcIwAAAACUGamJAX8AHCMAAAAAlBmqigF/ABwjAAAAAJQZq4sBfwAcIwAAAACUGayMAX8AHCMAAAAAlBmtjQF/ABwjAAAAAJQZro4BfwAcIw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';

var thenable = {
  then: function(cb) {
    cb();
  },
};

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
    console.log('This browser does not support <video>, skip.');
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
  ($video.play() || thenable)
    .then(function() {
      if ($video.paused) {
        console.log('This browser can\'t play video by script, skip.');
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
      }
    }, 100);
  });

  it('should not collide with same comment mode', function(done) {
    skipAfter.apply(this, [6e4, done]);

    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      engine: 'canvas'
    });

    danmaku.emit({text: 'ltr 1 loooooooooooooooooooooooong', mode: 'ltr'});
    danmaku.emit({text: 'ltr 2 loooooooooooooooooooooooong', mode: 'ltr'});
    danmaku.emit({text: 'top 1', mode: 'top'});

    var rl = danmaku.runningList;
    var iv = setInterval(function() {
      if (rl.length === 6) {
        clearInterval(iv);
        assert.equal(rl[0].height, rl[1].y);
        assert.equal(rl[2].height, rl[3].y);
        assert.equal(danmaku.height - rl[4].height - rl[5].height, rl[5].y);
        done();
      }
      if (rl.length === 4) {
        danmaku.emit({text: 'bottom 1', mode: 'bottom'});
        danmaku.emit({text: 'bottom 2', mode: 'bottom'});
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
