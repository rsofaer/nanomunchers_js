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
               // Dispatch WASD to move player 1's ship, and spacebar to drop
               // Arrow keys for player 2's ship, and enter to drop
               var keyCode = e.keyCode;
               if(keyCode >= KEYCODES.A + KEYCODES.CAPS_OFFSET &&
                   keyCode <= KEYCODES.Z + KEYCODES.CAPS_OFFSET){
                 keyCode -= KEYCODES.CAPS_OFFSET;
               }

               var keyName = KEYCODES[keyCode]
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
      }
      this._currentTarget_ = node;
      this._currentTargetGlow_ = node.canvasElement.glow(this.targetGlowParams);
    }
  });
}

function glowTargets(){
  var player1Target = GameUI.board.closestNode(GameUI.player1.loc)
  var player2Target = GameUI.board.closestNode(GameUI.player2.loc)

  player1Target.canvasElement.glow({color: "blue"})
  player2Target.canvasElement.glow({color: "green"})
}
