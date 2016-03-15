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

    console.log(gameGraph.generateGraph(5,game));
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

    console.log("round: " + counter);
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
    var value = node.getValue();
    if(value.objective === "survive") {
        console.log("createLeafSurvive");
        numberWave++;
        value.enemies = createSurviveWave(value.vague);
    } else if(value.objective === "kill_all") {
        console.log("createLeafKillALL");
        numberWave++;
        value.enemies = createKillAllWave(value.vague);
    } else if(value.objective === "get_token") {
        console.log("createLeafToken");
        value.thetoken = createToken(value.token);
    }
}

function loadNode(node) {
    console.log(node);
    var value = node.getValue();
    if (value.statut === undefined) value.statut = false;
    if (isObjectiveFulfill(node)) return true;

<<<<<<< HEAD
    if(isLeaf(node)) {
        loadLeaf(node);
    } else {
        if(value.type === "ET//" || value.type === "OU//") {
            console.log("node: ET/OU");
            console.log(node);
            loadParallelNode(node);
        } else if(value.type === "ET" || value.type === "OU") {
            console.log("node: ET_SEMANTIQUE/OU_SEMANTIQUE");
            var children = node.getNeighbors();
            while (children.hasNext()) {
                var currentChild = children.getNextNode();
                var currentChildValue = currentChild.getValue();
                console.log("statut child " + i + " : " + currentChildValue.statut);
                if (isWaiting(currentChild)) {
                    if (isObjectiveFulfill(currentChild)) currentChildValue.statut = true;
                    console.log("node: waiting");
                    console.log(currentChild);
=======
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
>>>>>>> origin/master
                    return;
                } else if (currentChildValue.statut === undefined) {
                    console.log("node: undefined");
                    console.log(currentChild);
                    currentChildValue.statut = false;
                    if(isLeaf(node)) {
                        loadLeaf(currentChild);
                    } else {
                        loadNode(currentChild);
                    }
                    return;
                }
            }
        }
    } else 

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
    console.log("isObjectiveFulfill");
    console.log(node);
    if(isLeaf(node)) {
        return isObjectiveLeafFulfill(node);
    } else {
        return isObjectiveNodeFulfill(node);
    }
}

function isObjectiveNodeFulfill(node) {
    console.log("isObjectiveNodeFulfill");
    console.log(node);
    var value = node.getValue();
    if (isTrue(value)) return true;
    if (value === undefined) return false;

    if (isWaiting(value)) {
        if (value.type === "ET//" || value.type === "ET") {
            var children = node.getNeighbors();
            while (children.hasNext()) {
                var currentChild = children.getNextNode();
                if(!isObjectiveFulfill(currentChild)) {
                    return false;
                }
            }
<<<<<<< HEAD
            
            return (value.statut = true);
        } else if (value.type === "OU//" || value.type === "OU") {
=======

            return (node.statut = true);
        } else if (node.keyWord === "OU" || node.keyWord === "OU_SEMANTIQUE") {
>>>>>>> origin/master
            var nbTrue = 0;
            var children = node.getNeighbors();
            while (children.hasNext()) {
                var currentChild = children.getNextNode();
                var currentChildValue = currentChild.getValue();
                if(currentChildValue.statut === undefined) {
                    return false;
                } else if(isTrue(currentChildValue)) {
                    nbTrue++;
                }

                return (currentChildValue.statut = (nbTrue > 0));
            }
        }
    }
}

function isObjectiveLeafFulfill(leaf) {
    console.log("isObjectiveLeafFulfill");
    console.log("leaf:" + leaf.statut);
    var value = leaf.getValue();
    if (isTrue(value)) return true;
    if (value.statut === undefined) return false;

    if (value.objective === "kill_all" || value.objective === "survive") {
        return (value.statut = areAllDeadOrGone(value.enemies));
    } else if (value.objective === "get_token") {
        console.log('objective get_token');
        console.log(leaf);
        return (value.statut = (value.thetoken !== undefined && !value.thetoken.exists && !value.thetoken.visible));
    }
}

function loadParallelNode(node) {
    var children = node.getNeighbors();
    while (children.hasNext()) {
        var currentChild = children.getNextNode();
        var currentChildValue = currentChild.getValue();
        currentChildValue.statut = false;
        if(isLeaf(currentChild)) {
            loadLeaf(currentChild);
        } else {
            loadNode(currentChild);
        }
    }
}

function areAllDeadOrGone(enemies) {
    for (var i = 0; i < enemies.length; i++) {
        console.log(enemies[i]);
        if(enemies[i].position.x > 0 && enemies[i].life > 0) {
            console.log("enemies[" + i + "]: false");
            return false;
        }
    }
    console.log("enemies: true");
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

    if(token.type === "weapon") {
        thetoken = new Token.Weapon(game, posX, posY, createWeapon(token.value, game, true));
    } else if (token.type === "shield") {
        thetoken = new Token.Shield(game, posX, posY, token.value);
    } else if (token.type === "health") {
        thetoken = new Token.Health(game, posX, posY, token.value);
    } else if (token.type === "life") {
        thetoken = new Token.Life(game, posX, posY);
    }

    tokens.add(thetoken);
    thetoken.reset(posX, posY);
    var deleteToken = function(token){

        token.kill();
    }
    this.game.time.events.add(Phaser.Timer.SECOND * 15, deleteToken, this, thetoken);
    return thetoken;
}
