export class Enemy {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    // pixels per second
    this.speed = options.speed;
    this.size = options.size;
    this.health = options.health;
    this.lastSegment = null;
    this.nextSegment = null;
    this.lastSegmentIndex = null;
    this.cellOffsetX = options.cellOffsetX || 0.5;
    this.cellOffsetY = options.cellOffsetY || 0.5;
    this.money = options.money;
    this.color = options.color;
    this.accentColor = options.accentColor;
    this.customRender = options.render;
  }

  render(ctx) {
    if (this.customRender) {
      this.customRender(ctx);
      return;
    }
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
