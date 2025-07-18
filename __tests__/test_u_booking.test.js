/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert, Text } from "react-native";

// Mock react-navigation’s useRoute to supply params
jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({
    params: {
      serviceType: "Cleaning",
      subcategory: "Deep Cleaning",
      description: "All cleaning services",
      price: 50,
    },
  }),
}));

jest.mock("../components/style_u_booking.js", () => ({
  colours: {},
  styles: {},
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("../components/KeyboardAvoidingWrapper.js", () => {
  const React = require("react");
  const { View } = require("react-native");
  return ({ children }) => React.createElement(View, null, children);
});

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const make = (name) => () => React.createElement(Text, null, name);
  return {
    FontAwesome5: make("FontAwesome5"),
    AntDesign: make("AntDesign"),
    MaterialIcons: make("MaterialIcons"),
    Entypo: make("Entypo"),
    FontAwesome: make("FontAwesome"),
    Feather: make("Feather"),
    FontAwesome6: make("FontAwesome6"),
  };
});

jest.mock("react-native-dropdown-picker", () => "DropDownPicker");
jest.mock("@react-native-community/datetimepicker", () => "DateTimePicker");

jest.mock("../firebaseConfig", () => ({ auth: {}, db: {} }));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ currentUser: { uid: "u1" } })),
  onAuthStateChanged: jest.fn((auth, cb) => {
    cb({ uid: "u1" });
    return () => {};
  }),
}));

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(() => Promise.resolve({ id: "fakeId" })),
  collection: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
}));

Alert.alert = jest.fn();

import UserBooking, {
  calculateEndTime,
  handleBookingSubmit,
} from "../screen/user_booking.js";

describe("UserBooking Screen", () => {
  beforeEach(async () => {
    Alert.alert.mockClear();
  });

  it.each([
    ["09:00", "1", "10:00"],
    ["13:30", "2", "15:30"],
    ["23:15", "1", "00:15"],
  ])("calculateEndTime(%s, %s) → %s", (start, dur, expected) => {
    expect(calculateEndTime(start, dur)).toBe(expected);
  });

  it("handleBookingSubmit fires its success alert", () => {
    handleBookingSubmit({});
    expect(Alert.alert).toHaveBeenCalledWith(
      "Booking Submitted",
      "Your booking has been successfully submitted!"
    );
  });

  it("renders the banner from route params", () => {
    const { getByText } = render(<UserBooking />);
    expect(getByText("Cleaning")).toBeTruthy();
    expect(getByText("All cleaning services")).toBeTruthy();
    expect(getByText("Starting from")).toBeTruthy();
    expect(getByText(/\$\s*50/)).toBeTruthy();
  });

  it("shows validation errors if required fields are empty", async () => {
    const { getByText } = render(<UserBooking />);
    fireEvent.press(getByText("Book Now"));

    await waitFor(() => {
      [
        "duration is required",
        "Date is required",
        "Time is required",
        "State is required",
        "Postcode is required",
        "Address is required",
      ].forEach((msg) => {
        expect(getByText(msg)).toBeTruthy();
      });
    });
  });

  it("allows adding up to 3 availability slots and removing them", () => {
    const { getAllByText, getByText } = render(<UserBooking />);

    // initially one slot
    expect(getAllByText("Select Date").length).toBe(1);

    // add two more: total 3
    fireEvent.press(getByText("Add Time Slot"));
    fireEvent.press(getAllByText("Add Time Slot")[1]);
    expect(getAllByText("Select Date").length).toBe(3);

    // fourth add should alert
    fireEvent.press(getAllByText("Add Time Slot")[2]);
    expect(Alert.alert).toHaveBeenLastCalledWith(
      "Action Not Allowed",
      "You can only choose up to 3 time slots."
    );

    // remove one slot → back to 2
    fireEvent.press(getAllByText("Remove")[1]);
    expect(getAllByText("Select Date").length).toBe(2);
  });
});
