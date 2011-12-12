// UI for a board.
var BoardView = function(paper, board, nodeRadius, edgeLength){
  // Colors used for rendering.
  var COLOR_SCHEME = { "CIRCLE_COLOR" : 'red', "LINE_COLOR" : 'black' };

  this.paper = paper;
  this.board = board;
  this.nodeRadius = nodeRadius;
  this.edgeLength = edgeLength;
  this.center = {x: paper.width / 2, y: paper.height / 2};

  // Scale logic nodes using the edge length relative to board center.
  this.nodes = [];
  var boardCenter = {x: (board.xSize / 2) - 0.5, y: (board.ySize / 2) - 0.5};
  board.nodes.forEach(function(e){
      var nodeRelX = (boardCenter.x - e.x) * this.edgeLength;
      var nodeRelY = (boardCenter.y - e.y) * this.edgeLength;
      var node = new Node(this.center.x + nodeRelX,
                          this.center.y + nodeRelY);
      node.model =e;
      this.nodes.push(node);
    }.bind(this));

  // Create the graphics set.
  this.paper.setStart();
  // Draw nodes and send to back.
  this.nodes.forEach(function(e){
      var circle = this.paper.circle(e.x, e.y, this.nodeRadius);
      circle.attr("fill", COLOR_SCHEME["CIRCLE_COLOR"]);
      circle.toBack();
      e.canvasElement = circle;
      }.bind(this));
  // Draw edges and send to back.
  board.edges.forEach(function(e){
      var node0 = this.nodes[e[0]];
      var node1 = this.nodes[e[1]];
      var line = this.paper.path("M" + node0.x + "," + node0.y +
                                 "L" + node1.x + "," + node1.y);
      line.attr('stroke', COLOR_SCHEME["LINE_COLOR"]);
      line.toBack();
      }.bind(this));
  this.canvasElements = this.paper.setFinish();
}

// The target distance controls the farthest that a ship can be while
// targeting a node.
BoardView.prototype.closestNode = function(point){
  // Find closest node.
  var MAX_TARGET_DIST = 120;
  return Array.min(this.nodes, function(e){
    var dist = e.distance(point);
    if(dist > MAX_TARGET_DIST){
      return Number.MAX_VALUE;
    }
    else{
      return dist;
    }
  });
}

