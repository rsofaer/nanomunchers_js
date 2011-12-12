// Nanomuncher UI object.
var MuncherView = function(paper, size, startPos, program, coreColor){
  var MUNCHER_GLOW_RATE_MS = 1000;
  var MUNCHER_COLOR = "#FFFACD"; // This is 'lemonchiffon', bitch.
  //var MUNCHER_CORE_COLOR = "#AA0AFF"; Not used because muncher cores are player colors.
  // Hard-coded order of canvas elements.
  var CANVAS_ELE_MAP = {
    "RIGHT": 1, "UP": 2, "LEFT": 3, "DOWN": 4, "CENTER" : 0
  };

  // The nanomuncher program. Used to render the instruction order.
  this.program = program;
  var program = this.program;
  // The initial position of the nanomuncher in paper coordinates.
  this.startPos = new Point(startPos.x, startPos.y);
  this.animationOffset = new Point(0, 0);
  this.__defineGetter__("loc", function(){ return this.animationOffset.add(this.startPos)})
  // Setup the nanomuncher graphics.
  this.canvasElement = function(){
    var set = paper.set();
    var rectDim = size / 3;
    var rectHalfDim = rectDim / 2;
    var textSize = size / 3.25;
    var programOrder = [
      program.indexOf("R") + 1,
      program.indexOf("U") + 1,
      program.indexOf("L") + 1,
      program.indexOf("D") + 1
      ];
    set.push(
        // Center.
        paper.circle(startPos.x, startPos.y,
                     rectDim / 2).attr({
                       "fill" : coreColor, "stroke" : "none"}),
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
        // Down.
        paper.rect(startPos.x - rectHalfDim,
                   startPos.y - rectHalfDim,
                   rectDim, rectDim).attr("fill", coreColor),
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
    return set;
  }()
  // Create glow for core.
  this.coreGlow = this.canvasElement[CANVAS_ELE_MAP["CENTER"]].glow({
      "color" : coreColor, "fill" : true
      }).toFront().transform("s0");
  // Glow state flag.
  this.glowState = 0;
  // Glowing turned on or off.
  this.glowing = false;
  // Move the nanomuncher to a new location using the given instruction.
  this.moveTo = function(newPoint){
    this.animationOffset = newPoint.sub(this.startPos);
    var tformStr = "t";
    tformStr += this.animationOffset.x + "," + this.animationOffset.y;
    this.canvasElement.animate({transform: tformStr}, GAME_TIMER_MS);
  }.bind(this)
  // The recursive glow routine.
  this.glowCallback = function(){
    console.log("whaat");
    console.log(this.coreGlow)
    if(this.glowing){
      var tformStr = "s";
      if(this.glowState === 0){
        tformStr += "1.0";
      }
      else if(this.glowState === 1){
        tformStr += "1.5";
      }
      this.coreGlow.animate({"transform" : tformStr}, MUNCHER_GLOW_RATE_MS,
                            "<>", this.glowCallback);
      // Mod glow state.
      ++this.glowState;
      this.glowState %= 2;
    }
    // Glow is stopping.
    else{
      this.coreGlow.transform("s0");
      this.glowState = 0;
    }
  }.bind(this)
  // Start glowing.
  this.startGlowing = function(){
    if(!this.glowing){
      this.glowing = true;
      this.coreGlow.transform("s0");
      this.glowCallback();
    }
  }.bind(this)
  // Stop glowing.
  this.stopGlowing = function(){
    this.glowing = false;
  }.bind(this)
}

