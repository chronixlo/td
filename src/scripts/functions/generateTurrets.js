import { color, rand } from './helpers';

let ID = 0;

export default function generateTurrets() {
  return new Array(6)
    .fill()
    .map((_, idx) => generateTurret(50 + rand(10, 30) * idx * 2))
    .sort((a, b) => a.price - b.price);
}

export function generateTurret(price) {
  return {
    typeId: ++ID,
    price,
    radius: rand(1, 4) * 1.5,
    color: color(),
    size: rand(8, 20),
    shotInterval: rand(10, 100) * 10,
    projectileSpeed: rand(15, 40) * 10,
    projectileDamage: rand(5, 50),
    projectileSize: rand(3, 6),
    projectileColor: color(),
  };
}
