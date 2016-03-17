function LifeBar(gameModel, lives, value){
  //Valeur courante de la barre de santé
  this.value = value || 100;
  //Valeur maximum de la barre de santé
  this.fullHeathValue = value || 100;
  //Nombre de vies
  this.lives = lives || 3;
  //Valeur du bouclier
  this.shield = 0;

  this.game = gameModel;
  this.view = new LifeBarView();
}

LifeBar.prototype.getValue = function(){
  return this.value;
}

LifeBar.prototype.setValue = function(value){
  this.value = value;
}


LifeBar.prototype.getFullHealthValue = function(){
  return this.fullHeathValue;
}

LifeBar.prototype.setFullHealthValue = function(value){
  this.fullHeathValue = value;
}

LifeBar.prototype.getGame = function(){
  return this.game;
}

LifeBar.prototype.getLives = function(){
  return this.lives;
}

LifeBar.prototype.setLives = function(newCount){
  this.lives = newCount;
}

LifeBar.prototype.display = function(){
    this.view.update(this);
}

LifeBar.prototype.addLife = function() {
  var ship = this.view.lives.create(this.view.bgWidth/2 + 15+(30 * this.lives), 40, 'ship');
  ship.anchor.setTo(0.5, 0.5);
  ship.angle = 90;
  ship.alpha = 0.4;
  this.lives++;
}

LifeBar.prototype.changeLife=function(modifier){
  //Si on se prend des dégats et que on a un bouclier
  //Il absorbe les dégats
  if(this.shield > 0 && modifier < 0) {
    this.shield += modifier;
    if(this.shield < 0) {
      var leftover = this.shield;
      this.shield = 0;
      this.value += leftover;
    }
  }
  else {
    this.value += modifier;
  }

  //Si jamais la valeur courante de vie est supérieur à la valeur maximum
  //On la met au max
  if(this.value > this.fullHeathValue) {
    this.value = this.fullHeathValue;
  }
  //Si la valeur tombe en dessous de zéro, on perd une vie
  if(this.value <= 0) {
    if(this.getLives() > 0) {
      //S'il nous reste des vies on en perd une
      this.setLives(this.getLives() - 1);
      this.value = this.getFullHealthValue();
      var lifeView = this.view.lives;
      var livesSprite = []
      lifeView.forEachAlive(function(life) {
        livesSprite.push(life);
      });
      //On supprime la représentation de la vie
      livesSprite[livesSprite.length-1].kill();
    }
    else {
      //Sinon on met la vie à zéro, le joueur est mort.
      this.value = 0;
    }

  }

}


LifeBarView = function(){
  this.width = 0;
  this.height = 10;

  this.bgWidth = 0;
  this.bgHeight = 15;

  this.shieldWidth = 0;
  this.shieldHeight = 10;

  this.healthGateMedium = 0xf1c40f;
  this.healthGateLow = 0xff0000;
  this.healthGateHigh = 0x00ff00;
  this.bgRect= null;
  this.healthRect=null;
  this.cropRect = null;
  this.lives=null;

  this.bgColor = '#00685e';
  this.healthColor = '#ffffff';
  this.shieldColor = '#0099ff';

}


LifeBarView.prototype.update= function(health){

  this.bgWidth = health.getFullHealthValue() + 10;
  this.width = health.getValue();
  
  //Initialisation des représentations des vies
   if(this.lives == null){
    this.lives = health.getGame().add.group();


    for (var i = 0; i < health.getLives(); i++)
    {
        var ship = this.lives.create(this.bgWidth/2 + 15+(30 * i), 40, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }
  }

  //Initialisation du rectangle de background de la barre de santé
  if(this.bgRect == null){
    this.bgRect = this.drawRect(0,0,this.bgWidth,this.bgHeight,this.bgWidth, health.getGame(),this.bgColor);
    this.bgRect.fixedToCamera = true;
    this.bgRect.anchor.set(0.5);
    this.bgRect.alpha = 0.4;
  }
  //initialisation de la barre de santé
  if(this.healthRect==null){
    this.healthRect = this.drawRect(5,0,this.bgWidth-5,this.height,this.bgWidth/2, health.getGame(),this.healthColor);
    this.healthRect.fixedToCamera = true;
    this.healthRect.alpha = 0.4;
  }
  //Initialisation de la barre de bouclier
  this.shieldWith = health.shield+5;
  if(this.shieldWith > health.fullHeathValue + 5) {
    this.shieldWith = health.fullHeathValue + 5;
  }

  if(this.shieldRect==null) {

    this.shieldRect = this.drawRect(5,0,this.bgWidth-5,this.height,this.bgWidth/2, health.getGame(),this.shieldColor);
    this.shieldRect.fixedToCamera = true;
    this.shieldRect.alpha = 0.4;

  }
  //Initialisation du rectange de réprésentation de la barre de santé
  this.cropRect = new Phaser.Rectangle(0, 0, this.width+5, this.height);
  this.healthRect.cropEnabled = true;
  this.healthRect.crop(this.cropRect);

  this.shieldCropRect = new Phaser.Rectangle(0, 0, this.shieldWith, this.height);
  this.shieldRect.cropEnabled = true;
  this.shieldRect.crop(this.shieldCropRect);
  //suivant la vie qu'il nous reste, il change de couleur
  if(this.width >= health.getFullHealthValue()*0.8){
    this.healthColor = this.healthGateHigh;
  }
  if(this.width<health.getFullHealthValue()*0.8){
    this.healthColor = this.healthGateMedium;
  }

  if(this.width<health.getFullHealthValue()*0.20){
    this.healthColor = this.healthGateLow;
  }
  this.healthRect.tint = this.healthColor;




}


LifeBarView.prototype.drawRect = function(x,y,width,height,spriteWidth,game,color){
  var tmpRect = game.add.bitmapData(width, height);
  tmpRect.ctx.beginPath();
  tmpRect.ctx.rect(x, y, width, height);
  tmpRect.ctx.fillStyle = color;
  tmpRect.ctx.fill();

  return game.add.sprite(spriteWidth,height,tmpRect);
}