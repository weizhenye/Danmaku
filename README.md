# Danmaku

[![Build status](https://badgen.net/travis/weizhenye/Danmaku?icon=travis&label=build)](https://travis-ci.org/weizhenye/Danmaku)
[![Coverage](https://badgen.net/codecov/c/github/weizhenye/Danmaku?icon=codecov)](https://codecov.io/gh/weizhenye/Danmaku)
[![Dependencies](https://badgen.net/david/dep/weizhenye/Danmaku?icon=https://api.iconify.design/si-glyph:connect-2.svg?color=white)](https://david-dm.org/weizhenye/Danmaku)
[![NPM version](https://badgen.net/npm/v/danmaku?icon=npm)](https://www.npmjs.com/package/danmaku)
[![License](https://badgen.net/npm/license/danmaku?icon=https://api.iconify.design/octicon:law.svg?color=white)](https://github.com/weizhenye/Danmaku/blob/master/LICENSE)
[![File size](https://badgen.net/bundlephobia/minzip/danmaku?icon=https://api.iconify.design/ant-design:file-zip-outline.svg?color=white)](https://bundlephobia.com/result?p=danmaku)
[![jsDelivr](https://badgen.net/jsdelivr/hits/npm/danmaku?icon=https://api.iconify.design/simple-icons:jsdelivr.svg?color=white)](https://www.jsdelivr.com/package/npm/danmaku)

[![Browser compatibility](https://saucelabs.com/browser-matrix/danmaku.svg)](https://saucelabs.com/u/danmaku)

Danmaku is a JavaScript library to display flying comments on HTML5 video. It can also display comments to your container in real time without timeline or be used with HTML5 audio.

[Demo](https://danmaku.js.org/)

[中文文档](https://github.com/weizhenye/Danmaku/wiki/%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3)

## Installation

You can install it by using npm or bower:
```bash
npm install danmaku
```
```bash
bower install danmaku
```
You can also use [jsDelivr CDN](https://www.jsdelivr.com/package/npm/danmaku) or download [danmaku.min.js](https://github.com/weizhenye/Danmaku/raw/master/dist/danmaku.min.js) directly.

## Usage

### Video mode

```html
<video id="my-video" src="./example.mp4"></video>

<script src="./dist/danmaku.min.js"></script>
<script>
  var danmaku = new Danmaku();
  danmaku.init({
    video: document.getElementById('my-video'),
    comments: []
  });
</script>
```

### Audio mode

```html
<div id="my-container" style="width:640px;height:360px;"></div>
<audio id="my-audio" src="./example.mp3"></audio>

<script src="./dist/danmaku.min.js"></script>
<script>
  var danmaku = new Danmaku();
  danmaku.init({
    container: document.getElementById('my-container'),
    audio: document.getElementById('my-audio'),
    comments: []
  });
</script>
```

### Live mode

To display comments in real time, you need to set up server and use something like [Socket.IO](http://socket.io/). Danmaku is just receiving comments data and display them to container.

Here is a simple example using with Socket.IO and Node.js.

Server:

```js
const app = require('http').createServer(handler);
const io = require('socket.io')(app);
app.listen(80);
function handler(req, res) {
  // your handler...
}
io.on('connection', socket => {
  socket.on('danmaku', comment => {
    socket.broadcast.emit('danmaku', comment);
  });
});
```

Client:

```html
<div id="my-container" style="width:640px;height:360px;"></div>
<button id="send-button">Send</button>

<script src="./socket.io.js"></script>
<script src="./dist/danmaku.min.js"></script>
<script>
  var danmaku = new Danmaku();
  danmaku.init({
    container: document.getElementById('my-container')
  });
  var socket = io();
  socket.on('danmaku', function(comment) {
    danmaku.emit(comment)
  });
  var btn = document.getElementById('send-button');
  btn.addEventListener('click', function() {
    var comment = {
      text: 'bla bla',
      style: {
        fontSize: '20px',
        color: '#ffffff'
      },
    };
    danmaku.emit(comment);
    socket.emit('danmaku', comment);
  });
</script>
```

## API

### Initialization

```js
var danmaku = new Danmaku();
danmaku.init({
  // The stage to display comments will be appended to container.
  container: document.getElementById('my-container'),

  // Danmaku will create a container automatically and append video to the
  // container if container isn't assigned.
  video: document.getElementById('my-video'),

  // You should always assign a container when using audio mode.
  audio: document.getElementById('my-audio'),

  // Array of comment, you can find its format in `danmaku.emit` API.
  comments: [],

  // You can use 'DOM' engine or 'canvas' engine to render comments.
  // Canvas engine may more efficient than DOM however it costs more memory.
  // 'DOM' by default, available in all mode.
  engine: 'canvas',

  // You can also set speed by using `danmaku.speed` API.
  speed: 144
});
```
Or just put options here:
```js
var danmaku = new Danmaku({/* options */});
```

### Emit a comment

```js
danmaku.emit({
  text: 'example',

  // When using DOM engine, `text` can be parsed as HTML if `html` is `true`.
  // You should never pass in users' inputs directly to avoid XSS.
  // `false` by default.
  // DEPRECATED, use `render` instead.
  html: false,

  // 'rtl'(right to left) by default, available mode: 'ltr', 'rtl', 'top', 'bottom'.
  mode: 'rtl',

  // Specified in seconds, if not provided when using with media(video or audio),
  // it will be set to `media.currentTime`. Not required in live mode.
  time: 233.3,

  // When using DOM engine, Danmaku will create a <div> node for each comment,
  // these styles will be set to `node.style` directly, just write with CSS rules.
  style: {
    fontSize: '20px',
    color: '#ffffff',
    border: '1px solid #337ab7',
    textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
  },

  // When using canvas engine, following properties are available by default
  // as a CanvasRenderingContext2D object.
  canvasStyle: {
    // In Chrome, minimum font-size is 12px
    font: '10px sans-serif',
    textAlign: 'start',
    // Note that 'bottom' is the default
    textBaseline: 'bottom',
    direction: 'inherit',
    fillStyle: '#000',
    // If strokeStyle isn't assigned, there will be no stroke.
    strokeStyle: '#000',
    // It will be effect like strokeWidth.
    lineWidth: 1.0,
    shadowBlur: 0,
    shadowColor: '#000',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    filter: 'none',
    globalAlpha: 1.0
  },

  // A custom render to draw your comment.
  // when `render` exist, `text`, `html`, `style` and `canvasStyle` will be ignored.

  // When using DOM engine, you should return an HTMLElement.
  render: function() {
    var $div = document.createElement('div');
    var $img = document.createElement('img');
    $img.src = '/path/to/xxx.png';
    $div.appendChild($img);
    return $div;
  },
  // When using canvas engine, you should return an HTMLCanvasElement.
  render: function() {
    var canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(75, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
    return canvas;
  }
});
```

More details about [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

Tips:
* With DOM engine, you may want to change line spacing by set `line-height` to each comment, a better way is set `line-height` to the container.
* With canvas engine, line height is `1.2` by default, you can set it with `canvasStyle.font`.
* `canvasStyle.font` uses the same syntax as the [CSS font](https://developer.mozilla.org/en-US/docs/Web/CSS/font) specifier. However you can only use `px`, `%`, `em`, `rem` units, I'm sure you don't need others.
* There is a hitbox for each comment, which height is determined by its line height. When `canvasStyle.textBaseline` is `top` or `hanging`, the baseline is set to top of the hitbox; when it's `middle`, baseline is middle of the hitbox; otherwise baseline is bottom of the hitbox. So if you set `canvasStyle.textBaseline` to `alphabetic` or `hanging`, the comment's head or foot may out of the hitbox and be invisible.
* [`canvasStyle.filter`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter) is supported in Chrome 52 and Firefox 49.

### Resize

Do it when you resize container or video.

```js
danmaku.resize();
```

### Show

```js
danmaku.show();
```

### Hide

If you set `display: none;` to the container directly when using DOM engine, you should also do danmaku.hide() otherwise the typesetting will be broken when it's showed.

```js
danmaku.hide();
```

### Clear

Clear current stage.

```js
danmaku.clear();
```

### Speed

There is a property `duration` for all comments, which means how long will a comment be shown to the stage. `duration` is calculated by `stage.width / danmaku.speed`, and `danmaku.speed` is a standard for all comments, because the actually speed for each comment is then calculated by `(comment.width + stage.width) / duration`. The default value is 144.

```js
danmaku.speed = 144;
```

### Destroy

Destroy `danmaku` instance and release memory.

```js
danmaku.destroy();
```
