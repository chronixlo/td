import Game from './Game';

class Toolbar {
  constructor() {
    this.toolbar = document.getElementById('toolbar');
    this.turrets = document.getElementById('turrets');
    this.sendWaveButton = document.getElementById('send-wave');
    this.game = Game;

    this.state = 'BUILD';

    this.render();
  }

  render() {
    if (this.state === 'BUILD') {
      this.toolbar.classList.add('visible');
      const turretButton = document.createElement('button');
      turretButton.textContent = '+';
      turretButton.addEventListener('click', () => {
        this.game.placeTurret({
          radius: 3,
          lastShot: 0,
          shotInterval: 500,
          projectileSpeed: 200,
          projectileDamage: 10,
          projectileSize: 5,
          color: '#00f',
        });
      });
      this.turrets.appendChild(turretButton);

      this.sendWaveButton.addEventListener('click', () => {
        this.game.sendWave();
      });
    }
  }
}

export default new Toolbar();
