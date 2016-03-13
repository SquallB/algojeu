
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('starfield', 'assets/starfield.png');
    game.load.image('ship', 'assets/thrust_ship.png');
    game.load.image('bullet', 'assets/bullet0.png');
    game.load.image('invader', 'assets/invader.png');
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
    game.load.image('TokenLife', 'assets/life.png');
    game.load.image('TokenHealth', 'assets/health.png');
    game.load.image('TokenShield', 'assets/shield.png');
    game.load.image('TokenWeapon', 'assets/weapon.png');

}

var ship;
var cursors;
var bullet;
var background;
var weapon;
var ennemies;
var lifeBar;

function create() {

    game.world.setBounds(0, 0, 800, 600);

    background = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    ship = game.add.sprite(200, 200, 'ship');
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.collideWorldBounds = true;

    lifeBar = new LifeBar(game);
    lifeBar.display();

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    weapon = new Weapon.SingleBullet(this.game);

    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;



    for (var i = 0; i < 20; i++)
    {
        var invader = new Enemy.Invader(game, 0, 0);
        enemies.add(invader);
        invader.reset(1200, 10 + i * 50)
        invader.body.velocity.set(-invader.speed, 0);

    }

    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);


}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function update() {

    background.tilePosition.x -= 2;

    //game.camera.x += 1;
    game.physics.arcade.overlap(ship, enemies, shipCollisionHandler, null, this);
    game.physics.arcade.overlap(weapon, enemies, bulletsCollisionHandler, null, this);

    ship.body.velocity.set(0);

    if (cursors.left.isDown)
    {
        ship.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        ship.body.velocity.x = 300;
    }

    if (cursors.up.isDown)
    {
        ship.body.velocity.y = -300;
    }
    else if (cursors.down.isDown)
    {
        ship.body.velocity.y = 300;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        weapon.fire(ship);
    }

    enemies.forEachAlive(function(enemy){
        enemy.weapon.fire(enemy);
        game.physics.arcade.overlap(enemy.weapon, ship, shipCollisionHandler, null, this);
    });
}

function render() {



}

//  Called if the bullet hits one of the enemies sprites
function bulletsCollisionHandler(bullet, enemy) {
    bullet.kill();

    enemy.life -= bullet.damage;

    if(enemy.life <= 0) {

        var explosion = explosions.getFirstExists(false);
        explosion.reset(enemy.body.x, enemy.body.y);
        explosion.play('kaboom', 30, false, true);


        enemy.kill();
    }
}

function shipCollisionHandler(ship, enemy) {
    lifeBar.cropLife(enemy.damage);
    var explosion = explosions.getFirstExists(false);
    explosion.reset(enemy.body.x, enemy.body.y);
    explosion.play('kaboom', 30, false, true);
    enemy.kill();
}
