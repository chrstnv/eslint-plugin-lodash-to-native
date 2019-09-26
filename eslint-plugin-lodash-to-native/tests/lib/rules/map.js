/**
 * @fileoverview lodash-to-native/map
 * @author Kristina Volosiuk
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/map'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018 } });
ruleTester.run('map', rule, {
  valid: [
    // when an object passed into _.map explicitly
    '_.map({a : 1, b: 2}, n => {n * n})',

    // when an object variable reference passed into _.map
    'const obj = {a : 1, b: 2}; _.map(obj, n => {n * n})'
  ],

  invalid: [
    // when an array passed into _.map explicitly
    {
      code: '_.map([1, 2, 3], (n) => {n * n})',
      errors: [
        {
          message: 'There should be native Array#map here.',
          type: 'CallExpression'
        }
      ]
    },
    // when an array variable reference passed into _.map
    {
      code: 'const arr = [1, 2, 3]; _.map(arr, (n) => {n * n})',
      errors: [
        {
          message: 'There should be native Array#map here.',
          type: 'CallExpression'
        }
      ]
    },
    // {
    //   code: 'function getArray1() { return [23, 23]; }; _.map(getArray1(), (n) => {n * n})',
    //   errors: [
    //     {
    //       message: 'There should be native Array#map here.',
    //       type: 'CallExpression'
    //     }
    //   ]
    // }
  ]
});
