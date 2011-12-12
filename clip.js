var ClipView = function(paper, topLeft, bottomRight, numMunchers, playerColor){
    var width = bottomRight.x - topLeft.x;
    var height = bottomRight.y - topLeft.y;

    var spacing = 20;
    var radius = (width - spacing*2)/2;
    var currentSpot = new Point(topLeft.x + spacing + radius,
                                topLeft.y + spacing + radius);
    this.interval = new Point(0, radius*2 + spacing);


    var clipBottomLeft = topLeft.add(this.interval.mul(numMunchers));
    clipBottomLeft.y += spacing/2;
    var clipBottomRight = new Point(bottomRight.x, clipBottomLeft.y);

    this.currentMuncher = 1;
    this.totalMunchers = numMunchers;
    this.ready = true;

    // Make sure we open the door inwards.
    var hinges = [clipBottomLeft, clipBottomRight];
    this.doorHinge = Array.min(hinges, function(p){return Math.abs(paper.width/2 - p.x);});
    if(this.doorHinge === clipBottomLeft){
      this.rotationDegrees = 100;
    }else{
      this.rotationDegrees = -100;
    }

    this.openDoorTime = 1000;

    var topRight = new Point(bottomRight.x, topLeft.y);

    // Draw sides and top of clip:
    this.clipSidesPath = paper.path("M" + clipBottomLeft.toS() + " " +
                                      "L" + topLeft.toS() + " " +
                                      "L" + topRight.toS() + " " +
                                      "L" + clipBottomRight.toS());

    this.doorPath = paper.path("M" + clipBottomLeft.toS() + " " +
                               "L" + clipBottomRight.toS());
    this.muncherViews = [];
    this.canvasElements = paper.set()

    for(var i = 0; i < numMunchers; i++){
      var program = Muncher.randomProgram();
      var muncherView = new MuncherView(GameUI.paper, radius*2, currentSpot,
                                    program, playerColor);
      this.muncherViews.push(muncherView);
      this.canvasElements.push(muncherView.canvasElement);
      currentSpot = currentSpot.add(this.interval);
    }

}

ClipView.prototype.openDoor = function(callback){
  this.doorPath.animate({transform: "R" + this.rotationDegrees + "," + this.doorHinge.toS()},
                        this.openDoorTime, "elastic", callback)
}
ClipView.prototype.closeDoor = function(callback){
  this.doorPath.animate({transform: "R" + 0 + "," + this.doorHinge.toS()}, 200, "<", callback)
}
ClipView.prototype.popMuncher = function(){
  if(this.ready && this.muncherViews.length > 0){
    this.ready = false;
    this.openDoor();
    window.setTimeout(function(){
      var muncher = this.canvasElements.pop();
      this.canvasElements.animate({transform: "T" + this.interval.mul(this.currentMuncher).toS()},500, function(){this.currentMuncher++}.bind(this))
      muncher.animate({transform: "T" + this.interval.mul(10).toS()},500, "<",
        function(){ window.setTimeout(function(){
          this.closeDoor(function(){
            this.ready = this.currentMuncher <= this.totalMunchers;}.bind(this));
          }.bind(this), this.openDoorTime*0.2);
        }.bind(this));
    }.bind(this), this.openDoorTime*0.2);
    // TODO: return muncher program
    var muncherView = this.muncherViews.pop();
    return muncherView.program;
  }
}
