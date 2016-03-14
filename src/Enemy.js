var Enemy = {};

Enemy.Invader = function(game, posX, posY) {
  Phaser.Sprite.call(this, game, posX, posY, 'invader');

<<<<<<< HEAD
  this.weapon = createWeapon("SingleBullet", this.game, false);
=======
  this.weapon = new Weapon.SingleBullet(this.game, -1);
>>>>>>> origin/master
  this.speed = 150;
  this.life = 1;
  this.firingTimer = 0;
  this.damage = 20;

  this.exists = false;
  this.visible = false;
}

Enemy.Invader.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.Invader.prototype.constructor = Enemy.Invader;
