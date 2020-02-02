import { SERVER_ORIGIN, message } from './index.js';
import { bilibiliParser } from './bilibili.js';
import { init } from './media.js';

async function fetchBilibili(url) {
  const aid = url.match(/av(\d+)/)[1];
  const { data, code, message } = await fetch(`${SERVER_ORIGIN}/view?aid=${aid}`)
    .then((res) => res.json());
  if (code) {
    throw new Error(message);
  }
  const { cid, title } = data;
  const comments = await fetch(`${SERVER_ORIGIN}/danmaku/${cid}`)
    .then((res) => res.text())
    .then(bilibiliParser);
  const result = { aid, cid, title, comments };
  localStorage[`cid${cid}`] = JSON.stringify(result);
  return result;
}

const $files = $('#manager__files + label + .manager__list');
const $comments = $('#manager__comments + label + .manager__list');

function createElementDanmakuFile({ cid, aid, title, comments }) {
  const template = document.getElementById('danamku-file');
  const $el = template.content.cloneNode(true);
  const $title = $el.querySelector('.title');
  $title.title = title;
  $title.textContent = title;
  $el.querySelector('button[data-fn="initialize"]').addEventListener('click', (evt) => {
    init(comments) && renderDanmakuComments(comments);
  });
  $el.querySelector('button[data-fn="reload"]').addEventListener('click', (evt) => {
    fetchBilibili(`av${aid}`);
  });
  $el.querySelector('button[data-fn="delete"]').addEventListener('click', (evt) => {
    localStorage.removeItem(`cid${cid}`);
    renderDanmakuFiles();
  });
  return $el;
}

function renderDanmakuFiles() {
  while ($files.lastChild) {
    $files.removeChild($files.lastChild);
  }
  for (var key in localStorage) {
    if (/cid\d+/.test(key)) {
      const data = JSON.parse(localStorage[key]);
      $files.appendChild(createElementDanmakuFile(data));
    }
  }
}

renderDanmakuFiles();

function formatTime(t) {
  let m = Math.floor(t / 60);
  let s = Math.floor(t) % 60;
  if (m < 10) m = '0' + m;
  if (s < 10) s = '0' + s;
  return `${m}:${s}`;
}

function createElementDanmakuComment({ time, text }) {
  const template = document.getElementById('danmaku-comment');
  const $el = template.content.cloneNode(true);
  $el.querySelector('.time').textContent = formatTime(time);
  $el.querySelector('.text').title = text;
  $el.querySelector('.text').textContent = text;
  return $el;
}

function renderDanmakuComments(comments) {
  while ($comments.lastChild) {
    $comments.removeChild($comments.lastChild);
  }
  const df = document.createDocumentFragment();
  comments.forEach((comment) => {
    df.appendChild(createElementDanmakuComment(comment));
  });
  $comments.appendChild(df);
  $('#manager__comments').checked = true;
}

$('.manager__download button').addEventListener('click', (evt) => {
  const $input = $('.manager__download input');
  fetchBilibili($input.value)
    .then(() => {
      $input.value = '';
      renderDanmakuFiles();
    })
    .catch((err) => message(err.message));
});
