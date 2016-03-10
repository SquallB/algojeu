Enemy = function(_game, _posX, _posY, _spriteName, _speed, _life, _bulletSpeed, _bulletDamage) {
	Phaser.Sprite.call(this, _game, _posX, _posY, _spriteName);

	var speed = _speed || 0;
	var life = _life || 0;
	var bulletSpeed = _bulletSpeed || 0;
	var bulletDamage = _bulletDamage || 0;

	this.getSpeed = function() {
		return speed;
	}

	this.setSpeed = function(_speed) {
		speed = _speed;
	}

	this.getLife = function() {
		return life;
	}

	this.setLife = function(_life) {
		life = _life;
	}

	this.getBulletSpeed = function() {
		return bulletSpeed;
	}

	this.setBulletSpeed = function(_bulletSpeed) {
		bulletSpeed = _bulletSpeed;
	}

	this.getBulletDamage = function() {
		return bulletDamage;
	}

	this.setBulletDamage = function(bulletDamage) {
		bulletDamage = _bulletDamage;
	}
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;