//Constructeur de SimpleGraph.
function SimpleGraph(directed)
{
	//Appel du constructeur du parent.
	AbstractSimpleGraph.call(this, directed);

	this.MatrixNode = {};								//Variable représentant la matrix contenant les noeuds avec leurs arc.
	this.order=0;										//Variable représentant l'ordre du graphe (Le nombre de noeud).
}
	
SimpleGraph.prototype = new AbstractSimpleGraph();		//Initialisation de l'héritage.


/********************** GRAPH OPERATIONS ************************************************/


SimpleGraph.prototype.getOrder = function()
{
	return this.order;
}

SimpleGraph.prototype.isDirected = function () 
{
	return this.directed;
}

/**
 *	Incrémente l'ordre du graphe.
 */
SimpleGraph.prototype.upOrder = function ()
{
	this.order++;
}

/**
 *	Diminue l'ordre du graphe.
 */
SimpleGraph.prototype.downOrder = function ()
{
	this.order--;
}

/**
 *	Renvoie la matrice du graphe.
 */
SimpleGraph.prototype.getMatrixNode = function()
{
	return this.MatrixNode;
}
/**
 *	Renvoie le noeud de la matrice du graphe à un id.
 *
 * @param id du noeud
 - @return le noeud à l'indice "id" dans la matrice
 */
SimpleGraph.prototype.getMatrixNodeWithId = function(id)
{
	return this.MatrixNode[id];
}

/**
 *	Ajoute un noeud dans la matrice.
 *
 *	@param id du noeud et le noeud
 */
SimpleGraph.prototype.setMatrixNode = function(id, node)
{
	this.MatrixNode[id]=node;
}

/**
 *	Supprime un noeud dans la matrice.
 *
 *	@param id du noeud
 */
SimpleGraph.prototype.deleteMatrixNode = function(id)
{
	delete this.MatrixNode[id];
}


/********************** NODES OPERATIONS ************************************************/

SimpleGraph.prototype.addNode = function(idGiven)
{
	return this.addValuedNode(idGiven, undefined);
}

SimpleGraph.prototype.addValuedNode = function (idGiven, valueGiven)
{
	if(idGiven <=0 || isNaN(idGiven) || parseInt(idGiven) != idGiven)
	{
		throw new InvalidIdException(idGiven);
	}

	if(this.getNode(idGiven) != null || this.getNode(idGiven) != undefined)
	{
		throw new AlreadyExistingNodeException(idGiven);
	}

	var copyNode = new NodeSimpleGraph(idGiven, valueGiven, {}, []);

	//Initialisation du noeud avec le noeud de copie.
	this.setMatrixNode(idGiven, copyNode);

	//Incrémentation de l'ordre du graphe.
	this.upOrder();

	return this.getMatrixNodeWithId(idGiven);
}

SimpleGraph.prototype.getNode = function(idGiven)
{
	if(idGiven <=0 || isNaN(idGiven) || parseInt(idGiven) != idGiven)
	{
		throw new InvalidIdException(idGiven);
	}
	return this.getMatrixNodeWithId(idGiven);
}


SimpleGraph.prototype.getRoot = function(){
	
	return this.getMatrixNodeWithId(1);
}



SimpleGraph.prototype.removeNode = function (node)
{
	if(!this.isNode(node))
	{
		throw new InvalidReferenceException("Noeud");
	}

	if(!this.nodeWithinGraph(node))
	{
		throw new UnexistingNodeException;
	}

	//Variable contenant l'indice du noeud.
	var idGiven = node.getId();

	var matrice = this.getMatrixNode();

	//On parcourt tous les noeuds du graphe, pour vérifier si il n'y pas d'arc qui se dirige vers le noeud à supprimer.
	for(var i in matrice)
	{
		//Variable correspond à un noeud du graphe.
		var currentNode = this.getNode(i);

		//Variable correspond au numéros de l'arc.
		var idEdge=0;

		if(currentNode.getDegree() > 0)
		{
			if(currentNode.getNeighborsEdgeWithId(idGiven) != undefined && currentNode.getNeighborsEdgeWithId(idGiven) != null)
			{
				//On supprime l'arc dans "neighborsEdge".
				this.removeEdge(currentNode, node);
			}
		}
	}

	//Désalocation du noeud dans le graphe.
	this.deleteMatrixNode(idGiven);

	//Décrémentation de l'ordre du graphe.
	this.downOrder();
}

SimpleGraph.prototype.resetNodesValue = function (valueGiven)
{
	var matrice = this.getMatrixNode();

	for(var i in matrice)
	{
		//i représente l'id du noeud, et on récupre ce noeud grâce au get.
		this.getNode(i).setValue(valueGiven);
	}
}





/********************** EDGES OPERATIONS ************************************************/

/*
 * Renvoie vraie si l'argument donné est un noeud, faux sinon.
*/
SimpleGraph.prototype.isNode = function(node)
{
	//On test si "node" est une instance de Node.
	return node instanceof NodeSimpleGraph;
}

/*
 * Renvoie vraie si les 2 noeuds donnés sont dans le même graphe, faux sinon.
 * 
 * @param 2 noeuds qui ont comme référence node
 * @return vraie si les 2 noeuds donnés sont dans le même graphe, faux sinon.
*/
SimpleGraph.prototype.nodesWithinGraphAndSameGraph = function(sourceNode, destNode)
{
	return (this.nodeWithinGraph(sourceNode) && this.nodeWithinGraph(destNode));
}

/*
 * Renvoie vraie si les le noeud donné est dans le graphe, faux sinon.
 * 
 * @param un noeud qui a comme référence node.
 * @retrun vraie si le noeud donné est dans le graphe, faux sinon.
*/
SimpleGraph.prototype.nodeWithinGraph = function (node)
{
	var idGiven = node.getId();
	return (this.getNode(idGiven) != null && this.getNode(idGiven) != undefined && this.getNode(idGiven)===node);
}

/*
 * Renvoie vraie si le poid donné est correct, faux sinon.
 *
 * @param un poid
 * @return vraie si le poid donné est correct, faux sinon.
*/
SimpleGraph.prototype.isWeight = function(weight)
{
	return (!isNaN(weight) || weight===undefined || weight===null);
}

/*
 * Fonction permettant de savoir si il ya un arc entre sourceNode et destNode, faux sinon.
 *
 * @param 2 noeuds
 * @return vraie si il ya un arc entre sourceNode et destNode, faux sinon.
*/
SimpleGraph.prototype.edgeExist = function(sourceNode, destNode)
{
	//Variables correspondant au id des noeuds.
	var idSource = sourceNode.getId();
	var idDest = destNode.getId();

	//Cas d'un arc inexistant.
	if( this.getNode(idSource).getNeighborsEdgeWithId(idDest) === null || this.getNode(idSource).getNeighborsEdgeWithId(idDest) === undefined)
	{
		return false;
	}
	else
	{
		//Cas d'un arc existant.
		return true;
	}
}

SimpleGraph.prototype.addEdge = function (sourceNode, destNode)
{
	return this.addWeightedEdge(sourceNode, destNode, undefined);
}

SimpleGraph.prototype.doAddWeightedEdge = function(sourceNode, destNode, idSource, idDest, weight)
{
	//Initialisation de l'arc.
	var copyEdge = {
		destId: idDest, weight: weight
	};

	//Initialisation du nouvel arc.
	this.getNode(idSource).setNeighborsEdge(idDest, copyEdge);

	//Initialisation de la clé contenant le voisin.
	this.getNode(idSource).setNeighborsId(this.getNode(idSource).getNeighborsId().length, destNode);

	//Incrémentation du degré pour le noeud, "sourceNode".
	sourceNode.upDegree();
}

SimpleGraph.prototype.addWeightedEdge = function(sourceNode, destNode, weight) 
{
	if(!this.isNode(sourceNode) || !this.isNode(destNode))
	{
		throw new InvalidReferenceException("Noeud");
	}

	if(!this.isWeight(weight))
	{
		throw new InvalidReferenceException("Poid");
	}

	if(!this.nodesWithinGraphAndSameGraph(sourceNode, destNode))
	{
		throw new UnexistingNodeException;
	}

	if(this.edgeExist(sourceNode, destNode))
	{
		throw new AlreadyExistingEdgeException;
	}

	//Variables correspondant au id des noeuds.
	var idSource = sourceNode.getId();
	var idDest = destNode.getId();

	this.doAddWeightedEdge(sourceNode, destNode, idSource, idDest, weight);

	if(!this.isDirected())
	{
		//Si "sourceNode" et "destNode" sont égaux alors on serait dans le cas d'un arc pointant sur le même noeud.
		//Sachant que la fonction addWeightedEdge a déjà ajouté un arc dans le cas d'un graphe orienté.
		//On serait en train de rajouté un deuxieme arc qui pointerait sur le même noeud.
		//D'ou le test de différenciation entre les 2 noeuds donnés en argument.
		if(sourceNode != destNode)
		{
			this.doAddWeightedEdge(destNode, sourceNode, idDest, idSource, weight);
		}
	}
}

SimpleGraph.prototype.getEdgeWeight = function (sourceNode, destNode) 
{
	if(!this.isNode(sourceNode) || !this.isNode(destNode))
	{
		throw new InvalidReferenceException("Noeud");
	}

	if(!this.nodesWithinGraphAndSameGraph(sourceNode, destNode))
	{
		throw new UnexistingNodeException;
	}

	//Variables correspondant au id des noeuds.
	var idSource = sourceNode.getId();
	var idDest = destNode.getId();

	//Cas d'un arc inexistant.
	if( this.getNode(idSource).neighborsEdge[idDest] === null || this.getNode(idSource).neighborsEdge[idDest] === undefined)
	{
		throw new UnexistingEdgeException;
	}
	else
	{
		//Cas d'un arc existant.
		return this.getNode(idSource).getNeighborsEdgeWithId(idDest)["weight"];
	}
}

SimpleGraph.prototype.setEdgeWeight = function (sourceNode, destNode, weight)
{
	if(!this.isNode(sourceNode) || !this.isNode(destNode))
	{
		throw new InvalidReferenceException("Noeud");
	}

	if(!this.nodesWithinGraphAndSameGraph(sourceNode, destNode))
	{
		throw new UnexistingNodeException;
	}

	if(!this.isWeight(weight))
	{
		throw new InvalidReferenceException("Poid");
	}

	if(!this.edgeExist(sourceNode, destNode))
	{
		throw new UnexistingEdgeException;
	}

	//Variables correspondant au id des noeuds.
	var idSource = sourceNode.getId();
	var idDest = destNode.getId();

	//Dans le cas d'un arc existant, on affecte la nouvelle valeur du poid de l'arc.
	this.getNode(idSource).getNeighborsEdgeWithId(idDest).weight=weight;

	//Dans le cas d'un graphe non orienté, on affecte le poid de l'arc partant de destNode.
	if(!this.isDirected())
	{
		this.getNode(idDest).getNeighborsEdgeWithId(idSource).weight=weight;
	}
}

SimpleGraph.prototype.removeEdge = function (sourceNode, destNode)
{
	if(!this.isNode(sourceNode) || !this.isNode(destNode))
	{
		throw new InvalidReferenceException("Noeud");
	}

	if(!this.nodesWithinGraphAndSameGraph(sourceNode, destNode))
	{
		throw new UnexistingNodeException;
	}

	if(!this.edgeExist(sourceNode, destNode))
	{
		throw new UnexistingEdgeException;
	}

	//Variables correspondant au id des noeuds.
	var idSource = sourceNode.getId();
	var idDest = destNode.getId();

	this.doRemoveEdge(sourceNode, destNode, idSource, idDest);

	if(!this.isDirected())
	{
		//Si sourceNode et destNode sont égaux, 
		//Et si le graph n'est pas orienté, on serait entrain de supprimer l'arc entre destNode et sourceNode
		//Et comme on a déjà supprimer l'arc entre sourceNode et destNode, on diminurait 2 fois le degré du noeud au lieu d'une seule fois.
		//D'ou le test de différenciation.
		if(sourceNode != destNode)
		{
			this.doRemoveEdge(destNode, sourceNode, idDest, idSource);
		}
	}
}

SimpleGraph.prototype.doRemoveEdge = function(sourceNode, destNode, idSource, idDest)
{
	//Désolocation de l'arc dans le graphe.
	this.getNode(idSource).deleteNeighborsEdge(idDest);

	//Variable correspondant au numéros de l'arc à supprimer.
	var idEdgeToDelete=0;

	//Initialisation de l'iterateur.
	var neighborIterator = sourceNode.getNeighbors();

	//Variable correspond à la position de l'arc dans le voisinage de "sourceNode".
	var position = 0;

	//Variable permettant de savoir si l'arc à supprimer a été trouvé.
	var found = false;

	//Tant qu'on a pas trouvé la position de l'arc à supprimer dans "sourceNode", on boucle.
	while(neighborIterator.hasNextNode() && !found)
	{
		var currentNode = neighborIterator.getNextNode();
		
		//Si on a trouvé la postion de l'arc à supprimer dans "sourceNode", on stock sa position.
		if(currentNode.getId() == idDest)
		{
			found=true;
			position=idEdgeToDelete;
		}
		else
		{
			//Sinon on passe à l'arc suivant.
			idEdgeToDelete++;
		}
	}

	//On réinitialise l'itérateur, pour commence au début.
	neighborIterator = sourceNode.getNeighbors();

	//On alloue un nouveau tableau contenant les voisin de noeud.
	var newNeighborsId = new Array(sourceNode.getDegree()-1); 

	//Variable perméttant de parcourir les arcs de "sourceNode".
	var idEdge=0;

	while(neighborIterator.hasNextNode())
	{
		var currentNode = neighborIterator.getNextNode();

		//Si idEdge est inférieur à idEdgeToDelete, alors on peut stocker l'arc dans le nouveau tableau.
		if(idEdge<idEdgeToDelete)
		{
			newNeighborsId[idEdge]=currentNode;
		}

		//On vient de dépasser idEdgeToDelete, donc on peut stocker tous les arcs suivants.
		if(idEdge>idEdgeToDelete)
		{
			newNeighborsId[idEdge-1]=currentNode;
		}
		idEdge++;
	}

	//Affection du nouveau tableau à "sourceNode".
	sourceNode.neighborsId=newNeighborsId;

	//Diminution du degree du noeud.
	sourceNode.downDegree();
}

SimpleGraph.prototype.resetEdgesWeight = function (weight) 
{
	var matrice = this.getMatrixNode();

	for(var i in matrice)
	{
		var currentNode = this.getNode(i);

		for(var edge in currentNode.neighborsEdge)
		{
			currentNode.getNeighborsEdgeWithId(edge).weight = weight;
		}
	}
}