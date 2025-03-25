module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true, // Add browser environment for frontend code
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module", // Use module type for modern JavaScript
  },
  extends: [
    "eslint:recommended",
    "google",
    "next/core-web-vitals", // Add Next.js specific ESLint config
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", { "allowTemplateLiterals": true }],
    // Add any custom rules you want to enforce here
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
