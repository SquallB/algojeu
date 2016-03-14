//Constructeur de nodeGraphView
function nodeGraphView (node, depthGiven, Raph, thisViewGiven, xMarginGiven, yMarginGiven, modele)
{
    var thisNodeView = this;

    var visitGraphView = false;    //Marqueur pour le parcour en largeur pour le graphView
    var visitTextView = false;     //Marqueur pour le parcour en largeur pour le textView

    var thisView = thisViewGiven;

    //Copie des attributs du noeuds.
    var id = node.getId();
    var value = node.getValue();
    var degree = node.getDegree();
    var neighbors = node.getNeighbors();

    var depth = depthGiven;
    var text;   //Variable correspondant au texte crée.
    var rect;   //Variable correspondant au rectangle crée.

    var Raphael = Raph;

    //Coordonnée du noeud.
    var x=0;
    var y=0;

    //Initialisation d'une marge dans le rectangle.
    var xMargin=xMarginGiven;
    var yMargin=yMarginGiven;

    var width;
    var height;

    var strokeAttr = "black";   //Variable représentant la couleur du contour du rectangle.
    var fillAttr =  "black";   //Variable correspondant à la couleur du fond du rectangle.
    var opacityAttr = .5;       //Variable permméttant de gérer la transparence du rectangle.
    var strokeWidth = 4;        //Variable correspondant à l'épaisseur du contour.
    var sizeText = 14;          //Variable représentant la taille du texte.

    this.getStrokeAttr = function ()
    {
        return strokeAttr;
    }

    this.getFillAttr = function ()
    {
        return fillAttr;
    }

    this.getOpacityAttr = function ()
    {
        return opacityAttr;
    }

    this.getStrokeWidthAttr = function ()
    {
        return strokeWidth;
    }


    this.setWidth = function(widthGiven)
    {
        width = widthGiven
    }

    this.setHeight = function (heightGiven)
    {
        height = heightGiven
    }

    this.getWidth = function()
    {
        return width; 
    }

    this.getHeight = function ()
    {
        return height; 
    }

    this.getXMargin = function ()
    {
        return xMargin;
    }

    this.setX = function (xGiven)
    {
        x = xGiven + this.getXMargin();
    }


    this.setY = function (yGiven)
    {
        y = yGiven + this.getYMargin();
    }

    this.getX = function ()
    {
        return x;
    }

    this.getY = function ()
    {
        return y;
    }

    this.getYMargin = function ()
    {
        return yMargin;
    }

    this.setValue = function (value)
    {
        value = value;
    }

    this.getValue = function()
    {
        return value;
    }

    this.getId = function()
    {
        return id;
    }

    this.getNeighbors = function()
    {
        return neighbors;
    }

    this.getDepth = function()
    {
        return depth;
    }

    this.setDepth = function(depth2)
    {
        depth = depth2;
    }

    this.setVisitGraphView = function (visited)
    {
        visitGraphView = visited;
    }

    this.getVisitGraphView = function ()
    {
        return visitGraphView;
    }

    this.setVisitTextView = function (visited)
    {
        visitTextView = visited;
    }

    this.getVisitTextView = function ()
    {
        return visitTextView;
    }

    this.getDegree = function ()
    {
        return degree;
    }

    this.getText = function ()
    {
        return text;
    }

    this.exist = function (object) 
    {
        return (object != undefined && object!=null);
    }

    this.getTextBBox = function ()
    {
        if(this.exist(this.getText()))
        {
            return this.getText().getBBox();
        }
    }
    this.getRectBBox = function ()
    {
        if(this.exist(this.getRect()))
        {
            return this.getRect().getBBox();
        }
    }
    this.getRaphael = function()
    {
        return Raphael;
    }

    /*
     *  Fonction perméttant de créer un texte et un rectangle en fonction de la taille du texte
     *
     *  @param le texte à écrire
     */
    this.createText = function (textGiven)
    {
        if(!this.exist(this.getText())) 
        {
            if(textGiven != undefined)
            {
                textGiven = textGiven.toString();
            }

            text = this.getRaphael().text(this.getX(), this.getY(), textGiven+"  ID:"+this.getId());
            text.attr("font-size", sizeText);
            text.attr("fill", "black");
            this.createRect(this.getTextBBox().width + 2*this.getXMargin(), this.getTextBBox().height +2*this.getYMargin());

            var rectAttr = rect.attr();
            rectAttr.stroke = this.getStrokeAttr()
            rectAttr.fill = this.getFillAttr()
            rectAttr["stroke-width"] = this.getStrokeWidthAttr();
            rectAttr.cursor = "move";
            rectAttr.opacity = this.getOpacityAttr();
            rect.attr(rectAttr);

            //On associe le rectangle et le texte, pour que, lors du drag on puisse modifier les coordonnées du texte et du rectangle en même temps.
            text.pair = rect;
            rect.pair = text;

            //On affecte un drag au rectangle, et le texte est mis à l'arrière. (Pour ne pas être sélectionné lors du drag)
            rect.drag(move, startShape, up);
            text.toBack();

            //On ajoute les nouelle figure dessiné dans l'ensemble des figures
            //pour pouvoir éffectuer la transformation sur un ensemble de figures.
            thisView.getThisModele().setSet(rect);
            thisView.getThisModele().setSet(text);
        }
    }

    this.getRect = function ()
    {
        return rect;
    }

    /*
     *  Fonction perméttant de déssiner un rectangle en fonction de la taille du texte
     *
     * @param la largeur et la hauteur du texte
     */
    this.createRect = function (widthGiven, heightGiven)
    {
        if( (!this.exist(this.getRect())) && widthGiven>0 && heightGiven>0 )
        {
            this.setWidth(widthGiven);
            this.setHeight(heightGiven);
            rect = this.getRaphael().rect(this.getX(), this.getY(), widthGiven+xMargin, heightGiven+yMargin, 12);
        }
    }

    /*
     *
     *  Fonction perméttant de déssiner le noeuds (le texte et le rectangle) à l'endroit voulu, et modifie les coordonnées de la figure si la figure est déjà existante
     *
     * @param les coordonnées du texte en (x, y)
     */
    this.setPosition = function(xGiven, yGiven)
    {
        this.setX(xGiven);
        this.setY(yGiven);

        if(!this.exist(this.getRect()))
        {
            this.createText(this.getValue());
        }

        this.getText().attr({x: xGiven + this.getTextBBox().width/2+xMargin, y: yGiven +yMargin+this.getTextBBox().height/2});
        var attrRect = this.getRect().attr();
        attrRect.x = xGiven;
        attrRect.y = yGiven;
        this.getRect().attr(attrRect);
    }

    /*
     *
     * Fonction perméttant de déplacer un noeud
     *
     * @param la variation selon x et y
     */
    var move=function(dx, dy)
    {
        //Dans le cas ou on translate pas le graphe, et que le graphe à drag soit le bon.
        if(modele.isTheGoodGraph())
        { 
            //On modifie les coordoonées du noeud.
            this.attr({x: this.ox + dx, y: this.oy + dy-window.scrollY});
            //Et de son associé.
            this.pair.attr({x:this.ox + dx + thisNodeView.getWidth()/2 , y: this.oy + dy -window.scrollY + thisNodeView.getHeight()/2});

            //On met à jour les arcs.
            for(var i=0; thisView.getConnections().length; i++) 
            {
                thisView.getRaphael().connection(thisView.getConnections()[i]);
            }
        }
    },
    /*
     *  Fonction perméttant d'initialiser la position du drag
    */
    startShape = function () 
    {
        this.ox = this.attr("x");
        this.oy = this.attr("y") + window.scrollY;

        var opacityView = thisNodeView.getOpacityAttr();
        this.animate({"fill-opacity": opacityView - .2}, 500);
    }, 
    /*
     *  FOnction perméttant de gérer lors de la fin du drag, des animations.
     *
    */
    up = function()
    {
        var opacityView = thisNodeView.getOpacityAttr();
        this.animate({"fill-opacity": opacityView + .5}, 500);
    };
}