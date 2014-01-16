function control(that){
	var	$ = function(id){ return document.getElementById(id); }
	var	danmaku = $('danmaku'),
		video = that.video,
		stage = that.stage;

	var	control = document.createElement('div');
	control.id = 'danmaku-control';
	control.innerHTML = '<div id="danmaku-progress-bar"><div id="danmaku-progress"></div></div><div id="danmaku-plause" class="icon-play" title="Play"></div><div id="danmaku-volume"><div id="danmaku-volume-button" class="icon-volume-high" title="100%"></div><div id="danmaku-volume-bar"><div id="danmaku-volume-progress"></div></div></div><div id="danmaku-time-display">00:00/00:00</div><input type="text" id="danmaku-input" placeholder=" Input comments here."></input><div id="danmaku-fullscreen" class="icon-expand2" title="Full Screen"></div><div id="danmaku-widescreen" class="icon-expand" title="Wide Screen"></div><div id="danmaku-comment" class="icon-bubble" title="Comment: ON"></div><div id="danmaku-send" class="icon-rocket" title="Send"></div>';
	danmaku.appendChild(control);

	var	bar = $('danmaku-progress-bar'),
		progress = $('danmaku-progress'),
		plause = $('danmaku-plause'),
		volumeButton = $('danmaku-volume-button'),
		volumeBar = $('danmaku-volume-bar'),
		volumeProgress = $('danmaku-volume-progress'),
		timeDisplay = $('danmaku-time-display'),
		input = $('danmaku-input'),
		send = $('danmaku-send'),
		comment = $('danmaku-comment'),
		widescreen = $('danmaku-widescreen'),
		fullscreen = $('danmaku-fullscreen');

	var	commentON = 1,
		isWide = 0;

	document.onkeypress = function(e){
		var	keyCode = e.which ? e.which : e.keyCode;
		if(keyCode == 32){
			e.preventDefault();
			var	video = $('video');
			video.paused ? video.play() : video.pause();
		}
	}
	bar.onclick = function(e){
		progress.style.width = e.layerX + 'px';
		video.currentTime = video.duration * e.layerX / video.offsetWidth;
		if(that.timeline.length) that.setCurrentTime(video.currentTime * 1000);
	}
	bar.onmousemove = function(e){
		bar.title = formatTime(video.duration * e.layerX / video.offsetWidth);
	}

	plause.onclick = function(){
		video.paused ? video.play() : video.pause();
	}
	stage.onclick = function(){
		video.paused ? video.play() : video.pause();
	}
	video.addEventListener('play', function(){
		if(that.timeline.length) that.start();
		plause.setAttribute('class','icon-pause');
		plause.title = 'Pause';
	});
	video.addEventListener('pause', function(){
		if(that.timeline.length) that.stop();
		plause.setAttribute('class','icon-play');
		plause.title = 'Play';
	});
	video.addEventListener('timeupdate', function(){
		progress.style.width = video.currentTime / video.duration * video.offsetWidth + 'px';
		timeDisplay.innerHTML = formatTime(video.currentTime) + '/' + formatTime(video.duration);
	}, false);

	volumeButton.onclick = function(){
		if(video.volume){
			video.volume = 0;
		}else{
			video.volume = 1;
		}
	}
	volumeBar.onclick = function(e){
		volumeProgress.style.width = (e.layerX - 67) + 'px';
		video.volume = (e.layerX - 67) / 80;
	}
	video.onvolumechange = function(){
		volumeButton.title = Math.floor(this.volume * 100) + '%';
		volumeProgress.style.width = this.volume * 80 + 'px';
		if(this.volume > 0.66)
			volumeButton.setAttribute('class','icon-volume-high');
		else if(this.volume > 0.33)
			volumeButton.setAttribute('class','icon-volume-medium');
		else volumeButton.setAttribute('class','icon-volume-low');
		if(this.volume == 0)
			volumeButton.setAttribute('class','icon-volume-mute');
	}

	comment.onclick = function(){
		if(commentON){
			stage.style.visibility = 'hidden';
			comment.setAttribute('class','icon-bubble2');
			comment.title = 'Comment: OFF';
		}else{
			stage.style.visibility = 'visible';
			comment.setAttribute('class','icon-bubble');
			comment.title = 'Comment: ON';
		}
		commentON ^= 1;
	}

	widescreen.onclick = function(){
		cancelFullScreen();
		if(isWide){
			widescreen.setAttribute('class','icon-expand');
			video.style.width = '640px';
			video.style.height = '360px';
			stage.style.width = '640px';
			stage.style.height = '360px';
			control.style.width = '640px';
			input.style.width = '240px';
		}else{
			widescreen.setAttribute('class','icon-contract');
			video.style.width = '960px';
			video.style.height = '540px';
			stage.style.width = '960px';
			stage.style.height = '540px';
			control.style.width = '960px';
			input.style.width = '560px';
		}
		isWide ^= 1;
	}

	fullscreen.onclick = function(){
		isFullScreen() ? cancelFullScreen() : requestFullScreen(danmaku);
	}
	document.addEventListener(fullscreenchange(), function(){
		if(isFullScreen()){
			fullscreen.setAttribute('class','icon-contract2');
			danmaku.style.top = 0;
			danmaku.style.left = 0;
			video.style.width = window.screen.width + 'px';
			video.style.height = window.screen.height + 'px';
			stage.style.width = window.screen.width + 'px';
			stage.style.height = window.screen.height + 'px';
			control.style.width = window.screen.width + 'px';
			input.style.width = (window.screen.width - 400) + 'px';
		}else{
			fullscreen.setAttribute('class','icon-expand2');
			danmaku.style.top = 'auto';
			danmaku.style.left = 'auto';
			video.style.width = '640px';
			video.style.height = '360px';
			stage.style.width = '640px';
			stage.style.height = '360px';
			control.style.width = '640px';
			control.style.bottom = 'auto';
			control.style.position = 'relative';
			input.style.width = '240px';
		}
	});

	send.onclick = function(){
		that.add({
			mode: 1,
			size: 25,
			color: '#808',
			stime: video.currentTime * 1000,
			text: input.value
		});
		input.value = '';
	}

	stage.onmousemove = function(e){
		if(isFullScreen() && (this.offsetHeight - e.layerY < 44)){
			control.style.bottom = 0;
			control.style.position = 'absolute';
		}else{
			control.style.bottom = 'auto';
			control.style.position = 'static';
		}
	}

	function formatTime(time){
		var	min = Math.floor(time / 60),
			sec = Math.floor(time) % 60;
		if(min < 10) min = '0' + min;
		if(sec < 10) sec = '0' + sec;
		return min + ':' + sec;
	}

	var	msFullscreen = 0;
	function requestFullScreen(e){
		if('webkitRequestFullScreen' in e)
			e.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		else if('mozRequestFullScreen' in e)
			e.mozRequestFullScreen();
		else if('msRequestFullscreen' in e){
			e.msRequestFullscreen();
			msFullscreen = 1;
		}
	}
	function cancelFullScreen(){
		if('webkitCancelFullScreen' in document)
			document.webkitCancelFullScreen();
		else if('mozCancelFullScreen' in document)
			document.mozCancelFullScreen();
		else if('msExitFullscreen' in document){
			document.msExitFullscreen();
			msFullscreen = 0;
		}
	}
	function isFullScreen(){
		if('webkitIsFullScreen' in document)
			return document.webkitIsFullScreen;
		else if('mozFullScreen' in document)
			return document.mozFullScreen;
		else if('msExitFullscreen' in document)
			return msFullscreen;
	}
	function fullscreenchange(){
		if('webkitCancelFullScreen' in document)
			return 'webkitfullscreenchange';
		else if('mozCancelFullScreen' in document)
			return 'mozfullscreenchange';
		else if('msExitFullscreen' in document)
			return 'MSFullscreenChange';
	}
}
