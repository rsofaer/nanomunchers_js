/// <summary> Controls the nanomuncher core simulation. </summary>
var Simulator = function(board){
  this.munchers = [];
  this.board = board;
  this.time = 0;
  this.nodesMunched = 0;

  /// <summary> Drop a muncher at the given node. </summary>
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

  /// <summary> Internal method to resolve muncher conflicts. </summary>
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

  /// <summary> Internal method to have munchers eat at their node. </sumamry>
  var munch = function(){
    this.munchers.forEach(function(muncher){
      muncher.node.munch(muncher.player);
      this.nodesMunched++;
    }, this);
  }.bind(this)

  /// <summary> Internal function to move munchers. </summary>
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

  /// <summary> Advance the simulation by one time step. </summary>
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

  /// <summary> Return whether all nodes have been munched. </summary>
  this.allNodesMunched = function(){
    return this.nodesMunched === this.board.numNodes;
  }
}
bindAllFunctions(Simulator);

/// <summary>  Muncher logic object used during simulation. </summary>
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

/// <summary> A board is a set of nodes and edges. </summary>
/// <remarks>
///   <para> Each node on the board has a set of links keyed by the allowed
///     Nanomuncher program instructions. These properties may be used to test
///     and traverse from a node to one of its neighbors.
///   </para>
/// </remarks>
Board = function(xSize, ySize, numNodes, edgeProb){
  this.xSize = typeof(xSize) !== 'undefined' ? xSize : 30;
  this.ySize = typeof(ySize) !== 'undefined' ? ySize : 20;

  this.numNodes = typeof(numNodes) !== 'undefined' ? numNodes : 700;
  // if there could be an edge between i and j, there
  // is an edgeprob chance that it will be there
  this.edgeProb = typeof(edgeProb) !== 'undefined' ? edgeProb : 0.7;

  // Create all possible nodes.
  this.nodes = []
  for(var i = 0; i < xSize; i++){
    for(var j = 0; j < ySize; j++){
      this.nodes.push(new Node(i,j));
    }
  }

  // Pick a random subset of size numNodes.
  Array.shuffle(this.nodes);
  this.nodes.splice(numNodes, this.nodes.length - numNodes);
  // Create random edges based on edgeProb and create links.
  this.edges = [];
  for(var i = 0; i < this.nodes.length; i++){
    for(var j = i; j < this.nodes.length; j++){
      if(this.nodes[i].isNeighbor(this.nodes[j])){
        if(Math.random() <= edgeProb){
          this.edges.push([i,j]);
          if(this.nodes[i].x === this.nodes[j].x){
            // Higher y value is above
            if(this.nodes[i].y === this.nodes[j].y + 1){
              this.nodes[j]["U"] = this.nodes[i]
                this.nodes[i]["D"] = this.nodes[j]
            }else{
              this.nodes[j]["D"] = this.nodes[i]
                this.nodes[i]["U"] = this.nodes[j]
            }
          }else if(this.nodes[i].y === this.nodes[j].y){
            // Higher x value is to the left
            if(this.nodes[i].x === this.nodes[j].x + 1){
              this.nodes[i]["R"] = this.nodes[j];
              this.nodes[j]["L"] = this.nodes[i];
            }else{
              this.nodes[i]["L"] = this.nodes[j];
              this.nodes[j]["R"] = this.nodes[i];
            }
          }
        }
      }
    }
  }
}

/// <summary> A node is 2d point location. </summary>
/// <remarks>
///   <para> Nodes contain toxic waste that must be munched by a
///     player as the objective of the game.
///   </para>
/// </remarks>
var Node = function(x_, y_){
  this.x = x_;
  this.y = y_;
  this.munchedBy = null;
  // Test if another node is the same.
  this.isSame = function(nodeB){
    return (this.x === nodeB.x) && (this.y === nodeB.y)
  };
  // Calculate the distance between two nodes.
  this.distance = function(b){
    return Math.sqrt(Math.pow((this.x - b.x),2) + Math.pow((this.y-b.y),2));
  };
  // Check if the node is a neighbor.
  this.isNeighbor = function(nodeB){
    return (this.x === nodeB.x && Math.abs(this.y - nodeB.y) === 1) ||
           (this.y === nodeB.y && Math.abs(this.x - nodeB.x) === 1);
  };
  // Consume this node.
  this.munch = function(munchedBy){
    this.munchedBy = munchedBy;
    if(this.canvasElement){
      this.canvasElement.attr('fill', munchedBy.colorScheme[1]);
    }
  };
  // Is munched?
  this.munched = function(){ return this.munchedBy !== null; };
}
// Inherit mathematical helpers from Point.
Node.prototype.add = Point.prototype.add;
Node.prototype.sub = Point.prototype.sub;
Node.prototype.toS = Point.prototype.toS;
bindAllFunctions(Node)

