// jest-setup.js

// 0) Polyfill missing timer APIs
global.clearImmediate = global.clearImmediate || ((id) => clearTimeout(id));
global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));

// 1) Stub out expo-status-bar so it doesn’t push to a real native StatusBar
jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

// 2) Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const makeMock = (name) => (props) =>
    React.createElement(Text, { ...props }, name);
  return {
    Ionicons: makeMock("Ionicons"),
    Octicons: makeMock("Octicons"),
    FontAwesome: makeMock("FontAwesome"),
  };
});

// 3) Mock expo-font
jest.mock("expo-font", () => ({
  loadAsync: jest.fn().mockResolvedValue(true),
}));

// 4) Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
