Nanomunchers.boardGenerator = {
  isSame: function(nodeA, nodeB){
    return (nodeA.x === nodeB.x && nodeA.y === nodeB.y)
  },

  isNeighbor: function(nodeA, nodeB){
  return (nodeA.x === nodeB.x && Math.abs(nodeA.y - nodeB.y) === 1) ||
         (nodeA.y === nodeB.y && Math.abs(nodeA.x - nodeB.x) === 1);
  },

  generateBoard: function(xSize, ySize, numNodes, edgeProb){
    xSize = typeof(xSize) != 'undefined' ? xSize : 30;
    ySize = typeof(ySize) != 'undefined' ? ySize : 20;
    numNodes = typeof(numNodes) != 'undefined' ? numNodes : 700;
    edgeProb = typeof(edgeProb) != 'undefined' ? edgeProb : 0.7;
    // if there could be an edge between i and j, there
    // is an edgeprob chance that it will be there

    var nodes = []
    for(var i = 0; i < xSize; i++){
      for(var j = 0; j < ySize; j++){
        nodes.push(new Node(i,j));
      }
    }

    function shuffle(array) {
        var tmp, current, top = array.length;
        if(top) while(--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }

        return array;
    }

    shuffle(nodes);

    nodes.splice(numNodes, nodes.length - numNodes);

    var edges = []

    for(var i = 0; i < nodes.length; i++){
      for(var j = i; j < nodes.length; j++){
        if(this.isNeighbor(nodes[i], nodes[j])){
          if(Math.random() <= edgeProb){
            edges.push([i,j]);
          }
        }
      }
    }

    var result = new Board(nodes, edges, xSize, ySize);
    result.prototype = Board;
    return result;
  }
}

function distance(a, b){
  return Math.sqrt(Math.pow((a.x - b.x),2) + Math.pow((a.y-b.y),2));
}
Board = function(nodes, edges, xSize, ySize){ 
  this.nodes = nodes;
  this.edges = edges;
  this.xSize = xSize;
  this.ySize = ySize;
}
Board.prototype.closestNode = function(point){
  return Array.min(this.nodes, function(e){
    return distance(point, e);
  });
}

var Node = function(x_, y_){
  this.x = x_
  this.y = y_
}

bindAllFunctions(Nanomunchers.boardGenerator)
