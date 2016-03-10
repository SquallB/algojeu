Invader = function(_game, _posX, _posY, _spriteName, _speed, _life, _bulletSpeed, _bulletDamage) {
	Enemy.call(this, _game, _posX, _posY, _spriteName, _speed, _life, _bulletSpeed, _bulletDamage);
}

Invader.prototype = Object.create(Enemy.prototype);
Invader.prototype.constructor = Invader;