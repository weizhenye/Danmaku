var videoReady = false,
    audioReady = false,
    videoDanmaku = new Danmaku(),
    audioDanmaku = new Danmaku(),
    mode = 'video';
var danmakuResize = document.getElementById('danmaku-resize'),
    danmakuShow = document.getElementById('danmaku-show'),
    danmakuHide = document.getElementById('danmaku-hide'),
    mediaMode = document.getElementById('media-mode'),
    videoMode = document.getElementById('video-mode'),
    audioMode = document.getElementById('audio-mode'),
    realtimeMode = document.getElementById('realtime-mode'),
    getDanmaku = document.getElementById('get-danmaku'),
    dropArea = document.getElementById('drop-area')
    dropAreaSpan = dropArea.querySelector('span'),
    fileInput = dropArea.querySelector('input'),
    modeSelector = document.getElementById('mode-selector');
modeSelector.addEventListener('change', function(e) {
  var id = e.target.id;
  if (id === 'input-video') {
    mediaMode.style.display = 'block';
    videoMode.style.display = 'block';
    audioMode.style.display = 'none';
    realtimeMode.style.display = 'none';
    mode = 'video';
    dropAreaSpan.textContent = 'Select or drag a video file here';
  }
  if (id === 'input-audio') {
    mediaMode.style.display = 'block';
    videoMode.style.display = 'none';
    audioMode.style.display = 'block';
    realtimeMode.style.display = 'none';
    mode = 'audio';
    dropAreaSpan.textContent = 'Select or drag a audio file here';
  }
  if (id === 'input-realtime') {
    mediaMode.style.display = 'none';
    realtimeMode.style.display = 'block';
    mode = 'realtime';
  }
});
danmakuResize.addEventListener('click', function() {
  if (mode === 'video') {
    var video = document.querySelector('video');
    if (video.clientWidth === 640) {
      video.style.width = '960px';
      video.style.height = '540px';
    } else {
      video.style.width = '640px';
      video.style.height = '360px';
    }
    videoDanmaku.resize();
  }
  if (mode === 'audio') {
    var container = document.querySelector('.danmaku-container'),
        canvas = container.querySelector('canvas');
    if (container.clientWidth === 640) {
      container.style.width = '960px';
      container.style.height = '540px';
      canvas.width = 960;
      canvas.height = 540;
    } else {
      container.style.width = '640px';
      container.style.height = '360px';
      canvas.width = 640;
      canvas.height = 360;
    }
    audioDanmaku.resize();
  }
});
danmakuShow.addEventListener('click', function() {
  if (mode === 'video') videoDanmaku.show();
  if (mode === 'audio') audioDanmaku.show();
});
danmakuHide.addEventListener('click', function() {
  if (mode === 'video') videoDanmaku.hide();
  if (mode === 'audio') audioDanmaku.hide();
});
var courl = (window.URL && window.URL.createObjectURL) ||
            (window.webkitURL && window.webkitURL.createObjectURL) ||
            window.createObjectURL ||
            window.createBlobURL;
dropArea.ondragleave = function() {
  this.style.borderColor = '#ccc';
}
dropArea.ondragover = function(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  this.style.borderColor = '#888';
};
dropArea.ondrop = function(e) {
  e.stopPropagation();
  e.preventDefault();
  this.style.borderColor = '#ccc';
  loadMedia(e.dataTransfer.files[0]);
};
fileInput.onchange = function() {
  loadMedia(this.files[0]);
};
var loadMedia = function(file) {
  if (mode === 'video') {
    var video = document.createElement('video');
    video.src = courl(file);
    video.controls = true;
    video.onloadedmetadata = function() {
      videoMode.style.zIndex = 2;
      videoMode.appendChild(video);
      videoReady = true;
    };
    video.onerror = function(e) {
      message('can\'t open this video.', 'error');
    };
  }
  if (mode === 'audio') {
    var container = audioMode.querySelector('.danmaku-container');
    var audio = document.createElement('audio');
    audio.src = courl(file);
    audio.controls = true;
    audio.onloadedmetadata = function() {
      audioMode.style.zIndex = 2;
      container.appendChild(audio);
      audioReady = true;
      spectrum(audio, audioMode.querySelector('canvas'));
    };
    audio.onerror = function(e) {
      message('can\'t open this audio.', 'error');
    };
  }
};
var spectrum = function(audio, canvas) {
  var rafid = 0,
      cctx = canvas.getContext('2d'),
      actx = new AudioContext(),
      analyser = actx.createAnalyser(),
      bufferLength = analyser.frequencyBinCount,
      dataArray = new Uint8Array(bufferLength);
  analyser.connect(actx.destination);
  analyser.getByteFrequencyData(dataArray);
  var source = actx.createMediaElementSource(audio);
  source.connect(analyser);
  draw();
  function draw() {
    rafid = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    cctx.clearRect(0, 0, canvas.width, canvas.height);
    cctx.lineWidth = 2;
    cctx.strokeStyle = 'rgb(0, 0, 0)';
    cctx.beginPath();
    var sliceWidth = canvas.width * 1.0 / bufferLength;
    for (var x = 0, i = 0; i < bufferLength; i++) {
      var y = (1 - dataArray[i] / 256.0) * canvas.height;
      (i === 0) ?  cctx.moveTo(x, y) : cctx.lineTo(x, y);
      x += sliceWidth;
    }
    cctx.stroke();
    cctx.closePath();
  }
}
getDanmaku.querySelector('button').addEventListener('click', function() {
  var input = getDanmaku.querySelector('input');
  if (!input.value) return;
  var api = 'http://bilibili.ap01.aws.af.cm/' + input.value;
  input.value = '';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', api, 1);
  xhr.send(null);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var result = JSON.parse(xhr.responseText);
        var data = {
          title: result.title,
          cid: result.cid
        };
        downloadDanmaku(data);
      } else {
        message('can\'t load the comments file.', 'error');
      }
    }
  };
});
var downloadInfo = function(url) {
  var api = 'http://bilibili.ap01.aws.af.cm/' + url;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', api, 1);
  xhr.send(null);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var result = JSON.parse(xhr.responseText);
        var data = {
          title: result.title,
          cid: result.cid
        };
        downloadDanmaku(data);
      } else {
        message('can\'t load the comments file.', 'error');
      }
    }
  };
};
var downloadDanmaku = function(data) {
  var url = 'http://comment.bilibili.com/' + data.cid + '.xml';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, 1);
  xhr.send(null);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        data.comments = BilibiliParser(xhr.responseXML);
        try {
          localStorage['cid' + data.cid] = JSON.stringify(data);
          showFile();
          message('comments file loaded.', 'success');
        } catch (e) {
          message('exceeding storage quota, delete some comment files.', 'error');
        }
      } else {
        message('can\'t load the comments file.', 'error');
      }
    }
  };
};
var showFile = function() {
  var df = document.getElementById('danmaku-file');
  while (df.lastChild) df.removeChild(df.lastChild);
  for (var key in localStorage) {
    if (!/cid\d+/.test(key)) continue;
    var data = JSON.parse(localStorage[key]);
    df.appendChild(new DanmakuFileNode(data));
  }
};
showFile();
var showComment = function(comments) {
  var df = document.createDocumentFragment(),
      dc = document.getElementById('danmaku-comments');
  for (var i = 0; i < comments.length; i++) {
    df.appendChild(new DanmakuCommentNode(comments[i]));
  }
  dc.appendChild(df);
  document.getElementById('comments').checked = true;
};
var formatTime = function(t) {
  var m = Math.floor(t / 60),
      s = Math.floor(t) % 60;
  if (m < 10) m = '0' + m;
  if (s < 10) s = '0' + s;
  return m + ':' + s;
};
var init = function(data) {
  var canvasEngine = document.querySelector('#canvas-engine');
  if (mode === 'video') {
    if (videoReady) {
      videoDanmaku.init({
        video: document.querySelector('video'),
        comments: data.comments,
        engine: canvasEngine.checked ? 'canvas' : 'DOM'
      });
      showComment(data.comments);
      enableControls();
    } else message('require video.', 'error');
  }
  if (mode === 'audio') {
    if (audioReady) {
      audioDanmaku.init({
        audio: document.querySelector('audio'),
        container: audioMode.querySelector('.danmaku-container'),
        comments: data.comments,
        engine: canvasEngine.checked ? 'canvas' : 'DOM'
      });
      showComment(data.comments);
      enableControls();
    } else message('require audio.', 'error');
  }
};
var enableControls = function() {
  danmakuResize.disabled = false;
  danmakuShow.disabled = false;
  danmakuHide.disabled = false;
};
function DanmakuFileNode(data) {
  var ul = document.createElement('ul'),
      li = document.createElement('li'),
      title = document.createElement('div'),
      buttons = document.createElement('div'),
      initBtn = document.createElement('button'),
      reloadBtn = document.createElement('button'),
      deleteBtn = document.createElement('button');
  title.className = 'file-title';
  buttons.className = 'file-buttons';
  title.textContent = data.title;
  title.title = data.title;
  initBtn.textContent = 'Initialize';
  reloadBtn.textContent = 'Reload';
  deleteBtn.textContent = 'Delete';
  buttons.appendChild(initBtn);
  buttons.appendChild(reloadBtn);
  buttons.appendChild(deleteBtn);
  li.appendChild(title);
  li.appendChild(buttons);
  ul.appendChild(li);
  initBtn.addEventListener('click', function() { init(data) });
  reloadBtn.addEventListener('click', function() {
    downloadDanmaku(data);
  });
  deleteBtn.addEventListener('click', function() {
    localStorage.removeItem('cid' + data.cid);
    showFile();
  });
  return ul;
}
function DanmakuCommentNode(data) {
  var ul = document.createElement('ul'),
      li = document.createElement('li'),
      time = document.createElement('span'),
      text = document.createElement('span');
  time.textContent = formatTime(data.time);
  text.textContent = data.text;
  time.className = 'comment-time';
  text.className = 'comment-text';
  text.title = data.text;
  li.appendChild(time);
  li.appendChild(text);
  ul.appendChild(li);
  return ul;
}
var message = function(msg, type) {
  var node = document.getElementById('message');
  node.textContent = msg;
  node.className = type + ' transition';
  node.style.opacity = 0;
  node.addEventListener('transitionend', function() {
    node.textContent = '';
    node.className = '';
    node.style.opacity = 1;
  });
};
