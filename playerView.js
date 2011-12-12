var PlayerView= function(paper, size, startPos, colorscheme){
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
    if("keydown" === flag && theKey === "FIRE" && this.keysDown[theKey] === 0){
      if(this.currentTarget !== undefined){
        var program = Muncher.randomProgram();
        var muncher = new MuncherView(GameUI.paper, 30, this.currentTarget,
                                      program, COLOR_SCHEMES[colorscheme][1]);
        //muncher.startGlowing();
      }
    }
    
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
  this.__defineGetter__("currentTarget", function(){ return this._currentTarget_; });
}

