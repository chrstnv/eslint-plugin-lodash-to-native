/**
 * @fileoverview no bad await
 * @author Kristina Volosiuk
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "no bad await",
      category: "Fill me in",
      recommended: false
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create: context => {
    const allowedAncestors = [
      "ReturnStatement",
      "VariableDeclarator",
      "ExpressionStatement",
      "AssignmentExpression"
    ];
    return {
      AwaitExpression: node => {
        const ancestors = context.getAncestors(node);
        const last = ancestors[ancestors.length - 1];

        if (!allowedAncestors.includes(last.type)) {
          context.report({
            node,
            message: "Не используйте await в выражениях."
          });
        }
      }
    };
  }
};
