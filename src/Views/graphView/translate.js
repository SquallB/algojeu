//Constructeur de translate
function translateGraph(modeleGiven, svg_, view)
{
	var thisTranslate = this;

	//Variable représentant l'ensemble des figures.
	var set = modeleGiven.getSet();
	this.getSet = function ()
	{
		return set;
	};

	this.translateSet = function(xGiven, yGiven)
	{
		set.translate(xGiven, yGiven);

	}

	//Variable perméttant de savoir l'utilisateur est en train de déplacer un noeud.
	var dragging;
	this.getDragging = function ()
	{
		return dragging;
	};
	this.setDragging = function (bool)
	{
		dragging = bool;
	};

	//Variables correspond au coordonnées initale de l'ensemble des figures.	
	var tx = 0,
		ty = 0;
	this.getTx = function ()
	{
		return tx;
	};
	this.setTx = function(txG)
	{
		tx = txG
	}

	this.getTy = function ()
	{
		return ty;
	};
	this.setTy = function(tyG)
	{
		ty = tyG;
	};
    

	/*
	 *	Function perméttant de savoir si l'utilsateur à cliqué sur la zone de dessins
	 */
	this.isClickOnSvgOrPath = function (event)
	{
		return event.target.nodeName ==="svg" || event.target.nodeName ==="path";
	}

	/*
	 *	Fonction perméttant d'initialiser la translation du graphe.
	 */
	var handleTranslateDown = function(event) {
	    if ( thisTranslate.isClickOnSvgOrPath(event) )
	    {
	    	//Si la transformation est activée, on modifie les coordonnées de l'ensemble contenant les figures.
	        thisTranslate.setTx(event.screenX);
	        thisTranslate.setTy(event.screenY);

	        //On initialise la variable draggin à true. (L'utilisateur est train de déplacer la représentation)
	        thisTranslate.setDragging(true);
	    }
	}

	/*
	 *	Fonction perméttant de translater le graphe suivant le mouvement de la souris
	 */
	var handleTranslateMove = function(event) {
		if (thisTranslate.isClickOnSvgOrPath(event) && thisTranslate.getDragging() ) {
	    	//On éffectue un déplacement de la représentation, en fonction de sa position initiale et de départ
	        thisTranslate.translateSet(event.screenX - thisTranslate.getTx(), event.screenY - thisTranslate.getTy());

	        //On initialise la nouvelle position de l'ensemble de figure.
			thisTranslate.setTx(event.screenX);
	        thisTranslate.setTy(event.screenY);

	        //On redéssine les arcs durant le déplacement du graphe
	        for(var i=0; view.getConnections().length; i++) 
            {
                view.getRaphael().connection(view.getConnections()[i]);
            }
	        
	    }
	}

	/*
	 *	Fonction perméttant d'arrêter la translation du graphe.
	 */
	var handleTranslateUp = function() {
	    //On initialise la variable draggin à false. (L'utilisateur n'est plus train de déplacer la représentation)
        thisTranslate.setDragging(false);

	}

	/*
	 *	Function perméttant d'ajouter des écoueurs sur la zone de déssin donné
	 *	
	 *	@param: zone de dessins
	 */
	var addListnerMouseDMU = function(object) {
		$(object).on('mousedown', handleTranslateDown);
		$(object).on('mousemove', handleTranslateMove);
		$(object).on('mouseup', handleTranslateUp);
	}

	/*
	 *	Function perméttant de supprimer des écoueurs sur la zone de déssin donné
	 *	
	 *	@param: zone de dessins
	 */
	var removeListnerMouseDMU = function (object) {
		$(object).off('mousedown', handleTranslateDown);
		$(object).off('mousemove', handleTranslateMove);
		$(object).off('mouseup', handleTranslateUp);
	}

	/*
	 *	Function perméttant de savoir si on est sur la bonne zone de dessin
	 *
	 *	@return vrai si on est sur la bonne zone de dessin, faux sinon
	 */
 	var isTheGoodSvg = function (object) {
 		return parseInt(object.getAttribute("height")) === svg_.height;
 	}

 	/*
 	 *	Fontion perméttant de configuré l'ajout ou la suppression des écouteurs sur les zones de déssins
 	 *
 	 *	@param Les zones de svg
 	 */
 	var handleListnerOnSvg = function (svg) {
		for(var i=0; i<svg.length; i++) {
			if(isTheGoodSvg(svg[i]) && modeleGiven.isTheGoodGraph()) {
				addListnerMouseDMU(svg[i]);
			}else {
				removeListnerMouseDMU(svg[i]);
			}
		}	
 	}

	var svg = $("svg");
	handleListnerOnSvg(svg);
	
	/*
	 *	Fonction perméttant d'activé la translation, si le graphe choisi correspond au graphe courant.
	 *
	 *	@param le boutton
	 */
	var handleVarChooseGraph = function (ev) {
        handleListnerOnSvg(svg);
    };
    $("#chooseGraph").on("click", handleVarChooseGraph);
}