
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

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

function create() {

    game.world.setBounds(0, 0, 1920, 600);

    background = game.add.tileSprite(0, 0, 1200, 600, 'starfield');

    ship = game.add.sprite(200, 200, 'ship');
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.collideWorldBounds = true;


    this.lifeBar = new LifeBar(game);
    this.lifeBar.display();

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

    }

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
        invader.body.velocity.x = -invader.getSpeed();
        invader.body.velocity.y = 0;
    }
}

function update() {

    background.tilePosition.x -= 2;

    //game.camera.x += 1;
    game.physics.arcade.overlap(ship, enemies, shipCollisionHandler, null, this);
    game.physics.arcade.overlap(bullets, enemies, bulletsCollisionHandler, null, this);

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
}

function render() {

    

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

//  Called if the bullet hits one of the enemies sprites
function bulletsCollisionHandler (bullet, enemy) {
    bullet.kill();

    var invaderLife = enemy.getLife();
    invaderLife--;
    enemy.setLife(invaderLife);

    if(invaderLife <= 0) {
        enemy.kill();
    }
}

function shipCollisionHandler (ship, enemy) {
    enemy.kill();
}