function GameGraph(){
	this.nodeTypes = ["ET","OU","ET//","OU//"];
	this.leafTypes = ["kill_all","survive","get_token"];
	this.foes = ["invader","invader2","boss"];
	this.weapon = ["Rockets","ScaleBullet","FrontAndBack","ThreeWay","EightWay","ScatterShot","Beam","SplitShot"]
	this.token = ["shield","health","life","weapon"];
	this.modele = null;


}


GameGraph.prototype.generateGraph = function(nbNodes,game){

	var gameTree = new SimpleGraph(true);

	this.generateRndNodes(gameTree,game,nbNodes);

	this.generateRndEdges(gameTree,game,nbNodes);
	
	this.generateRndLeaves(gameTree,game,nbNodes);

	var indexFinalBossBranch = gameTree.getOrder()+1;
	var bossNode = gameTree.addValuedNode(indexFinalBossBranch,{ type :this.nodeTypes[0]} )
	gameTree.addEdge(gameTree.getRoot(),bossNode);

	this.addRndLeavesToNode(gameTree, game, game.rnd.integerInRange(1, 3),bossNode);


	var indexFinalBoss =  gameTree.getOrder()+1;
	var boss = gameTree.addValuedNode(indexFinalBoss,{
		objective : this.leafTypes[0],
		total_dammaged : "0",
	    type : this.leafTypes[0],
	    vague : {
			numberEnemy : game.rnd.integerInRange(1, 2),
			type: this.foes[2],
			life: game.rnd.integerInRange(20, 40),
			speed: game.rnd.integerInRange(10, 30),
			weapon: this.weapon[game.rnd.integerInRange(0, this.weapon.length-1)]
		}});

	gameTree.addEdge(bossNode,boss);

	this.displayTree(gameTree);


	return gameTree;
}




GameGraph.prototype.generateRndNodes = function(gameTree,game, nbNodes){
	for (var i = 1; i <= nbNodes; i++) {
		var rndType = game.rnd.integerInRange(0, this.nodeTypes.length-1);
		if(i<=4){
			if(i==1){
				rndType = 0;
			}else{

				rndType = game.rnd.integerInRange(0, 3);
			}
			
		}
		gameTree.addValuedNode(i,{ type :this.nodeTypes[rndType]});
	}
}

GameGraph.prototype.generateRndEdges = function(gameTree,game, nbNodes){
	var rootNode = gameTree.getRoot();
	var nextIndex = 2; 
	for (var k = 1; k <= nbNodes; k++) {
		var currentNode = gameTree.getNode(k);
		var type = currentNode.getValue();
		var rndChilds=0;

		if(nextIndex<=nbNodes){
			rndChilds = this.rndChildNumber(type,nbNodes)
			for (var j = 0; j < rndChilds; j++) {
				
				var toAdd = gameTree.getNode(j+nextIndex);
				if(toAdd!=null){
					gameTree.addEdge(currentNode,toAdd);
				}
				
			}
			nextIndex = nextIndex+rndChilds;
		}
		
	}
}


GameGraph.prototype.addRndLeavesToNode=function(gameTree, game,currentNodeIndex){
	var currentNode = gameTree.getNode(currentNodeIndex);
	if(!currentNode.getNeighbors().hasNextNode()){
		var rndChilds = this.rndChildNumber(currentNode.getValue(),3);
					
		for (var o = 1; o <= rndChilds; o++) {
			var nextIndex = gameTree.getOrder()+1;

			gameTree.addValuedNode(nextIndex,this.generateRndLeaf(game));
			gameTree.addEdge(currentNode,gameTree.getNode(nextIndex));

		}
	}
}


GameGraph.prototype.generateRndLeaves = function(gameTree,game, nbNodes){
	for (var l = 1; l <= nbNodes; l++) {
		
		this.addRndLeavesToNode(gameTree, game,l);
	}
}

GameGraph.prototype.rndChildNumber= function(type,maxNumber){
	var rndChilds=0;
	
	rndChilds = game.rnd.integerInRange(2, maxNumber);

	
	return rndChilds;
}

GameGraph.prototype.displayTree = function(tree){
	initializeInterfaceFor1Graph(tree, "levelTree", 2000, 0, 800);
}



GameGraph.prototype.generateRndLeaf = function(game){
	var toReturn = {};
	var rndType = game.rnd.integerInRange(0, this.leafTypes.length-1);
	toReturn.objective = this.leafTypes[rndType];
	toReturn.total_dammaged = "0";
	toReturn.type = toReturn.objective;
	if(toReturn.objective === "get_token"){
		toReturn.token = {
			type: this.token[game.rnd.integerInRange(0, this.token.length-1)]
		}

		switch(toReturn.token.type) {
			case "weapon":
				toReturn.token.value = this.weapon[game.rnd.integerInRange(0, this.weapon.length-1)];
				break;
			case "shield":
				toReturn.token.value = game.rnd.integerInRange(25, 100)/100;
				break;
		}



	}else{

		toReturn.vague = {
			numberEnemy : game.rnd.integerInRange(1, 10),
			type: this.foes[game.rnd.integerInRange(0, this.foes.length-1)],
			life: game.rnd.integerInRange(1, 20),
			speed: game.rnd.integerInRange(10, 30),
			weapon: this.weapon[game.rnd.integerInRange(0, this.weapon.length-1)]
		}
		//cas du boss
	}
	
	return toReturn;

}