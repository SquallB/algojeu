var Enemy = {};

Enemy.Invader = function(game, posX, posY, life, speed, type, weapon) {
  Phaser.Sprite.call(this, game, posX, posY, type);

  //On crée l'arme de l'ennemi
  this.weapon = createWeapon(weapon, this.game, false);

  this.speed = speed;
  this.life = life;
  this.firingTimer = 0;
  this.damage = life * 5;

  this.exists = false;
  this.visible = false;
  //Booléen pour créer un timer de 1 sec entre son apparition et le début des tirs
  this.firstAppreance = true;
}

Enemy.Invader.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.Invader.prototype.constructor = Enemy.Invader;

Enemy.Invader.prototype.start = function() {

  var launchEnemie = function(){
    //On rend l'ennemi visible et existant
    this.exists = true;
    this.visible = true;
  };
  //On crée un timer de 2sec avant de le faire apparaitre
  this.game.time.events.add(Phaser.Timer.SECOND * 2, launchEnemie, this);

};
Enemy.Invader.prototype.firstAppear = function() {

  var setFirstAppear = function(){
    this.firstAppreance = false;
  }
  if (this.firstAppear) {
    //On créer un timer d'une seconde pour différer les tirs à l'apparition de l'ennemi
    this.game.time.events.add(Phaser.Timer.SECOND * 1, setFirstAppear, this);
  }
}
