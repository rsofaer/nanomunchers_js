/// <summary> A UI object to store nanomunchers that can be dropped by
///   a player.
/// </summary>
/// <remarks>
///   <para> The clip contains nanomunchers initialized with random programs.
///     For the sake of gameplay experience, the tedium of programming
///     nanomunchers did not seem appealing.
///   </para>
/// <remarks>
var ClipView = function(paper, topLeft, size, numMunchers, playerColor){
  this.size = size;
  this.paper = paper;
  var topLeft = topLeft;
  var clipBottomRight = topLeft.add(size);
  var clipBottomLeft = new Point(topLeft.x, clipBottomRight.y);
  var topRight = new Point(clipBottomRight.x, topLeft.y);

  // Vertical spacing and size of munchers.
  var spacing = Math.floor(size.y / numMunchers);
  var radius = Math.floor((spacing * 0.75) / 2);
  // Compute origin and step down clip placing nanomunchers.
  var currentSpot = new Point(topLeft.x + Math.floor(size.x / 2),
                              topLeft.y + Math.floor(spacing / 2));
  this.interval = new Point(0, spacing);

  this.currentMuncher = 1;
  this.numMunchers = numMunchers;
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
ClipView.prototype.DOOR_OPEN_MS = 800;
ClipView.prototype.DOOR_CLOSE_MS = 180;
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
    // Return muncher program for the ejected muncher.
    var muncherView = this.muncherViews.pop();
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
      var paperSizeY = new Point(0, this.paper.height);
      var currentLocY = new Point(0, muncherView.loc.y);
      var ejectOffset = paperSizeY.add(currentLocY.add(this.interval.mul(
            this.numMunchers)));
      playSound("fire");
      muncher.animate({transform: "T" +
                       muncherView.animationOffset.add(ejectOffset).toS()},
                      this.POP_MUNCHER_MS, "<",
                      // Callback to see there are still munchers remaining.
                      function(){
                          window.setTimeout(function(){
                              this.closeDoor(function(){
                                  this.ready = this.currentMuncher <=
                                               this.numMunchers;}.bind(this));
                          }.bind(this), this.DOOR_OPEN_MS*0.15);
                      }.bind(this));
    }.bind(this), this.DOOR_OPEN_MS*0.15);
    return muncherView.program;
  }
}

/// <summary> Return whether the clip is empty. </summary>
ClipView.prototype.empty = function(){
  return this.muncherViews.length === 0;
}

