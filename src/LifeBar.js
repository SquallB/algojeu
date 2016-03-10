

function LifeBar(gameModel){
  this.value = 100;
  this.fullHeathValue=100;
  this.game = gameModel;

}

LifeBar.prototype.getValue = function(){
  return this.value;
}

LifeBar.prototype.setValue = function(value){
  this.value = value;
}

LifeBar.prototype.display=function(){
    this.bmd = this.game.add.bitmapData(this.value+ 10, 15);
    this.bmd.ctx.beginPath();
    this.bmd.ctx.rect(0, 0, this.value + 10, 15);
    this.bmd.ctx.fillStyle = '#00685e';
    this.bmd.ctx.fill();
    this.bglife = this.game.add.sprite(100, 50, this.bmd);
    this.bglife.anchor.set(0.5);
    this.bglife.fixedToCamera=true;

    this.bmd = this.game.add.bitmapData(this.value, 10);
    this.bmd.ctx.beginPath();
    this.bmd.ctx.rect(0, 0, this.value, 10);
    this.bmd.ctx.fillStyle = '#00f910';
    this.bmd.ctx.fill();
    
    this.widthLife = new Phaser.Rectangle(0, 0, this.fullHeathValue, this.bmd.height);

    
    this.life = this.game.add.sprite(this.bglife.width/2 - 5, 50, this.bmd);
    this.life.anchor.y = 0.5;
    this.life.cropEnabled = true;
    this.life.crop(this.widthLife);
    this.life.fixedToCamera=true;
    this.game.time.events.loop(1500, this.cropLife, this);
}

LifeBar.prototype.cropLife=function(){

  if(this.fullHeathValue/10<= this.value){
    this.value -= this.fullHeathValue/10;
    this.game.add.tween(this.widthLife).to( { width: (this.widthLife.width - (this.fullHeathValue / 10)) }, 200, Phaser.Easing.Linear.None, true);
  
  }
  
}
