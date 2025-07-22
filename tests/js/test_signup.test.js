import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import Signup from "../../screen/signup";

// Mock Alert
Alert.alert = jest.fn();

// Firebase mocks
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock("../../firebaseConfig", () => ({
  auth: {},
  db: {},
}));

// Native and component mocks
jest.mock("expo-status-bar", () => ({ StatusBar: () => null }));
jest.mock("expo-constants", () => ({ manifest: { scheme: "app" } }));
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const make = (name) => (props) => React.createElement(Text, {}, name);
  return { Octicons: make("Octicons"), Ionicons: make("Ionicons") };
});
jest.mock("../../components/KeyboardAvoidingWrapper", () => {
  const React = require("react");
  return ({ children }) => React.createElement(">{children}", {}, children);
});
jest.mock("@react-native-community/datetimepicker", () => {
  const React = require("react");
  return (props) => {
    React.useEffect(() => {
      props.onChange(null, new Date(2000, 0, 1));
    }, []);
    return null;
  };
});

describe("Signup function tests", () => {
  const {
    createUserWithEmailAndPassword,
    sendEmailVerification,
  } = require("firebase/auth");
  const { doc, setDoc } = require("firebase/firestore");
  const mockNav = jest.fn();
  const navigation = { navigate: mockNav };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates user, sends email verification, and writes to Firestore", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "testuid" },
    });
    sendEmailVerification.mockResolvedValue();
    setDoc.mockResolvedValue();

    const { getByPlaceholderText, getAllByPlaceholderText, getByText } = render(
      <Signup navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText(/Full Name/i), "Test User");
    fireEvent.changeText(
      getByPlaceholderText(/Email Address/i),
      "test@example.com"
    );
    fireEvent.press(getByText("User"));
    const [pwd, confirmPwd] = getAllByPlaceholderText("••••••");
    fireEvent.changeText(pwd, "password123");
    fireEvent.changeText(confirmPwd, "password123");
    fireEvent.press(getByPlaceholderText(/YYYY/i));

    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "test@example.com",
        "password123"
      );
      expect(sendEmailVerification).toHaveBeenCalledWith({ uid: "testuid" });
      expect(setDoc).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        "Please Verify Your Email",
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  it("shows error if email already in use", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: "auth/email-already-in-use",
    });

    const { getByPlaceholderText, getAllByPlaceholderText, getByText } = render(
      <Signup navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText(/Full Name/i), "User");
    fireEvent.changeText(
      getByPlaceholderText(/Email Address/i),
      "exists@example.com"
    );
    fireEvent.press(getByText("User"));
    const [pwd, confirmPwd] = getAllByPlaceholderText("••••••");
    fireEvent.changeText(pwd, "password123");
    fireEvent.changeText(confirmPwd, "password123");
    fireEvent.press(getByPlaceholderText(/YYYY/i));

    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Email already in use");
    });
  });

  it("shows error if weak password", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: "auth/weak-password",
    });

    const { getByPlaceholderText, getAllByPlaceholderText, getByText } = render(
      <Signup navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText(/Full Name/i), "User");
    fireEvent.changeText(
      getByPlaceholderText(/Email Address/i),
      "weak@pass.com"
    );
    fireEvent.press(getByText("User"));
    const [pwd, confirmPwd] = getAllByPlaceholderText("••••••");
    fireEvent.changeText(pwd, "123");
    fireEvent.changeText(confirmPwd, "123");
    fireEvent.press(getByPlaceholderText(/YYYY/i));

    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Password should be at least 6 characters"
      );
    });
  });

  it("shows error if invalid email format", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: "auth/invalid-email",
    });

    const { getByPlaceholderText, getAllByPlaceholderText, getByText } = render(
      <Signup navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText(/Full Name/i), "User");
    fireEvent.changeText(
      getByPlaceholderText(/Email Address/i),
      "invalidemail"
    );
    fireEvent.press(getByText("User"));
    const [pwd, confirmPwd] = getAllByPlaceholderText("••••••");
    fireEvent.changeText(pwd, "validpass");
    fireEvent.changeText(confirmPwd, "validpass");
    fireEvent.press(getByPlaceholderText(/YYYY/i));

    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Invalid email format");
    });
  });

  it("shows error when passwords do not match", async () => {
    const { getByPlaceholderText, getAllByPlaceholderText, getByText } = render(
      <Signup navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText(/Full Name/i), "Mismatch User");
    fireEvent.changeText(
      getByPlaceholderText(/Email Address/i),
      "mismatch@example.com"
    );
    fireEvent.press(getByText("User"));
    const [pwd, confirmPwd] = getAllByPlaceholderText("••••••");
    fireEvent.changeText(pwd, "password123");
    fireEvent.changeText(confirmPwd, "differentPassword");
    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Passwords do not match."
      );
    });
  });

  it("shows error on empty form submission", async () => {
    const { getByText } = render(<Signup navigation={navigation} />);
    fireEvent.press(getByText("User"));
    fireEvent.press(getByText("Sign Up"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Please fill in all fields."
      );
    });
  });
});
