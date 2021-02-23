import { Turret } from './objects/Turret';
import { Enemy } from './objects/Enemy';
import { Projectile } from './objects/Projectile';

class Game {
  constructor() {
    const canvas = (this.canvas = document.getElementById('game'));
    this.ctx = this.canvas.getContext('2d');

    this.gameWidth = 800;
    this.gameHeight = 450;

    canvas.height = this.gameHeight;
    canvas.width = this.gameWidth;

    this.gridWidth = 16;
    this.gridHeight = 9;
    this.cellSize = this.gameWidth / this.gridWidth;

    this.mouseX;
    this.mouseY;

    this.selectedTurret;
    this.placingTurret;

    this.wave = {
      total: 10,
      killed: 0,
      missed: 0,
    };

    this.turrets = [];
    this.projectiles = [];
    this.enemies = [];

    this.path = [
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

    this.lastRender = Date.now();

    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseleave', () => {
      this.mouseX = null;
      this.mouseY = null;
    });
    canvas.addEventListener('click', this.onClick.bind(this));

    this.draw = this.draw.bind(this);

    requestAnimationFrame(this.draw);
  }

  draw() {
    const {
      ctx,
      gameWidth,
      gameHeight,
      cellSize,
      gridHeight,
      gridWidth,
    } = this;

    const now = Date.now();
    const delta = now - this.lastRender;
    const deltaSeconds = delta / 1000;

    // background
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // path
    ctx.fillStyle = '#888';
    this.path.forEach((segment) => {
      ctx.fillRect(
        segment[0] * cellSize,
        segment[1] * cellSize,
        cellSize,
        cellSize
      );
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

    // wave status
    ctx.fillStyle = '#fff';
    ctx.font = '20px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`Total: ${this.wave.total}`, gameWidth - 10, 10);
    ctx.fillText(
      `Coming: ${this.wave.total - this.enemies.length - this.wave.missed}`,
      gameWidth - 10,
      30
    );
    ctx.fillText(`Killed: ${this.wave.killed}`, gameWidth - 10, 50);
    ctx.fillText(`Missed: ${this.wave.missed}`, gameWidth - 10, 70);

    // process enemies
    for (let i = this.enemies.length - 1; i > -1; i--) {
      const enemy = this.enemies[i];
      if (enemy.health <= 0) {
        // can't slice as turret's target is enemy index
        // this.enemies.splice(i, 1);
        // this.wave.killed++;
        continue;
      }
      if (!enemy.nextSegment) {
        const cellX = Math.floor(enemy.x / cellSize);
        const cellY = Math.floor(enemy.y / cellSize);
        const segmentIndex = this.path.findIndex(
          (segment) => segment[0] === cellX && segment[1] === cellY
        );
        const nextSegment = this.path[segmentIndex + 1];

        enemy.lastSegment = this.path[segmentIndex];
        enemy.nextSegment = nextSegment;
      }

      if (!enemy.nextSegment) {
        this.enemies.splice(i, 1);
        this.wave.missed++;
        continue;
      }

      if (enemy.lastSegment[0] !== enemy.nextSegment[0]) {
        if (this.getEnemyOffsetX(enemy) > enemy.x) {
          enemy.x += enemy.speed * deltaSeconds;
          if (this.getEnemyOffsetX(enemy) <= enemy.x) {
            enemy.nextSegment = null;
          }
        } else if (this.getEnemyOffsetX(enemy) < enemy.x) {
          enemy.x -= enemy.speed * deltaSeconds;
          if (this.getEnemyOffsetX(enemy) >= enemy.x) {
            enemy.nextSegment = null;
          }
        }
      } else if (enemy.lastSegment[1] !== enemy.nextSegment[1]) {
        if (this.getEnemyOffsetY(enemy) > enemy.y) {
          enemy.y += enemy.speed * deltaSeconds;
          if (this.getEnemyOffsetY(enemy) <= enemy.y) {
            enemy.nextSegment = null;
          }
        } else if (this.getEnemyOffsetY(enemy) < enemy.y) {
          enemy.y -= enemy.speed * deltaSeconds;
          if (this.getEnemyOffsetY(enemy) >= enemy.y) {
            enemy.nextSegment = null;
          }
        }
      }

      ctx.fillStyle = '#0f0';
      ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
    }

    // process turrets
    for (const turret of this.turrets) {
      const x = turret.gridX * cellSize + cellSize / 2;
      const y = turret.gridY * cellSize + cellSize / 2;
      ctx.fillStyle = turret.color;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      const radiusPx = turret.radius * cellSize;

      if (
        this.selectedTurret &&
        this.selectedTurret.gridX === turret.gridX &&
        this.selectedTurret.gridY === turret.gridY
      ) {
        ctx.strokeStyle = turret.color;
        ctx.beginPath();
        ctx.arc(x, y, radiusPx, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      }

      if (now - turret.lastShot > turret.shotInterval) {
        let didShoot = false;
        for (const idx in this.enemies) {
          const enemy = this.enemies[idx];
          if (didShoot || enemy.health <= 0) {
            continue;
          }
          const dist = Math.hypot(x - enemy.x, y - enemy.y);
          if (dist < radiusPx) {
            this.projectiles.push(
              new Projectile({
                x,
                y,
                speed: turret.projectileSpeed,
                damage: turret.projectileDamage,
                size: turret.projectileSize,
                enemyIndex: idx,
              })
            );
            turret.lastShot = now;
            didShoot = true;
          }
        }
      }
    }

    // process projectiles
    for (let i = this.projectiles.length - 1; i > -1; i--) {
      const projectile = this.projectiles[i];
      const enemy = this.enemies[projectile.enemyIndex];

      if (!enemy || enemy.health < 0) {
        this.projectiles.splice(i, 1);
        continue;
      }

      const deltaX = enemy.x - projectile.x;
      const deltaY = enemy.y - projectile.y;
      const angle = Math.atan2(deltaY, deltaX);
      const deltaDistance = Math.hypot(deltaX, deltaY);

      const distance = Math.min(deltaDistance, projectile.speed * deltaSeconds);

      projectile.x = Math.cos(angle) * distance + projectile.x;
      projectile.y = Math.sin(angle) * distance + projectile.y;

      // hit
      if (
        Math.hypot(enemy.x - projectile.x, enemy.y - projectile.y) <
        projectile.size
      ) {
        this.projectiles.splice(i, 1);
        enemy.health -= projectile.damage;
        if (enemy.health < 0) {
          this.wave.killed++;
        }
        continue;
      }

      ctx.fillStyle = '#f00';
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }

    if (this.mouseX) {
      // cell selection
      let xCell = Math.floor(this.mouseX / cellSize);
      let yCell = Math.floor(this.mouseY / cellSize);

      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      ctx.fillRect(xCell * cellSize, yCell * cellSize, cellSize, cellSize);

      if (this.placingTurret) {
        const x = xCell * cellSize + cellSize / 2;
        const y = yCell * cellSize + cellSize / 2;

        ctx.fillStyle = this.placingTurret.color;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        const radiusPx = this.placingTurret.radius * cellSize;
        ctx.strokeStyle = this.placingTurret.color;
        ctx.beginPath();
        ctx.arc(x, y, radiusPx, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      }
    }

    this.lastRender = now;

    requestAnimationFrame(this.draw);
  }

  onMouseMove(e) {
    this.mouseX = e.layerX;
    this.mouseY = e.layerY;
  }

  onClick(e) {
    const gridX = Math.floor(this.mouseX / this.cellSize);
    const gridY = Math.floor(this.mouseY / this.cellSize);

    this.selectedTurret = null;

    if (
      this.path.find((segment) => segment[0] === gridX && segment[1] === gridY)
    ) {
      return;
    }

    let turret = this.turrets.find(
      (turret) => turret.gridX === gridX && turret.gridY === gridY
    );

    if (!turret && this.placingTurret) {
      this.placingTurret.gridX = gridX;
      this.placingTurret.gridY = gridY;
      turret = new Turret(this.placingTurret);
      this.placingTurret = null;

      this.turrets.push(turret);
    }

    this.selectedTurret = turret;
  }

  getEnemyOffsetX(enemy) {
    return (
      enemy.nextSegment[0] * this.cellSize +
      enemy.cellOffsetX * this.cellSize -
      0.5 * enemy.size
    );
  }

  getEnemyOffsetY(enemy) {
    return (
      enemy.nextSegment[1] * this.cellSize +
      enemy.cellOffsetY * this.cellSize -
      0.5 * enemy.size
    );
  }

  sendWave() {
    for (let i = 0; i < this.wave.total; i++) {
      setTimeout(() => {
        this.enemies.push(
          new Enemy({
            x: -this.cellSize / 2,
            y: this.cellSize * 3 + this.cellSize / 2 - 5,
            speed: 500,
            size: 10,
            health: 50,
          })
        );
      }, i * 1000);
    }
  }

  placeTurret(turret) {
    this.placingTurret = turret;
  }
}

export default new Game();
