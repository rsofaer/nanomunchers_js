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

var GameUI = {
  initialize: function(){
                XSIZE = 800;
                YSIZE = 600;
                this.paper = Raphael("game-screen", XSIZE, YSIZE)
                this.paper.canvas.style["background-color"] = "lightgray";
                this.paper.canvas.style["border"] = "solid 1px";

                this.player1 = new Mothership(this.paper, 50,
                                              new Point(300, 300), "SEA")
                this.player2 = new Mothership(this.paper, 50,
                                              new Point(500, 300), "FOREST")

                this.board = Nanomunchers.boardGenerator.generateBoard(10,8,10*8/1.8, 0.75)
                Nanomunchers.boardPainter.drawBoard(this.paper, this.board);

                $(document).keydown(this.onKey.bind(this));
                $(document).keyup(this.onKey.bind(this));
                this.timer = setInterval(this.timerService.bind(this), TIMER_UPDATE_MS);
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
                 "SPACEBAR":  function(flag){this.player1.onKey(flag)},
                 // Player 2.
                 "UP":        function(flag){this.player2.onKey(flag, "UP")},
                 "LEFT":      function(flag){this.player2.onKey(flag, "LEFT")},
                 "DOWN":      function(flag){this.player2.onKey(flag, "DOWN")},
                 "RIGHT":     function(flag){this.player2.onKey(flag, "RIGHT")},
                 "RETURN":    function(flag){this.player2.onKey(flag)}},
  
  timerService: function(){
    [this.player1, this.player2].forEach(function(player){
      player.timerService();
      var closestNode = this.board.closestNode(player.loc);
      player.currentTarget = closestNode;
    }.bind(this));
  }
}
bindAllFunctions(GameUI);

var Mothership = function(paper, size, startPos, colorscheme){
  // Available schemes.
  var COLOR_SCHEMES = {
    "SEA":    [ "lightblue",  "blue", {width: 13, color: "blue"} ],
    "FOREST": [ "lightgreen", "green", {width: 13, color: "green", opacity: 0.7} ],
  };
  // Angle to rotate per animation step.
  var SHIP_ROTATION_SPEED = 18;
  // Additional speed when moving.
  var SHIP_ROTATION_SPEED_MOVE = 3;
  // Ship translation speed.
  var SHIP_SPEED = 4;
  // Time to animate.
  var ANIMATION_TIME = 25;
  // Current ship angle.
  this.shipAngle = 0;
  // Bounding box of ship.
  this.boundingBoxSize = size;
  // Ship center coordinate.
  this.shipCoord = new Point(startPos.x, startPos.y);
  this.animationOffset = new Point(0, 0);
  this.__defineGetter__("loc", function(){ return this.animationOffset.add(this.shipCoord)})
  // Setup the ship graphics.
  this.canvasElement = function(){
    var set = paper.set();
    var halfSize = size / 2;
    var triangleSide = (3 / Math.sqrt(3)) * halfSize;
    var triangleHt = (Math.sqrt(3) / 2) * triangleSide;
    var triangleHalfSize = triangleSide / 2;
    var trianglePath = "M" + startPos.x + "," + (startPos.y - halfSize) + "," +
                       "L" + (startPos.x + triangleHalfSize) + "," +
                             (startPos.y - halfSize + triangleHt) + "," +
                       "L" + (startPos.x - triangleHalfSize) + "," +
                             (startPos.y - halfSize + triangleHt) + "," +
                       "L" + startPos.x + "," + (startPos.y - halfSize);
    set.push(
        paper.circle(startPos.x, startPos.y, halfSize * 0.8),
        paper.path(trianglePath)
        );
    set[0].attr("fill", COLOR_SCHEMES[colorscheme][0]);
    set[1].attr("fill", COLOR_SCHEMES[colorscheme][1]);
    return set;
  }()
  // Map of keys pressed.
  this.keysDown = {"UP": 0, "DOWN": 0, "LEFT": 0, "RIGHT": 0};
  // Animate the ship by an offset.
  this.animate = function(offset){
    var tformStr = "t" + offset.x + "," + offset.y +
                   "r" + this.shipAngle + "," +
                         this.shipCoord.x + "," + this.shipCoord.y;
    this.canvasElement.animate( { transform: tformStr }, ANIMATION_TIME)
  }.bind(this)
  // Timer service routine.
  this.timerService = function(){
    // Update the rotation.
    this.shipAngle += SHIP_ROTATION_SPEED;
    // Animate the ship position.
    if(this.keysDown["UP"]){
      this.animationOffset.y -= SHIP_SPEED;
      this.shipAngle += SHIP_ROTATION_SPEED_MOVE;
    }
    if(this.keysDown["DOWN"]){
      this.animationOffset.y += SHIP_SPEED;
      this.shipAngle += SHIP_ROTATION_SPEED_MOVE;
    }
    if(this.keysDown["LEFT"]){
      this.animationOffset.x -= SHIP_SPEED;
      this.shipAngle += SHIP_ROTATION_SPEED_MOVE;
    }
    if(this.keysDown["RIGHT"]){
      this.animationOffset.x += SHIP_SPEED;
      this.shipAngle += SHIP_ROTATION_SPEED_MOVE;
    }
    this.animate(this.animationOffset);
  }.bind(this)
  // Process key press.
  this.onKey = function(flag, theKey){
    if("keydown" === flag){
      if(this.keysDown[theKey] === 0)
      {
        this.keysDown[theKey] = 1;
      }
    }
    else if("keyup" === flag){
      this.keysDown[theKey] = 0;
    }
  }.bind(this)

  this.targetGlowParams = COLOR_SCHEMES[colorscheme][2];
  this.__defineSetter__("currentTarget", function(node){
    if(this._currentTarget_ !== node){
      if(this._currentTargetGlow_ !== undefined){
        this._currentTargetGlow_.remove()
        this._currentTargetGlow_ = undefined;
      }
      this._currentTarget_ = node;
      if(node !== undefined){
        this._currentTargetGlow_ = node.canvasElement.glow(this.targetGlowParams);
      }
    }
  });
}

function glowTargets(){
  var player1Target = GameUI.board.closestNode(GameUI.player1.loc)
  var player2Target = GameUI.board.closestNode(GameUI.player2.loc)

  player1Target.canvasElement.glow({color: "blue"})
  player2Target.canvasElement.glow({color: "green"})
}

// Nanomuncher UI object.
var Muncher = function(paper, size, program, startPos){
  var muncherColor = "#FFFACD"; // This is 'lemonchiffon', bitch.
  var muncherCoreColor = "#A000FF";
  // Hard-coded order of canvas elements.
  var canvasElementMap = {
    "RIGHT": 0, "UP": 1, "LEFT": 2, "DOWN": 3, "CENTER" : 4
  };

  // The nanomuncher program. Used to render the instruction order.
  this.program = program;
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
        // Right.
        paper.rect(startPos.x + rectHalfDim,
                   startPos.y - rectHalfDim,
                   rectDim, rectDim).attr("fill", muncherColor),
        // Up.
        paper.rect(startPos.x - rectHalfDim,
                   startPos.y - rectHalfDim - rectDim,
                   rectDim, rectDim).attr("fill", muncherColor),
        // Left.
        paper.rect(startPos.x - rectHalfDim - rectDim,
                   startPos.y - rectHalfDim,
                   rectDim, rectDim).attr("fill", muncherColor),
        // Down.
        paper.rect(startPos.x - rectHalfDim,
                   startPos.y + rectHalfDim,
                   rectDim, rectDim).attr("fill", muncherColor),
        // Center.
        paper.rect(startPos.x - rectHalfDim,
                   startPos.y - rectHalfDim,
                   rectDim, rectDim).attr("fill", muncherCoreColor),
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
  this.coreGlow = this.canvasElement[canvasElementMap["CENTER"]].glow(
      { "color" : muncherCoreColor, "fill" : true, });
  // Glow state flag.
  this.glowState = 0;
  // Move the nanomuncher to a new location using the given instruction.
  this.moveTo = function(pos, dir){
  }.bind(this)
  // The timer service.
  this.timerService = function(){
    if(this.glowState === 0){
      this.coreGlow.animate({"transform" : "s1.2"}, 50);
    }
    else if(this.glowState === 1){
      this.coreGlow.animate({"transform" : "s2"}, 50);
    }
    // Flip glow state.
    ++this.glowState %= 2;
  }.bind(this)
}

