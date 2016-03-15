

function LifeBar(gameModel, value){
  this.value = value;
  this.fullHeathValue=value;
  this.lives = 3;
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

LifeBar.prototype.display=function(){
    this.view.update(this);
}

LifeBar.prototype.changeLife=function(modifier){
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

  if(this.value > this.fullHeathValue) {
    this.value = this.fullHeathValue;
  }

  if(this.value <= 0) {
    if(this.getLives() > 0) {
      this.setLives(this.getLives() - 1);
      this.value = this.getFullHealthValue();
      var lifeView = this.view.lives.getFirstAlive();
      lifeView.kill();    
    }
    else {
      this.value = 0;
    }

  }

  this.view.update(this);

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

  if(this.bgRect == null){
    this.bgRect = this.drawRect(0,0,this.bgWidth,this.bgHeight,this.bgWidth, health.getGame(),this.bgColor);
    this.bgRect.fixedToCamera = true;
    this.bgRect.anchor.set(0.5);
    this.bgRect.alpha = 0.4;
  }

  if(this.healthRect==null){
    this.healthRect = this.drawRect(5,0,this.bgWidth-5,this.height,this.bgWidth/2, health.getGame(),this.healthColor);
    this.healthRect.fixedToCamera = true;
    this.healthRect.alpha = 0.4;
  }

  this.shieldWith = health.shield+5;
  if(this.shieldWith > health.fullHeathValue + 5) {
    this.shieldWith = health.fullHeathValue + 5;
  }

  if(this.shieldRect==null) {

    this.shieldRect = this.drawRect(5,0,this.bgWidth-5,this.height,this.bgWidth/2, health.getGame(),this.shieldColor);
    this.shieldRect.fixedToCamera = true;
    this.shieldRect.alpha = 0.4;
    
  }

  this.cropRect = new Phaser.Rectangle(0, 0, this.width+5, this.height);
  this.healthRect.cropEnabled = true;
  this.healthRect.crop(this.cropRect);

  this.shieldCropRect = new Phaser.Rectangle(0, 0, this.shieldWith, this.height);
  this.shieldRect.cropEnabled = true;
  this.shieldRect.crop(this.shieldCropRect);

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
