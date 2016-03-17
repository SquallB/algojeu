var interfaceTools = {
	/*
	 *	Fonction perméttant de cacher/afficher la vue table ou texte
	 *
	 *	@param l'identiant du modèle et l'option de l'affichage ("hidden" caché et "visible" visible).
	*/
	handleDisplayViewTableText : function(div_, optionTable, optionText) {
			$("#"+div_+"tableView").css("visibility", optionTable);
        	$("#"+div_+"textView").css("visibility", optionText);
	}

};




/*
 *	Fonction perméttant d'initialiser les différentes vues pour 2 deux graphes
 *
 *	@param graphe n°1, graphe n°2, identifiant du graphe n°1, identifiant du graphe n°2, hauteur de la zone de dessins svg, psition x et y du svg.
 *
 */
var initializeInterfaceFor2Graph = function(g1, g2, divName1_, divName2_, heightSvg_, xSvg_, ySvg_) {
	$("h1").remove();
	var title = $("<h1></h1>");
	$(title).html("AlgoView CallGraph 		<font size='2'><a href='./tests/testAllGraph.html'>Exemples de graphes</a></font>");
	$("body").prepend(title);

	//Variable perméttant de savoir si la représentation graphique a été dessiné.
	var modele2IsDraw=false;
	//Boutton perméttant de choisir le graphe
	var divChooseGraph = $("<input></input>");
	$(divChooseGraph).attr("type", "button").attr("id", "chooseGraph").attr("value", divName1_).attr("name", "chooseGraph");
	$("body").append(divChooseGraph);

	//Boutton permétant de choisir la vue tableView ou textView.
	var buttonChoose = $("<input></input>");
	$(buttonChoose).attr("type", "button").attr("id", "chooseView").attr("value", "textView").attr("idView", divName1_+"tableView");
	$("body").append(buttonChoose);

 	var chooseCodeGraph = $("<input></input>");
    $(chooseCodeGraph).attr("type", "button").attr("id", "chooseCodeGraph").attr("value", "See your code");
    $("body").append(chooseCodeGraph);

	//Initialisation du premier modele, sans déssiner les différentes vues.
	var modele1 = new ConcreteGraph(xSvg_, ySvg_, g1, heightSvg_, 50, divName1_, divName1_, divName2_);
	modele1.addView(new graphView(xSvg_, ySvg_, modele1, g1, heightSvg_));
	modele1.addView(new textView(g1, divName1_, modele1));

	//Varibale représentant le code de l'utilisateur.
	var programCodeHtml = $("#programCode").html();
	$("#programCode").remove();

	//Initialisation du second modèle, sans déssiner les différentes vues.
	var modele2 = new ConcreteGraph(xSvg_, ySvg_, g2, heightSvg_+1, 50, divName2_, divName1_, divName2_);
	modele2.addView(new graphView(xSvg_, ySvg_, modele2, g2, heightSvg_+1));
	modele2.addView(new textView(g2, divName2_, modele2));

	var svg = $("svg");
	//Boucle perméttant de classer les différentes feuilles de déssins svg dans une div.
	for(var i=0; i<svg.length; i++) {
		if(parseInt(svg[i].getAttribute("height")) === heightSvg_) {
			$("#"+divName1_+"graphView").append(svg[i]);
		}else {
			$("#"+divName2_+"graphView").append(svg[i]);
		}
	}

	//Initialisation du choix du graphe
	modele1.setStatusChooseGraph(divName1_);
	modele2.setStatusChooseGraph(divName1_);

	//Initilisation de l'affichage des vues.
	$("#"+divName1_+"tableView").css("visibility", "hidden");	//On cache que la vue tableView du premier graphe
	$("."+divName2_).css("visibility", "hidden");				//Les vues du deuxieme graphe sont complétements cachées

	var valueChooseGraph = divName1_;		//Variable représentant l'id du graphe choisi
	var chooseViewTextTable = "textView";	//Variable représentant quelle vue texte a été choisie (textView ou tableView)

	/*
	 *	Fonction perméttant de cacher toutes les vues d'un modèle
	 *
	 *	@param l'identifiant du modèle
	 *
	 */
	var hiddenAllView = function (div_) {
		$("."+div_).css("visibility", "hidden");
        interfaceTools.handleDisplayViewTableText(div_, "hidden", "hidden");
	}

	/*
	 *
	 * Fonction perméttant de cacher tous les modèles et leurs vues
	 *
	 *	@param l'identifiant du modèle
	 */
	var hiddenAllModele = function(div_) {
		$("."+div_+"").css("visibility", "hidden");
	}

	/*
	 *	Fonction perméttant de savoir quelle vue texte(textView ou tableView) à afficher après avoir changé de graphe
	 *
	 *	@param l'identifiant du modèle et la valeur de la vue choisie
	 *
	 */
	var handleViewTextTableAfterSwitch = function (div_, chooseView) {
		if(chooseView === "tableView") {
        	interfaceTools.handleDisplayViewTableText(div_, "visible", "hidden");
        }else {
        	interfaceTools.handleDisplayViewTableText(div_, "hidden", "visible");
        }
	}

	/*
	 *	Fonction perméttant d'afficher le graphe choisi et ses vues.
	 */
	var handleChooseGraph = function (ev)
	{
		if($("#chooseCodeGraph").attr("value") === "See your code") {
		    if(String(ev.target.value) === divName1_) {
		        $("."+divName2_).css("visibility", "visible");
		        handleViewTextTableAfterSwitch(divName2_, chooseViewTextTable);
		        hiddenAllView(divName1_);
		        modele1.setStatusChooseGraph(divName2_);
		        modele2.setStatusChooseGraph(divName2_);
		        ev.target.value = divName2_;
		    }else {
		        $("."+divName1_).css("visibility", "visible");
		        handleViewTextTableAfterSwitch(divName1_, chooseViewTextTable);
		        hiddenAllView(divName2_);
		        modele1.setStatusChooseGraph(divName1_);
		        modele2.setStatusChooseGraph(divName1_);
		        ev.target.value = divName1_;
		    }

		    //On déssine le modele2 (ProgrammTree), pour éviter d'avoir un long chargement du dessin du graphe.
		    if(!modele2IsDraw) {
		    	//On met à jours ses vues.
		    	modele2.notifyObservers();
		    	modele2IsDraw=true;

		    	//On cache une des deux vues texte, selon la vue texte précédemment sélectionnée.
		    	if( $("#chooseView").attr("value") === "tableView") {
					interfaceTools.handleDisplayViewTableText(divName2_, "visible", "hidden");
			    	} else{
						interfaceTools.handleDisplayViewTableText(divName2_, "hidden", "visible");
			    	}

			    	modele2.setStatusChooseGraph($("#chooseGraph").attr("value"));

			    	var defs= $("<defs></defs>");
			    	var pathDiv = $("<path></path>");
			    	$(pathDiv).attr("id", "raphael-marker-classic").attr("stroke-linecap", "round").attr("d", "M5,0 0,2.5 5,5 3.5,3 3.5,2z");
			    	var markerDiv = $("<marker></marker>");
			    	$(markerDiv).attr("id", "raphael-marker-endclassic33").attr("markerHeight", "3").attr("markerWidth", "3").attr("orient", "auto").attr("refX", "1.5").attr("refY", "1.5");
			    	var useDiv = $("<use></use>");
			    	$(useDiv).attr("href", "#raphael-marker-classic").attr("transform", "rotate(180 1.5 1.5) scale(0.6,0.6)").attr("stroke-width", "1.6667").attr("fill", "#000000").attr("stroke", "none");

			    	$(defs).append(pathDiv);
			    	$(markerDiv).append(useDiv);
			    	$(defs).append(markerDiv);
			    	console.log(defs);
			    	var svgDiv = $("svg");
			    }
	        valueChooseGraph = ev.target.value;
	    }
	}
	$("#chooseGraph").on("click", handleChooseGraph);


	var programCodeDiv = $("<div></div>");
	$(programCodeDiv).attr("id", "programCode");
	$(programCodeDiv).css("color", "white");
	$(programCodeDiv).css("background-color", "#1447E9");
	/*
	 *
	 *	Fonction perméttant d'afficher le code de l'utilisateur ou le graphe
	 *
	 */
    var handleChooseCodegraph = function(ev) {
        if(ev.target.value === "See your code") {
        	hiddenAllView(divName1_);
        	hiddenAllView(divName2_);
        	$("body").append(programCodeDiv)
        	$(programCodeDiv).html(programCodeHtml);
        	ev.target.value = "See CallGraph";
        }else {
        	$("#programCode").remove();
        	if($(divChooseGraph).attr("value") === divName1_) {
        		$("."+divName1_+"").css("visibility", "visible");	
        		if($(buttonChoose).attr("value") === "tableView") {
        			interfaceTools.handleDisplayViewTableText(divName1_, "visible", "hidden");
        		}else {
        			interfaceTools.handleDisplayViewTableText(divName1_, "hidden", "visible");
        		}
        	} else {
        		$("."+divName2_+"").css("visibility", "visible");
        		if($(buttonChoose).attr("value") === "textView") {
        			interfaceTools.handleDisplayViewTableText(divName2_, "visible", "hidden");
        		}else {
        			interfaceTools.handleDisplayViewTableText(divName2_, "hidden", "visible");
        		}
        	}
        	ev.target.value = "See your code";
        }
    }
    $("#chooseCodeGraph").on("click", handleChooseCodegraph);

	/*
	 *	Fonction perméttant d'afficher la vue texte (textView et tableView) choisi.
	 */
	var handleChooseViewTextTable = function(ev) {
		if($("#chooseCodeGraph").attr("value") === "See your code") {
				if(String(ev.target.value) === "textView" ) {
				//Affichage du tableView correspond au graphe choisi
				interfaceTools.handleDisplayViewTableText(valueChooseGraph, "visible", "hidden");
				ev.target.value = "tableView";
			}else {
				//Affichage du textView correspond au graphe choisi
				interfaceTools.handleDisplayViewTableText(valueChooseGraph, "hidden", "visible");
				ev.target.value = "textView";
			}
			chooseViewTextTable = ev.target.value;
		}
	}
	$("#chooseView").on("click", handleChooseViewTextTable);


	//Initialisation des vues du premier modèle.
	modele1.notifyObservers();
	//On cache une des deux vues texte, selon la vue texte précédemment sélectionnée.
	if( $("#chooseView").attr("value") === "tableView") {
		interfaceTools.handleDisplayViewTableText(divName1_, "visible", "hidden");
	} else{
		interfaceTools.handleDisplayViewTableText(divName1_, "hidden", "visible");
	}
}


/*
 *	Fonction perméttant d'initialiser les différentes vues pour un graphe
 *
 *	@param graphe, identifiant du graphe , hauteur de la zone de dessins svg, psition x et y du svg.
 *
 */
var initializeInterfaceFor1Graph = function(graph, nameGraph, heightSvg, xSvg, ySvg) {
	/*
	 *	Fonction perméttant d'afficher la vue texte (textView et tableView) choisi
	 */
	
	$("#"+nameGraph+"textView").empty();
	var svg = $("svg");
	svg.empty();

	var modele = new ConcreteGraph(xSvg, ySvg, graph, heightSvg, 5	, nameGraph, nameGraph);
		modele.addView(new graphView(xSvg, ySvg, modele, graph, heightSvg));
		modele.addView(new textView(graph, nameGraph, modele));
		modele.notifyObservers();

	
	//Boucle perméttant de classer les différentes feuilles de déssins svg dans une div.
	for(var i=0; i<svg.length; i++) {
		if(parseInt(svg[i].getAttribute("height")) === heightSvg) {
			$("#"+nameGraph+"graphView").append(svg[i]);
		}
	}


}