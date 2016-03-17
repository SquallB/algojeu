var Player = function(game, posX, posY, weapon, lives, life, shield, speed) {
  Phaser.Sprite.call(this, game, posX, posY, 'ship');
  //Le joueur a une arme
  this.weapon = weapon;
  //une barre de vie/santé/bouclier
  this.lifeBar = new LifeBar(game, lives, life);
  //un bouclier
  this.lifeBar.shield = shield || 0;
  //une vitesse
  this.speed = speed || 500;
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.addLife = function() {
  this.lifeBar.addLife();
}

Player.prototype.setLife = function(life) {
  this.lifeBar.setValue(life);
};

Player.prototype.setShield = function(shield) {
  this.lifeBar.shield = shield;
};

Player.prototype.setSpeed = function(speed) {
  this.speed = speed;
};

Player.prototype.setWeapon = function(weapon) {
  this.weapon = weapon;
};

Player.prototype.loseLife = function() {
  this.lifeBar.shield = 0;
};

Player.prototype.getLife = function() {
  return this.lifeBar.value;
};

Player.prototype.getShield = function() {
  return this.lifeBar.shield;
};

Player.prototype.getSpeed = function() {
  return this.speed;
};

Player.prototype.hasShield = function() {
  return this.lifeBar.shield > 0;
};

Player.prototype.getWeapon = function() {
  return this.weapon;
}

Player.prototype.update = function() {
  this.lifeBar.view.update(this.lifeBar);
}