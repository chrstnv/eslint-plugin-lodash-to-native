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
    const messageWithCondition =
      'There should be conditional native Array#map here.';

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Функция возвращает тип узла заданной переменной
     * (ArrayExpression, ObjectExpression и т.д.)
     * @param {String} varName - название переменной
     * @returns {String} - название типа переменной
     */
    function getVariableType(varName) {
      if (!varName) {
        return;
      }

      const variable = utils.findVariable(context.getScope(), varName);

      return (
        variable.identifiers[0] &&
        variable.identifiers[0].parent.init &&
        variable.identifiers[0].parent.init.type
      );
    }

    /**
     * Функция возвращает строку с кодом вызова нативного Array#map
     * для заданного узла дерева с вызовом _.map()
     * @param {Object} node - объект узла с вызовом _.map()
     * @returns {String} - строка с исходным кодом вызова Array#map
     */
    function getNativeArrayMapExpression(node) {
      // получить строку с полным исходным кодом
      const code = context.getSourceCode().getText();

      // получить начальную и конечную позицию аргументов _.map
      // в исходном коде
      const startA = node.arguments[0].start;
      const endA = node.arguments[0].end;

      const startB = node.arguments[1].start;
      const endB = node.arguments[1].end;

      // получить строку с первым аргументом
      const firstArg = code.substring(startA, endA);

      // получить строку со вторым аргументом
      const secondArg = code.substring(startB, endB);

      // вернуть итоговое выражение
      return `${firstArg}.map(${secondArg})`;
    }

    /**
     *  Функция проверяет переопределялась ли переменная "_" до вызова
     *  проверяемого выражения _.map
     * @param {Object} context - объект текущего контеста проверяемого узла
     * @param {Object} node - объект проверяемого узла с вызовом _.map
     * @returns {Boolean}
     */
    function checkLodashReassignment(context, node) {
      const lodashUnderscore = utils.findVariable(context.getScope(), '_');
      const lodashRefs = lodashUnderscore ? lodashUnderscore.references : [];
      let isReassigned = false;

      for (let i = 0; i < lodashRefs.length; i++) {
        const ref = lodashRefs[i];

        if (ref.init === false) {
          // дополнительно проверяем, раньше или позже нашего выражения
          // произошло переопределение
          // если раньше - правило map не применяется
          const refStart = ref.identifier.start;

          if (refStart < node.start) {
            isReassigned = true;
            break;
          }
        }
      }
      return isReassigned;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      "CallExpression[callee.object.name='_'][callee.property.name='map']": node => {
        // проверка на переопределение `_`
        if (!checkLodashReassignment(context, node)) {
          const firstArgumentType = node.arguments[0] && node.arguments[0].type;

          switch (firstArgumentType) {
            case 'ArrayExpression':
              context.report({
                node,
                message,
                fix: function(fixer) {
                  // заменить текущий CallExpression на новое выражение
                  return fixer.replaceText(
                    node,
                    getNativeArrayMapExpression(node)
                  );
                }
              });
              break;

            case 'ObjectExpression':
              break;

            case 'Identifier':
              const identifierName =
                node.arguments[0] && node.arguments[0].name;
              const varType = getVariableType(identifierName);

              if (varType === 'ArrayExpression') {
                context.report({
                  node,
                  message,
                  fix: function(fixer) {
                    // заменить текущий CallExpression на новое выражение
                    return fixer.replaceText(
                      node,
                      getNativeArrayMapExpression(node)
                    );
                  }
                });
                break;
              } else if (varType === 'ObjectExpression') {
                break;
              }
            default:
              const allowedAncestors = [
                'ReturnStatement',
                'VariableDeclarator',
                'AssignmentExpression',
                'ExpressionStatement'
              ];
              const parentType = node.parent.type;

              if (allowedAncestors.includes(parentType)) {
                // получить строку с текущим выражением _.map()
                const code = context.getSourceCode().getText();

                // получить строку с найденной нодой
                const nodeStr = code.substring(node.start, node.end);

                // получить начальную и конечную позицию
                // первого аргумента _.map в исходном коде
                const startA = node.arguments[0].start;
                const endA = node.arguments[0].end;

                // получить строку с первым аргументом
                const firstArg = code.substring(startA, endA);

                context.report({
                  node,
                  message: messageWithCondition,
                  fix: function(fixer) {
                    return fixer.replaceText(
                      node,
                      `Array.isArray(${firstArg}) ? ${getNativeArrayMapExpression(
                        node
                      )} : ${nodeStr}`
                    );
                  }
                });
              }
              break;
          }
        }
      }
    };
  }
};
