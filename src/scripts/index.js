import { io } from 'socket.io-client';
import '../styles/index.scss';
import Game from './Game';
import { Enemy } from './objects/Enemy';
import { Turret } from './objects/Turret';
import { Projectile } from './objects/Projectile';
import generatePath from './functions/generatePath';
import generateTurrets from './functions/generateTurrets';
import generateEnemies from './functions/generateEnemies';

// const game = new Game();

export const socket = io('http://localhost:4000');

const menu = document.getElementById('menu');
const createGame = document.getElementById('create-game');
const loader = document.getElementById('loader');
const container = document.getElementById('container');
loader.classList.add('hide');
setTimeout(() => {
  loader.remove();
}, 300);

let game;

createGame.addEventListener('click', () => {
  const gridWidth = 16;
  const gridHeight = 8;
  socket.emit('create_game', {
    gridWidth,
    gridHeight,
    path: generatePath(gridWidth, gridHeight, (gridWidth * gridHeight) / 2),
    turretTypes: generateTurrets(),
    enemyTypes: generateEnemies(),
  });
});

socket.on('connect', (e) => {
  const gameId = location.search.slice(1);
  if (gameId) {
    socket.emit('join_game', { gameId });
  }
});

socket.on('join', (gameInfo, isAttacker) => {
  game = new Game(gameInfo, isAttacker);
  if (!gameInfo.player2) {
    game.status = 'WAITING_OPPONENT';
  }
  menu.classList.add('hidden');
  container.classList.remove('hidden');
  history.replaceState(null, null, '/?' + gameInfo.gameId);
});

socket.on('player_join', (e) => {
  game.status = null;
});

socket.on('terminated', (e) => {
  game.status = 'TERMINATED';
});

socket.on('not_found', (e) => {
  history.replaceState(null, null, '/');
});

socket.on('update', (e) => {
  if (e.enemies) {
    game.enemies = e.enemies.map((enemy) => new Enemy(enemy));
  }
  if (e.projectiles) {
    game.projectiles = e.projectiles.map(
      (projectile) => new Projectile(projectile)
    );
  }
  if (e.missed) {
    game.missed = e.missed;
  }

  if (e.wave) {
    game.wave = e.wave;
  }

  if (e.boughtEnemies) {
    game.boughtEnemies = e.boughtEnemies;
  }

  if (e.turrets) {
    game.turrets = e.turrets.map((turret) => new Turret(turret));
  }

  if (e.player1) {
    game.player1 = e.player1;
  }

  if (e.player2) {
    game.player2 = e.player2;
  }
});
