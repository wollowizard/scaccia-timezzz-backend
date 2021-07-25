module.exports = {
    roots: [
      "<rootDir>"
    ],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    moduleFileExtensions: ["ts", "js", "json", "node"],
    testTimeout: 30000
};
