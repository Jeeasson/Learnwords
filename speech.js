// ── APP CONTROLLER ────────────────────────────────────────────────────────────
let selectedCat = null, firstTap = {};
let totalStars = 0, totalCards = 0;
const catProgress = {};

// ── PROGRESS ──────────────────────────────────────────────────────────────────
function addStar() {
  totalStars++;
  document.getElementById('starCount').textContent = totalStars;
  showStarEarned();
  saveProgress(); // persist to IndexedDB
}
function addCard() {
  totalCards++;
  document.getElementById('cardCount').textContent = totalCards;
  // Save periodically (every 5 cards to avoid hammering DB)
  if (totalCards % 5 === 0) saveProgress();
}
function showStarEarned() {
  const el = document.createElement('div');
  el.className = 'star-earned';
  el.textContent = '⭐ +1 estrella!';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}
function updateCatPct(catKey, total) {
  catProgress[catKey] = (catProgress[catKey] || 0) + 1;
  const el = document.getElementById('cp_' + catKey);
  if (el) el.textContent = Math.round(Math.min(catProgress[catKey], total) / total * 100) + '%';
}

// ── BUILD HOME ────────────────────────────────────────────────────────────────
const CATS_ORIG_KEYS = ['cosas','animales','cuerpo','frutas','colores','numeros','formas','transporte'];
const CATS_NEW_KEYS  = ['vegetales','ropa','profesiones','emociones'];

function buildHome() {
  buildGrid(document.getElementById('catGrid1'), CATS_ORIG_KEYS);
  buildGrid(document.getElementById('catGrid2'), CATS_NEW_KEYS);
}

function buildGrid(grid, keys) {
  grid.innerHTML = '';
  keys.forEach(key => {
    const cat = CATS[key]; if (!cat) return;
    const btn = document.createElement('button');
    btn.className = 'cat-btn'; btn.dataset.cat = key;
    btn.style.cssText = `background:${cat.color}22;--cc:${cat.color}`;
    btn.innerHTML = `<span class="cat-icon">${cat.icon}</span><span class="cat-name">${cat.label}</span><span class="cat-pct" id="cp_${key}"></span>`;
    btn.onclick = () => handleCatTap(key, btn, cat.color);
    grid.appendChild(btn);
  });
}

function handleCatTap(key, btn, color) {
  const now = Date.now();
  if (selectedCat === key && firstTap[key] && now - firstTap[key] < 700) {
    btn.classList.add('confirm-pulse');
    setTimeout(() => launchWithRipple(key, color, btn), 80);
    return;
  }
  document.querySelectorAll('.cat-btn').forEach(b => { b.classList.remove('selected'); b.style.borderColor = 'transparent'; });
  selectedCat = key; firstTap[key] = now;
  btn.classList.add('selected'); btn.style.borderColor = color;
  document.getElementById('hintText').textContent = '¡Toca otra vez para entrar!';
  speak(CATS[key].label);
}

function launchWithRipple(catKey, color, btn) {
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
  const overlay = document.getElementById('ripple-overlay');
  const size = Math.max(window.innerWidth, window.innerHeight) * 0.06;
  const circle = document.createElement('div');
  circle.className = 'ripple-circle';
  circle.style.cssText = `width:${size}px;height:${size}px;left:${cx-size/2}px;top:${cy-size/2}px;background:${color};`;
  overlay.appendChild(circle);
  setTimeout(() => {
    document.getElementById('fc-screen').style.background = color;
    cards = shuffle([...CATS[catKey].items]);
    currentIdx = 0; currentCat = catKey;
    showFCScreen();
    setTimeout(() => overlay.innerHTML = '', 700);
  }, 500);
}

function startRandom() {
  const all = Object.entries(CATS).flatMap(([k,c]) => c.items.map(i => ({...i, catKey: k})));
  document.getElementById('fc-screen').style.background = '#2D2D2D';
  cards = shuffle(all).slice(0, 30); currentIdx = 0; currentCat = null; selectedCat = null;
  showFCScreen();
}

function shuffle(arr) {
  for (let i = arr.length-1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── URL SHORTCUT HANDLING ─────────────────────────────────────────────────────
function handleStartupRoute() {
  const params = new URLSearchParams(window.location.search);
  const cat    = params.get('cat');
  if (!cat) return;
  if (cat === 'random') {
    // skip splash, go to random
    document.getElementById('splash').classList.add('exit');
    document.getElementById('app').classList.add('visible');
    setTimeout(() => startRandom(), 400);
  } else if (CATS[cat]) {
    document.getElementById('splash').classList.add('exit');
    document.getElementById('app').classList.add('visible');
    const c = CATS[cat];
    setTimeout(() => {
      document.getElementById('fc-screen').style.background = c.color;
      cards = shuffle([...c.items]); currentIdx = 0; currentCat = cat;
      showFCScreen();
    }, 400);
  }
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildHome();
  initSplash();
  handleStartupRoute();
  loadProgress(); // restore stars/cards from IndexedDB

  // Register service worker — use relative path so it works in subfolders too
  if ('serviceWorker' in navigator) {
    const swPath = new URL('service-worker.js', window.location.href).pathname;
    navigator.serviceWorker.register(swPath, { scope: './' })
      .then(reg => console.log('[PWA] SW registered:', reg.scope))
      .catch(err => console.warn('[PWA] SW error:', err));
  }

  // Save progress when tab is hidden/closed
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveProgress();
  });
  window.addEventListener('beforeunload', () => saveProgress());
});
