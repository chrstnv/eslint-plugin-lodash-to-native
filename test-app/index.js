const _ = require('lodash');

function square(n, i, arr) {
  return i;
}

// let arr = [4, 5, 6];

// let obj = {
//   a: 3,
//   b: 4,
//   c: 11
// };



function getArray1 () { return [23, 23]; }

// function getArray2 () { let a = [23, 23]; return a; }


// function outerGetArray() {
//   return getArray();
// }

let arr = [4, 5, 6];

// let obj = {
//   'a': 3,
//   'b': 4,
//   'c': 11
// }

let mapped1 = _.map([1, 2, 3], square);

let mapped2 = _.map(arr, square);

let mapped3 = _.map(getArray1(), square);
