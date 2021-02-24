export class Projectile {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.speed = options.speed;
    this.damage = options.damage;
    this.enemyIndex = options.enemyIndex;
    this.size = options.size;
    this.color = options.color;
  }

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
