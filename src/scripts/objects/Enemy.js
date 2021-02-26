export class Enemy {
  constructor(options) {
    // center
    this.x = options.x;
    this.y = options.y;
    // pixels per second
    this.speed = options.speed;
    this.size = options.size;
    this.health = options.health;
    this.lastSegment = null;
    this.nextSegment = null;
    this.lastSegmentIndex = null;
    // this is busted
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
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}
