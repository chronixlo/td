export class Projectile {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.speed = options.speed;
    this.damage = options.damage;
    this.enemyIndex = options.enemyIndex;
    this.size = options.size;
  }
}
