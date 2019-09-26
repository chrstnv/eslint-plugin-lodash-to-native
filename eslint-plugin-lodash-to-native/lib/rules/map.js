/**
 * @fileoverview lodash-to-native/map
 * @author Kristina Volosiuk
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const utils = require('eslint-utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'lodash-to-native/map',
      category: 'problem',
      recommended: false
    },
    fixable: 'code', // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },
  create: function(context) {
    // variables should be defined here
    const message = 'There should be native Array#map here.';

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section
    function getVariableType(varName) {
      if (!varName) {
        return;
      }

      const variable = utils.findVariable(context.getScope(), varName);
      console.log('variable', variable);
      console.log(
        'variable',

        variable.identifiers[0] && variable.identifiers[0].parent.init.type
      );

      return (
        variable.identifiers[0] && variable.identifiers[0].parent.init.type
      );
    }

    function getNativeArrayMapExpression(node) {
      // получить начальную и конечную позицию аргументов _.map
      // в исходном коде

      const startA = node.arguments[0].start;
      const endA = node.arguments[0].end;

      const startB = node.arguments[1].start;
      const endB = node.arguments[1].end;

      // получить строку с первым аргументом
      const firstArg = context
        .getSourceCode()
        .getText()
        .substring(startA, endA);

      const secondArg = context
        .getSourceCode()
        .getText()
        .substring(startB, endB);

      // вернуть итоговое выражение
      return `${firstArg}.map(${secondArg})`;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      "CallExpression[callee.object.name='_'][callee.property.name='map']": node => {
        const firstArgumentType = node.arguments[0] && node.arguments[0].type;

        switch (firstArgumentType) {
          case 'ArrayExpression':
            context.report({
              node,
              message,
              fix: function(fixer) {
                // заменить текущий CallExpression на новое выражение
                return fixer.replaceText(node, getNativeArrayMapExpression(node));
              }
            });
            break;

          case 'Identifier':
            const identifierName = node.arguments[0] && node.arguments[0].name;

            if (getVariableType(identifierName) === 'ArrayExpression') {
              context.report({
                node,
                message,
                fix: function(fixer) {
                  // заменить текущий CallExpression на новое выражение
                  return fixer.replaceText(node, getNativeArrayMapExpression(node));
                }
              });
            }
            break;

          case 'CallExpression':
            // const functionName =
            //   node.arguments[0] && node.arguments[0].callee.name;

            // if (getFunctionReturnType(functionName) === 'ArrayExpression') {
            //   context.report({
            //     node,
            //     message
            //   });
            // }

            break;
          default:
            break;
        }
      }
    };
  }
};
