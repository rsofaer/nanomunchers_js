var Simulator = function(){
  //1. Munchers are dropped.
  //2. Munchers resolve conflicts.
  //3. Munchers munch.
  //4. Munchers move.
  //5. Back to 1.
  // This function assumes that all muchers have been dropped.  It runs steps 2-4
  this.stepTime = function(board){
    this.resolveConflicts(board);
    this.munch(board);
    this.move(board);
  }

  this.resolveConflicts = function(board){
    var conflictMap = {}
    board.munchers.forEach(function(muncher){
      code = muncher.toS();
      if(conflictMap[code] === undefined){
        conflictMap[code] = [];
      }
      conflictMap[code].push(muncher);
    });

    for(p in conflictMap){
      // Iterate non-inherited properties (the map) (this comment is for
      // Brandon).
      if(conflictMap.hasOwnProperty(p)){
        var muncherArr = conflictMap[p];
        if(muncherArr.length > 1){
          // TODO(reissb) -- 20111211 --
          //  Muncher array is a list of munchers @ each node.
          // We have more than one muncher at a node.  We must resolve through
          // combat.
        }
      }
    }
  }

  this.munch = function(board){
    board.munchers.forEach(function(muncher){
      var node = board.closestNode(muncher.loc);
      node.consume(muncher.player, muncher.player.munchColor);
    });
  }

  this.move = function(board){
    board.munchers.forEach(function(muncher){
      var node = board.closestNode(muncher.loc);

    });
  }
}()
bindAllFunctions(Simulator);

// Muncher logic object used during simulation.
var Muncher = function(startNode, startTime, program){
  // The time that the muncher was dropped.
  this.startTime = startTime;
  // The nanomuncher location.
  this.node = startNode;
  // The nanomuncher program.
  this.program = program;
}
// Generate a random program.
Muncher.randomProgram = function(){
  return Array.shuffle(["L","U","R","D"]);
}
bindAllFunctions(Muncher);

