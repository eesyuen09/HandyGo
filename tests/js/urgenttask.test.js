import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

// Mock React-Navigation hooks before importing anything
jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(() => ({ params: {} })),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useFocusEffect: (cb) => cb(),
}));

// Mock Firestore API
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

// Mock auth
jest.mock("../../firebaseConfig", () => ({
  db: {},
  auth: { currentUser: { uid: "user-uid" } },
}));

// Mock lodash.debounce to identity
jest.mock("lodash", () => ({
  debounce: (fn) => fn,
}));

// Now import the helpers under test
import {
  fetchFilteredBookings,
  fetchUrgentTasks,
  handleSearch,
  getIcon,
  renderIcon,
} from "../../screen/biz_urgenttask";

describe("urgenttask helpers", () => {
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
      ["SomethingElse", { name: "wrench", family: "MaterialCommunityIcons" }],
    ])("returns %p → %j", (serviceType, expected) => {
      expect(getIcon(serviceType)).toEqual(expected);
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
      // our mock icon returns a <Text> with the family name
      expect(getByText(fam)).toBeTruthy();
    });

    it("falls back on unknown family to Feather", () => {
      const { getByText } = render(renderIcon("x", "NoSuchFamily", "c", 5));
      expect(getByText("Feather")).toBeTruthy();
    });
  });

  describe("fetchFilteredBookings()", () => {
    const fakeDocs = (ids, datas) =>
      ids.map((id, i) => ({ id, data: () => datas[i] }));
    it("builds two queries & returns intersected formatted results", async () => {
      // two snapshots: priceSnap and durationSnap share only id2
      mockGetDocs
        .mockResolvedValueOnce({ docs: fakeDocs(["id1", "id2"], [{}, {}]) })
        .mockResolvedValueOnce({
          docs: fakeDocs(
            ["id2", "id3"],
            [
              {
                type: "T",
                serviceType: "Repair",
                availability: [{ date: "D", time: "T" }],
                price: 5,
                orderID: "O",
                postcode: "P",
                state: "S",
                duration: 2,
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

      // expect we called collection, where, orderBy twice
      expect(mockCollection).toHaveBeenCalledWith(
        expect.any(Object),
        "booking"
      );
      expect(mockWhere).toHaveBeenCalled();
      expect(mockOrderBy).toHaveBeenCalled();

      // result should only include the "id2" entry formatted
      expect(out).toEqual([
        expect.objectContaining({
          id: "O",
          category: "T",
          time: "D | T",
          location: "S, P",
          price: 5,
          icon: "tool", // from getIcon("Repair")
          iconFamily: "Feather",
        }),
      ]);
    });

    it("catches errors, alerts and returns empty", async () => {
      const spyAlert = jest.spyOn(require("react-native").Alert, "alert");
      mockGetDocs.mockRejectedValueOnce(new Error("fail"));
      const out = await fetchFilteredBookings({ minPrice: 0, maxPrice: 0 });
      expect(spyAlert).toHaveBeenCalledWith("Error", "Failed to load tasks");
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
      // inject as globals so handleSearch picks them up
      global.tasks = data;
      global.setFilteredTasks = (v) => {
        filtered = v;
      };

      // call directly
      handleSearch("oo");
      expect(filtered).toEqual([data[0]]);
      handleSearch("Y");
      expect(filtered).toEqual([data[1]]);
      handleSearch("");
      expect(filtered).toEqual(data);

      // clean up
      delete global.tasks;
      delete global.setFilteredTasks;
    });
  });
});
