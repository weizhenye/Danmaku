import Danmaku from '../../src/index.js';

describe('Initialization', function() {
  var danmaku = null;

  afterEach(function() {
    danmaku && danmaku.destroy();
  });

  it.skip('should support set options in constructor', function() {
    danmaku = new Danmaku();
    assert.equal(false, danmaku._.isInited);

    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });
    assert.equal(true, danmaku._.isInited);
  });

  it('should support live mode', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });
    assert.equal(false, !!danmaku.media);
  });

  it('should support audio mode', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      media: document.createElement('audio')
    });
    assert.equal(true, !!danmaku.media);
  });

  it('should support video mode', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      media: document.createElement('video')
    });
    assert.equal(true, !!danmaku.media);
  });

  it('should support comments', function() {
    var render = function() {
      var $span = document.createElement('span');
      $span.textContent = '佐倉さんひくわー！！！';
      return $span;
    };
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      video: document.createElement('video'),
      comments: [
        { time: 3, render: render },
        { time: 2, text: '佐倉さんひくわー！！' },
        { time: 0, text: '佐倉さんひくわー' },
        { time: 1, text: '佐倉さんひくわー！' }
      ]
    });
    assert.equal(0, danmaku.comments[0].time);
    assert.equal(1, danmaku.comments[1].time);
    assert.equal(2, danmaku.comments[2].time);
    assert.equal(render, danmaku.comments[3].render);
  });

  it('should support DOM engine', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      engine: 'DOM'
    });
    assert.equal(false, danmaku._.useCanvas);
    assert.equal('dom', danmaku.engine);
    assert.equal('DIV', danmaku._.stage.tagName);
  });

  it('should use DOM engine by default', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });
    assert.equal(false, danmaku._.useCanvas);
    assert.equal('dom', danmaku.engine);
    assert.equal('DIV', danmaku._.stage.tagName);
  });

  it('should support canvas engine', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      engine: 'canvas'
    });
    assert.equal(true, danmaku._.useCanvas);
    assert.equal('canvas', danmaku.engine);
    assert.equal('CANVAS', danmaku._.stage.tagName);
  });

  it('should support speed', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      speed: 100
    });
    assert.equal(100, danmaku.speed);
  });

  it('should set speed as 144 by default', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });
    assert.equal(144, danmaku.speed);
  });

  it('should default the stage to container size', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });
    assert.equal(640, danmaku._.width);
    assert.equal(360, danmaku._.height);
    assert.equal('640px', danmaku._.stage.style.width);
    assert.equal('360px', danmaku._.stage.style.height);
  });
});
