/*
Classe qui calcul la difficulté d'un arbre
*/


function calculateNode(node) {
/*
Méthode pour calculer le score d'un noeud
*/
  var score = 0;
  if (!isLeaf(node)) {
    var value = node.getValue();
    //On ne fait pas de distinction entre un ET et un OU
    if (value.type === "ET//") {
      score = calculateParallelAndNode(node);
    } else if (value.type === "ET") {
      score = calculateSequentialAndNode(node);
    } else if (value.type === "OU//") {
      score = calculateParallelAndNode(node);
    } else if (value.type === "OU") {
      score = calculateSequentialOrNode(node);
    }

  } else {
    //Si c'est une feuille on calcul la difficulté de la feuille
    score = calculateLeaf(node);
  }

  return score;
}

function calculateSequentialOrNode(node) {
//On récupére le score maximum des enfants

  //On récupére les enfants
  var children = node.getNeighbors();
  var score = 0;
  while (children.hasNextNode()) {
    //pour chaque enfants
    var child = children.getNextNode();
    var scoreTampo = 0;
    //Si c'est une feuille on calcul le score de la feuille
    if (isLeaf(child)) {
      var object = calculateLeaf(child);

      scoreTampo = object.score;
      //Sinon on calcul le score du noeud
    } else {
      scoreTampo = calculateNode(child);
    }
    if (scoreTampo > score) {
      score = scoreTampo;
    }

  }
  return score;

}

  function calculateParallelAndNode(node) {
//n multiplie les scores de chaque enfants

    var children = node.getNeighbors();
    var score = 0;
    while (children.hasNextNode()) {
      var child = children.getNextNode();
      //Si c'est une feuille on calcul le score de celle-ci
      if (isLeaf(child)) {
        var object = calculateLeaf(child);
        //Si c'est un token on fait un % de celui-ci
        //Afin de ne pas tomber sur des valeurs gigantesques
        if (object.isToken) {
          score = score * object.score / 1000 + score;
          //Si c'est un noeud
        } else {
          score *= object.score;
        }
      } else {
        score *= calculateNode(child);
      }
    }

    return score;
  }

  function calculateSequentialAndNode(node) {
    //Pour les Et sequentiel on additionne le score des enfants
    var children = node.getNeighbors();
    var score = 0;
    while (children.hasNextNode()) {
      var child = children.getNextNode();
      //Si c'est une feuille
      if (isLeaf(child)) {
        var object = calculateLeaf(child);
        score += object.score;
        //Si c'est un noeud
      } else {
        score += calculateNode(child);
      }

    }
    return score;
}

    function calculateLeaf(node) {
      //Return un objet : {Score ; isToken}
      /*IsToken permet de savoir si la feuille est un objetif de type get_token
      Dans ce cas le calcul différe pour les ET et OU paralléle
      */
      var score = 0;
      var isToken = false;
      var value = node.getValue();
      if (value.objective === "survive") {
        score = calculateWaveSurvive(value.vague);
      } else if (value.objective === "kill_all") {
        score = calculateWaveKillAll(value.vague);
      } else if (value.objective === "get_token") {
        score = calculateToken(value.token);
        isToken = true;
      }
      return {
        score: score,
        isToken: isToken
      };
    }


    function calculateWaveKillAll(wave) {
      //Calcul d'un coeffificent de difficulté pour le joeur, en fonction de son taux de réussite sur ce type de vague.
      //On prend en compte le pourcentage de vague réussies, ainsi que les dégâts subis.
      var playerSuccessRatio = 1;

      //On adapte le coefficient en fonction des résultats du joueur
      var playerSuccessCoeff = 1;
      if(stats['statsKillAllTotal'] > 0) {
        playerSuccessRatio = stats['statsKillAllSuccess'] / stats['statsKillAllTotal'];
      }

      var playerDamageRatio = 1;
      if(stats['statsDamage'] > 0) {
        playerDamageRatio = (stats['statsDamage'] - stats['statsSurviveDamage']) / stats['statsDamage'];
      }

      var playerSuccessCoeff = 1 / ((3 * playerSuccessRatio + playerDamageRatio) / 4);

      //Le score d'une vague KillAll eqt en fonction du nombre d'ennemis
      //Le score d'une vague KillAll est en fonction du nombre d'ennemis
      //de leur vie et de leur arme
      return (wave.numberEnemy * wave.life * calculateWeapon(wave.weapon, false)) * playerSuccessCoeff;
    }

    function calculateWaveSurvive(wave) {
      //Calcul d'un coeffificent de difficulté pour le joeur, en fonction de son taux de réussite sur ce type de vague.
      //On prend en compte le pourcentage de vague réussies, ainsi que les dégâts subis.
      var playerSuccessRatio = 1;
      //On adapte le coefficient en fonction des résultats du joueur
      var playerSuccessCoeff = 1;
      if(stats['statsSurviveTotal'] > 0) {
        playerSuccessRatio = stats['statsSuriveSuccess'] / stats['statsSurviveTotal'];
      }

      var playerDamageRatio = 1;
      if(stats['statsDamage'] > 0) {
        playerDamageRatio = stats['statsSurviveDamage'] / stats['statsDamage'];
      }

      var playerSuccessCoeff = 1 / ((playerSuccessRatio + playerDamageRatio / 2));

      //Le score d'une vague Survive est en fonction de leur nombre,
      //de leur vitesse et de leur arme
      return (2000 / wave.speed * calculateWeapon(wave.weapon, false) * wave.numberEnemy) * playerSuccessCoeff;
    }

    function calculateToken(token) {

      //renvoie une valeur suivant le Token
      //La valeur est négative car il aide le joueur et réduit la difficulté
      var scoreToken=0;
      if (token.type === "weapon") {
          //Les tokens d'armes ne changent pas grand chose car ils durent moins
          //de 6 secondes
        scoreToken = -20;
      } else if (token.type === "health") {
        scoreToken = -100;
      } else if (token.type === "shield") {
        //les Token boucliers font une vrai différence
        scoreToken = -token.value * 200;
      } else if (token.type === "life") {
        //Tout comme ceux de vie
        scoreToken = -500;
      }
      return scoreToken;
    }

    function calculateWeapon(weapon, isPlayer) {

      //On différencie le score pour le joueur ou les ennemis.
      //Ils n'ont pas les mêmes propriétés d'armes.
      var scorePlayer=0;
      var scoreEnemie=0;
      var weaponUpperCase = weapon.toUpperCase();
      // 1000/fireRate * dammage * nbBulletPerShot * utilasibility [0;1]
      if (weaponUpperCase === "SINGLEBULLET") {
        //utilasibility = 0.5
        scorePlayer = 5;
        scoreEnnemy = 1;
      } else if (weaponUpperCase === "FRONTANDBACK") {
        //utilasibility = 0.5
        scorePlayer = 10;
        scoreEnnemy = 2;
      } else if (weaponUpperCase === "THREEWAY") {
        //utilasibility = 0.6
        scorePlayer = 11;
        scoreEnnemy = 5;
      } else if (weaponUpperCase === "EIGHTWAY") {
        //utilasibility = 0.7
        scorePlayer = 11;
        scoreEnnemy = 5;
      } else if (weaponUpperCase === "SCATTERSHOT") {
        //use 0.6
        scorePlayer = 15;
        scoreEnnemy = 15;
      } else if (weaponUpperCase === "BEAM") {
        //use = 0.8
        scorePlayer = 26;
        scoreEnnemy = 26;
      } else if (weaponUpperCase === "SPLITSHOT") {
        //use  0.6
        scorePlayer = 24;
        scoreEnnemy = 12;
      } else if (weaponUpperCase === "ROCKETS") {
        //use 0.4
        scorePlayer = 19;
        scoreEnnemy = 7;
      } else if (weaponUpperCase === "SCALEBULLET") {
        //use 1
        scorePlayer = 30;
        scoreEnnemy = 15;
      }
      if (isPlayer) {
        return socrePlayer;
      } else {
        return scoreEnnemy;
      }

    }
