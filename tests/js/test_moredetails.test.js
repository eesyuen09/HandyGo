const mockReplace = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ replace: mockReplace, navigate: mockNavigate }),
}));

jest.mock("expo-font", () => ({
  useFonts: jest.fn(() => [true]),
}));

// Mock firebaseConfig
jest.mock("../../firebaseConfig", () => ({
  db: {},
  auth: { currentUser: { uid: "user-uid" } },
}));

// Mock firestore
jest.mock("firebase/firestore", () => ({
  doc: jest.fn((db, col, id) => ({ path: `${col}/${id}` })),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn((uid) => ({ union: uid })),
}));

// Mock category constants
jest.mock("../../constants/categorymap", () => ({
  categoryMap: { Foo: "foo" },
}));
jest.mock("../../constants/category_constant", () => ({
  services_categories: [{ title: "Cat1", subcategories: ["Sub1", "Sub2"] }],
}));

// Mock vector-icons (so JSX code can import icons)
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Octicons: () => React.createElement(Text, null, "Oct"),
    Ionicons: () => React.createElement(Text, null, "Ion"),
    MaterialIcons: () => React.createElement(Text, null, "Mat"),
    FontAwesome5: () => React.createElement(Text, null, "F5"),
    FontAwesome6: () => React.createElement(Text, null, "F6"),
    Feather: () => React.createElement(Text, null, "Fea"),
  };
});

// Mock Picker
jest.mock("@react-native-picker/picker", () => {
  const React = require("react");
  return {
    Picker: (props) => React.createElement("Picker", props),
    Item: (props) => React.createElement("Picker.Item", props),
  };
});
// Mock KeyboardAvoidingWrapper to a simple View wrapper
jest.mock("../../components/KeyboardAvoidingWrapper", () => "KW");

// Override global alert and Alert.alert
global.alert = jest.fn();
jest.spyOn(Alert, "alert").mockImplementation(() => {});

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import Moredetails, {
  handleBusinessDetailsSubmit,
  addEmptyCategory,
  deleteEmptyCategory,
  updateTitle,
  addSubtitle,
} from "../../screen/moredetails";

import * as firestore from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { services_categories } from "../../constants/category_constant";
import { categoryMap } from "../../constants/categorymap";

const valuesTemplate = {
  contact: "12345678",
  address: "Addr",
  NRIC: "A123456",
  bankName: "DBS",
  bankNumber: "87654321",
  category: ["Cat1"],
  subcategory: ["Sub1"],
  introduction: "Intro",
};

describe("<Moredetails />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls getDoc and navigates when details exist", async () => {
    firestore.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        contact: "12345678",
        address: "Somewhere",
        NRIC: "A1234567",
        bankName: "DBS",
        bankNumber: "123456",
        category: ["Cat1"],
        subcategory: ["Sub1"],
        introduction: "Hello",
      }),
    });

    render(
      <Moredetails
        navigation={{ replace: mockReplace, navigate: mockNavigate }}
      />,
    );

    await waitFor(() => {
      expect(firestore.getDoc).toHaveBeenCalledWith(
        firestore.doc(db, "users", "user-uid"),
      );
      expect(mockReplace).toHaveBeenCalledWith("WorkerTabs");
    });
  });

  it("does not navigate when no details", async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => false });
    render(<Moredetails />);
    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});

describe("handleBusinessDetailsSubmit()", () => {
  const mockNavigation = { navigate: mockNavigate };

  it("alerts when user not logged in", async () => {
    auth.currentUser = null;
    await handleBusinessDetailsSubmit(valuesTemplate, mockNavigation);
    expect(Alert.alert).toHaveBeenCalledWith("Error", "User not logged in");
  });

  it("alerts on missing fields", async () => {
    auth.currentUser = { uid: "user" };
    const bad = { ...valuesTemplate, contact: "" };
    await handleBusinessDetailsSubmit(bad, mockNavigation);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Please fill in all required fields.",
    );
  });

  it("alerts on invalid contact", async () => {
    auth.currentUser = { uid: "user" };
    const bad = { ...valuesTemplate, contact: "123a" };
    await handleBusinessDetailsSubmit(bad, mockNavigation);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Invalid Contact",
      "Contact number must not contain letters.",
    );
  });

  it("alerts on invalid NRIC", async () => {
    auth.currentUser = { uid: "user" };
    const bad = { ...valuesTemplate, NRIC: "ABC!" };
    await handleBusinessDetailsSubmit(bad, mockNavigation);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Invalid NRIC/Passport",
      "Only letters and numbers allowed.",
    );
  });

  it("alerts on invalid bank number", async () => {
    auth.currentUser = { uid: "user" };
    const bad = { ...valuesTemplate, bankNumber: "12AB" };
    await handleBusinessDetailsSubmit(bad, mockNavigation);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Invalid Bank Number",
      "Bank number must contain digits only.",
    );
  });

  it("alerts on empty category/subcategory", async () => {
    auth.currentUser = { uid: "user" };
    const bad = { ...valuesTemplate, category: [], subcategory: [] };
    await handleBusinessDetailsSubmit(bad, mockNavigation);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Please select at least one category and subcategory.",
    );
  });

  it("updates Firestore and navigates on success", async () => {
    auth.currentUser = { uid: "user" };
    firestore.updateDoc.mockResolvedValue();
    await handleBusinessDetailsSubmit(valuesTemplate, mockNavigation);

    // user doc update
    expect(firestore.updateDoc).toHaveBeenCalledWith(
      firestore.doc(db, "users", "user"),
      expect.objectContaining({
        contact: valuesTemplate.contact,
        address: valuesTemplate.address,
      }),
    );

    // categoryToWorker update
    expect(firestore.updateDoc).toHaveBeenCalledWith(
      firestore.doc(db, "categoryToWorker", "Cat1"),
      { workers: expect.any(Object) },
    );

    // subcategoryToWorker update
    expect(firestore.updateDoc).toHaveBeenCalledWith(
      firestore.doc(db, "subcategoryToWorker", "Sub1"),
      { workers: expect.any(Object) },
    );

    expect(global.alert).toHaveBeenCalledWith("Data saved successfully!");
    expect(mockNavigate).toHaveBeenCalledWith("Business Home Page");
  });
});

describe("Internal helper functions", () => {
  let catState, subState;
  beforeEach(() => {
    catState = [];
    subState = [];
  });

  it("addEmptyCategory", () => {
    addEmptyCategory(
      (fn) => {
        catState = fn(catState);
      },
      (fn) => {
        subState = fn(subState);
      },
    );
    expect(catState).toEqual([""]);
    expect(subState).toEqual([""]);
  });

  it("deleteEmptyCategory", () => {
    deleteEmptyCategory(
      (fn) => {
        catState = fn(catState);
      },
      (fn) => {
        subState = fn(subState);
      },
    );
    expect(catState).toEqual([]);
    expect(subState).toEqual([]);
  });

  it("updateTitle and prevent duplicate", () => {
    // valid update replaces correctly
    catState = ["A"];
    const setFieldValue = jest.fn();
    const setCategoryFn = (fn) => {
      catState = fn(catState);
    };
    updateTitle(setCategoryFn, 0, "Other", setFieldValue);
    expect(catState).toEqual(["Other"]);
    expect(setFieldValue).toHaveBeenCalledWith("category", ["Other"]);

    // duplicate at different index warns once
    catState = ["X", "Y"];
    Alert.alert.mockClear();
    updateTitle(setCategoryFn, 1, "X", setFieldValue);
    expect(Alert.alert).toHaveBeenCalledWith("Category already selected.");
  });

  it("addSubtitle toggles", () => {
    subState = [];
    const setFieldValue = jest.fn();
    const setSubcategoryFn = (fn) => {
      subState = fn(subState);
    };
    addSubtitle(setSubcategoryFn, "Sub1", setFieldValue);
    expect(subState).toEqual(["Sub1"]);
    addSubtitle(setSubcategoryFn, "Sub1", setFieldValue);
    expect(subState).toEqual([]);
  });
});
