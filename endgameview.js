/// <summary> Display the end-game menu. </summary>
/// <remarks>
///   <para>
///   </para>
/// </remarks>
var EndGameView = function(paper, winner, width, height){
  var TEXTOFFSETY = 40;
  var winString = "";
  if(winner.length === 2){
    winString = "The game was a tie.  You must fight with fists!";
  }else{
    winString = "The winner is: " + winner + "!";
  }

  var center = new Point(paper.width/2, paper.height/2);
  var topLeft = new Point(center.x - width/2, center.y - height/2);

  paper.setStart();
  this.rect = paper.rect(topLeft.x, topLeft.y, width, height,0);
  this.rect.attr({fill: "white"});
  this.winText = paper.text(center.x, topLeft.y + TEXTOFFSETY, winString);
  this.winText.attr({"font-size": "20px",
                     "font-family": "helvetica"});

  var BUTTONHEIGHT = 60;
  this.playAgainButton = paper.rect(center.x - width/3, topLeft.y + height/2, 2*width/3, BUTTONHEIGHT, 3).attr(
      {fill: "lightgray"});
  this.playAgainText = paper.text(center.x, topLeft.y + height/2 + BUTTONHEIGHT/2, "Play again?").attr(
      {"font-size": "18px", "font-family": "helvetica"} );

  // On clicking playAgain, remove this menu and restart the game.
  this.playAgainButton.click(function(){this.canvasElements.remove(); GameUI.restart();}.bind(this));
  this.canvasElements = paper.setFinish();
}
bindAllFunctions(EndGameView);

