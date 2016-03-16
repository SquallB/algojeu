function calculateNode(node) {

  var score = 0;
  if (!isLeaf(node)) {
    var value = node.getValue();
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
    score = calculateLeaf(node);
  }

  return score;
}

function calculateSequentialOrNode(node) {
  var children = node.getNeighbors();
  var score = 0;
  while (children.hasNextNode()) {
    var child = children.getNextNode();
    var scoreTampo = 0;
    if (isLeaf(child)) {
      var object = calculateLeaf(child);

      scoreTampo = object.score;
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
    var children = node.getNeighbors();
    var score = 0;
    while (children.hasNextNode()) {
      var child = children.getNextNode();
      if (isLeaf(child)) {
        var object = calculateLeaf(child);
        if (object.isToken) {
          score = score * object.score / 1000 + score;
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
    var children = node.getNeighbors();
    var score = 0;
    while (children.hasNextNode()) {
      var child = children.getNextNode();
      if (isLeaf(child)) {
        var object = calculateLeaf(child);
        console.log("object.score");
        console.log(object.score);
        score += object.score;
      } else {
        score += calculateNode(child);
      }

    }
    return score;
}

    function calculateLeaf(node) {
      var score = 0;
      var isToken = false;
      var value = node.getValue();
      if (value.objective === "survive") {
        score = calculateWaveSurvive(value.vague);
        //console.log("SURVIVE");
        //console.log(score);
      } else if (value.objective === "kill_all") {
        score = calculateWaveKillAll(value.vague);
        //console.log("KILLALL");
        //console.log(score);
      } else if (value.objective === "get_token") {
        score = calculateToken(value.token);
        isToken = true;
        //console.log("TOKEN");
        //console.log(score);
      }
      //console.log("LEAF");
      //console.log(score);
      return {
        score: score,
        isToken: isToken
      };
    }


    function calculateWaveKillAll(wave) {

      return score = wave.numberEnemy * wave.life * calculateWeapon(wave.weapon, false);
    }

    function calculateWaveSurvive(wave) {

      return score = 2000 / wave.speed * calculateWeapon(wave.weapon, false) * wave.numberEnemy;
    }

    function calculateToken(token) {

      var scoreToken=0;
      if (token.type === "weapon") {
        scoreToken = -20;
        //console.log("TOKENWEAPON");
        //console.log(scoreToken);
      } else if (token.type === "health") {
        scoreToken = -50;
        //console.log("TOKENHEALTH");
        //console.log(scoreToken);
      } else if (token.type === "shield") {
        scoreToken = -token.value * 100;
        //console.log("TOKENSHIELD");
        //console.log(scoreToken);
      } else if (token.type === "life") {

        scoreToken = -100;
        //console.log("TOKENLIFE");
        //console.log(scoreToken);
      }
      console.log("TOKEN");
      console.log(scoreToken);
      return scoreToken;
    }

    function calculateWeapon(weapon, isPlayer) {

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
        scoreEnnemy = 6;
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
        scorePlayer = 10;
        scoreEnnemy = 6;
      }
      if (isPlayer) {
        return socrePlayer;
      } else {
        return scoreEnnemy;
      }

    }
