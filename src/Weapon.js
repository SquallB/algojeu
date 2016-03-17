function createWeapon (weapon, game, isPlayer) {
    //Méthode pour créer l'arme selon son nom
    //Le booléen isPlayer est nécéssaire car les armes n'ont pas
    //les même propriétés pour le joueur et les ennemis
    var weaponUpperCase = weapon.toUpperCase();
    var newWeapon;

    if (weaponUpperCase === "SINGLEBULLET") {
        newWeapon = new Weapon.SingleBullet(game, isPlayer);
    }else if(weaponUpperCase === "FRONTANDBACK") {
        newWeapon = new Weapon.FrontAndBack(game, isPlayer);
    }else if (weaponUpperCase === "THREEWAY") {
        newWeapon = new Weapon.ThreeWay(game, isPlayer);
    }else if (weaponUpperCase === "EIGHTWAY") {
        newWeapon = new Weapon.EightWay(game,isPlayer);
    }else if (weaponUpperCase === "SCATTERSHOT") {
        newWeapon = new Weapon.ScatterShot(game,isPlayer);
    }else if (weaponUpperCase === "BEAM") {
        newWeapon = new Weapon.Beam(game,isPlayer);
    }else if (weaponUpperCase === "SPLITSHOT") {
        newWeapon = new Weapon.SplitShot(game,isPlayer);
    }else if (weaponUpperCase === "ROCKETS") {
        newWeapon = new Weapon.Rockets(game,isPlayer);
    }else if (weaponUpperCase === "SCALEBULLET") {
        newWeapon = new Weapon.ScaleBullet(game,isPlayer);
    }
    return newWeapon;
};

var Weapon = {};

////////////////////////////////////////////////////
//  A single bullet is fired in front of the ship //
////////////////////////////////////////////////////


Weapon.SingleBullet = function (game, isPlayer) {


    Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.dammage = 1;
    //On choisit la vitesse de tir pour le joueur et l'ennemi
    if (isPlayer) {
        this.fireRate = 100;
    }else {
        this.fireRate = 2000;
    }

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'bullet5', this.dammage), true);
    }

    return this;

};

Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

Weapon.SingleBullet.prototype.fire = function (source, isPlayer) {

    if (this.game.time.time < this.nextFire) { return; }


    if (isPlayer) {

        var x = source.x + 15;
        var y = source.y + 15;
        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    }else {
        var x = source.x - 8;
        var y = source.y + 8
        //On tire les balles dans le sens inverse pour les ennemis
        this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed,0, 0);
    }

    this.nextFire = this.game.time.time + this.fireRate;

};

/////////////////////////////////////////////////////////
//  A bullet is shot both in front and behind the ship //
/////////////////////////////////////////////////////////

Weapon.FrontAndBack = function (game, isPlayer) {

    Phaser.Group.call(this, game, game.world, 'Front And Back', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.dammage = 1;
    //On choisit la vitesse de tir pour le joueur et l'ennemi
    if (isPlayer) {

        this.fireRate = 100;
    }else {
        this.fireRate= 1000;
    }

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'bullet5', this.dammage), true);
    }

    return this;

};

Weapon.FrontAndBack.prototype = Object.create(Phaser.Group.prototype);
Weapon.FrontAndBack.prototype.constructor = Weapon.FrontAndBack;

Weapon.FrontAndBack.prototype.fire = function (source, isPlayer) {

    if (this.game.time.time < this.nextFire) { return; }

    if(isPlayer) {

        var x = source.x + 10;
    }else {

        var x = source.x - 10;
    }
    var y = source.y + 10;
    //Les balles sont les mêmes pour le joueur et l'ennemi
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//////////////////////////////////////////////////////
//  3-way Fire (directly above, below and in front) //
//////////////////////////////////////////////////////

Weapon.ThreeWay = function (game, isPlayer) {

    Phaser.Group.call(this, game, game.world, 'Three Way', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.dammage = 3;
    //On choisit la vitesse de tir pour le joueur et l'ennemi
    if (isPlayer) {

        this.fireRate = 500;
    }else {
        this.fireRate= 2000;
    }

    for (var i = 0; i < 96; i++)
    {
        this.add(new Bullet(game, 'bullet7', this.dammage), true);
    }

    return this;

};

Weapon.ThreeWay.prototype = Object.create(Phaser.Group.prototype);
Weapon.ThreeWay.prototype.constructor = Weapon.ThreeWay;

Weapon.ThreeWay.prototype.fire = function (source, isPlayer) {

    if (this.game.time.time < this.nextFire) { return; }
    //Les sprites de ces balles n'ont pas de sens. On a pas besoin de le retourner
    //On les tirs donc dans le sens inverse pour les ennemis
    if (isPlayer) {

        var x = source.x + 10;
        var y = source.y + 10;

        this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);
    }else {
        var x = source.x - 8;
        var y = source.y + 8;

        this.getFirstExists(false).fire(x, y, 90, -this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 270, -this.bulletSpeed, 0, 0);
    }

    this.nextFire = this.game.time.time + this.fireRate;

};

/////////////////////////////////////////////
//  8-way fire, from all sides of the ship //
/////////////////////////////////////////////

Weapon.EightWay = function (game,isPlayer) {

    Phaser.Group.call(this, game, game.world, 'Eight Way', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.dammage=1;
    //On choisit la vitesse de tir pour le joueur et l'ennemi
    if(isPlayer) {

        this.fireRate = 500;
    }else {
        this.fireRate = 1000;

    }

    for (var i = 0; i < 96; i++)
    {
        this.add(new Bullet(game, 'bullet5', this.dammage), true);
    }

    return this;

};

Weapon.EightWay.prototype = Object.create(Phaser.Group.prototype);
Weapon.EightWay.prototype.constructor = Weapon.EightWay;

Weapon.EightWay.prototype.fire = function (source, isPlayer) {

    if (this.game.time.time < this.nextFire) { return; }
    if (isPlayer){
        var x = source.x + 16;

    }else {
        var x = source.x - 8;

    }
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 45, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 135, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 225, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 315, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

////////////////////////////////////////////////////
//  Bullets are fired out scattered on the y axis //
////////////////////////////////////////////////////

Weapon.ScatterShot = function (game,isPlayer) {

    Phaser.Group.call(this, game, game.world, 'Scatter Shot', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.dammage =1;
    //On choisit la vitesse de tir pour le joueur et l'ennemi
    if(isPlayer) {

        this.fireRate = 40;
    }else {
        this.fireRate = 100;

    }

    for (var i = 0; i < 32; i++)
    {
        this.add(new Bullet(game, 'bullet5', this.dammage), true);
    }

    return this;

};

Weapon.ScatterShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScatterShot.prototype.constructor = Weapon.ScatterShot;

Weapon.ScatterShot.prototype.fire = function (source, isPlayer) {

    if (this.game.time.time < this.nextFire) { return; }

    var y = (source.y + source.height / 2) + this.game.rnd.between(-10, 10);

    if (isPlayer) {
        var x = source.x + 16;
        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

    }else {
        var x = source.x - 16;
        //On change l'angle du sprite pour les ennemi
        this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);
    }

    this.nextFire = this.game.time.time + this.fireRate;

};

//////////////////////////////////////////////////////////////////////////
//  Fires a streaming beam of lazers, very fast, in front of the player //
//////////////////////////////////////////////////////////////////////////

Weapon.Beam = function (game,isPlayer) {

    Phaser.Group.call(this, game, game.world, 'Beam', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 1000;
    this.dammage =2;
    //On choisit la vitesse de tir pour le joueur et l'ennemi
    if(isPlayer){
        this.fireRate = 90;

    }else {
        this.fireRate = 700;
    }

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'bullet11', this.dammage), true);
    }

    return this;

};

Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);
Weapon.Beam.prototype.constructor = Weapon.Beam;

Weapon.Beam.prototype.fire = function (source, isPlayer) {

    if (this.game.time.time < this.nextFire) { return; }


    if (isPlayer) {

        var x = source.x + 40;
        var y = source.y + 10;
        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    }else {
        var x = source.x - 40;
        var y = source.y + 10;
        this.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 0);
    }

    this.nextFire = this.game.time.time + this.fireRate;

};

///////////////////////////////////////////////////////////////////////
//  A three-way fire where the top and bottom bullets bend on a path //
///////////////////////////////////////////////////////////////////////

Weapon.SplitShot = function (game, isPlayer) {

    Phaser.Group.call(this, game, game.world, 'Split Shot', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 700;
    this.dammage = 4;
    //On choisit la vitesse de tir pour le joueur et l'ennemi
    if (isPlayer) {
        this.fireRate = 200;
    }else {
        this.fireRate = 800;
    }


    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'bullet8', this.dammage), true);
    }

    return this;

};

Weapon.SplitShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.SplitShot.prototype.constructor = Weapon.SplitShot;

Weapon.SplitShot.prototype.fire = function (source, isPlayer) {

    if (this.game.time.time < this.nextFire) { return; }
    if (isPlayer) {
        var x = source.x + 20;
        var y = source.y + 10;

        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -500);
        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 500);

    }else {
        var x = source.x - 20;
        var y = source.y + 10;

        //Arme trop puissante pour les enemis, réduction à seulement une balle
        this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);



    }


    this.nextFire = this.game.time.time + this.fireRate;

};


///////////////////////////////////////////////////////////////////
//  Rockets that visually track the direction they're heading in //
///////////////////////////////////////////////////////////////////

Weapon.Rockets = function (game, isPlayer) {

    Phaser.Group.call(this, game, game.world, 'Rockets', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.dammage = 6;
    //On choisit la vitesse de tir pour le joueur et l'ennemi
    if(isPlayer) {
        this.fireRate = 250;

    }else {
        this.fireRate = 700;
    }

    for (var i = 0; i < 32; i++)
    {
        this.add(new Bullet(game, 'bullet10', this.dammage), true);
    }

    this.setAll('tracking', true);

    return this;

};

Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype);
Weapon.Rockets.prototype.constructor = Weapon.Rockets;

Weapon.Rockets.prototype.fire = function (source, isPlayer) {

    if (this.game.time.time < this.nextFire) { return; }
    //on donne un angle de tir pour les rockets
    if (isPlayer) {
        var x = source.x + 10;
        var y = source.y + 10;

        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -700);
        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 700);
    }else {
        var x = source.x - 10;
        var y = source.y + 10;

        this.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, -700);
        this.getFirstExists(false).fire(x, y, 0, -this.bulletSpeed, 0, 700);

    }

    this.nextFire = this.game.time.time + this.fireRate;

};

////////////////////////////////////////////////////////////////////////
//  A single bullet that scales in size as it moves across the screen //
////////////////////////////////////////////////////////////////////////

Weapon.ScaleBullet = function (game,isPlayer) {

    Phaser.Group.call(this, game, game.world, 'Scale Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 800;
    this.dammage =5;
    //On choisit la vitesse de tir pour le joueur et l'ennemi
    if (isPlayer) {

        this.fireRate = 500;
    }else {

        this.fireRate = 1000;
    }

    for (var i = 0; i < 32; i++)
    {
        this.add(new Bullet(game, 'bullet9', this.dammage), true);
    }

    this.setAll('scaleSpeed', 0.05);

    return this;

};

Weapon.ScaleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScaleBullet.prototype.constructor = Weapon.ScaleBullet;

Weapon.ScaleBullet.prototype.fire = function (source,isPlayer) {

    if (this.game.time.time < this.nextFire) { return; }

    var y = source.y + 10;
    if(isPlayer) {

        var x = source.x + 10;
        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    }else {
        var x = source.x - 10;
        this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);

    }


    this.nextFire = this.game.time.time + this.fireRate;

};
