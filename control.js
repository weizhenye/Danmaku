function control(that){
	var	$ = function(id){ return document.getElementById(id); }
	var	danmaku = $('danmaku'),
		video = that.video,
		stage = that.stage;

	var	control = document.createElement('div');
	control.id = 'danmaku-control';
	control.innerHTML = '\
		<div id="danmaku-progress-bar"><div id="danmaku-progress"></div></div>\
		<button id="danmaku-plause" title="Play">&#xe803</button><button id="danmaku-comment" title="Comment ON">&#xe809</button><button id="danmaku-widescreen">&#xe805</button><!-- button id="danmaku-fullscreen">&#xe806</button --><button id="danmaku-volume">&#xe802</button><input id="danmaku-input" type="text"><button id="danmaku-send">Send</button>\
		<span id="danmaku-time-display"></span>\
	';
	danmaku.appendChild(control);

	var fontFace = document.createElement('style');
	fontFace.innerHTML = '\
		@font-face {\
			font-family: "fontello";\
			src: url("font/fontello.eot");\
			src: url("font/fontello.eot") format("embedded-opentype"),\
				 url("font/fontello.woff") format("woff"),\
				 url("font/fontello.ttf") format("truetype"),\
				 url("font/fontello.svg") format("svg");\
			font-weight: normal;\
			font-style: normal;\
		}\
	';
	danmaku.appendChild(fontFace);
	var	buttons = danmaku.getElementsByTagName('button');
	for(var	i = 0; i < buttons.length; ++i){
		buttons[i].style.width = '32px';
		buttons[i].style.height = '32px';
		buttons[i].style.fontSize = '20px';
		buttons[i].style.fontFamily = 'fontello';
	}

	var	bar = $('danmaku-progress-bar'),
		progress = $('danmaku-progress'),
		timeDisplay = $('danmaku-time-display'),
		plause = $('danmaku-plause'),
		comment = $('danmaku-comment'),
		widescreen = $('danmaku-widescreen'),
		// fullscreen = $('danmaku-fullscreen'),
		volume = $('danmaku-volume'),
		input = $('danmaku-input'),
		send = $('danmaku-send');
	bar.style.width = video.offsetWidth + 'px';
	bar.style.height = '12px';
	bar.style.backgroundColor = '#BBB';
	progress.style.width = '0px';
	progress.style.height = '12px';
	progress.style.backgroundColor = '#222';
	input.style.fontSize = '14px';
	input.style.width = '300px';
	input.style.height = '24px';
	input.style.fontSize = '22px';
	send.style.width = '64px';

	var	commentON = 1,
		isWide = 0;

	plause.onclick = function(){
		if(video.paused){
			video.play();
			that.start();
			plause.innerHTML = '&#xe804';
			plause.title = 'Pause';
		}else{
			video.pause();
			that.stop();
			plause.innerHTML = '&#xe803';
			plause.title = 'Play';
		}
	}
	video.addEventListener('timeupdate', function(){
		progress.style.width = video.currentTime / video.duration * video.offsetWidth + 'px';
		timeDisplay.innerHTML = formatTime(video.currentTime) + '/' + formatTime(video.duration);
	}, false);

	bar.onclick = function(e){
		progress.style.width = e.offsetX + 'px';
		video.currentTime =  video.duration * e.offsetX / video.offsetWidth;
		that.setCurrentTime(video.currentTime * 1000);
	}
	bar.onmousemove = function(e){
		bar.title = formatTime(video.duration * e.offsetX / video.offsetWidth);
	}

	comment.onclick = function(){
		if(commentON){
			stage.style.visibility = 'hidden';
			comment.innerHTML = '&#xe80a';
			comment.title = 'Comment OFF';
		}else{
			stage.style.visibility = 'visible';
			comment.innerHTML = '&#xe809';
			comment.title = 'Comment ON';
		}
		commentON ^= 1;
	}

	widescreen.onclick = function(){
		if(isWide){
			widescreen.innerHTML = '&#xe805';
			video.style.width = '640px';
			video.style.height = '360px';
			stage.style.width = '640px';
			stage.style.height = '360px';
			bar.style.width = '640px';
		}else{
			widescreen.innerHTML = '&#xe807';
			video.style.width = '960px';
			video.style.height = '540px';
			stage.style.width = '960px';
			stage.style.height = '540px';
			bar.style.width = '960px';
		}
		isWide ^= 1;
	}

	volume.onclick = function(){
		if(video.volume){
			video.volume = 0;
			volume.innerHTML = '&#xe800';
		}else{
			video.volume = 1;
			volume.innerHTML = '&#xe802';
		}
	}

	send.onclick = function(){
		that.add({
			mode: 1,
			size: 22,
			color: '#808',
			stime: video.currentTime * 1000,
			text: input.value
		});
	}

	function formatTime(time){
		var	min = Math.floor(time / 60),
			sec = Math.floor(time) % 60;
		if(min < 10) min = '0' + min;
		if(sec < 10) sec = '0' + sec;
		return min + ':' + sec;
	}
}
