var Nanomunchers = {
}

// Time between animation updates.
var TIMER_UPDATE_MS = 50;

// A 2d point.
var Point = function(x_, y_){
  this.x = x_;
  this.y = y_;
}
Point.prototype.add = function(point){
  return new Point(point.x + this.x, point.y + this.y);
}
Point.prototype.toS = function(){
  return this.x + "," + this.y;
}

var GameUI = {
  initialize: function(){
                var XSIZE = 800;
                var YSIZE = 600;
                this.paper = Raphael("game-screen", XSIZE, YSIZE)
                this.paper.canvas.style["background-color"] = "lightgray";
                this.paper.canvas.style["border"] = "solid 1px";

                this.player1 = new PlayerView(this.paper, 50,
                                              new Point(300, 300), "SEA")
                this.player2 = new PlayerView(this.paper, 50,
                                              new Point(500, 300), "FOREST")

                this.board = new Board(10,8,10*8/1.8, 0.75)
                Nanomunchers.boardPainter.drawBoard(this.paper, this.board);

                $(document).keydown(this.onKey.bind(this));
                $(document).keyup(this.onKey.bind(this));
                this.timer = setInterval(this.timerService.bind(this), TIMER_UPDATE_MS);
                this.timedObjects = [this.player1, this.player2];
              },

  onKey: function(e){
               // Handle keys using key mappings.
               var keyCode = e.keyCode;
               if(keyCode >= KEYCODES.A + KEYCODES.CAPS_OFFSET &&
                   keyCode <= KEYCODES.Z + KEYCODES.CAPS_OFFSET){
                 keyCode -= KEYCODES.CAPS_OFFSET;
               }
               var keyName = KEYCODES[keyCode];
               // Prevent defaults for arrows.
               if(["UP", "LEFT", "DOWN", "RIGHT"].indexOf(keyName) >= 0){
                 e.preventDefault();
               }
               if(this.keyMappings[keyName] !== undefined){
                 this.keyMappings[keyName].apply(this, [e.type]);
               }
             },

  keyMappings: { // Player 1.
                 "W":         function(flag){this.player1.onKey(flag, "UP")},
                 "A":         function(flag){this.player1.onKey(flag, "LEFT")},
                 "S":         function(flag){this.player1.onKey(flag, "DOWN")},
                 "D":         function(flag){this.player1.onKey(flag, "RIGHT")},
                 "SPACEBAR":  function(flag){this.player1.onKey(flag, "FIRE")},
                 // Player 2.
                 "UP":        function(flag){this.player2.onKey(flag, "UP")},
                 "LEFT":      function(flag){this.player2.onKey(flag, "LEFT")},
                 "DOWN":      function(flag){this.player2.onKey(flag, "DOWN")},
                 "RIGHT":     function(flag){this.player2.onKey(flag, "RIGHT")},
                 "RETURN":    function(flag){this.player2.onKey(flag, "FIRE")}},

  addTimedObject: function(obj){
    if(this.timedObjects.indexOf(obj) < 0){
      this.timedObjects.push(obj);
    }
  },

  removeTimedObject: function(obj){
    var idx = this.timedObjects.indexOf(obj);
    if(idx >= 0){
      this.timedObjects.splice(idx, 1);
    }
  },
  
  timerService: function(){
    this.timedObjects.forEach(function(player){
      player.timerService();
      var closestNode = this.board.closestNode(player.loc);
      player.currentTarget = closestNode;
    }.bind(this));
  }
}
bindAllFunctions(GameUI);

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
  this.moveTo = function(pos, dir){
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

