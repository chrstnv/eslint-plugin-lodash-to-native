/**
 * @fileoverview no bad await
 * @author Kristina Volosiuk
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-bad-await"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({'parserOptions': { 'ecmaVersion': 2018 }});
ruleTester.run("no-bad-await", rule, {

    valid: [

        // give me some code that won't trigger a warning
        "async function t(b) { await b }"
    ],

    invalid: [
        {
            code: "async function t(b) { 1 + (await b);}",
            errors: [{
                message: "Не используйте await в выражениях.",
                type: "AwaitExpression"
            }]
        }
    ]
});
