var Player = function(life, shield, fireDammage, fireType, speed) {
  this.life = life;
  if (shield > 0) {
    this.hasShield = true;
  } else {
    this.hasShield = false;
  }
  this.shield = shield;
  this.fireDammage = fireDammage;
  this.fireType = fireType;
  this.speed = speed;
};

Player.prototype.setLife = function(life) {
  this.life = life;
};
Player.prototype.setShield = function(shield) {
  this.hasShield = true;
  this.shield = shield;
};

Player.prototype.setSpeed = function(speed) {
  this.speed = speed;
};

Player.prototype.setFireDammage = function(fireDammage) {
  this.fireDammage = fireDammage;
};

Player.prototype.setFireType = function(fireType) {
  this.fireType = fireType;
};

Player.prototype.loseShield = function() {
  this.hasShield = false;
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
  return this.hasShield;
};

Player.prototype.getFireDammage = function() {
  return this.fireDammage;
};

Player.prototype.getFireType = function() {
  return this.fireType;
};
