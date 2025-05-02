module.exports = {
    env: {
      node: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:security/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: './tsconfig.json'
    },
    plugins: [
      '@typescript-eslint',
      'import',
      'security'
    ],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      
      'no-console': 'warn',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          'alphabetize': {
            'order': 'asc',
            'caseInsensitive': true
          }
        }
      ],
      
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'error'
    },
    settings: {
      'import/resolver': {
        typescript: {}
      }
    }
  };