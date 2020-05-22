export class Enemy {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    // pixels per second
    this.speed = options.speed;
    this.size = options.size;
    this.health = options.health;
  }
}
