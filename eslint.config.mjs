import nextPlugin from 'eslint-config-next';

const eslintConfig = [
  ...nextPlugin,
  {
    ignores: ['next-env.d.ts'],
  },
];

export default eslintConfig;
