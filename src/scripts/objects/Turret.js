let ID = 0;

export class Turret {
  constructor(options) {
    this.id = ++ID;
    this.typeId = options.typeId;
    this.gridX = options.gridX;
    this.gridY = options.gridY;
    // cells
    this.radius = options.radius;
    // timestamp
    this.lastShot = options.lastShot || 0;
    this.shotInterval = options.shotInterval;
    // pixels per second
    this.projectileSpeed = options.projectileSpeed;
    this.projectileDamage = options.projectileDamage;
    this.projectileSize = options.projectileSize;
    this.projectileColor = options.projectileColor || '#f00';
    this.color = options.color || '#fff';
    this.size = options.size || 10;
    this.sellPrice = Math.floor(options.price / 10);
  }
}
