// ── MASCOT SVGs ───────────────────────────────────────────────────────────────
const CROC_SVG = `
<svg viewBox="0 0 170 200" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="142" cy="155" rx="28" ry="13" fill="#5DB85D" transform="rotate(18,142,155)"/>
  <ellipse cx="160" cy="165" rx="18" ry="9" fill="#4EA84E" transform="rotate(22,160,165)"/>
  <ellipse cx="85" cy="148" rx="52" ry="38" fill="#5DB85D"/>
  <ellipse cx="85" cy="155" rx="36" ry="26" fill="#A8E6A3"/>
  <ellipse cx="42" cy="182" rx="18" ry="10" fill="#5DB85D" transform="rotate(-12,42,182)"/>
  <ellipse cx="128" cy="182" rx="18" ry="10" fill="#5DB85D" transform="rotate(12,128,182)"/>
  <circle cx="32" cy="188" r="5" fill="#4EA84E"/>
  <circle cx="40" cy="191" r="5" fill="#4EA84E"/>
  <circle cx="48" cy="190" r="4" fill="#4EA84E"/>
  <circle cx="118" cy="188" r="5" fill="#4EA84E"/>
  <circle cx="126" cy="191" r="5" fill="#4EA84E"/>
  <circle cx="134" cy="190" r="4" fill="#4EA84E"/>
  <ellipse cx="36" cy="148" rx="14" ry="9" fill="#5DB85D" transform="rotate(-30,36,148)"/>
  <ellipse cx="134" cy="148" rx="14" ry="9" fill="#5DB85D" transform="rotate(30,134,148)"/>
  <ellipse cx="85" cy="106" rx="38" ry="22" fill="#5DB85D"/>
  <ellipse cx="85" cy="90" rx="44" ry="40" fill="#6BC86B"/>
  <ellipse cx="62" cy="58" rx="10" ry="7" fill="#5DB85D"/>
  <ellipse cx="78" cy="54" rx="10" ry="7" fill="#5DB85D"/>
  <ellipse cx="94" cy="54" rx="10" ry="7" fill="#5DB85D"/>
  <ellipse cx="110" cy="58" rx="10" ry="7" fill="#5DB85D"/>
  <path d="M60,82 Q68,75 76,82" stroke="#1A3A1A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M94,82 Q102,75 110,82" stroke="#1A3A1A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="72" cy="79" rx="4" ry="3" fill="white" opacity="0.35"/>
  <ellipse cx="106" cy="79" rx="4" ry="3" fill="white" opacity="0.35"/>
  <ellipse cx="76" cy="103" rx="4" ry="3" fill="#4EA84E"/>
  <ellipse cx="94" cy="103" rx="4" ry="3" fill="#4EA84E"/>
  <path d="M60,112 Q85,124 110,112" stroke="#1A3A1A" stroke-width="3" fill="none" stroke-linecap="round"/>
  <rect x="68" y="112" width="5" height="6" rx="2" fill="white" opacity="0.9"/>
  <rect x="79" y="114" width="5" height="5" rx="2" fill="white" opacity="0.9"/>
  <rect x="90" y="114" width="5" height="5" rx="2" fill="white" opacity="0.9"/>
  <rect x="101" y="112" width="5" height="6" rx="2" fill="white" opacity="0.9"/>
  <circle cx="72" cy="148" r="7" fill="#4EA84E" opacity="0.55"/>
  <circle cx="100" cy="155" r="5" fill="#4EA84E" opacity="0.5"/>
  <circle cx="85" cy="165" r="4" fill="#4EA84E" opacity="0.45"/>
</svg>`;

const OWL_SVG = `
<svg viewBox="0 0 170 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="178" width="150" height="16" rx="8" fill="#2A1F0E"/>
  <rect x="30" y="170" width="12" height="18" rx="4" fill="#3A2A12"/>
  <rect x="120" y="172" width="10" height="16" rx="4" fill="#3A2A12"/>
  <ellipse cx="85" cy="140" rx="48" ry="52" fill="#5B4FCF"/>
  <ellipse cx="85" cy="148" rx="32" ry="36" fill="#8B7FEE"/>
  <ellipse cx="85" cy="152" rx="22" ry="25" fill="none" stroke="#7B6FDE" stroke-width="2" opacity="0.5"/>
  <ellipse cx="85" cy="156" rx="14" ry="16" fill="none" stroke="#7B6FDE" stroke-width="1.5" opacity="0.4"/>
  <ellipse cx="32" cy="135" rx="22" ry="36" fill="#4A3FBF" transform="rotate(-15,32,135)"/>
  <ellipse cx="138" cy="135" rx="22" ry="36" fill="#4A3FBF" transform="rotate(15,138,135)"/>
  <path d="M18,155 Q22,162 28,158" stroke="#3A2FAF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M22,162 Q27,170 33,165" stroke="#3A2FAF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M152,155 Q148,162 142,158" stroke="#3A2FAF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M148,162 Q143,170 137,165" stroke="#3A2FAF" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="68" cy="186" rx="10" ry="6" fill="#2A1F0E"/>
  <ellipse cx="102" cy="186" rx="10" ry="6" fill="#2A1F0E"/>
  <line x1="62" y1="186" x2="58" y2="180" stroke="#2A1F0E" stroke-width="3" stroke-linecap="round"/>
  <line x1="68" y1="186" x2="68" y2="178" stroke="#2A1F0E" stroke-width="3" stroke-linecap="round"/>
  <line x1="74" y1="186" x2="78" y2="180" stroke="#2A1F0E" stroke-width="3" stroke-linecap="round"/>
  <line x1="96" y1="186" x2="92" y2="180" stroke="#2A1F0E" stroke-width="3" stroke-linecap="round"/>
  <line x1="102" y1="186" x2="102" y2="178" stroke="#2A1F0E" stroke-width="3" stroke-linecap="round"/>
  <line x1="108" y1="186" x2="112" y2="180" stroke="#2A1F0E" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="85" cy="88" rx="46" ry="44" fill="#5B4FCF"/>
  <ellipse cx="55" cy="52" rx="12" ry="18" fill="#4A3FBF" transform="rotate(-15,55,52)"/>
  <ellipse cx="115" cy="52" rx="12" ry="18" fill="#4A3FBF" transform="rotate(15,115,52)"/>
  <ellipse cx="55" cy="50" rx="7" ry="12" fill="#6B5FDF" transform="rotate(-15,55,50)"/>
  <ellipse cx="115" cy="50" rx="7" ry="12" fill="#6B5FDF" transform="rotate(15,115,50)"/>
  <circle cx="65" cy="88" r="18" fill="#C8D8F8"/>
  <circle cx="105" cy="88" r="18" fill="#C8D8F8"/>
  <circle cx="65" cy="88" r="13" fill="#2A2070"/>
  <circle cx="105" cy="88" r="13" fill="#2A2070"/>
  <path d="M52,88 Q65,80 78,88" fill="#2A2070"/>
  <path d="M92,88 Q105,80 118,88" fill="#2A2070"/>
  <circle cx="70" cy="84" r="4" fill="white" opacity="0.8"/>
  <circle cx="110" cy="84" r="4" fill="white" opacity="0.8"/>
  <circle cx="72" cy="82" r="2" fill="white" opacity="0.5"/>
  <circle cx="112" cy="82" r="2" fill="white" opacity="0.5"/>
  <path d="M79,100 L85,110 L91,100 Z" fill="#E8A020"/>
  <ellipse cx="65" cy="92" rx="20" ry="18" fill="none" stroke="#8B7FEE" stroke-width="2" opacity="0.5"/>
  <ellipse cx="105" cy="92" rx="20" ry="18" fill="none" stroke="#8B7FEE" stroke-width="2" opacity="0.5"/>
  <circle cx="85" cy="68" r="4" fill="#4A3FBF" opacity="0.5"/>
  <circle cx="72" cy="72" r="3" fill="#4A3FBF" opacity="0.4"/>
  <circle cx="98" cy="72" r="3" fill="#4A3FBF" opacity="0.4"/>
</svg>`;

// ── SPLASH CONTROLLER ─────────────────────────────────────────────────────────
const hour = new Date().getHours();
const IS_NIGHT = hour >= 19 || hour < 6;

let mascotMsgs, tapIdx = 0;

function initSplash() {
  const splash = document.getElementById('splash');
  const mascotWrap = document.getElementById('mascot-wrap');
  const bubbleEl   = document.getElementById('bubble');
  const timeLbl    = document.getElementById('timeLabel');
  const h2El       = document.getElementById('h2');
  const sunEl      = document.getElementById('sun');
  const moonEl     = document.getElementById('moon');
  const stars      = document.querySelectorAll('.star-dot');

  if (IS_NIGHT) {
    splash.classList.replace('day', 'night');
    mascotWrap.innerHTML = OWL_SVG;
    mascotMsgs = ['¡Shh! Es de noche 🌙','¡Estudio nocturno! 🦉','¡Huu huu! ¿Listo? 🌟','Aprendo de noche 🔮','¡Desliza arriba! ↑','¡Casi medianoche! 🌙'];
    bubbleEl.textContent = '¡Hola! Soy Bú 🦉';
    timeLbl.textContent  = hour >= 19 ? 'Buenas noches' : 'Madrugada';
    h2El.textContent     = 'esta noche';
    sunEl.style.opacity  = '0';
    moonEl.style.opacity = '1';
    stars.forEach((s,i) => setTimeout(() => s.style.opacity='1', i*140));
  } else {
    mascotWrap.innerHTML = CROC_SVG;
    mascotMsgs = ['¡Hola! Soy Coco 🐊','¡Tócame otra vez! 😄','¡Vamos a aprender! 📚','¡Grr! Soy amigable 🐊','¡Desliza arriba! ↑','¡Snap snap! 😁'];
    bubbleEl.textContent = '¡Hola! Soy Coco 🐊';
    timeLbl.textContent  = hour < 12 ? 'Buenos días' : 'Buenas tardes';
    sunEl.style.opacity  = '1';
    moonEl.style.opacity = '0';
  }

  // Show greeting
  setTimeout(() => {
    bubbleEl.classList.add('show');
    setTimeout(() => bubbleEl.classList.remove('show'), 3200);
  }, 700);

  // Idle bob — only when no CSS animation is running, use CSS class not inline style
  setTimeout(function idleBob() {
    const m = document.getElementById('mascot-wrap');
    if (m && !m.classList.contains('boing') && !m.classList.contains('wiggle')) {
      m.classList.add('idle-bob');
      setTimeout(() => m && m.classList.remove('idle-bob'), 2800);
    }
    setTimeout(idleBob, 3400 + Math.random()*2000);
  }, 2200);

  // Swipe-up gesture
  let sy = 0, sdrag = false;
  splash.addEventListener('pointerdown', e => {
    if (e.target.closest('#mascot-wrap')) return;
    sy = e.clientY; sdrag = true; splash.setPointerCapture(e.pointerId);
  }, { passive: true });
  splash.addEventListener('pointermove', e => {
    if (!sdrag) return;
    const dy = sy - e.clientY;
    if (dy > 15) splash.style.transform = `translateY(${-Math.min(dy/130,1)*100}%)`;
  }, { passive: true });
  splash.addEventListener('pointerup', e => {
    if (!sdrag) return; sdrag = false;
    const dy = sy - e.clientY;
    if (dy > 75) {
      splash.classList.add('exit');
      document.getElementById('app').classList.add('visible');
      setTimeout(() => window.speechSynthesis && speak('¡Elige una categoría!'), 700);
    } else {
      splash.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
      splash.style.transform  = '';
    }
  });
}

function mascotTap() {
  const m   = document.getElementById('mascot-wrap');
  const b   = document.getElementById('bubble');
  const anim = tapIdx % 2 === 0 ? 'boing' : 'wiggle';
  m.classList.remove('boing','wiggle');
  void m.offsetWidth;
  m.classList.add(anim);
  m.addEventListener('animationend', () => m.classList.remove(anim), { once: true });
  b.textContent = mascotMsgs[tapIdx % mascotMsgs.length];
  b.classList.add('show');
  clearTimeout(b._t);
  b._t = setTimeout(() => b.classList.remove('show'), 2400);
  spawnParticles();
  tapIdx++;
}

function spawnParticles() {
  const m   = document.getElementById('mascot-wrap');
  const r   = m.getBoundingClientRect();
  const cols = IS_NIGHT
    ? ['#C8D8F8','#8B7FEE','#E8A020','#ffffff','#6B5FDF']
    : ['#FFD700','#6BC86B','#FF7B54','#ffffff','#4EA84E'];
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    p.className = 'prt';
    const angle = Math.random() * Math.PI * 2;
    const dist  = 40 + Math.random() * 55;
    const size  = 6 + Math.random() * 7;
    p.style.cssText = `width:${size}px;height:${size}px;background:${cols[i%cols.length]};left:${r.left+r.width/2}px;top:${r.top+r.height/2}px;--tx:${Math.cos(angle)*dist}px;--ty:${Math.sin(angle)*dist}px;`;
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove(), { once: true });
  }
}
