(function() {
  "use strict";

  var n = 4; // 4x4 tile grid = 15 numbered tiles and one blank
  var tiles = [];
  var moves = 0;

  var $newGame       = $('[name=new-game]');
  var $simulateGame  = $('[name=win-game]'); // Added this to simulate a win
  var $board         = $('[data-target=board]');
  var $score         = $('[data-target=score]');
  var $win           = $('[data-target=win]');


  function start() {
    reset();
    $newGame.on('click', reset);
    $simulateGame.on('click', simulateWin);
  }

  function reset() {
    moves = 0;
    tiles = [];
    for ( var x = 0; x < n*n; x++ ) {
      tiles.push(x)
    }
    shuffle();
    while ( solvable() == false ) {
      shuffle();
    }
    render();
    $win.addClass('hidden');
  }


  function render() {
    $score.html(moves);
    var html = '';

    for ( var i = 0; i < tiles.length; i++ ) {
      html += '<div class="tile';
      html += tileClass(i);
      html += '" data-pos="'+i+'">'+tiles[i]+'</div>';
    }
    $board.html(html);
    $('.tile').on('click', move);
    checkWin();
  }

  function tileClass(index) {
    if ( tiles[index] == 0 ) {
      return ' open';
    } else if (tileCanMove(index)) {
      return ' active';
    } else {
      return '';
    }
  }

  function checkWin() {
    for ( var i = 0; i < tiles.length; i++ ) {
      if ( tiles[i] != 0 && tiles[i] != i + 1 ) {
        return false;
      }
    }
    $win.removeClass('hidden');
    return true;
  }

  function move(e) {
    /*
      Moves adjacent tiles based on whether tile is active/adjacent to empty tiles & increments moves
      @param {obj} e 
      @return {function} swapTiles
      @return {function} render
      @return {function} checkWin
    */
    var $target = $(event.target);
    var tilePos = $target.attr('data-pos');
    var blankPos = indexOfBlank();
    var isActiveTile = tileCanMove(tilePos);

    if (isActiveTile) {
      moves += 1;
      swapTiles(tilePos, blankPos);
      render();
      checkWin();
    }
  }

  function tileCanMove(index) {
    /*
      Added logic to narrow scope of "active"/adjacent tiles to blank tile
      @param {num} index
      @return {boolean}
    */
    var blank = coordinates(indexOfBlank());
    var tile = coordinates(index);
    var adjacentRows = blank[0] -1 == tile[0] || blank[0] + 1 == tile[0];
    var adjacentColumns = blank[1] -1 == tile[1] || blank[1] + 1 == tile[1];
    var isActiveColumn = blank[1] == tile[1];
    var isActiveRow = blank[0] == tile[0];

    if ( (adjacentRows || adjacentColumns) && (isActiveRow || isActiveColumn) ){
      return true;
    } else { 
      return false; 
    }
  }

  function indexOfBlank() {
    return tiles.indexOf(0);
  }

  function coordinates(index) {
    var row = parseInt(index / n);
    var col = index % n;
    return [row,col];
  }

  // Looked this up: http://bost.ocks.org/mike/shuffle/
  function shuffle() {
    var m = tiles.length, t, i;

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      swapTiles(m,i);
    }
  }

  function swapTiles(a,b) {
    var t = tiles[a];
    tiles[a] = tiles[b];
    tiles[b] = t;
  }

  function simulateWin() {
    /*
      Simulates a win
      @return {function} render()
    */
    tiles = [];
    for ( var x = 1; x < n*n; x++ ) {
      tiles.push(x)
    }
    render();
  }

  //Solvability formula from
  // http://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
  function solvable() {
    var inversions = 0;
    for ( var a = 0; a < tiles.length; a++ ) {
      for ( var b = a; b < tiles.length; b++ ) {
        if ( tiles[a] != 0 && tiles[b] != 0 && tiles[a] > tiles[b] ) {
          inversions++;
        }
      }
    }
    var blankRow = coordinates(indexOfBlank())[0];
    if ( n % 2 == 1 ) {
      if ( inversions % 2 == 0 ) { return true; }
    } else if ( blankRow % 2 == 1 ) {
      if ( inversions % 2 == 0 ) { return true; }
    } else {
      if ( inversions % 2 == 1 ) { return true; }
    }
    return false;
  }


  start();

})();
