//Constructeur de graphView.
function graphView(xGiven, yGiven, modele, graph, heightSvg)
{
    AbstractView.call(this);

    //Marge de hauteur et largeur entre les figures.
    var spaceX = 30;
    var spaceY = 30;

    this.getSpaceX = function()
    {
        return spaceX;
    }

    this.getSpaceY = function()
    {
        return spaceY;
    }
    
    this.setSpaceX = function(x)
    {
        spaceX = x;
    }

    this.setSpaceY = function(y)
    {
        spaceY = y;
    }

    //Largeur du svg
    var sizeSvg;
    var isGoole;
    if(document.width != undefined && document.width != null)
    {
        //Pour Chrome
        sizeSvg = document.width*2/3;
        isGoole=true;
    }
    else
    {
        //Pour Firefox
        sizeSvg = document.body.clientWidth*2/3;
        isGoole = false;
    }
    this.getSizeSvg = function ()
    {
        return sizeSvg;
    }

    this.getIsGoogle = function ()
    {
        return isGoole;
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
    //Variable correspond à la zone de dessins.
    var R = Raphael(xGiven, yGiven, widthSvg, heightSvg);

    //Div représentant le sgv du graphe.
    var divR = $("<div></div>").attr("id", modele.getNameGraph()+"graphView");
    $(modele.getDivModele()).append(divR);

    this.getRaphael = function()
    {
        return R;
    }

    //Variable contenant tous les noeuds du graphe avec une classe nodeGraphView
    //perméttant ainsi de marquer les noeuds sans modfier les noeuds du graph.
    var graphView = {};
    for(var i in graph.getMatrixNode())
    {
        var node = graph.getNode(i);
        graphView[i] = new nodeGraphView(node, 0, this.getRaphael(), this, 5, 5, modele);
    }

    this.getGraphView = function ()
    {
        return graphView;
    }

    this.getNodeView = function (i)
    {
        
        return this.getGraphView()[i];
    }


    var graphGiven = graph;
    this.getGraphGiven = function ()
    {
        return graphGiven;
    }

    //Tableau contnant toute les noeuds qui sont voisins.
    var connections = [];

    /*
     *  Fonction qui renvoie le tableau connections.
    */
    this.getConnections = function ()
    {
        return connections;
    }

    /*
     *  Fonction qui renvoie une connection à l'indice donnée
     *
     *  @param id de la connection
     *  @return renvoie la connection à l'id donnée 
    */
    this.getConnectionsWithId = function (id)
    {
        return connections[id];
    }

    /*
     *  Fonction permettant d'ajouter une connection entre 2 noeuds
     *
     *  @param connection entre 2 noeuds
    */
    this.setConnections = function(connectionGiven)
    {
        connections.push(connectionGiven);
    }
   
    var thisModele = modele;

    this.getThisModele = function () 
    {
        return thisModele;
    }

    this.setThisModele = function (modeleGiven) 
    {
        thisModele=modeleGiven;
    }

    var thisGraphView = this;

    this.addConnection = function(obj1, obj2, line) {

    }
    
    this.breathTraversal = function (rootNode, depth)
    {
        var i = depth;
        var depthMax = i;

        //on marque le premier noeud
        rootNode.setDepth(i+this.getSpaceY());
        rootNode.setVisitGraphView(true);
        rootNode.setPosition(0, 0);
        var queue = [rootNode];

        //Tableau permettant de savoir la largeur de noeud à une certaine profondeur
        var array=[];      
        
        //Tableau permettant en cas de dépassement de taille de la zone de dessin, de faire passer les noeuds qui dépassent à la profondeur suivante.
        var array2= [];
        
        while(queue.length > 0)
        {
            //On défile.
            var currentNode = queue.shift();
            var it = currentNode.getNeighbors();
            i=currentNode.getDepth();
            
            if(i>depthMax)
            {
                depthMax = i;
            }
            
            //Palier de la largeur.
            var widthToAdd = currentNode.getRectBBox().width + this.getSpaceX();

            //Palier de la Profondeur.
            var heightToAdd = currentNode.getRectBBox().height + this.getSpaceY();
            
            if(array[i]=== undefined || isNaN(array[i]))
            {
                //valeur de positionnement de départ.
                array[i]=15;

                //permet d'initialiser un tableau pour pouvoir ensuite ajouter des noeuds.
                array2[i]=[];
            }
            
            //on positionne le noeud une première fois.
            currentNode.setPosition(array[i], i);
            
            //on met à jour la nouvelle largeur.
            array[i]+= widthToAdd;

            //on rajoute le noeud avec ceux de même profondeur 
            array2[i].push(currentNode);
            var it = currentNode.getNeighbors();
            
           
            while(it.hasNextNode())
            {
                var neighbor = it.getNextNode();
                var neighborView = this.getNodeView(neighbor.getId());
                
                if(neighborView.getVisitGraphView() === false)
                {
                    neighborView.setPosition(0, 0);    

                    //On marque le noeud.
                    neighborView.setVisitGraphView(true);
                    
                    neighborView.setDepth(i+heightToAdd);

                    //On l'empile.
                    queue.unshift(neighborView);
                }
            }
        }
        
        
        var heightOffset=0;

        //On vérifie que la largeur de chaque palier ne dépasse pas celle de la zone de dessin sinon on décale les palier pour basculer celui surdimentionné.
        for( i=rootNode.getDepth(); i<=depthMax; i+=rootNode.getRectBBox().height + this.getSpaceY())
        {
            var tmpWidth = 15;
            currentNode=array2[i].shift();

            while(currentNode!== undefined)
            {
                 //on vérifie la nouvelle valeur de largeur
                 if(tmpWidth+currentNode.getRectBBox().width> this.getSizeSvg())
                 {
                    //on augmente la valeur de palier de tout les autres paliers
                    heightOffset+=currentNode.getRectBBox().height +  this.getSpaceY();

                    //on réinitialise  la valeur de largeur du palier  
                    tmpWidth = 15;
                }

                //on repositionne le noeud
                currentNode.setDepth(heightOffset + i);
                currentNode.setPosition(tmpWidth, heightOffset + i);

                //on recalcule la largeur
                tmpWidth+=currentNode.getRectBBox().width + this.getSpaceX();
               
                currentNode=array2[i].shift();
            }
        }
        
        //on retourne la position Y où on s'est arrêté dans le cas de plusieurs graph dans un seul.
        return heightOffset+depthMax+this.getSpaceY();
    }


    /*
     *  Fonction perméttant de déssiner un arc entre le noeud donné et ses voisins.
     *
     *  @param le noeud
     */
    this.drawEdge=function(node)
    {
       var it = node.getNeighbors();
       it.resetInd();

        while(it.hasNextNode())
        {
            var neighbor = it.getNextNode();
            //On ajoute les nouveaux noeuds voisins, à fin de déssiner un arc.
            this.setConnections(this.getRaphael().connection(this.getNodeView(node.getId()).getRect(), this.getNodeView(neighbor.getId()).getRect(), "#000000"));
        }
    }

    /*
    *   Fonction permttant de déssiner les arcs et noeuds du graphe, tout en leurs ajoutant un dragNdrop.
    *
    *   @param le graphe
    */
    this.addDragAndShape = function(graph)
    {
        var depth = 0;

        //Placement des noeuds par défaut (avec des drags).
        for(var id in this.getGraphView())
        {
            var node = this.getNodeView(id);

            if(node.getVisitGraphView() === false)
            {
                depth = this.breathTraversal(node, depth);
            }
        }

        //Affichage des arcs.
        for (var i in this.getGraphView()) 
        {
            this.drawEdge(this.getNodeView(i));
        }
    }

    /*
     *  Fonction qui met à jour la vue
     *
     *  @param le graphe
     */
    this.refresh = function (graph)
    {
        this.addDragAndShape(graph);

        //On crée une nouvelleoption de translation du graphe courant.
        //(il faut mettre un "new" pour avoir 2 instance différentes, et éviter de translater le même graphe)
        new translateGraph(modele, this.getRaphael(), this);
    }
}

//Initialisation de l'héritage.
graphView.prototype = new AbstractView();   