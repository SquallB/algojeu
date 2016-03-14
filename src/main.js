var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });
var numberWave = 0;
var player;
var cursors;
var bullet;
var background;
var enemies;
var tokens;

function preload() {
    game.load.image('starfield', 'assets/starfield.png');
    game.load.image('ship', 'assets/thrust_ship.png');
    game.load.image('invader', 'assets/invader.png');
    game.load.image('invader2', 'assets/enemie1.png');
    game.load.image('boss', 'assets/enemie.png');
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
    game.load.image('TokenLife', 'assets/life.png');
    game.load.image('TokenHealth', 'assets/health.png');
    game.load.image('TokenShield', 'assets/shield.png');
    game.load.image('TokenWeapon', 'assets/weapon.png');

    for (var i = 0; i <= 11; i++) {
        game.load.image('bullet' + i, 'assets/bullet' + i + '.png');
    }
}

function create() {
    game.world.setBounds(0, 0, 800, 600);

    background = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    player = new Player(game, 200, 200, new Weapon.SingleBullet(game, true));

    game.add.existing(player);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;

    var gameGraph = new GameGraph();

    console.log(gameGraph.generateGraph(15,game));
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);


    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    loadLevel("tree_1");

    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    tokens = game.add.group();
    tokens.enableBody = true;
    var token = new Token.Weapon(game, 100, 100, createWeapon('SplitShot', game, true));
    tokens.add(token);
    token.reset(100, 100);
    token = new Token.Shield(game, 100, 100, 50);
    tokens.add(token);
    token.reset(300, 300);
}

function setupInvader (invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');
}

function update() {
    background.tilePosition.x -= 2;

    //game.camera.x += 1;
    game.physics.arcade.overlap(player, enemies, playerCollisionHandler, null, this);
    game.physics.arcade.overlap(player.weapon, enemies, bulletsCollisionHandler, null, this);
    game.physics.arcade.overlap(player, tokens, tokenCollisionHandler, null, this);

    player.body.velocity.set(0);

    if (cursors.left.isDown) {
        player.body.velocity.x = -player.speed;
    } else if (cursors.right.isDown) {
        player.body.velocity.x = player.speed;
    }

    if (cursors.up.isDown) {
        player.body.velocity.y = -player.speed;
    } else if (cursors.down.isDown) {
        player.body.velocity.y = player.speed;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        player.weapon.fire(player, true);
    }

    enemies.forEachAlive(function(enemy) {
        if (enemy.exists) {
            if(enemy.firstAppreance) {
                enemy.firstAppear();
            } else {
                enemy.weapon.fire(enemy,false);
                game.physics.arcade.overlap(enemy.weapon, player, playerCollisionHandler, null, this);
            }
        }
    });
}

function render() { }

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

function playerCollisionHandler(player, enemy) {
    player.lifeBar.changeLife(-enemy.damage);
    var explosion = explosions.getFirstExists(false);
    explosion.reset(enemy.body.x, enemy.body.y);
    explosion.play('kaboom', 30, false, true);
    enemy.kill();
}

function tokenCollisionHandler(player, token) {
    token.useToken(player);
    token.kill();
}

function loadLevel(levelName) {
    $.ajax({
        async: false,
        dataType: "json",
        url: "ressource/" + levelName + ".json",
        success: function(data) {
            level = data;
            loadChildrenNode(level.tree);
        }
    });
}

function loadChildrenNode(node) {
    if(node.propriety === "node") {
        if(node.keyWord === "ET_SEMANTIQUE" || node.keyWord === "OU_SEMANTIQUE") {
            for (var i = 0; i < node.children.length; i++) {
                loadChildrenNode(node.children[i]);
            }
        } else if(node.keyWord === "ET" || node.keyWord === "OU") {
            for (var i = 0; i < node.children.length; i++) {
                loadChildrenNode(node.children[i]);
            }
        }
    } else if(node.propriety === "leaf") {
        if(node.objective === "survive") {
            createKillAllWave(node.vague);
            numberWave++;
        } else if(node.objective === "kill_all") {
            createKillAllWave(node.vague);
            numberWave++;
        }
    }
}

function createKillAllWave(vague) {
    var positionX = 750 - numberWave * 50;
    for (var i = 0; i < vague.numberEnemy; i++) {
        var invader = new Enemy.Invader(game, positionX, vague.positionY[i], vague.enemyDescription.life, vague.enemyDescription.speed, vague.enemyDescription.type, vague.enemyDescription.weapon);
        invader.start();
        enemies.add(invader);
    }
}

function createSurviveWave(vague) {
    var positionX = 1200 + numberWave * 50;
    for (var i = 0; i < vague.numberEnemy; i++) {
        var invader = new Enemy.Invader(game, positionX, vague.positionY[i], vague.enemyDescription.life, vague.enemyDescription.speed, vague.enemyDescription.type, vague.enemyDescription.weapon);
        invader.start();
        enemies.add(invader);
        invader.body.velocity.set(-invader.speed,0);
    }
}