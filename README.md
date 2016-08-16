Danmaku
======

Danmaku is a JavaScript library to display flying comments on HTML5 video. It can also display comments to your container in real time without timeline or be used with HTML5 audio.

[Demo](https://danmaku.js.org/)

## Usage

You can install it by using [bower](http://bower.io/):
```
bower install danmaku
```
Or download [danmaku.js](https://github.com/weizhenye/Danmaku/raw/master/danmaku.js) directly and include it in your html.

```html
<div id="myContainer" style="width:640px;height:360px;"></div>

<script src="danmaku.js"></script>
<script>
  var danmaku = new Danmaku();
  danmaku.init({
    container: document.getElementById('myContainer')
  });
</script>
```

## API

### Initialization

```js
var danmaku = new Danmaku();
```

Real time mode

```js
danmaku.init({
  // the stage to display comments will be appended to container.
  container: document.getElementById('myContainer'),

  // you can use DOM engine or canvas engine to render comments.
  // Canvas engine may more efficient than DOM however it costs more memory.
  // 'DOM' by default, available in all mode.
  engine: 'DOM'
});
```

Using with HTML5 video

```js
danmaku.init({
  // Danmaku will create a container automaticly and append video to the
  // container if container isn't assigned.
  video: document.getElementById('myVideo'),

  // Array of comment, you can find its format below.
  comments: [],

  engine: 'canvas'
});
```

Using with HTML5 audio

```js
danmaku.init({
  audio: document.getElementById('myAudio'),
  container: document.getElementById('myContainer'),
  comments: [],
  engine: 'canvas'
});
```

### Emit a comment

```js
var comment = {
  text: 'example',

  // 'rtl'(right to left) by default, available mode: 'ltr', 'rtl', 'top', 'bottom'.
  mode: 'rtl',

  // Specified in seconds, if not provided when using with media(video or audio),
  // it will be set to `media.currentTime`. Not required in real time mode.
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
    font: '10px sans-serif',
    textAlign: 'start',
    direction: 'inherit',
    fillStyle: '#000',
    strokeStyle: '#000',
    shadowBlur: 0,
    shadowColor: '#000',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    globalAlpha: 1.0
  }
};
danmaku.emit(comment);
```

More details about [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

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

### Speed
There is a property `duration` for all comments, which means how long will a comment be shown to the stage. `duration` is calculated by `stage.width / danmaku.speed`, and `danmaku.speed` is a standard for all comments, because the actually speed for each comment is then calculated by `(comment.width + stage.width) / duration`. The default value is 144.

```js
danmaku.speed = 144;
```
