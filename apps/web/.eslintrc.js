// .eslintrc.js
module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'eslint:recommended'],
  env: { browser: true, node: true, es2021: true },
  ignorePatterns: ['.next/', 'node_modules/', 'dist/', 'build/'],
  rules: {
    // keep project-specific rules here; do not add invalid options
    'no-empty': 'warn',
    'no-extra-semi': 'warn',
    'react/no-unescaped-entities': 'warn',
    'no-undef': 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-useless-escape': 'warn',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      },
    },
    {
      files: ['**/*.js', '**/*.jsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};

