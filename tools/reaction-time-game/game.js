css

/*  Dark theme & layout  */
body {
  margin: 0;
  font-family: sans-serif;
  background: #111;
  color: #0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}
h1 { margin: 0 0 20px; }

/*  Buttons  */
button {
  padding: 10px 20px;
  font-size: 18px;
  border: 2px solid #0f0;
  background: transparent;
  color: #0f0;
  border-radius: 6px;
  cursor: pointer;
}
button:hover { background: #0f033; }

/*  Game area  */
#gameArea {
  position: relative;
  width: 300px;
  height: 400px;
  border: 1px solid #222;
  border-radius: 10px;
  margin-top: 20px;
  overflow: hidden;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

/*  Dots  */
.dot {
  position: absolute;
  width: 50px;
  height: 50px;
  background: #0f0;
  border-radius: 50%;
  cursor: pointer;
}

/*  Modal  */
#modal {
  position: fixed;
  inset: 0;
  background: #111d;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#modal h2 { margin-bottom: 20px; }
game.js

js

const startBtn = document.getElementById('start');
const gameArea = document.getElementById('gameArea');
const modal = document.getElementById('modal');
const bestSpan = document.getElementById('best');
const againBtn = document.getElementById('again');
const fx = document.getElementById('fx');
const ctx = fx.getContext('2d');

let best = +localStorage.getItem('best') || 0;
bestSpan.textContent = best;

let clicks = 0;
let activeDot = null;
let startTime = 0;
let particles = [];

startBtn.addEventListener('click', nextDot);
againBtn.addEventListener('click', reset);

function nextDot() {
  if (clicks >= 5) return showModal();
  if (activeDot) activeDot.remove();

  const dot = document.createElement('div');
  dot.className = 'dot';
  const x = Math.random() * 250;
  const y = Math.random() * 350;
  dot.style.left = x + 'px';
  dot.style.top = y + 'px';
  gameArea.appendChild(dot);
  activeDot = dot;
  startTime = performance.now();

  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    const ms = Math.round(performance.now() - startTime);
    if (!best || ms < best) {
      best = ms;
      localStorage.setItem('best', best);
      bestSpan.textContent = best;
    }
    explode(e.clientX - gameArea.offsetLeft, e.clientY - gameArea.offsetTop);
    dot.remove();
    activeDot = null;
    clicks++;
    nextDot();
  });
}

function explode(x, y) {
  for (let i = 0; i < 30; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 20
    });
  }
  animate();
