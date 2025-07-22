// /**
//  * @jest-environment jsdom
//  */
// import React from "react";
// import { render, fireEvent, act } from "@testing-library/react-native";
// import UserHome, { shuffleArray } from "../../screen/user_home";
// import { services_categories as realCategories } from "../../constants/category_constant";

// // --- 1) Mocks for all external dependencies ---
// jest.mock("../../components/style_u_home", () => ({
//   colours: { darkest_coco: "#000" },
//   styles: {
//     frame: {},
//     container: {},
//     searchBar: {},
//     searchIcon: {},
//     searchInput: {},
//     suggestionBox: {},
//     suggestionItem: {},
//     suggestionText: {},
//     section: {},
//     sectionTitle: {},
//     iconRow: {},
//     icon: {},
//     circle: {},
//     iconLabel: {},
//     serviceBanner: {},
//     bannerLabel: {},
//   },
// }));
// jest.mock("react-native-safe-area-context", () => ({
//   SafeAreaView: ({ children }) => children,
// }));
// jest.mock("../../components/KeyboardAvoidingWrapper", () => {
//   const React = require("react");
//   return ({ children }) => React.createElement("View", null, children);
// });
// jest.mock("@expo/vector-icons", () => {
//   const React = require("react");
//   const { Text } = require("react-native");
//   return {
//     Feather: () => React.createElement(Text, null, "Feather"),
//     AntDesign: () => React.createElement(Text, null, "AntDesign"),
//     MaterialIcons: () => React.createElement(Text, null, "MaterialIcons"),
//     FontAwesome5: () => React.createElement(Text, null, "FontAwesome5"),
//     FontAwesome6: () => React.createElement(Text, null, "FontAwesome6"),
//     MaterialCommunityIcons: () =>
//       React.createElement(Text, null, "MaterialCommunityIcons"),
//   };
// });
// jest.mock("@react-native-picker/picker", () => {
//   const React = require("react");
//   return {
//     Picker: ({ children }) => React.createElement("Picker", null, children),
//   };
// });
// jest.mock("firebase/firestore", () => ({
//   collection: jest.fn(),
//   query: jest.fn(),
//   where: jest.fn(),
//   getDocs: jest.fn(),
// }));
// jest.mock("../../firebaseConfig", () => ({ db: {} }));
// const navigateMock = jest.fn();
// jest.mock("@react-navigation/native", () => ({
//   useNavigation: () => ({ navigate: navigateMock }),
//   useRoute: () => ({ params: {} }),
// }));

// // --- 2) Stub out your categories to match the shortcuts in UserHome ---
// jest.mock("../../constants/category_constant", () => ({
//   services_categories: [
//     {
//       title: "Cleaning",
//       description: "CleanDesc",
//       price: 10,
//       subcategories: [
//         { label: "Deep Clean", bannerImage: "img-clean.png" },
//         { label: "Quick Clean", bannerImage: "img-quick.png" },
//       ],
//       questions: [],
//     },
//     {
//       title: "Moving",
//       description: "MoveDesc",
//       price: 20,
//       subcategories: [{ label: "Truck Move", bannerImage: "img-move.png" }],
//       questions: [],
//     },
//   ],
// }));

// // --- 3) Tests ---

// describe("shuffleArray()", () => {
//   it("ensure that shuffleArray returns a permutation containing exactly the same items", () => {
//     const arr = [1, 2, 3, 4, 5];
//     const result = shuffleArray(arr);
//     expect(result.sort()).toEqual(arr.sort());
//   });

//   it("check if shuffleArray actually changes order when Math.random is predictable", () => {
//     const seq = [0, 0.5, 0.1, 0.9, 0.2];
//     let idx = 0;
//     jest.spyOn(Math, "random").mockImplementation(() => seq[idx++]);
//     const original = [1, 2, 3];
//     const shuffled = shuffleArray(original);
//     expect(shuffled).not.toEqual(original);
//     Math.random.mockRestore();
//   });
// });

// describe("<UserHome /> interactions", () => {
//   let utils;
//   beforeEach(() => {
//     navigateMock.mockClear();
//     utils = render(<UserHome />);
//   });

//   it("check if component initializes randomBanners containing all subcategory labels", () => {
//     const { getAllByText } = utils;
//     // we stubbed two categories: total subcategories = 3
//     const banners = getAllByText(/Deep Clean|Quick Clean|Truck Move/);
//     expect(banners).toHaveLength(3);
//   });

//   it("check if pressing the 'Cleaning' shortcut navigates with correct params", () => {
//     const btn = utils.getByText("Cleaning");
//     fireEvent.press(btn);
//     expect(navigateMock).toHaveBeenCalledWith("UserBooking", {
//       serviceType: "Cleaning",
//       subcategory: "Deep Clean",
//       description: "CleanDesc",
//       price: 10,
//       questions: [],
//     });
//   });

//   it("check if pressing a service banner calls handleSubcategoryPress with correct params", () => {
//     // pick whichever banner first renders
//     const banner = utils.getByText("Deep Clean");
//     fireEvent.press(banner);
//     expect(navigateMock).toHaveBeenCalledWith("UserBooking", {
//       serviceType: "Cleaning",
//       subcategory: "Deep Clean",
//       description: "CleanDesc",
//       price: 10,
//     });
//   });

//   it("check if typing into search shows matching category suggestions", () => {
//     const input = utils.getByPlaceholderText("Looking for any service?");
//     act(() => fireEvent.changeText(input, "clean"));
//     expect(utils.getByText("Deep Clean (Cleaning)")).toBeTruthy();
//   });

//   it("check if pressing return on empty search does nothing", () => {
//     const input = utils.getByPlaceholderText("Looking for any service?");
//     act(() => fireEvent(input, "submitEditing"));
//     expect(navigateMock).not.toHaveBeenCalled();
//   });

//   it("check if submitting a category search navigates correctly", () => {
//     const input = utils.getByPlaceholderText("Looking for any service?");
//     act(() => fireEvent.changeText(input, "moving"));
//     act(() => fireEvent(input, "submitEditing"));
//     expect(navigateMock).toHaveBeenCalledWith("UserBooking", {
//       serviceType: "Moving",
//       subcategory: "Truck Move",
//       description: "MoveDesc",
//       price: 20,
//     });
//   });

//   it("check if submitting a subcategory search navigates correctly", () => {
//     const input = utils.getByPlaceholderText("Looking for any service?");
//     act(() => fireEvent.changeText(input, "quick"));
//     act(() => fireEvent(input, "submitEditing"));
//     expect(navigateMock).toHaveBeenCalledWith("UserBooking", {
//       serviceType: "Cleaning",
//       subcategory: "Quick Clean",
//       description: "CleanDesc",
//       price: 10,
//     });
//   });
// });
