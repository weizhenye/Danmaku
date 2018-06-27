var SERVER_ORIGIN = 'https://danmaku-demo-server-dwunvywgtw.now.sh';
var SAMPLE_VIDEO = 'https://media.w3.org/2010/05/video/movie_300.mp4';
var $ = function(s) {return document.querySelectorAll(s)};
var socket = io(SERVER_ORIGIN + '/live');
var videoReady = false,
    audioReady = false,
    videoDanmaku = new Danmaku(),
    audioDanmaku = new Danmaku(),
    realtimeDanmaku = new Danmaku(),
    mode = 'video';
var $mediaMode = $('#media-mode')[0],
    $videoMode = $('#video-mode')[0],
    $audioMode = $('#audio-mode')[0],
    $realtimeMode = $('#realtime-mode')[0],
    $dropText = $('#drop-text')[0];
$('#mode-selector')[0].addEventListener('change', function(e) {
  var id = e.target.id;
  if (id === 'mode-video') {
    $mediaMode.style.display = 'block';
    $videoMode.style.display = 'block';
    $audioMode.style.display = 'none';
    $realtimeMode.style.display = 'none';
    mode = 'video';
    $dropText.textContent = 'Select or drag a video file here';
  }
  if (id === 'mode-audio') {
    $mediaMode.style.display = 'block';
    $videoMode.style.display = 'none';
    $audioMode.style.display = 'block';
    $realtimeMode.style.display = 'none';
    mode = 'audio';
    $dropText.textContent = 'Select or drag a audio file here';
  }
  if (id === 'mode-realtime') {
    $mediaMode.style.display = 'none';
    $realtimeMode.style.display = 'block';
    mode = 'realtime';
    if (!realtimeDanmaku._isInited) {
      init();
    }
  }
});
$('#danmaku-init')[0].addEventListener('click', function() {
  loadMedia('video', SAMPLE_VIDEO);
  this.disabled = true;
});
$('#danmaku-resize')[0].addEventListener('click', function() {
  if (mode === 'video') {
    var $video = $('video')[0];
    if ($video.clientWidth === 640) {
      $video.style.width = '960px';
      $video.style.height = '540px';
    } else {
      $video.style.width = '640px';
      $video.style.height = '360px';
    }
    videoDanmaku.resize();
  }
  if (mode === 'audio') {
    var $container = $('.danmaku-container')[0],
        $canvas = $('.danmaku-container canvas')[0];
    if ($container.clientWidth === 640) {
      $container.style.width = '960px';
      $container.style.height = '540px';
      $canvas.width = 960;
      $canvas.height = 540;
    } else {
      $container.style.width = '640px';
      $container.style.height = '360px';
      $canvas.width = 640;
      $canvas.height = 360;
    }
    audioDanmaku.resize();
  }
  if (mode === 'realtime') {
    var $container = $('#realtime-container')[0];
    if ($container.offsetWidth === 640) {
      $container.style.width = '960px';
      $container.style.height = '540px';
    } else {
      $container.style.width = '640px';
      $container.style.height = '360px';
    }
    realtimeDanmaku.resize();
  }
});
$('#danmaku-show')[0].addEventListener('click', function() {
  if (mode === 'video') videoDanmaku.show();
  if (mode === 'audio') audioDanmaku.show();
  if (mode === 'realtime') realtimeDanmaku.show();
});
$('#danmaku-hide')[0].addEventListener('click', function() {
  if (mode === 'video') videoDanmaku.hide();
  if (mode === 'audio') audioDanmaku.hide();
  if (mode === 'realtime') realtimeDanmaku.hide();
});
$('#danmaku-clear')[0].addEventListener('click', function() {
  if (mode === 'video') videoDanmaku.clear();
  if (mode === 'audio') audioDanmaku.clear();
  if (mode === 'realtime') realtimeDanmaku.clear();
});
$('#danmaku-destroy')[0].addEventListener('click', function() {
  if (mode === 'video') videoDanmaku.destroy();
  if (mode === 'audio') audioDanmaku.destroy();
  if (mode === 'realtime') realtimeDanmaku.destroy();
});
$('#danmaku-speed')[0].addEventListener('change', function() {
  var s = this.value * 1;
  $('#danmaku-speed-number')[0].textContent = s;
  videoDanmaku.speed = s;
  audioDanmaku.speed = s;
  realtimeDanmaku.speed = s;
});
$('#danmaku-send')[0].addEventListener('click', function() {
  var text = $('#danmaku-emit')[0].value;
  var comment = {text: text};
  $('#danmaku-emit')[0].value = '';
  if (!text) return;
  if (mode === 'video') videoDanmaku.emit(comment);
  if (mode === 'audio') audioDanmaku.emit(comment);
  if (mode === 'realtime') {
    realtimeDanmaku.emit(comment);
    socket.emit('danmaku', comment);
  }
});
var $dropArea = $('#drop-area')[0];
$dropArea.ondragleave = function() {
  this.style.borderColor = '#ccc';
}
$dropArea.ondragover = function(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  this.style.borderColor = '#888';
};
$dropArea.ondrop = function(e) {
  e.stopPropagation();
  e.preventDefault();
  this.style.borderColor = '#ccc';
  loadMedia(mode, window.URL.createObjectURL(e.dataTransfer.files[0]));
};
$('#drop-area input')[0].onchange = function() {
  loadMedia(mode, window.URL.createObjectURL(e.dataTransfer.files[0]));
};
var loadMedia = function(mode, url) {
  if (mode === 'video') {
    var $video = document.createElement('video');
    $video.src = url;
    $video.controls = true;
    $video.onloadedmetadata = function() {
      $videoMode.style.zIndex = 2;
      $videoMode.appendChild($video);
      videoReady = true;
    };
    $video.onerror = function(e) {
      message('can\'t open this video.', 'error');
    };
  }
  if (mode === 'audio') {
    var $container = $('#audio-mode .danmaku-container')[0];
    var $audio = document.createElement('audio');
    $audio.src = url;
    $audio.controls = true;
    $audio.onloadedmetadata = function() {
      $audioMode.style.zIndex = 2;
      $container.appendChild($audio);
      audioReady = true;
      spectrum($audio, $('#audio-mode canvas')[0]);
    };
    $audio.onerror = function(e) {
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
  var draw = function() {
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
  };
  draw();
};
$('#get-bilibili button')[0].addEventListener('click', function() {
  var $input = $('#get-bilibili input')[0];
  if (!$input.value) return;
  downloadInfo($input.value);
  $input.value = '';
});
var downloadInfo = function(url) {
  var params = url.match(/.*av(\d+)(?:\/index_(\d+))?/),
      api = SERVER_ORIGIN + '/view?id=' + params[1] + (params[2] ? '&page=' + params[2] : '');
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
  var api = SERVER_ORIGIN + '/danmaku/' + data.cid;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', api, 1);
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
  var $mf = $('#manager-files')[0];
  while ($mf.lastChild) $mf.removeChild($mf.lastChild);
  for (var key in localStorage) {
    if (!/cid\d+/.test(key)) continue;
    var data = JSON.parse(localStorage[key]);
    $mf.appendChild(new DanmakuFileNode(data));
  }
};
showFile();
var showComment = function(comments) {
  var df = document.createDocumentFragment();
  for (var i = 0; i < comments.length; i++) {
    df.appendChild(new DanmakuCommentNode(comments[i]));
  }
  $('#manager-comments')[0].appendChild(df);
  $('#comments')[0].checked = true;
};
var formatTime = function(t) {
  var m = Math.floor(t / 60),
      s = Math.floor(t) % 60;
  if (m < 10) m = '0' + m;
  if (s < 10) s = '0' + s;
  return m + ':' + s;
};
var init = function(data) {
  var $canvasEngine = $('#canvas-engine')[0];
  if (mode === 'video') {
    if (videoReady) {
      videoDanmaku.init({
        video: $('video')[0],
        comments: data.comments,
        engine: $canvasEngine.checked ? 'canvas' : 'DOM'
      });
      showComment(data.comments);
      enableControls();
    } else message('require video.', 'error');
  }
  if (mode === 'audio') {
    if (audioReady) {
      audioDanmaku.init({
        audio: $('audio')[0],
        container: $audioMode.querySelector('.danmaku-container'),
        comments: data.comments,
        engine: $canvasEngine.checked ? 'canvas' : 'DOM'
      });
      showComment(data.comments);
      enableControls();
    } else message('require audio.', 'error');
  }
  if (mode === 'realtime') {
    realtimeDanmaku.init({
      container: $('#realtime-container')[0],
      engine: $('#canvas-engine')[0].checked ? 'canvas' : 'DOM'
    });
    socket.on('danmaku', function(data) {
      realtimeDanmaku.emit(data);
    });
    enableControls();
  }
};
var enableControls = function() {
  $('#danmaku-resize')[0].disabled = false;
  $('#danmaku-show')[0].disabled = false;
  $('#danmaku-hide')[0].disabled = false;
  $('#danmaku-clear')[0].disabled = false;
  $('#danmaku-destroy')[0].disabled = false;
  $('#danmaku-send')[0].disabled = false;
};
function DanmakuFileNode(data) {
  var li = document.createElement('li'),
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
  initBtn.addEventListener('click', function() { init(data) });
  reloadBtn.addEventListener('click', function() {
    downloadDanmaku(data);
  });
  deleteBtn.addEventListener('click', function() {
    localStorage.removeItem('cid' + data.cid);
    showFile();
  });
  return li;
}
function DanmakuCommentNode(data) {
  var li = document.createElement('li'),
      time = document.createElement('span'),
      text = document.createElement('span');
  time.textContent = formatTime(data.time);
  text.textContent = data.text;
  time.className = 'comment-time';
  text.className = 'comment-text';
  text.title = data.text;
  li.appendChild(time);
  li.appendChild(text);
  return li;
}
var message = function(msg, type) {
  var $msg = $('#message')[0];
  $msg.textContent = msg;
  $msg.className = type + ' transition';
  $msg.style.opacity = 0;
  $msg.addEventListener('transitionend', function() {
    $msg.textContent = '';
    $msg.className = '';
    $msg.style.opacity = 1;
  });
};
document.onkeypress = function(e) {
  var media;
  if (mode === 'video') media = $('video')[0];
  if (mode === 'audio') media = $('audio')[0];
  if (!media) return;
  var key = e.keyCode || e.which,
      aen = document.activeElement.nodeName.toLowerCase();
  if (aen === 'textarea' || aen === 'input') return;
  if (key === 32) {
    e.preventDefault();
    media.paused ? media.play() : media.pause();
  }
};
