var Nanomunchers = {
}

function case_i_equals(charCode, keycode){
  return (charCode === keycode || charCode - KEYCODES.CAPS_OFFSET === keycode);
}

var GameUI = {
  initialize: function(){
                this.paper = Raphael("game-screen", 800, 600)
                this.paper.canvas.style["background-color"] = "gray";
                this.player1 = new Mothership(this.paper.circle(100,100,50))
                this.player2 = new Mothership(this.paper.circle(300,300,50))

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
                 "W":         function(flag){this.player1.move(flag, "UP")},
                 "A":         function(flag){this.player1.move(flag, "LEFT")},
                 "S":         function(flag){this.player1.move(flag, "DOWN")},
                 "D":         function(flag){this.player1.move(flag, "RIGHT")},
                 "SPACEBAR":  function(flag){this.player1.drop(flag)},
                 // Player 2.
                 "O":         function(flag){this.player2.move(flag, "UP")},
                 "K":         function(flag){this.player2.move(flag, "LEFT")},
                 "SEMICOLON": function(flag){this.player2.move(flag, "RIGHT")},
                 "L":         function(flag){this.player2.move(flag, "DOWN")},
                 "RETURN":    function(flag){this.player2.drop(flag)}}

                 //"UP":       function(){this.player2.up()},
                 //"DOWN":     function(){this.player2.down()},
                 //"LEFT":     function(){this.player2.left()},
                 //"RIGHT":    function(){this.player2.right()},
}

var Mothership = function(canvasElement){
  var TIMER_UPDATE_MS = 50;
  this.canvasElement = canvasElement;
  this.animationTime = 25;
  this.keysDown = {"UP": 0, "DOWN": 0, "LEFT": 0, "RIGHT": 0};
  this.keyDownCount = 0;
  this.timer = null;
  this.onKeyDownTimer = function(){
    if(this.keysDown["UP"] && !this.keysDown["DOWN"]){
      this.canvasElement.animate({cy: this.canvasElement.attrs.cy-5},
                                 this.animationTime)
    }
    if(this.keysDown["DOWN"] && !this.keysDown["UP"]){
      this.canvasElement.animate({cy: this.canvasElement.attrs.cy+5},
                                 this.animationTime)
    }
    if(this.keysDown["LEFT"] && !this.keysDown["RIGHT"]){
      this.canvasElement.animate({cx: this.canvasElement.attrs.cx-5},
                                 this.animationTime)
    }
    if(this.keysDown["RIGHT"] && !this.keysDown["LEFT"]){
      this.canvasElement.animate({cx: this.canvasElement.attrs.cx+5},
                                 this.animationTime)
    }
  }.bind(this)
  this.move = function(flag, theKey){
    if("keydown" === flag){
      if(this.keysDown[theKey] === 0)
      {
        if(theKey === "UP"){
          this.canvasElement.animate({cy: this.canvasElement.attrs.cy-5},
                                     this.animationTime)
        }
        else if(theKey === "DOWN"){
          this.canvasElement.animate({cy: this.canvasElement.attrs.cy+5},
                                     this.animationTime)
        }
        else if(theKey === "LEFT"){
          this.canvasElement.animate({cx: this.canvasElement.attrs.cx-5},
                                     this.animationTime)
        }
        else if(theKey === "RIGHT"){
          this.canvasElement.animate({cx: this.canvasElement.attrs.cx+5},
                                     this.animationTime)
        }
        this.keysDown[theKey] = 1;
        if(++this.keyDownCount === 1){
          this.timer = setInterval(this.onKeyDownTimer, TIMER_UPDATE_MS);
        }
      }
    }
    else if("keyup" === flag){
      this.keysDown[theKey] = 0;
      if(--this.keyDownCount === 0){
        clearInterval(this.timer);
        this.timer = null
      }
    }
  }.bind(this)
}
