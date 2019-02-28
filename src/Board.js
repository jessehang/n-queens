// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var test = this.rows();
      var row = this.get(rowIndex);
      //var counter = 0;

      //for loop that iterates through test row index,
      //if the current row index has "1" increment counter by one
      //test for string and also for number value
      //increase the counter by 1,
      //if counter > 1 return true right away
      // return false at the end the entire function
      var counter = 0;
      for (var i = 0; i < row.length; i++) {
        if (row[i] === 1) {
          counter++;
        }
      }
      if (counter > 1) {
        return true;
      }
      return false; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //loop through the entire matrix of test[rowIndex];
      //run the rownconflict recursively through each iteration
      //if the iteration is true, return true here
      //otherwise return false,
      var test = this.rows();
      var bool = false;
      for (var i = 0; i < test.length; i++) {
        if (this.hasRowConflictAt(i)) {
          bool = true;
        }
      }
      return bool;
      // console.log(test.length)
      // for (var i = 0; i < test.length; i++) {
      //
      //   console.log(this.hasRowConflictAt(test[i]))
      // }
      //
      // return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var test = this.rows();
      //var row = this.get(colIndex);

      var col = [];
      var counter = 0;
      for (var i = 0; i < test.length; i++){
        col.push(test[i][colIndex]);
      }

      for (var i = 0; i < col.length; i++){
        if (col[i] === 1){
          counter++
        }
      }
      if (counter > 1) {
        return true;
      }

      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var test = this.rows();
      var bool = false;
      for (var i = 0; i < test.length; i++) {
        if (this.hasColConflictAt(i)) {
          bool = true;
        }
      }
      return bool;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var rows = this.rows();
      var colIndex = majorDiagonalColumnIndexAtFirstRow;
      //iterating through each rows
      //subtracting the index with the current row *use helper function*
      //to see if it's a 0 or not, and if it is, then it is is a major conflict
      //set for statement to iterate through the rows + (columns +1)
      //see if it's a 1 return true;
      var counter = 0;
      for (var i = 0; this._isInBounds(i, colIndex); i++){
        if (this.get(i)[colIndex] === 1) {
          counter++;
          colIndex++;
        }
      }
      if (counter > 1) {
        return true;
      }

      return false; // fixme

      // _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      //   return colIndex - rowIndex;
      // },



    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {

      var test = this.rows();
      var bool = false;
      var colIndex = 0;
      for (var i = -this.get('n') + 1; i < test.length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)){
          bool = true;
        }
      }
      return bool;

      // _isInBounds: function(rowIndex, colIndex) {
      //   return (
      //     0 <= rowIndex && rowIndex < this.get('n') &&
      //     0 <= colIndex && colIndex < this.get('n')
      //   );
      // },
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
