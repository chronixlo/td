import { socket } from '.';
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
    this.buyButton = document.getElementById('buy-button');
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
        const enemyButton = document.createElement('div');
        enemyButton.classList.add('button', 'turret-button');

        enemyButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.game.placeEnemy(enemy);
        });

        this.turrets.appendChild(enemyButton);

        const buttonCanvas = document.createElement('canvas');
        enemyButton.appendChild(buttonCanvas);
        buttonCanvas.width = buttonCanvas.height = this.turretButtonSize;

        const ctx = buttonCanvas.getContext('2d');
        ctx.fillStyle = enemy.color;
        ctx.fillRect(
          this.turretButtonSize / 2 - enemy.size / 2,
          this.turretButtonSize / 2 - enemy.size / 2,
          enemy.size,
          enemy.size
        );

        const priceLabel = document.createElement('span');
        priceLabel.classList.add('price-label');
        priceLabel.textContent = '$' + enemy.price;
        enemyButton.appendChild(priceLabel);

        const hotkeyLabel = document.createElement('span');
        hotkeyLabel.classList.add('hotkey-label');
        hotkeyLabel.textContent = TURRET_BINDS[idx];
        enemyButton.appendChild(hotkeyLabel);

        this.turretButtons.push({
          object: enemy,
          element: enemyButton,
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
          object: turret,
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
      this.game.placeEnemy(null);
    });

    this.sellTurret.addEventListener('click', (e) => {
      e.stopPropagation();
      this.game.sellSelectedObject();
    });

    this.buyButton.addEventListener('click', (e) => {
      e.stopPropagation();
      socket.emit('place_enemy', this.game.placingEnemy.typeId);
    });

    document.addEventListener('click', () => {
      this.game.placeTurret(null);
      this.game.placeEnemy(null);
    });

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.game.placeTurret(null);
      this.game.placeEnemy(null);
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
    this.onChange(
      [
        this.game.player1 && this.game.player1.money,
        this.game.player2 && this.game.player2.money,
        this.turretButtons.length,
      ],
      () => {
        this.money.textContent =
          '$' +
          (this.game.isAttacker
            ? this.game.player1.money
            : this.game.player2.money);

        this.turretButtons.forEach((button) => {
          if (
            button.object.price >
            (this.game.isAttacker
              ? this.game.player1.money
              : this.game.player2.money)
          ) {
            button.element.classList.add('disabled');
          } else {
            button.element.classList.remove('disabled');
          }
        });
      }
    );
    this.onChange(
      [
        this.game.selectedTurret && this.game.selectedTurret.id,
        this.game.placingTurret && this.game.placingTurret.typeId,
        this.game.selectedEnemy && this.game.selectedEnemy.id,
        this.game.placingEnemy && this.game.placingEnemy.typeId,
      ],
      () => {
        const turret = this.game.selectedTurret || this.game.placingTurret;
        const enemy = this.game.selectedEnemy || this.game.placingEnemy;
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
          if (this.game.selectedTurret && !this.game.isAttacker) {
            this.sellTurret.textContent = `Sell $${turret.sellPrice}`;
            this.sellTurret.classList.add('visible');
          } else {
            this.sellTurret.classList.remove('visible');
          }
          return;
        } else if (enemy) {
          const visibleProps = ['health', 'speed'];
          this.turretInfo.textContent = visibleProps
            .map((prop) => prop + ': ' + Math.round(enemy[prop]))
            .join('\n');
          if (this.game.selectedEnemy) {
            this.sellTurret.textContent = `Sell $${enemy.sellPrice}`;
            this.sellTurret.classList.add('visible');
            this.buyButton.classList.remove('visible');
          } else {
            this.sellTurret.classList.remove('visible');
            this.buyButton.textContent = `Buy $${enemy.price}`;
            this.buyButton.classList.add('visible');
          }
          return;
        }

        this.sellTurret.classList.remove('visible');
        this.buyButton.classList.remove('visible');
        this.turretInfo.textContent = '';
      }
    );
    this.onChange(
      [
        this.game.placingEnemy && this.game.placingEnemy.typeId,
        this.game.player1 && this.game.player1.money,
      ],
      () => {
        if (this.game.placingEnemy && this.game.player1) {
          if (this.game.placingEnemy.price > this.game.player1.money) {
            this.buyButton.classList.add('disabled');
          } else {
            this.buyButton.classList.remove('disabled');
          }
        }
      }
    );
    this.onChange(
      [
        this.game.placingTurret && this.game.placingTurret.typeId,
        this.game.placingEnemy && this.game.placingEnemy.typeId,
      ],
      () => {
        this.turretButtons.forEach((button) => {
          if (
            (this.game.placingTurret &&
              this.game.placingTurret.typeId === button.object.typeId) ||
            (this.game.placingEnemy &&
              this.game.placingEnemy.typeId === button.object.typeId)
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
