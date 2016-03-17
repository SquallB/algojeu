var Game =  { preload: preload, create: create, update: update, render: render };
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });
//Nombre de vague affichées à l'écran, pour ne pas les superposer
var numberWave = -1;
//Le joueur
var player;
//Evenements KeyPressed
var cursors;
//es balles
var bullet;
var background;
//Groupe d'ennemis
var enemies;
//Les bonus
var tokens;
//Le générateur de graph aléatoire
var gameGraph = new GameGraph();
//Un niveau de jeu issu de l'arbre
var level;
var counter = 0;
var stats = {};
var nbKills = 0;
//variable nécéssaire pour savoir si tous les enemis de la liste sont soit mort, soit hors de l'écran
var isAllDead;
//score du joueur
var score = 0;
var damageCounter = 0;
//Initialisation de la difficulté pour le premiére arbre à 750
var difficultyTree=750;
var killAllTime = 0;
var surviveDamage = 0;
var killAllSuccess = 0;
var killAllTotal = 0;
var surviveSuccess = 0;
var surviveTotal = 0;

//Fonction pour initialiser les écritures d'objectifs
function initInfos(text, color = "black") {
    $("#info").html(text);
    $("#info").css("color", color);
}
//Fonction pour modifier les objectifs en cours
function writeInfos(text, color = "black") {
    if($("#info").html() !== "") {
        $("#info").html($("#info").html() + " " + text);
    } else {
        $("#info").html(text);
    }

    $("#info").css("color", color);
}

//Variable du menu du début du jeu -> Click to play
var Menu = {

    preload : function() {
        // Loading images is required so that later on we can create sprites based on the them.
        // The first argument is how our image will be refered to,
        // the second one is the path to our file.
        game.load.image('play', 'spaceship.png');
    },

    create: function () {
        // Add a sprite to your game, here the sprite will be the game's logo
        // Parameters are : X , Y , image name (see above)

        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

        var button = this.add.button(0, 0, 'play', this.startGame, this);
        button.width = 800;
        button.height = 600;
        //add a text to the button
        stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#FF0000' });
        stateText.anchor.setTo(0.5, 0.5);

        stateText.text = "Click to play !";
        stateText.visible = true;

    },

    startGame: function () {

        // Change the state to the actual game.
        stateText.visible = false;
        this.state.start('game');

    }

};

//Menu lorsque l'on gagne une partie
var CompleteMenu = {

    preload : function() {
        // Loading images is required so that later on we can create sprites based on the them.
        // The first argument is how our image will be refered to,
        // the second one is the path to our file.
        game.load.image('play', 'spaceship.png');
    },

    create: function () {
        // Add a sprite to your game, here the sprite will be the game's logo
        // Parameters are : X , Y , image name (see above)

        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

        var button = this.add.button(0, 0, 'play', this.startGame, this);
        button.width = 800;
        button.height = 600;
        //add a text to the image
        stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '50px Arial', fill: '#FF0000' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.text = "CONGRATULATIONS\n Click to play another one !";
        stateText.visible = true;
    },

    startGame: function () {

        // Change the state to the actual game.
        //We change the difficulty for the next level
        difficultyTree += difficultyTree*20/100;
        this.state.start('game');

    }

};
//Menu lorsque l'on perd la partie
var GameOverMenu = {

    preload : function() {
        // Loading images is required so that later on we can create sprites based on the them.
        // The first argument is how our image will be refered to,
        // the second one is the path to our file.
        game.load.image('play', 'spaceship.png');
    },

    create: function () {
        // Add a sprite to your game, here the sprite will be the game's logo
        // Parameters are : X , Y , image name (see above)

        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

        var button = this.add.button(0, 0, 'play', this.startGame, this);
        button.width = 800;
        button.height = 600;
        //Add a text to the button
        stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '70px Arial', fill: '#FF0000' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.text = "GameOver\n Click to try Again !";
        stateText.visible = true;
    },

    startGame: function () {

        // Change the state to the actual game.
        //change the difficulty of the next level.
        difficultyTree = difficultyTree - difficultyTree*20/100;
        this.state.start('game');

    }

};

//Le jeu
//On ajoute les diffirents menu
game.state.add('Menu', Menu);
game.state.add('game', Game);
game.state.add('CompleteMenu', CompleteMenu);
game.state.add('GameOverMenu', GameOverMenu);
//On lance le munu de départ
game.state.start('Menu');

function preload() {
    //On charge les images nécéssaire
    //background
    game.load.image('starfield', 'assets/starfield.png');
    //vaisseau du joueur
    game.load.image('ship', 'assets/thrust_ship.png');
    //différents type d'ennemis
    game.load.image('invader', 'assets/invader.png');
    game.load.image('invader2', 'assets/enemie1.png');
    game.load.image('boss', 'assets/enemie.png');
    //Les explosions lors des mort ennemis ou joueur
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
    //Les images pour les bonus
    game.load.image('TokenLife', 'assets/life.png');
    game.load.image('TokenHealth', 'assets/health.png');
    game.load.image('TokenShield', 'assets/shield.png');
    game.load.image('TokenWeapon', 'assets/weapon.png');

    //les images des balles des différentes armes
    for (var i = 0; i <= 11; i++) {
        game.load.image('bullet' + i, 'assets/bullet' + i + '.png');
    }
}

//création de la fenetre de jeu

function create() {
    //On créer la fenetre de jeu
    game.world.setBounds(0, 0, 800, 600);
    //on ajoute le fond
    background = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    //on recupére les statistiques sur le joueur
    getStats();
    //On creer le profil du joueur (arme, vies) en fonction de ses statistiques
    player = generatePlayer(stats,game);

    //On ajoute le vaisseau du joueur
    game.add.existing(player);

    game.physics.enable(player, Phaser.Physics.ARCADE);
    //On ajoute des limites pour pas que le joueur sorte de la fenetre
    player.body.collideWorldBounds = true;

    //On créer un niveau en fonction de la difficulté voulu
    level = gameGraph.generateValidGraph(game,difficultyTree);
    var rootNode = level.getRoot();
    var rootValue = rootNode.getValue();
    //on enregistre la difficulté rééele de l'arbre
    difficultyTree = calculateNode(rootNode);

    //On rajoute une detection de touche
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    //on créer un groupe d'ennemis
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    //On crer un groupe d'explosions
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    //On créer un groupe de bonus
    tokens = game.add.group();
    tokens.enableBody = true;

    //Initialisation de la div #info
    initInfos("GAME STARTED", "green");
}

function setupInvader (invader) {
    //pour chaque enemi créer on lui ajoute l'animation d'explosion
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');
}


function isAllDeadEnnemies(enemy) {
    //fonction qui test si les enemies de la liste "enemies" sont mort ou sortie de la fenetre
    if (enemy.posX>0 && enemy.life>0){
        //s'il y en a qui est encore vivant on passe le booléen isAllDead a false
        isAllDead = false;
    }
}


//Fonction de misà jour de la vue
function update() {

    counter++;
    if(counter % 50 === 0) {
        //console.log("round: " + counter);
        if(loadLevel()) {
            var time = new Date(game.time.now - game.time.pauseDuration);
            score = calculateScore();
            //On affiche le temps nécéssaire à la réussite du niveau et le score
            initInfos("LEVEL FINISHED ! CONGRATULATIONS !<br/>Time: " + time.getUTCMinutes() + ":" + time.getUTCSeconds() + '<br/> Score : ' + score, "green");

            updateStats(player);
            //on lance le menu de niveau réussi
            game.state.start('CompleteMenu',true,false);

        }
        //Si le joueur n'a plus de vie
        if(player.getLife() === 0) {
            initInfos("NO MORE LIVES ! GAME LOST !", "red");
            //On lance le menu Game over
            game.state.start('GameOverMenu', true, false);
        }
    }

    //Réinitialisation du compteur de vague pour remmettre les enemies sur
    //le bord droit de la fenetre
    if (numberWave > -1) {
        isAllDead = true;
        enemies.forEach(isAllDeadEnnemies, this);
        if(isAllDead) {
            //Si tous les enemies de la liste sont "mort", on réinitialise le compteur de vagues
            numberWave = -1;
        }
    }
    //on fait défilier le fond
    background.tilePosition.x -= 2;

    //On gére les différentes collisions
    game.physics.arcade.overlap(player, enemies, playerCollisionHandler, null, this);
    game.physics.arcade.overlap(player.weapon, enemies, bulletsCollisionHandler, null, this);
    game.physics.arcade.overlap(player, tokens, tokenCollisionHandler, null, this);

    //on réinitialise la vitesse du vaisseau
    // -> pas de touches enfoncées le vaisseau s'arréte
    player.body.velocity.set(0);

    //Suivant les touches enfoncées par le joueur on met à jour le déplacement du vaisseau
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

    //si le joueur appuie sur "espace", il tire des balles
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        player.weapon.fire(player, true);
    }


    enemies.forEachAlive(function(enemy) {
        if (enemy.exists) {
            if(enemy.firstAppreance) {
                //Si l'ennemi apparait pour la premiére fois, il ne tire pas tout de suite
                enemy.firstAppear();
            } else {
                //Sinon il bombarde !!!!!
                enemy.weapon.fire(enemy,false);
                //on ajoute la detection de collisions entre les balles de l'enemis et le joueur
                //Le tir amis pour les ennemis n'est pas pris en compte
                game.physics.arcade.overlap(enemy.weapon, player, playerCollisionHandler, null, this);
            }
        }
    });

}

function render() { }

//  Called if the bullet hits one of the enemies sprites
function bulletsCollisionHandler(bullet, enemy) {
    //On détruit la balle
    bullet.kill();
    //L'ennemis subit des dégats
    enemy.life -= bullet.damage;

    //s'il n'a plus de vie
    if(enemy.life <= 0) {
        //On lance l'animation de l'explosion
        var explosion = explosions.getFirstExists(false);
        explosion.reset(enemy.body.x, enemy.body.y);
        explosion.play('kaboom', 30, false, true);
        //puis on le supprime
        enemy.kill();
        //on incrémente le compte d'ennemis tués par le joueur pour les statistiques
        nbKills++;
        //on génére aléatoirement des tokens lorsques les ennemis meurt.
        //sur un random de 0 à 100 il faut plus de 95
        if(game.rnd.integerInRange(0, 100) > 95) {
            createToken(gameGraph.generateRndToken(game), enemy.body.x, enemy.body.y);
        }
    }
}

//Fonction qui gére la collision du vaisseau du joueur avec ceux des ennemis
function playerCollisionHandler(player, enemy) {
    //Le joueur se prend des dommages
    player.lifeBar.changeLife(-enemy.damage);
    //on incrémente le compteur de dommages reçu pour les statistiques
    damageCounter += enemy.damage;
    //On lance l'animation de l'explosion
    var explosion = explosions.getFirstExists(false);
    explosion.reset(enemy.body.x, enemy.body.y);
    explosion.play('kaboom', 30, false, true);
    //L'enemis meurt
    enemy.life = 0;
    enemy.kill();
}

//Fonction qui gére la collision entre le joueur et les tokens
function tokenCollisionHandler(player, token) {
    //Le joueur utilise le bonus
    token.useToken(player);
    //le bonus disparait de la fenetre
    token.kill();
}

////////////////////////////////////////////////////
/////         Gestion du moteur de jeu        /////
//////////////////////////////////////////////////

//On charge le niveau
function loadLevel() {
    var rootNode = level.getRoot();
    var rootValue = rootNode.getValue();
    //Tant que le statut est non défini on ne renvoit pas vrai
    if(rootValue.statut === undefined) rootValue.statut = false;
    //On charge le noeud
    return loadNode(rootNode);
}

//Méthode permettant de charger une feuille
function loadLeaf(node) {
    var value = node.getValue();
    //console.log("loadLeaf");
    //console.log(node);
    //console.log(value);
    if(value.objective === "survive") {
        //console.log("createLeafSurvive");
        //console.log(node);
        node.startDamage = damageCounter;
        surviveTotal++;
        numberWave++;
        value.enemies = createSurviveWave(value.vague);
        //On met à jour les objectifs
        writeInfos("Survive Wave of " + value.vague.numberEnemy + " enemies.");
    } else if(value.objective === "kill_all") {
        //console.log("createLeafKillAll");
        //console.log(node);
        node.startTime = game.time.now;
        killAllTotal++;
        numberWave++;
        value.enemies = createKillAllWave(value.vague);
        //on met à jour les objectifs
        writeInfos("Kill all " + value.vague.numberEnemy + " enemies.");
    } else if(value.objective === "get_token") {
        //console.log("createLeafToken");
        //console.log(node);
        value.thetoken = createToken(value.token);
        //on met à jour les objectifs
        writeInfos("Pick up " + value.token.type.toLowerCase() + " token.");
    }
    //On met le statut de la feuille à faux -> objectif par encore réalisé
    value.statut = false;
}

function loadNode(node) {
    //méthode pour charger un noeud

    //console.log(node);
    var value = node.getValue();

    //si l'objectif du noeud est réussi on renvoit true
    if (isObjectiveFulfill(node)) return true;

    //si ce n'est pas une feuille, on check les opérateurs
    if(!isLeaf(node)) {
        if(value.type === "ET//" || value.type === "OU//") {
            //console.log("node: ET_OU//");
            //Si le statut est indéfini, le noeud n'est pas encore chargé, on le fait
            if(value.statut === undefined) loadParallelNode(node);
        } else if(value.type === "ET" || value.type === "OU") {
            //console.log("node: ET/OU");
            var children = node.getNeighbors();
            while (children.hasNextNode()) {
                var currentChild = children.getNextNode();
                var currentChildValue = currentChild.getValue();
                //console.log("statut child: " + currentChildValue.statut);

                //si on est en attente du statut du noeud
                if (isWaiting(currentChildValue)) {
                    //console.log("node: waiting");
                    //console.log(currentChild);
                    //On vérifie si l'objectif a été réalisé
                    if (isObjectiveFulfill(currentChild)) currentChildValue.statut = true;
                    if(!isLeaf(currentChild)) loadNode(currentChild);

                    return;
                } else if (currentChildValue.statut === undefined) {
                    //si le noeud n'est pas encore chargé

                    //console.log("node: undefined");
                    //console.log(currentChild);
                    initInfos("");
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
        initInfos("");
        loadLeaf(node);
    }

    return false;
}

function isLeaf(node) {
    //retourne vrai si le noeud est une feuille
    return (node.getDegree() === 0);
}

function isWaiting(nodeValue) {
    //Si le statut est faux, il attent une réponse
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
    //On vérifie si l'objectif à été réalisé
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
                } else if(isObjectiveFulfill(currentChild)) {
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
        value.statut = areAllDeadOrGone(leaf);
        if(value.statut) {
            if(value.objective === "kill_all") {
                var timeToClear = game.time.now - leaf.startTime;
                killAllTime = (killAllTime + timeToClear) / 2;
                killAllSuccess++;
            }
            else if(value.objective = "survive") {
                var damageDiff = damageCounter - leaf.startDamage;
                surviveDamage = (surviveDamage + damageDiff) / 2;
                surviveSuccess++;
            }
        }
        return value.statut;
    } else if (value.objective === "get_token") {
        /* if (value.thetoken !== undefined && !value.thetoken.exists && !value.thetoken.visible) console.log("isObjectiveLeafFulfill : get_token");
        else console.log("!isObjectiveLeafFulfill : get_token"); */

        return (value.statut = (value.thetoken !== undefined && !value.thetoken.exists && !value.thetoken.visible));
    }
}

function loadParallelNode(node) {
    initInfos("", "black");
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
    //on test si l'objectif de la feuille est réaliser
    var vagueEnemies = leaf.getValue().enemies;
    //console.log(leaf);
    for (var i = 0; i < vagueEnemies.length; i++) {
        //console.log(vagueEnemies[i]);
        //s'ils ont encore de la vie et q'ils sont encore sur la fenetre de jeu
        //c'est qu'ils ne sont pas encore mort
        if(vagueEnemies[i].position.x > 0 && vagueEnemies[i].life > 0) {
            //console.log('!isObjectiveLeafFulfill : survive or kill all');
            return false;
        }
    }
    //console.log('isObjectiveLeafFulfill : survive or kill all');
    return true;
}

function createKillAllWave(vague) {
    //On créé une vague de type KillAll
    //console.log("createKillAllWave : " + vague.numberEnemy + " enemies.")

    //variable de sauvegarde de la vague
    var vagueEnemies = [];
    //attribution de x selon le nombre de vagues déjà à l'écran
    var positionX = 750 - numberWave * 50;
    //Repartition selon l'axe Y
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
    //On créé une vague de type "Survive"
    //console.log("createSurviveWave : " + vague.numberEnemy + " enemies.")
    //on stock chaque enemis dans une variable pour pouvoir savoir quand la vague n'existe plus
    var vagueEnemies = [];
    //On attribut la positionX selon le nombre de vagues déjà à l'écran
    var positionX = 800 + numberWave * 50;
    //On répartit les enemis sur l'axe Y
    var posYInc = Math.floor(600 / (vague.numberEnemy + 1));
    for (var i = 0; i < vague.numberEnemy; i++) {
        //on créer chaque enemis
        var invader = new Enemy.Invader(game, positionX, (i + 1) *posYInc, vague.life, vague.speed, vague.type, vague.weapon);
        //on les initialise sur la fenetre de jeu
        invader.start();
        //on les ajoute dans le groupe d'ennemis
        enemies.add(invader);
        //on leur donne une vitesse -> Vague Survive
        invader.body.velocity.set(-invader.speed, 0);
        //on les stock dans une variable annexe pour connaitre le statut de cette vague
        vagueEnemies[i] = invader;
    }
    return vagueEnemies;
}

function createToken(token, posX, posY) {
    //On créé le bonus du joueur
    var thetoken;
    //On lui attribut une position aléatoire sur l'écran
    var posX = posX || Math.floor((Math.random() * 700) + 50);
    var posY = posY || Math.floor((Math.random() * 500) + 50);

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
    //on ajoute le bonus au groupe
    tokens.add(thetoken);
    //On lui attribut sa postion
    thetoken.reset(posX, posY);
    /*var deleteToken = function(token) {
        token.kill();
    }
    this.game.time.events.add(Phaser.Timer.SECOND * 15, deleteToken, this, thetoken);*/
    return thetoken;
}

function getStatValue(statName) {
    //On recupére les statistiques du joueur si elles existent
    var stat = localStorage.getItem(statName);
    if(stat === null) {
        stats[statName] = 0;
    }
    else {
        stats[statName] = parseFloat(stat);
    }
}

function getStats() {
    //On recupére les statistiques du joueur
    getStatValue('statsNumber');
    getStatValue('statsScore');
    getStatValue('statsDamage');
    getStatValue('statsTime');
    getStatValue('statsKills');
    getStatValue('statsKillAllTime');
    getStatValue('statsSurviveDamage');
    getStatValue('statsKillAllSuccess');
    getStatValue('statsKillAllTotal');
    getStatValue('statsSuriveSuccess');
    getStatValue('statsSurviveTotal');
}

function updateStats() {
    //on met a jour les statistiques du joueur
    stats['statsNumber']++;
    stats['statsScore'] = (stats['statsScore'] + score) / 2;
    stats['statsDamage'] = (stats['statsDamage'] + damageCounter) / 2;
    stats['statsTime'] = (stats['statsTime'] + game.time.now) / 2;
    stats['statsKills'] = (stats['statsKills'] + (nbKills / enemies.length)) / 2;
    stats['statsKillAllTime'] = (stats['statsKillAllTime'] + killAllTime) / 2;
    stats['statsSurviveDamage'] = (stats['statsSurviveDamage'] + surviveDamage) / 2;
    stats['statsKillAllSuccess'] = stats['statsKillAllSuccess'] + killAllSuccess;
    stats['statsKillAllTotal'] = stats['statsKillAllTotal'] + killAllTotal;
    stats['statsSuriveSuccess'] = stats['statsSuriveSuccess'] + surviveSuccess;
    stats['statsSurviveTotal'] = stats['statsSurviveTotal'] + surviveTotal;

    saveStats();
}

function saveStats(player) {
    for(property in stats) {
        //On sauvegarde en local les statistiques du joueur
        localStorage.setItem(property, stats[property]);
    }
}

function calculateScore() {
    //Methode de calcul du score du joueur
    //En fonction de la difficulté de l'arbre
    var difficultyCoeff = calculateNode(level.getRoot()) / 150;
    //son ration d'enemis tués
    var killScore = (nbKills / enemies.length) * 1500;
    //Les dommages qu'il a reçu pendant la partie
    var lifeScore = -(damageCounter * 2);
    //Le temps de jeu
    var timeScore = 100000000 / game.time.now;
    return Math.round(difficultyCoeff * (killScore + lifeScore + timeScore));
}

function generatePlayer(stats,  game) {
    //détermination de la vie de départ en fonction de la moyenne des dégâts subis
    var nbLives = 3;
    if(stats['statsDamage'] !== 0) {
        nbLives = Math.floor((stats['statsDamage'] * 0.9) / 100);
    }

    //détermination de l'arme de départ
    var killRatio = stats['statsKills'];
    var weaponName;
    if(killRatio === 0 || killRatio > 0.75) {
        weaponName = 'SINGLEBULLET';
    }
    else if(killRatio > 0.50) {
        weaponName = 'THREEWAY';
    }
    else if(killRatio > 0.25) {
        weaponName = 'ROCKETS';
    }
    else {
        weaponName = 'SPLITSHOT';
    }
    var weapon = createWeapon(weaponName, game, true);
    //On retourne le profil du joueur
    return new Player(game, 100, 370, weapon, nbLives);
}
