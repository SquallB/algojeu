
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('backdrop', 'TheEnd_by_Iloe_and_Made.jpg');
    game.load.image('ship', 'thrust_ship.png');
    game.load.image('bullet', 'bullet0.png');
    game.load.image('invader', 'invader.png');
}

var ship;
var cursors;
var bullets;
var bulletTime = 0;
var bullet;

function create() {

    game.world.setBounds(0, 0, 1920, 600);

    game.add.sprite(0, 0, 'backdrop');

    ship = game.add.sprite(200, 200, 'ship');
    game.physics.enable(ship, Phaser.Physics.ARCADE);

    game.camera.follow(ship);

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++)
    {
        var bullet = bullets.create(0, 0, 'bullet');
        bullet.name = 'bullet' + i;
        bullet.angle = 90;
        bullet.exists = false;
        bullet.visible = false;
        bullet.checkWorldBounds = true;

    }

    invaders = game.add.group();
    invaders.enableBody = true;
    invaders.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++)
    {
        var invader = invaders.create(0, 0, 'invader');
        invader.name = 'invader' + i;
        invader.exists = false;
        invader.visible = false;
        invader.reset(1900, 50 + i * 50);
        invader.body.velocity.x = -200;
        invader.body.velocity.y = 0;
    }
}

function update() {

    game.physics.arcade.collide(ship, invaders, shipCollisionHandler, null, this);
    game.physics.arcade.collide(bullets, invaders, bulletsCollisionHandler, null, this);

    ship.body.velocity.x = 0;
    ship.body.velocity.y = 0;

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
        fireBullet();
    }
    game.world.wrap(ship, 0, true);
}

function render() {

    game.debug.cameraInfo(game.camera, 500, 32);
    game.debug.spriteCoords(ship, 32, 32);

}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(ship.x + 50   , ship.y +6);
            bullet.body.velocity.x = 500;
            bulletTime = game.time.now + 150;
            var reset = function(b){
                resetBullet(b);
            };
            game.time.events.add(Phaser.Timer.SECOND * 2, reset, this, bullet);
        }
    }

}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {
    bullet.kill();

}

//  Called if the bullet hits one of the invaders sprites
function bulletsCollisionHandler (bullet, invader) {
    bullet.kill();
    invader.kill();
}

function shipCollisionHandler (ship, invader) {
    console.log("ship collision");
    invader.kill();
}