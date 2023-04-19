module.exports = {
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['next/core-web-vitals', 'airbnb', 'airbnb-typescript', 'next', 'prettier'],
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
        tsconfigRootDir: __dirname,
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-plusplus': 'off',
      },
      env: {
        es6: true,
      },
    },
  ],
};
