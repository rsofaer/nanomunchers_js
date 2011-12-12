var Simulator = function(board){
  this.munchers = [];
  this.board = board;
  this.time = 0;

  // Drop a muncher at the given node.
  this.dropMuncher = function(player, node, program){
    // Drop when not occupied.
    var occupied = this.munchers.some(function(e){
        return node === e.node;
        }, this);
    if(!occupied && !node.munched()){
      var muncher = new Muncher(player, node, this.time, program);
      this.munchers.push(muncher);
      return muncher;
    }else{ return {dead: true}; }
  }.bind(this)

  // Internal method to resolve muncher conflicts.
  var resolveConflicts = function(){
    // Hash munchers based on current node.
    var conflictMap = {}
    this.munchers.forEach(function(muncher){
        code = muncher.node.toS();
        if(conflictMap[code] === undefined){
          conflictMap[code] = [];
        }
        conflictMap[code].push(muncher);
      }, this)

    // Resolve conflicts using precedence rules.
    var resolvePrecedence = ["R", "D", "L", "U"];
    for(p in conflictMap){
      if(conflictMap.hasOwnProperty(p)){
        var nodeConflict = conflictMap[p];
        if(nodeConflict.length > 1){
          // Reverse sort by precedence.
          nodeConflict.sort(function(a, b){
              // Check newly dropped.
              if(a.startTime === this.time){
              }
              resolvePrecedence.indexOf(a) < resolvePrecedence.indexOf(b);
              });
          // Keep highest precedence.
          nodeConflict.shift();
          // Remove all others.
          nodeConflict.forEach(function(e){
            e.dead = true;
            this.munchers.splice(this.munchers.indexOf(e), 1);
          }, this);
        }
      }
    }
  }.bind(this)

  // Internal function to have all munchers eat at their node.
  var munch = function(){
    this.munchers.forEach(function(muncher){
      muncher.node.munch(muncher.player);
    });
  }.bind(this)

  // Internal function to move munchers.
  var move = function(){
    // Move and filter black holes.
    this.munchers = this.munchers.filter(function(muncher){
        // Move the muncher to the next step in the program.
        var blackHole = true;
        for(i = 0; i < 4; ++i){
          // Get instruction and rotate program.
          var instruction = muncher.programState.shift();
          muncher.programState.push(instruction);
          var nextNode = muncher.node[instruction];
          if((nextNode !== undefined) && !nextNode.munched()){
            muncher.node = nextNode;
            blackHole = false;
            break;
          }
        }
        if(blackHole){
          muncher.dead = true;
        }
        return !blackHole;
    });
  }.bind(this)

  // Advance the simulation.
  this.stepTime = function(){
    // 1. Munchers are dropped.
    // 2. Munchers resolve conflicts.
    // 3. Munchers munch.
    // 4. Munchers move.
    // 5. Back to 1.
    // This function assumes that all muchers have been
    // dropped.  It runs steps 2-4.
    resolveConflicts();
    munch();
    move();
    ++this.time;
  }.bind(this);

  this.timerService = function(){
    this.stepTime();
    GameUI.markMunchedNodes();
    GameUI.moveMunchers();
  }

  this.timer = setInterval(this.timerService.bind(this),
      GAME_TIMER_MS);
}
bindAllFunctions(Simulator);

// Muncher logic object used during simulation.
var Muncher = function(player, startNode, startTime, program){
  // The time that the muncher was dropped.
  this.startTime = startTime;
  // The nanomuncher location.
  this.node = startNode;
  // The nanomuncher program.
  this.program = (typeof(program) !== 'undefined') ? program
                                                   : this.randomProgram();
  // The executing program.
  this.programState = this.program;
  // The id of the owning player.
  this.player = player;

  this.dead = false;
}
// Generate a random program.
Muncher.randomProgram = function(){
  return Array.shuffle(["L","U","R","D"]);
}
bindAllFunctions(Muncher);

