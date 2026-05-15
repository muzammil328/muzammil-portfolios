import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  displayName: '@muzammil/portfolio',
  preset: '../../jest.preset.js',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/app/portfolio',
  testEnvironment: 'jsdom',
};

export default createJestConfig(config);
