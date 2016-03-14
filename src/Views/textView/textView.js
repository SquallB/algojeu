//Constructeur de la vue "text"
function textView (graphGiven, divName, modele_) 
{
	AbstractView.call(this);

    var graphView = {};
    var graph = graphGiven;

    var modele = modele_;
    this.getModele = function () {
        return modele;
    }

    this.getGraphView = function ()
    {
        return graphView;
    }

    this.getGraphViewWithId = function (id)
    {
        return graphView[id];
    }

    this.setGraphViewWithId = function(id, value)
    {
        graphView[id]=value;
    }

    this.getGraph = function ()
    {
        return graph;
    }

    for(var i in this.getGraph().getMatrixNode())
    {
        var node = this.getGraph().getNode(i);
        this.setGraphViewWithId(i, new nodeGraphView(node, 0));
    }

    //Variables correspond à la div de textView du modéle
    var divTextView = $("<div></div>");
    $(divTextView).attr("id", divName+"textView");
    $(divTextView).css("position", "absolute");
    $(divTextView).css("right", "2%");
    $(divTextView).css("width", "30%");
    $(divTextView).css("max-width", "100%");
    $(divTextView).css("max-height", "87%");
    $(divTextView).css("overflow-x", "auto"); 
    $(divTextView).css("overflow-y", "auto");
    $(divTextView).css("background-color", "#1447E9");
    $(divTextView).css("border", "solid white");
    $(divTextView).css("-moz-border-radius", "10px");
    $(divTextView).css("-webkit-border-radius", "10px");
    $(divTextView).css("border-radius", "10px");
    $(modele_.getDivModele()).append(divTextView);
    this.getDivTextView = function () {
        return divTextView;
    }

};

//initialisation de l'héritage.
textView.prototype = new AbstractView();

textView.prototype.refresh = function (graph)
{
    this.initializeTextView();
    this.initializeTable(graph);

} 


textView.prototype.initializeTextView = function()
{
    //Variable perméttant d'attrbuer un unique identifiant à chaque div.
    var idTextView =0;
    var modele = this.getModele();

    for(var id in this.getGraphView())
    {
        var nodeForeign = this.getGraphViewWithId(id);

        idTextView++;

        //Si le noeud n'a pas était visité, on parcourt ses voisins.
        if((nodeForeign.getVisitTextView() === undefined || nodeForeign.getVisitTextView()=== null || nodeForeign.getVisitTextView()===false))
        {
            //Marquage du noeud comme étant visité.
            nodeForeign.setVisitTextView(true);

            //Initilisation de la queue.
            var queue = [nodeForeign];

            //Initilisation du div correspond au noeud, en lui ajoutant un identifiant pour le div,son id, à quel modèle il appartient et un attribut "tab".
            //Dont le rôle de l'attribu "tab" permet d'affecter un certain nombres de tabulations en html (Grâce au mot-clé &nbsp;) & ses fils.
            var divRootForeign = $('<div></div>');
            $(divRootForeign).addClass(''+nodeForeign.getId()+'').attr('tab', 0).attr('idTextView', idTextView).addClass("nodeTextView").attr("modele", modele.getNameGraph()).html(nodeForeign.getId()+" :"+nodeForeign.getValue());
            $(divRootForeign).css("color", "#F9FCFC");

            $(this.getDivTextView()).append(divRootForeign);

            while(queue.length > 0 )
            {
                var currentNode = queue.shift();

                //Variable perméttant de gérer les tabulations.
                var tabCurrentNode = Number($('.'+currentNode.getId()+'[modele='+modele.getNameGraph()+']').attr('tab'));

                //Variables permettant de gérer l'id de la div.
                var idTVCurrentNode = $('.'+currentNode.getId()+'[modele='+modele.getNameGraph()+']').attr('idTextView');

                var it = currentNode.getNeighbors();

                //On parcourt les voisins du noeud courrant.
                while(it.hasNextNode())
                {
                    var neighborNode = it.getNextNode(); 
                    var neighbor = this.getGraphViewWithId(neighborNode.getId());

                    var divNeighor = $('<div></div>');
                    idTextView++;

                    $(divNeighor).addClass(''+neighbor.getId()+'').addClass("nodeTextView").attr('tab', tabCurrentNode+1).attr('idTextView', idTextView).attr("modele", modele.getNameGraph());
                    var htmlDivNeighbor = divNeighor.html();

                    //On affecte le nombre de tabulation suivant le niveau de profondeur.
                    for(var j=0; j<=tabCurrentNode*3; j++)
                    {
                        $(divNeighor).html(htmlDivNeighbor+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                        htmlDivNeighbor=divNeighor.html();
                    }

                    //L'id entre crochet est celui du parent.
                    $(divNeighor).html(htmlDivNeighbor+"["+currentNode.getId()+"]");
                    htmlDivNeighbor=divNeighor.html();

                    $(divNeighor).html(htmlDivNeighbor+'___');
                    htmlDivNeighbor=divNeighor.html();

                    //Affiche de la valeur du noeud.
                    $(divNeighor).html(htmlDivNeighbor+''+neighbor.getId()+' :'+neighbor.getValue());

                    //Si le voisins n'a jamais était visité, on l'insère dans la pile et on le marque.
                    if(neighbor.getVisitTextView() === undefined || neighbor.getVisitTextView() ===null || neighbor.getVisitTextView() === false) 
                    {
                        //On marque le noeud.
                        neighbor.setVisitTextView(true);
                        queue.unshift(neighbor);
                    }
                    else
                    {
                        //Dans le cas d'un arc qui pointe vers un node déjà visité
                        //On n'affiche pas l'intégralité de ses voisins.
                        if(neighbor.getDegree() > 0)
                        {
                            htmlDivNeighbor = divNeighor.html()+"&nbsp...";
                            $(divNeighor).html(htmlDivNeighbor);
                        }
                    }
                    
                    //Ajout du fils au noeud courant (et au modèle courant).
                    $('.'+currentNode.getId()+'[idTextView='+idTVCurrentNode+']'+'[modele='+modele.getNameGraph()+']').append(divNeighor);
                }
            }
        }
    }
}


textView.prototype.initializeTable = function(graph)
{
    var modele = this.getModele();
    var divTableView = $("<div></div>");
    $(divTableView).attr("id", modele.getNameGraph()+"tableView");
    $(divTableView).css("position", "absolute");
    $(divTableView).css("right", "2%");
    $(divTableView).css("width", "30%");

    var table = $('<table border="1"></table>');
    $(table).append("<th bgcolor='#000000'></th> <th> Id</th> <th>Value</th> <th>Neighbors</th>");

    var mergeTr = false;
    var matrice = this.getGraph().getMatrixNode();

    //On parcourt tous les noeuds du graphe.
    for(var i in matrice)
    {
        var node = this.getGraph().getNode(i);
        var value = undefined;

        if(node.getValue() != undefined)
        {
            value = node.getValue();
        }

        var tr = $("<tr></tr>");
        var divNode = $("<div></div>");

        if(mergeTr === false)
        {
            //On fusionne verticalement pour la premiere fois les cellues.
            $(tr).html('<td rowspan='+ this.getGraph().getOrder()+' width="10%"> <div class="mergeTr" align="center"> Node</div> </td><td width="10%"> <div align="center" class="node id"> '+node.getId()+'</div></td> <td width="50%"> <div align="center" class="node value"> '+value+'</div> </td>');
            mergeTr=true;
        }
        else
        {
            $(tr).html('<td width="10%"> <div align="center" class="node id"> '+node.getId()+'</div></td> <td width="50%"> <div align="center" class="node value"> '+value+'</div> </td>');
        }
        
        var htmlNode = $(tr).html();

        var itNode = node.getNeighbors();

        if(itNode.hasNextNode() === false)
        {
            //Dans le cas ou le noeud n'a pas de voisin.
            $(tr).html(htmlNode +'<td> Vide');

            htmlNode = $(tr).html();
            $(tr).html(htmlNode +'</td>');
        }
        else
        {
            var tdNeighbor = $('<td width="50%"></td>');
            var htmlNeighbor = tdNeighbor.html();

            //On parcourt les voisin du noeud.
            while(itNode.hasNextNode())
            {
                var neighbor = itNode.getNextNode();

                //On ajoute l'id du voisin dans la cellule du tableu du noeud courrant.
                $(tdNeighbor).html(htmlNeighbor+' '+neighbor.getId());

                htmlNeighbor = $(tdNeighbor).html();
            }

            htmlNeighbor = $(tdNeighbor).html();

            $(tr).html(htmlNode +'<td width="30%">'+htmlNeighbor);
        }
       

        $(table).append(tr);
    }
    
    $(divTableView).append(table);
    $(modele.getDivModele()).append(divTableView);
}