/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  env: { node: true, es2022: true, browser: true },
  settings: { react: { version: "detect" } },
  ignorePatterns: ["**/dist/**", "**/.next/**", "**/build/**", "**/coverage/**", "*.config.js"],
  overrides: [
    {
      files: ["apps/mobile/**/*.{ts,tsx}"],
      rules: { "react/react-in-jsx-scope": "off" }
    }
  ]
};


