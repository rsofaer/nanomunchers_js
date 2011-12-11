var Nanomunchers = {
}

function case_i_equals(charCode, keycode){
  return (charCode === keycode || charCode - KEYCODES.CAPS_OFFSET === keycode);
}

// A 2d point.
var Point = function(x_, y_){
  this.x = x_;
  this.y = y_;
  this.__defineGetter__("cx", function(){ return this.x });
  this.__defineGetter__("cy", function(){ return this.y });
}

var GameUI = {
  initialize: function(){
                this.paper = Raphael("game-screen", 800, 600)
                this.paper.canvas.style["background-color"] = "gray";
                this.player1 = new Mothership(this.paper, 50,
                                              new Point(300, 300))
                this.player2 = new Mothership(this.paper, 50,
                                              new Point(500, 300))

                $(document).keydown(this.onKey.bind(this));
                $(document).keyup(this.onKey.bind(this));
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
                 "RETURN":    function(flag){this.player2.onKey(flag)}}
}

var Mothership = function(paper, size, startPos){
  // Time between animation updates.
  var TIMER_UPDATE_MS = 50;
  // Angle to rotate per animation step.
  var SHIP_ROTATION_SPEED = 12;
  // Additional speed when moving.
  var SHIP_ROTATION_SPEED_MOVE = 3;
  // Ship translation speed.
  var SHIP_SPEED = 3;
  // Time to animate.
  var ANIMATION_TIME = 25;
  // Current ship angle.
  this.shipAngle = 0;
  // Bounding box of ship.
  this.boundingBoxSize = size;
  // Ship center coordinate.
  this.shipCoord = new Point(startPos.x, startPos.y);
  this.animationOffset = new Point(0, 0);
  // Setup the ship graphics.
  this.canvasElement = function(paper, size, startPos){
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
    return set;
  }(paper, size, startPos)
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
  // Setup the timer service.
  this.timer = setInterval(this.timerService, TIMER_UPDATE_MS);
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
}
