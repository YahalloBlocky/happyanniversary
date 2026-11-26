// ════════════════════════════════════════
// FALLING PETALS — shared by both pages
// ════════════════════════════════════════
(function initPetals() {
  const wrap = document.getElementById('petals');
  if (!wrap) return;

  // Tiny inline SVG petals matching the botanical palette
  const petalSVGs = [
    // gold petal
    `<svg viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="14" rx="6" ry="12" fill="#c9956a" opacity=".7" transform="rotate(10 10 14)"/></svg>`,
    // rose petal
    `<svg viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="14" rx="5" ry="11" fill="#c08090" opacity=".65" transform="rotate(-8 10 14)"/></svg>`,
    // sage leaf
    `<svg viewBox="0 0 18 24" xmlns="http://www.w3.org/2000/svg"><ellipse cx="9" cy="12" rx="5" ry="10" fill="#7a9e78" opacity=".5" transform="rotate(5 9 12)"/></svg>`,
    // chartreuse small petal
    `<svg viewBox="0 0 14 20" xmlns="http://www.w3.org/2000/svg"><ellipse cx="7" cy="10" rx="4" ry="8" fill="#a8b86a" opacity=".55" transform="rotate(-12 7 10)"/></svg>`,
    // tiny heart
    `<svg viewBox="0 0 16 14" xmlns="http://www.w3.org/2000/svg"><path d="M8 13 C8 13 1 8 1 4.5 A3.5 3.5 0 0 1 8 2.5 A3.5 3.5 0 0 1 15 4.5 C15 8 8 13 8 13Z" fill="#c08090" opacity=".45"/></svg>`,
  ];

  function spawnPetal() {
    const el = document.createElement('div');
    el.className = 'fp';
    const svg = petalSVGs[Math.floor(Math.random() * petalSVGs.length)];
    const size = 10 + Math.random() * 14;
    el.innerHTML = svg;
    el.style.left = (Math.random() * 102) + 'vw';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    const dur = 9 + Math.random() * 11;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = (Math.random() * 2) + 's';
    wrap.appendChild(el);
    setTimeout(() => el.remove(), (dur + 3) * 1000);
  }

  setInterval(spawnPetal, 900);
  // start a few immediately
  for (let i = 0; i < 6; i++) setTimeout(spawnPetal, i * 350);
})();


// ════════════════════════════════════════
// FLOWER BUTTON — index-anniv.html
// ════════════════════════════════════════
(function initFlowerButton() {
  const wrap = document.getElementById('flowerBtnWrap');
  if (!wrap) return;

  let clicked = false;

  function openLetter() {
    if (clicked) return;
    clicked = true;

    // bloom burst effect
    wrap.style.transition = 'transform 0.4s cubic-bezier(.34,1.56,.64,1)';
    wrap.style.transform = 'scale(1.12)';

    setTimeout(() => {
      document.getElementById('stage').classList.add('fade-out');
    }, 320);

    setTimeout(() => {
      document.getElementById('overlay').classList.add('show');
    }, 800);

    setTimeout(() => {
      window.location.href = 'letter-anniv.html';
    }, 1200);
  }

  wrap.addEventListener('click', openLetter);
  wrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLetter(); });
})();


// ════════════════════════════════════════
// MUSIC PLAYER — letter-anniv.html
// ════════════════════════════════════════

// ┌──────────────────────────────────────┐
// │  ADD YOUR SONG(S) HERE               │
// │  Put your mp3 in a songs/ folder     │
// │  and update the src path below.      │
// └──────────────────────────────────────┘
const songs = [
  { src: 'songs/ikaw.mp3', title: 'Ikaw', artist: 'Yengs Constantino' },
  // { src: 'songs/another.mp3', title: 'Another Song', artist: 'Artist' },
];

let currentIndex = 0;
let isPlaying = false;
const audio = new Audio();

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function startMusic() {
  const player = document.getElementById('music-player');
  if (!player || songs.length === 0) return;
  shuffle(songs);
  loadSong(0);
  player.classList.add('visible');
  audio.play()
    .then(() => { isPlaying = true; updatePlayBtn(); })
    .catch(() => { });
}

function loadSong(index) {
  currentIndex = index;
  audio.src = songs[currentIndex].src;
  updateSongInfo();
  updateProgress();
}

function updateSongInfo() {
  const t = document.getElementById('song-title');
  const a = document.getElementById('song-artist');
  if (t) t.textContent = songs[currentIndex].title;
  if (a) a.textContent = songs[currentIndex].artist;
}

function updatePlayBtn() {
  const btn = document.getElementById('play-btn');
  if (btn) btn.textContent = isPlaying ? '⏸' : '▶';
}

function togglePlay() {
  if (isPlaying) { audio.pause(); isPlaying = false; }
  else { audio.play(); isPlaying = true; }
  updatePlayBtn();
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  if (isPlaying) audio.play();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  if (isPlaying) audio.play();
}

function seek(val) {
  if (audio.duration) audio.currentTime = (val / 100) * audio.duration;
}

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function updateProgress() {
  const bar = document.getElementById('progress-bar');
  const cur = document.getElementById('current-time');
  const dur = document.getElementById('duration');
  if (audio.duration && bar) {
    bar.value = (audio.currentTime / audio.duration) * 100;
    if (cur) cur.textContent = fmt(audio.currentTime);
    if (dur) dur.textContent = fmt(audio.duration);
  }
}

audio.addEventListener('ended', nextSong);
audio.addEventListener('timeupdate', updateProgress);

if (document.querySelector('.letter-page')) {
  window.addEventListener('load', startMusic);
}
