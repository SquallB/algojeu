function AlreadyExistingNodeException(id) 
{
	Error.call(this);
	this.id = id;
	this.message= "Noeud déjà existant: "+this.id+".";
};
AlreadyExistingNodeException.prototype = new Error();

function InvalidIdException(id) 
{
	Error.call(this);
	this.id = id;
	this.message = "Id invalide: "+this.id+".";
};
InvalidIdException.prototype = new Error();


function InvalidReferenceException(element) 
{
	Error.call(this);
	this.message = element+" invalide";
};
InvalidReferenceException.prototype = new Error();

function UnexistingEdgeException() 
{
	Error.call(this);
	this.message = "Arc inexistant";
};
UnexistingEdgeException.prototype = new Error();

function UnexistingNodeException() 
{
	Error.call(this);
	this.message = "Noeud inexistant dans le graph";
};
UnexistingNodeException.prototype = new Error();

function AlreadyExistingEdgeException() 
{
	Error.call(this);
	this.message = "Arc déjà existant";
};
AlreadyExistingEdgeException.prototype = new Error();
