const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});

const games = {};

let TURRET_ID = 1;

io.on('connection', (socket) => {
  console.log('a user connected');

  let gameId;

  socket.on('create_game', (event) => {
    const { path, turretTypes, enemyTypes, gridWidth, gridHeight } = event;

    gameId = Math.random().toString(36).slice(2);

    const game = {
      gameId,
      player1: {
        id: socket.id,
        money: 100,
        ready: false,
      },
      player2: null,
      path,
      turretTypes,
      enemyTypes,
      wave: generateWave(0, enemyTypes),
      cellSize: 50,
      enemies: [],
      turrets: [],
      projectiles: [],
      gridHeight,
      gridWidth,
      missed: 0,
      boughtEnemies: [],
    };

    games[gameId] = game;

    socket.emit('join', game, true);
    socket.to(gameId).emit('player_join', '');

    socket.join(gameId);
  });

  socket.on('join_game', (event) => {
    gameId = event.gameId;

    const game = games[gameId];

    if (!game) {
      socket.emit('not_found');
      return;
    }

    if (!game.player2) {
      game.player2 = {
        id: socket.id,
        money: 100,
        ready: false,
      };
    }

    socket.join(gameId);
    socket.emit('join', game, false);
    socket.to(gameId).emit('player_join', game);
  });

  socket.on('ready', (event) => {
    const game = games[gameId];

    if (!game) {
      return;
    }

    if (game.player1.id === socket.id) {
      game.player1.ready = true;
    } else if (game.player2 && game.player2.id === socket.id) {
      game.player2.ready = true;
    }

    if (!game.player1.ready || !game.player2 || !game.player2.ready) {
      io.to(gameId).emit('update', {
        player1: game.player1,
        player2: game.player2,
      });
      return;
    }

    let now = Date.now();

    game.wave.total = game.boughtEnemies.length;
    game.wave.inProgress = true;

    io.to(gameId).emit('update', {
      enemies: game.enemies,
      projectiles: game.projectiles,
      missed: game.missed,
      wave: game.wave,
    });

    for (let idx in game.boughtEnemies.slice()) {
      setTimeout(() => {
        game.enemies.push(
          Object.assign(
            {
              x: game.path[0][0] * game.cellSize + game.cellSize / 2,
              y: game.path[0][1] * game.cellSize + game.cellSize / 2,
            },
            game.boughtEnemies[idx]
          )
        );
      }, idx * 300);
    }

    const interval = setInterval(() => {
      const deltaSeconds = 16 / 1000;
      now += 16;
      const cellSize = game.cellSize;

      // process enemies
      for (let i = game.enemies.length - 1; i > -1; i--) {
        const enemy = game.enemies[i];
        if (enemy.health <= 0) {
          // can't slice as turret's target is enemy index
          // game.enemies.splice(i, 1);
          // game.wave.killed++;
          continue;
        }
        if (!enemy.nextSegment) {
          const cellX = Math.floor(enemy.x / cellSize);
          const cellY = Math.floor(enemy.y / cellSize);
          const segmentIndex = game.path.findIndex(
            (segment, idx) =>
              (enemy.lastSegmentIndex == null ||
                idx > enemy.lastSegmentIndex) &&
              segment[0] === cellX &&
              segment[1] === cellY
          );

          const nextSegment = game.path[segmentIndex + 1];

          enemy.lastSegmentIndex = segmentIndex;
          enemy.lastSegment = game.path[segmentIndex];
          enemy.nextSegment = nextSegment;
        }

        if (!enemy.nextSegment) {
          game.enemies.splice(i, 1);
          game.wave.missed++;
          game.missed++;
          enemy.health = 0;
          continue;
        }

        if (enemy.lastSegment[0] !== enemy.nextSegment[0]) {
          if (getEnemyOffsetX(enemy) > enemy.x) {
            enemy.x += enemy.speed * deltaSeconds;
            if (getEnemyOffsetX(enemy) <= enemy.x) {
              enemy.nextSegment = null;
            }
          } else if (getEnemyOffsetX(enemy) < enemy.x) {
            enemy.x -= enemy.speed * deltaSeconds;
            if (getEnemyOffsetX(enemy) >= enemy.x) {
              enemy.nextSegment = null;
            }
          }
        } else if (enemy.lastSegment[1] !== enemy.nextSegment[1]) {
          if (getEnemyOffsetY(enemy) > enemy.y) {
            enemy.y += enemy.speed * deltaSeconds;
            if (getEnemyOffsetY(enemy) <= enemy.y) {
              enemy.nextSegment = null;
            }
          } else if (getEnemyOffsetY(enemy) < enemy.y) {
            enemy.y -= enemy.speed * deltaSeconds;
            if (getEnemyOffsetY(enemy) >= enemy.y) {
              enemy.nextSegment = null;
            }
          }
        }
      }

      // process turrets
      for (const turret of game.turrets) {
        const x = turret.gridX * cellSize + cellSize / 2;
        const y = turret.gridY * cellSize + cellSize / 2;
        const radiusPx = turret.radius * cellSize;

        if (now - turret.lastShot > turret.shotInterval) {
          for (const idx in game.enemies) {
            const enemy = game.enemies[idx];
            if (enemy.health <= 0) {
              continue;
            }
            const dist = Math.hypot(x - enemy.x, y - enemy.y);
            if (dist < radiusPx) {
              game.projectiles.push({
                x,
                y,
                speed: turret.projectileSpeed,
                damage: turret.projectileDamage,
                size: turret.projectileSize,
                enemy,
                color: turret.projectileColor,
              });
              turret.lastShot = now;
              break;
            }
          }
        }
      }

      // process projectiles
      for (let i = game.projectiles.length - 1; i > -1; i--) {
        const projectile = game.projectiles[i];
        const enemy = projectile.enemy;

        if (!enemy || enemy.health <= 0) {
          game.projectiles.splice(i, 1);
          continue;
        }

        const deltaX = enemy.x - projectile.x;
        const deltaY = enemy.y - projectile.y;
        const angle = Math.atan2(deltaY, deltaX);
        const deltaDistance = Math.hypot(deltaX, deltaY);

        const distance = Math.min(
          deltaDistance,
          projectile.speed * deltaSeconds
        );

        projectile.x = Math.cos(angle) * distance + projectile.x;
        projectile.y = Math.sin(angle) * distance + projectile.y;

        // hit
        if (
          Math.hypot(enemy.x - projectile.x, enemy.y - projectile.y) <
          projectile.size
        ) {
          game.projectiles.splice(i, 1);
          enemy.health -= projectile.damage;
          if (enemy.health <= 0) {
            game.wave.killed++;
            game.player2.money += enemy.money;
          }
          continue;
        }
      }

      io.to(gameId).emit('update', {
        enemies: game.enemies,
        projectiles: game.projectiles,
        missed: game.missed,
      });

      if (
        !game.wave.finishedAt &&
        game.wave.total - game.wave.missed - game.wave.killed < 1
      ) {
        game.wave.finishedAt = now;
        clearInterval(interval);

        setTimeout(() => {
          game.wave = generateWave(game.wave.number);
          game.projectiles = [];
          game.enemies = [];
          game.player1.ready = false;
          game.player2.ready = false;
          game.player1.money += 50;

          io.to(gameId).emit('update', {
            enemies: game.enemies,
            projectiles: game.projectiles,
            missed: game.missed,
            wave: game.wave,
            player1: game.player1,
            player2: game.player2,
          });
        }, 1000);

        return;
      }
    }, 16);
  });

  socket.on('place_turret', (turret) => {
    const game = games[gameId];

    if (game.player2.money >= turret.price) {
      game.turrets.push(Object.assign({ id: TURRET_ID++ }, turret));
      game.player2.money -= turret.price;
      io.to(gameId).emit('update', {
        turrets: game.turrets,
        player2: game.player2,
      });
    }
  });

  socket.on('place_enemy', (typeId) => {
    const game = games[gameId];

    const enemy = game.enemyTypes.find((enemy) => enemy.typeId === typeId);

    if (enemy && game.player1.money >= enemy.price) {
      game.boughtEnemies.push(enemy);
      game.player1.money -= enemy.price;

      io.to(gameId).emit('update', {
        boughtEnemies: game.boughtEnemies,
        player1: game.player1,
      });
    }
  });

  socket.on('sell_turret', (id) => {
    const game = games[gameId];

    const idx = game.turrets.findIndex((turret) => turret.id === id);

    if (idx !== -1) {
      game.player2.money += game.turrets[idx].sellPrice;

      game.turrets.splice(idx, 1);

      io.to(gameId).emit('update', {
        turrets: game.turrets,
        player2: game.player2,
      });
    }
  });

  socket.on('disconnect', () => {
    let gameId;

    Object.keys(games).forEach((id) => {
      const game = games[id];
      if (
        game &&
        (game.player1.id === socket.id ||
          (game.player2 && game.player2.id === socket.id))
      ) {
        gameId = id;
      }
    });

    if (gameId) {
      games[gameId] = null;
      io.to(gameId).emit('terminated');
    }
  });
});

server.listen(4000);

function getEnemyOffsetX(enemy) {
  return enemy.nextSegment[0] * 50 + 0.5 * 50;
}

function getEnemyOffsetY(enemy) {
  return enemy.nextSegment[1] * 50 + 0.5 * 50;
}

function generateWave(lastNumber = 0) {
  const number = lastNumber + 1;

  return {
    number,
    total: 0,
    killed: 0,
    missed: 0,
    inProgress: false,
    finishedAt: null,
  };
}
