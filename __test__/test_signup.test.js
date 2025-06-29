/**
 * @jest-environment jsdom
 */
jest.mock("@react-native-community/datetimepicker", () => {
  // Immediately invoke onChange so dob is set before submit
  return (props) => {
    props.onChange(null, new Date(2000, 0, 1));
    return null;
  };
});

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import Signup from "../screen/signup.js";

// Silence Formik act warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "An update to Formik inside a test was not wrapped in act"
      )
    ) {
      return;
    }
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

// Polyfills
global.clearImmediate = global.clearImmediate || ((id) => clearTimeout(id));
global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));

// 1) Spy on Alert.alert
Alert.alert = jest.fn();

// 2) Native/Expo mocks
jest.mock("expo-status-bar", () => ({ StatusBar: () => null }));
jest.mock("expo-constants", () => ({ manifest: { scheme: "app" } }));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const make = (name) => (props) => React.createElement(Text, {}, name);
  return { Octicons: make("Octicons"), Ionicons: make("Ionicons") };
});
jest.mock("expo-font", () => ({
  loadAsync: jest.fn().mockResolvedValue(true),
}));
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
jest.mock("../components/KeyboardAvoidingWrapper", () => {
  const React = require("react");
  return ({ children }) => React.createElement(">{children}", {}, children);
});

// 3) firebaseConfig stub
jest.mock("../firebaseConfig", () => ({ auth: {}, db: {} }));

// 4) Auth mocks
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { uid: "u1" } })
  ),
  sendEmailVerification: jest.fn(() => Promise.resolve()),
}));

// 5) Firestore mocks
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
}));

describe("Signup Screen", () => {
  const mockNav = jest.fn();
  const navigation = { navigate: mockNav };

  beforeEach(() => {
    mockNav.mockClear();
    Alert.alert.mockClear();

    // reset auth implementations
    const {
      createUserWithEmailAndPassword,
      sendEmailVerification,
    } = require("firebase/auth");
    createUserWithEmailAndPassword.mockImplementation(() =>
      Promise.resolve({ user: { uid: "u1" } })
    );
    sendEmailVerification.mockImplementation(() => Promise.resolve());
  });

  it("renders all fields and buttons", () => {
    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(
      <Signup navigation={navigation} />
    );

    expect(getByPlaceholderText(/Enter Your Full Name Here/i)).toBeTruthy();
    expect(getByPlaceholderText(/Enter Your Email Address Here/i)).toBeTruthy();
    expect(getByText(/Date of Birth/i)).toBeTruthy();

    // Two password fields share the same placeholder
    const pwdFields = getAllByPlaceholderText(/••••••/);
    expect(pwdFields).toHaveLength(2);

    expect(getByText(/Confirm Password/i)).toBeTruthy();
    expect(getByText("Worker")).toBeTruthy();
    expect(getByText("User")).toBeTruthy();
    expect(getByText("Sign Up")).toBeTruthy();
    expect(getByText("Already have an account?")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
  });

  it("alerts when submitting empty form", async () => {
    const { getByText } = render(<Signup navigation={navigation} />);
    // need to pick a role before submit
    fireEvent.press(getByText("User"));
    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Please fill in all fields."
      );
    });
  });

  it("alerts when passwords do not match", async () => {
    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(
      <Signup navigation={navigation} />
    );

    fireEvent.changeText(
      getByPlaceholderText(/Enter Your Full Name Here/i),
      "Alice"
    );
    fireEvent.changeText(
      getByPlaceholderText(/Enter Your Email Address Here/i),
      "a@b.com"
    );
    fireEvent.press(getByText("User"));

    const [pwd, confirm] = getAllByPlaceholderText(/••••••/);
    fireEvent.changeText(pwd, "pass123");
    fireEvent.changeText(confirm, "pass456");

    fireEvent.press(getByText("Sign Up"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Passwords do not match."
      );
    });
  });

  it("alerts on email-already-in-use error", async () => {
    const { createUserWithEmailAndPassword } = require("firebase/auth");
    createUserWithEmailAndPassword.mockImplementationOnce(() =>
      Promise.reject({ code: "auth/email-already-in-use" })
    );

    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(
      <Signup navigation={navigation} />
    );

    fireEvent.changeText(
      getByPlaceholderText(/Enter Your Full Name Here/i),
      "Bob"
    );
    fireEvent.changeText(
      getByPlaceholderText(/Enter Your Email Address Here/i),
      "bob@x.com"
    );
    fireEvent.press(getByText("User"));

    const [pwd, confirm] = getAllByPlaceholderText(/••••••/);
    fireEvent.changeText(pwd, "pass123");
    fireEvent.changeText(confirm, "pass123");

    fireEvent.press(getByText("Sign Up"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Email already in use");
    });
  });

  it("alerts on weak-password error", async () => {
    const { createUserWithEmailAndPassword } = require("firebase/auth");
    createUserWithEmailAndPassword.mockImplementationOnce(() =>
      Promise.reject({ code: "auth/weak-password" })
    );

    const { getByPlaceholderText, getByText, getAllByPlaceholderText } = render(
      <Signup navigation={navigation} />
    );

    fireEvent.changeText(
      getByPlaceholderText(/Enter Your Full Name Here/i),
      "Carol"
    );
    fireEvent.changeText(
      getByPlaceholderText(/Enter Your Email Address Here/i),
      "carol@x.com"
    );
    fireEvent.press(getByText("User"));

    const [pwd, confirm] = getAllByPlaceholderText(/••••••/);
    fireEvent.changeText(pwd, "123");
    fireEvent.changeText(confirm, "123");

    fireEvent.press(getByText("Sign Up"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Password should be at least 6 characters"
      );
    });
  });

  it("submits successfully and navigates to Login", async () => {
    const { getByText, getAllByPlaceholderText, getByPlaceholderText } = render(
      <Signup navigation={navigation} />
    );

    // fill in name/email/role/password
    fireEvent.changeText(getByPlaceholderText(/Full Name/i), "Dave");
    fireEvent.changeText(getByPlaceholderText(/Email Address/i), "dave@x.com");
    fireEvent.press(getByText("User"));
    const [pwd, confirm] = getAllByPlaceholderText(/••••••/);
    fireEvent.changeText(pwd, "strongpass");
    fireEvent.changeText(confirm, "strongpass");

    // **NEW**: open the DOB picker so our mock can set dob synchronously
    fireEvent.press(getByPlaceholderText(/YYYY – MM – DD/));

    // now submit
    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Please Verify Your Email",
        "A verification email has been sent to you account.",
        expect.any(Array)
      );
    });
  });
  it("navigates back to Login on link press", () => {
    const { getByText } = render(<Signup navigation={navigation} />);
    fireEvent.press(getByText("Login"));
    expect(mockNav).toHaveBeenCalledWith("Login");
  });
});
