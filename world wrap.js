
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('backdrop', 'TheEnd_by_Iloe_and_Made.jpg');
    game.load.image('card', 'thrust_ship.png');
    game.load.image('bullet', 'bullet0.png');

}

var card;
var cursors;
var bullets;


var bulletTime = 0;
var bullet;

function create() {

    game.world.setBounds(0, 0, 1920, 1080);

    game.add.sprite(0, 0, 'backdrop');

    card = game.add.sprite(200, 200, 'card');

    game.camera.follow(card);

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++)
    {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.angle = 90;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;

    }


}

function update() {

    if (cursors.left.isDown)
    {
        card.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        card.x += 4;
    }

    if (cursors.up.isDown)
    {
        card.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        card.y += 4;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fireBullet();
    }
    game.world.wrap(card, 0, true);




}

function render() {

    game.debug.cameraInfo(game.camera, 500, 32);
    game.debug.spriteCoords(card, 32, 32);

}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(card.x + 50   , card.y +6);
            bullet.body.velocity.x = 500;
            bulletTime = game.time.now + 150;
            var reset = function(b){
                resetBullet(b);
                console.log(b.name);
            };
            game.time.events.add(Phaser.Timer.SECOND * 2, reset, this, bullet);
        }
    }

}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {

    bullet.kill();

}
