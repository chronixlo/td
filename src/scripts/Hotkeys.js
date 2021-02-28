export const TURRET_BINDS = ['q', 'w', 'e', 'a', 's', 'd'];

class Hotkeys {
  constructor(game) {
    this.game = game;
    this.keys = {
      Delete: () => this.game.sellSelectedTurret(),
    };

    TURRET_BINDS.forEach((bind, idx) => {
      this.keys[bind] = () => this.game.placeTurret(this.game.turretTypes[idx]);
    });

    document.addEventListener('keyup', this.onKeyPress.bind(this));
  }

  onKeyPress(e) {
    this.keys[e.key] && this.keys[e.key]();
  }
}

export default Hotkeys;
