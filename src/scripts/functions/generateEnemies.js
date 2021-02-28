import { color, rand } from './helpers';

let ID = 1;

const RENDERERS = [
  null,
  function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );

    ctx.fillStyle = this.accentColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  },
  function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  },
];

export default function generateEnemies() {
  return new Array(6).fill().map((_, idx) => generateEnemy((idx + 1) * 10));
}

export function generateEnemy(level) {
  const powerScale = 1 + (level - 10) / 50;
  const healthScale = rand(2, 8) / 10;
  const speed = 50 + 100 * powerScale * (1 - healthScale);
  const health = 10 * Math.pow(powerScale, 4) * healthScale;
  const size = 10 + health / 10;
  const price = level;

  return {
    typeId: ++ID,
    level,
    speed,
    size,
    health,
    money: Math.round(price / 2),
    price,
    color: color(),
    accentColor: '#fffa',
    // render: RENDERERS[rand(0, RENDERERS.length - 1)],
  };
}
