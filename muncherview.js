/// <summary> Nanomuncher UI object. </summary>
var MuncherView = function(paper, size, startPos, program,
                           coreColor, showText){
  var MUNCHER_GLOW_RATE_MS = 1000;
  var MUNCHER_COLOR = "#FFFACD"; // This is 'lemonchiffon', bitch.
  // Hard-coded order of canvas elements.
  var CANVAS_ELE_MAP = {
    "R": 0, "U": 1, "L": 2, "D": 3, "C" : 4
  };

  // The nanomuncher program. Used to render the instruction order.
  this.program = program;
  // The initial position of the nanomuncher in paper coordinates.
  this.startPos = new Point(startPos.x, startPos.y);
  this.animationOffset = new Point(0, 0);
  this.showText = showText;

  /// <summary> Get the muncher location on the screen. </summary>
  this.getLoc = function(){
    return this.animationOffset.add(this.startPos);
  }.bind(this);

  // Setup the nanomuncher graphics.
  this.canvasElements = function(){
    var set = paper.set();
    var rectDim = size / 3;
    var rectHalfDim = rectDim / 2;
    var textSize = size / 3.25;
    set.push(
        // Right.
        paper.rect(startPos.x + rectHalfDim,
                   startPos.y - rectHalfDim,
                   rectDim, rectDim).attr("fill", MUNCHER_COLOR),
        // Up.
        paper.rect(startPos.x - rectHalfDim,
                   startPos.y - rectHalfDim - rectDim,
                   rectDim, rectDim).attr("fill", MUNCHER_COLOR),
        // Left.
        paper.rect(startPos.x - rectHalfDim - rectDim,
                   startPos.y - rectHalfDim,
                   rectDim, rectDim).attr("fill", MUNCHER_COLOR),
        // Down.
        paper.rect(startPos.x - rectHalfDim,
                   startPos.y + rectHalfDim,
                   rectDim, rectDim).attr("fill", MUNCHER_COLOR),
        // Center.
        paper.rect(startPos.x - rectHalfDim,
                   startPos.y - rectHalfDim,
                   rectDim, rectDim).attr("fill", coreColor),
        // Center circle.
        paper.circle(startPos.x, startPos.y,
                     rectDim / 4).attr({
                       "fill" : "light" + coreColor, "stroke" : "none"})
        );
    // Create glows.
    this.glowStartIdx = set.length;
    set.push(
        set[0].glow({"color" : MUNCHER_COLOR}).hide(),
        set[1].glow({"color" : MUNCHER_COLOR}).hide(),
        set[2].glow({"color" : MUNCHER_COLOR}).hide(),
        set[3].glow({"color" : MUNCHER_COLOR}).hide()
        );
    // Show text only when size is large.
    this.textStartIdx = set.length;
    if(this.showText){
      var programOrder = [
        program.indexOf("R") + 1,
        program.indexOf("U") + 1,
        program.indexOf("L") + 1,
        program.indexOf("D") + 1
        ];
      set.push(
          // Right.
          paper.text(startPos.x + rectDim, startPos.y, programOrder[0]).attr({
            "font-family" : "Courier", "font-size" : textSize
            }),
          // Up.
          paper.text(startPos.x, startPos.y - rectDim, programOrder[1]).attr({
            "font-family" : "Courier", "font-size" : textSize
            }),
          // Left.
          paper.text(startPos.x - rectDim, startPos.y, programOrder[2]).attr({
            "font-family" : "Courier", "font-size" : textSize
            }),
          // Down.
          paper.text(startPos.x, startPos.y + rectDim, programOrder[3]).attr({
            "font-family" : "Courier", "font-size" : textSize
            })
          );
    }
    return set;
  }.apply(this)

  /// <summary> Move the nanomuncher to a new location using the
  ///   given instruction.
  /// <summary>
  this.moveTo = function(newPoint){
    this.animationOffset = newPoint.sub(this.startPos);
    var tformStr = "t";
    tformStr += this.animationOffset.x + "," + this.animationOffset.y;
    this.canvasElements.animate({transform: tformStr}, GAME_TIMER_MS*0.8);
    // Show the glow.
    var glowIdx = CANVAS_ELE_MAP[this.model.programState[3]];
    this.canvasElements[this.glowStartIdx + 0].hide();
    this.canvasElements[this.glowStartIdx + 1].hide();
    this.canvasElements[this.glowStartIdx + 2].hide();
    this.canvasElements[this.glowStartIdx + 3].hide();
    this.canvasElements[this.glowStartIdx + glowIdx].show();
  }.bind(this)

  /// <summary> Remove the muncher from the canvas. </summary>
  this.die = function(){
    this.canvasElements.remove();
  }.bind(this)

  // reissb -- 20111212 -- The core glow is a major performance hit.
//  // Create glow for core.
//  this.coreGlow = this.canvasElements[CANVAS_ELE_MAP["C"]].glow({
//      "color" : coreColor, "fill" : true
//      }).toFront().transform("s0");
//  // Glow state flag.
//  this.glowState = 0;
//  // Glowing turned on or off.
//  this.glowing = false;
//
//  // The recursive glow routine.
//  this.glowCallback = function(){
//    console.log("whaat");
//    console.log(this.coreGlow)
//    if(this.glowing){
//      var tformStr = "s";
//      if(this.glowState === 0){
//        tformStr += "1.0";
//      }
//      else if(this.glowState === 1){
//        tformStr += "1.5";
//      }
//      this.coreGlow.animate({"transform" : tformStr}, MUNCHER_GLOW_RATE_MS,
//                            "<>", this.glowCallback);
//      // Mod glow state.
//      ++this.glowState;
//      this.glowState %= 2;
//    }
//    // Glow is stopping.
//    else{
//      this.coreGlow.transform("s0");
//      this.glowState = 0;
//    }
//  }.bind(this)
//
//  // Start glowing.
//  this.startGlowing = function(){
//    if(!this.glowing){
//      this.glowing = true;
//      this.coreGlow.transform("s0");
//      this.glowCallback();
//    }
//  }.bind(this)
//  // Stop glowing.
//  this.stopGlowing = function(){
//    this.glowing = false;
//  }.bind(this)
}
/// <summary> Hide the program order text. </summary>
MuncherView.prototype.hideText = function(){
  if(this.showText){
    this.canvasElements[this.textStartIdx + 0].hide();
    this.canvasElements[this.textStartIdx + 1].hide();
    this.canvasElements[this.textStartIdx + 2].hide();
    this.canvasElements[this.textStartIdx + 3].hide();
  }
}

