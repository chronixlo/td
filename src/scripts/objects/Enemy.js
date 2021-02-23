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
    this.cellOffsetX = options.cellOffsetX || 0.5;
    this.cellOffsetY = options.cellOffsetY || 0.5;
    this.money = options.money;
  }
}
