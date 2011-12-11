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
        nodes.push({x: i, y: j});
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

    return {nodes: nodes, edges: edges, xSize: xSize, ySize: ySize};
  }
}
Nanomunchers.boardGenerator.generateBoard = Nanomunchers.boardGenerator.generateBoard.bind(Nanomunchers.boardGenerator)
