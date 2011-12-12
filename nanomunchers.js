var Nanomunchers = {
}

// Time between animation updates.
var ANIMATION_TIMER_MS = 50;

// Time between game timesteps.
var GAME_TIMER_MS = 1000;

// A 2d point.
var Point = function(x_, y_){
  this.x = x_;
  this.y = y_;
}
Point.prototype.add = function(point){
  return new Point(point.x + this.x, point.y + this.y);
}
Point.prototype.sub = function(point){
  return new Point(this.x - point.x, this.y - point.y);
}
Point.prototype.mul = function(scalar){
  return new Point(this.x*scalar, this.y*scalar);
}
Point.prototype.toS = function(){
  return this.x + "," + this.y;
}

// Map of keys pressed.
var KeysDown = {};

var GameUI = {
  initialize: function(){
                // Setup graphics.
                var XSIZE = 800;
                var YSIZE = 600;
                this.paper = Raphael("game-screen", XSIZE, YSIZE)
                this.paper.canvas.style["background-color"] = "lightgray";
                this.paper.canvas.style["border"] = "solid 1px";
                // Create players.
                this.player1 = new PlayerView(this.paper, 50,
                                              new Point(300, 300), "SEA")
                this.player2 = new PlayerView(this.paper, 50,
                                              new Point(500, 300), "FOREST")

                // Create clips.
                var CLIP_WIDTH = 80;
                var NUM_MUNCHERS = 8;
                this.player1clip = new ClipView(this.paper, new Point(0,0), new Point(CLIP_WIDTH, YSIZE),
                                                NUM_MUNCHERS, this.player1.colorScheme[1])

                this.player2clip = new ClipView(this.paper, new Point(XSIZE - CLIP_WIDTH, 0),
                                                       new Point(XSIZE, YSIZE),
                                                NUM_MUNCHERS, this.player2.colorScheme[1])

                // Make board and its view.
                this.board = new Board(10,8,Math.floor(10*8/1.8), 0.75)
                this.boardView = new BoardView(this.paper, this.board, 15, 60);
                // Create simulation.
                this.simulator = new Simulator(this.board);
                // Holder for muncher UI items.
                this.muncherViews = []
                // Set key handlers.
                $(document).keydown(this.onKey.bind(this));
                $(document).keyup(this.onKey.bind(this));
                // Set timer sevice to handle input.
                this.timedObjects = [this.player1, this.player2];
                this.timer = setInterval(this.timerService.bind(this),
                                         ANIMATION_TIMER_MS);
                // Enforce z-order.
                this.player1.canvasElement.toFront();
                this.player2.canvasElement.toFront();
                this.boardView.canvasElements.toBack();
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
               var nodefaultKeys = ["UP", "LEFT", "DOWN", "RIGHT", "SPACEBAR"];
               if(nodefaultKeys.indexOf(keyName) >= 0){
                 e.preventDefault();
               }
               if(this.keyMappings[keyName] !== undefined){
                 this.keyMappings[keyName].apply(this, [e.type, keyName]);
               }
               this.updateKeysDown(e.type, keyName);
             },
  updateKeysDown: function(eventType, keyName){
    if("keydown" === eventType){
      KeysDown[keyName] = true;
    }
    else if("keyup" === eventType){
      KeysDown[keyName] = false;
    }
  },

  keyMappings: { // Player 1.
                 "W":         function(flag){this.player1.onKey(flag, "UP")},
                 "A":         function(flag){this.player1.onKey(flag, "LEFT")},
                 "S":         function(flag){this.player1.onKey(flag, "DOWN")},
                 "D":         function(flag){this.player1.onKey(flag, "RIGHT")},
                 "SPACEBAR":  function(flag, keyName){this.fireMuncher(flag, keyName, this.player1)},
                 // Player 2.
                 "UP":        function(flag){this.player2.onKey(flag, "UP")},
                 "LEFT":      function(flag){this.player2.onKey(flag, "LEFT")},
                 "DOWN":      function(flag){this.player2.onKey(flag, "DOWN")},
                 "RIGHT":     function(flag){this.player2.onKey(flag, "RIGHT")},
                 "RETURN":    function(flag, keyName){this.fireMuncher(flag, keyName, this.player2)}},

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
      var closestNode = this.boardView.closestNode(player.loc);
      player.currentTarget = closestNode;
    }.bind(this));
  },

  // The munchers are about to move.
  // Mark their nodes as munched.
  markMunchedNodes: function(){
    this.boardView.nodes.forEach(function(nodeView){
      if(nodeView.model.munchedBy !== nodeView.munchedBy){
        nodeView.munch(nodeView.model.munchedBy);
      }
    });
  },

  // A simulation time step just completed,
  // set the munchers moving to their new homes.
  moveMunchers: function(){
    for(var i = 0; i < this.muncherViews.length;){
      var e = this.muncherViews[i];
      if(e.model.dead){
        e.die();
        this.muncherViews.splice(i,1);
      }else{
        var modelNodeIdx = this.board.nodes.indexOf(e.model.node);
        e.moveTo(this.boardView.nodes[modelNodeIdx]);
        i++;
      }
    }
  },

  fireMuncher: function(eventType, keyName, player){
    if("keydown" === eventType && !(KeysDown[keyName])){
      if(player.currentTarget !== undefined){
        var muncher = this.simulator.dropMuncher(player,
            player.currentTarget.model, Muncher.randomProgram());
        var muncherView = new MuncherView(GameUI.paper, 30, player.currentTarget,
                                           muncher.program, player.colorScheme[1]);
        muncherView.model = muncher;
        // reissb -- 20111211 -- Fix for z-order issue.
        muncherView.canvasElement.insertBefore(this.boardView.canvasElements);
        this.muncherViews.push(muncherView);
        this.boardView.nodes[0].canvasElement.insertAfter(
            this.boardView.canvasElements[1]);

        // rjs454 -- 20111212 -- Glowing is too CPU intensive
        //muncherView.startGlowing();
      }
    }
  }
}
bindAllFunctions(GameUI);

