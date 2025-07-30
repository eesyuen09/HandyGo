process.env.EXPO_OS = process.env.EXPO_OS || "ios";

global.console.log = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();

jest.mock("expo-constants", () => ({ manifest: { scheme: "app" } }));
jest.mock("expo-font", () => ({ useFonts: jest.fn().mockReturnValue([true]) }));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }) => children,
}));

jest.mock("./components/KeyboardAvoidingWrapper.js", () => {
  const React = require("react");
  const { View } = require("react-native");
  return ({ children }) => React.createElement(View, null, children);
});

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Feather: () => React.createElement(Text, null, "Feather"),
    AntDesign: () => React.createElement(Text, null, "AntDesign"),
    Entypo: (props) => React.createElement(Text, null, "Ent"),
    MaterialIcons: () => React.createElement(Text, null, "MaterialIcons"),
    FontAwesome5: () => React.createElement(Text, null, "FontAwesome5"),
    FontAwesome6: () => React.createElement(Text, null, "FontAwesome6"),
    FontAwesome: (props) => React.createElement(Text, null, "FA"),
    MaterialCommunityIcons: () =>
      React.createElement(Text, null, "MaterialCommunityIcons"),
  };
});
