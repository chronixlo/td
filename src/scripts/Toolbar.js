import Game from './Game';

class Toolbar {
  constructor() {
    this.toolbar = document.getElementById('toolbar');
    this.turrets = document.getElementById('turrets');
    this.readyButton = document.getElementById('ready-button');
    this.waveNumber = document.getElementById('wave-number');
    this.money = document.getElementById('money');
    this.turretInfo = document.getElementById('turret-info');

    this.turretButtons = [];
    this.turretButtonSize = 50;

    this.lastValues = {};

    this.init();

    this.render = this.render.bind(this);

    requestAnimationFrame(this.render);
  }

  init() {
    this.turrets.innerHTML = '';
    Game.turretTypes.forEach((turret) => {
      const turretButton = document.createElement('div');
      turretButton.classList.add('button', 'turret-button');

      turretButton.addEventListener('click', () => {
        if (Game.placingTurret && Game.placingTurret.typeId === turret.typeId) {
          Game.placeTurret(null);
          return;
        }
        Game.placeTurret(turret);
      });
      turretButton.addEventListener('mouseenter', () => {
        this.showTurretInfo = turret;
      });
      turretButton.addEventListener('mouseleave', () => {
        this.showTurretInfo = null;
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
      priceLabel.textContent = '$ ' + turret.price;
      turretButton.appendChild(priceLabel);

      this.turretButtons.push({
        turret,
        element: turretButton,
      });
    });

    this.readyButton.addEventListener('click', () => {
      Game.sendWave();
    });
  }

  render() {
    this.callOrder = 0;

    this.onChange([Game.wave.inProgress], () => {
      if (Game.wave.inProgress) {
        this.readyButton.classList.add('disabled');
      } else {
        this.readyButton.classList.remove('disabled');
      }
    });
    this.onChange([Game.wave.number], () => {
      this.waveNumber.textContent = 'Wave ' + Game.wave.number;
    });
    this.onChange([Game.money, this.turretButtons.length], () => {
      this.money.textContent = '$ ' + Game.money;

      this.turretButtons.forEach((button) => {
        if (button.turret.price > Game.money) {
          button.element.classList.add('disabled');
        } else {
          button.element.classList.remove('disabled');
        }
      });
    });
    this.onChange(
      [
        Game.selectedTurret && Game.selectedTurret.id,
        Game.placingTurret && Game.placingTurret.typeId,
      ],
      () => {
        if (Game.selectedTurret || Game.placingTurret) {
          this.turretInfo.textContent = JSON.stringify(
            Game.selectedTurret || Game.placingTurret
          )
            .slice(1, -1)
            .split(',')
            .join('\n');
          return;
        }

        this.turretInfo.textContent = '';
      }
    );
    this.onChange([Game.placingTurret && Game.placingTurret.typeId], () => {
      this.turretButtons.forEach((button) => {
        if (
          Game.placingTurret &&
          Game.placingTurret.typeId === button.turret.typeId
        ) {
          button.element.classList.add('selected');
        } else {
          button.element.classList.remove('selected');
        }
      });
    });

    requestAnimationFrame(this.render);
  }

  onChange(conditions, callback) {
    const callOrder = this.callOrder++;

    for (let idx in conditions) {
      if (
        !this.lastValues[callOrder] ||
        this.lastValues[callOrder][idx] !== conditions[idx]
      ) {
        console.log('update!', callOrder);
        callback();
        break;
      }
    }

    this.lastValues[callOrder] = conditions;
  }
}

export default new Toolbar();
