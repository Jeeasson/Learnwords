// ── CONFETTI ──────────────────────────────────────────────────────────────────
const cnv  = document.getElementById('confetti-canvas');
const cctx = cnv.getContext('2d');
let cparts = [], crun = false;

function resizeCanvas() { cnv.width = window.innerWidth; cnv.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function launchConfetti(x, y) {
  const cols = ['#FF7B54','#FFD700','#4CAF8A','#7B8FF7','#F06292','#00BCD4'];
  for (let i = 0; i < 52; i++) {
    const a = Math.random() * Math.PI * 2, s = 3 + Math.random() * 5;
    cparts.push({
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight * 0.6,
      vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4,
      r: 4 + Math.random() * 5,
      color: cols[Math.floor(Math.random() * cols.length)],
      rot: Math.random() * 360, rotv: (Math.random() - 0.5) * 12,
      alpha: 1, sh: Math.random() > 0.5 ? 'r' : 'c'
    });
  }
  if (!crun) { crun = true; animConf(); }
}

function animConf() {
  cctx.clearRect(0, 0, cnv.width, cnv.height);
  cparts.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.vx *= 0.99;
    p.rot += p.rotv; p.alpha -= 0.018;
    cctx.save();
    cctx.globalAlpha = Math.max(0, p.alpha);
    cctx.translate(p.x, p.y); cctx.rotate(p.rot * Math.PI / 180);
    cctx.fillStyle = p.color;
    if (p.sh === 'r') { cctx.fillRect(-p.r, -p.r/2, p.r*2, p.r); }
    else              { cctx.beginPath(); cctx.arc(0,0,p.r,0,Math.PI*2); cctx.fill(); }
    cctx.restore();
  });
  cparts = cparts.filter(p => p.alpha > 0);
  if (cparts.length > 0) { requestAnimationFrame(animConf); }
  else { crun = false; cctx.clearRect(0, 0, cnv.width, cnv.height); }
}
