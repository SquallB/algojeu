

function LifeBar(gameModel){
  this.value = 100;
  this.fullHeathValue=100;
  this.lives = 3;

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

LifeBar.prototype.cropLife=function(damage){


  this.value -= damage;
  
  if(this.value<=0){
    this.value = this.getFullHealthValue();
    this.setLives(this.getLives()-1);
    if(this.getLives()>=0){
      this.lives = this.view.lives.getFirstAlive();
      this.lives.kill();
      
    }
    
  }
  
  this.view.update(this);
  
  
  
}


LifeBarView = function(){
  this.width = 0;
  this.height = 10;

  this.bgWidth = 0;
  this.bgHeight = 15;

  this.healthGateMedium = 0xf1c40f;
  this.healthGateLow = 0xff0000;
  this.healthGateHigh = 0x00ff00;
  this.bgRect= null;
  this.healthRect=null;
  this.cropRect = null;
  this.lives=null;

  this.bgColor = '#00685e';
  this.healthColor = '#ffffff';

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
    this.healthRect = this.drawRect(5,0,this.width+5,this.height,this.bgWidth/2, health.getGame(),this.healthColor);
    this.healthRect.fixedToCamera = true;
    this.healthRect.alpha = 0.4;
    this.cropRect = new Phaser.Rectangle(0, 0, this.width+5, this.height);
    this.healthRect.cropEnabled = true;
    this.healthRect.crop(this.cropRect);
    this.healthRect.tint = this.healthGateHigh;
    this.healthRect.updateCrop();
  }

   
    

  this.healthRect.updateCrop();
  health.getGame().add.tween(this.cropRect).to( { width: this.width+5}, 100, Phaser.Easing.Linear.None, true);
  this.healthRect.updateCrop();
  
  if(this.width <= health.getFullHealthValue()){
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