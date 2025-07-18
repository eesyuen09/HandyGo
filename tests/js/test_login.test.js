//

/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import Login from "../../screen/login.js";

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

  it("navigates to UserTabs when an existing user logs in", async () => {
    // Mock Firestore getDoc to return a user with role "user"
    const { getDoc } = require("firebase/firestore");
    getDoc.mockImplementationOnce(() =>
      Promise.resolve({ exists: () => true, data: () => ({ role: "user" }) })
    );

    const { getByPlaceholderText, getByText } = render(
      <Login navigation={navigation} />
    );
    fireEvent.changeText(
      getByPlaceholderText(/Enter Your Email Here/i),
      "user@example.com"
    );
    fireEvent.changeText(getByPlaceholderText(/••••••/), "correctpass");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      // no error alert
      expect(Alert.alert).not.toHaveBeenCalled();
      // should go to the User home
      expect(mockNav).toHaveBeenCalledWith("UserTabs");
    });
  });

  it("navigates to Add Details when a business logs in but has no details", async () => {
    // Mock Firestore getDoc to return a business without required fields
    const { getDoc } = require("firebase/firestore");
    getDoc.mockImplementationOnce(() =>
      Promise.resolve({
        exists: () => true,
        data: () => ({
          role: "business",
          // omit contact, address, NRIC, etc.
        }),
      })
    );

    const { getByPlaceholderText, getByText } = render(
      <Login navigation={navigation} />
    );
    fireEvent.changeText(
      getByPlaceholderText(/Enter Your Email Here/i),
      "worker@example.com"
    );
    fireEvent.changeText(getByPlaceholderText(/••••••/), "workerpass");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      // no error alert
      expect(Alert.alert).not.toHaveBeenCalled();
      // should prompt business to Add Details
      expect(mockNav).toHaveBeenCalledWith("Add Details");
    });
  });

  it("alerts when email is not verified", async () => {
    // mock signIn to return a user whose emailVerified is false
    const { signInWithEmailAndPassword } = require("firebase/auth");
    signInWithEmailAndPassword.mockImplementationOnce(() =>
      Promise.resolve({
        user: { uid: "u2", reload: jest.fn(), emailVerified: false },
      })
    );

    const { getByPlaceholderText, getByText } = render(
      <Login navigation={navigation} />
    );
    fireEvent.changeText(
      getByPlaceholderText(/Enter Your Email Here/i),
      "unverified@example.com"
    );
    fireEvent.changeText(getByPlaceholderText(/••••••/), "anyPassword");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Email Not Verified",
        "Please verify your email before logging in."
      );
    });
  });

  it("alerts when user does not exist", async () => {
    // mock signIn to reject with user-not-found
    const { signInWithEmailAndPassword } = require("firebase/auth");
    signInWithEmailAndPassword.mockImplementationOnce(() =>
      Promise.reject({ code: "auth/user-not-found" })
    );

    const { getByPlaceholderText, getByText } = render(
      <Login navigation={navigation} />
    );
    fireEvent.changeText(
      getByPlaceholderText(/Enter Your Email Here/i),
      "missing@example.com"
    );
    fireEvent.changeText(getByPlaceholderText(/••••••/), "doesntMatter");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "No user found");
    });
  });
});
