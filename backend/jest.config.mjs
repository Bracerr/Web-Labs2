export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  // moduleNameMapper: {
  //   '^@config/(.*)$': '<rootDir>/src/config/*',
  //   '^@models/(.*)$': '<rootDir>/src/models/*',
  //   '^@handlers/(.*)$': '<rootDir>/src/handlers/*',
  //   '^@services/(.*)$': '<rootDir>/src/services/*',
  //   '^@utils/(.*)$': '<rootDir>/src/utils/*',
  //   '^@errors/(.*)$': '<rootDir>/src/errors/*',
  //   '^@repositories/(.*)$': '<rootDir>/src/repositories/*',
  //   '^@middleware/(.*)$': '<rootDir>/src/middleware/*',
  // },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
    }]
  }
};