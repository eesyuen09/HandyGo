// jest.config.js
module.exports = {
  preset: "jest-expo",
  setupFiles: ["dotenv/config", "<rootDir>/jestSetup.js"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!" +
      [
        "react-native",
        "@react-native",
        "@react-navigation",
        "react-native-safe-area-context",
        "expo-constants",
        "expo-font",
        "expo(-.*)?",
        "react-native-dropdown-picker",
        "react-native-vector-icons",
        "firebase",
        "@firebase",
        "@testing-library/react-native",
        "formik",
        "yup",
      ].join("|") +
      ")/",
  ],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  modulePathIgnorePatterns: ["<rootDir>/venv/"],
  watchPathIgnorePatterns: ["<rootDir>/venv/"],
};
