// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    "react-native/react-native": true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "eslint:recommended", // core rules
    "plugin:react/recommended", // React best practices
    "plugin:react-native/all", // React Native–specific checks
    "plugin:jest/recommended", // Jest testing globals
  ],
  plugins: ["react", "react-native", "jest"],
  rules: {
    // React
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",

    // React Native
    "react-native/no-inline-styles": "warn",
    "react-native/no-unused-styles": "error",
    "react-native/split-platform-components": "error",

    // Jest
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
  },
};
