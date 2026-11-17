const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  extends: ['react-app', 'prettier'],
  plugins: ['prettier', 'import'],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: 'useRecoilCallback',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.d.ts'],
      // TypeScript module augmentation uses side-effect React imports.
      rules: { 'react/no-typos': 'off' },
    },
    {
      files: ['**/*.ts?(x)'],
      rules: { 'prettier/prettier': ['warn', prettierOptions] },
    },
  ],
};
