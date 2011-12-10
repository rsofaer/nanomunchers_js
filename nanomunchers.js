var Nanomunchers = {
  GetBoards: function(){
      $.get("/boards/0").success(function(){
        Nanomunchers.boardsNumber = this
      })
    }
}
