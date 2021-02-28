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
  menu.classList.add('hidden');
  container.classList.remove('hidden');
  history.replaceState(null, null, '/?' + gameInfo.gameId);
});

socket.on('player_join', (e) => {
  console.log(e);
});

socket.on('not_found', (e) => {
  history.replaceState(null, null, '/');
});

socket.on('update', (e) => {
  game.enemies = e.enemies.map((enemy) => new Enemy(enemy));
  game.projectiles = e.projectiles.map(
    (projectile) => new Projectile(projectile)
  );
  game.missed = e.missed;
});

socket.on('update_turrets', (e) => {
  game.turrets = e.turrets.map((turret) => new Turret(turret));
});
