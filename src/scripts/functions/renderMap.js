import Game from '../Game';

export default function renderMap() {
  const {
    ctx,
    gameWidth,
    gameHeight,
    cellSize,
    path,
    gridWidth,
    gridHeight,
  } = Game;

  // background
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  // path outer
  path.forEach((segment) => {
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
  path.forEach((segment, idx) => {
    if (idx < 1 || idx > path.length - 1) {
      return;
    }
    const prev = path[idx - 1];
    const x1 = Math.min(segment[0], prev[0]) * cellSize + pathPadding;
    const x2 = Math.max(segment[0], prev[0]) * cellSize - pathPadding;
    const y1 = Math.min(segment[1], prev[1]) * cellSize + pathPadding;
    const y2 = Math.max(segment[1], prev[1]) * cellSize - pathPadding;

    ctx.fillStyle = '#666';
    ctx.fillRect(x1, y1, x2 - x1 + cellSize, y2 - y1 + cellSize);
  });

  // spawn
  const spawnX = path[0][0] * cellSize + cellSize / 2;
  const spawnY = path[0][1] * cellSize + cellSize / 2;
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
  const endX = path[path.length - 1][0] * cellSize + cellSize / 2;
  const endY = path[path.length - 1][1] * cellSize + cellSize / 2;
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
}
