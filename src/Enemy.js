Enemy = function(game, posX, posY, spriteName, speed, life, bulletSpeed, bulletDamage) {
	Phaser.Sprite.call(this, game, posX, posY, spriteName);

	this.speed = speed || 0;
	this.life = life || 0;
	this.bulletSpeed = bulletSpeed || 0;
	this.bulletDamage = bulletDamage || 0;
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;