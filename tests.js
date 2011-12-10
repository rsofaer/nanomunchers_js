describe("Nanomunchers", function() {
  it("Is a top level object", function() {
    expect(Nanomunchers != null);
  });

  it("generates input", function() {
    var f = Nanomunchers.boardGenerator.generateBoard;
    var board = f(10,10,50);
    expect(board.nodes.length === 50);
    expect(board.edges.length > 0);

    console.log(board);
  });
});

