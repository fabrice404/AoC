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
    "consistent-return": "off",
    "default-case": "off",
    "max-classes-per-file": "off",
    "object-curly-newline": "off",
    "operator-linebreak": ["error", "after"],
    "max-len": ["error", { "code": 320 }],
    "no-await-in-loop": "off",
    "no-console": "off",
    "no-continue": "off",
    "no-eval": "off",
    "no-param-reassign": "off",
    "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
    "@typescript-eslint/no-loop-func": "off"
  },
  ignorePatterns: [
    'helpers/template.ts',
    'node_modules/',
    '.eslintrc.js',
  ]
}
