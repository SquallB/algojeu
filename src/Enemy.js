Enemy = function(game, posX, posY, spriteName, weapon, speed, life) {
	Phaser.Sprite.call(this, game, posX, posY, spriteName);

	this.weapon = weapon;
	this.speed = speed || 0;
	this.life = life || 1;
	this.firingTimer = 0;
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;