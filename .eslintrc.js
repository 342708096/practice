// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    "browser": true,
    "node": true,
    "es6": true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  globals: {
    "window": true,
    "document": true,
    "location": true,
    "wx": true,
    "commonApi": true,
    "newsApi": true
  },
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'no-trailing-spaces': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-in-patterns': 0,

    "key-spacing": 0,
    "max-len": [1, 150],
    "new-cap": 1,
    "no-underscore-dangle": 0,
    "no-unused-expressions": 0,
    "no-unused-vars": [1, { "vars": "all", "args": "none" }],
    "no-var": 0,
    "no-undef": 2,
    "no-caller": 1,
    "quotes": [1, "single", "avoid-escape"],
    "strict": 2,

    // other style
    "space-before-function-paren": 0,
    "space-before-blocks": 1,
    "brace-style": 2,
//    "keywords-spacing": 2,
    "comma-dangle": [2, "never"],
    "newline-after-var": [1, "always"],
    "one-var": [2, "never"],
    "no-spaced-func": 0,
    "semi": 1,
    "camelcase": 1,
    "eqeqeq": 1,
    "no-multi-spaces": 1,
    "indent": 1
  }
}
