import { Turret } from './objects/Turret';
import { Enemy } from './objects/Enemy';
import { Projectile } from './objects/Projectile';
import generatePath from './functions/generatePath';
import generateTurrets from './functions/generateTurrets';
import generateEnemies from './functions/generateEnemies';
import { rand } from './functions/helpers';

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

    this.money = 100;

    this.wave = {
      number: 0,
    };

    this.turretTypes = generateTurrets();
    this.enemyTypes = generateEnemies();

    this.turrets = [];
    this.projectiles = [];
    this.enemies = [];

    this.path = generatePath(
      this.gridWidth,
      this.gridHeight,
      (this.gridWidth * this.gridHeight) / 2
    );

    this.advance();

    this.lastRender = Date.now();

    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));
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

    if (!this.wave.inProgress) {
      // this.sendWave();
    }

    const now = Date.now();
    const delta = now - this.lastRender;
    const deltaSeconds = delta / 1000;

    // background
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // path outer
    this.path.forEach((segment) => {
      ctx.fillStyle = '#aaa';
      ctx.fillRect(
        segment[0] * cellSize,
        segment[1] * cellSize,
        cellSize,
        cellSize
      );
    });

    const pathPadding = 4;

    // path inner
    this.path.forEach((segment, idx) => {
      if (idx < 1 || idx > this.path.length - 1) {
        return;
      }
      const prev = this.path[idx - 1];
      const x1 = Math.min(segment[0], prev[0]) * cellSize + pathPadding;
      const x2 = Math.max(segment[0], prev[0]) * cellSize - pathPadding;
      const y1 = Math.min(segment[1], prev[1]) * cellSize + pathPadding;
      const y2 = Math.max(segment[1], prev[1]) * cellSize - pathPadding;

      ctx.fillStyle = '#666';
      ctx.fillRect(x1, y1, x2 - x1 + cellSize, y2 - y1 + cellSize);
    });

    // spawn
    const spawnX = this.path[0][0] * cellSize + cellSize / 2;
    const spawnY = this.path[0][1] * cellSize + cellSize / 2;
    ctx.fillStyle = '#8a8';
    ctx.beginPath();
    ctx.arc(spawnX, spawnY, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = '#fff';
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('s', spawnX, spawnY);

    // end
    const endX = this.path[this.path.length - 1][0] * cellSize + cellSize / 2;
    const endY = this.path[this.path.length - 1][1] * cellSize + cellSize / 2;
    ctx.fillStyle = '#a88';
    ctx.beginPath();
    ctx.arc(endX, endY, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = '#fff';
    ctx.fillText('e', endX, endY);

    // grid
    ctx.strokeStyle = '#fffa';

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
    // ctx.fillStyle = '#fff';
    // ctx.font = '20px monospace';
    // ctx.textAlign = 'right';
    // ctx.textBaseline = 'top';
    // ctx.fillText(
    //   `Remaining: ${this.wave.total - this.wave.missed - this.wave.killed}`,
    //   gameWidth - 10,
    //   10
    // );
    // ctx.fillText(
    //   `Coming: ${this.wave.total - this.enemies.length}`,
    //   gameWidth - 10,
    //   30
    // );
    // ctx.fillText(`Killed: ${this.wave.killed}`, gameWidth - 10, 50);
    // ctx.fillText(`Missed: ${this.wave.missed}`, gameWidth - 10, 70);

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
          (segment, idx) =>
            (enemy.lastSegmentIndex == null || idx > enemy.lastSegmentIndex) &&
            segment[0] === cellX &&
            segment[1] === cellY
        );

        const nextSegment = this.path[segmentIndex + 1];

        enemy.lastSegmentIndex = segmentIndex;
        enemy.lastSegment = this.path[segmentIndex];
        enemy.nextSegment = nextSegment;
      }

      if (!enemy.nextSegment) {
        // this.enemies.splice(i, 1);
        this.wave.missed++;
        enemy.health = 0;
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

      enemy.render(ctx);
    }

    // process turrets
    for (const turret of this.turrets) {
      const x = turret.gridX * cellSize + cellSize / 2;
      const y = turret.gridY * cellSize + cellSize / 2;
      ctx.fillStyle = turret.color;
      ctx.beginPath();
      ctx.arc(x, y, turret.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      const radiusPx = turret.radius * cellSize;

      if (this.selectedTurret && this.selectedTurret.id === turret.id) {
        ctx.strokeStyle = turret.color;
        ctx.fillStyle = turret.color + '3';
        ctx.beginPath();
        ctx.arc(x, y, radiusPx, 0, Math.PI * 2);
        ctx.stroke();
        // ctx.fill();
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
                color: turret.projectileColor,
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

      if (!enemy || enemy.health <= 0) {
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
        if (enemy.health <= 0) {
          this.wave.killed++;
          this.money += enemy.money;
        }
        continue;
      }

      projectile.render(ctx);
    }

    if (this.mouseX) {
      // cell selection
      let xCell = Math.floor(this.mouseX / cellSize);
      let yCell = Math.floor(this.mouseY / cellSize);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(xCell * cellSize, yCell * cellSize, cellSize, cellSize);

      if (this.placingTurret) {
        const x = xCell * cellSize + cellSize / 2;
        const y = yCell * cellSize + cellSize / 2;

        ctx.fillStyle = this.placingTurret.color;
        ctx.beginPath();
        ctx.arc(x, y, this.placingTurret.size, 0, Math.PI * 2);
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

    if (
      !this.wave.finishedAt &&
      this.wave.total - this.wave.missed - this.wave.killed < 1
    ) {
      this.wave.finishedAt = now;
    }

    if (this.wave.finishedAt && this.wave.finishedAt + 1000 < now) {
      this.advance();
    }

    this.lastRender = now;

    requestAnimationFrame(this.draw);
  }

  onMouseMove(e) {
    this.mouseX = e.layerX;
    this.mouseY = e.layerY;
  }

  onMouseLeave() {
    this.mouseX = null;
    this.mouseY = null;
  }

  onClick(e) {
    e.stopPropagation();

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

    if (this.placingTurret) {
      if (!turret && this.money >= this.placingTurret.price) {
        this.placingTurret.gridX = gridX;
        this.placingTurret.gridY = gridY;
        turret = new Turret(this.placingTurret);
        this.money -= this.placingTurret.price;
        this.placingTurret = null;

        this.turrets.push(turret);
      } else {
        this.placingTurret = null;
        return;
      }
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
    if (this.wave.inProgress) {
      return;
    }
    this.wave.inProgress = true;

    for (let idx in this.wave.enemyTypes) {
      const size = this.wave.enemyTypes[idx].size;
      setTimeout(() => {
        this.enemies.push(
          new Enemy(
            Object.assign(
              {
                x:
                  this.path[0][0] * this.cellSize +
                  this.cellSize / 2 -
                  size / 2,
                y:
                  this.path[0][1] * this.cellSize +
                  this.cellSize / 2 -
                  size / 2,
              },
              this.wave.enemyTypes[idx]
            )
          )
        );
      }, idx * 300);
    }
  }

  placeTurret(turret) {
    this.placingTurret = turret;
    this.selectedTurret = null;
  }

  advance() {
    this.enemies = [];
    this.projectiles = [];

    const number = this.wave.number + 1;

    const enemyBudget = (10 + number) * 14;
    let budgetLeft = enemyBudget;
    const enemyTypes = [];

    while (budgetLeft > 0) {
      const possibleEnemyTypes = this.enemyTypes.filter(
        (enemyType) => enemyType.level <= budgetLeft
      );

      if (!possibleEnemyTypes.length) {
        break;
      }
      const enemyType =
        possibleEnemyTypes[rand(0, possibleEnemyTypes.length - 1)];
      enemyTypes.push(enemyType);
      budgetLeft -= enemyType.level;
    }

    this.wave = {
      number,
      total: enemyTypes.length,
      killed: 0,
      missed: 0,
      inProgress: false,
      finishedAt: null,
      enemyTypes,
    };
  }

  sellSelectedTurret() {
    const idx = this.turrets.findIndex(
      (turret) => turret.id === this.selectedTurret.id
    );
    if (idx === -1) {
      return;
    }
    this.turrets.splice(idx, 1);
    this.money += this.selectedTurret.sellPrice;
    this.selectedTurret = null;
  }
}

export default new Game();
