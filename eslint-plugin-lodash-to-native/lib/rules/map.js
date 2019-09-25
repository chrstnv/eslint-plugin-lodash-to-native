/**
 * @fileoverview lodash-to-native/map
 * @author Kristina Volosiuk
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const utils = require("eslint-utils")

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
    function getVariableType () {
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
              message
            });
            break;

          case 'Identifier':
            const firstArgumentName = node.arguments[0] && node.arguments[0].name;
            const variable = utils.findVariable(context.getScope(), firstArgumentName);
            const varType = variable.identifiers[0] && variable.identifiers[0].parent.init.type;

            if(varType === 'ArrayExpression') {
              context.report({
                node,
                message
              });
            }
            break;

          default:
            break;
        }
      }
    };
  }
};
