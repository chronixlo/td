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

let selectedTurret;

for (let y = 0; y < gridHeight; y++) {
  for (let x = 0; x < gridWidth; x++) {

  }
}

const turrets = [];

const projectiles = [];

const enemies = [];

const path = [
  [-1, 3],
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
  [5, -1],
];

let lastRender = Date.now();

const draw = () => {
  const now = Date.now();
  const delta = now - lastRender;
  const deltaSeconds = delta / 1000;

  if (Math.random() > 0.98) {
    enemies.push({
      x: -cellSize / 2,
      y: cellSize * 3 + cellSize / 2 - 5,
      speed: 100, // pixels per second
      size: 10,
      health: 50,
    });
  }

  // background
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  // path
  ctx.fillStyle = '#888';
  path.forEach(segment => {
    ctx.fillRect(segment[0] * cellSize, segment[1] * cellSize, cellSize, cellSize);
  });

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

  for (const enemy of enemies) {
    if (enemy.health <= 0) {
      continue;
    }
    const cellX = Math.floor(enemy.x / cellSize);
    const cellY = Math.floor(enemy.y / cellSize);
    const segmentIndex = path.findIndex(segment => segment[0] === cellX && segment[1] === cellY);
    const nextSegment = path[segmentIndex + 1];
    if (!nextSegment) {
      continue;
    }
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

  for (const turret of turrets) {
    const x = turret.gridX * cellSize + cellSize / 2;
    const y = turret.gridY * cellSize + cellSize / 2;
    ctx.fillStyle = '#00f';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    const radiusPx = turret.radius * cellSize;

    if (selectedTurret && selectedTurret.gridX === turret.gridX && selectedTurret.gridY === turret.gridY) {
      ctx.strokeStyle = '#00f';
      ctx.beginPath();
      ctx.arc(x, y, radiusPx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }

    if (now - turret.lastShot > turret.shotInterval) {
      let didShoot = false;
      for (const idx in enemies) {
        const enemy = enemies[idx];
        if (didShoot || enemy.health <= 0) {
          continue;
        }
        const dist = Math.hypot(x - enemy.x, y - enemy.y);
        if (dist < radiusPx) {
          projectiles.push({
            x,
            y,
            speed: turret.projectileSpeed,
            damage: turret.projectileDamage,
            enemyIndex: idx,
          });
          turret.lastShot = now;
          didShoot = true;
        }
      }
    }
  }

  for (let i = projectiles.length - 1; i > -1; i--) {
    const projectile = projectiles[i];
    const enemy = enemies[projectile.enemyIndex];

    const deltaX = enemy.x - projectile.x;
    const deltaY = enemy.y - projectile.y;
    const angle = Math.atan2(deltaY, deltaX);
    const deltaDistance = Math.hypot(deltaX, deltaY);

    const distance = Math.min(deltaDistance, projectile.speed * deltaSeconds);

    projectile.x = Math.cos(angle) * distance + projectile.x;
    projectile.y = Math.sin(angle) * distance + projectile.y;

    // hit
    if (Math.hypot(enemy.x - projectile.x, enemy.y - projectile.y) < 5) {
      projectiles.splice(i, 1);
      enemy.health -= projectile.damage;
      continue;
    }

    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
    ctx.fill();
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

const onClick = e => {
  const gridX = Math.floor(mouseX / cellSize);
  const gridY = Math.floor(mouseY / cellSize);

  selectedTurret = null;

  if (path.find(segment => segment[0] === gridX && segment[1] === gridY)) {
    return;
  }

  let turret = turrets.find(turret => turret.gridX === gridX && turret.gridY === gridY);

  if (!turret) {
    turret = {
      gridX,
      gridY,
      radius: 3, // cells
      lastShot: 0,
      shotInterval: 500,
      projectileSpeed: 200, // pixels per second
      projectileDamage: 10,
    };

    turrets.push(turret);
  }

  selectedTurret = turret;
};

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('click', onClick);

requestAnimationFrame(draw);
