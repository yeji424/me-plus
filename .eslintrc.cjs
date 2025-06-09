module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // prettier와 충돌 방지 + plugin 적용
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // Prettier 규칙 위반 시 ESLint 에러로
  },
};
