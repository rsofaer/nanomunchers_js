/// <summary> Time between animation updates. </summary>
var ANIMATION_TIMER_MS = 100;

/// <summary> Time between game timesteps. </summary>
var GAME_TIMER_MS = 800;

/// <summary> A 2d point. </summary>
var Point = function(x_, y_){
  this.x = x_;
  this.y = y_;
}
/// <summary> Add points. </summar>
Point.prototype.add = function(point){
  return new Point(point.x + this.x, point.y + this.y);
}
/// <summary> Subtract points. </summar>
Point.prototype.sub = function(point){
  return new Point(this.x - point.x, this.y - point.y);
}
/// <summary> Multiply point by scalar. </summar>
Point.prototype.mul = function(scalar){
  return new Point(this.x*scalar, this.y*scalar);
}
/// <summary> Convert point to string "X,Y". </summar>
Point.prototype.toS = function(){
  return this.x + "," + this.y;
}

/// <summary> Global map of keys pressed. </summary>
var KeysDown = {};

/// <summary> The GameUI owns and control the entire game. </summary>
/// <remarks>
///   <para> The GameUI owns the Simulator instance and all UI objects.
///     It advances the game using its main loop timer while keeping
///     the UI elements in sync with the game logic.
///   </para>
/// </remarks>
var GameUI = {
  /// <summary> Initialize the game. </summary>
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
                // Create score displays.
                var SCORE_X_OFFSET = 5;
                var SCORE_Y_OFFSET = 30;
                var SCORE_TEXT_SIZE = 23;
                // Player 1 score.
                this.scoreView1 =
                  new ScoreView(this.paper, new Point(SCORE_X_OFFSET,
                                                      SCORE_Y_OFFSET),
                                this.player1.colorScheme[1], SCORE_TEXT_SIZE,
                                "left", "Player1", 0);
                this.scoreView2 =
                  new ScoreView(this.paper, new Point(XSIZE - SCORE_X_OFFSET,
                                                      SCORE_Y_OFFSET),
                                this.player2.colorScheme[1], SCORE_TEXT_SIZE,
                                "right", "Player2", 0);

                // Create clips.
                var NUM_MUNCHERS = 10;
                var CLIP_Y_OFFSET = Math.floor(0.125 * YSIZE);
                var CLIP_WIDTH = Math.floor(0.08 * XSIZE);
                var CLIP_HEIGHT = Math.floor(0.75 * YSIZE);
                var clipDims = new Point(CLIP_WIDTH, CLIP_HEIGHT);
                this.player1.clip = new ClipView(this.paper,
                                                 new Point(0, CLIP_Y_OFFSET),
                                                 clipDims,
                                                 NUM_MUNCHERS,
                                                 this.player1.colorScheme[1]);
                var p2ClipX = XSIZE - CLIP_WIDTH;
                this.player2.clip = new ClipView(this.paper,
                                                 new Point(p2ClipX,
                                                           CLIP_Y_OFFSET),
                                                 clipDims,
                                                 NUM_MUNCHERS,
                                                 this.player2.colorScheme[1])

                // Make board and its view.
                var XNODESIZE = 10;
                var YNODESIZE = 9;
                this.board = new Board(XNODESIZE, YNODESIZE,
                                       Math.floor(XNODESIZE*YNODESIZE/1.8), 0.8)
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

                /// <summary> The game loop timer service. </summary>
                this.gameLoopTimerService = function(){
                  this.simulator.stepTime();
                  this.markMunchedNodes();
                  this.drawScores();
                  this.moveMunchers();
                }.bind(this)

                // Start the game loop.
                this.gameLoopTimer = setInterval(
                    this.gameLoopTimerService.bind(this),
                    GAME_TIMER_MS);
              },

  /// <summary> Inpu handler routine. </summary>
  onKey: function(e){
               // Handle keys using key mappings.
               var keyCode = e.keyCode;
               if(keyCode >= KEYCODES.A + KEYCODES.CAPS_OFFSET &&
                   keyCode <= KEYCODES.Z + KEYCODES.CAPS_OFFSET){
                 keyCode -= KEYCODES.CAPS_OFFSET;
               }
               var keyName = KEYCODES[keyCode];

               // Prevent defaults for arrows and spacebar.
               var nodefaultKeys = ["UP", "LEFT", "DOWN", "RIGHT", "SPACEBAR"];
               if(nodefaultKeys.indexOf(keyName) >= 0){
                 e.preventDefault();
               }
               if(this.keyMappings[keyName] !== undefined){
                 this.keyMappings[keyName].apply(this, [e.type, keyName]);
               }
               this.updateKeysDown(e.type, keyName);
             },

  /// <summary> Update key down map. <summary>
  updateKeysDown: function(eventType, keyName){
    if("keydown" === eventType){
      KeysDown[keyName] = true;
    }
    else if("keyup" === eventType){
      KeysDown[keyName] = false;
    }
  },

  /// <summary> Mapping to dispatch key events. </summary>
  keyMappings: {
                 // Player 1.
                 "W":         function(flag){this.player1.onKey(flag, "UP")},
                 "A":         function(flag){this.player1.onKey(flag, "LEFT")},
                 "S":         function(flag){this.player1.onKey(flag, "DOWN")},
                 "D":         function(flag){this.player1.onKey(flag, "RIGHT")},
                 "SPACEBAR":  function(flag, keyName){
                                  this.fireMuncher(flag, keyName, this.player1)
                              },
                 // Player 2.
                 "UP":        function(flag){this.player2.onKey(flag, "UP")},
                 "LEFT":      function(flag){this.player2.onKey(flag, "LEFT")},
                 "DOWN":      function(flag){this.player2.onKey(flag, "DOWN")},
                 "RIGHT":     function(flag){this.player2.onKey(flag, "RIGHT")},
                 "RETURN":    function(flag, keyName){
                                  this.fireMuncher(flag, keyName, this.player2)
                              }
                },

  /// <summary> Add an object to the animation timer service. </summary>
  addTimedObject: function(obj){
    if(this.timedObjects.indexOf(obj) < 0){
      this.timedObjects.push(obj);
    }
  },

  /// <summary> Remove an object from the animation timer service. </summary>
  removeTimedObject: function(obj){
    var idx = this.timedObjects.indexOf(obj);
    if(idx >= 0){
      this.timedObjects.splice(idx, 1);
    }
  },

  /// <summary> The animation timer routine. </summary>
  /// <remarks>
  ///   <para> Handles re-targeting and prompts the player motion. </para>
  /// </remarks>
  timerService: function(){
    this.timedObjects.forEach(function(player){
      player.timerService();
      var closestNode = this.boardView.closestNode(player.loc);
      player.currentTarget = closestNode;
    }.bind(this));
  },

  /// <summary> Draw the scores of the players on top of the board. </summary>
  drawScores: function(){
    this.scoreView1.updateScore(this.player1.score);
    this.scoreView2.updateScore(this.player2.score);
  },

  /// <summary> Mark the muncher nodes before the munchers move. </summary>
  ///  As we go, update the scores of the players.
  ///  Afterwards, re-draw the scores of the players.
  markMunchedNodes: function(){
    this.player1.score = 0;
    this.player2.score = 0;
    this.boardView.nodes.forEach(function(nodeView){
      if(nodeView.model.munchedBy){
        nodeView.model.munchedBy.score++;
      }
      if(nodeView.model.munchedBy !== nodeView.munchedBy){
        nodeView.munch(nodeView.model.munchedBy);
      }
    });
  },

  /// <summary> Update the UI after a simulation step. </summary>
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

  /// <summary> Deploy a muncher at the targeted node. </summary>
  fireMuncher: function(eventType, keyName, player){
    // Check for keydown and KeysDown to avoid repeat firings.
    if("keydown" === eventType && !(KeysDown[keyName])){
      // Make sure the player has a target and is not already firing.
      if(player.currentTarget !== undefined && player.clip.ready){
        // Get a program from the clip, and set off the clip animation.
        var program = player.clip.popMuncher()
        // The clip will return false if there is no muncher remaining.
        if(program){
          var muncher = this.simulator.dropMuncher(player,
              player.currentTarget.model, program);
          var muncherView = new MuncherView(GameUI.paper, 20,
                                            player.currentTarget,
                                            program, player.colorScheme[1]);
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
  },

  /// <summary> Return whether the game is over </summary>
  gameOver: function(){
    return (this.simulator.allNodesMunched() ||
             (this.player1.clip.empty() && this.player2.clip.empty()));
  }
}
bindAllFunctions(GameUI);

