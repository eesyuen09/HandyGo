// jest.config.js
module.exports = {
  preset: "jest-expo",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    // compile RN, Expo & Firebase through Babel
    "node_modules/(?!(react-native|@react-native|@react-navigation|@expo|expo(-.*)?|react-native-dropdown-picker|react-native-vector-icons|firebase|@firebase|@testing-library/react-native|formik|yup)/)",
  ],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  modulePathIgnorePatterns: ["<rootDir>/venv/"],
  watchPathIgnorePatterns: ["<rootDir>/venv/"],
  setupFiles: ["<rootDir>/jestSetup.js"],
};
