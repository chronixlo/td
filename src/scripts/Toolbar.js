import { TURRET_BINDS } from './Hotkeys';

class Toolbar {
  constructor(game) {
    this.game = game;
    this.toolbar = document.getElementById('toolbar');
    this.turrets = document.getElementById('turrets');
    this.readyButton = document.getElementById('ready-button');
    this.waveNumber = document.getElementById('wave-number');
    this.money = document.getElementById('money');
    this.turretInfo = document.getElementById('turret-info');
    this.sellTurret = document.getElementById('sell-turret');
    this.autorun = document.getElementById('autorun');
    this.status = document.getElementById('status');

    this.turretButtons = [];
    this.turretButtonSize = 70;

    this.lastValues = {};

    this.init();

    this.render = this.render.bind(this);

    requestAnimationFrame(this.render);
  }

  init() {
    if (this.game.isAttacker) {
      this.game.enemyTypes.forEach((enemy, idx) => {
        const turretButton = document.createElement('div');
        turretButton.classList.add('button', 'turret-button');

        turretButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.game.placeTurret(turret);
        });

        this.turrets.appendChild(turretButton);

        const buttonCanvas = document.createElement('canvas');
        turretButton.appendChild(buttonCanvas);
        buttonCanvas.width = buttonCanvas.height = this.turretButtonSize;

        const ctx = buttonCanvas.getContext('2d');
        ctx.fillStyle = turret.color;
        ctx.beginPath();
        ctx.arc(
          this.turretButtonSize / 2,
          this.turretButtonSize / 2,
          turret.size,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = turret.projectileColor;
        ctx.beginPath();
        ctx.arc(
          this.turretButtonSize / 2 + turret.size + turret.projectileSize / 2,
          this.turretButtonSize / 2 - turret.size - turret.projectileSize / 2,
          turret.projectileSize,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.closePath();

        const priceLabel = document.createElement('span');
        priceLabel.classList.add('price-label');
        priceLabel.textContent = '$' + turret.price;
        turretButton.appendChild(priceLabel);

        const hotkeyLabel = document.createElement('span');
        hotkeyLabel.classList.add('hotkey-label');
        hotkeyLabel.textContent = TURRET_BINDS[idx];
        turretButton.appendChild(hotkeyLabel);

        this.turretButtons.push({
          turret,
          element: turretButton,
        });
      });
    } else {
      this.game.turretTypes.forEach((turret, idx) => {
        const turretButton = document.createElement('div');
        turretButton.classList.add('button', 'turret-button');

        turretButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.game.placeTurret(turret);
        });

        this.turrets.appendChild(turretButton);

        const buttonCanvas = document.createElement('canvas');
        turretButton.appendChild(buttonCanvas);
        buttonCanvas.width = buttonCanvas.height = this.turretButtonSize;

        const ctx = buttonCanvas.getContext('2d');
        ctx.fillStyle = turret.color;
        ctx.beginPath();
        ctx.arc(
          this.turretButtonSize / 2,
          this.turretButtonSize / 2,
          turret.size,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = turret.projectileColor;
        ctx.beginPath();
        ctx.arc(
          this.turretButtonSize / 2 + turret.size + turret.projectileSize / 2,
          this.turretButtonSize / 2 - turret.size - turret.projectileSize / 2,
          turret.projectileSize,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.closePath();

        const priceLabel = document.createElement('span');
        priceLabel.classList.add('price-label');
        priceLabel.textContent = '$' + turret.price;
        turretButton.appendChild(priceLabel);

        const hotkeyLabel = document.createElement('span');
        hotkeyLabel.classList.add('hotkey-label');
        hotkeyLabel.textContent = TURRET_BINDS[idx];
        turretButton.appendChild(hotkeyLabel);

        this.turretButtons.push({
          turret,
          element: turretButton,
        });
      });
    }

    this.autorun.addEventListener('change', (e) => {
      this.game.autorun = e.target.checked;
    });

    this.readyButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.game.sendWave();
      this.game.placeTurret(null);
    });

    this.sellTurret.addEventListener('click', (e) => {
      e.stopPropagation();
      this.game.sellSelectedTurret();
    });

    document.addEventListener('click', () => {
      this.game.placeTurret(null);
    });

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.game.placeTurret(null);
    });
  }

  render() {
    this.callOrder = 0;

    this.onChange([this.game.status], () => {
      this.status.textContent = this.game.status;
    });
    this.onChange([this.game.autorun], () => {
      this.autorun.checked = this.game.autorun;
    });
    this.onChange([this.game.wave.inProgress], () => {
      if (this.game.wave.inProgress) {
        this.readyButton.classList.add('disabled');
      } else {
        this.readyButton.classList.remove('disabled');
      }
    });
    this.onChange([this.game.wave.number], () => {
      this.waveNumber.textContent = 'Wave ' + this.game.wave.number;
    });
    this.onChange([this.game.money, this.turretButtons.length], () => {
      this.money.textContent = '$' + this.game.money;

      this.turretButtons.forEach((button) => {
        if (button.turret.price > this.game.money) {
          button.element.classList.add('disabled');
        } else {
          button.element.classList.remove('disabled');
        }
      });
    });
    this.onChange(
      [
        this.game.selectedTurret && this.game.selectedTurret.id,
        this.game.placingTurret && this.game.placingTurret.typeId,
      ],
      () => {
        const turret = this.game.selectedTurret || this.game.placingTurret;
        if (turret) {
          const visibleProps = [
            'dps',
            'radius',
            'shotInterval',
            'projectileSpeed',
            'projectileDamage',
          ];
          this.turretInfo.textContent = visibleProps
            .map((prop) => prop + ': ' + Math.round(turret[prop]))
            .join('\n');
          if (this.game.selectedTurret) {
            this.sellTurret.textContent = `Sell $${turret.sellPrice}`;
            this.sellTurret.classList.add('visible');
          } else {
            this.sellTurret.classList.remove('visible');
          }
          return;
        }

        this.sellTurret.classList.remove('visible');
        this.turretInfo.textContent = '';
      }
    );
    this.onChange(
      [this.game.placingTurret && this.game.placingTurret.typeId],
      () => {
        this.turretButtons.forEach((button) => {
          if (
            this.game.placingTurret &&
            this.game.placingTurret.typeId === button.turret.typeId
          ) {
            button.element.classList.add('selected');
          } else {
            button.element.classList.remove('selected');
          }
        });
      }
    );

    requestAnimationFrame(this.render);
  }

  onChange(conditions, callback) {
    const callOrder = this.callOrder++;

    for (let idx in conditions) {
      if (
        !this.lastValues[callOrder] ||
        this.lastValues[callOrder][idx] !== conditions[idx]
      ) {
        // console.log('update!', callOrder);
        callback();
        break;
      }
    }

    this.lastValues[callOrder] = conditions;
  }
}

export default Toolbar;
