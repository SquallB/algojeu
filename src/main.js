var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });
var numberWave = -1;
var player;
var cursors;
var bullet;
var background;
var enemies;
var tokens;
var level;
//var counter = 0;

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

    player = new Player(game, 100, 370, new Weapon.SingleBullet(game, true));

    game.add.existing(player);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;

    var gameGraph = new GameGraph();

    //console.log(gameGraph.generateGraph(5,game));
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    loadLevel("tree_2");

    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    tokens = game.add.group();
    tokens.enableBody = true;
}

function setupInvader (invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');
}

function update() {

    //console.log("round: " + counter);
    //counter++;
    if(loadNode(level)) {
        console.log("LEVEL IS FINISHED ! CONGRATULATIONS !");
        // level finished
        // stop the game
    }

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
    enemy.life = 0;
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
            level = data.tree;
        }
    });
}

function loadLeaf(node) {
    if(node.objective === "survive") {
        //console.log("createLeafSurvive");
        numberWave++;
        node.enemies = createSurviveWave(node.vague);
    } else if(node.objective === "kill_all") {
        //console.log("createLeafKillALL");
        numberWave++;
        node.enemies = createKillAllWave(node.vague);
    } else if(node.objective === "get_token") {
        //console.log("createLeafToken");
        node.thetoken = createToken(node.token);
    }
}

function loadNode(node) {
    //console.log(node);
    if (node.statut === undefined) node.statut = false;
    if (isObjectiveFulfill(node)) return true;

    if(node.propriety === "node") {
        if(node.keyWord === "ET" || node.keyWord === "OU") {
            //console.log("node: ET/OU");
            //console.log(node);
            loadChildrenNodeNonSemantique(node.children);
        } else if(node.keyWord === "ET_SEMANTIQUE" || node.keyWord === "OU_SEMANTIQUE") {
            //console.log("node: ET_SEMANTIQUE/OU_SEMANTIQUE");
            for (var i = 0; i < node.children.length; i++) {
                //console.log("statut child " + i + " : " + node.children[i].statut);
                if (isWaiting(node.children[i])) {
                    if (isObjectiveFulfill(node.children[i])) node.children[i].statut = true;
                    //console.log("node: waiting");
                    //console.log(node.children[i]);
                    return;
                } else if (node.children[i].statut === undefined) {
                    //console.log("node: undefined");
                    //console.log(node.children[i]);
                    node.children[i].statut = false;
                    if(node.children[i].propriety === "node") {
                        loadNode(node.children[i]);
                    } else if(node.children[i].propriety === "leaf") {
                        loadLeaf(node.children[i]);
                    }
                    return;
                }
            }
        }
    } else if(node.propriety === "leaf") {
        loadLeaf(node);
    }

    return false;
}

function isWaiting(node) {
    return (node.statut !== undefined && !node.statut);
}

function isTrue(node) {
    return (node.statut !== undefined && node.statut);
}

function isObjectiveFulfill(node) {
    //console.log("isObjectiveFulfill");
    //console.log(node);
    if(node.propriety === "node") {
        return isObjectiveNodeFulfill(node);
    } else if(node.propriety === "leaf") {
        return isObjectiveLeafFulfill(node);
    }
}

function isObjectiveNodeFulfill(node) {
    //console.log("isObjectiveNodeFulfill");
    //console.log(node);
    if (isTrue(node)) return true;
    if (node.statut === undefined) return false;

    if (isWaiting(node)) {
        if (node.keyWord === "ET" || node.keyWord === "ET_SEMANTIQUE") {
            for (var i = 0; i < node.children.length; i++) {
                if(!isObjectiveFulfill(node.children[i])) {
                    return false;
                }
            }

            return (node.statut = true);
        } else if (node.keyWord === "OU" || node.keyWord === "OU_SEMANTIQUE") {
            var nbTrue = 0;
            for (var i = 0; i < node.children.length; i++) {
                if(node.children[i].statut === undefined) {
                    return false;
                } else if(isTrue(node.children[i])) {
                    nbTrue++;
                }

                return (node.statut = (nbTrue > 0));
            }
        }
    }
}

function isObjectiveLeafFulfill(leaf) {
    //console.log("isObjectiveLeafFulfill");
    //console.log("leaf:" + leaf.statut);
    if (isTrue(leaf)) return true;
    if (leaf.statut === undefined) return false;

    if (leaf.objective === "kill_all" || leaf.objective === "survive") {
        return (leaf.statut = areAllDeadOrGone(leaf.enemies));
    } else if (leaf.objective === "get_token") {
        //console.log('objective get_token');
        //console.log(leaf);
        return (leaf.statut = (leaf.thetoken !== undefined && !leaf.thetoken.exists && !leaf.thetoken.visible));
    }
}

function loadChildrenNodeNonSemantique(children) {
    for (var i = 0; i < children.length; i++) {
        children[i].statut = false;
        if(children[i].propriety === "node") {
            loadNode(children[i]);
        } else if(children[i].propriety === "leaf") {
            loadLeaf(children[i]);
        }
    }
}

function areAllDeadOrGone(arrayEnemies) {
    for (var i = 0; i < arrayEnemies.length; i++) {
        //console.log(arrayEnemies[i]);
        if(arrayEnemies[i].position.x > 0 && arrayEnemies[i].life > 0) {
            //console.log("arrayEnemies[" + i + "]: false");
            return false;
        }
    }
    //console.log("arrayEnemies: true");
    return true;
}

function createKillAllWave(vague) {
    var vagueEnemy = [];
    var positionX = 750 - numberWave * 50;
    for (var i = 0; i < vague.numberEnemy; i++) {
        var invader = new Enemy.Invader(game, positionX, vague.positionY[i], vague.enemyDescription.life, vague.enemyDescription.speed, vague.enemyDescription.type, vague.enemyDescription.weapon);
        invader.start();
        enemies.add(invader);
        vagueEnemy[i] = invader;
    }
    return vagueEnemy;
}

function createSurviveWave(vague) {
    var vagueEnemy = [];
    var positionX = 800 + numberWave * 50;
    for (var i = 0; i < vague.numberEnemy; i++) {
        var invader = new Enemy.Invader(game, positionX, vague.positionY[i], vague.enemyDescription.life, vague.enemyDescription.speed, vague.enemyDescription.type, vague.enemyDescription.weapon);
        invader.start();
        enemies.add(invader);
        invader.body.velocity.set(-invader.speed, 0);
        vagueEnemy[i] = invader;
    }
    return vagueEnemy;
}

function createToken(token) {
    var thetoken;
    var posX = Math.floor((Math.random() * 700) + 50);
    var posY = Math.floor((Math.random() * 500) + 50);

    if(token.type === "Weapon") {
        thetoken = new Token.Weapon(game, posX, posY, createWeapon(token.weapon, game, true));
    } else if (token.type === "Shield") {
        thetoken = new Token.Shield(game, posX, posY, token.shield);
    } else if (token.type === "Health") {
        thetoken = new Token.Health(game, posX, posY, token.health);
    }

    tokens.add(thetoken);
    thetoken.reset(posX, posY);
    return thetoken;
}
