module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: 'eslint:recommended',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    quotes: [2, 'single'],
    'no-console': 2,
    'lodash-to-native/no-bad-await': 2
  },
  plugins: [
    'lodash-to-native'
  ]
};
