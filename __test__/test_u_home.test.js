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

// stub out constants
const SERVICES = [
  {
    title: "Cleaning",
    subcategories: ["Deep Cleaning", "Home Organizing"],
    description: "All cleaning services",
    price: 50,
  },
  {
    title: "Repair",
    subcategories: ["Air Conditioner Repair", "Plumbing Services"],
    description: "All repair services",
    price: 75,
  },
];
jest.mock("../constants/category_constant", () => ({
  services_categories: SERVICES,
}));

jest.mock("../firebaseConfig", () => ({ auth: {}, db: {} }));
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import UserHome from "../screen/user_home.js";

describe("UserHome Screen", () => {
  let mockNavigate;
  beforeAll(() => {
    mockNavigate = jest.fn();
  });
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders search bar, shortcut labels, and service banners", () => {
    const { getByPlaceholderText, getByText } = render(
      <UserHome navigation={{ navigate: mockNavigate }} />
    );

    // search bar
    expect(getByPlaceholderText(/Looking for any service\?/i)).toBeTruthy();

    // shortcuts + banners
    SERVICES.forEach(({ title, subcategories }) => {
      expect(getByText(title)).toBeTruthy();
      subcategories.forEach((sub) => expect(getByText(sub)).toBeTruthy());
    });
  });

  it("navigates to UserBooking via search submit", () => {
    const { getByPlaceholderText } = render(
      <UserHome navigation={{ navigate: mockNavigate }} />
    );
    const input = getByPlaceholderText(/Looking for any service\?/i);

    // category search
    SERVICES.forEach(({ title, subcategories, description, price }) => {
      fireEvent.changeText(input, title.toLowerCase());
      fireEvent(input, "submitEditing");
      expect(mockNavigate).toHaveBeenLastCalledWith("UserBooking", {
        serviceType: title,
        subcategory: subcategories[0],
        description,
        price,
      });
    });

    // subcategory search
    SERVICES.forEach(({ title, subcategories, description, price }) => {
      subcategories.forEach((sub) => {
        fireEvent.changeText(input, sub.toLowerCase());
        fireEvent(input, "submitEditing");
        expect(mockNavigate).toHaveBeenLastCalledWith("UserBooking", {
          serviceType: title,
          subcategory: sub,
          description,
          price,
        });
      });
    });
  });

  it("navigates to UserBooking on tapping shortcuts and banners", () => {
    const { getByText } = render(
      <UserHome navigation={{ navigate: mockNavigate }} />
    );

    SERVICES.forEach(({ title, subcategories, description, price }) => {
      // tapping the shortcut label
      fireEvent.press(getByText(title));
      expect(mockNavigate).toHaveBeenLastCalledWith("UserBooking", {
        serviceType: title,
        subcategory: subcategories[0],
        description,
        price,
      });

      // tapping each banner label
      subcategories.forEach((sub) => {
        fireEvent.press(getByText(sub));
        expect(mockNavigate).toHaveBeenLastCalledWith("UserBooking", {
          serviceType: title,
          subcategory: sub,
          description,
          price,
        });
      });
    });
  });
});
