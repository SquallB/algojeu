var EnemyWeapon = {};

////////////////////////////////////////////////////
//  A single bullet is fired in front of the ship //
////////////////////////////////////////////////////

EnemyWeapon.SingleBullet = function (game) {

    Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 2000;

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'bullet'), true);
    }

    return this;

};

EnemyWeapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
EnemyWeapon.SingleBullet.prototype.constructor = EnemyWeapon.SingleBullet;

EnemyWeapon.SingleBullet.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x - 15;
    var y = source.y - 15;

    this.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};