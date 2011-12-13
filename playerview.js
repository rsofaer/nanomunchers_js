/// <summary> UI for player spinning mothership. </summary>
var PlayerView= function(paper, size, startPos, colorscheme){
  // Available schemes.
  var COLOR_SCHEMES = {
    "SEA":    [ "lightblue",  "blue",
                {width: 13, color: "blue"} ],
    "FOREST": [ "lightgreen", "green",
                {width: 13, color: "green", opacity: 0.7} ]
  };
  this.colorScheme = COLOR_SCHEMES[colorscheme];
  // Angle to rotate per animation step.
  var SHIP_ROTATION_SPEED = 36;
  // Additional speed when moving.
  var SHIP_ROTATION_SPEED_MOVE = 6;
  // Ship translation speed.
  var SHIP_SPEED = 12;
  // Current ship angle.
  this.shipAngle = 0;
  // Bounding box of ship.
  this.boundingBoxSize = size;
  // Ship center coordinate.
  this.shipCoord = new Point(startPos.x, startPos.y);
  this.animationOffset = new Point(0, 0);

  /// <summary> Location of the player ship center in UI space. </summary>
  this.getLoc = function(){
    return this.animationOffset.add(this.shipCoord);
  }.bind(this)

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
    set[0].attr("fill", this.colorScheme[0]);
    set[1].attr("fill", this.colorScheme[1]);
    return set;
  }.apply(this)
  // Map of keys pressed.
  this.keysDown = {"UP": 0, "DOWN": 0, "LEFT": 0, "RIGHT": 0};

  /// <summary> Move the ship offset from its current location. </summary>
  this.animate = function(offset){
    var tformStr = "t" + offset.x + "," + offset.y +
                   "r" + this.shipAngle + "," +
                         this.shipCoord.x + "," + this.shipCoord.y;
    this.canvasElement.animate( { transform: tformStr }, ANIMATION_TIMER_MS)
  }.bind(this)

  /// <summary> Timer service routine. </summary>
  /// <remarks>
  ///   <para> The timer service responds to I/O commands and plays
  ///     the idle ship animation.
  ///   </para>
  /// </remarks>
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

  this.targetGlowParams = this.colorScheme[2];

  /// <summary> Set the ships currently targeted node. </summary>
  this.setCurrentTarget = function(node){
    if(this.currentTarget !== node){
      if(this.currentTargetGlow !== undefined){
        this.currentTargetGlow.remove();
        this.currentTargetGlow = undefined;
      }
      this.currentTarget = node;
      if(node !== undefined){
        this.currentTargetGlow =
          node.canvasElement.glow(this.targetGlowParams);
      }
    }
  };

  /// <summary> Accessor for the current target. </summary>
  this.getCurrentTarget = function(){ return this.currentTarget; }.bind(this)

  this.destroyCanvasElements = function(){
    this.clip.destroyCanvasElements();
    this.canvasElement.remove();
    this.canvasElement = null;
    this.currentTargetGlow.remove();
  }
}

