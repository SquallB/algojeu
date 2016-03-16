var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });
var numberWave = -1;
var player;
var cursors;
var bullet;
var background;
var enemies;
var tokens;
var level = new GameGraph();
var counter = 0;

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

    level = level.generateGraph(5,game);

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    //loadLevel("tree_2");

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

    counter++;
    if(counter % 50 === 0) {
        //console.log("round: " + counter);
        if(loadLevel()) console.log("LEVEL IS FINISHED ! CONGRATULATIONS !");
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

/*function loadLevel(levelName) {
    $.ajax({
        async: false,
        dataType: "json",
        url: "ressource/" + levelName + ".json",
        success: function(data) {
            level = data.tree;
        }
    });
}*/

function loadLevel() {
    var rootNode = level.getRoot();
    var rootValue = rootNode.getValue();
    if(rootValue.statut === undefined) rootValue.statut = false;

    return loadNode(rootNode);
}

function loadLeaf(node) {
    //console.log("loadLeaf");
    //console.log(node);
    var value = node.getValue();
    //console.log(value);
    value.x = "test";
    //console.log(value);
    if(value.objective === "survive") {
        //console.log("createLeafSurvive");
        //console.log(node);
        numberWave++;
        value.enemies = createSurviveWave(value.vague);
    } else if(value.objective === "kill_all") {
        //console.log("createLeafKillAll");
        //console.log(node);
        numberWave++;
        value.enemies = createKillAllWave(value.vague);
    } else if(value.objective === "get_token") {
        //console.log("createLeafToken");
        //console.log(node);
        value.thetoken = createToken(value.token);
    }
}

function loadNode(node) {
    //console.log(node);
    var value = node.getValue();
    if (isObjectiveFulfill(node)) return true;

    if(!isLeaf(node)) {
        if(value.type === "ET//" || value.type === "OU//") {
            //console.log("node: ET_OU//");
            if(value.statut === undefined) loadParallelNode(node);
        } else if(value.type === "ET" || value.type === "OU") {
            //console.log("node: ET/OU");
            var children = node.getNeighbors();
            while (children.hasNextNode()) {
                var currentChild = children.getNextNode();
                var currentChildValue = currentChild.getValue();
                //console.log("statut child: " + currentChildValue.statut);
                if (isWaiting(currentChildValue)) {
                    //console.log("node: waiting");
                    //console.log(currentChild);
                    if (isObjectiveFulfill(currentChild)) currentChildValue.statut = true;
                    if(!isLeaf(currentChild)) loadNode(currentChild);

                    return;
                } else if (currentChildValue.statut === undefined) {
                    //console.log("node: undefined");
                    //console.log(currentChild);
                    if(isLeaf(currentChild)) {
                        currentChildValue.statut = false;
                        //console.log("congrats, it's a leaf !!!!!!!");
                        loadLeaf(currentChild);
                    } else {
                        //console.log("bouh, it's a node...");
                        loadNode(currentChild);
                        currentChildValue.statut = false;
                    }
                    //console.log("return, node :");
                    //console.log(node);
                    //console.log("return, children :");
                    //console.log(currentChild);
                    return;
                }
            }
        }
    } else {
        loadLeaf(node);
    }

    return false;
}

function isLeaf(node) {
    return (node.getDegree() === 0);
}

function isWaiting(nodeValue) {
    return (nodeValue.statut !== undefined && !nodeValue.statut);
}

function isTrue(nodeValue) {
    return (nodeValue.statut !== undefined && nodeValue.statut);
}

function isObjectiveFulfill(node) {
    if(isLeaf(node)) {
        //console.log("isObjectiveFulfill : isLeaf");
        return isObjectiveLeafFulfill(node);
    } else {
        //console.log("isObjectiveFulfill : isNode");
        return isObjectiveNodeFulfill(node);
    }
}

function isObjectiveNodeFulfill(node) {
    var value = node.getValue();
    if (isTrue(value)) return true;
    if (value === undefined) return false;

    if (isWaiting(value)) {
        //console.log("isObjectiveNodeFulfill : isWaiting");
        if (value.type === "ET//" || value.type === "ET") {
            //console.log("isObjectiveNodeFulfill : ET");
            var children = node.getNeighbors();
            while (children.hasNextNode()) {
                var currentChild = children.getNextNode();
                if(!isObjectiveFulfill(currentChild)) {
                    //console.log("!isObjectiveFulfill");
                    return false;
                }
            }
            
            return (value.statut = true);
        } else if (value.type === "OU//" || value.type === "OU") {
            //console.log("isObjectiveNodeFulfill : OU");
            var nbTrue = 0;
            var children = node.getNeighbors();
            while (children.hasNextNode()) {
                var currentChild = children.getNextNode();
                var currentChildValue = currentChild.getValue();
                if(currentChildValue.statut === undefined) {
                    //console.log("!isObjectiveNodeFulfill");
                    return false;
                } else if(isTrue(currentChildValue)) {
                    nbTrue++;
                }
                /*if (nbTrue > 0) console.log("isObjectiveNodeFulfill");
                else console.log("!isObjectiveNodeFulfill"); */

                return (currentChildValue.statut = (nbTrue > 0));
            }
        }
    }
}

function isObjectiveLeafFulfill(leaf) {
    var value = leaf.getValue();
    if (isTrue(value)) return true;
    if (value.statut === undefined) return false;

    if (value.objective === "kill_all" || value.objective === "survive") {
        return (value.statut = areAllDeadOrGone(leaf));
    } else if (value.objective === "get_token") {
        /* if (value.thetoken !== undefined && !value.thetoken.exists && !value.thetoken.visible) console.log("isObjectiveLeafFulfill : get_token");
        else console.log("!isObjectiveLeafFulfill : get_token"); */

        return (value.statut = (value.thetoken !== undefined && !value.thetoken.exists && !value.thetoken.visible));
    }
}

function loadParallelNode(node) {
    var children = node.getNeighbors();
    //console.log(children);
    while (children.hasNextNode()) {
        var currentChild = children.getNextNode();
        var currentChildValue = currentChild.getValue();
        //console.log(currentChild);
        if(isLeaf(currentChild)) {
            //console.log("isLeaf");
            loadLeaf(currentChild);
        } else {
            //console.log("isNode");
            loadNode(currentChild);
        }
    }
}

function areAllDeadOrGone(leaf) {
    var vagueEnemies = leaf.getValue().enemies;
    //console.log(leaf);
    for (var i = 0; i < vagueEnemies.length; i++) {
        //console.log(vagueEnemies[i]);
        if(vagueEnemies[i].position.x > 0 && vagueEnemies[i].life > 0) {
            //console.log('!isObjectiveLeafFulfill : survive or kill all');
            return false;
        }
    }
    //console.log('isObjectiveLeafFulfill : survive or kill all'); 
    return true;
}

function createKillAllWave(vague) {
    //console.log("createKillAllWave : " + vague.numberEnemy + " enemies.")
    var vagueEnemies = [];
    var positionX = 750 - numberWave * 50;
    var posYInc = Math.floor(600 / (vague.numberEnemy + 1));
    for (var i = 0; i < vague.numberEnemy; i++) {
        var invader = new Enemy.Invader(game, positionX, (i + 1) *posYInc, vague.life, vague.speed, vague.type, vague.weapon);
        invader.start();
        enemies.add(invader);
        vagueEnemies[i] = invader;
    }
    return vagueEnemies;
}

function createSurviveWave(vague) {
    //console.log("createSurviveWave : " + vague.numberEnemy + " enemies.")
    var vagueEnemies = [];
    var positionX = 800 + numberWave * 50;
    var posYInc = Math.floor(600 / (vague.numberEnemy + 1));
    for (var i = 0; i < vague.numberEnemy; i++) {
        var invader = new Enemy.Invader(game, positionX, (i + 1) *posYInc, vague.life, vague.speed, vague.type, vague.weapon);
        invader.start();
        enemies.add(invader);
        invader.body.velocity.set(-invader.speed, 0);
        vagueEnemies[i] = invader;
    }
    return vagueEnemies;
}

function createToken(token) {
    var thetoken;
    var posX = Math.floor((Math.random() * 700) + 50);
    var posY = Math.floor((Math.random() * 500) + 50);

    if(token.type === "weapon") {
        //console.log("createWeaponToken");
        thetoken = new Token.Weapon(game, posX, posY, createWeapon(token.value, game, true));
    } else if (token.type === "shield") {
        //console.log("createShieldToken");
        thetoken = new Token.Shield(game, posX, posY, token.value);
    } else if (token.type === "health") {
        //console.log("createHealthToken");
        thetoken = new Token.Health(game, posX, posY, token.value);
    } else if (token.type === "life") {
        //console.log("createLifeToken");
        thetoken = new Token.Life(game, posX, posY);
    }

    tokens.add(thetoken);
    thetoken.reset(posX, posY);
    /*var deleteToken = function(token) {
        token.kill();
    }
    this.game.time.events.add(Phaser.Timer.SECOND * 15, deleteToken, this, thetoken);*/
    return thetoken;
}
