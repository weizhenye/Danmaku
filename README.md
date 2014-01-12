Danmaku.js displays flying comments on video.

It's based on [CommentCoreLibrary](https://github.com/jabbany/CommentCoreLibrary).

See [Demo](https://weizhenye.github.com/Danmaku/).

# Usage
	<script src="js/danmaku.js"></script>
	<script src="js/control.js"></script>
	<script>
		var	url = 'example.json',
			data = [{mode: 1,size: 22,color: '#FFFFFF',stime: 2333,text: 'example'}],
			video = document.getElementById('video');
			
		var	danmaku = new Danmaku();
		danmaku.init({
			comments: data,/* or url */
			video: video
		});
		control(danmaku);
	</script>
You may write control.js yourself. My [control.js](https://github.com/weizhenye/Danmaku/blob/master/control.js) is an example of HTML5 Video API.


# API

### Initialization
	danmaku.init({
		comments: data,/* or url */
		video: document.getElementById('video')
	});
### Add comment
	danmaku.add({
		mode: 1,/* fly: 1, top: 5, bottom: 4 */
		size: 22,/* font size */
		color: '#FFFFFF',
		stime: 2333,/* strat time */
		text: 'example'
	});
### Start
	danmaku.start();
### Stop
	danmaku.stop();
### Set current time
	danmaku.setCurrentTime(video.currentTime * 1000);/* Milliseconds */
### Stage
	danmaku.stage
