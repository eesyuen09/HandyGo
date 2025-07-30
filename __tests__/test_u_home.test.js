/**
 * @jest-environment jsdom
 */

jest.mock("@react-native-picker/picker", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { Picker: (props) => React.createElement(View, null, props.children) };
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
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("../components/KeyboardAvoidingWrapper", () => {
  const React = require("react");
  const { View } = require("react-native");
  return ({ children }) => React.createElement(View, null, children);
});

// 1) Mirror exactly the categories & subcategories your component uses:
const SERVICES = [
  {
    title: "Cleaning",
    subcategories: ["Deep Cleaning", "Home Organizing"],
    description: "All cleaning services",
    price: 50,
  },
  {
    title: "Moving",
    subcategories: ["House Moving"],
    description: "All moving services",
    price: 100,
  },
  {
    title: "Repair",
    subcategories: ["Air Conditioner Repair"],
    description: "All repair services",
    price: 75,
  },
  {
    title: "Outdoor Services",
    subcategories: ["Gardening"],
    description: "All outdoor services",
    price: 60,
  },
  {
    title: "Maintenance",
    subcategories: ["Gas Leak Detection"],
    description: "All maintenance services",
    price: 120,
  },
];
jest.mock("../constants/category_constant", () => ({
  services_categories: SERVICES,
}));

// 2) Stub firebase so imports don't break:
jest.mock("../firebaseConfig", () => ({ auth: {}, db: {} }));
jest.mock("firebase/auth", () => ({
  /* unused here */
}));
jest.mock("firebase/firestore", () => ({
  /* unused here */
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import UserHome from "../screen/user_home";

describe("UserHome Screen", () => {
  let mockNavigate;
  beforeAll(() => {
    mockNavigate = jest.fn();
  });
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // The exact banners your component renders:
  const BANNERS = [
    "Deep Cleaning",
    "Home Organizing",
    "Air Conditioner Repair",
    "House Moving",
    "Gas Leak Detection",
    "Gardening",
  ];

  it("renders search bar, shortcuts, and banners", () => {
    const { getByPlaceholderText, getByText } = render(
      <UserHome navigation={{ navigate: mockNavigate }} />,
    );

    // search
    expect(getByPlaceholderText(/Looking for any service\?/i)).toBeTruthy();

    // each shortcut
    SERVICES.forEach(({ title }) => {
      expect(getByText(title)).toBeTruthy();
    });

    // each banner
    BANNERS.forEach((label) => {
      expect(getByText(label)).toBeTruthy();
    });
  });

  it("navigates via search (category → first subcategory)", () => {
    const { getByPlaceholderText } = render(
      <UserHome navigation={{ navigate: mockNavigate }} />,
    );
    const input = getByPlaceholderText(/Looking for any service\?/i);

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
  });

  it("navigates via search (matching subcategory)", () => {
    const { getByPlaceholderText } = render(
      <UserHome navigation={{ navigate: mockNavigate }} />,
    );
    const input = getByPlaceholderText(/Looking for any service\?/i);

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

  it("navigates when tapping shortcuts", () => {
    const { getByText } = render(
      <UserHome navigation={{ navigate: mockNavigate }} />,
    );

    SERVICES.forEach(({ title, subcategories, description, price }) => {
      fireEvent.press(getByText(title));
      expect(mockNavigate).toHaveBeenLastCalledWith("UserBooking", {
        serviceType: title,
        subcategory: subcategories[0],
        description,
        price,
      });
    });
  });

  it("navigates when tapping banners", () => {
    const { getByText } = render(
      <UserHome navigation={{ navigate: mockNavigate }} />,
    );

    // find which category each banner belongs to:
    const bannerMap = SERVICES.reduce((map, cat) => {
      cat.subcategories.forEach((sub) => {
        map[sub] = cat;
      });
      return map;
    }, {});

    BANNERS.forEach((label) => {
      const { title, subcategories, description, price } = bannerMap[label];
      // if label isn't in subcategories, default to first
      const sub = subcategories.includes(label) ? label : subcategories[0];
      fireEvent.press(getByText(label));
      expect(mockNavigate).toHaveBeenLastCalledWith("UserBooking", {
        serviceType: title,
        subcategory: sub,
        description,
        price,
      });
    });
  });
});
