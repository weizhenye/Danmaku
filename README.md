# Danmaku

[![GitHub Action](https://github.com/weizhenye/Danmaku/workflows/CI/badge.svg)](https://github.com/weizhenye/Danmaku/actions)
[![Coverage](https://badgen.net/codecov/c/github/weizhenye/Danmaku?icon=codecov)](https://codecov.io/gh/weizhenye/Danmaku)
[![NPM version](https://badgen.net/npm/v/danmaku?icon=npm)](https://www.npmjs.com/package/danmaku)
[![License](https://badgen.net/npm/license/danmaku?icon=https://api.iconify.design/octicon:law.svg?color=white)](https://github.com/weizhenye/Danmaku/blob/master/LICENSE)
[![File size](https://badgen.net/bundlephobia/minzip/danmaku?icon=https://api.iconify.design/ant-design:file-zip-outline.svg?color=white)](https://bundlephobia.com/result?p=danmaku)
[![jsDelivr](https://badgen.net/jsdelivr/hits/npm/danmaku?icon=https://api.iconify.design/simple-icons:jsdelivr.svg?color=white)](https://www.jsdelivr.com/package/npm/danmaku)

[![Browser compatibility](https://saucelabs.com/browser-matrix/danmaku.svg)](https://saucelabs.com/u/danmaku)

Danmaku is a JavaScript library to display flying comments on HTML media elements (video and audio). It can also display comments to your container in real time without timeline.

[Demo](https://danmaku.js.org/)

[中文文档](https://github.com/weizhenye/Danmaku/wiki/%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3)

## Installation

You can install it with npm:

```bash
npm install danmaku
```

```js
// Full version
import Danmaku from 'danmaku';
// DOM engine only
import Danmaku from 'danmaku/dist/esm/danmaku.dom.js';
// Canvas engine only
import Danmaku from 'danmaku/dist/esm/danmaku.canvas.js';
```

Or use CDN ([jsDelivr](https://www.jsdelivr.com/package/npm/danmaku), [unpkg](https://unpkg.com/danmaku/)):

|  | Full | DOM engine only | Canvas engine only |
| - | - | - | - |
| UMD | [![](https://badgen.net/badgesize/gzip/weizhenye/danmaku/master/dist/danmaku.js?label=danmaku.js)](https://cdn.jsdelivr.net/npm/danmaku/dist/danmaku.js) | [![](https://badgen.net/badgesize/gzip/weizhenye/danmaku/master/dist/danmaku.dom.js?label=danmaku.dom.js)](https://cdn.jsdelivr.net/npm/danmaku/dist/danmaku.dom.js) | [![](https://badgen.net/badgesize/gzip/weizhenye/danmaku/master/dist/danmaku.canvas.js?label=danmaku.canvas.js)](https://cdn.jsdelivr.net/npm/danmaku/dist/danmaku.canvas.js) |
| UMD minified | [![](https://badgen.net/badgesize/gzip/weizhenye/danmaku/master/dist/danmaku.min.js?label=danmaku.min.js)](https://cdn.jsdelivr.net/npm/danmaku/dist/danmaku.min.js) | [![](https://badgen.net/badgesize/gzip/weizhenye/danmaku/master/dist/danmaku.dom.min.js?label=danmaku.dom.min.js)](https://cdn.jsdelivr.net/npm/danmaku/dist/danmaku.dom.min.js) | [![](https://badgen.net/badgesize/gzip/weizhenye/danmaku/master/dist/danmaku.canvas.min.js?label=danmaku.canvas.min.js)](https://cdn.jsdelivr.net/npm/danmaku/dist/danmaku.canvas.min.js) |
| ESM | [![](https://badgen.net/badgesize/gzip/weizhenye/danmaku/master/dist/esm/danmaku.js?label=esm/danmaku.js)](https://cdn.jsdelivr.net/npm/danmaku/dist/esm/danmaku.js) | [![](https://badgen.net/badgesize/gzip/weizhenye/danmaku/master/dist/esm/danmaku.dom.js?label=esm/danmaku.dom.js)](https://cdn.jsdelivr.net/npm/danmaku/dist/esm/danmaku.dom.js) | [![](https://badgen.net/badgesize/gzip/weizhenye/danmaku/master/dist/esm/danmaku.canvas.js?label=esm/danmaku.canvas.js)](https://cdn.jsdelivr.net/npm/danmaku/dist/esm/danmaku.canvas.js) |
| ESM minified | [![](https://badgen.net/badgesize/gzip/weizhenye/danmaku/master/dist/esm/danmaku.min.js?label=esm/danmaku.min.js)](https://cdn.jsdelivr.net/npm/danmaku/dist/esm/danmaku.min.js) | [![](https://badgen.net/badgesize/gzip/weizhenye/danmaku/master/dist/esm/danmaku.dom.min.js?label=esm/danmaku.dom.min.js)](https://cdn.jsdelivr.net/npm/danmaku/dist/esm/danmaku.dom.min.js) | [![](https://badgen.net/badgesize/gzip/weizhenye/danmaku/master/dist/esm/danmaku.canvas.min.js?label=esm/danmaku.canvas.min.js)](https://cdn.jsdelivr.net/npm/danmaku/dist/esm/danmaku.canvas.min.js) |

## Usage

### Media mode

```html
<div id="my-video-container" style="width:640px;height:360px;position:relative;">
  <video id="my-video" src="./example.mp4" style="position:absolute;"></video>
</div>

<div id="my-audio-container" style="width:640px;height:360px;position:relative;"></div>
<audio id="my-audio" src="./example.mp3"></audio>

<script src="path/to/danmaku.min.js"></script>
<script>
  var danmaku1 = new Danmaku({
    container: document.getElementById('my-video-container'),
    media: document.getElementById('my-video'),
    comments: []
  });
  var danmaku2 = new Danmaku({
    container: document.getElementById('my-audio-container'),
    media: document.getElementById('my-audio'),
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

<script src="path/to/socket.io.js"></script>
<script src="path/to/danmaku.min.js"></script>
<script>
  var danmaku = new Danmaku({
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
var danmaku = new Danmaku({
  // REQUIRED. The stage to display comments will be appended to container.
  container: document.getElementById('my-container'),

  // media can be <video> or <audio> element,
  // if it's not provided, Danmaku will be in live mode
  media: document.getElementById('my-media'),

  // Array of comment, used in media mode,
  // you can find its format in `danmaku.emit` API.
  comments: [],

  // You can use DOM engine or canvas engine to render comments.
  // Canvas engine may more efficient than DOM however it costs more memory.
  // 'DOM' by default in full version.
  engine: 'canvas',

  // You can also set speed by using `danmaku.speed` API.
  speed: 144
});
```

### Emit a comment

```js
danmaku.emit({
  text: 'example',

  // 'rtl'(right to left) by default, available mode: 'ltr', 'rtl', 'top', 'bottom'.
  mode: 'rtl',

  // Specified in seconds, if not provided when using with media,
  // it will be set to `media.currentTime`. Not required in live mode.
  time: 233.3,

  // When using DOM engine, Danmaku will create a <div> node for each comment,
  // the style object will be set to `node.style` directly, just write with CSS rules.
  // For example:
  style: {
    fontSize: '20px',
    color: '#ffffff',
    border: '1px solid #337ab7',
    textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
  },

  // When using canvas engine, Danmaku will create a <canvas> object for each comment,
  // you should pass in a CanvasRenderingContext2D object.
  // For example:
  style: {
    font: '10px sans-serif',
    textAlign: 'start',
    // Note that 'bottom' is the default
    textBaseline: 'bottom',
    direction: 'inherit',
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1.0,
    // ...
  },

  // A custom render to draw comment.
  // when `render` exist, `text` and `style` will be ignored.

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
* With canvas engine, line height is `1.2` by default, you can set it with `style.font`.
* With canvas engine, `style.font` uses the same syntax as the [CSS font](https://developer.mozilla.org/en-US/docs/Web/CSS/font) specifier. However you can only use `px`, `%`, `em`, `rem` units, I'm sure you don't need others.
* There is a hitbox for each comment, which height is determined by its line height. With canvas engine, when `style.textBaseline` is `top` or `hanging`, the baseline is set to top of the hitbox; when it's `middle`, baseline is middle of the hitbox; otherwise baseline is bottom of the hitbox. So if you set `style.textBaseline` to `alphabetic` or `hanging`, the comment's head or foot may out of the hitbox and be invisible.
* With canvas engine, [`style.filter`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter) is supported in Chrome 52 and Firefox 49.

### Resize

Do it when you resize container.

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
