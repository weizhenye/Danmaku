import './media.js';
import './manager.js';
import './pref-monitor.js';

export const SERVER_ORIGIN = 'https://danmaku-demo-server.weizhenye.now.sh';
export const SAMPLE_MEDIA = {
  video: 'https://media.w3.org/2010/05/video/movie_300.mp4',
  audio: 'https://cdn.jsdelivr.net/gh/goldfire/howler.js@v2.1.3/tests/audio/sound1.mp3',
};

export function message(text) {
  console.error(text);
  const $div = document.createElement('div');
  $div.className = 'message'
  $div.textContent = text;
  document.body.appendChild($div);
  setTimeout(() => {
    document.body.removeChild($div);
  }, 3000);
}

export const state = new Proxy({
  mode: 'video',
  initialized: false,
  danmaku: null,
  container: null,
  media: null,
}, {
  get(obj, prop) {
    if (prop === 'mode') {
      return $('.config__mode input:checked').dataset.mode;
    }
    if (prop === 'initialized') {
      return $(`.player__${obj.mode}`).dataset.initialized === 'true';
    }
    if (prop === 'danmaku') {
      return $(`.player__${obj.mode}`).danmaku;
    }
    if (prop === 'container') {
      return $(`.player__${obj.mode} .player__container`);
    }
    if (prop === 'media') {
      return $(`.player__${obj.mode} ${obj.mode}`);
    }
  },
  set(obj, prop, value) {
    obj[prop] = value;
    const $pm = $(`.player__${obj.mode}`);
    if (prop === 'mode') {
      $('.player').dataset.mode = value;
      renderConfig();
    }
    if (prop === 'initialized') {
      $pm.dataset.initialized = value;
      renderConfig();
    }
    if (prop === 'danmaku') {
      $pm.danmaku = value;
    }
    return true;
  },
});

function renderConfig() {
  const disabled = !state.initialized;
  $('.config__control').disabled = disabled;
  $('.config__speed').disabled = disabled;
  $('.config__emit').disabled = disabled;
  const speed = state.danmaku ? state.danmaku.speed : 144;
  $('.config__speed input').value = speed;
  $('.config__speed output').value = speed;
}

function resetState() {
  $('.player').dataset.size = '360P';
  state.initialized = false;
  if (state.media) {
    state.media.src = '';
    state.media.parentNode.parentNode.dataset.canplay = false;
  }
}

$('.config__mode').addEventListener('change', (evt) => {
  state.mode = evt.target.dataset.mode;
});

[...document.querySelectorAll('.config__control button')].forEach(($el) => {
  $el.addEventListener('click', () => {
    if ($el.dataset.fn === 'resize') {
      $('.player').dataset.size = $('.player').dataset.size === '360P' ? '540P' : '360P';
    }
    if ($el.dataset.fn === 'destroy') {
      resetState();
    }
    state.danmaku[$el.dataset.fn]();
  });
});

$('.config__speed input').addEventListener('change', (evt) => {
  state.danmaku.speed = Number(evt.target.value);
  $('.config__speed output').value = evt.target.value;
});

function createComment(text) {
  return {
    text,
    style: {
      fontSize: '25px',
      background: 'rgb(221, 170, 170, 0.2)',

      font: '25px "Segoe UI"',
      fillStyle: '#000',
      strokeStyle: '#daa',
      lineWidth: 8,
    },
  };
}

const socket = window.io ? io('https://socketio-chat-h9jt.herokuapp.com/') : null;
if (socket) {
  socket.emit('add user', 'danmaku.js.org');
  socket.on('new message', ({ username, message }) => {
    if (state.mode === 'live') {
      state.danmaku.emit(createComment(`[${username}] ${message}`));
    }
  });
}
const $emitInput = $('.config__emit input');
$('.config__emit button').addEventListener('click', (evt) => {
  if (!$emitInput.value) {
    return;
  }
  state.danmaku.emit(createComment($emitInput.value));
  if (socket) {
    socket.emit('new message', $emitInput.value);
  }
  $emitInput.value = '';
});

$('.config__mode').addEventListener('change', (evt) => {
  if (evt.target.dataset.mode === 'live' && !state.initialized) {
    state.danmaku = new Danmaku({
      container: $(`.player__live .player__container`),
      engine: $('.config__engine input:checked').dataset.engine,
    });
    state.initialized = true;
  }
});
