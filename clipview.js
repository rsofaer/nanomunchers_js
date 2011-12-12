/// <summary> A UI object to store nanomunchers that can be dropped by
///   a player.
/// </summary>
/// <remarks>
///   <para> The clip contains nanomunchers initialized with random programs.
///     For the sake of gameplay experience, the tedium of programming
///     nanomunchers did not seem appealing.
///   </para>
/// <remarks>
var ClipView = function(paper, topLeft, bottomRight, numMunchers, playerColor){
  var width = bottomRight.x - topLeft.x;
  var height = bottomRight.y - topLeft.y;

  // Spacing on each side of munchers.
  var spacing = 20;
  var radius = (width - spacing*2)/2;
  // Step down clip placing nanomunchers.
  var currentSpot = new Point(topLeft.x + spacing + radius,
                              topLeft.y + spacing + radius);
  this.interval = new Point(0, radius*2 + spacing);


  // Compute bottom vertices for clip door animation.
  var clipBottomLeft = topLeft.add(this.interval.mul(numMunchers));
  clipBottomLeft.y += spacing/2;
  var clipBottomRight = new Point(bottomRight.x, clipBottomLeft.y);

  this.currentMuncher = 1;
  this.totalMunchers = numMunchers;
  this.ready = true;

  // Make sure we open the door inwards.
  var hinges = [clipBottomLeft, clipBottomRight];
  this.doorHinge = Array.min(hinges, function(p){
      return Math.abs(paper.width/2 - p.x);
      });
  // Open the door beyond parallel with vertical wall for visual quality.
  if(this.doorHinge === clipBottomLeft){
    this.rotationDegrees = 100;
  }else{
    this.rotationDegrees = -100;
  }
  // Compute final point of the clip.
  var topRight = new Point(bottomRight.x, topLeft.y);

  // Draw sides and top of clip:
  this.clipSidesPath = paper.path("M" + clipBottomLeft.toS() + " " +
                                  "L" + topLeft.toS() + " " +
                                  "L" + topRight.toS() + " " +
                                  "L" + clipBottomRight.toS());
  // Door is separate so that it may open.
  this.doorPath = paper.path("M" + clipBottomLeft.toS() + " " +
                             "L" + clipBottomRight.toS());

  // Put all MuncherViews in the same canvas element set while stepping
  // down the clip.
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

// Timings for animation events.
ClipView.prototype.DOOR_OPEN_MS = 1000;
ClipView.prototype.DOOR_CLOSE_MS = 200;
ClipView.prototype.POP_MUNCHER_MS = 500;


/// <summary> Trigger door open animation. </summary>
ClipView.prototype.openDoor = function(callback){
  this.doorPath.animate({transform: "R" + this.rotationDegrees + "," +
                                          this.doorHinge.toS()},
                        this.DOOR_OPEN_MS, "elastic", callback)
}

/// <summary> Trigger door close animation. </summary>
ClipView.prototype.closeDoor = function(callback){
  this.doorPath.animate({transform: "R" + 0 + "," +
                                          this.doorHinge.toS()},
                        this.DOOR_CLOSE_MS, "<", callback)
}

/// <summary> Eject muncher at the botton of the clip. </summary>
ClipView.prototype.popMuncher = function(){
  if(this.ready && this.muncherViews.length > 0){
    this.ready = false;
    this.openDoor();
    // Callback to perform shift down animation and eject animation.
    window.setTimeout(function(){
      var muncher = this.canvasElements.pop();
      // Shift all munchers down.
      var shiftOffset = this.interval.mul(this.currentMuncher);
      this.canvasElements.animate({transform: "T" + shiftOffset.toS()},
                                  this.POP_MUNCHER_MS,
                                  function(){this.currentMuncher++}.bind(this));
      // Eject the last muncher.
      muncher.animate({transform: "T" + this.interval.mul(10).toS()},
                      this.POP_MUNCHER_MS, "<",
                      // Callback to see there are still munchers remaining.
                      function(){
                          window.setTimeout(function(){
                              this.closeDoor(function(){
                                  this.ready = this.currentMuncher <=
                                               this.totalMunchers;}.bind(this));
                          }.bind(this), this.DOOR_OPEN_MS*0.2);
                      }.bind(this));
    }.bind(this), this.DOOR_OPEN_MS*0.2);
    // Return muncher program for the ejected muncher.
    var muncherView = this.muncherViews.pop();
    return muncherView.program;
  }
}

