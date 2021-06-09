// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  const grid = (new Array(8)).fill(0).map( e => new Array(8));
  grid[3][4] = new Piece("black")
  grid[4][3] = new Piece("black")
  grid[3][3] = new Piece("white")
  grid[4][4] = new Piece("white")
  return grid
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let x = pos[0];
  let y = pos[1];
  if ((x >= 0 && x <= 7) && (y >= 0 && y <= 7)) {
    return true;
  }
  else {
    return false;
  }
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (this.isValidPos(pos)) {
    let x = pos[0];
    let y = pos[1];
    return this.grid[x][y]
  }
  else {
    throw new Error ("Not valid pos!");
  }

};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let x = pos[0];
  let y = pos[1];

  if (this.grid[x][y] === undefined) {
    return false;
  }
  else if (this.grid[x][y].color === color) {
    return true;
  }
  else {
    return false;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  let x = pos[0];
  let y = pos[1];

  if (this.grid[x][y] === undefined) {
    return false;
  }
  else {
    return true;
  }

};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  
  if (!piecesToFlip) {
    piecesToFlip = []
  } else {
    piecesToFlip.push(pos)
  }
  let nextPos = [ dir[0] + pos[0], dir[1] + pos[1] ];
  // base cases
  if ( !this.isValidPos(nextPos) ) {
    return []; 
  }
  else if (!this.isOccupied(nextPos)) {
    return [];
  }
  else if (this.isMine(nextPos, color)) {
    return piecesToFlip;
  }
  else {
    // piecesToFlip.push([x,y]);
    // piecesToFlip = piecesToFlip.push(this._positionsToFlip(nextPos, color, dir, piecesToFlip));
    return this._positionsToFlip(nextPos, color, dir, piecesToFlip);
  }

};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  // let tmp = [];

  if (this.isValidPos(pos) && !this.isOccupied(pos)) {
    // debugger
    for (let i = 0; i < Board.DIRS.length; i++) {
      if (this._positionsToFlip(pos, color, Board.DIRS[i]).length) {
        return true;
      } 
    }
  } 
  return false;

};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  let x = pos[0];
  let y = pos[1];
  if (!this.validMove(pos, color)) { 
    throw new Error("Invalid move!")
  } else {
    this.grid[x][y] = new Piece(color);
    // let tmp = [];
    for (let i = 0; i < Board.DIRS.length; i++) {
      (this._positionsToFlip(pos, color, Board.DIRS[i])).forEach (element =>
        {this.grid[element[0]][element[1]].flip()}
      )
    }
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let valid_moves = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (!this.grid[i][j]) {
        if (this.validMove([i, j], color)) {
          valid_moves.push([i, j])
        }
      }
    }
  }
  return valid_moves
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  if (this.validMoves(color).length > 0) {
    return true;
  } else {
    return false;
  }
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  let over = false;
  if (!this.hasMove("white") && !this.hasMove("black")) {
    over = true;
  }
  return over;
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE