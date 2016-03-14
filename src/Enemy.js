var Enemy = {};

Enemy.Invader = function(game, posX, posY, life, speed, type, weapon) {
  Phaser.Sprite.call(this, game, posX, posY, type);


  this.weapon = createWeapon(weapon, this.game, false);

  this.speed = speed;
  this.life = life;
  this.firingTimer = 0;
  this.damage = 20;

  this.exists = true;
  this.visible = true;
}

Enemy.Invader.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.Invader.prototype.constructor = Enemy.Invader;
