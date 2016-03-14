//Constructeur de SubjectGraph.
function SubjectGraph(directed)
{
	this.views = [];
}

/***************************************** VIEWS FUNCTION *****************************************/
/*
 *	Fonction perméttant d'ajouter une vue.
 *	
 *	@param une vue qui hérite de la classe AbstractView.
 */
SubjectGraph.prototype.addView = function(view) 
{
	this.views.push(view);
}

/*
 *	Fonction perméttant de supprimer une vue.
 *	
 *	@param une vue qui hérite de la classe AbstractView.
 */
SubjectGraph.prototype.removeView = function(view)
{
	for(var i=0; i<this.views.length; i++)
	{
		if(this.views[i] === view)
		{
			delete this.view[i];
		}
	}
}

/*
 *	Fonction permettant de mettre à jour les différentes vues sur le graphe.
 *
 *	@param un sujet, (ici le suejt est un graph)
 */
SubjectGraph.prototype.notifyObservers = function (graph, root)
{
	for(var i=0; i<this.views.length; i++)
	{
		this.views[i].refresh(graph, root);
	}
}

/*
 *  Fonction qui renvoie le tableau des vues
 *
*/
SubjectGraph.prototype.getViewSubject = function (id)
{
    return this.views[id];
}