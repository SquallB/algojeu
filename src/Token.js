var Token = {};

///////////////////////////////////////////////
/// TOKEN LIFE -> GIVE +1 LIFE IF LIFE < 3 ////
///////////////////////////////////////////////

Token.Life = function(game, posX, posY) {
  Phaser.Sprite.call(this, game, posX, posY, 'TokenLife');

  this.exists = false;
  this.visible = false;
}

Token.Life.prototype = Object.create(Phaser.Sprite.prototype);
Token.Life.prototype.constructor = Token.Life;

Token.Life.prototype.useToken = function (player){

  if (player.getLife < 3) {
    player.setLife(player.getLife + 1);
  }
};

///////////////////////////////////////////////
///    TOKEN HEALTH -> FILL HEALTH BAR     ////
///////////////////////////////////////////////


Token.Health = function(game, posX, posY) {
  Phaser.Sprite.call(this, game, posX, posY, 'TokenHealth');

  this.exists = false;
  this.visible = false;
}

Token.Health.prototype = Object.create(Phaser.Sprite.prototype);
Token.Health.prototype.constructor = Token.Health;

Token.Health.prototype.useToken = function (player){

if(player.LifeBar == null) {
  console.log("null");
}
  player.setLife(player.LifeBar.getFullHealthValue());

};

///////////////////////////////////////////////
////     TOKEN SHIELD -> GIVE A SHIELD     ////
///////////////////////////////////////////////

Token.Shield = function(game, posX, posY, shield) {
  Phaser.Sprite.call(this, game, posX, posY, 'TokenShield');

  this.shield = shield;
  this.exists = false;
  this.visible = false;
}

Token.Shield.prototype = Object.create(Phaser.Sprite.prototype);
Token.Shield.prototype.constructor = Token.Shield;

Token.Shield.prototype.useToken = function (player){

  player.setShield(player.getShield() + this.shield);

};

///////////////////////////////////////////////
//// TOKEN WEAPON -> CHANGE PLAYER WEAPON  ////
///////////////////////////////////////////////

Token.Weapon = function(game, posX, posY, weapon) {
  Phaser.Sprite.call(this, game, posX, posY, 'TokenWeapon');

  this.weapon = weapon;
  this.exists = false;
  this.visible = false;

}

Token.Weapon.prototype = Object.create(Phaser.Sprite.prototype);
Token.Weapon.prototype.constructor = Token.Weapon;

Token.Weapon.prototype.useToken = function (player){

  var oldWeapon = player.weapon;
  player.weapon = this.weapon;

  var resetWeapon = function(player, oldWeapon){
    player.weapon = oldWeapon
  };
  this.game.time.events.add(Phaser.Timer.SECOND * 6, resetWeapon, this, player, oldWeapon);

};
