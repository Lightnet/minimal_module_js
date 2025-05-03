export default {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.(js|mjs|jsx)$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};