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

                $(document).keypress(this.onKeyDown.bind(this));
              },
  onKeyDown: function(e){
               // Dispatch WASD to move player 1's ship, and spacebar to drop
               // Arrow keys for player 2's ship, and enter to drop
               var keycode = e.charCode;
               if(keycode >= KEYCODES.A + KEYCODES.CAPS_OFFSET &&
                   keycode <= KEYCODES.Z + KEYCODES.CAPS_OFFSET)
                 keycode -= KEYCODES.CAPS_OFFSET;

               var keyName = KEYCODES[keycode]
               if(this.keyMappings[keyName] !== undefined){
                 this.keyMappings[keyName].apply(this);
               }
             },

  keyMappings: { "W":        function(){this.player1.up()},
                 "A":        function(){this.player1.left()},
                 "S":        function(){this.player1.down()},
                 "D":        function(){this.player1.right()},
                 "SPACEBAR": function(){this.player1.drop()},
                 "O":       function(){this.player2.up()},
                 "K":     function(){this.player2.left()},
                 "SEMICOLON":    function(){this.player2.right()},
                 "L":     function(){this.player2.down()},
                 "RETURN":   function(){this.player2.drop()}}

                 //"UP":       function(){console.log(this)
                  // this.player2.up()},
                 //"DOWN":     function(){this.player2.down()},
                 //"LEFT":     function(){this.player2.left()},
                 //"RIGHT":    function(){this.player2.right()},
}

var Mothership = function(canvasElement){
  this.canvasElement = canvasElement;
  this.animationTime = 50;
  this.up = function(){
    this.canvasElement.animate({cy: this.canvasElement.attrs.cy-5}, this.animationTime)
  }.bind(this)
  this.right= function(){
    this.canvasElement.animate({cx: this.canvasElement.attrs.cx+5},this.animationTime)
  }.bind(this)
  this.left = function(){
    this.canvasElement.animate({cx: this.canvasElement.attrs.cx-5},this.animationTime)
  }.bind(this)
  this.down= function(){
    this.canvasElement.animate({cy: this.canvasElement.attrs.cy+5},this.animationTime)
  }.bind(this)
  this.drop = function(){}
}
