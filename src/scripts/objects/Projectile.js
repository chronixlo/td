export class Projectile {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.speed = options.speed;
    this.damage = options.damage;
    this.enemy = options.enemy;
    this.size = options.size;
    this.color = options.color;
  }

  update(deltaSeconds) {
    const enemy = this.enemy;

    const deltaX = enemy.x - this.x;
    const deltaY = enemy.y - this.y;
    const angle = Math.atan2(deltaY, deltaX);
    const deltaDistance = Math.hypot(deltaX, deltaY);

    const distance = Math.min(deltaDistance, this.speed * deltaSeconds);

    this.x = Math.cos(angle) * distance + this.x;
    this.y = Math.sin(angle) * distance + this.y;
  }

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
