//Contructeur NodeSimpleGraph
function NodeSimpleGraph(id, value, neighborsEdge, neighborsId)
{
	//Appel du cosntructeur parent.
	AbstractNode.call(this);

	this.id=id;								//Variable représentant l'id du noeud.
	this.value=value;						//Variable représentant la valeur du noeud.
	this.neighborsEdge = neighborsEdge;		//Variable représentant les arcs du noeud. 
	this.neighborsId = neighborsId;			//Tableau contenant la référence sur chaque voisin du noeud.
	this.degree=0;							//Variable représentant le degré du noeud.
}

NodeSimpleGraph.prototype = new AbstractNode();		//Initiasation de l'héritage.


/************************* FONCTION  **********************************/

NodeSimpleGraph.prototype.getId = function () 
{
	return this.id;
}

NodeSimpleGraph.prototype.getDegree = function () 
{
	return this.degree;
}

NodeSimpleGraph.prototype.getValue = function () 
{
	return this.value;
}

NodeSimpleGraph.prototype.setValue = function (valueGiven)
{
	this.value = valueGiven;
}

/*
 * Fonction permettant d'incrémenter le degré d'un noeud.
*/
NodeSimpleGraph.prototype.upDegree = function ()
{
        this.degree++;
}

/*
 * Fonction permettant de diminuer le degré d'un noeud.
*/
NodeSimpleGraph.prototype.downDegree = function ()
{
        this.degree--;
}

NodeSimpleGraph.prototype.getNeighbors = function()
{
	var it = new NodeIterator(this.neighborsId, this.degree);
	return it;
}

/*
 * Fonction qui renvoie le tableau neigbborId.
 */
NodeSimpleGraph.prototype.getNeighborsId = function ()
{
	return this.neighborsId;
}

/*
 * Fonction qui renvoie le tableau neighborsEdge.
 */
NodeSimpleGraph.prototype.getNeighborsEdge = function ()
{
	return this.neighborsEdge;
}

/*
 * Fonction qui renvoie le l'arc à un certain id.
 *
 * @param id
 * @return l'arc à l'id donnée
 */
NodeSimpleGraph.prototype.getNeighborsEdgeWithId = function (id)
{
	return this.neighborsEdge[id];
}

/*
 * Fonction qui ajoute un arc au noeud.
 *
 * @param id et l'arc
 */
 NodeSimpleGraph.prototype.setNeighborsEdge = function(id, edge)
 {
 	this.neighborsEdge[id]=edge;
 }

 /*
 * Fonction qui ajoute un voisin au noeud.
 *
 * @param id et le voisin
 */
 NodeSimpleGraph.prototype.setNeighborsId = function(id, neighbor)
 {
 	this.neighborsId[id]=neighbor;
 }

/*
 * Fonction permettant de supprimer un neighbor dans le tableau neighborsId.
 *
 * @param id
 * @return true si le neighbor a bien été supprimé, false sinon.
*/
NodeSimpleGraph.prototype.deleteNeighborsId = function(id)
{
	delete this.neighborsEdge[id];
}

/*
 * Fonction permettant de supprimer un arc dans le tableau neighborsEdge.
 *
 * @param id
 * @return true si l'arc a bien été supprimé, false sinon.
*/
NodeSimpleGraph.prototype.deleteNeighborsEdge = function(id)
{
	delete this.getNeighborsEdge()[id];
}

/*
 * Fonction permettant d'incrémenter le degré d'un noeud.
*/
NodeSimpleGraph.prototype.upDegree = function ()
{
	this.degree++;
}

/*
 * Fonction permettant de diminuer le degré d'un noeud.
*/
NodeSimpleGraph.prototype.downDegree = function ()
{
	this.degree--;
}