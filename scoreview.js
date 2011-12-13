/// <summary> Display the player score. </summary>
/// <remarks>
///   <para>
///   </para>
/// </remarks>
var ScoreView = function(paper, anchorPoint, textColor, textSize,
                         layout, name, initialScore){
  // Collect parameters.
  this.paper = paper;
  this.anchorPoint = anchorPoint;
  this.textColor = textColor;
  this.textSize = textSize;
  this.layout = layout;
  this.name = name;
  this.score = initialScore;
  var textAnchor = "";
  if(this.layout === "left"){
    textAnchor = "start";
  }
  else if(this.layout === "right"){
    textAnchor = "end";
  }
  // Setup text object.
  var attrs = {"font-size" : this.textSize + "px",
               "font-family" : "Courier",
               "text-anchor" : textAnchor,
               "stroke" : this.textColor};
  this.textElement = paper.text(anchorPoint.x, anchorPoint.y,
                                this.name + "\n" + this.score).attr(attrs);

  /// <summary> Update the score. </summary>
  this.updateScore = function(score){
    this.score = score;
    this.textElement.attr("text", this.name + "\n" + this.score);
  }
}

/// <summary> Remove all canvas elements from the canvas. </summary>
ScoreView.prototype.destroyCanvasElements = function(){
  this.textElement.remove();
}

bindAllFunctions(ScoreView);

