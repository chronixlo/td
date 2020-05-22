import '../styles/index.scss';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gameWidth = 800;
const gameHeight = 450;

canvas.height = gameHeight;
canvas.width = gameWidth;

const gridWidth = 16;
const gridHeight = 9;
const cellSize = gameWidth / gridWidth;

let mouseX;
let mouseY;

for (let y = 0; y < gridHeight; y++) {
  for (let x = 0; x < gridWidth; x++) {

  }
}

const enemies = [{
  x: 0,
  y: cellSize * 3 + cellSize / 2 - 5,
  speed: 300, // pixels per second
  size: 10,
}];

const path = [
  [0, 3],
  [1, 3],
  [1, 4],
  [2, 4],
  [2, 5],
  [2, 6],
  [2, 7],
  [2, 8],
  [3, 8],
  [4, 8],
  [5, 8],
  [6, 8],
  [6, 7],
  [6, 6],
  [5, 6],
  [5, 5],
  [5, 4],
  [5, 3],
  [5, 2],
  [5, 1],
  [5, 0],
];

let lastRender = Date.now();

const draw = () => {
  const now = Date.now();
  const delta = now - lastRender;
  const deltaSeconds = delta / 1000;

  // background
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  // path
  ctx.fillStyle = '#888';
  path.forEach(segment => {
    ctx.fillRect(segment[0] * cellSize, segment[1] * cellSize, cellSize, cellSize);
  });

  for (const enemy of enemies) {
    const cellX = Math.floor(enemy.x / cellSize);
    const cellY = Math.floor(enemy.y / cellSize);
    const segmentIndex = path.findIndex(segment => segment[0] === cellX && segment[1] === cellY);
    const nextSegment = path[segmentIndex + 1];
    if (nextSegment[0] > cellX) {
      enemy.x += enemy.speed * deltaSeconds;
    }
    else if (nextSegment[0] < cellX) {
      enemy.x -= enemy.speed * deltaSeconds;
    }
    else if (nextSegment[1] > cellY) {
      enemy.y += enemy.speed * deltaSeconds;
    }
    else if (nextSegment[1] < cellY) {
      enemy.y -= enemy.speed * deltaSeconds;
    }

    ctx.fillStyle = '#0f0';
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  }

  // grid
  ctx.strokeStyle = '#ccc';

  for (let y = 0; y <= gridHeight; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cellSize);
    ctx.lineTo(gameWidth, y * cellSize);
    ctx.stroke();
    ctx.closePath();
  }

  for (let x = 0; x <= gridWidth; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cellSize, 0);
    ctx.lineTo(x * cellSize, gameHeight);
    ctx.stroke();
    ctx.closePath();
  }

  // cell selection
  let xCell = Math.floor(mouseX / cellSize);
  let yCell = Math.floor(mouseY / cellSize);

  ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
  ctx.fillRect(xCell * cellSize, yCell * cellSize, cellSize, cellSize);

  lastRender = now;

  requestAnimationFrame(draw);
};

const onMouseMove = e => {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
};

canvas.addEventListener('mousemove', onMouseMove);

requestAnimationFrame(draw);
