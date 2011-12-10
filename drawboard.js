Nanomunchers.drawBoard = { 
    
    var OFFSET = 5;
    var SEPARATION = 30;
    var RADIUS = 10;
    var CIRCLE_COLOR = 'red';
    var LINE_COLOR = 'red';
    var LINE_LENGTH = 20;
    var BOARD_X=1280;
    var BOARD_Y=800;

    adjustCoordinates: function (nodes) {
	for(var i=0;i<nodes.length;++i) {
	    nodes[i].x = (nodes[i].x + OFFSET)*SEPARATION;
	    nodes[i].y = (nodes[i].y + OFFSET)*SEPARATION;
	} 
    }

    drawNodes: function (nodes) {
	for(var i=0;i<nodes.length;++i)
	{
	    sourceLoc = nodes[i];
	    c = paper.circle(sourceLoc.x,sourceLoc.y,
			     RADIUS);
	    c.attr('fill',CIRCLE_COLOR);
	}
    }
    
    drawLines: function (nodes,edges) {
	for(var i=0;i<edges.length;++i) {
	    var edge = edges[i];
	    var source = edge[0];
	    var sink = edge[1];
	    var sourceLoc = nodes[source];
	    var sinkLoc = nodes[sink];
	    var pathString = getPathString(sourceLoc,sinkLoc);
	    line = paper.path(pathString);
	    line.attr('stroke',LINE_COLOR);
	}
    }
    
    getPathString: function (sourceLoc, sinkLoc) {
	var pathString = '';
	if(sourceLoc.x == sinkLoc.x) {
	    pathString ='M ' + sourceLoc.x.toString() + ' ' + 
	        (sourceLoc.y + RADIUS).toString() +
                ' L ' + sourceLoc.x.toString() + ' ' +
	        (sinkLoc.y - RADIUS).toString();
	}
	else if(sourceLoc.y == sinkLoc.y) {
	    pathString = 'M ' + (sourceLoc.x + RADIUS).toString() + ' ' + 
	        sourceLoc.y.toString() +' L ' + 
	        (sinkLoc.x - RADIUS).toString() + ' ' + 
	        sourceLoc.y.toString();
	}
	return pathString; 
    }
}


