import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    '^@auth/(.*)$': '<rootDir>/shared/auth/$1',
    '^@data/(.*)$': '<rootDir>/shared/data/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@test-util/(.*)$': '<rootDir>/utils/test-utils/$1',
    '^@util/(.*)$': '<rootDir>/utils/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
    '^@config$': '<rootDir>/app-config',
    '^@atoms$': '<rootDir>/shared/recoil/atoms',
    '^@schemas$': '<rootDir>/shared/schemas',
    '^@supabaseClient$': '<rootDir>/supabase/supabaseClient',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
