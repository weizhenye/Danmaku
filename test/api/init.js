import {assert} from 'chai';
import Danmaku from '../../src/index.js';

describe('Initialization', function() {
  beforeEach(function() {
    var $container = document.createElement('div');
    $container.id = 'test-container';
    $container.style.cssText = 'width:640px;height:360px;';
    document.body.appendChild($container);
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('test-container'));
  });

  it('should support set options in constructor', function() {
    var danmaku = new Danmaku();
    assert.equal(false, danmaku._isInited);
    danmaku.init({
      container: document.getElementById('test-container')
    });
    assert.equal(true, danmaku._isInited);

    danmaku = new Danmaku({
      container: document.getElementById('test-container')
    });
    assert.equal(true, danmaku._isInited);
    danmaku.init({
      video: document.createElement('video')
    });
    assert.equal(false, danmaku._hasMedia);
    assert.equal(false, danmaku._hasVideo);
  });

  it('should support live mode', function() {
    var danmaku = new Danmaku();
    danmaku.init({
      container: document.getElementById('test-container')
    });
    assert.equal(true, danmaku._hasInitContainer);
    assert.equal(false, danmaku._hasMedia);
  });

  it('should support audio mode', function() {
    var danmaku = new Danmaku();
    danmaku.init({
      container: document.getElementById('test-container'),
      audio: document.createElement('audio')
    });
    assert.equal(true, danmaku._hasInitContainer);
    assert.equal(true, danmaku._hasMedia);
    assert.equal(false, danmaku._hasVideo);
  });

  it('should support video mode', function() {
    var danmaku = new Danmaku();
    danmaku.init({
      container: document.getElementById('test-container'),
      video: document.createElement('video')
    });
    assert.equal(true, danmaku._hasInitContainer);
    assert.equal(true, danmaku._hasMedia);
    assert.equal(true, danmaku._hasVideo);
  });

  it('should support video mode without container', function() {
    var $video = document.createElement('video');
    document.body.appendChild($video);

    var danmaku = new Danmaku();
    danmaku.init({
      video: $video
    });
    assert.equal(false, danmaku._hasInitContainer);
    assert.equal(true, danmaku._hasMedia);
    assert.equal(true, danmaku._hasVideo);
    assert.equal($video.parentNode, danmaku.container);

    document.body.removeChild(danmaku.container);
  });

  it('should keep video playing when it\'s playing', function() {
    var $video = document.createElement('video');
    document.body.appendChild($video);
    $video.play();

    var danmaku = new Danmaku();
    danmaku.init({
      video: $video
    });
    assert.equal(false, $video.paused);

    document.body.removeChild(danmaku.container);
  });

  it('should throw error when no container is assigned', function() {
    var danmaku = new Danmaku();
    assert.throws(function() {
      danmaku.init();
    });
    assert.throws(function() {
      danmaku.init({});
    });
    assert.throws(function() {
      danmaku.init({
        audio: document.createElement('audio')
      });
    });
  });

  it('should support comments', function() {
    var danmaku = new Danmaku();
    danmaku.init({
      container: document.getElementById('test-container'),
      video: document.createElement('video'),
      comments: [
        {time: 2, text: '佐倉さんひくわー！！'},
        {time: 0, text: '佐倉さんひくわー'},
        {time: 1, text: '佐倉さんひくわー！'}
      ]
    });
    assert.equal(0, danmaku.comments[0].time);
    assert.equal(1, danmaku.comments[1].time);
    assert.equal(2, danmaku.comments[2].time);
  });

  it('should support DOM engine', function() {
    var danmaku = new Danmaku();
    danmaku.init({
      container: document.getElementById('test-container'),
      engine: 'DOM'
    });
    assert.equal(false, danmaku._useCanvas);
    assert.equal('dom', danmaku.engine);
    assert.equal('DIV', danmaku.stage.tagName);
  });

  it('should use DOM engine by default', function() {
    var danmaku = new Danmaku();
    danmaku.init({
      container: document.getElementById('test-container')
    });
    assert.equal(false, danmaku._useCanvas);
    assert.equal('dom', danmaku.engine);
    assert.equal('DIV', danmaku.stage.tagName);
  });

  it('should support canvas engine', function() {
    var danmaku = new Danmaku();
    danmaku.init({
      container: document.getElementById('test-container'),
      engine: 'canvas'
    });
    assert.equal(true, danmaku._useCanvas);
    assert.equal('canvas', danmaku.engine);
    assert.equal('CANVAS', danmaku.stage.tagName);
  });

  it('should support speed', function() {
    var danmaku = new Danmaku();
    danmaku.init({
      container: document.getElementById('test-container'),
      speed: 100
    });
    assert.equal(100, danmaku.speed);
  });

  it('should set speed as 144 by default', function() {
    var danmaku = new Danmaku();
    danmaku.init({
      container: document.getElementById('test-container')
    });
    assert.equal(144, danmaku.speed);
  });
});
