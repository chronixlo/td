import { color, rand } from './helpers';

let ID = 0;

const RENDERERS = [
  null,
  function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);

    ctx.fillStyle = this.accentColor;
    ctx.beginPath();
    ctx.arc(
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.closePath();
  },
  function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.closePath();
  },
];

export default function generateEnemies() {
  return new Array(6).fill().map((_, idx) => generateEnemy((idx + 1) * 10));
}

export function generateEnemy(level) {
  const healthScale = rand(2, 8) / 10;

  return {
    typeId: ++ID,
    level,
    speed: 100 + (100 + level) * healthScale,
    size: 10 + 20 * healthScale,
    health: level * 5 * healthScale,
    money: level,
    color: color(),
    accentColor: '#fffa',
    render: RENDERERS[rand(0, RENDERERS.length - 1)],
  };
}
