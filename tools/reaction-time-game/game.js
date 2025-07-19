/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);

const dot      = $('dot');
const startBtn = $('start');
const modal    = $('modal');
const result   = $('result');
const restart  = $('restart');
const scoreEl  = $('score');
const bestEl   = $('best');
const fx       = $('fx');
const ctx      = fx.getContext('2d');
fx.width = 300;
fx.height = 400;

let playing   = false;
let dotsHit   = 0;
let startTime = 0;
let best      = +localStorage.getItem('best') || 0;
if (best) bestEl.textContent = best;

/* ---------- particle explosion ---------- */
const particles = [];
function addParticles(x, y) {
  for (let i = 0; i < 30; i++) {
    particles.push({
      x, y,
      dx: (Math.random() - .5) * 6,
      dy: (Math.random() - .5) * 6,
      life: 20
    });
  }
}
function animateParticles() {
  ctx.clearRect(0, 0, 300, 400);
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    p.life--;
    ctx.fillStyle = `rgba(0,255,0,${p.life/20})`;
    ctx.fillRect(p.x, p.y, 3, 3);
  });
  particles.splice(0, particles.length, ...particles.filter(p => p.life > 0));
  if (particles.length) requestAnimationFrame(animateParticles);
}

/* ---------- game logic ---------- */
function nextDot() {
  const maxX = 300 - 50;
  const maxY = 400 - 50;
  dot.style.left = Math.floor(Math.random() * maxX) + 'px';
  dot.style.top  = Math.floor(Math.random() * maxY) + 'px';
  dot.hidden = false;
  startTime  = Date.now();
}

function startGame() {
  startBtn.hidden = true;
  dotsHit = 0;
  scoreEl.textContent = 0;
  playing = true;
  nextDot();
}

function hit() {
  const t = Date.now() - startTime;
  if (!best || t < best) {
    best = t;
    localStorage.setItem('best', best);
    bestEl.textContent = best;
  }
  dotsHit++;
  scoreEl.textContent = dotsHit;

  /* particles */
  const r = dot.getBoundingClientRect();
  const x = parseInt(dot.style.left, 10) + 25;
  const y = parseInt(dot.style.top, 10)  + 25;
  addParticles(x, y);
  animateParticles();

  dot.hidden = true;

  if (dotsHit >= 5) {
    endGame(`Average: ${best} ms`);
  } else {
    setTimeout(nextDot, 600 + Math.random() * 800);
  }
}

function endGame(msg) {
  playing = false;
  result.textContent = msg;
  modal.hidden = false;
}

/* ---------- listeners ---------- */
startBtn.onclick = () => {
  startBtn.hidden = true;
  resetGame();
};

restart.onclick = () => {
  modal.hidden = true;
  resetGame();
};

dot.onclick = () => {
  if (playing) hit();
};

/* ---------- reset helper ---------- */
function resetGame() {
  dotsHit = 0;
  scoreEl.textContent = 0;
  playing = true;
  nextDot();
}
