// __tests__/Moredetails.test.js
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert, Text, TextInput, TouchableOpacity } from "react-native";
import Moredetails, {
  handleBusinessDetailsSubmit,
  addEmptyCategory,
  deleteEmptyCategory,
  updateTitle,
  addSubtitle,
} from "../../screen/moredetails";

import * as Font from "expo-font";
import * as firestore from "firebase/firestore";
import { db, auth as mockAuth } from "../../firebaseConfig";
import { services_categories } from "../../constants/category_constant";
import { categoryMap } from "../../constants/categorymap";
import { useNavigation } from "@react-navigation/native";

// --- 1) MOCK EXTERNAL LIBRARIES ----------------------------------

// expo-font
jest.mock("expo-font", () => ({
  useFonts: jest.fn(() => [true]),
}));

// firebaseConfig
jest.mock("../../firebaseConfig", () => ({
  db: {},
  auth: {
    currentUser: { uid: "user-uid" },
  },
}));

// firestore
jest.mock("firebase/firestore", () => ({
  doc: jest.fn((db, col, id) => ({ path: `${col}/${id}` })),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn((v) => ({ union: v })),
}));

// constants
jest.mock("../../constants/categorymap", () => ({
  categoryMap: { Foo: "foo" },
}));
jest.mock("../../constants/category_constant", () => ({
  services_categories: [{ title: "Cat1", subcategories: ["Sub1", "Sub2"] }],
}));

// vector-icons
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Octicons: () => React.createElement(Text, null, "Oct"),
    Ionicons: () => React.createElement(Text, null, "Ion"),
    FontAwesome: () => React.createElement(Text, null, "FA"),
  };
});

// Picker
jest.mock("@react-native-picker/picker", () => {
  const React = require("react");
  return {
    Picker: (props) => React.createElement("Picker", props),
    Item: (props) => React.createElement("Picker.Item", props),
  };
});

// react-navigation
const mockReplace = jest.fn();
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    replace: mockReplace,
    navigate: mockNavigate,
  }),
}));

// KeyboardAvoidingWrapper
jest.mock("../../components/KeyboardAvoidingWrapper", () => "KW");

// global alert
global.alert = jest.fn();
jest.spyOn(Alert, "alert").mockImplementation(() => {});

// -----------------------------------------------------------------

describe("<Moredetails />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("checks if getDoc is called and navigation.replace when all details exist", async () => {
    // mock getDoc to return snapshot with all required fields
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

    render(<Moredetails />);

    // wait for useEffect to run
    await waitFor(() => {
      expect(firestore.getDoc).toHaveBeenCalledWith(
        firestore.doc(db, "users", "user-uid")
      );
      expect(mockReplace).toHaveBeenCalledWith("WorkerTabs");
    });
  });

  it("does NOT navigate when user has no details", async () => {
    firestore.getDoc.mockResolvedValueOnce({ exists: () => false });
    render(<Moredetails />);
    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});

describe("handleBusinessDetailsSubmit()", () => {
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

  it("ensures error if user not logged in", async () => {
    // simulate no user
    mockAuth.currentUser = null;
    await handleBusinessDetailsSubmit(valuesTemplate);
    expect(Alert.alert).toHaveBeenCalledWith("Error", "User not logged in");
  });

  it("ensures error on missing required fields", async () => {
    mockAuth.currentUser = { uid: "user" };
    const bad = { ...valuesTemplate, contact: "" };
    await handleBusinessDetailsSubmit(bad);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Please fill in all required fields."
    );
  });

  it("ensures error on invalid contact", async () => {
    mockAuth.currentUser = { uid: "user" };
    const bad = { ...valuesTemplate, contact: "123a" };
    await handleBusinessDetailsSubmit(bad);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Invalid Contact",
      "Contact number must not contain letters."
    );
  });

  it("ensures error on invalid NRIC", async () => {
    mockAuth.currentUser = { uid: "user" };
    const bad = { ...valuesTemplate, NRIC: "ABC!" };
    await handleBusinessDetailsSubmit(bad);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Invalid NRIC/Passport",
      "Only letters and numbers allowed."
    );
  });

  it("ensures error on invalid bank number", async () => {
    mockAuth.currentUser = { uid: "user" };
    const bad = { ...valuesTemplate, bankNumber: "12AB" };
    await handleBusinessDetailsSubmit(bad);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Invalid Bank Number",
      "Bank number must contain digits only."
    );
  });

  it("ensures error on empty category/subcategory", async () => {
    mockAuth.currentUser = { uid: "user" };
    const bad = { ...valuesTemplate, category: [], subcategory: [] };
    await handleBusinessDetailsSubmit(bad);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Please select at least one category and subcategory."
    );
  });

  it("ensures successful submission calls updateDoc and navigation", async () => {
    mockAuth.currentUser = { uid: "user" };
    firestore.updateDoc.mockResolvedValue();
    await handleBusinessDetailsSubmit(valuesTemplate);

    // first updateDoc for user details
    expect(firestore.updateDoc).toHaveBeenCalledWith(
      firestore.doc(db, "users", "user"),
      expect.objectContaining({
        contact: valuesTemplate.contact,
        address: valuesTemplate.address,
      })
    );

    // then for each category
    expect(firestore.updateDoc).toHaveBeenCalledWith(
      firestore.doc(db, "categoryToWorker", "Cat1"),
      { workers: expect.any(Object) }
    );

    // and subcategory
    expect(firestore.updateDoc).toHaveBeenCalledWith(
      firestore.doc(db, "subcategoryToWorker", "Sub1"),
      { workers: expect.any(Object) }
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

  it("ensures addEmptyCategory adds empty strings", () => {
    const updatedCats = addEmptyCategory.call({
      setCategory: (fn) => {
        catState = fn(catState);
      },
      setSubcategory: (fn) => {
        subState = fn(subState);
      },
    });
    expect(catState).toEqual([""]);
    expect(subState).toEqual([""]);
  });

  it("ensures deleteEmptyCategory does not remove last element", () => {
    catState = [""];
    subState = [""];
    deleteEmptyCategory.call({
      setCategory: (fn) => {
        catState = fn(catState);
      },
      setSubcategory: (fn) => {
        subState = fn(subState);
      },
    });
    expect(catState).toEqual([""]);
    expect(subState).toEqual([""]);
  });

  it("ensures updateTitle replaces and prevents duplicates", () => {
    catState = ["A"];
    const setFieldValue = jest.fn();
    updateTitle.call(
      {
        setCategory: (fn) => {
          catState = fn(catState);
        },
      },
      0,
      "A",
      setFieldValue
    );
    // no duplicate alert
    expect(Alert.alert).not.toHaveBeenCalled();

    updateTitle.call(
      {
        setCategory: (fn) => {
          catState = fn(catState);
        },
      },
      0,
      "Other",
      setFieldValue
    );
    expect(catState[0]).toBe("Other");
    expect(setFieldValue).toHaveBeenCalledWith("category", ["Other"]);

    // now try duplicate at different index
    catState = ["X", "Y"];
    updateTitle.call(
      {
        setCategory: (fn) => {
          catState = fn(catState);
        },
      },
      1,
      "X",
      setFieldValue
    );
    expect(Alert.alert).toHaveBeenCalledWith("Category already selected.");
  });

  it("ensures addSubtitle toggles correctly", () => {
    subState = [];
    const setFieldValue = jest.fn();
    addSubtitle.call(
      {
        setSubcategory: (fn) => {
          subState = fn(subState);
        },
      },
      "Sub1",
      setFieldValue
    );
    expect(subState).toEqual(["Sub1"]);
    addSubtitle.call(
      {
        setSubcategory: (fn) => {
          subState = fn(subState);
        },
      },
      "Sub1",
      setFieldValue
    );
    expect(subState).toEqual([]);
  });
});
