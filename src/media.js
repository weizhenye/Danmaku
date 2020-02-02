import spectrum from './spectrum.js';
import { state, SAMPLE_MEDIA, message } from './index.js';

['video', 'audio'].forEach((media) => {
  const $playerMedia = $(`.player__${media}`);
  const $media = $playerMedia.querySelector(media);
  $media.addEventListener('loadedmetadata', () => {
    $playerMedia.dataset.canplay = true;
    if ($('.player').dataset.mode === 'audio') {
      spectrum($media, $playerMedia.querySelector('canvas'));
    }
  });
  $media.addEventListener('error', () => {
    message('Cannot load this media.');
  });
  const $init = $playerMedia.querySelector('.player__media-init');
  $init.addEventListener('dragleave', () => {
    $init.dataset.dragover = false;
  });
  $init.addEventListener('dragover', (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
    $init.dataset.dragover = true;
  });
  $init.addEventListener('drop', (evt) => {
    evt.preventDefault();
    $init.dataset.dragover = false;
    $media.src = window.URL.createObjectURL(evt.dataTransfer.files[0]);
  });
  $init.querySelector('input').addEventListener('change', (evt) => {
    $media.src = window.URL.createObjectURL(evt.target.files[0]);
  });
  $init.querySelector('button').addEventListener('click', (evt) => {
    $media.src = SAMPLE_MEDIA[$('.player').dataset.mode];
  });
});

export function init(comments) {
  const canplay = $(`.player__${state.mode}`).dataset.canplay === 'true';
  if (state.initialized) {
    message('Already initialized.');
    return false;
  }
  if (!canplay) {
    message('Please load media first.');
    return false;
  }
  state.initialized = true;
  state.danmaku = new Danmaku({
    container: state.container,
    media: state.media,
    engine: $('.config__engine input:checked').dataset.engine,
    comments: JSON.parse(JSON.stringify(comments)),
  });
  return true;
}
