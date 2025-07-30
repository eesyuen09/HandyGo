import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

// mock react-navigation hooks
jest.mock("@react-navigation/native", () => {
  return {
    useFocusEffect: (fn) => fn(),
    useRoute: () => ({ params: { urgency: true } }),
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  };
});

// mock Firestore
const mockGetDoc = jest.fn();
const mockDoc = jest.fn();
jest.mock("firebase/firestore", () => ({
  doc: (...args) => mockDoc(...args),
  getDoc: (...args) => mockGetDoc(...args),
}));

// mock our firebaseConfig auth
jest.mock("../../firebaseConfig", () => ({
  auth: { currentUser: { uid: "user-123" } },
  db: {},
}));

import FilterScreen, {
  useToggleSubcategory,
  doApplyFilters,
} from "../../screen/biz_servicefilter";

describe("useToggleSubcategory hook", () => {
  function HookTester({ initial }) {
    const { selectedSubcategory, toggleSubcategory } =
      useToggleSubcategory(initial);
    return (
      <>
        <Text testID="current">{JSON.stringify(selectedSubcategory)}</Text>
        <TouchableOpacity onPress={() => toggleSubcategory("X")} testID="btn">
          <Text>Toggle X</Text>
        </TouchableOpacity>
      </>
    );
  }

  it("adds and removes an item", async () => {
    const { getByTestId, getByText } = render(<HookTester initial={["A"]} />);

    // initial state
    expect(getByTestId("current").props.children).toBe(JSON.stringify(["A"]));

    // add X
    fireEvent.press(getByText("Toggle X"));
    expect(getByTestId("current").props.children).toBe(
      JSON.stringify(["A", "X"])
    );

    // toggle A off
    fireEvent.press(getByText("Toggle X")); // toggling X again removes it
    expect(getByTestId("current").props.children).toBe(JSON.stringify(["A"]));
  });
});

describe("doApplyFilters()", () => {
  let navigation;
  beforeEach(() => {
    navigation = { navigate: jest.fn() };
  });

  it("navigates to Business Urgent Task when urgency is true", () => {
    doApplyFilters(navigation, true, ["X"], 10, 20, 2, 4);
    expect(navigation.navigate).toHaveBeenCalledWith("Business Urgent Task", {
      filter: {
        subcategory: ["X"],
        priceRange: [10, 20],
        durationRange: [2, 4],
      },
    });
  });

  it("navigates to Business Scheduled Task when urgency is false", () => {
    doApplyFilters(navigation, false, [], 0, 0, 0, 0);
    expect(navigation.navigate).toHaveBeenCalledWith(
      "Business Scheduled Task",
      {
        filter: {},
      }
    );
  });
});

describe("<FilterScreen />", () => {
  it("fetches subcategories and renders them", async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ subcategory: ["Clean", "Fix", ""] }),
    });

    const fakeNav = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByText } = render(<FilterScreen navigation={fakeNav} />);

    await waitFor(() => {
      expect(mockDoc).toHaveBeenCalledWith({}, "users", "user-123");
      expect(getByText("Clean")).toBeTruthy();
      expect(getByText("Fix")).toBeTruthy();
      expect(() => getByText("")).toThrow(); // empty filtered out
    });
  });

  it("Apply Filters button calls doApplyFilters with current state", async () => {
    // load one subcategory
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ subcategory: ["A"] }),
    });

    const fakeNav = { navigate: jest.fn(), goBack: jest.fn() };
    const screen = render(<FilterScreen navigation={fakeNav} />);

    // wait for it to render “A”
    await waitFor(() => screen.getByText("A"));

    // select “A” and press Apply
    fireEvent.press(screen.getByText("A"));
    fireEvent.press(screen.getByText("Apply Filters"));

    expect(fakeNav.navigate).toHaveBeenCalledWith("Business Urgent Task", {
      filter: { subcategory: ["A"] },
    });
  });
});
