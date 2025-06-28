// jest.config.js
module.exports = {
  preset: "jest-expo",
  testEnvironment: "jsdom",

  // Transpile your JS/TS files via babel-jest
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

  // By default Jest ignores all of node_modules.
  // This regex says “ignore node_modules except anything under react-native OR any package that starts with expo or @expo”
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|expo|expo-[^/]+|@expo|expo-modules-core)/)",
  ],

  setupFiles: ["./jest-setup.js"],
};
