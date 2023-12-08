module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    "class-methods-use-this": "off",
    "no-console": "off",
    "no-param-reassign": "off",
  },
  ignorePatterns: [
    'helpers/template.ts',
    'node_modules/',
    '.eslintrc.js',
  ]
}
