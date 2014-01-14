function Danmaku(){
	var	that = this,
		runTimer = 0,
		launchTimer = 0;
	this.position = 0;
	this.timeline = [];
	this.runline = [];
	this.channel = [];
	this.channelTop = [];
	this.channelBottom = [];
	this.init = function(opt){
		this.video = opt.video;

		var	danmaku = document.createElement('div');
		danmaku.id = 'danmaku';
		this.video.parentNode.insertBefore(danmaku, this.video);
		danmaku.style.position = this.video.style.position;
		this.video.style.position = 'absolute';
		danmaku.appendChild(this.video);

		this.stage = document.createElement('div');
		this.stage.id = 'danmaku-stage';
		this.stage.style.width = this.video.offsetWidth + 'px';
		this.stage.style.height = this.video.offsetHeight + 'px';
		this.stage.style.position = 'relative';
		this.stage.style.overflow = 'hidden';
		danmaku.appendChild(this.stage);

		if(typeof(opt.comments) == 'object'){
			this.timeline = opt.comments.sort(function(a,b){
				if(a.stime > b.stime) return 1;
				if(a.stime < b.stime) return -1;
				return 0;
			});
		}else if(typeof(opt.comments) == 'string') this.load(opt.comments);
	}
	this.load = function(url){
		var	xhr = new XMLHttpRequest();
		xhr.open('GET', url, false);
		xhr.onreadystatechange = function (){
			if (xhr.readyState == 4){
				if(xhr.status == 200){
					that.timeline = JSON.parse(xhr.responseText);
					that.timeline.sort(function(a,b){
						if(a.stime > b.stime) return 1;
						if(a.stime < b.stime) return -1;
						return 0;
					});
				}else{
					console.log(xhr.statusText);
				}
			}
		};
		xhr.send(null);
	}
	this.start = function(){
		if(runTimer > 0) return;
		var	lastTPos = new Date().getTime();
		runTimer = setInterval(function(){
			var	elapsed = new Date().getTime() - lastTPos;
			lastTPos = new Date().getTime();
			for(var	i = 0; i < that.runline.length; ++i){
				var	cmt = that.runline[i];
				if(cmt.mode == 1)
					cmt.style.left = (cmt.ttl / cmt.dur) * (that.stage.offsetWidth + cmt.offsetWidth) - cmt.offsetWidth + 'px';
				cmt.ttl -= elapsed;
				if(cmt.ttl <= 0){
					that.freeChannel(cmt);
					that.stage.removeChild(cmt);
					that.runline.splice(i,1);
				}
			}
		},10);
		launchTimer = setInterval(function(){
			var	playhead = that.video.currentTime * 1000;
			while(that.timeline[that.position].stime <= playhead){
				that.launch(that.timeline[that.position]);
				++that.position;
			}
		},10);
	}
	this.stop = function(){
		clearInterval(runTimer);
		runTimer = 0;
		clearInterval(launchTimer);
	}
	this.launch = function(data){
		var	cmt = document.createElement('div');
		this.set(cmt, data);
		this.runline.push(cmt);
	}
	this.set = function(cmt, data){
		cmt.className = 'cmt';
		cmt.id = 'cmt' + this.position;
		cmt.mode = data.mode;
		cmt.appendChild(document.createTextNode(data.text));
		cmt.innerText = data.text;
		cmt.style.fontSize = data.size + 'px';
		cmt.style.color = data.color;
		cmt.style.textShadow = '1px 1px 1px #000';
		cmt.style.position = 'absolute';
		this.stage.appendChild(cmt);
		cmt.style.width = (cmt.offsetWidth + 1) + 'px';
		cmt.style.height = (cmt.offsetHeight - 3) + 'px';
		if(cmt.mode == 1)
			cmt.style.left = this.stage.offsetWidth + 'px';
		if(cmt.mode == 4 || cmt.mode == 5)
			cmt.style.left = ((that.stage.offsetWidth - cmt.offsetWidth) / 2) + 'px';
		cmt.channel = this.getChannel(cmt);
		if(cmt.mode == 4)
			cmt.style.top = (this.stage.offsetHeight - cmt.offsetHeight - cmt.channel % this.stage.offsetHeight) + 'px';
		else
			cmt.style.top = (cmt.channel % (this.stage.offsetHeight - cmt.offsetHeight)) + 'px';
		cmt.ttl = 4000 * this.stage.offsetWidth / 640;
		cmt.dur = 4000 * this.stage.offsetWidth / 640;
	}
	this.clear = function(){
		for(var	i = 0; i < this.runline.length; ++i)
			this.stage.removeChild(this.runline[i]);
		this.runline = [];
		this.channel = [];
		this.channelTop = [];
		this.channelBottom = [];
	}
	this.binSearch = function(time){
		var	middle,
			left = 0,
			right = this.timeline.length;
		while(left <= right){
			middle = Math.floor((left + right) / 2);
			if(time <= this.timeline[middle].stime) right = middle - 1;
			else left = middle + 1;
		}
		if(right < 0) right = 0;
		return right;
	}
	this.add = function(cmt){
		this.timeline.splice(this.binSearch(cmt.stime) + 1, 0, cmt);
	}
	this.setCurrentTime = function(time){
		this.clear();
		this.position = this.binSearch(time);
	}
	this.getChannel = function(cmt){
		var	channel = -1;
		if(cmt.mode == 1){
			function checkConflict(channel, cmt){
				for(var	i = channel; i < channel + cmt.offsetHeight - 3; ++i){
					var	rightPos = 0,
						prevWidth = 0;
					if(that.channel[i] !== undefined){
						var	prevcmt = document.getElementById(that.channel[i]);
						prevWidth = prevcmt.offsetWidth;
						rightPos = prevcmt.style.left.match(/\d+/)[0] + prevWidth;
					}
					var	v1 = that.stage.offsetWidth + cmt.offsetWidth,
						v2 = that.stage.offsetWidth + prevWidth;
					if(rightPos / v2 > (that.stage.offsetWidth - rightPos) / Math.abs(v1-v2))
						return -(i + 1);
				}
				return channel;
			}
			while(channel < 0) channel = checkConflict(-channel, cmt);
			for(var	i = channel; i < channel + cmt.offsetHeight - 3; ++i) this.channel[i] = cmt.id;
		}
		if(cmt.mode == 4 || cmt.mode == 5){
			function checkTBConflict(channel, cmt){
				for(var	i = channel; i < channel + cmt.offsetHeight - 3; ++i)
					if(cmt.mode == 5 && that.channelTop[i] || cmt.mode == 4 && that.channelBottom[i])
						return -(i + 1);
				return channel;
			}
			while(channel < 0) channel = checkTBConflict(-channel, cmt);
			for(var	i = channel; i < channel + cmt.offsetHeight - 3; ++i){
				if(cmt.mode == 4) this.channelBottom[i] = 1;
				if(cmt.mode == 5) this.channelTop[i] = 1;
			}
		}
		return channel;
	}
	this.freeChannel = function(cmt){
		if(cmt.mode == 1){
			for(var	i = cmt.channel; i < cmt.channel + cmt.offsetHeight - 3; ++i)
				if(that.channel[i] == cmt.id)
					that.channel[i] = undefined;
		}
		if(cmt.mode == 4 || cmt.mode == 5){
			for(var	i = cmt.channel; i < cmt.channel + cmt.offsetHeight - 3; ++i){
				if(cmt.mode == 4) that.channelBottom[i] = 0;
				if(cmt.mode == 5) that.channelTop[i] = 0;
			}
		}
	}
}
