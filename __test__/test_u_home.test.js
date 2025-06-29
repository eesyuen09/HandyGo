/**
 * @jest-environment jsdom
 */

jest.mock("@react-native-picker/picker", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Picker: (props) => React.createElement(View, null, props.children),
  };
});

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children }) => React.createElement(View, null, children),
  };
});

jest.mock("expo-status-bar", () => ({ StatusBar: () => null }));
jest.mock("expo-constants", () => ({ manifest: { scheme: "app" } }));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const make = (name) => (props) => React.createElement(Text, null, name);
  return {
    Octicons: make("Octicons"),
    Ionicons: make("Ionicons"),
    Feather: make("Feather"),
    AntDesign: make("AntDesign"),
    MaterialIcons: make("MaterialIcons"),
    FontAwesome5: make("FontAwesome5"),
    FontAwesome6: make("FontAwesome6"),
    MaterialCommunityIcons: make("MaterialCommunityIcons"),
  };
});
jest.mock("expo-font", () => ({
  loadAsync: jest.fn().mockResolvedValue(true),
}));
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
jest.mock("../components/KeyboardAvoidingWrapper", () => {
  const React = require("react");
  const { View } = require("react-native");
  return ({ children }) => React.createElement(View, null, children);
});

// stub out your constants
jest.mock("../constants/category_constant", () => ({
  services_categories: [
    {
      title: "Cleaning",
      subcategories: ["Deep Cleaning", "Home Organizing"],
      description: "All cleaning services",
      price: 50,
    },
    {
      title: "Repair",
      subcategories: ["Air Conditioner Repair", "House Moving"],
      description: "All repair services",
      price: 75,
    },
  ],
}));

// firebaseConfig stub
jest.mock("../firebaseConfig", () => ({ auth: {}, db: {} }));

// Auth mocks
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { uid: "u1" } })
  ),
  sendEmailVerification: jest.fn(() => Promise.resolve()),
}));

// Firestore mocks
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import UserHome from "../screen/user_home.js";

describe("UserHome Screen", () => {
  const mockNavigate = jest.fn();
  const navigation = { navigate: mockNavigate };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the search bar, shortcut labels and service banners", () => {
    const { getByPlaceholderText, getByText } = render(
      <UserHome navigation={navigation} />
    );

    // search bar
    expect(getByPlaceholderText(/Looking for any service\?/i)).toBeTruthy();

    // predefined shortcuts
    expect(getByText("Cleaning")).toBeTruthy();
    expect(getByText("Moving")).toBeTruthy();
    expect(getByText("Repair")).toBeTruthy();
    expect(getByText("Outdoor Services")).toBeTruthy();
    expect(getByText("Maintenance")).toBeTruthy();

    // banners
    expect(getByText("Deep Cleaning")).toBeTruthy();
    expect(getByText("Home Organizing")).toBeTruthy();
    expect(getByText("Air Conditioner Repair")).toBeTruthy();
  });

  it("navigates to UserBooking on category search match", () => {
    const { getByPlaceholderText } = render(
      <UserHome navigation={navigation} />
    );
    const input = getByPlaceholderText(/Looking for any service\?/i);

    fireEvent.changeText(input, "clean");
    fireEvent(input, "submitEditing");

    expect(mockNavigate).toHaveBeenCalledWith("UserBooking", {
      serviceType: "Cleaning",
      subcategory: "Deep Cleaning",
      description: "All cleaning services",
      price: 50,
    });
  });

  it("navigates to UserBooking on subcategory search match", () => {
    const { getByPlaceholderText } = render(
      <UserHome navigation={navigation} />
    );
    const input = getByPlaceholderText(/Looking for any service\?/i);

    fireEvent.changeText(input, "house moving");
    fireEvent(input, "submitEditing");

    expect(mockNavigate).toHaveBeenCalledWith("UserBooking", {
      serviceType: "Repair",
      subcategory: "House Moving",
      description: "All repair services",
      price: 75,
    });
  });

  it("navigates to UserBooking when tapping a shortcut icon", () => {
    const { getByText } = render(<UserHome navigation={navigation} />);

    fireEvent.press(getByText("Cleaning"));
    expect(mockNavigate).toHaveBeenCalledWith("UserBooking", {
      serviceType: "Cleaning",
      subcategory: "Deep Cleaning",
      description: "All cleaning services",
      price: 50,
    });

    fireEvent.press(getByText("Repair"));
    expect(mockNavigate).toHaveBeenCalledWith("UserBooking", {
      serviceType: "Repair",
      subcategory: "Air Conditioner Repair",
      description: "All repair services",
      price: 75,
    });
  });

  it("navigates to UserBooking when tapping a service banner", () => {
    const { getByText } = render(<UserHome navigation={navigation} />);

    fireEvent.press(getByText("Deep Cleaning"));
    expect(mockNavigate).toHaveBeenCalledWith("UserBooking", {
      serviceType: "Cleaning",
      subcategory: "Deep Cleaning",
      description: "All cleaning services",
      price: 50,
    });

    fireEvent.press(getByText("Air Conditioner Repair"));
    expect(mockNavigate).toHaveBeenCalledWith("UserBooking", {
      serviceType: "Repair",
      subcategory: "Air Conditioner Repair",
      description: "All repair services",
      price: 75,
    });
  });
});
