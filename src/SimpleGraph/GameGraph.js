function GameGraph(){
	this.nodeTypes = ["ET","ET//","OU","OU//"];
	this.leafTypes = ["kill_all","survive","get_token"];
	this.foes = ["invader","invader2","boss"];
	this.weapon = ["Rockets","ScaleBullet","SingleBullet","FrontAndBack","ThreeWay","EightWay","ScatterShot","Beam","SplitShot"]
	this.token = ["shield","health","life","weapon"];
}


GameGraph.prototype.generateGraph = function(nbNodes,game){

	var gameTree = new SimpleGraph(true);

	for (var i = 1; i <= nbNodes; i++) {
		var rndType = game.rnd.integerInRange(0, this.nodeTypes.length-1);
		gameTree.addValuedNode(i,{ type :this.nodeTypes[rndType]});
	}
	var rootNode = gameTree.getNode(1);
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

	for (var l = 1; l <= nbNodes; l++) {
		var currentNode = gameTree.getNode(l);
		if(!currentNode.getNeighbors().hasNextNode()){
			var rndChilds = this.rndChildNumber(currentNode.getValue(),5);
			for (var o = 1; o <= rndChilds; o++) {
				var nextIndex = gameTree.getOrder()+1;

				

				gameTree.addValuedNode(nextIndex,this.generateRndLeaf(game));
				gameTree.addEdge(currentNode,gameTree.getNode(nextIndex));

			}
		}
	}
	this.displayTree(gameTree);
	return gameTree;
}

GameGraph.prototype.generateRndNodes = function(Tree, nbNodes){

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
				toReturn.token.value = game.rnd.integerInRange(0, 1);
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