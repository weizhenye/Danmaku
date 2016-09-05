import {assert} from 'chai';
import Danmaku from '../../src/index.js';

/* istanbul ignore next */
describe('emit API', function() {
  it('should deal with comment\'s properties', function() {
    var comment = {text: 'Panzer Vor'};
    var danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });
    danmaku.emit(comment);
    assert.equal('rtl', comment.mode);
    assert.equal('string', typeof comment.text);
    assert.equal('number', typeof comment._utc);
    assert.equal(comment, danmaku.comments[0]);
  });

  it('should insert comment to correct position', function() {
    var danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      video: document.createElement('video'),
      comments: [
        {time: 0, text: 'Panzer Vor'},
        {time: 2, text: 'Panzer Vor!!'}
      ]
    });
    var comment = {time: 1, text: 'Panzer Vor!'};
    danmaku.emit(comment);
    assert.equal(comment, danmaku.comments[1]);
  });

  it('should default comment time to media currentTime', function() {
    var danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      video: document.createElement('video')
    });
    var comment = {text: 'without time property'};
    danmaku.emit(comment);
    assert.equal('number', typeof comment.time);
  });

  it('should not emit if comment is not valid', function() {
    var danmaku = new Danmaku({
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
