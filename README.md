Danmaku.js displays flying comments on video.

It's based on [CommentCoreLibrary](https://github.com/jabbany/CommentCoreLibrary).

See [Demo](https://github.com/weizhenye/Danmaku).

# Usage
	<script src="js/danmaku.js"></script>
	<script src="js/control.js"></script>
	<script>
		var	danmaku = new Danmaku();
		danmaku.init({
			url: 'example.json',
			video: document.getElementById('video'),
			control: control /*in control.js*/
		});
	</script>
You may write control.js yourself. My [control.js](https://github.com/weizhenye/Danmaku/blob/master/control.js) is an example of HTML5 Video API.


# API

### Initialization
	danmaku.init({
		url: 'example.json',
		video: document.getElementById('video'),
		control: control
	});
### Add comment
	danmaku.add({
		mode: 1,
		size: 22,
		color: '#FFFFFF',
		stime: 2333,
		text: 'example'
	});
### Start
	danmaku.start();
### Stop
	danmaku.stop();
