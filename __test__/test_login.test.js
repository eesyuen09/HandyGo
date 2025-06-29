//

/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import Login from "../screen/login.js";

// Polyfill missing globals
global.clearImmediate = global.clearImmediate || ((id) => clearTimeout(id));
global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));

// 1) Mock Alert.alert as a Jest fn
Alert.alert = jest.fn();

// 2) Expo / native mocks
jest.mock("expo-status-bar", () => ({ StatusBar: () => null }));
jest.mock("expo-constants", () => ({ manifest: { scheme: "app" } }));
jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: () => [null, null, jest.fn()],
}));
jest.mock("expo-web-browser", () => ({ maybeCompleteAuthSession: jest.fn() }));
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const make = (name) => (props) =>
    React.createElement(Text, { ...props }, name);
  return {
    Ionicons: make("Ionicons"),
    Octicons: make("Octicons"),
    FontAwesome: make("FontAwesome"),
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
  return ({ children }) => React.createElement(">{children}", {}, children);
});

// 3) Mock firebaseConfig
jest.mock("../firebaseConfig", () => ({ auth: {}, db: {} }));

// 4) Mock Firebase Auth
const authMock = require("firebase/auth");
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: { uid: "u1", reload: jest.fn(), emailVerified: true },
    })
  ),
  signInWithCredential: jest.fn(() => Promise.resolve({ user: { uid: "u1" } })),
  GoogleAuthProvider: { credential: jest.fn() },
}));

// 5) Mock Firestore
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() =>
    Promise.resolve({ exists: () => false, data: () => ({}) })
  ),
  setDoc: jest.fn(),
}));

describe("Login Screen", () => {
  const mockNav = jest.fn();
  const navigation = { navigate: mockNav, replace: mockNav };

  beforeEach(() => {
    mockNav.mockClear();
    Alert.alert.mockClear();

    // reset Firestore to “no user”
    const { getDoc } = require("firebase/firestore");
    getDoc.mockImplementation(() =>
      Promise.resolve({ exists: () => false, data: () => ({}) })
    );

    // reset auth to default success
    const { signInWithEmailAndPassword } = require("firebase/auth");
    signInWithEmailAndPassword.mockImplementation(() =>
      Promise.resolve({
        user: { uid: "u1", reload: jest.fn(), emailVerified: true },
      })
    );
  });

  it("renders form fields and buttons", () => {
    const { getByPlaceholderText, getByText } = render(
      <Login navigation={navigation} />
    );
    expect(getByPlaceholderText(/Enter Your Email Here/i)).toBeTruthy();
    expect(getByPlaceholderText(/••••••/)).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Don't have an account already?")).toBeTruthy();
    expect(getByText("Sign Up")).toBeTruthy();
  });

  it("alerts when submitting empty form", async () => {
    const { getByText } = render(<Login navigation={navigation} />);
    fireEvent.press(getByText("Login"));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Please fill in all fields."
      );
    });
  });

  it("alerts on incorrect password", async () => {
    // simulate auth wrong-password error
    const { signInWithEmailAndPassword } = require("firebase/auth");
    signInWithEmailAndPassword.mockImplementationOnce(() =>
      Promise.reject({ code: "auth/wrong-password" })
    );

    const { getByPlaceholderText, getByText } = render(
      <Login navigation={navigation} />
    );
    fireEvent.changeText(
      getByPlaceholderText(/Enter Your Email Here/i),
      "user@example.com"
    );
    fireEvent.changeText(getByPlaceholderText(/••••••/), "badpass");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Incorrect email or password"
      );
    });
  });

  it("submits successfully and navigates to UserTabs for existing user", async () => {
    // simulate existing user in Firestore
    const { getDoc } = require("firebase/firestore");
    getDoc.mockImplementationOnce(() =>
      Promise.resolve({ exists: () => true, data: () => ({ role: "user" }) })
    );

    const { getByPlaceholderText, getByText } = render(
      <Login navigation={navigation} />
    );
    fireEvent.changeText(
      getByPlaceholderText(/Enter Your Email Here/i),
      "a@b.com"
    );
    fireEvent.changeText(getByPlaceholderText(/••••••/), "pass123");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalled();
      expect(mockNav).toHaveBeenCalledWith("UserTabs");
    });
  });

  it("navigates to Forgot Password screen", () => {
    const { getByText } = render(<Login navigation={navigation} />);
    fireEvent.press(getByText("Forgot Password?"));
    expect(mockNav).toHaveBeenCalledWith("Forgot Password");
  });

  it("navigates to Signup screen", () => {
    const { getByText } = render(<Login navigation={navigation} />);
    fireEvent.press(getByText("Sign Up"));
    expect(mockNav).toHaveBeenCalledWith("Signup");
  });
});
