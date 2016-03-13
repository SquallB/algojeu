var Player = function(game, posX, posY, weapon, life, shield, speed) {
  Phaser.Sprite.call(this, game, posX, posY, 'ship');

  this.weapon = weapon;
  this.life = life || 100;
  this.shield = shield || 0;
  this.speed = speed || 300;
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.setLife = function(life) {
  this.life = life;
};

Player.prototype.setShield = function(shield) {
  this.shield = shield;
};

Player.prototype.setSpeed = function(speed) {
  this.speed = speed;
};

Player.prototype.setWeapon = function(weapon) {
  this.weapon = weapon;
};

Player.prototype.loseShield = function() {
  this.shield = 0;
};

Player.prototype.getLife = function() {
  return this.life;
};

Player.prototype.getShield = function() {
  return this.shield;
};

Player.prototype.getSpeed = function() {
  return this.speed;
};

Player.prototype.hasShield = function() {
  return this.shield > 0;
};

Player.prototype.getWeapon = function() {
  return this.weapon;
}