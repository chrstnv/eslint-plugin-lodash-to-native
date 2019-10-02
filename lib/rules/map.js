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
    type: 'suggestion',
    docs: {
      description: 'lodash-to-native/map',
      category: 'suggestion',
      recommended: false
    },
    fixable: 'code',
    schema: []
  },
  create: function(context) {
    const message = 'There should be native Array#map here.';
    const messageWithCondition =
      'There should be conditional native Array#map here.';

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Функция возвращает тип узла заданной переменной
     * (ArrayExpression, ObjectExpression и т.д.)
     * @param {string} varName - название переменной
     * @returns {string | undefined} - название типа переменной или undefined,
     * если имя не задано
     */
    function getVariableType(varName) {
      if (!varName) {
        return;
      }

      const variable = utils.findVariable(context.getScope(), varName);

      return (
        variable &&
        variable.identifiers[0] &&
        variable.identifiers[0].parent &&
        variable.identifiers[0].parent.init &&
        variable.identifiers[0].parent.init.type
      );
    }

    /**
     * Функция возвращает строку с кодом вызова нативного Array#map
     * для заданного узла дерева с вызовом _.map()
     * @param {Object} node - объект узла с вызовом _.map()
     * @returns {string} - строка с исходным кодом вызова Array#map
     */
    function getNativeArrayMapExpression(node) {
      // получить строку с первым аргументом
      const firstArg = getArgumentStr(node.arguments[0]);

      // получить строку со вторым аргументом
      const secondArg = getArgumentStr(node.arguments[1]);

      // вернуть итоговое выражение
      return `${firstArg}.map(${secondArg})`;
    }

    /**
     * Функция возвращает строковое представление аргумента
     * @param {Object} node - объект узла-аргумента _.map()
     * @returns {string} - строковое представление аргумента
     */
    function getArgumentStr(argNode) {
      return context.getSourceCode().getText(argNode);
    }

    /**
     * Функция проверяет переопределялась ли переменная "_" до вызова
     * проверяемого выражения _.map
     * @param {Object} context - объект текущего контекста проверяемого узла
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
        if (checkLodashReassignment(context, node)) return;

        const firstArgumentType = node.arguments[0] && node.arguments[0].type;

        switch (firstArgumentType) {
          case 'ArrayExpression':
            context.report({
              node,
              message,
              fix: function(fixer) {
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
            const identifierName = node.arguments[0] && node.arguments[0].name;
            const varType = getVariableType(identifierName);

            if (varType === 'ArrayExpression') {
              context.report({
                node,
                message,
                fix: function(fixer) {
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
              const firstArg = getArgumentStr(node.arguments[0]);
              const secArg = getArgumentStr(node.arguments[1]);

              context.report({
                node,
                message: messageWithCondition,
                fix: function(fixer) {
                  return fixer.replaceText(
                    node,
                    `(function(arg, cb) {
  return Array.isArray(arg)
    ? arg.map(cb)
    : _.map(arg, cb);
  })(${firstArg}, ${secArg})`
                  );
                }
              });
            }
            break;
        }
      }
    };
  }
};
