import Danmaku from '../../src/index.js';

/* istanbul ignore next */
describe('emit API', function() {
  var danmaku = null;

  afterEach(function() {
    danmaku.destroy();
  });

  it('should deal with comment\'s properties', function() {
    var comment = {text: 'Panzer Vor'};
    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });
    danmaku.emit(comment);
    var cmt = danmaku.comments[0];
    assert.equal(comment.text, cmt.text);
    assert.equal('rtl', cmt.mode);
    assert.equal('number', typeof cmt._utc);
  });

  it('should insert comment to correct position', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      video: document.createElement('video'),
      comments: [
        {time: 0, text: 'Panzer Vor'},
        {time: 2, text: 'Panzer Vor!!'}
      ]
    });
    var comment = {time: 1, text: 'Panzer Vor!'};
    danmaku.emit(comment);
    assert.equal(comment.time, danmaku.comments[1].time);
  });

  it('should default comment time to media currentTime', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      video: document.createElement('video')
    });
    var comment = {text: 'without time property'};
    danmaku.emit(comment);
    assert.equal('number', typeof danmaku.comments[0].time);
  });

  it('should not emit if comment is not valid', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });
    danmaku.emit();
    assert.equal(0, danmaku.comments.length);
    danmaku.emit(null);
    assert.equal(0, danmaku.comments.length);
    danmaku.emit(42);
    assert.equal(0, danmaku.comments.length);
    danmaku.emit('Panzer Vor');
    assert.equal(0, danmaku.comments.length);
    danmaku.emit({});
    assert.equal(1, danmaku.comments.length);
  });
});
