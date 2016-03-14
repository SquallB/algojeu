//Constructeur de NodeIterator
function NodeIterator(neighbors, degree)
{
	//Appel du constructeur parent.
	AbstractNodeIterator.call(this);

	this.degree = degree;
	this.ind = 0;										//Variable représentant, l'avancement du parcourt des voisins d'un noeud. (Elle augmente suivant l'acroissement du degré du noeud)
	this.neighbors = neighbors;							//Objets contenant les références sur les voisins du noeud.
}

NodeIterator.prototype = new AbstractNodeIterator();	//Initialisation de l'héritage.


/************************* FUNCTION ********************************/

NodeIterator.prototype.hasNextNode = function ()
{
	if(this.neighbors != null && this.neighbors != undefined &&this.neighbors[this.ind]!= undefined && this.neighbors[this.ind]!= null && this.ind < this.degree)
	{
		return true;
	}
	else
	{
		return false;
	}
}

NodeIterator.prototype.getNextNode = function ()
{
	var node = this.neighbors[this.ind];
	this.ind++;

	return node;
}

NodeIterator.prototype.resetInd = function ()
{
	this.ind=0;
}