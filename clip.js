var clip = {

    paint: function(board) {

	WIDTH_CLIP_PLAYER1 = 40;
	HEIGHT_CLIP_PLAYER1 = 600;
	WIDTH_CLIP_PLAYER2 = 40;
	HEIGHT_CLIP_PLAYER2 = 600;
	
	RADIUS = 15;
	SPACING = 10;
	numCircles = HEIGHT_CLIP_PLAYER1 / (2*RADIUS + SPACING);
	amo_player1 = Array(numCircles);
	amo_player2 = Array(numCircles);
	
	this.paper1 = Raphael("game-clip1",WIDTH_CLIP_PLAYER1, 
			     HEIGHT_CLIP_PLAYER1);
	this.paper2 = Raphael("game-clip2",WIDTH_CLIP_PLAYER2, 
			     HEIGHT_CLIP_PLAYER2);
	
	this.paper1.canvas.style["background-color"] = "lightblue";
	this.paper1.canvas.style["border"] = "solid 1px";

	this.paper2.canvas.style["background-color"] = "blue";
	this.paper2.canvas.style["border"] = "solid 1px";

	var startX = 20;
	var startY = 20;
	var offset = 0;
	for(var i=0;i<numCircles;++i)
	{
	    offset = i*(2*RADIUS + SPACING);
	    amo_player1[i]=this.paper1.circle(startX,startY+offset,15);
	    amo_player1[i].attr('fill','green');
	    
	    amo_player2[i]=this.paper2.circle(startX,startY+offset,15);
	    amo_player2[i].attr('fill','white');
	}	
	/*for(var i=0;i<amo_player1.length;++i)
	{
	    amo_player1[i].animate({cx:board.nodes[i].x,cy:board.nodes[i].y});
	    amo_player2[i].animate({cx:board.nodes[i+amo_player1.length].x,cy:board.nodes[i+amo_player1.length].y});
	}*/
	amo_player1[4].animate({cx:1000,cy:390},1000);
    }

}