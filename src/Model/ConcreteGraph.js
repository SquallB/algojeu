//Constructeur de ConcreteGraph.
function ConcreteGraph(xGiven, yGiven, graphGiven, heightSvg, strokeGiven, graphName_, firstGraph_, secondGraph_) 
{
	SubjectGraph.call(this);

    var thisConcrete = this;

    //Variable correspond au premier graphe choisi
    var firstGraph = firstGraph_;
    this.getFirstGraph = function () {
        return firstGraph
    }

    //Variable correspond au deuxième grahe.
    var secondGraph = secondGraph_;
    this.getSecondGraph = function () {
        return secondGraph_;
    }

    //Variable correspondant au div modèle.
    var divModele = $("<div></div>");
    $(divModele).addClass(graphName_);
    $("body").append(divModele);

    this.getDivModele = function() {
        return divModele;
    }

    //Variable représentant le nom du graphe.
    var graphName = graphName_;
    this.getNameGraph = function ()
    {
        return graphName;
    }

    //Variable qui permet de savoir quel graphe a été choisi.
    var chooseGraph = firstGraph; 
    this.getStatusChooseGraph = function ()
    {
        return chooseGraph;
    }
    this.setStatusChooseGraph = function (chooseGraph_) {
        chooseGraph = chooseGraph_;
    }

    /*
     *  Function perméttant de savoir si le graphe sélectionné corrspond au graphe courant.
     */
    this.isTheGoodGraph = function () {
        return this.getNameGraph() === this.getStatusChooseGraph();  
    }


    var widthSvg;
    if(document.body.clientWidth === undefined || document.body.clientWidth === null)
    {
        //Pour Chrome
        widthSvg = document.width*2/3
    }
    else
    {
        //Pour Firefox
        widthSvg = document.body.clientWidth*2/3;
    }
	var R = Raphael(xGiven, yGiven, widthSvg, heightSvg);	   //Zone de dessins
	var set = R.set(); 	                                       //Variable contenant un ensemble de figure

	var statusTrans=true;  //Variable permettant de savoir si la transformation du graphe est activée

    //Variable perméttant de gérer l'épaisseur de la flêche et du trait de contour du rectangle.
    var strokeArrow = strokeGiven;
    this.getStrokeArrow= function ()
    {
        return strokeArrow;
    }

    var graph = graphGiven;
    /*
     *  Fonction qui renvoie le graph
    */
    this.getGraph = function ()
    {
        return graph;
    }

    /*
     *  Fonction permettant d'obtenir la vue voulu 
     * 
     * @param l'id de la vue
     * @return la vue
    */
    this.getViewConcrete = function (id)
    {   
        return this.getViewSubject(id);
    }

    /*
     *  Fonction qui renvoie l'ensemble de figure
    */
    this.getSet = function ()
    {
        return set;
    }

    /*
     *  Function qui ajoute une figure à set
     *
     * @param une figure
    */
    this.setSet = function(shape)
    {
        set.push(shape);
    }

    /*
     * Fonction qui renvoie le dessin svg
     *
     * @return le dessins svg
    */
    this.getRaphael = function()
    {
        return R;
    }

};

//initialisation de l'héritage.
ConcreteGraph.prototype = new SubjectGraph();

