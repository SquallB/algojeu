
function calculateWaveKillAll(wave){

  return score = wave.enemyDescription.life * calculateWeapon(wave.enemyDescription.weapon);
}

function calculateWaveSurvive(wave){

  return score = 2000/wave.enemyDescription.speed * calculateWeapon(wave.enemyDescription.weapon);
}

function calculateToken(token){


}

function calculateWeapon(weapon, isPlayer){

  var scorePlayer;
  var scoreEnemie;
  // 1000/fireRate * dammage * nbBulletPerShot * utilasibility [0;1]
  if (weaponUpperCase === "SINGLEBULLET") {
    //utilasibility = 0.5
      scorePlayer = 5;
      scoreEnnemy =1;
    }else if(weaponUpperCase === "FRONTANDBACK") {
      //utilasibility = 0.5
      scorePlayer = 10;
      scoreEnnemy =2;
    }else if (weaponUpperCase === "THREEWAY") {
      //utilasibility = 0.6
      scorePlayer = 11;
      scoreEnnemy =5;
    }else if (weaponUpperCase === "EIGHTWAY") {
      //utilasibility = 0.7
      scorePlayer = 11;
      scoreEnnemy =5;
    }else if (weaponUpperCase === "SCATTERSHOT") {
      //use 0.6
      scorePlayer = 15;
      scoreEnnemy =6;
    }else if (weaponUpperCase === "BEAM") {
      //use = 0.8
      scorePlayer = 26;
      scoreEnnemy =26;
    }else if (weaponUpperCase === "SPLITSHOT") {
      //use  0.6
      scorePlayer = 24;
      scoreEnnemy =12;
    }else if (weaponUpperCase === "ROCKETS") {
      //use 0.4
      scorePlayer = 19;
      scoreEnnemy =7;
    }else if (weaponUpperCase === "SCALEBULLET") {
      //use 1
      scorePlayer = 10;
      scoreEnnemy =6;
    }
    if (isPlayer) {
      return socrePlayer;
    }else {
      return scoreEnnemy;
    }

}
