const _ = require('lodash');

function square(n, i, arr) {
  return i;
}


let arr = [4, 5, 6];

let obj = {
  'a': 3,
  'b': 4,
  'c': 11
}

let mapped0 = _.map(obj, square);

let mapped1 = _.map({
  'a': 3,
  'b': 4,
  'c': 11
}, square);

function getArray1() { return [23, 23]; }

let mapped2 = [1, 2, 3].map(square);

let mapped3 = arr.map(square);

let mapped4 = Array.isArray(getArray1()) ? getArray1().map(square) : _.map(getArray1(), square);

var a = Array.isArray(getArray1()) ? getArray1().map((n) => {n * n}) : _.map(getArray1(), (n) => {n * n});

let b = getArray1();

var c = Array.isArray(b) ? b.map((n) => {n * n}) : _.map(b, (n) => {n * n});



function getMappedArray(p) { return _.map(p, (n) => {n * n})} function getArray1() { return [23, 23]; } let a = getArray1(); getMappedArray(a);

mapped0, mapped1, mapped2, mapped3, mapped4, a, c;
