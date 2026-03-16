// ── FLASHCARD ENGINE ──────────────────────────────────────────────────────────
let cards = [], currentIdx = 0, currentCat = null;
const imgCache = {};
let syllMode = false, syllDone = [];

function showFCScreen() {
  document.getElementById('fc-screen').classList.add('visible');
  renderCard(false);
  setupSwipe();
}

function closeCards() {
  window.speechSynthesis && window.speechSynthesis.cancel();
  document.getElementById('fc-screen').classList.remove('visible');
  selectedCat = null; firstTap = {};
  document.querySelectorAll('.cat-btn').forEach(b => { b.classList.remove('selected'); b.style.borderColor = 'transparent'; });
  document.getElementById('hintText').textContent = 'Toca dos veces una categoría para empezar';
  syllMode = false;
  document.getElementById('swipeGuide').style.display = 'flex';
  // BUG FIX: reset swipe so it re-attaches on next open
  swipeSetup = false;
}

renderCard._token = 0; // race condition guard
async function renderCard(animate, dir) {
  const card = cards[currentIdx];
  if (!card) { showDone(); return; }
  syllMode = false; syllDone = [];
  window.speechSynthesis && window.speechSynthesis.cancel();

  document.getElementById('fcCounter').textContent   = `${currentIdx+1}/${cards.length}`;
  document.getElementById('progressFill').style.width = `${((currentIdx+1)/cards.length)*100}%`;

  const catKey  = card.catKey || currentCat;
  const catData = CATS[catKey];
  const fcCard  = document.getElementById('fcCard');

  if (animate) {
    const cls = dir === 'next' ? 'enter-right' : 'enter-left';
    fcCard.classList.add(cls);
    fcCard.addEventListener('animationend', () => fcCard.classList.remove(cls), { once: true });
  }

  fcCard.innerHTML = `
    <div class="fc-image-wrap" id="fcImgWrap"></div>
    <div class="fc-info">
      <span class="fc-cat-pill">${catData ? catData.icon+' '+catData.label : ''}</span>
      <div class="fc-word-area" id="fcWordArea"></div>
      <div class="fc-en" id="fcEn">${card.en}</div>
      <div class="syll-done-msg" id="syllMsg">¡Genial! 🌟 Desliza para continuar →</div>
    </div>`;

  const wrap  = document.getElementById('fcImgWrap');
  const spkBtn = document.createElement('button');
  spkBtn.className = 'speak-btn'; spkBtn.textContent = '🔊'; speakBtnEl = spkBtn;
  spkBtn.onclick = e => { e.stopPropagation(); speak(card.es); };

  // Render visual zone
  const autoSpeak = () => { if (userHasInteracted) setTimeout(() => speak(card.es), 420); };

  if (card.emoji !== undefined) {
    wrap.innerHTML = `<div style="width:100%;height:200px;background:${card.swatch||'#f5f3ee'};display:flex;align-items:center;justify-content:center;"><span id="emojiMain" style="font-size:6rem;display:inline-block;">${card.emoji}</span></div>`;
    wrap.appendChild(spkBtn);
    setTimeout(() => { const el=document.getElementById('emojiMain'); if(el) triggerAnim(el,'bounce'); }, 320);
    autoSpeak();
    wrap.onclick = e => { if(e.target===spkBtn||spkBtn.contains(e.target))return; const el=document.getElementById('emojiMain'); if(el)triggerAnim(el,'bounce'); speak(card.es); };
  } else if (card.swatch !== undefined) {
    wrap.innerHTML = `<div style="width:100%;height:200px;background:${card.swatch};${card.border?'border:2px solid #ddd;':''}display:flex;align-items:center;justify-content:center;"><span style="font-size:3rem;">${FALLBACKS[card.es]||'🎨'}</span></div>`;
    wrap.appendChild(spkBtn); autoSpeak();
    wrap.onclick = () => speak(card.es);
  } else if (card.numeral !== undefined) {
    wrap.innerHTML = `<div style="width:100%;height:200px;display:flex;align-items:center;justify-content:center;background:#f5f3ee;"><span id="numDisp" style="font-size:5rem;font-weight:900;color:#2D2D2D;font-family:'DM Sans',sans-serif;display:inline-block;">${card.numeral}</span></div>`;
    wrap.appendChild(spkBtn);
    const el = document.getElementById('numDisp');
    wrap.onclick = () => { triggerAnim(el,'bounce'); speak(card.es); };
    autoSpeak();
  } else if (card.shape !== undefined) {
    const col = catData ? catData.color : '#FF8F00';
    wrap.innerHTML = `<div style="width:100%;height:200px;background:#fafaf8;">${drawShape(card.shape, col)}</div>`;
    wrap.appendChild(spkBtn);
    wrap.onclick = () => { const svg=wrap.querySelector('svg'); if(svg)triggerAnim(svg,'spin'); speak(card.es); };
    autoSpeak();
  } else {
    const animType = getAnim(card.es), fb = FALLBACKS[card.es] || '🖼️';
    // Race condition fix: stamp each render with a token so stale async callbacks are ignored
    const renderToken = ++renderCard._token;
    wrap.innerHTML = '<div class="loading-img">cargando...</div>';
    // Use online-aware loader (falls back to emoji when offline)
    getWikiImgSafe(card.wiki, fb).then(url => {
      if (renderToken !== renderCard._token) return; // stale — card changed, discard
      if (url) {
        const img = document.createElement('img');
        img.src = url; img.alt = card.es; img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        img.onerror = () => setEmojiWrap(wrap, fb, animType, card.es, spkBtn);
        wrap.innerHTML = ''; wrap.appendChild(img); wrap.appendChild(spkBtn);
        setTimeout(() => triggerAnim(img, animType), 350);
        wrap.onclick = e => {
          if (e.target===spkBtn||spkBtn.contains(e.target)) return;
          const r = wrap.getBoundingClientRect();
          spawnTapRipple(wrap, e.clientX-r.left, e.clientY-r.top);
          triggerAnim(img, animType); speak(card.es);
        };
        // iOS TTS fix: only auto-speak if user has already interacted
        if (userHasInteracted) setTimeout(() => speak(card.es), 420);
      } else { setEmojiWrap(wrap, fb, animType, card.es, spkBtn); }
    });
  }

  renderWordDefault(card);
  addCard();
}

function setEmojiWrap(wrap, emoji, animType, word, spkBtn) {
  wrap.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:200px;background:#f5f3ee;"><span class="fc-emoji-display" id="emojiEl">${emoji}</span></div>`;
  const el = document.getElementById('emojiEl');
  if (spkBtn) wrap.appendChild(spkBtn);
  setTimeout(() => { triggerAnim(el, animType); speak(word); }, 300);
  wrap.onclick = e => {
    if (spkBtn && (e.target===spkBtn||spkBtn.contains(e.target))) return;
    const r = wrap.getBoundingClientRect();
    spawnTapRipple(wrap, e.clientX-r.left, e.clientY-r.top);
    triggerAnim(el, animType); speak(word);
  };
}

function triggerAnim(el, type) {
  if (!el) return;
  const cls = ['anim-bounce','anim-fly','anim-spin','anim-wiggle','anim-swim','anim-grow','anim-shake','anim-pulse'];
  el.classList.remove(...cls); void el.offsetWidth;
  el.classList.add('anim-'+type);
  el.addEventListener('animationend', () => el.classList.remove('anim-'+type), { once: true });
}

function spawnTapRipple(parent, x, y) {
  const r = document.createElement('div'); r.className = 'tap-ripple';
  r.style.cssText = `left:${x-30}px;top:${y-30}px;`;
  parent.appendChild(r);
  r.addEventListener('animationend', () => r.remove(), { once: true });
}

async function getWikiImg(title) {
  if (title in imgCache) return imgCache[title];
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    const d   = await res.json();
    const url = d.thumbnail ? d.thumbnail.source.replace(/\/\d+px-/, '/500px-') : null;
    imgCache[title] = url; return url;
  } catch(e) { imgCache[title] = null; return null; }
}

// ── SYLLABLES ─────────────────────────────────────────────────────────────────
function renderWordDefault(card) {
  const area = document.getElementById('fcWordArea');
  const s = SYLLS[card.es];
  if (s && s.length > 1) {
    area.innerHTML = `<div class="fc-word-hint" id="syllHint">toca la palabra ✏️</div><div class="fc-word-single" style="cursor:pointer;" onclick="activateSyllMode()">${card.es}</div>`;
  } else {
    area.innerHTML = `<div class="fc-word-single">${card.es}</div>`;
  }
}

function activateSyllMode() {
  if (syllMode) return; syllMode = true;
  const card = cards[currentIdx];
  const s = SYLLS[card.es] || [card.es];
  syllDone = new Array(s.length).fill(false);
  const hint = document.getElementById('syllHint'); if (hint) hint.style.opacity = '0';
  const area = document.getElementById('fcWordArea');
  let html = '<div class="syllable-row">';
  s.forEach((x, i) => {
    html += `<span class="syllable" id="syl_${i}" onclick="tapSyllable(${i})">${x}</span>`;
    if (i < s.length-1) html += `<span class="syllable-sep">·</span>`;
  });
  html += '</div>';
  setTimeout(() => { area.innerHTML = html; }, 150);
}

function tapSyllable(idx) {
  if (syllDone[idx]) return;
  const card = cards[currentIdx];
  const s    = SYLLS[card.es] || [card.es];
  speak(s[idx]);
  syllDone[idx] = true;
  const el = document.getElementById(`syl_${idx}`);
  if (el) { el.classList.add('active'); setTimeout(() => { el.classList.add('done'); el.classList.remove('active'); }, 130); }
  if (syllDone.every(Boolean)) {
    setTimeout(() => {
      document.querySelectorAll('.syllable').forEach(el => {
        el.style.background  = '#4CAF8A'; el.style.color = 'white';
        el.style.transform   = 'scale(1.1)'; el.style.boxShadow = '0 0 0 3px rgba(76,175,138,0.35)';
      });
      const msg = document.getElementById('syllMsg'); if (msg) msg.classList.add('show');
      const area = document.getElementById('fcWordArea');
      if (area) { const r = area.getBoundingClientRect(); launchConfetti(r.left+r.width/2, r.top+r.height/2); }
      else launchConfetti();
      setTimeout(() => speak(card.es), 400);
      addStar();
      updateCatPct(card.catKey || currentCat, cards.length);
    }, 150);
  }
}

// ── NAVIGATION ────────────────────────────────────────────────────────────────
function goNext() {
  if (currentIdx >= cards.length-1) { showDone(); return; }
  const fc = document.getElementById('fcCard');
  fc.classList.add('swipe-left');
  fc.addEventListener('animationend', () => { fc.classList.remove('swipe-left'); currentIdx++; renderCard(true,'next'); }, { once: true });
}

function goPrev() {
  if (currentIdx === 0) return;
  const fc = document.getElementById('fcCard');
  fc.classList.add('swipe-right');
  fc.addEventListener('animationend', () => { fc.classList.remove('swipe-right'); currentIdx--; renderCard(true,'prev'); }, { once: true });
}

function showDone() {
  window.speechSynthesis && window.speechSynthesis.cancel();
  document.getElementById('swipeGuide').style.display = 'none';
  document.getElementById('fcCard').innerHTML = `
    <div class="fc-done">
      <div class="fc-done-star">⭐</div>
      <div class="fc-done-title">¡Bravo!</div>
      <div class="fc-done-sub">Completaste ${cards.length} tarjetas · ${totalStars} ⭐ ganadas</div>
      <div class="done-btns">
        <button class="done-btn secondary" onclick="closeCards()">Inicio</button>
        <button class="done-btn primary" onclick="restartDeck()">Repetir 🔄</button>
      </div>
    </div>`;
  launchConfetti(window.innerWidth/2, window.innerHeight*0.55);
  setTimeout(() => speak('¡Bravo! Lo hiciste muy bien.'), 300);
}

function restartDeck() {
  cards = shuffle([...cards]); currentIdx = 0;
  document.getElementById('swipeGuide').style.display = 'flex';
  renderCard(false);
}

// ── SWIPE ─────────────────────────────────────────────────────────────────────
let swipeSetup = false;
function setupSwipe() {
  if (swipeSetup) return; swipeSetup = true;
  const wrap = document.getElementById('fcCardWrap');
  let startX=0, startY=0, dx=0, dy=0, dragging=false;
  const T = 60;

  wrap.addEventListener('pointerdown', e => {
    const card = document.getElementById('fcCard'); if (!card) return;
    const rect = card.getBoundingClientRect();
    if (e.clientY - rect.top > rect.height * 0.56) return;
    startX=e.clientX; startY=e.clientY; dx=0; dy=0; dragging=true;
    wrap.setPointerCapture(e.pointerId); card.classList.add('swiping');
  });
  wrap.addEventListener('pointermove', e => {
    if (!dragging) return;
    dx=e.clientX-startX; dy=e.clientY-startY;
    if (Math.abs(dy) > Math.abs(dx)*1.4) return;
    const card=document.getElementById('fcCard');
    if (card) card.style.transform=`translateX(${dx}px) rotate(${dx*0.04}deg)`;
    const hL=document.getElementById('hintLeft'), hR=document.getElementById('hintRight');
    if(dx>30){hR.style.opacity=Math.min(1,(dx-30)/40);hL.style.opacity=0;}
    else if(dx<-30){hL.style.opacity=Math.min(1,(-dx-30)/40);hR.style.opacity=0;}
    else{hL.style.opacity=0;hR.style.opacity=0;}
  });
  wrap.addEventListener('pointerup', () => {
    if (!dragging) return; dragging=false;
    document.getElementById('hintLeft').style.opacity=0;
    document.getElementById('hintRight').style.opacity=0;
    const card=document.getElementById('fcCard');
    if(card){card.classList.remove('swiping');card.style.transform='';}
    if(dx>T) goPrev(); else if(dx<-T) goNext();
  });
  wrap.addEventListener('pointercancel', () => {
    dragging=false;
    const card=document.getElementById('fcCard');
    if(card){card.classList.remove('swiping');card.style.transform='';}
    document.getElementById('hintLeft').style.opacity=0;
    document.getElementById('hintRight').style.opacity=0;
  });
}
