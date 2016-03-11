

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

LifeBar.prototype.display=function(){
    this.view.update(this);
}

LifeBar.prototype.cropLife=function(damage){

  if(damage<this.value){
    this.value -= damage;
  }else{
    this.value = 0;
  }
  
  this.view.update(this);
  
  
  
}


LifeBarView = function(){
  this.width = 0;
  this.height = 10;

  this.bgWidth = 0;
  this.bgHeight = 15;

  this.bgRect= null;
  this.healthRect=null;

  this.lives=null;

  this.bgColor = '#00685e';
  this.healthColor = '#00f910';
}


LifeBarView.prototype.update= function(health){
  this.bgWidth = health.getFullHealthValue() + 10;
  this.width = health.getValue();

  this.bgRect = this.drawRect(0,0,this.bgWidth,this.bgHeight,this.bgWidth, health.getGame(),this.bgColor);
  this.bgRect.fixedToCamera = true;
  this.bgRect.anchor.set(0.5);

  this.healthRect = this.drawRect(5,0,this.width+5,this.height,this.bgWidth/2, health.getGame(),this.healthColor);
  this.healthRect.fixedToCamera = true;

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
  
}


LifeBarView.prototype.drawRect = function(x,y,width,height,spriteWidth,game,color){
  var tmpRect = game.add.bitmapData(width, height);
  tmpRect.ctx.beginPath();
  tmpRect.ctx.rect(x, y, width, height);
  tmpRect.ctx.fillStyle = color;
  tmpRect.ctx.fill();

  return game.add.sprite(spriteWidth,height,tmpRect);
}