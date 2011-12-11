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

