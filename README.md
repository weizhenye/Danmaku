Danmaku
======

Danmaku is a JavaScript library to display flying comments on HTML5 video. It can also display comments to your container in real time without timeline or be used with HTML5 audio.

[Demo](http://danmaku.woozy.im/)

## Usage
	<div id="myContainer" style="width:640px;height:360px;"></div>

	<script src="danmaku.js"></script>
	<script>
	  var danmaku = new Danmaku();
	  danmaku.init({
	  	container: document.getElementById('myContainer')
	  });
	</script>


## API

### Initialization
	var danmaku = new Danmaku();

	// real time mode
	danmaku.init({
	  // the stage to display comments will be appended to container.
	  container: document.getElementById('myContainer')
	});

	// using with HTML5 video
	danmaku.init({
	  // Danmaku will create a container automaticly and append video to the 
	  // container if container isn't assigned.
	  video: document.getElementById('myVideo'),

	  // array of comment, you can find its format below.
	  comments: []
	});

	// using with HTML5 audio
	danmaku.init({
	  audio: document.getElementById('myAudio'),
	  container: document.getElementById('myContainer'),
	  comments: []
	});

### Emit a comment
	var comment = {
	  text: 'example',

	  mode: 'rightToLeft', // 'rightToLeft' by default, available mode:
	                       // 'leftToRight', 'rightToLeft', 'top', 'bottom'.

	  time: 233.3,         // specified in seconds, if not provided when using
	                       // with media(video or audio), it will be set to
	                       // media.currentTime. Not required in real time mode.

	  style: {             // each comment create a <div>, style will be set to 
	  	                   // comment.style directly, just write with CSS rules.
	    fontSize: '20px',
	    color: '#ffffff',
	    border: '1px solid #337ab7',
	    textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
	  }
	};
	danmaku.emit(comment);

### Resize
	danmaku.resize(); // do it when you resize container or video.

### Show
	danmaku.show();

### Hide
	danmaku.hide();

### Comments list
	danmaku.comments;
