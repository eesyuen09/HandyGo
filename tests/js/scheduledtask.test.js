import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

// Mock React-Navigation hooks before anything else
jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(() => ({ params: {} })),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useFocusEffect: (cb) => cb(),
}));

// Mock Firestore API calls
const mockGetDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockDoc = jest.fn();
const mockCollection = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockOrderBy = jest.fn();

jest.mock("firebase/firestore", () => ({
  getDoc: (...args) => mockGetDoc(...args),
  getDocs: (...args) => mockGetDocs(...args),
  doc: (...args) => mockDoc(...args),
  collection: (...args) => mockCollection(...args),
  query: (...args) => mockQuery(...args),
  where: (...args) => mockWhere(...args),
  orderBy: (...args) => mockOrderBy(...args),
}));

// Mock auth + db
jest.mock("../../firebaseConfig", () => ({
  db: {},
  auth: { currentUser: { uid: "user-uid" } },
}));

jest.mock("lodash", () => ({
  debounce: (fn) => fn,
}));

// Import the helpers under test
import {
  fetchFilteredBookings,
  fetchScheduledTasks,
  handleSearch,
  getIcon,
  renderIcon,
} from "../../screen/biz_scheduledtask";

describe("ScheduledTask helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getIcon()", () => {
    it.each([
      ["Cleaning", { name: "cleaning-services", family: "MaterialIcons" }],
      ["Repair", { name: "tool", family: "Feather" }],
      ["Maintenance", { name: "hands-holding", family: "FontAwesome6" }],
      ["Moving", { name: "truck-moving", family: "FontAwesome5" }],
      ["Outdoor Services", { name: "tree", family: "FontAwesome5" }],
      ["AnythingElse", { name: "wrench", family: "MaterialCommunityIcons" }],
    ])("returns %p → %j", (svc, expected) => {
      expect(getIcon(svc)).toEqual(expected);
    });
  });

  describe("renderIcon()", () => {
    it.each([
      ["alert-circle", "Feather", "blue", 12],
      ["foo", "MaterialIcons", "red", 20],
      ["bar", "MaterialCommunityIcons", "green", 16],
      ["baz", "FontAwesome5", "black", 30],
      ["qux", "FontAwesome6", "yellow", 25],
      ["quux", "Ionicons", "grey", 18],
    ])("renders %s from %s", (name, fam, color, size) => {
      const { getByText } = render(renderIcon(name, fam, color, size));
      expect(getByText(fam)).toBeTruthy();
    });

    it("falls back on unknown family to Feather", () => {
      const { getByText } = render(renderIcon("x", "NoFam", "c", 5));
      expect(getByText("Feather")).toBeTruthy();
    });
  });

  describe("fetchFilteredBookings()", () => {
    const makeDocs = (ids, datas) =>
      ids.map((id, i) => ({ id, data: () => datas[i] }));

    it("builds two queries & returns intersected formatted results", async () => {
      mockGetDocs
        .mockResolvedValueOnce({ docs: makeDocs(["a", "b"], [{}, {}]) })
        .mockResolvedValueOnce({
          docs: makeDocs(
            ["b", "c"],
            [
              {
                type: "T",
                serviceType: "Repair",
                availability: [{ date: "D", time: "T" }],
                price: 7,
                orderID: "O",
                postcode: "P",
                state: "S",
                duration: 3,
              },
            ]
          ),
        });

      const out = await fetchFilteredBookings({
        minPrice: 0,
        maxPrice: 10,
        subcategory: ["T"],
        minDuration: 1,
        maxDuration: 5,
      });

      expect(mockCollection).toHaveBeenCalledWith(
        expect.any(Object),
        "booking"
      );
      expect(mockWhere).toHaveBeenCalled();
      expect(mockOrderBy).toHaveBeenCalled();
      expect(out).toEqual([
        expect.objectContaining({
          id: "O",
          category: "T",
          time: "D | T",
          location: "S, P",
          price: 7,
          icon: "tool",
          iconFamily: "Feather",
        }),
      ]);
    });

    it("catches errors and returns [] after Alert", async () => {
      const spy = jest.spyOn(require("react-native").Alert, "alert");
      mockGetDocs.mockRejectedValueOnce(new Error("oops"));
      const out = await fetchFilteredBookings({ minPrice: 0, maxPrice: 0 });
      expect(spy).toHaveBeenCalledWith("Error", "Failed to load tasks");
      expect(out).toEqual([]);
    });
  });

  describe("handleSearch()", () => {
    it("filters by category, location or time", () => {
      const data = [
        { category: "Foo", location: "Bar", time: "Baz" },
        { category: "X", location: "Y", time: "Z" },
      ];
      let filtered = null;
      // expose to global so handleSearch can see them
      global.tasks = data;
      global.setFilteredTasks = (v) => (filtered = v);

      handleSearch("oo");
      expect(filtered).toEqual([data[0]]);

      handleSearch("Y");
      expect(filtered).toEqual([data[1]]);

      handleSearch("");
      expect(filtered).toEqual(data);

      // cleanup
      delete global.tasks;
      delete global.setFilteredTasks;
    });
  });
});
