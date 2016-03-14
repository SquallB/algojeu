var Enemy = {};

Enemy.Invader = function(game, posX, posY, life, speed, type, weapon) {
  Phaser.Sprite.call(this, game, posX, posY, type);


  this.weapon = createWeapon(weapon, this.game, false);

  this.speed = speed;
  this.life = life;
  this.firingTimer = 0;
  this.damage = 20;

  this.exists = false;
  this.visible = false;
  this.firstAppreance = true;
}

Enemy.Invader.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.Invader.prototype.constructor = Enemy.Invader;

Enemy.Invader.prototype.start = function() {

  var launchEnemie = function(){
    this.exists = true;
    this.visible = true;
  };
  this.game.time.events.add(Phaser.Timer.SECOND * 2, launchEnemie, this);

};
Enemy.Invader.prototype.firstAppear = function() {

  var setFirstAppear = function(){
    this.firstAppreance = false;
  }
  if (this.firstAppear) {
    this.game.time.events.add(Phaser.Timer.SECOND * 1, setFirstAppear, this);
  }
}
