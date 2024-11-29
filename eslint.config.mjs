import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["helpers/template.ts", "**/node_modules/"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-loop-func": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "caughtErrors": "none" }],
      "class-methods-use-this": "off",
      "consistent-return": "off",
      "default-case": "off",
      "max-classes-per-file": "off",
      "max-len": ["error", { code: 320, }],
      "no-await-in-loop": "off",
      "no-case-declarations": "off",
      "no-console": "off",
      "no-constant-condition": ["error", { checkLoops: false, }],
      "no-continue": "off",
      "no-eval": "off",
      "no-param-reassign": "off",
      "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
      "no-underscore-dangle": "off",
      "object-curly-newline": "off",
      "operator-linebreak": ["error", "after"],
    },
  }
];
