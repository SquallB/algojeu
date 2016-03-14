function AbstractSimpleGraph(directed){
	
	this.directed = directed;
	
}
/********************** GRAPH OPERATIONS ************************************************/


/** 
 * Returns the order of the graph
 *
 * @return the order of the graph
 */		
AbstractSimpleGraph.prototype.getOrder = function() {}


/** 
 * Returns true if the graph is directed, false otherwise
 *
 * @return true if the graph is directed, false otherwise
 */		
AbstractSimpleGraph.prototype.isDirected = function() {}




/********************** NODES OPERATIONS ************************************************/


/** 
 * Adds a node in the graph with the specified identifier and an undefined value  
 *
 * @param id the identifier of the node (strictly positive integer)
 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)		 
 * @throws AlreadyExistingNodeException if a node with the speficied id already exists
 * @return a reference on the new node
 */		
AbstractSimpleGraph.prototype.addNode = function(id) {}

/** 
 * Adds a node in the graph with the specified identifier and value
 *
 * @param id the identifier of the node (strictly positive integer)
 * @param value the value of the node	 
 * @throws InvalidIdException if the specified id is not valid (wrong type, <= 0, ...)		 
 * @throws AlreadyExistingNodeException if a node with the speficied id already exists
 * @return a reference on the new node
 */		
AbstractSimpleGraph.prototype.addValuedNode = function(id, value) {}


/** 
 * Searchs for a node by its identifier in the graph
 *
 * @return a reference on the searched node (AbstractNode instance) - undefined if not found
 */		
AbstractSimpleGraph.prototype.getNode = function(id) {}


/** 
 * Removes the specified node in the graph
 *
 * @param node a reference on a node of the graph (AbstractNode instance)
 * @throws InvalidReferenceException if the specified reference is not valid (wrong type, undefined, null, ...)		 
 * @throws UnexistingNodeException if the reference is valid but the corresponding node does not exist	 
 */		
AbstractSimpleGraph.prototype.removeNode = function(node) {}


/** 
 * Reset the value of all nodes in the graph
 *
 * @param value the new value for all nodes 
 */	
AbstractSimpleGraph.prototype.resetNodesValue = function(value) {}



/********************** EDGES OPERATIONS ************************************************/


/** 
 * Adds an edge between two nodes in the graph with an undefined weight 
 *
 * @param sourceNode a reference on the source node (AbstractNode instance)
 * @param destNode a reference on the destination node (AbstractNode instance)
 * @throws InvalidReferenceException if the specified reference is not valid (wrong type, undefined, null, ...)			 
 * @throws UnexistingNodeException if the references are valid but one of the corresponding nodes does not exist
 * @throws AlreadyExistingEdgeException if the specified edge already exists
 */
AbstractSimpleGraph.prototype.addEdge = function(sourceNode, destNode) {}

/** 
 * Adds an edge between two nodes in the graph with a specified weight
 *
 * @param sourceNode a reference on the source node (AbstractNode instance)
 * @param destNode a reference on the destination node (AbstractNode instance)
 * @param weight the weight of the edge
 * @throws InvalidReferenceException if the specified reference is not valid (wrong type, undefined, null, ...)			 
 * @throws UnexistingNodeException if the references are valid but one of the corresponding nodes does not exist
 * @throws AlreadyExistingEdgeException if the specified edge already exists
 */	
AbstractSimpleGraph.prototype.addWeightedEdge = function(sourceNode, destNode, weight) {}




/** 
 * Returns the weight of the edge between two nodes in the graph
 *
 * @param sourceNode a reference on the source node (AbstractNode instance)
 * @param destNode a reference on the destination node (AbstractNode instance)
 * @return the weight of the specified edge
 * @throws InvalidReferenceException if the specified reference is not valid (wrong type, undefined, null, ...)			 
 * @throws UnexistingNodeException if the references are valid but one of the corresponding nodes does not exist
 * @throws UnexistingEdgeException if the references are valid, the corresponding nodes exists, but the corresponding edge does not exist	 
 */			
AbstractSimpleGraph.prototype.getEdgeWeight = function(sourceNode, destNode) {}


/** 
 * Updates the weight of the edge between nodes two nodes in the graph
 *
 * @param sourceNode a reference on the source node (AbstractNode instance)
 * @param destNode a reference on the destination node (AbstractNode instance)
 * @param weight the new weight for the specified edge 
 * @throws InvalidReferenceException if the specified reference is not valid (wrong type, undefined, null, ...)			 
 * @throws UnexistingNodeException if the references are valid but one of the corresponding nodes does not exist
 * @throws UnexistingEdgeException if the references are valid, the corresponding nodes exists, but the corresponding edge does not exist	

 */	
AbstractSimpleGraph.prototype.setEdgeWeight = function(sourceNode, destNode, weight) {}


/** 
 * Removes the edge between nodes two nodes in the graph
 *
 * @param sourceNode a reference on the source node (AbstractNode instance)
 * @param destNode a reference on the destination node (AbstractNode instance)
 * @throws InvalidReferenceException if the specified reference is not valid (wrong type, undefined, null, ...)			 
 * @throws UnexistingNodeException if the references are valid but one of the corresponding nodes does not exist
 * @throws UnexistingEdgeException if the references are valid, the corresponding nodes exists, but the corresponding edge does not exist	

 */	
AbstractSimpleGraph.prototype.removeEdge = function(sourceNode, destNode) {}



/** 
 * Reset the weight of all edges in the graph
 *
 * @param value the new weight for all edges 
 */		
AbstractSimpleGraph.prototype.resetEdgesWeight = function(weight) {}





