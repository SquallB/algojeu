AbstractNode = function (){}

/** 
 * Returns the id of the node
 *
 * @return the id of the node
 */		
AbstractNode.prototype.getId = function() {}


/** 
 * Returns the degree of the node
 *
 * @return the degree of the node
 */		
AbstractNode.prototype.getDegree = function() {}


/** 
 * Returns the value of the node
 *
 * @return the value of the node
 */		
AbstractNode.prototype.getValue = function() {}		// remarque : le nom getNodeValue a été simplifié en getValue car il n'y a pas plus de souci de conflit de nom dans le contexte objet


/** 
 * Updates the value of the node
 * @param value the new value for the node 
 */		
AbstractNode.prototype.setValue = function(value) {}		// remarque : le nom setNodeValue a Ã©tÃ© simplifiÃ© en setValue car il n'y a pas plus de souci de conflit de nom dans le contexte objet


/** 
 * Returns an iterator on the neighborhood of the node
 * @return an iterator on the neighborhood of the node (a reference on a AbstractNodeIterator instance)
 */		
AbstractNode.prototype.getNeighbors = function() {}






