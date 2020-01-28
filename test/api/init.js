import Danmaku from '../../src/index.js';

describe('Initialization', function() {
  var danmaku = null;

  afterEach(function() {
    danmaku && danmaku.destroy();
  });

  it('don\'t throw error when container is not provided', function() {
    danmaku = new Danmaku({});
    assert.equal(null, danmaku.container.parentNode);
  });

  it('should set container to instance', function() {
    var container = document.getElementById('test-container');
    danmaku = new Danmaku({ container: container });
    assert.equal(container, danmaku.container);
  });

  it('should support live mode', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });
    assert.equal(false, !!danmaku.media);
  });

  it('should support media mode', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      media: document.createElement('audio')
    });
    assert.equal(true, !!danmaku.media);

    danmaku.destroy();

    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      media: document.createElement('video')
    });
    assert.equal(true, !!danmaku.media);
  });

  it('should support preseted comments', function() {
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

  it('should use DOM engine by default', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });
    assert.equal('dom', danmaku.engine);
    assert.equal('DIV', danmaku._.stage.tagName);
  });

  it('should support DOM engine', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      engine: 'DOM'
    });
    assert.equal('dom', danmaku.engine);
    assert.equal('DIV', danmaku._.stage.tagName);
  });

  it('should support canvas engine', function() {
    danmaku = new Danmaku({
      container: document.getElementById('test-container'),
      engine: 'canvas'
    });
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
    assert.equal(640, danmaku._.stage.width);
    assert.equal(360, danmaku._.stage.height);
    assert.equal('640px', danmaku._.stage.style.width);
    assert.equal('360px', danmaku._.stage.style.height);
  });
});
