
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('starfield', 'assets/starfield.png');
    game.load.image('ship', 'assets/thrust_ship.png');
    game.load.image('bullet', 'assets/bullet0.png');
    game.load.image('invader', 'assets/invader.png');
}

var ship;
var cursors;
var bullets;
var bulletTime = 0;
var bullet;
var background;
var weapon;

function create() {

    game.world.setBounds(0, 0, 800, 600);

    background = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    ship = game.add.sprite(200, 200, 'ship');
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.collideWorldBounds = true;

    this.lifeBar = new LifeBar(game);
    this.lifeBar.display();

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    weapon = new Weapon.SingleBullet(this.game);

    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++)
    {
        var invader = new Enemy(game, 0, 0, 'invader', 200, 3, 300, 1);
        enemies.add(invader);
        invader.name = 'invader' + i;
        invader.exists = false;
        invader.visible = false;
        invader.reset(1900, 50 + i * 50);
        invader.body.velocity.x = -invader.speed;
        invader.body.velocity.y = 0;
    }
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
}

function render() {

    

}

//  Called if the bullet hits one of the enemies sprites
function bulletsCollisionHandler (bullet, enemy) {
    bullet.kill();

    enemy.life -= bullet.damage;

    if(enemy.life <= 0) {
        enemy.kill();
    }
}

function shipCollisionHandler (ship, enemy) {
    this.lifeBar.cropLife(20);
    enemy.kill();
}