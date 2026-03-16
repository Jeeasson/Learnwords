// ── INDEXEDDB + ONLINE/OFFLINE MANAGER ───────────────────────────────────────
// Handles: progress persistence, offline image fallback, sync on reconnect

const DB_NAME    = 'aprendeDB';
const DB_VERSION = 1;
const STORE_PROG = 'progress';   // stars, cards, catProgress
const STORE_SYNC = 'syncQueue';  // pending actions to sync (future use)

let db = null;
let userHasInteracted = false; // tracks first touch/click for iOS TTS unlock

// ── OPEN DB ───────────────────────────────────────────────────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    if (db) { resolve(db); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains(STORE_PROG)) {
        d.createObjectStore(STORE_PROG, { keyPath: 'key' });
      }
      if (!d.objectStoreNames.contains(STORE_SYNC)) {
        d.createObjectStore(STORE_SYNC, { autoIncrement: true });
      }
    };

    req.onsuccess = e => { db = e.target.result; resolve(db); };
    req.onerror   = e => { console.warn('[DB] open error:', e.target.error); reject(e.target.error); };
  });
}

// ── GET / SET helpers ─────────────────────────────────────────────────────────
async function dbGet(store, key) {
  try {
    const d = await openDB();
    return new Promise((resolve, reject) => {
      const tx  = d.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror   = () => reject(req.error);
    });
  } catch(e) { return null; }
}

async function dbSet(store, key, value) {
  try {
    const d = await openDB();
    return new Promise((resolve, reject) => {
      const tx  = d.transaction(store, 'readwrite');
      const req = tx.objectStore(store).put({ key, value });
      req.onsuccess = () => resolve(true);
      req.onerror   = () => reject(req.error);
    });
  } catch(e) { return false; }
}

// ── SAVE / LOAD PROGRESS ──────────────────────────────────────────────────────
async function saveProgress() {
  const data = {
    totalStars,
    totalCards,
    catProgress: { ...catProgress }
  };
  await dbSet(STORE_PROG, 'userProgress', data);
}

async function loadProgress() {
  const data = await dbGet(STORE_PROG, 'userProgress');
  if (!data) return;

  totalStars = data.totalStars || 0;
  totalCards = data.totalCards || 0;
  Object.assign(catProgress, data.catProgress || {});

  // Update UI
  const sc = document.getElementById('starCount');
  const cc = document.getElementById('cardCount');
  if (sc) sc.textContent = totalStars;
  if (cc) cc.textContent = totalCards;

  // Refresh category percentages
  Object.keys(catProgress).forEach(key => {
    const cat = CATS[key];
    if (!cat) return;
    const el = document.getElementById('cp_' + key);
    if (el) {
      const pct = Math.round(Math.min(catProgress[key], cat.items.length) / cat.items.length * 100);
      el.textContent = pct > 0 ? pct + '%' : '';
    }
  });
}

// ── ONLINE / OFFLINE DETECTION ────────────────────────────────────────────────
let isOnline = navigator.onLine;
let offlineBanner = null;

function createOfflineBanner() {
  if (offlineBanner) return;
  offlineBanner = document.createElement('div');
  offlineBanner.id = 'offline-banner';
  offlineBanner.style.cssText = `
    position:fixed; top:0; left:0; right:0; z-index:1000;
    background:#2D2D2D; color:white;
    font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:700;
    padding:8px 16px; text-align:center;
    transform:translateY(-100%);
    transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
    display:flex; align-items:center; justify-content:center; gap:8px;
  `;
  offlineBanner.innerHTML = '📵 Sin conexión — usando imágenes de respaldo';
  document.body.appendChild(offlineBanner);
}

function showOfflineBanner() {
  createOfflineBanner();
  requestAnimationFrame(() => {
    offlineBanner.style.transform = 'translateY(0)';
  });
}

function hideOfflineBanner() {
  if (!offlineBanner) return;
  offlineBanner.innerHTML = '✅ Conexión restaurada';
  offlineBanner.style.background = '#4CAF8A';
  setTimeout(() => {
    if (offlineBanner) offlineBanner.style.transform = 'translateY(-100%)';
  }, 2000);
}

window.addEventListener('online', () => {
  isOnline = true;
  hideOfflineBanner();
  // Notify service worker to sync if available
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SYNC_NOW' });
  }
});

window.addEventListener('offline', () => {
  isOnline = false;
  showOfflineBanner();
});

// Initialize banner state on load
if (!navigator.onLine) {
  setTimeout(showOfflineBanner, 1000);
}

// ── ONLINE-AWARE IMAGE LOADER ─────────────────────────────────────────────────
// Replaces the bare getWikiImg in flashcard.js with online/offline awareness
async function getWikiImgSafe(title, fallbackEmoji) {
  if (!navigator.onLine) {
    // Offline: return null immediately → caller shows emoji
    return null;
  }

  // Check in-memory cache first
  if (title in imgCache) return imgCache[title];

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { signal: AbortSignal.timeout(5000) }  // 5s timeout
    );
    if (!res.ok) throw new Error('not ok');
    const d   = await res.json();
    const url = d.thumbnail ? d.thumbnail.source.replace(/\/\d+px-/, '/500px-') : null;
    imgCache[title] = url;
    return url;
  } catch(e) {
    imgCache[title] = null;
    return null;
  }
}

// ── iOS TTS UNLOCK ────────────────────────────────────────────────────────────
// iOS blocks speechSynthesis until user gesture. We track first interaction.
function unlockTTS() {
  if (userHasInteracted) return;
  userHasInteracted = true;
  // Warm up the speech engine with a silent utterance
  if (window.speechSynthesis) {
    const utt = new SpeechSynthesisUtterance('');
    utt.volume = 0;
    window.speechSynthesis.speak(utt);
  }
  document.removeEventListener('pointerdown', unlockTTS);
  document.removeEventListener('touchstart',  unlockTTS);
}

document.addEventListener('pointerdown', unlockTTS, { once: true });
document.addEventListener('touchstart',  unlockTTS, { once: true, passive: true });

// ── ORIENTATION CHANGE: resize confetti canvas ────────────────────────────────
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    const c = document.getElementById('confetti-canvas');
    if (c) { c.width = window.innerWidth; c.height = window.innerHeight; }
  }, 300);
});
