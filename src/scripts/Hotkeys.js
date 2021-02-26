import Game from './Game';

export const TURRET_BINDS = ['q', 'w', 'e', 'a', 's', 'd'];

class Hotkeys {
  constructor() {
    this.keys = {
      Delete: () => Game.sellSelectedTurret(),
    };

    TURRET_BINDS.forEach((bind, idx) => {
      this.keys[bind] = () => Game.placeTurret(Game.turretTypes[idx]);
    });

    document.addEventListener('keyup', this.onKeyPress.bind(this));
  }

  onKeyPress(e) {
    this.keys[e.key] && this.keys[e.key]();
  }
}

export default new Hotkeys();
