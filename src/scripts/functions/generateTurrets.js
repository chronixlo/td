import { color, rand } from './helpers';

let ID = 1;

export default function generateTurrets() {
  return new Array(6)
    .fill()
    .map((_, idx) => generateTurret(10 + idx * 10))
    .sort((a, b) => a.price - b.price);
}

export function generateTurret(level) {
  const rangeScale = rand(2, 8) / 10;
  const projectileSpeed = 200 + 200 * (1 - rangeScale);

  const powerScale = 1 + (level - 10) / 50;
  const price = level * powerScale * 5;
  const damageScale = rand(2, 8) / 10;
  const speed = 1 * damageScale;
  const shotInterval = speed * 1000;
  const dps = 10 * powerScale;
  const damage = dps * speed;

  return {
    typeId: ++ID,
    price,
    sellPrice: Math.round(price / 10),
    radius: 1 + 4 * rangeScale,
    color: color(),
    size: 10 + 10 * rangeScale,
    shotInterval,
    projectileSpeed,
    projectileDamage: damage,
    projectileSize: 3 + damage / 3,
    projectileColor: color(),
    dps,
    lastShot: 0,
  };
}
