// A board is a set of nodes and edges.
Board = function(xSize, ySize, numNodes, edgeProb){ 
  this.xSize = typeof(xSize) !== 'undefined' ? xSize : 30;
  this.ySize = typeof(ySize) !== 'undefined' ? ySize : 20;

  this.numNodes = typeof(numNodes) !== 'undefined' ? numNodes : 700;
  // if there could be an edge between i and j, there
  // is an edgeprob chance that it will be there
  this.edgeProb = typeof(edgeProb) !== 'undefined' ? edgeProb : 0.7;

  // Create all possible nodes.
  this.nodes = []
  for(var i = 0; i < xSize; i++){
    for(var j = 0; j < ySize; j++){
      this.nodes.push(new Node(i,j));
    }
  }

  // Pick a random subset of size numNodes.
  Array.shuffle(this.nodes);
  this.nodes.splice(numNodes, this.nodes.length - numNodes);
  // Create random edges based on edgeProb.
  this.edges = [];
  for(var i = 0; i < this.nodes.length; i++){
    for(var j = i; j < this.nodes.length; j++){
      if(this.nodes[i].isNeighbor(this.nodes[j])){
        if(Math.random() <= edgeProb){
          this.edges.push([i,j]);
          if(this.nodes[i].x === this.nodes[j].x){
            // Higher y value is above
            if(this.nodes[i].y === this.nodes[j].y + 1){
              this.nodes[j]["U"] = this.nodes[i]
                this.nodes[i]["D"] = this.nodes[j]
            }else{
              this.nodes[j]["D"] = this.nodes[i]
                this.nodes[i]["U"] = this.nodes[j]
            }
          }else if(this.nodes[i].y === this.nodes[j].y){
            // Higher x value is to the left
            if(this.nodes[i].x === this.nodes[j].x + 1){
              this.nodes[i]["R"] = this.nodes[j];
              this.nodes[j]["L"] = this.nodes[i];
            }else{
              this.nodes[i]["L"] = this.nodes[j];
              this.nodes[j]["R"] = this.nodes[i];
            }
          }
        }
      }
    }
  }
}

// A node is 2d point location.
var Node = function(x_, y_){
  this.x = x_;
  this.y = y_;
  this.munchedBy = null;
  // Test if another node is the same.
  this.isSame = function(nodeB){
    return (this.x === nodeB.x) && (this.y === nodeB.y)
  };
  // Calculate the distance between two nodes.
  this.distance = function(b){
    return Math.sqrt(Math.pow((this.x - b.x),2) + Math.pow((this.y-b.y),2));
  };
  // Check if the node is a neighbor.
  this.isNeighbor = function(nodeB){
    return (this.x === nodeB.x && Math.abs(this.y - nodeB.y) === 1) ||
           (this.y === nodeB.y && Math.abs(this.x - nodeB.x) === 1);
  };
  // Consume this node.
  this.munch = function(munchedBy){
    this.munchedBy = munchedBy;
  };
  // Is munched?
  this.munched = function(){ return this.munchedBy !== null; };
}
Node.prototype.add = Point.prototype.add;
Node.prototype.sub = Point.prototype.sub;
bindAllFunctions(Node)

