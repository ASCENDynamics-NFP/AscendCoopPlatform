module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
    // Keep Prettier last so it can disable formatting-related rules from the above configs
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    ".eslintrc.js" // Ignore ESLint config file.
  ],
  overrides: [
    {
      files: ["test/**/*.ts"],
      parserOptions: {
        project: ["tsconfig.test.json"],
      },
      env: { mocha: true },
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "require-jsdoc": "off",
        "quote-props": "off", // Disable quote-props for test files
        "no-invalid-this": "off", // Allow 'this' in Mocha test functions
      },
    },
  ],
  plugins: ["@typescript-eslint", "import", "prettier"],
  rules: {
    // Delegate formatting to Prettier (avoid conflicts with ESLint)
    "prettier/prettier": ["warn"],
    // Disable/avoid format-related rules that Prettier handles
    "quotes": "off",
    "indent": "off",
    "max-len": "off",
    "import/no-unresolved": 0,
    "operator-linebreak": "off",
    // Reduce friction from stylistic rules not covered by Prettier
    "curly": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-inferrable-types": "off",
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "space-before-function-paren": "off", // Disable to avoid conflicts with Prettier
  },
};
