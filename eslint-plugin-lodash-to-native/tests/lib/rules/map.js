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

var ruleTester = new RuleTester( {'parserOptions': { 'ecmaVersion': 2018 }} );
ruleTester.run('map', rule, {
  valid: [
    // give me some code that won't trigger a warning
    'let obj = {a : 1, b: 2}; _.map(obj, n => {n * n})'
  ],

  invalid: [
    {
      code: 'let arr = [1, 2, 3]; _.map(arr, (n) => {n * n})',
      errors: [
        {
          message: 'Fill me in.',
          type: 'Me too'
        }
      ]
    }
  ]
});
