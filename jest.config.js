module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test).ts?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/out/'],
  setupFiles: ['reflect-metadata', 'jest-ts-auto-mock'],
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
    },
  },
};
