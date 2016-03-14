function GameGraph(){
	this.nodeTypes = ["ET","ET//","OU","OU//","FIRST", "LAST" ,"OPTIONNAL","NOT"];
	this.leafTypes = ["KILL","SURVIVE","GET_TOKEN"];
}


GameGraph.prototype.generateGraph = function(nbNodes,game){

	var gameTree = new SimpleGraph(true);

	for (var i = 1; i <= nbNodes; i++) {
		var rndType = game.rnd.integerInRange(0, this.nodeTypes.length-1);
		while((this.nodeTypes[rndType]==="OPTIONNAL" || this.nodeTypes[rndType]==="NOT")&& i===1){
			rndType = game.rnd.integerInRange(0, this.nodeTypes.length-1);
		}
		

		gameTree.addValuedNode(i,this.nodeTypes[rndType]);
		

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
				var rndType = game.rnd.integerInRange(0, this.leafTypes.length-1);
				gameTree.addValuedNode(nextIndex,this.leafTypes[rndType]);
				gameTree.addEdge(currentNode,gameTree.getNode(nextIndex));

			}
		}
	}
	this.displayTree(gameTree);
	return gameTree;
}


GameGraph.prototype.rndChildNumber= function(type,maxNumber){
	var rndChilds=0;
	if(type !== "NOT" && type!== "OPTIONNAL"){
		rndChilds = game.rnd.integerInRange(2, maxNumber);

	}else{
		rndChilds = game.rnd.integerInRange(1,maxNumber);
	}
	return rndChilds;
}

GameGraph.prototype.displayTree = function(tree){
	initializeInterfaceFor1Graph(tree, "levelTree", 2000, 0, 800);
}
