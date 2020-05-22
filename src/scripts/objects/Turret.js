export class Turret {
  constructor(options) {
    this.gridX = options.gridX;
    this.gridY = options.gridY;
    // cells
    this.radius = options.radius;
    // timestamp
    this.lastShot = options.lastShot;
    this.shotInterval = options.shotInterval;
    // pixels per second
    this.projectileSpeed = options.projectileSpeed;
    this.projectileDamage = options.projectileDamage;
  }
}
