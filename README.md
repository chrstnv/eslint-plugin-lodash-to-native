# eslint-plugin-lodash-to-native

lodash to native

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-lodash-to-native`:

```
$ npm install -S github.com/chrstnv/eslint-plugin-lodash-to-native --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-lodash-to-native` globally.

## Usage

Add `lodash-to-native` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["lodash-to-native"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "lodash-to-native/map": 1
  }
}
```

## Supported Rules

_map_ — it is a rule that checks a usage of Lodash `_.map` method and supports to fix it to native `Array#map` usage if it reasonable.

If a first argument has `Array` type, a rule offers a fix with native JS `Array#map` usage.

```js
// before fix
let a = _.map([1, 2, 3], n => {
  n * n;
});

// after fix
let a = [1, 2, 3].map(n => {
  n * n;
});
```

It works also if a first argument is a variable with `Array` type.

```js
let arr = [4, 5, 6];

// before fix
let a = _.map(arr, n => {
  n * n;
});

// after fix
let a = arr.map(n => {
  n * n;
});
```

If a first argument of `_.map` has an `Object` type or it is a variable with `Object` type, rule will not be applied and will not offer any errors, suggestions or fixes.

```js
// a rule won't be applied
let a = _.map(
  {
    a: 3,
    b: 4,
    c: 11
  },
  n => {
    n * n;
  }
);

// also won't be applied
let obj = {
  a: 3,
  b: 4,
  c: 11
};

let b = _.map(obj, n => {
  n * n;
});
```

In all other cases such as call expresions or other expressions a rule will offer a fix to conditional expression (ternary operator).

It will look like this:

```js
function getMyArray() {
  return [23, 23];
}

let a = getMyArray();

// before fix
let b = _.map(a, n => {
  n * n;
});

//after fix
let b = (function(arg, cb) {
  return Array.isArray(arg) ? arg.map(cb) : _.map(arg, cb);
})(a, n => {
  n * n;
});
```

### Lodash reassignment check

**Note:** a rule will not apply if a lodash import variable was reassigned. But if the '_' variable declared and reassigned **after** _.map expression a rule will be applied for this line. For example:

```js
let _ = require("lodash");

// a rule will be applied
let a = _.map({ a: 1, b: 2 }, n => {
  n * n;
});

// reassignment of lodash '_' variable
_ = { map: () => [] };

// a rule won't be applied
let b = _.map([1, 2, 3], n => {
  n * n;
});
```

### Tests

A rule was covered by series of tests. They could be executed by `npm test` command.
