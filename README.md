Danmaku.js displays flying comments on video.

It's based on [CommentCoreLibrary](https://github.com/jabbany/CommentCoreLibrary).

See [Demo](https://weizhenye.github.com/Danmaku/).

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
		mode: 1,/*fly: 1, top: 5, bottom: 4*/
		size: 22,/*font size*/
		color: '#FFFFFF',
		stime: 2333,/*strat time*/
		text: 'example'
	});
### Start
	danmaku.start();
### Stop
	danmaku.stop();
### Set current time
	danmaku.setCurrentTime(video.currentTime * 1000);// Milliseconds
