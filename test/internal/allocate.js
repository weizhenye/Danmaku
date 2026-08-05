import allocate from '../../src/internal/allocate.js';
import { resetSpace } from '../../src/utils.js';

var STAGE_WIDTH = 640;
var STAGE_HEIGHT = 360;
// `duration` is stage width / speed, expressed in media seconds.
var DURATION = STAGE_WIDTH / 144;

// A minimal Danmaku-like host bound to a fake media element.
function createHost(playbackRate) {
  var host = {
    media: { currentTime: 0, playbackRate: playbackRate },
    _: {
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      duration: DURATION,
      space: {}
    }
  };
  resetSpace(host._.space);
  return host;
}

// `x` of a scrolling comment, as computed by src/engine/index.js.
function xAt(cmt, mediaTime) {
  var totalWidth = STAGE_WIDTH + cmt.width;
  return STAGE_WIDTH - totalWidth * (mediaTime - cmt.time) / DURATION;
}

// Widest overlap of the on-stage parts of two comments, in px.
function maxOverlap(a, b) {
  var worst = 0;
  for (var t = b.time; t <= a.time + DURATION; t += 0.01) {
    var aLeft = Math.max(xAt(a, t), 0);
    var aRight = Math.min(xAt(a, t) + a.width, STAGE_WIDTH);
    var bLeft = Math.max(xAt(b, t), 0);
    var bRight = Math.min(xAt(b, t) + b.width, STAGE_WIDTH);
    if (aRight <= aLeft || bRight <= bLeft) continue;
    var overlap = Math.min(aRight, bRight) - Math.max(aLeft, bLeft);
    if (overlap > worst) worst = overlap;
  }
  return worst;
}

// A wide comment, then a narrower one 1.175s of media time later. The narrower
// comment travels slower, so it can never escape the wider one: they overlap on
// stage and must not be given the same channel.
// `lateness` emulates rAF running a little after `cmt.time`, as it always does.
function allocatePair(playbackRate, lateness) {
  var host = createHost(playbackRate);
  var a = { mode: 'rtl', time: 0, width: 630, height: 24 };
  var b = { mode: 'rtl', time: 1.175, width: 195, height: 24 };
  host.media.currentTime = a.time;
  a.y = allocate.call(host, a);
  host.media.currentTime = b.time + (lateness || 0);
  b.y = allocate.call(host, b);
  return { a: a, b: b };
}

describe('allocate', function() {
  it('should keep colliding comments apart at any playbackRate', function() {
    var rates = [0.5, 1, 1.5, 2, 3, 4];
    var latenesses = [0, 0.016, 0.033, 0.1];
    for (var i = 0; i < rates.length; i++) {
      for (var j = 0; j < latenesses.length; j++) {
        var pair = allocatePair(rates[i], latenesses[j]);
        var where = 'playbackRate ' + rates[i] + ', lateness ' + latenesses[j] + 's';

        // Guard the fixture itself: these two really do overlap on stage.
        assert.isAbove(
          maxOverlap(pair.a, pair.b), 30,
          'fixture should overlap at ' + where
        );

        assert.notEqual(
          pair.a.y, pair.b.y,
          'comments must not share a channel at ' + where
        );
      }
    }
  });
});
