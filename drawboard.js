
Nanomunchers.boardPainter = {
    RADIUS: 15,
    SCALAR: 60,
    CIRCLE_COLOR: 'red',
    LINE_COLOR: 'black',
    LINE_LENGTH: 20,

    drawBoard: function(paper, board){
        this.paper = paper
        this.adjustCoordinates(board)
        this.drawNodes(board.nodes)
        this.drawLines(board.nodes, board.edges)
    },

    adjustCoordinates: function(board){
      if(board.center === undefined){

        board.center = {original_x: board.xSize/2 - .5,
                        original_y: board.ySize/2 - .5,
                        x: this.paper.width/2,
                        y: this.paper.height/2}

        board.nodes.forEach(function(node){
            node.original_x = node.x;
            node.original_y = node.y;

            var original_dx = board.center.original_x - node.original_x;
            var original_dy = board.center.original_y - node.original_y;
            node.x = board.center.x + original_dx*this.SCALAR;
            node.y = board.center.y + original_dy*this.SCALAR;
        }.bind(this))

      }

    },

    drawNodes: function (nodes) {
      for(var i=0;i<nodes.length;++i)
      {
          sourceLoc = nodes[i];
          c = this.paper.circle(sourceLoc.x,sourceLoc.y,
               this.RADIUS);
          c.attr('fill',this.CIRCLE_COLOR);
      }
    },
    
    drawLines: function (nodes,edges) {
      edges.forEach(function(edge){
        var source = edge[0];
        var sink = edge[1];
        var sourceLoc = nodes[source];
        var sinkLoc = nodes[sink];
        var pathString = this.getPathString(sourceLoc,sinkLoc);
        line = this.paper.path(pathString);
        line.attr('stroke',this.LINE_COLOR);
        line.toBack();
      }.bind(this));
    },
    
    getPathString: function (sourceLoc, sinkLoc) {
      var pathString = '';
      if(sourceLoc.x == sinkLoc.x) {
          pathString ='M ' + sourceLoc.x.toString() + ' ' + 
              (sourceLoc.y + this.RADIUS).toString() +
                    ' L ' + sourceLoc.x.toString() + ' ' +
              (sinkLoc.y - this.RADIUS).toString();
      }
      else if(sourceLoc.y == sinkLoc.y) {
          pathString = 'M ' + (sourceLoc.x + this.RADIUS).toString() + ' ' + 
              sourceLoc.y.toString() +' L ' + 
              (sinkLoc.x - this.RADIUS).toString() + ' ' + 
              sourceLoc.y.toString();
      }
      return pathString; 
    }
}

function bindAllFunctions(obj){
  for(p in obj){
    if(obj.hasOwnProperty(p) && typeof p === "function"){
      obj[p] = p.bind(obj);
    }
  }
}

bindAllFunctions(Nanomunchers.boardPainter)
